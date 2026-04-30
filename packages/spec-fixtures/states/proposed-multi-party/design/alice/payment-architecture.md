<!-- Spec Normalized Document -->
# Payment System Architecture — Alice's Proposal

## Architecture Decision
Use a microservices architecture with separate services for gateway routing, Stripe, PayPal, and crypto.

## Data Storage
Each service owns its own PostgreSQL data and uses Redis for payment-status caching.

## Security
Require PCI DSS Level 1 compliance and never store raw card numbers.
