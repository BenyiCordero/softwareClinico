# CLI Module

Runs administrative commands through a Nest application context without starting the HTTP server.

> **Status:** Internal operations tooling.

## Create Initial Administrator

```bash
npm run create-admin
```

Required environment variables:

| Variable | Purpose |
|---|---|
| `ADMIN_EMAIL` | Initial administrator login |
| `ADMIN_PASSWORD` | Password to hash and persist |
| `ADMIN_PERSON_ID` | Existing person to link the account |
| `ADMIN_ROLE_ID` | Existing ACTIVE role to assign (should include `users.manage`) |
| `ADMIN_USERNAME` | Optional username (defaults to the email prefix) |
| `ADMIN_BRANCH_ID` | Optional branch scope for the role assignment |

Database, bcrypt and the other globally validated API variables must also be valid because the command boots the configured Nest context.

## Behavior

1. Start `CliModule` and connect required providers.
2. Check for an existing user with the configured email.
3. If one exists, log a warning and exit without changes.
4. Otherwise create the user (bcrypt-hashed password, ACTIVE status) and assign the given role through the normal user service path.
5. Close the application context.

The command is intentionally idempotent for repeated deployment runs, but it does not update or reset an existing administrator.

## Notes

- The person (`ADMIN_PERSON_ID`) and role (`ADMIN_ROLE_ID`) must already exist. Bootstrap the base catalog (permissions, roles, person) before running this script, or use the API once an initial account is available.
- Password must meet the same strength rules as the API `CreateUserDto` (8–30 chars).

## Security

- Do not commit real admin credentials to `.env.example` or source control.
- Prefer injected deployment secrets over long-lived plaintext files.
- Rotate/remove bootstrap credentials after provisioning when the deployment platform allows it.
- Use normal authenticated user-management endpoints for later account changes.

## Implementation Map

| Path | Responsibility |
|---|---|
| `cli.module.ts` | Providers required by command contexts |
| `scripts/create-admin.ts` | Idempotent administrator bootstrap |