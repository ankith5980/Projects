from django.urls import path
from . import views

urlpatterns = [
    # Main pages
    path('', views.home, name='home'),
    path('about/', views.about, name='about'),
    path('projects/', views.projects, name='projects'),
    path('blog/', views.blog, name='blog'),
    path('blog/<slug:slug>/', views.blog_post, name='blog_post'),
    path('contact/', views.contact, name='contact'),
    
    # API endpoints
    path('api/newsletter-subscribe/', views.newsletter_subscribe, name='newsletter_subscribe'),
    path('api/projects/', views.api_projects, name='api_projects'),
    path('api/skills/', views.api_skills, name='api_skills'),
]