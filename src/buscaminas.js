/**
 * @file
 * @author María Cervilla Alcalde
 *
 */

export const buscaminas = {
    init: (dificultad) => {
        buscaminas.dificultad(dificultad);
        buscaminas.casillasLevantadas = 0;
        buscaminas.generarMinas();
        buscaminas.generarTableroJuego();
        buscaminas.mostrar();
        buscaminas.posicionesLevantadas = [];
    },
    dificultad: (dificultad) => {
        switch (dificultad) {
            case 'facil':
                buscaminas.filas = 8;
                buscaminas.columnas = 10;
                buscaminas.minas = 10;
                buscaminas.banderas = 10;
                break;
            case 'medio':
                buscaminas.filas = 14;
                buscaminas.columnas = 18;
                buscaminas.minas = 40;
                buscaminas.banderas = 40;
                break;
            default:
                //dificultad dificil
                buscaminas.filas = 20;
                buscaminas.columnas = 24;
                buscaminas.minas = 99;
                buscaminas.banderas = 99;
                break;
        }
    }
    ,
    mostrar: () => {
        console.table(buscaminas.tablero);
    },
    mostrarTableroJuego: () => {
        return buscaminas.tableroJuego;
    },

    mostrarMinas: () => {
        for (let i = 0; i < buscaminas.filas; i++) {
            for (let j = 0; j < buscaminas.columnas; j++) {
                if (buscaminas.tablero[i][j] == -1) {
                    buscaminas.tableroJuego[i][j] = "💣";
                }

            }
        }
        buscaminas.mostrarTableroJuego();
    }
    ,
    picar: (fila, columna) => {
        fila = parseInt(fila);
        columna = parseInt(columna);
        if (buscaminas.tableroJuego[fila][columna] != -2) {
            if (buscaminas.tableroJuego[fila][columna] != "🚩") {
                if (buscaminas.tablero[fila][columna] == -1) return false;
                buscaminas.tableroJuego[fila][columna] = -2; //marcar casilla como levantada
                buscaminas.casillasLevantadas++;
                if (buscaminas.casillasLevantadas >= (buscaminas.filas * buscaminas.columnas - buscaminas.minas)) {
                    buscaminas.mostrarTableroJuego();
                    return true;
                }
                buscaminas.posicionesLevantadas.push([fila, columna]);
                if (buscaminas.tablero[fila][columna] == 0) {
                    for (let f = Math.max(0, fila - 1); f <= Math.min(buscaminas.filas - 1, fila + 1); f++) {
                        for (let c = Math.max(0, columna - 1); c <= Math.min(buscaminas.columnas - 1, columna + 1); c++) {

                            if (buscaminas.tableroJuego[f][c] == undefined && buscaminas.tablero[f][c] == 0) { //si la casilla no está levantada
                                buscaminas.tableroJuego[f][c] = 0;
                                buscaminas.posicionesLevantadas.push([f, c]);
                                buscaminas.picar(f, c);
                            } else if (buscaminas.tableroJuego[f][c] == undefined && buscaminas.tablero[f][c] != -1) {
                                buscaminas.posicionesLevantadas.push([f, c]);
                                buscaminas.casillasLevantadas++;
                                buscaminas.tableroJuego[f][c] = buscaminas.tablero[f][c];
                            } else if (buscaminas.tableroJuego[f][c] == undefined && buscaminas.tablero[f][c] == -1) {
                                buscaminas.mostrarMinas();
                                return false;
                            }
                        }

                    }
                }
            }
        }
        buscaminas.mostrarTableroJuego();
    },
    marcar: (fila, columna) => {
        if (buscaminas.tableroJuego[fila][columna] == undefined) {
            buscaminas.tableroJuego[fila][columna] = "🚩";
            buscaminas.banderas--;
        } else if (buscaminas.tableroJuego[fila][columna] === "🚩") {
            buscaminas.tableroJuego[fila][columna] = undefined;
            buscaminas.banderas++;

        }

        buscaminas.mostrarTableroJuego();
    },
    despejar: (fila, columna) => {
        fila = parseInt(fila);
        columna = parseInt(columna);
        let numBanderasAlrededor = 0;
        for (let f = Math.max(0, fila - 1); f <= Math.min(buscaminas.filas - 1, fila + 1); f++) {
            for (let c = Math.max(0, columna - 1); c <= Math.min(buscaminas.columnas - 1, columna + 1); c++) {
                if (buscaminas.tableroJuego[f][c] == "🚩") {
                    numBanderasAlrededor++;
                }
            }
        }
        if (numBanderasAlrededor == buscaminas.tablero[fila][columna]) {
            for (let f = Math.max(0, fila - 1); f <= Math.min(buscaminas.filas - 1, fila + 1); f++) {
                for (let c = Math.max(0, columna - 1); c <= Math.min(buscaminas.columnas - 1, columna + 1); c++) {
                    console.log(buscaminas.tablero[f][c]);
                    if (buscaminas.tablero[f][c] == -1) {
                        buscaminas.mostrarMinas();
                        return false;
                    }
                    //si se levantan todas las casillas
                    if (buscaminas.casillasLevantadas >= (buscaminas.filas * buscaminas.columnas - buscaminas.minas)) {
                        buscaminas.mostrarTableroJuego();
                        return true;

                    }
                    if (buscaminas.tableroJuego[f][c] == undefined) {
                        buscaminas.picar(f, c);
                    }

                }

            }

        }

        buscaminas.mostrarTableroJuego();

    },
    generarMinas: () => {
        buscaminas.tablero = Array(buscaminas.filas).fill(0).map(() => Array(buscaminas.columnas).fill(0));
        buscaminas.posicionMinas = [];
        let f, c;
        for (let mina = 0; mina < buscaminas.minas; mina++) {
            do {
                f = Math.floor(Math.random() * buscaminas.filas);
                c = Math.floor(Math.random() * buscaminas.columnas);
            } while (buscaminas.tablero[f][c] == -1);
            buscaminas.tablero[f][c] = -1;
            buscaminas.posicionMinas.push([f, c]);

            for (let i = Math.max(0, f - 1); i <= Math.min(buscaminas.filas - 1, f + 1); i++) {
                for (let j = Math.max(0, c - 1); j <= Math.min(buscaminas.columnas - 1, c + 1); j++) {
                    if (buscaminas.tablero[i][j] != -1) {
                        buscaminas.tablero[i][j]++;
                    }
                }

            }

        }


    },
    generarTableroJuego: () => {
        buscaminas.tableroJuego = Array(buscaminas.filas).fill(undefined).map(() => Array(buscaminas.columnas).fill(undefined));
    }


}

