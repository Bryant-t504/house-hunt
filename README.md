# 🏠 GridNest

**A PropTech house-hunting platform connecting students, tenants, and landlords.**

GridNest makes it easy to list properties, search for housing, book viewings,
and manage rental relationships — all in one place.

---

## 🛠 Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React (Vite)                      |
| Backend    | Django + Django REST Framework     |
| Database   | PostgreSQL                        |
| Auth       | JWT (djangorestframework-simplejwt)|

---

## 📦 Project Structure

```
GridNest/
├── backend/          # Django API server
│   ├── gridnest/     # Project config (settings, urls)
│   └── apps/         # Feature modules (accounts, properties, etc.)
├── frontend/         # React client app
│   └── src/          # Components, pages, services
├── .gitignore
└── README.md
```

---

## 🚀 Development Phases

- [x] **Phase 1:** Project setup & folder architecture (Django + React + Tailwind)
- [x] **Phase 2:** Authentication system (tenant, landlord, admin roles)
- [x] **Phase 3:** Property listing CRUD (Create, Read, Update, Delete)
- [x] **Phase 4:** Search & filter system (Backend filtering + Frontend UI)
- [x] **Phase 5:** Viewing booking feature (Tenant requests + Landlord approval)
- [x] **Phase 6:** Admin verification dashboard (Trust & security layer)
- [x] **Phase 7:** Real-time chat system (Direct messaging between users)

---

## ✅ MVP Complete
The initial roadmap for GridNest is now fully implemented.

## 🧪 How to Run (will be updated each phase)

**Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
python manage.py runserver
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## 👥 Roles

| Role     | Description                              |
|----------|------------------------------------------|
| Tenant   | Searches listings, books viewings        |
| Landlord | Creates/manages property listings        |
| Admin    | Verifies landlords, moderates platform   |

---

## 📄 License

This project is for educational and portfolio purposes.
