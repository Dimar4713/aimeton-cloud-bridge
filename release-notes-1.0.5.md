# AIMETON Cloud Bridge 1.0.5

## Fixed

- Fixed a stale file row remaining visible after successful deletion.
- Prevented a repeated delete attempt from returning HTTP 404 for an already deleted resource.
- Invalidated the list cache before refreshing after delete, create, move, and copy operations.
- Awaited directory refreshes after mutating operations for more reliable mobile behavior.
