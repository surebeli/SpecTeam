<!-- Spec Normalized Document -->
# Payment System Architecture — Bob's Proposal

## Architecture Decision
Use one monolithic payment service to keep deployment and debugging simple for a three-person backend team.

## Data Storage
Store payments, refunds, and audit data in one PostgreSQL schema.

## Security
Target PCI DSS Level 2 and rely on provider tokenization for card data.
