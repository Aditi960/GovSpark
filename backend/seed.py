import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from api.models import UserProfile

def seed_admin():
    email = 'nodal@maharashtra.gov.in'
    if not User.objects.filter(email=email).exists():
        user = User.objects.create_user(
            username='msins_admin',
            email=email,
            password='sihpassword123',
            first_name='Nodal Officer'
        )
        UserProfile.objects.create(
            user=user,
            role='gov',
            organization_name='Maharashtra State Innovation Society'
        )
        print("✅ Official Nodal Officer admin created successfully!")
    else:
        print("ℹ️ Admin account already exists. Skipping creation.")

if __name__ == '__main__':
    seed_admin()