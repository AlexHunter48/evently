# EVENTLY — Backend API Production Ecosystem 🚀

Evently is a high-performance, secure backend REST API tailored for digital event creation, ticket reservation inventories, role-isolated event modeling, and secure webhook-validated payment verification flows. Built as a collaborative engineering capstone, the platform uses an enterprise Node.js/Express ESM architecture integrated with a distributed MongoDB Atlas cluster, stateful JSON Web Tokens (JWT) role authorization, and Paystack financial webhooks.

---

## Engineering Team & Core Architecture Map

The platform infrastructure was constructed across a parallel production pipeline distributed among 9 engineers, categorized into 6 tactical runtime phases:

| Phase | Module | Assigned Engineer(s) | Architecture Dependencies & Guardrails |
| :--- | :--- | :--- | :--- |
| **Phase 1** | Authentication & User Management | Alex | Core Foundation (`/api/auth`, `/api/user`). Implements `guest` and `organizer` state tokens. |
| **Phase 2** | Event Management Engine | **Courage** | Requires Phase 1. Handles strict ownership loops for creating/modifying event payloads. |
| **Phase 2** | Ticketing & Inventory Booking | **Samuel** | Public access tier. Automated capacity countdowns; prevents event overselling anomalies. |
| **Phase 3** | Payment Integration & Hooks | **Access** | Integrates Paystack engine initialization and secure automated server webhooks. |
| **Phase 4** | QR Code Validation | **Zomzom** | Automated generation downstream from a validated `completed` payment ledger. |
| **Phase 4** | Automated Notifications | **Jet** | Dispatches purchase confirmations, receipts, and codes asynchronously via Nodemailer. |
| **Phase 5** | Admin Dashboard Aggregation | **Amara** | Management oversight portal querying multi-collection aggregation pipelines. |
| **Phase 5** | Interactive Polling & Voting | **Smash** | Implements attendee-locked award nomination systems and event feedback loops. |
| **Phase 6** | DevOps, Git Strategy & Delivery | **John Ibe** | **Continuous Integration / Active Pipeline Cloud Deployment Infrastructure Lead.** |

---

## Technology Stack & Engine Environments
* **Runtime Environment:** Node.js v24+ (ESM Module Syntax)
* **Application Framework:** Express.js 
* **Database Engine:** MongoDB Atlas Cluster (Distributed Shard-Set Replica Set)
* **Object Data Modeling (ODM):** Mongoose v8+
* **Cryptography & Web Security:** JSON Web Tokens (JWT), Bcrypt.js, HMAC SHA512 Cryptographic Handshakes

---

## Local Development Environment Setup

