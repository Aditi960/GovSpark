from django.db import models
import uuid
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
import random

class Startup(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    domain_focus = models.CharField(max_length=255)
    is_dpiit_verified = models.BooleanField(default=False)
    pilots_completed = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Challenge(models.Model):
    STATUS_CHOICES = [
        ('Draft', 'Draft'),
        ('Open for Proposals', 'Open for Proposals'),
        ('Evaluating', 'Evaluating'),
        ('Pilot Phase', 'Pilot Phase'),
        ('Closed', 'Closed')
    ]

    id = models.CharField(max_length=20, primary_key=True) # e.g., CHL-2026-01
    title = models.CharField(max_length=255)
    department = models.CharField(max_length=255)
    expected_outcome = models.TextField()
    budget = models.CharField(max_length=50) # e.g., "₹15 Lakhs"
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Draft')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.id} - {self.title}"

class Proposal(models.Model):
    STATUS_CHOICES = [
        ('Submitted', 'Submitted'),
        ('Under Review', 'Under Review'),
        ('Approved for Pilot', 'Approved for Pilot'),
        ('Rejected', 'Rejected')
    ]

    challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE, related_name='proposals')
    startup_name = models.CharField(max_length=255)
    solution_details = models.TextField()
    milestones = models.JSONField(help_text="Format: [{'name': 'M1', 'amount': 50000}]")
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Submitted')
    submitted_at = models.DateTimeField(auto_now_add=True)
    
    # NEW FIELDS FOR AI SCORING
    ai_score = models.IntegerField(null=True, blank=True)
    ai_summary = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.startup_name} -> {self.challenge.id}"
        
class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('gov', 'Government Official'),
        ('startup', 'Startup Founder')
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='startup')
    organization_name = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} ({self.role})"

class EmailOTP(models.Model):
    email = models.EmailField()
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)

    def is_valid(self):
        # 1-minute expiration window (60 seconds)
        return timezone.now() <= self.created_at + timedelta(seconds=60) and not self.is_verified

    @staticmethod
    def generate_otp():
        return str(random.randint(100000, 999999))