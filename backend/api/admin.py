from django.contrib import admin
from .models import Startup, Challenge
from .models import Proposal

@admin.register(Startup)
class StartupAdmin(admin.ModelAdmin):
    list_display = ('name', 'domain_focus', 'is_dpiit_verified', 'pilots_completed')
    list_filter = ('is_dpiit_verified',)
    search_fields = ('name', 'domain_focus')

@admin.register(Challenge)
class ChallengeAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'department', 'budget', 'status')
    list_filter = ('status', 'department')
    search_fields = ('title', 'id')

@admin.register(Proposal)
class ProposalAdmin(admin.ModelAdmin):
    list_display = ('startup_name', 'challenge', 'status', 'submitted_at')
    list_filter = ('status',)