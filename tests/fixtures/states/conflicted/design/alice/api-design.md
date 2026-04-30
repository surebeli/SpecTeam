<!-- Spec Normalized Document -->
# User Service API Design

## Architecture Approach
We should use a traditional RESTful architecture for the User Service API.

## Endpoints
- `GET /api/v1/users/{id}` to fetch user details
- `POST /api/v1/users` to create a new user
- `PUT /api/v1/users/{id}` to update a user

## Data Fetching
Related data should be fetched with separate REST endpoints to avoid over-fetching.