### 1. Clone the Ecosystem Repository
git clone [https://github.com/AlexHunter48/evently.git](https://github.com/AlexHunter48/evently.git)
cd evently

### 2. Dependency Resolution
Initialize and resolve the collective dependency manifest:

npm install

### 3. Environment Configuration File (.env)
Create an isolated .env file at the root repository directory using the structural template mapped below. For local isolation, do not push this file to GitHub (.gitignore enforced):

# Server Pipeline Configuration
PORT=3000

# Database Connection (MongoDB Atlas URI string format)
MONGO_DB_URL=mongodb+srv://<db_username>:<db_password>@cluster0.mongodb.net/evently?retryWrites=true&w=majority

# Cryptography Secret Key for Token-signing Verification
JWT_SECRET=your_super_secret_jwt_signing_key_here

# Paystack Payment Gateway API Authentication
PAYSTACK_SECRET_KEY=sk_test_your_private_paystack_key_here

# Nodemailer SMTP Automation Credentials
EMAIL_USER=your_automated_notification_email@gmail.com
EMAIL_PASS=your_secure_smtp_app_password_here

### 4. Initialize Local Instances
Bash
# Production Run
npm start

## Development Engine Monitoring (If nodemon is configured)
npm run dev
📡 Complete Production API Routing Infrastructure Architecture
All interface interaction models process payloads formatted purely in application-layer JSON. Headers securing protected endpoint spaces expect the following format: Authorization: Bearer <JWT_TOKEN>.

### 1. Authentication Engine (/api/auth)
POST /api/auth/register - Registers system actors. Instantiates default guest role status.

POST /api/auth/login - Validates credentials via Bcrypt and dispenses state tokens containing the user model payload (id, username, role).

### 2. User Directory & Profile Center (/api/user & /api/users)
GET /api/user/me - Protected. Resolves and validates the current token payload for client dashboards.

GET /api/user/allusers - Protected. Pulls a full collection manifest indexing registered app records.

POST /api/users/save-event/:eventId (or /api/events/:eventId/save) - Protected (Guest Only). Appends an target Event ID references onto the user's savedEvents array.

DELETE /api/events/:eventId/save - Protected (Guest Only). Splices an event array pointer to bookmark-clear.

GET /api/users/saved-events - Protected (Guest Only). Returns user-bookmarked events with multi-field references.

### 3. Event Scheduling Directory Engine (/api/events)
GET /api/events - Public access router querying active listings. Supports query param parameters: ?search=, ?category=, ?location=, ?eventType=, ?status=.

GET /api/events/:id - Resolves the comprehensive data schema footprint of a distinct scheduled event entity.

POST /api/events - Protected (Organizer Only). Creates new event payloads. Validates that the cumulative ticket type counts match the global capacity parameter.

PATCH /api/events/:id - Protected (Organizer Only). Allows partial overrides on open parameters. Strictly locked to the event's designated creator entity.

DELETE /api/events/:id - Protected (Organizer Only). Clears event records and sets relational dependencies to Cancelled states.

GET /api/events/organizer/:organizerId - Streams listings filtered under a designated promoter account.

GET /api/events/my-events - Protected (Organizer Only). Fetches all historical creations mapped to the requesting profile token.

### 4. Public Ticket Booking Registry (/api/tickets)
No authorization barriers are enforced on purchasing pipelines—designed for fluid consumer access.

POST /api/tickets/buy - Registers a guest order. Checks remaining seats to prevent overselling anomalies, auto-updating the parent model status flag to Sold Out if capacity drops to zero.

GET /api/tickets/my-tickets - Indexes comprehensive transaction orders sorted by chronological timestamp metrics.

GET /api/tickets/:ticketCode - Queries a precise ticket layout receipt by parsing standard codes (TKT-YEAR-XXXXXX).

PATCH /api/tickets/:ticketCode/cancel - Cancels an un-used pass reservation, dynamically returning inventory metrics to the parent event bucket capacity.

### 5. Financial Webhook Network & Orders Pipeline (/api/webhook & /api/order)
POST /api/order/initialize - Instantiates transaction records with Paystack, generating an outbound active paymentLink and transaction reference.

GET /api/order/:reference - Resolves processing parameters (pending, completed, failed) linked to a transaction payment token.

POST /api/webhook/paystack - Automated Ingress Routing. Webhook interface parsing automated verification streams from Paystack payment gateways.

Cryptographic Guardrail: Middleware validates inbound payloads using an HMAC SHA512 signature hash to prevent fraudulent payment generation actions.

### 6. QR Code Generation & Entry Validation (`/api/qr`)
All endpoints are fully authenticated and require a signed user JWT string passed via headers (`Authorization: Bearer <JWT_TOKEN>`).

* **`POST /api/qr/generate`** - *User Dashboard Action.* Extracts ticket details, validates ownership, and transforms data components into a secure Base64 image data-string (`data:image/png;base64,...`) for instant frontend image rendering.
* **`POST /api/qr/verify`** - *Organizer/Staff Scanner Tool.* Read-only gatekeeper diagnostic lookup. Decodes QR information payloads to check validity, status indicators, and attendee names without mutating database models.
* **`POST /api/qr/checkin`** - *Organizer/Staff Scanner Tool.* Execution gate mutation layer. Marks state arrays as used inside Ticket and Order collections simultaneously, appending an immutable `checkedInAt` ISO timestamp to defeat gate-fraud or ticket re-use attempts.

### 7. Interactive Polling & Event Voting System (/api/voting)
POST /api/voting/events/:eventId/polls - Protected (Organizer Only). Initializes a new interactive event poll (Supports nominee or survey layout models).

POST /api/voting/polls/:pollId/options - Protected (Organizer Only). Appends string option choices or candidate configurations into a targeting poll database schema.

PATCH /api/voting/polls/:pollId/close - Protected (Organizer Only). Terminates voting pipelines, triggering calculations and flipping the visibility switch on aggregate data displays.

GET /api/voting/polls/:pollId/results - Protected (Organizer Only). Pulls calculated data matrices sorted from highest to lowest vote thresholds. (Locked until closed).

GET /api/voting/events/:eventId/polls - Protected (Attendee Only). Displays active running polls for real-time engagement processing.

POST /api/voting/polls/:pollId/vote - Protected (Attendee Only). Records an attendee vote.

Business Layer Restrictions: Ensures the requesting user token possesses a completed transaction order, verified event check-in status, and has zero prior entries submitted for the active poll index.

### DevOps Continuous Integration & Quality Guardrails
To preserve architecture integrity across rapid, asynchronous codebase delivery, the platform repository followed a strict continuous delivery pattern:

Feature Decoupling: Workflows were separated into isolated branches (feature/devops-setup, feature/event-management) to keep work distinct.

Merge Conflict Resolution: Branch overlaps within key integration modules (like src/routes and index.js) were safely audited and unified locally before delivery using downstream fast-forward synchronization methods.

Production Isolation: Local deployment operations use protected .env variables that are explicitly isolated from the shared repository code via .gitignore. Production deployment environments run inside secure, cloud-hosted containers with encrypted runtime variable injection.
