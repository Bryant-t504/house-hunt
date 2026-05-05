# 🏗️ GridNest SaaS Database Architecture (PostgreSQL)

This document defines the **production-grade database design** for GridNest, a PropTech SaaS platform connecting tenants, landlords, and administrators.

The schema is designed for:

* scalability
* data integrity
* real-time features (chat, notifications)
* maintainability

---

# 🧠 Design Principles

* **Normalization First**: Avoid redundant data
* **Strong Relationships**: Enforce foreign keys
* **Scalability**: Optimized for PostgreSQL
* **Security Awareness**: Role-based control enforced at backend
* **Auditability**: Track critical actions (verification, reports)

---

# 🧍 1. Users Table

```sql
users
- id (PK)
- username (UNIQUE)
- email (UNIQUE)
- password_hash
- phone_number
- role (tenant, landlord, admin, super_admin)
- is_verified
- is_active
- last_login
- last_active
- created_at
- updated_at
```

### Notes:

* Role must NOT be user-editable
* Used across all modules

---

# 🏠 2. Properties Table

```sql
properties
- id (PK)
- landlord_id (FK → users.id)
- title
- description
- location
- price
- bedrooms
- bathrooms
- property_type (apartment, house, studio, room)
- status (active, hidden, pending, occupied)
- is_verified
- created_at
- updated_at
```

### Notes:

* `status` replaces `is_available`
* Controlled visibility and lifecycle

---

# 🖼️ 3. Property Images

```sql
property_images
- id (PK)
- property_id (FK)
- image_url
- created_at
```

---

# 🧱 4. Amenities (Many-to-Many)

```sql
amenities
- id (PK)
- name (UNIQUE)
```

```sql
property_amenities
- property_id (FK)
- amenity_id (FK)

PRIMARY KEY (property_id, amenity_id)
```

---

# 📅 5. Bookings

```sql
bookings
- id (PK)
- property_id (FK)
- tenant_id (FK → users.id)
- booking_date
- message
- status (pending, approved, rejected, cancelled, completed)
- created_at
- updated_at
```

### Notes:

* Landlord derived from property
* Avoids duplication and inconsistency

---

# 💬 6. Conversations (Chat Context)

```sql
conversations
- id (PK)
- property_id (FK)
- tenant_id (FK)
- landlord_id (FK)
- created_at
- updated_at

UNIQUE(property_id, tenant_id, landlord_id)
```

### Notes:

* Prevents duplicate chat threads
* Links chat to specific property

---

# 💬 7. Messages

```sql
messages
- id (PK)
- conversation_id (FK)
- sender_id (FK)
- content
- is_read
- created_at
```

### Notes:

* No receiver_id (prevents data inconsistency)

---

# 🔔 8. Notifications

```sql
notifications
- id (PK)
- user_id (FK)
- type (booking, message, verification, system)
- message
- booking_id (FK NULL)
- conversation_id (FK NULL)
- property_id (FK NULL)
- is_read
- created_at
```

### Notes:

* Linked to system entities for context

---

# 🚨 9. Reports

```sql
reports
- id (PK)
- reporter_id (FK → users.id)
- property_id (FK)
- type (fraud, spam, misleading, other)
- reason
- status (pending, reviewed, resolved)
- admin_response
- created_at
- resolved_at
```

---

# 🛡️ 10. Verification Logs

```sql
verification_logs
- id (PK)
- admin_id (FK → users.id)
- property_id (FK)
- action (approved, rejected)
- reason
- created_at
```

---

# 🧱 11. Soft Delete Strategy

To prevent data loss:

```sql
is_deleted BOOLEAN DEFAULT FALSE
```

Apply to:

* users
* properties
* bookings
* conversations
* messages

---

# ⚡ 12. Indexing Strategy

```sql
CREATE INDEX idx_property_location ON properties(location);
CREATE INDEX idx_property_price ON properties(price);
CREATE INDEX idx_booking_property ON bookings(property_id);
CREATE INDEX idx_messages_convo_time ON messages(conversation_id, created_at);
CREATE INDEX idx_user_role ON users(role);
```

---

# 🔗 Relationship Overview

```
User (landlord) → Properties
User (tenant) → Bookings

Property → Bookings
Property → Conversations → Messages

User → Conversations
User → Messages

Property ↔ Amenities

Admin → Verification Logs
User → Reports
User → Notifications
```

---

# 🚨 Critical Constraints

* Enforce UNIQUE on conversations
* Use foreign keys with proper ON DELETE rules
* Avoid redundant fields (e.g. landlord_id in bookings)
* Enforce role validation at backend level

---

# 🧠 Final Notes

This architecture is designed to:

* support real-time chat systems
* scale with PostgreSQL
* maintain strong data integrity
* enable SaaS-level features (analytics, moderation, notifications)

---

# 🏁 Verdict

This is a **production-ready relational database design** suitable for a modern PropTech SaaS platform.

Further improvements depend on:

* query optimization
* caching strategies
* API efficiency
* infrastructure scaling
