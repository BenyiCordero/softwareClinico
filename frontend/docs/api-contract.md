# Frontend API Contract

## Base URL

The frontend reads `VITE_API_URL` from the environment. The value must include
the backend global prefix:

```text
http://localhost:3000/api/v1
```

The backend uses `httpOnly` cookies for authentication, so every request that
uses the API client must send credentials.

## Success responses

Normal responses have this shape:

```ts
{
  success: true
  data: T
  timestamp: string
}
```

Paginated responses have this shape:

```ts
{
  success: true
  data: T[]
  pagination: {
    type: 'OFFSET' | 'CURSOR'
    // Offset-specific or cursor-specific fields
  }
  timestamp: string
}
```

The TypeScript definitions live in `src/types/api.ts`.

## Error responses

```ts
{
  success: false
  statusCode: number
  message?: string | string[]
  timestamp: string
  path: string
}
```

The UI must distinguish authentication errors (`401`) from authorization errors
(`403`). A `401` may trigger a controlled refresh flow. A `403` must be shown as
an authorization failure and must not trigger refresh.

## Data conventions

- IDs are numeric values.
- Date and timestamp fields cross the HTTP boundary as ISO strings.
- PostgreSQL `numeric(14,2)` values may arrive as strings.
- Backend enum values must be sent exactly as defined by the backend.
- Unknown request properties are rejected by the backend validation pipe.
- `204 No Content` mutations do not return a response body.
- Branch-scoped requests send `x-branch-id` when a branch is selected.

## Branches and permissions

The active branch is sent through:

```http
x-branch-id: 12
```

Effective permissions are loaded through:

```text
GET /api/v1/users/:userId/permissions?branchId=12
```

Permission codes use the backend format:

```text
resource.action
```

Examples:

```text
patients.read
appointments.create
clinical-records.read
users.manage_roles
```

The frontend uses permissions only to control visibility and user experience.
The backend remains the authoritative authorization layer and validates every
protected request independently.

## Initial endpoint groups

The first frontend integration will target the currently exposed API groups:

- `/auth`
- `/users`
- `/people`
- `/branches`
- `/areas`
- `/consulting-rooms`
- `/positions`
- `/employees`
- `/health-professionals`
- `/specialties`
- `/service-categories`
- `/services`
- `/patient-categories`
- `/price-lists`
- `/patient-special-prices`
- `/payment-method`

Clinical workflows such as patients, appointments, consultations, prescriptions
and orders require backend controllers before their frontend pages are built.
