<!-- Spec Normalized Document -->
# User Service API Design

## Architecture Approach
We should adopt GraphQL for the User Service API as the primary client contract.

## Schema
The public API should expose a `User` query and user-creation mutation through GraphQL.

## Data Fetching
A single request should fetch a user and their related posts in one round-trip.
