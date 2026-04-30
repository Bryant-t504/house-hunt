import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gridnest.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

admins = User.objects.filter(is_superuser=True)
if admins.exists():
    print("Found existing admins:")
    for admin in admins:
        print(f"Username: {admin.username}, Email: {admin.email}")
        
    # Reset the password of the first admin to something known
    first_admin = admins.first()
    first_admin.set_password('AdminPassword123!')
    first_admin.save()
    print(f"\nReset password for '{first_admin.username}' to 'AdminPassword123!'")
else:
    print("No superusers found. Creating one...")
    admin = User.objects.create_superuser(
        username='admin', 
        email='admin@gridnest.com', 
        password='AdminPassword123!'
    )
    # Set role to ADMIN if applicable
    if hasattr(admin, 'role'):
        admin.role = 'ADMIN'
        admin.save()
    print("Created superuser 'admin' with password 'AdminPassword123!'")
