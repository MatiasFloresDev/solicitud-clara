# Arquitectura y contrato de API

## Vista general

```mermaid
flowchart LR
    U[Cliente o analista en modo demo] --> R[React y TypeScript]
    R -->|HTTP JSON| A[Spring Boot REST]
    A --> B[Reglas de estado y validación]
    B --> J[Spring Data JPA]
    J --> H[(H2 local)]
```

La pantalla envía peticiones a `/api`. Durante el desarrollo, Vite las dirige al backend. Spring Boot aplica las reglas y guarda los datos en `backend/data/`. La demo no necesita servicios en la nube.

## Modelo principal

`ServiceRequest` contiene: `id`, `clientName`, `company`, `email`, `serviceType`, `title`, `description`, `status`, `requirements`, `acceptanceCriteria`, `createdAt` y `updatedAt`.

Por ahora guardo los requisitos y criterios como texto, una línea por punto. Si continuara el proyecto, los separaría en registros individuales para poder asignar prioridad y llevar un historial.

## Estados

```mermaid
stateDiagram-v2
    [*] --> RECIBIDA: registrar solicitud
    RECIBIDA --> EN_ANALISIS: iniciar análisis
    EN_ANALISIS --> LISTA_PARA_DESARROLLO: requisitos y criterios completos
```

La API impide saltar estados. Una transición inválida devuelve HTTP 409.

## Endpoints

| Método | Ruta | Uso | Respuesta |
| --- | --- | --- | --- |
| GET | `/api/requests` | Listar por actualización reciente | 200 |
| GET | `/api/requests/{id}` | Consultar detalle | 200 o 404 |
| POST | `/api/requests` | Crear solicitud | 201 o 400 |
| POST | `/api/requests/{id}/analysis` | Iniciar análisis | 200, 404 o 409 |
| PUT | `/api/requests/{id}/analysis` | Guardar requisitos y criterios | 200, 400, 404 o 409 |
| POST | `/api/requests/{id}/ready` | Confirmar lista para desarrollo | 200, 404 o 409 |

Ejemplo de creación:

```json
{
  "clientName": "Ana Pérez",
  "company": "Panadería Ana",
  "email": "ana@ejemplo.com",
  "serviceType": "Comercio digital",
  "title": "Pedidos en línea",
  "description": "Necesito recibir pedidos y confirmar el total."
}
```

Ejemplo de análisis:

```json
{
  "requirements": "El cliente puede agregar productos al pedido.",
  "acceptanceCriteria": "Al confirmar, el sistema muestra el total correcto."
}
```

## Decisiones y límites

- **H2 local:** me permite iniciar la demo sin configurar PostgreSQL.
- **Sin autenticación:** el selector de roles solo sirve para mostrar el flujo. No protege datos; sería lo primero que añadiría antes de usar datos reales.
- **Validación en backend:** aunque alguien no use la pantalla, la API comprueba los campos y el orden de estados.
