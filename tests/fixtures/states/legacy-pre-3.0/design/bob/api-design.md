<!-- Spec Normalized Document -->
# User Service API Design

## Architecture Approach
Use GraphQL as the primary client-facing contract for user data.

## Data Fetching
One request should fetch a user and related records in a single round-trip.
