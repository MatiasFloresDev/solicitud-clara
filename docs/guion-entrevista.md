# Guion de tres minutos para la entrevista

Este guion es una base. Léelo, comprueba cada afirmación en la aplicación y exprésalo con tus propias palabras.

## 0:00–0:35 Problema y propósito

«Preparé Solicitud Clara, un portal para organizar solicitudes de servicios digitales. La idea nace de un problema común: un cliente explica lo que quiere en un mensaje libre, pero todavía faltan requisitos precisos y una forma de comprobar si el resultado cumple lo esperado».

## 0:35–1:15 Flujo del cliente

Abre **Nueva solicitud**. Explica los campos y registra un ejemplo ficticio. Muestra que queda en estado **Recibida**.

«Separé los datos de contacto de la necesidad. Así el analista conserva el contexto original antes de proponer una solución».

## 1:15–2:15 Trabajo del analista

Abre la nueva solicitud. Selecciona **Iniciar análisis**, escribe dos requisitos y dos criterios, guarda y marca lista.

«La API controla el orden de estados. No permite pasar a desarrollo si faltan requisitos o criterios de aceptación».

## 2:15–2:45 Documentación y tecnología

Abre `docs/historias-de-usuario.md` y `docs/caso-de-uso.md`. Señala HU-03 y el flujo alternativo A1. Explica que la interfaz está hecha con React y TypeScript, la API con Java y Spring Boot, y la demo guarda los datos en H2 local.

## 2:45–3:00 Aprendizaje y límite

«Este proyecto me permitió conectar análisis funcional con una implementación comprobable. Para usarlo en producción, el siguiente paso sería incorporar autenticación, permisos por rol y una base de datos gestionada».

## Preguntas posibles

**¿Por qué criterios de aceptación?** Porque convierten un requisito en una condición que se puede verificar. Evitan que «funciona» signifique cosas distintas para cliente y equipo.

**¿Por qué H2 y no PostgreSQL?** Para que la demo local arranque sin configurar un servidor. El modelo usa JPA, por lo que el cambio a PostgreSQL es viable, pero requeriría configuración y pruebas de migración.

**¿La vista de cliente es segura?** No. Es un modo de demostración y está señalado en la interfaz y el README. No se debe usar con datos reales ni publicarse como servicio de clientes sin autenticación y autorización.

**¿Qué hiciste tú?** Responde con precisión sobre las decisiones que revisaste y el trabajo que puedas explicar. Si usaste asistencia de IA, puedes decirlo y centrarte en cómo validaste requisitos, funcionamiento y límites. No atribuyas experiencia que no puedas defender.
