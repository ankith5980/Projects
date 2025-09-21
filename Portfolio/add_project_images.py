#!/usr/bin/env python3
"""
Script to add placeholder images to projects
This will create simple colored placeholder images for each project
"""

import os
import django
import sys
from pathlib import Path

# Add the project directory to the Python path
sys.path.append('/c/Users/ankit/Desktop/Projects/Portfolio')

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portfolio_website.settings')
django.setup()

from portfolio.models import Project
from PIL import Image, ImageDraw, ImageFont
import io
from django.core.files.uploadedfile import InMemoryUploadedFile


def create_project_image(title, technology, width=800, height=600):
    """Create a placeholder image for a project"""
    
    # Color scheme based on project type
    color_schemes = {
        'AI': ('#1e3a8a', '#3b82f6', '#60a5fa'),  # Blue theme for AI projects
        'Chat': ('#065f46', '#10b981', '#34d399'),  # Green theme for chat apps
        'E-Commerce': ('#7c2d12', '#ea580c', '#fb923c'),  # Orange theme for e-commerce
        'Portfolio': ('#581c87', '#a855f7', '#c084fc'),  # Purple theme for portfolio
        'Agent': ('#991b1b', '#dc2626', '#f87171'),  # Red theme for agent systems
        'TaskFlow': ('#1f2937', '#6b7280', '#9ca3af'),  # Gray theme for workflow
    }
    
    # Determine color scheme based on title
    theme = 'AI'  # Default
    for key in color_schemes.keys():
        if key.lower() in title.lower():
            theme = key
            break
    
    bg_color, primary_color, accent_color = color_schemes[theme]
    
    # Create image
    img = Image.new('RGB', (width, height), bg_color)
    draw = ImageDraw.Draw(img)
    
    # Draw gradient background effect
    for i in range(height):
        alpha = i / height
        r = int(int(bg_color[1:3], 16) * (1-alpha) + int(primary_color[1:3], 16) * alpha)
        g = int(int(bg_color[3:5], 16) * (1-alpha) + int(primary_color[3:5], 16) * alpha)
        b = int(int(bg_color[5:7], 16) * (1-alpha) + int(primary_color[5:7], 16) * alpha)
        draw.line([(0, i), (width, i)], fill=f"#{r:02x}{g:02x}{b:02x}")
    
    # Add geometric shapes for visual interest
    draw.rectangle([50, 50, width-50, height-50], outline=accent_color, width=3)
    draw.ellipse([width-200, height-200, width-50, height-50], outline=accent_color, width=2)
    
    # Add project title (simplified - would need proper font handling)
    title_short = title[:20] + "..." if len(title) > 20 else title
    
    # Add tech indicator
    draw.rectangle([20, 20, 200, 80], fill=accent_color)
    
    return img


def add_images_to_projects():
    """Add images to all projects"""
    
    projects = Project.objects.all()
    
    for project in projects:
        print(f"Adding image for: {project.title}")
        
        # Create the image
        img = create_project_image(project.title, project.technologies)
        
        # Save to memory
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        buffer.seek(0)
        
        # Create Django file
        filename = f"{project.title.lower().replace(' ', '_').replace('-', '_')}.png"
        django_file = InMemoryUploadedFile(
            buffer, None, filename, 'image/png', len(buffer.getvalue()), None
        )
        
        # Save to project
        project.image.save(filename, django_file, save=True)
        print(f"  ✓ Image saved: {filename}")
    
    print(f"\n✅ Successfully added images to {projects.count()} projects!")


if __name__ == "__main__":
    try:
        add_images_to_projects()
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()