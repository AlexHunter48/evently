# EVENTLY — Backend API Ecosystem

Evently is a high-performance, secure backend REST API tailored for digital event creation, ticket reservation management, and secure webhook-validated transaction flows. Designed as a collective capstone project, the system utilizes a modern Node.js/Express ESM architecture, integrated with MongoDB Atlas for persistent global storage, JWT access tokens for stateful security roles, and Paystack for real-time transactional webhooks.

---

## Developers Team & Core Architecture

The infrastructure was constructed across a parallel development pipeline distributed among 9 Developers, categorized into 6 tactical runtime phases:

| Phase | Module | Assigned Dev(s) | Architecture Dependencies |
| :--- | :--- | :--- | :--- |
| **Phase 1** | Authentication & User Management | **Smash** | Base Foundation (JWT, Crypto Cryptography Hooks) |
| **Phase 2** | Event Management | **Courage** | Requires Phase 1 (Organizer Role Isolation) |
| **Phase 2** | Ticketing & Booking | **Samuel** | Requires Event Instances & Inventory Thresholds |
| **Phase 3** | Payment Integration (Paystack) | **Access & Alex** | Requires Ticketing Hookups & Webhook Middleware |
| **Phase 4** | QR Code & Verification | **Zomzom** | Triggers upon validated Payment Ledger status |
| **Phase 4** | Automated Notifications | **Jet** | Asynchronous execution via Nodemailer event streams |
| **Phase 5** | Management Dashboard Analytics | **Amara** | Multi-collection pipeline aggregation layers |
| **Phase 6** | DevOps, Git Integration & Deployment | **John** | **Continuous Integration / Active Pipeline Deployment Lead** |

---

## Technology Stack & Engine Environments
* **Runtime Environment:** Node.js v24+
* **Backend Application Framework:** Express.js (ECMAScript Modules - ESM)
* **Database Engine:** MongoDB Atlas Cluster (Distributed Shard-Set Replica)
* **Object Data Modeling (ODM):** Mongoose v8+
* **Cryptography & Token Security:** JSON Web Tokens (JWT) & Bcrypt.js

---

## Local Development Installation Blueprint

### 1. Clone the Ecosystem Repository

git clone [https://github.com/AlexHunter48/evently.git](https://github.com/AlexHunter48/evently.git)
cd evently

### 2. Dependency Resolution
Initialize and resolve the collective dependency manifest:

npm install

### 3. Environment Variables Key Configuration (.env)
Create a .env file at the root root directory and insert the active cluster production environment keys

### 4. Initialize Core Server
Launch your local runtime instance server:

node index.js

---

## Complete REST API Routing Infrastructure Map

All endpoint interfaces expect payloads formatted purely in standard application-layer JSON. Headers processing protected routes require the format: Authorization: Bearer <JWT_TOKEN>.

### 1. Authentication Layer (/api/auth)
* POST /api/auth/register - Registers system actors. Instantiates default roles (Attendee, Organizer, Admin).

* POST /api/auth/login - Validates user hashes and dispenses short-lived access JWT tokens.

### 2. Profile Management Directory (/api/user)
* GET /api/user/profile - Resolves the logged-in user profile payload.

* PUT /api/user/update - Modifies secure metadata values for authenticated users.

### 3. Event Scheduling Engine (/api/events)
* GET /api/events - Public access route querying all active scheduled events (returns count metadata and entity arrays).

* POST /api/events - Restricted to Organizers. Publishes fresh event specs onto the schema layout.

* PUT /api/events/:id - Restricted to Organizers. Patch or override parameters of a designated event.

* DELETE /api/events/:id - Restricted to Organizers. Destroys an event listing and cancels structural dependent ticket slots.

### 4. Ticketing, Reservation & Booking (/api/tickets)
* POST /api/tickets/book - reserves ticket instances. Locks current transaction inventory counters.

* GET /api/tickets/my-tickets - Fetches authenticated transaction passes held by a specific consumer.

* DELETE /api/tickets/cancel/:id - Triggers ticket voiding flows. Re-allocates seats dynamically back into the parent event bucket.

### 5. Financial Webhook Gateways (/api/webhook)
* POST /api/webhook/paystack - Multi-tier ingress endpoint listening to Paystack financial networks.

* Security Protocol: Routed via a custom cryptographic parser verifyWebhook to confirm authorization origin, intercepting false payload attempts before processing event code.

### 6. Transaction Orders (/api/order)
* GET /api/order/history - Fetches systemic breakdown of historical financial order metrics.

### 7. Notifications Relay (/api/notifications)
* POST /api/notifications/broadcast - Internal event trigger routing asynchronous transactional email receipts using automated Nodemailer instances.

### 8. Interactive Features & Dashboard Monitoring (/api/voting & Admin Controls)
* POST /api/voting/cast - Registers consumer feedback votes and event ratings metrics.

* GET /admin/users - Restricted to Admins. Access analytics tracking system-wide consumer profiles.

* GET /admin/events - Restricted to Admins. Central oversight and modification interface monitoring collective event publishing metrics.

---

## DevOps Continuous Integration & Quality Guardrails

* To preserve structural logic integrity across the rapid, asynchronous codebase assembly, the platform was maintained under a strict continuous integration protocol:

* Isolation Branches Execution: Feature teams decoupled tasks out of standard operational nodes (feature/event-management, feature/payment-verification, etc.).

* Pre-Integration Sanity Checks: Run standard module testing verifying local environment compiles (npm install -> node index.js) prior to final merging blocks.

* Collision Avoidance Resolvers: Upstream integration conflicts inside index.js were monitored and reconciled safely using fast-forward downstream sync patterns (git checkout --theirs .) to guarantee maximum operational up-time.