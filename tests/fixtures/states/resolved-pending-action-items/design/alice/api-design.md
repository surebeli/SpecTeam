<!-- Spec Normalized Document -->
# User Service API Design

## Architecture Approach
REST remains the default public interface for the User Service API.

## Endpoints
- `GET /api/v1/users/{id}`
- `POST /api/v1/users`
- `PUT /api/v1/users/{id}`

## Data Fetching
Related resources are exposed through separate REST endpoints.
