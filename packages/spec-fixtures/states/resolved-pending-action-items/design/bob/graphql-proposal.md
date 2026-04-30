<!-- Spec Normalized Document -->
# User Service API Design

## Architecture Approach
GraphQL is currently described as the primary public contract for the User Service API.

## Schema
The API should expose a `User` query and a user-creation mutation through GraphQL.

## Data Fetching
One GraphQL request should fetch a user and all related posts in a single round-trip.
