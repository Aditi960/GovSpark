from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import UserProfile, Challenge, Proposal

class Command(BaseCommand):
    help = 'Wipes existing data and seeds the database with professional SIH demo data'

    def handle(self, *args, **kwargs):
        self.stdout.write("Clearing old data...")
        # 1. Clear existing data (keeps superusers safe)
        User.objects.filter(is_superuser=False).delete()
        Challenge.objects.all().delete()
        Proposal.objects.all().delete()

        self.stdout.write("Creating users...")
        # 2. Create Government User
        gov_user = User.objects.create_user(
            username='maharashtra_admin', 
            email='nodal@maharashtra.gov.in', 
            password='sihpassword123', 
            first_name='Rajesh Patil'
        )
        UserProfile.objects.create(user=gov_user, role='gov', organization_name='Maharashtra State Innovation Society')

        # 3. Create Student Innovator User (Your Team)
        student_user = User.objects.create_user(
            username='regencoders', 
            email='team@regencoders.com', 
            password='sihpassword123', 
            first_name='Guruprasad'
        )
        UserProfile.objects.create(user=student_user, role='startup', organization_name='ReGen Coders')

        self.stdout.write("Creating challenges...")
        # 4. Create Active Challenges with explicitly defined IDs
        c1 = Challenge.objects.create(
            id="CHL-2026-001",
            title="Municipal E-Waste & Scrap Digitization",
            department="BMC Solid Waste Management",
            expected_outcome="A centralized dashboard to track e-waste collection across 24 ward offices and facilitate transparent recycler auctions.",
            budget="₹20 Lakhs",
            status="Open for Proposals"
        )
        
        Challenge.objects.create(
            id="CHL-2026-002",
            title="Automated Scrap Vehicle De-registration",
            department="RTO Maharashtra",
            expected_outcome="An AI-powered system to verify and de-register end-of-life vehicles directly at the scrap yard.",
            budget="₹12 Lakhs",
            status="Open for Proposals"
        )

        self.stdout.write("Creating proposals & smart escrows...")
        # 5. Create Proposals & Escrow Milestones
        Proposal.objects.create(
            challenge=c1,
            startup_name="ReGen Coders",
            solution_details="Cross-platform Flutter mobile app for ward staff with automated QR code scanning, and a React/Django web portal for real-time inventory tracking and transparent bidding.",
            milestones=[
                {"name": "Phase 1: Ward Inventory Digitization & Prototype Deployment", "amount": 450000, "status": "Pending"},
                {"name": "Phase 2: Auction Portal & Live Bidding Execution", "amount": 850000, "status": "Pending"}
            ],
            status="Approved for Pilot"
        )

        self.stdout.write(self.style.SUCCESS('Successfully seeded the ProcureNova database!'))