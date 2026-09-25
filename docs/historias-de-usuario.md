# Historias de usuario y trazabilidad

## HU-01 Registrar necesidad

**Como** cliente, **quiero** describir mi necesidad y dejar mis datos de contacto **para** que un analista pueda revisarla.

**Criterios de aceptación**

- Dado un formulario válido, cuando registro la solicitud, el sistema crea un identificador y la deja en estado **Recibida**.
- Dado un correo inválido o un campo obligatorio vacío, cuando intento registrarla, el sistema rechaza la operación.

**Trazabilidad:** RF-01 · Formulario «Nueva solicitud» · `POST /api/requests`.

## HU-02 Revisar bandeja

**Como** analista, **quiero** buscar y filtrar solicitudes **para** priorizar las que necesitan análisis.

**Criterios de aceptación**

- La bandeja muestra título, organización, tipo de servicio y estado.
- El filtro de estado y la búsqueda reducen la lista sin modificar los registros.

**Trazabilidad:** RF-02 · Bandeja · `GET /api/requests`.

## HU-03 Documentar solicitud

**Como** analista, **quiero** registrar requisitos funcionales y criterios de aceptación **para** que el equipo de desarrollo entienda qué construir y cómo comprobarlo.

**Criterios de aceptación**

- Solo puedo iniciar análisis desde **Recibida**.
- Durante **En análisis** puedo guardar requisitos y criterios.
- El detalle conserva la necesidad original del cliente junto al análisis.

**Trazabilidad:** RF-03, RF-04 · Detalle · `POST /api/requests/{id}/analysis`, `PUT /api/requests/{id}/analysis`.

## HU-04 Confirmar preparación

**Como** analista, **quiero** marcar una solicitud como lista **para** indicar que el análisis inicial tiene información comprobable.

**Criterios de aceptación**

- Si faltan requisitos o criterios, la API rechaza el cambio de estado.
- Si ambos están registrados, el estado pasa a **Lista para desarrollo** y el análisis se muestra como lectura.

**Trazabilidad:** RF-05 · Detalle · `POST /api/requests/{id}/ready`.

## Nota de validación

La prueba `RequestFlowTest` recorre HU-01, HU-03 y HU-04, incluida la transición inválida. La búsqueda y los filtros de HU-02 se comprobaron en la interfaz.
