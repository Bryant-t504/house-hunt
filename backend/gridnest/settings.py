"""
GridNest - Django Settings
==========================
This file controls every major behaviour of the Django application:
security, installed apps, database, auth, file uploads, and more.

We use `python-decouple` to read sensitive values from the .env file
so we never hardcode secrets in source code.
"""

from pathlib import Path
from decouple import config          # reads values from .env
from datetime import timedelta       # used to set JWT token expiry times

# ─────────────────────────────────────────────────────────────
# PATHS
# BASE_DIR points to the `backend/` folder.
# All other paths are built relative to it.
# ─────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent


# ─────────────────────────────────────────────────────────────
# SECURITY
# These values come from the .env file — never hardcode them!
# ─────────────────────────────────────────────────────────────
SECRET_KEY = config('SECRET_KEY')          # cryptographic key for sessions/tokens
DEBUG = config('DEBUG', default=False, cast=bool)  # False in production!
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost').split(',')


# ─────────────────────────────────────────────────────────────
# INSTALLED APPS
# Django only knows about packages listed here.
# - Django built-ins come first
# - Then third-party packages
# - Then our own apps (we'll add them in Phase 2+)
# ─────────────────────────────────────────────────────────────
INSTALLED_APPS = [
    'daphne',                         # For WebSockets (must be at the top)
    # --- Django built-in apps ---
    'django.contrib.admin',           # The /admin dashboard
    'django.contrib.auth',            # User accounts & permissions
    'django.contrib.contenttypes',    # Tracks models across apps
    'django.contrib.sessions',        # Session management
    'django.contrib.messages',        # One-time flash messages
    'django.contrib.staticfiles',     # Serving CSS/JS/images

    # --- Third-party packages ---
    'rest_framework',                 # Django REST Framework (DRF) — builds our API
    'rest_framework_simplejwt',       # JWT authentication tokens
    'corsheaders',                    # Allows React frontend to call our API

    # --- GridNest feature apps (added as we build each phase) ---
    'apps.accounts',               # Phase 2: Authentication
    'apps.properties',             # Phase 3: Property listings
    'apps.bookings',               # Phase 5: Viewing bookings
    'apps.chat',                   # Phase 7: Real-time chat
    'channels',                       # Real-time WebSocket support
    'django_filters',                 # For search and filtering
]


# ─────────────────────────────────────────────────────────────
# MIDDLEWARE
# These run on EVERY request/response like a pipeline.
# Order matters — CORS must be at the very top.
# ─────────────────────────────────────────────────────────────
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',            # Handle CORS first
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',        # CSRF protection
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


# ─────────────────────────────────────────────────────────────
# URLS
# The root URL configuration file for the project.
# ─────────────────────────────────────────────────────────────
ROOT_URLCONF = 'gridnest.urls'


# ─────────────────────────────────────────────────────────────
# TEMPLATES
# Django uses these to render HTML pages (e.g., admin panel).
# ─────────────────────────────────────────────────────────────
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# ASGI Setup
WSGI_APPLICATION = 'gridnest.wsgi.application'
ASGI_APPLICATION = 'gridnest.asgi.application'

# Channel Layers (The 'Switchboard' for messages)
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer',
    },
}


# ─────────────────────────────────────────────────────────────
# DATABASE
# PostgreSQL is our production database.
# Credentials are loaded securely from the .env file.
# ─────────────────────────────────────────────────────────────
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# ─────────────────────────────────────────────────────────────
# PASSWORD VALIDATION
# Django enforces these rules when users set passwords.
# ─────────────────────────────────────────────────────────────
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]


# ─────────────────────────────────────────────────────────────
# INTERNATIONALISATION
# ─────────────────────────────────────────────────────────────
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Africa/Nairobi'   # Kenya timezone — change if needed
USE_I18N = True
USE_TZ = True


# ─────────────────────────────────────────────────────────────
# STATIC & MEDIA FILES
# Static: CSS/JS/images bundled with the app
# Media: User-uploaded files (e.g., property photos)
# ─────────────────────────────────────────────────────────────
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'   # Where `collectstatic` gathers files

MEDIA_URL = '/media/'                    # URL prefix for uploaded files
MEDIA_ROOT = BASE_DIR / 'media'         # Folder where uploads are saved


# ─────────────────────────────────────────────────────────────
# AUTHENTICATION
# Tell Django to use our custom User model instead of the default.
# ─────────────────────────────────────────────────────────────
AUTH_USER_MODEL = 'accounts.User'

# ─────────────────────────────────────────────────────────────
# DEFAULT PRIMARY KEY
# Django auto-creates an `id` field for every model.
# BigAutoField = 64-bit integer (supports billions of rows).
# ─────────────────────────────────────────────────────────────
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# ─────────────────────────────────────────────────────────────
# DJANGO REST FRAMEWORK (DRF)
# Controls how our API behaves globally.
# ─────────────────────────────────────────────────────────────
REST_FRAMEWORK = {
    # All endpoints require a valid JWT token by default
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    # Users must be logged in to access any endpoint
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    # How we filter and search
    'DEFAULT_FILTER_BACKENDS': (
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ),
}


# ─────────────────────────────────────────────────────────────
# JWT TOKEN SETTINGS
# Controls how long login tokens stay valid.
# ─────────────────────────────────────────────────────────────
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),   # Expires in 1 hour
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),      # Refresh valid for 7 days
    'ROTATE_REFRESH_TOKENS': True,                    # Issue new refresh on use
    'BLACKLIST_AFTER_ROTATION': False,
    'AUTH_HEADER_TYPES': ('Bearer',),                 # Authorization: Bearer <token>
}


# ─────────────────────────────────────────────────────────────
# CORS (Cross-Origin Resource Sharing)
# Tells Django to accept API requests from the React frontend.
CORS_ALLOW_ALL_ORIGINS = True  # Temporary fix for local development
CORS_ALLOW_CREDENTIALS = True

CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
]
