# Solicitud Clara

Portal de demostración para registrar solicitudes de servicios digitales y convertir una necesidad del cliente en requisitos verificables. Está preparado para presentar tanto el trabajo de documentación funcional como una implementación frontend/backend.

## Qué funciona

- Registro de una solicitud con datos de contacto, tipo de servicio y descripción del problema.
- Bandeja con búsqueda, filtro por estado y detalle de cada solicitud.
- Flujo **Recibida → En análisis → Lista para desarrollo**.
- Redacción de requisitos funcionales y criterios de aceptación. La API impide finalizar el análisis si faltan.
- Persistencia local: los cambios siguen disponibles al reiniciar la aplicación.
- Vistas de demostración de cliente y analista.

Los datos iniciales son ficticios. La vista de cliente representa a Lucía Torres, de Café del Parque. El cambio de vista es solo para explicar el flujo: **esta demo no implementa autenticación ni control de acceso**. No debe exponerse como servicio público con datos reales.

## Tecnologías

| Capa | Tecnología | Función |
| --- | --- | --- |
| Interfaz | React, TypeScript, Vite | Formularios, bandeja, detalle y estados |
| API | Java 17, Spring Boot 3.5 | Validación y reglas del flujo |
| Datos | Spring Data JPA, H2 | Persistencia local para la demo |
| Pruebas | JUnit, MockMvc | Flujo de la API y validación |

## Cómo ejecutarlo en Windows

Se necesitan Java 17 y Node.js compatible con Vite 8. Usa dos terminales:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

```powershell
cd frontend
npm ci
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173). El frontend usa un proxy local hacia la API en el puerto 8080. La primera ejecución carga tres casos ficticios. La base se guarda en `backend/data/` y está excluida de Git.

Para verificar:

```powershell
cd backend
.\mvnw.cmd test
```

```powershell
cd frontend
npm run build
```

## Documentación del proyecto

- [Alcance y requisitos](docs/alcance-y-requisitos.md)
- [Historias de usuario y trazabilidad](docs/historias-de-usuario.md)
- [Caso de uso del análisis](docs/caso-de-uso.md)
- [Arquitectura y contrato de API](docs/arquitectura.md)
- [Guion breve para la entrevista](docs/guion-entrevista.md)

## Recorrido sugerido

1. En la bandeja, abre una solicitud recibida.
2. Inicia el análisis y redacta requisitos y criterios de aceptación.
3. Guarda y marca la solicitud lista para desarrollo.
4. Registra una solicitud nueva para enseñar el flujo desde la vista del cliente.
5. Muestra en la documentación la historia de usuario, el caso de uso y la regla de transición correspondiente.

## Límites conocidos

El alcance se concentra en el análisis inicial. No incluye inicio de sesión real, notificaciones, archivos adjuntos, edición de datos de contacto ni despliegue en producción. Antes de usarlo con clientes reales harían falta autorización por rol, migraciones de base de datos, medidas de privacidad y pruebas adicionales.
