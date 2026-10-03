from django.urls import path, include
from rest_framework.routers import DefaultRouter
import re
from .views import (
    StartupViewSet, ChallengeViewSet, ProposalViewSet,
    translate_problem, send_registration_otp, verify_and_register, login_user,
    generate_pilot_agreement, translate_marathi, evaluate_proposal, export_csv_report, draft_proposal_ai, generate_gem_package,
    check_dpdp_compliance, get_trust_score, download_sandbox_data
)
# from .views import (
#     StartupViewSet, ChallengeViewSet, ProposalViewSet,
#     translate_problem, send_registration_otp, verify_and_register, login_user,
#     generate_pilot_agreement # NEW IMPORT
# )

router = DefaultRouter()
router.register(r'startups', StartupViewSet)
router.register(r'challenges', ChallengeViewSet)
router.register(r'proposals', ProposalViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('translate/', translate_problem, name='translate_problem'),
    path('auth/send-otp/', send_registration_otp, name='send_otp'),
    path('auth/register/', verify_and_register, name='register'),
    path('auth/login/', login_user, name='login'),
    path('proposals/<int:pk>/agreement/', generate_pilot_agreement, name='download_agreement'),
    path('marathi/', translate_marathi, name='translate_marathi'),
    path('proposals/<int:pk>/evaluate/', evaluate_proposal, name='evaluate_proposal'),
    path('reports/export/', export_csv_report, name='export_csv'),
    path('challenges/<int:pk>/draft/', draft_proposal_ai, name='draft_ai'),
    path('proposals/<int:pk>/sandbox/', download_sandbox_data, name='download_sandbox_data'),
    path('proposals/<int:pk>/gem-export/', generate_gem_package, name='gem_export'),
    path('proposals/<int:pk>/dpdp-scan/', check_dpdp_compliance, name='dpdp_scan'),
    path('startups/<str:startup_name>/trust/', get_trust_score, name='trust_score'),
    path('challenges/<str:pk>/draft/', draft_proposal_ai, name='draft_ai'),
]