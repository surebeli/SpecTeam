<!-- Spec Normalized Document -->
# User Service API Design

## Architecture Approach
Keep REST as the primary public interface for the user-service API.

## Endpoints
- `GET /api/v1/users/{id}`
- `POST /api/v1/users`
- `PUT /api/v1/users/{id}`

## Data Fetching
Client-specific aggregation can happen in downstream services without changing the REST contract.
