<!-- Spec Normalized Document -->
# User Service API Design

## Architecture Approach
Use a traditional RESTful API for the public user-service contract.

## Endpoints
- `GET /api/v1/users/{id}`
- `POST /api/v1/users`
- `PUT /api/v1/users/{id}`

## Data Fetching
Related resources are fetched through separate REST endpoints to keep caching simple.
