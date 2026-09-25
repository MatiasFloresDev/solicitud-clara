# Cómo explicaría Solicitud Clara en la entrevista

Esta es una guía para practicar, no un texto para leer palabra por palabra. Antes de la entrevista, abre el proyecto y haz el recorrido una vez tú mismo.

## Versión corta, de unos tres minutos

**Inicio.** «Este es un proyecto personal que armé para practicar documentación y desarrollo web. Pensé en una empresa pequeña que recibe pedidos como “quiero una página web”, pero antes de programar necesita saber exactamente qué debe hacer esa página».

**Muestra la bandeja.** «Cada pedido se registra como una solicitud. Aquí puedo ver quién lo hizo, qué necesita y en qué estado está. Voy a abrir este ejemplo de un estudio jurídico».

**Abre la solicitud “Web de presentación para estudio jurídico”.** «Esta parte es lo que dijo el cliente. No lo mezclo con los requisitos, porque primero quiero conservar su problema tal como lo explicó».

**Pulsa “Iniciar análisis”.** Escribe algo sencillo:

- Requisito: «El visitante puede enviar una consulta desde el formulario de contacto».
- Criterio: «Si completa nombre, correo y consulta, al enviarlo ve una confirmación».

Después pulsa **Guardar análisis** y **Marcar lista**. «Separé el requisito de la forma de comprobarlo. La API no deja marcar la solicitud como lista si falta uno de los dos».

**Muestra una historia de usuario.** Abre [HU-03](historias-de-usuario.md#hu-03-documentar-solicitud). «También escribí historias de usuario, un caso de uso y las reglas de cambio de estado. Así puedo relacionar lo que se pidió, lo que hace la aplicación y lo que habría que probar».

**Cierre.** «El frontend está hecho con React y TypeScript. La API está en Java con Spring Boot y guarda los datos en H2 para que pueda mostrarlo localmente. Es un prototipo: el cambio de vista entre cliente y analista todavía no es un login real».

## Si solo te dan un minuto

«Solicitud Clara es un proyecto personal para practicar análisis de requisitos. Un cliente registra lo que necesita; el analista escribe requisitos y criterios de aceptación; luego la solicitud pasa a lista para desarrollo. Lo importante para mí era que la documentación estuviera conectada con una app que realmente respetara esas reglas. Usé React para las pantallas, Spring Boot para la API y H2 para guardar los datos en la demo».

## Qué significa cada término

| Término | Cómo lo explicaría |
| --- | --- |
| Requisito funcional | Algo que el sistema debe permitir hacer. Ejemplo: enviar una consulta. |
| Criterio de aceptación | Una forma concreta de comprobar el requisito. Ejemplo: después de enviar un formulario válido, aparece una confirmación. |
| Historia de usuario | Una frase que dice quién necesita algo, qué necesita y para qué. |
| API | La parte que recibe lo que envía la pantalla, aplica reglas y consulta o guarda datos. |
| JPA | Una herramienta de Java que ayuda a guardar objetos en tablas de la base de datos. |
| H2 | La base de datos local que elegí para que la demo arranque sin instalar PostgreSQL. |

## Si te piden enseñar el código

- [`App.tsx`](../frontend/src/App.tsx): contiene las pantallas y las llamadas a la API.
- [`RequestController.java`](../backend/src/main/java/pe/com/solicitudclara/api/RequestController.java): recibe las solicitudes y los cambios de estado.
- [`ServiceRequest.java`](../backend/src/main/java/pe/com/solicitudclara/api/ServiceRequest.java): guarda los campos y contiene las reglas del flujo.
- [`DemoData.java`](../backend/src/main/java/pe/com/solicitudclara/api/DemoData.java): carga los tres ejemplos ficticios.

No necesitas explicar cada línea. Sigue un solo ejemplo: haces clic en **Marcar lista**, el frontend llama a la API, la API comprueba que haya requisitos y criterios, guarda el nuevo estado y devuelve la solicitud actualizada.

## Preguntas que podrían hacerte

**¿Por qué hiciste este proyecto?** «Quería practicar algo que vemos en la carrera: pasar de una idea general a requisitos que otra persona pueda desarrollar y probar. También quería conectar esa documentación con frontend y backend».

**¿Por qué hay tres estados?** «Para saber si el pedido apenas llegó, si todavía se está definiendo o si ya tiene información suficiente para que lo tome desarrollo».

**¿Qué pasa si faltan criterios de aceptación?** «No se puede marcar como lista. Esa regla está en el backend, así que también se aplica si alguien llama a la API sin usar la pantalla».

**¿Por qué H2?** «Para mostrar la demo en mi laptop sin configurar otro servidor. Para una versión real usaría una base más apropiada, como PostgreSQL, y probaría la migración».

**¿Hay usuarios y permisos reales?** «No. El selector de cliente y analista es solo para enseñar el flujo. Antes de usar datos reales tendría que agregar autenticación y autorización».

**¿Usaste IA?** Responde con honestidad. Una forma de decirlo es: «Sí, la usé como apoyo para avanzar en el prototipo. Yo elegí el problema que quería mostrar y revisé el flujo y la documentación. Puedo explicar qué hace cada parte y qué le falta». Usa esta respuesta solo después de haber revisado y probado el proyecto tú mismo.

## Antes de conectarte a Jitsi

1. Enciende backend y frontend con las instrucciones del [README](../README.md).
2. Comprueba que ves tres solicitudes. Si el ejemplo del estudio jurídico ya no está en **Recibida** porque lo usaste para practicar, registra una solicitud nueva.
3. Deja abiertas la aplicación, la historia HU-03 y este guion.
4. Haz un ensayo sin leer el texto. Si una frase no te sale natural, cámbiala por tus palabras.
