"""
GridNest — Root URL Configuration
===================================
This file is the main entry point for all HTTP requests.
Django reads this list top-to-bottom and uses the FIRST matching pattern.

URL structure for GridNest API:
  /admin/                  → Django admin panel
  /api/auth/               → Authentication (login, register, token refresh)
  /api/properties/         → Property listings (Phase 3)
  /api/bookings/           → Viewing bookings (Phase 5)

We use `include()` to delegate each group of URLs to its own urls.py file.
This keeps each feature self-contained and easy to maintain.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static  # serves uploaded media files in dev

urlpatterns = [
    # ─── Django Admin Panel ────────────────────────────────────────
    # Auto-generated admin dashboard at /admin/
    path('admin/', admin.site.urls),

    # ─── API Routes ────────────────────────────────────────────────
    # Each app manages its own URLs in its own urls.py file.
    # We'll uncomment these as we build each phase.

    # Phase 2: Authentication endpoints (login, register, JWT tokens)
    path('api/auth/', include('apps.accounts.urls')),

    # Phase 3: Property listing endpoints
    path('api/properties/', include('apps.properties.urls')),

    # Phase 5: Booking endpoints
    path('api/bookings/', include('apps.bookings.urls')),

    # Phase 7: Chat endpoints
    path('api/chat/', include('apps.chat.urls')),

# ─── Media Files (Development only) ───────────────────────────
# In development, Django serves uploaded files (property images etc.)
# In production, a proper web server (Nginx) handles this instead.
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
