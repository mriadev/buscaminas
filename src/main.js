import { buscaminas } from "./buscaminas.js";

document.addEventListener("DOMContentLoaded", function () {

    let firstClick = true;
    const dificultad = document.querySelector("select");
    let tiempo = document.getElementById("tiempo");
    buscaminas.init('facil');
    let tablero = document.querySelector("#tablero");
    let fin = document.querySelector("div");
    tiempo.innerHTML = 0;
    let temporizador;
    let record = document.getElementById("record");


    document.querySelector("select").addEventListener("change", function () {
        tablero.innerHTML = "";
        buscaminas.init(dificultad.value);
        document.getElementById("minasRestantes").innerHTML = buscaminas.banderas;
        tiempo.innerHTML = 0;
        firstClick = true;
        clearInterval(temporizador);
        dibujarTablero(tablero, dificultad.value);
    });

    dibujarTablero(tablero, dificultad.value);
    let fila = 0;
    let columna = 0;

    tablero.addEventListener("click", handleClick);

    tablero.addEventListener("auxclick", marcar);

    tablero.addEventListener("contextmenu", function (e) {
        e.preventDefault();
    });

    fin.querySelector("button").addEventListener("click", function () {
        location.reload();
    })

    function handleClick(e) {
        if (firstClick) {
            temporizador = setInterval(function () {
                tiempo.innerHTML++;
            }, 1000);
            firstClick = false;
        }
        [fila, columna] = e.target.dataset.fila_colum.split("_");
        let resultado = buscaminas.picar(fila, columna);
        finalizar(resultado);
        let casilla;
        resultado = buscaminas.mostrarTableroJuego();
        buscaminas.posicionesLevantadas.forEach(function (posicion) {
            let [fila, columna] = posicion;
            casilla = document.querySelector(`div[data-fila_colum="${fila}_${columna}"]`);
            desbloquear(fila, columna, casilla);
        });

    }

    function marcar(e) {
        [fila, columna] = e.target.dataset.fila_colum.split("_");
        let resultado;
        if (e.buttons == 0) {
            buscaminas.marcar(fila, columna);
            resultado = buscaminas.mostrarTableroJuego();
            for (let f = 0; f < buscaminas.filas; f++) {
                for (let c = 0; c < buscaminas.columnas; c++) {
                    let casilla = document.querySelector(`div[data-fila_colum="${f}_${c}"]`);
                    if (resultado[f][c] == "🚩") {
                        casilla.innerHTML = "🚩";
                    }
                    if (resultado[f][c] == undefined || resultado[f][c] == "") {
                        casilla.innerHTML = "";
                    }
                }
            }
            document.getElementById("minasRestantes").innerHTML = buscaminas.banderas;
        }
        if (e.button == 2 && e.buttons == 1) {
            resultado = buscaminas.despejar(fila, columna);
            finalizar(resultado);
            buscaminas.posicionesLevantadas.forEach(function (posicion) {
                let [fila, columna] = posicion;
                let casilla = document.querySelector(`div[data-fila_colum="${fila}_${columna}"]`);
                desbloquear(fila, columna, casilla);
            }
            );
            
        }
        document.querySelector("span").textContent = buscaminas.banderas;
    }

    function dibujarTablero(tablero, dificultad) {
        let contador = 0;
        let fila = 0;
        let columna = 0;
        do {
            let div = document.createElement("div");
            div.dataset.fila_colum = `${fila}_${columna}`;

            switch (dificultad) {
                case "facil":
                    div.style.height = "60px";
                    break;
                case "medio":
                    div.style.height = "35px";
                    break;
                case "dificil":
                    div.style.height = "24px";
                    break;
            }

            if (columna % 2 == 0) {
                div.style.backgroundColor = (fila % 2 == 0) ? "#AAD751" : "#83aa34";
            } else {
                div.style.backgroundColor = (fila % 2 == 0) ? "#83aa34" : "#AAD751";
            }
            tablero.appendChild(div);

            contador++;
            if (contador % buscaminas.columnas == 0) {
                fila++;
                columna = 0;
            } else {
                columna++;

            }
        } while (contador != (buscaminas.filas * buscaminas.columnas));

        tablero.style.display = "grid";
        tablero.style.gridTemplateColumns = `repeat(${buscaminas.columnas}, 1fr)`;
        tablero.style.gridTemplateRows = `repeat(${buscaminas.filas}, 1fr)`;
        tablero.style.margin = "0 auto";
    }

    function finalizar(resultado) {
        if (resultado == false) {
            buscaminas.mostrarMinas();
            resultado = buscaminas.mostrarTableroJuego();
            for (let f = 0; f < buscaminas.filas; f++) {
                for (let c = 0; c < buscaminas.columnas; c++) {
                    let casilla = document.querySelector(`div[data-fila_colum="${f}_${c}"]`);
                    if (resultado[f][c] == "💣") {
                        casilla.innerHTML = "💣";
                    }
                }
            }

            fin.classList.remove("oculto");
            fin.querySelector("p").innerHTML = "¡Has perdido!";
            console.log("Has perdido");
            fin.classList.add("reinicio");
            tablero.removeEventListener("click", handleClick);
            tablero.removeEventListener("auxclick", marcar);
            clearInterval(temporizador);

        } else if (resultado == true) {
            tablero.removeEventListener("click", handleClick);
            tablero.removeEventListener("auxclick", marcar);
            fin.classList.remove("oculto");
            clearInterval(temporizador);
            let tiempo = document.getElementById("tiempo").innerHTML;
            let tiempoRecord = localStorage.getItem("tiempo");
            if (tiempoRecord == null || tiempo < tiempoRecord) {
                localStorage.setItem("tiempo", tiempo);
                tiempoRecord = localStorage.getItem("tiempo");
            }
            fin.classList.add("reinicio");
            fin.querySelector("p").innerHTML = "¡Has ganado!";
            record.innerHTML = "El tiempo record es: " + tiempoRecord;

            console.log("Has ganado");
        }

    }

function desbloquear(f, c, casilla) {
    if (buscaminas.tablero[f][c] == 0) {
        desbloquearCasillas();
    } else if (buscaminas.tablero[f][c] > 0) {
        switch (buscaminas.tablero[f][c]) {
            case 1:
                casilla.classList.add("casilla_destapada_uno");
                break;

            case 2:
                casilla.classList.add("casilla_destapada_dos");
                break;

            case 3:
                casilla.classList.add("casilla_destapada_tres");
                break;
            case 4:
                casilla.classList.add("casilla_destapada_cuatro");
            default:
                break;
        }

        desbloquearCasillas();
        casilla.innerHTML = buscaminas.tablero[f][c];
    }

    function desbloquearCasillas() {
        if (c % 2 == 0) {
            casilla.innerHTML = "";
            casilla.style.backgroundColor = (f % 2 == 0) ? "#f9e9ae" : "#f7d796";
        } else {
            casilla.style.backgroundColor = (f % 2 == 0) ? "#f7d796" : "#f9e9ae";
        }
    }
}
});



