"""
Script to view and modify existing projects in the portfolio website
"""

import os
import sys
import django

# Setup Django environment
sys.path.append('C:/Users/ankit/Desktop/Projects/Portfolio')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portfolio_website.settings')
django.setup()

from portfolio.models import Project

def view_current_projects():
    """Display all current projects"""
    print("=== CURRENT PROJECTS IN DATABASE ===\n")
    
    projects = Project.objects.all().order_by('-featured', '-created_at')
    
    if not projects:
        print("No projects found in database.")
        return
    
    for i, project in enumerate(projects, 1):
        print(f"{i}. {project.title}")
        print(f"   ID: {project.id}")
        print(f"   Short Description: {project.short_description}")
        print(f"   Technologies: {project.technologies}")
        print(f"   GitHub: {project.github_url}")
        print(f"   Demo: {project.demo_url}")
        print(f"   Featured: {'Yes' if project.featured else 'No'}")
        print(f"   Created: {project.created_at.strftime('%Y-%m-%d %H:%M')}")
        print("-" * 80)

def update_project_data():
    """Interactive function to update project data"""
    print("\n=== PROJECT UPDATE OPTIONS ===")
    print("1. Update project titles")
    print("2. Update project descriptions") 
    print("3. Update GitHub URLs")
    print("4. Update demo URLs")
    print("5. Update technologies")
    print("6. Custom update (specify fields)")
    
    choice = input("\nEnter your choice (1-6): ").strip()
    
    if choice == "1":
        update_titles()
    elif choice == "2":
        update_descriptions()
    elif choice == "3":
        update_github_urls()
    elif choice == "4":
        update_demo_urls()
    elif choice == "5":
        update_technologies()
    elif choice == "6":
        custom_update()
    else:
        print("Invalid choice. Please run the script again.")

def update_titles():
    """Update project titles"""
    print("\n=== UPDATE PROJECT TITLES ===")
    projects = Project.objects.filter(featured=True)
    
    for project in projects:
        print(f"\nCurrent title: {project.title}")
        new_title = input(f"Enter new title (or press Enter to keep current): ").strip()
        
        if new_title:
            project.title = new_title
            project.save()
            print(f"✅ Updated title to: {new_title}")
        else:
            print("⏭️  Kept current title")

def update_descriptions():
    """Update project descriptions"""
    print("\n=== UPDATE PROJECT DESCRIPTIONS ===")
    projects = Project.objects.filter(featured=True)
    
    for project in projects:
        print(f"\nProject: {project.title}")
        print(f"Current short description: {project.short_description}")
        new_desc = input(f"Enter new short description (or press Enter to keep current): ").strip()
        
        if new_desc:
            project.short_description = new_desc
            project.save()
            print(f"✅ Updated description")
        else:
            print("⏭️  Kept current description")

def update_github_urls():
    """Update GitHub URLs"""
    print("\n=== UPDATE GITHUB URLS ===")
    projects = Project.objects.filter(featured=True)
    
    for project in projects:
        print(f"\nProject: {project.title}")
        print(f"Current GitHub URL: {project.github_url}")
        new_url = input(f"Enter new GitHub URL (or press Enter to keep current): ").strip()
        
        if new_url:
            project.github_url = new_url
            project.save()
            print(f"✅ Updated GitHub URL")
        else:
            print("⏭️  Kept current URL")

def update_demo_urls():
    """Update demo URLs"""
    print("\n=== UPDATE DEMO URLS ===")
    projects = Project.objects.filter(featured=True)
    
    for project in projects:
        print(f"\nProject: {project.title}")
        print(f"Current demo URL: {project.demo_url}")
        new_url = input(f"Enter new demo URL (or press Enter to keep current): ").strip()
        
        if new_url:
            project.demo_url = new_url
            project.save()
            print(f"✅ Updated demo URL")
        else:
            print("⏭️  Kept current URL")

def update_technologies():
    """Update technology stacks"""
    print("\n=== UPDATE TECHNOLOGY STACKS ===")
    projects = Project.objects.filter(featured=True)
    
    for project in projects:
        print(f"\nProject: {project.title}")
        print(f"Current technologies: {project.technologies}")
        new_tech = input(f"Enter new technologies (comma-separated, or press Enter to keep current): ").strip()
        
        if new_tech:
            project.technologies = new_tech
            project.save()
            print(f"✅ Updated technologies")
        else:
            print("⏭️  Kept current technologies")

def custom_update():
    """Custom update for specific projects"""
    print("\n=== CUSTOM PROJECT UPDATE ===")
    projects = Project.objects.filter(featured=True)
    
    print("Available projects:")
    for i, project in enumerate(projects, 1):
        print(f"{i}. {project.title}")
    
    try:
        choice = int(input("\nSelect project number to update: ")) - 1
        project = projects[choice]
        
        print(f"\nSelected: {project.title}")
        print("Available fields to update:")
        print("1. title")
        print("2. short_description") 
        print("3. description (full)")
        print("4. technologies")
        print("5. github_url")
        print("6. demo_url")
        
        field = input("Enter field name to update: ").strip()
        new_value = input(f"Enter new value for {field}: ").strip()
        
        if hasattr(project, field) and new_value:
            setattr(project, field, new_value)
            project.save()
            print(f"✅ Updated {field} for {project.title}")
        else:
            print("❌ Invalid field or empty value")
            
    except (ValueError, IndexError):
        print("❌ Invalid selection")

if __name__ == "__main__":
    view_current_projects()
    
    modify = input("\nWould you like to modify any projects? (y/n): ").strip().lower()
    if modify == 'y':
        update_project_data()
        print("\n=== UPDATED PROJECTS ===")
        view_current_projects()
    
    print("\n✅ Project management complete!")