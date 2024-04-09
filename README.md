# Tarea 6.2 Buscaminas (DOM-presentación)

## Autora: María Cervilla Alcalde

Entrega en este repositorio SOLO SI tienes aprobada la entrega anterior

Añade a la versión anterior del buscaminas el entorno gráfico trabajando con el árbol DOM.

1. Cuando se pierda:
    1. Se descubrirán las bombas de forma ordenada
    2. Aparecerá un diálogo que lo indique con la posibilidad de iniciar otra partida
2. Cuando se gane:
    1. Aparecerá un diálogo con el tiempo y el récord con la posibilidad de iniciar otra partida
3. Usa la delegación de eventos para las casillas (picar, marcar y despejar)
4. Conforme sea necesario se irán suprimiendo los manejadores de eventos de las casillas
5. Prohibido usar el id. Los eventos del ratón han de manejarse a través del evento o del objeto this. 
6. Utiliza las clases para los estilos: .classList.add(), .classList.remove(), .className...
7. Como siempre evita la globalidad, y por supuesto, no puede haber información de la solución al usuario final
8. Todas las casillas del buscaminas han de ser creadas de forma dinámica.
9. Puedes utilizar las excepciones para trabajar con los datos necesarios en cada caso

        try{
            buscaminas.picar()
        } catch (error) { 
            if (error instanceof EncontradaMinaError) {
                            ... 
                            }
        }