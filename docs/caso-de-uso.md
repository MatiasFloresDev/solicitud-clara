# Caso de uso UC-03 Documentar una solicitud

**Actor principal:** analista funcional.

**Objetivo:** transformar la descripción libre del cliente en requisitos y criterios de aceptación, y dejar la solicitud preparada para desarrollo.

**Precondiciones:** existe una solicitud en estado **Recibida**. El analista está usando la vista de demostración correspondiente. La versión actual no autentica usuarios.

## Flujo principal

1. El analista abre la bandeja y selecciona una solicitud.
2. El sistema muestra la descripción original, los datos de contacto y el estado.
3. El analista selecciona **Iniciar análisis**.
4. El sistema cambia el estado a **En análisis**.
5. El analista redacta requisitos funcionales y criterios de aceptación.
6. El analista selecciona **Guardar análisis**.
7. El sistema conserva ambos campos y actualiza la fecha de modificación.
8. El analista selecciona **Marcar lista**.
9. El sistema verifica que ambos campos tengan contenido y cambia el estado a **Lista para desarrollo**.

**Postcondición:** la solicitud conserva la necesidad original, los requisitos, los criterios y el estado final. El análisis se presenta en modo de lectura.

## Flujos alternativos

- **A1. Datos de análisis incompletos:** en el paso 8, si falta uno de los dos campos, el sistema rechaza el cambio. La solicitud permanece **En análisis**.
- **A2. Estado incompatible:** si se intenta iniciar análisis desde otro estado, la API responde con conflicto 409.
- **A3. Solicitud inexistente:** si el identificador no existe, la API responde 404.
- **A4. Error de conexión:** la interfaz muestra un mensaje y conserva el texto que el analista estaba editando para reintentar.

## Decisión de diseño

Se mantiene separada la necesidad original del cliente del análisis del equipo. Así se puede revisar si un requisito responde realmente al problema expresado y si cada criterio permite comprobar el resultado.
