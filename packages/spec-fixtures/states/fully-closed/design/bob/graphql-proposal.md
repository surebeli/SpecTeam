<!-- Spec Normalized Document -->
# User Service API Design

## Architecture Approach
REST is the primary public contract for the User Service API, with GraphQL available only as a compatibility layer for flexible client queries.

## Endpoints
- `GET /api/v1/users/{id}`
- `POST /api/v1/users`
- `PUT /api/v1/users/{id}`

## Compatibility Layer
GraphQL mirrors the REST resources for clients that need selective field fetching, but it no longer defines the primary API direction.
