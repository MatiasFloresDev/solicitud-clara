# Solicitud Clara

Soy estudiante de sexto ciclo de Ingeniería de Sistemas de Información en la UPC. Armé este proyecto personal para practicar una parte que me interesa de la carrera: tomar una necesidad contada de manera informal, escribir requisitos claros y conectarlos con una aplicación que funcione.

El caso es ficticio. Imaginé una pequeña empresa que recibe pedidos para crear sitios web o sistemas internos. Antes de empezar a programar, necesita entender qué pide cada cliente y cómo comprobar que el trabajo quedó bien.

## Qué hace

1. Un cliente registra una solicitud y explica su problema.
2. El analista revisa la solicitud y escribe requisitos funcionales.
3. El analista agrega criterios de aceptación: condiciones concretas para comprobar el resultado.
4. La solicitud pasa de **Recibida** a **En análisis** y luego a **Lista para desarrollo**. La API no permite saltarse pasos ni marcarla lista si faltan requisitos o criterios.

La bandeja permite buscar y filtrar solicitudes. Los datos se guardan en una base local, así que siguen ahí al reiniciar la aplicación.

## Con qué lo hice

| Parte | Tecnología | Para qué la usé |
| --- | --- | --- |
| Pantallas | React, TypeScript y Vite | Formulario, bandeja y detalle |
| API | Java 17 y Spring Boot 3.5 | Recibir datos y validar el flujo |
| Datos | JPA y H2 | Guardar solicitudes localmente |
| Pruebas | JUnit y MockMvc | Comprobar el flujo y los datos inválidos |

Elegí H2 para que la demo funcione en una laptop sin instalar un servidor de base de datos. Si el proyecto creciera, evaluaría PostgreSQL.

## Documentación

Preparé estos archivos para que se vea cómo pasé de la idea a los requisitos:

- [Alcance y requisitos](docs/alcance-y-requisitos.md)
- [Historias de usuario](docs/historias-de-usuario.md)
- [Caso de uso del análisis](docs/caso-de-uso.md)
- [Arquitectura y API](docs/arquitectura.md)
- [Guion para explicar el proyecto](docs/guion-entrevista.md)

## Cómo ejecutarlo en Windows

Necesitas Java 17 y Node.js compatible con Vite 8. Abre dos terminales desde la carpeta del proyecto.

Terminal 1:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Terminal 2:

```powershell
cd frontend
npm ci
npm run dev
```

Después entra a [http://localhost:5173](http://localhost:5173). La API se ejecuta en el puerto 8080. En la primera ejecución aparecen tres solicitudes ficticias.

Para correr las pruebas:

```powershell
cd backend
.\mvnw.cmd test
```

Para comprobar que el frontend compila:

```powershell
cd frontend
npm run build
```

## Qué falta

El botón para cambiar entre «Cliente» y «Analista» solo sirve para la demo. **Todavía no hay inicio de sesión ni permisos reales.** Tampoco hay archivos adjuntos, notificaciones ni despliegue público. No usaría esta versión con datos de clientes reales.
