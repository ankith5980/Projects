"""
Simple script to update specific projects data
Modify the update_data dictionary below with your changes
"""

import os
import sys
import django

# Setup Django environment
sys.path.append('C:/Users/ankit/Desktop/Projects/Portfolio')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portfolio_website.settings')
django.setup()

from portfolio.models import Project

def show_current_projects():
    """Display current projects"""
    print("=== CURRENT FEATURED PROJECTS ===\n")
    
    projects = Project.objects.filter(featured=True).order_by('id')
    
    for i, project in enumerate(projects, 1):
        print(f"{i}. {project.title}")
        print(f"   Short Description: {project.short_description}")
        print(f"   Technologies: {project.technologies}")
        print(f"   GitHub: {project.github_url}")
        print(f"   Demo: {project.demo_url}")
        print()

def update_projects():
    """
    Update projects based on the data below
    Modify this dictionary to change your project data
    """
    
    # MODIFY THIS DICTIONARY TO UPDATE YOUR PROJECTS
    updates = {
        'AI-Powered Chat Assistant': {
            # Uncomment and modify any fields you want to update:
            # 'title': 'New Title Here',
            # 'short_description': 'New short description here',
            # 'technologies': 'New, Technologies, Here',
            # 'github_url': 'https://github.com/your-username/new-repo',
            # 'demo_url': 'https://your-demo-site.com',
        },
        'E-Commerce Platform': {
            # 'title': 'Modern E-Commerce Solution',
            # 'short_description': 'Full-stack online shopping platform with advanced features',
        },
        'Smart Home IoT Dashboard': {
            # Add updates here
        },
        'Machine Learning Stock Predictor': {
            # Add updates here
        },
        'Cloud-Native Microservices App': {
            # Add updates here
        },
        'Real-time Collaboration Tool': {
            # Add updates here
        }
    }
    
    print("=== UPDATING PROJECTS ===\n")
    
    updated_count = 0
    
    for project_title, update_data in updates.items():
        if not update_data:  # Skip if no updates specified
            continue
            
        try:
            project = Project.objects.get(title=project_title)
            
            print(f"Updating: {project_title}")
            
            for field, new_value in update_data.items():
                if hasattr(project, field):
                    old_value = getattr(project, field)
                    setattr(project, field, new_value)
                    print(f"  ✅ {field}: '{old_value}' → '{new_value}'")
                else:
                    print(f"  ❌ Invalid field: {field}")
            
            project.save()
            updated_count += 1
            print()
            
        except Project.DoesNotExist:
            print(f"  ❌ Project not found: {project_title}")
            print()
    
    if updated_count == 0:
        print("ℹ️  No updates applied. Modify the 'updates' dictionary in the script to make changes.")
    else:
        print(f"✅ Successfully updated {updated_count} projects!")

if __name__ == "__main__":
    show_current_projects()
    update_projects()
    
    print("\n" + "="*50)
    print("AFTER UPDATES:")
    show_current_projects()