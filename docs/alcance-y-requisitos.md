# Alcance y requisitos de Solicitud Clara

## Situación que imaginé

Para este ejercicio pensé en una empresa pequeña que recibe pedidos por mensajes. Alguien puede escribir «necesito una web», pero todavía faltan detalles para que un desarrollador sepa qué hacer. Mi objetivo fue guardar primero lo que dijo el cliente y después escribir requisitos y criterios para comprobar el resultado. No entrevisté a un cliente real; los ejemplos son ficticios.

## Usuarios

- **Cliente:** registra la necesidad y consulta su estado.
- **Analista funcional:** revisa la solicitud, escribe requisitos y criterios, y confirma que esté lista para desarrollo.

En la demo, la interfaz permite alternar entre vistas para explicar ambos puntos de vista. La vista de cliente muestra el caso ficticio de Lucía Torres. No existe identidad verificada ni autorización real.

## Alcance funcional implementado

| Código | Requisito | Evidencia |
| --- | --- | --- |
| RF-01 | Registrar una solicitud con contacto, organización, tipo, título y descripción | Formulario de nueva solicitud y `POST /api/requests` |
| RF-02 | Consultar y filtrar solicitudes por estado | Bandeja y `GET /api/requests` |
| RF-03 | Abrir el análisis de una solicitud recibida | Detalle y `POST /api/requests/{id}/analysis` |
| RF-04 | Guardar requisitos y criterios de aceptación | Editor y `PUT /api/requests/{id}/analysis` |
| RF-05 | Marcar lista una solicitud documentada | Acción y `POST /api/requests/{id}/ready` |

## Reglas de negocio

1. Una solicitud nace en estado **Recibida**.
2. Solo una solicitud recibida puede pasar a **En análisis**.
3. Los requisitos y criterios solo se editan durante **En análisis**.
4. Ambos campos deben tener contenido para pasar a **Lista para desarrollo**.
5. Una solicitud lista queda en modo de lectura en esta versión.

La API comprueba estas reglas. La pantalla también desactiva las acciones que todavía no corresponden.

## Requisitos no funcionales para la demo

- La interfaz debe ser legible en escritorio y móvil y mostrar foco de teclado.
- Los cambios se conservan tras reiniciar la API.
- La API devuelve 400 ante datos inválidos, 404 para un ID inexistente y 409 ante una transición de estado no permitida.
- La demo debe poder iniciarse localmente sin servicios externos.

## Fuera de alcance

No incluí login, permisos reales, notificaciones, adjuntos, presupuesto ni despliegue público. Me concentré en que el recorrido desde el pedido hasta los requisitos funcionara bien.
