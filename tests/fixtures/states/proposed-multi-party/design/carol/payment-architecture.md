<!-- Spec Normalized Document -->
# Payment System Architecture — Carol's Proposal

## Architecture Decision
Use an event-driven Lambda workflow coordinated by EventBridge and Step Functions.

## Supported Methods
Handle cards and digital wallets through Stripe, but drop PayPal because of Lambda latency concerns.

## Data Storage
Use DynamoDB for payment records and S3 for receipts and audit logs.
