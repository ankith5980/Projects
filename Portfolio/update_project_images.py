#!/usr/bin/env python3
"""
Enhanced script to create better project images with modern design
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
import random


def create_modern_project_image(project, width=800, height=600):
    """Create a modern, attractive placeholder image for a project"""
    
    # Color schemes based on project type/technology
    color_schemes = {
        'ai': {
            'bg': '#0f172a',      # Dark blue background
            'primary': '#3b82f6', # Blue
            'secondary': '#60a5fa',
            'accent': '#1e40af',
            'text': '#e2e8f0'
        },
        'chat': {
            'bg': '#064e3b',      # Dark green background
            'primary': '#10b981',
            'secondary': '#34d399',
            'accent': '#047857',
            'text': '#ecfdf5'
        },
        'ecommerce': {
            'bg': '#7c2d12',      # Dark orange background
            'primary': '#ea580c',
            'secondary': '#fb923c',
            'accent': '#c2410c',
            'text': '#fed7aa'
        },
        'portfolio': {
            'bg': '#581c87',      # Purple background
            'primary': '#a855f7',
            'secondary': '#c084fc',
            'accent': '#7c3aed',
            'text': '#f3e8ff'
        },
        'workflow': {
            'bg': '#1f2937',      # Gray background
            'primary': '#6b7280',
            'secondary': '#9ca3af',
            'accent': '#4b5563',
            'text': '#f9fafb'
        },
        'agent': {
            'bg': '#991b1b',      # Red background
            'primary': '#dc2626',
            'secondary': '#f87171',
            'accent': '#b91c1c',
            'text': '#fef2f2'
        }
    }
    
    # Determine theme based on project title and tech
    theme_key = 'workflow'  # Default
    title_lower = project.title.lower()
    tech_lower = project.technologies.lower()
    
    if 'ai' in title_lower or 'gpt' in tech_lower or 'openai' in tech_lower:
        theme_key = 'ai'
    elif 'chat' in title_lower or 'socket' in tech_lower or 'messaging' in title_lower:
        theme_key = 'chat'
    elif 'ecommerce' in title_lower or 'e-commerce' in title_lower or 'commerce' in title_lower:
        theme_key = 'ecommerce'
    elif 'portfolio' in title_lower:
        theme_key = 'portfolio'
    elif 'agent' in title_lower or 'langgraph' in tech_lower:
        theme_key = 'agent'
    
    theme = color_schemes[theme_key]
    
    # Create image with gradient background
    img = Image.new('RGB', (width, height), theme['bg'])
    draw = ImageDraw.Draw(img)
    
    # Create gradient background
    for y in range(height):
        alpha = y / height
        # Blend background with primary color
        r1, g1, b1 = int(theme['bg'][1:3], 16), int(theme['bg'][3:5], 16), int(theme['bg'][5:7], 16)
        r2, g2, b2 = int(theme['primary'][1:3], 16), int(theme['primary'][3:5], 16), int(theme['primary'][5:7], 16)
        
        r = int(r1 * (1-alpha*0.3) + r2 * (alpha*0.3))
        g = int(g1 * (1-alpha*0.3) + g2 * (alpha*0.3))
        b = int(b1 * (1-alpha*0.3) + b2 * (alpha*0.3))
        
        draw.line([(0, y), (width, y)], fill=(r, g, b))
    
    # Add geometric patterns
    # Large circle
    circle_x, circle_y = width - 150, 100
    draw.ellipse([circle_x-80, circle_y-80, circle_x+80, circle_y+80], 
                outline=theme['secondary'], width=3)
    draw.ellipse([circle_x-50, circle_y-50, circle_x+50, circle_y+50], 
                outline=theme['accent'], width=2)
    
    # Rectangles pattern
    rect_width, rect_height = 120, 80
    rect_x, rect_y = 60, height - 150
    draw.rectangle([rect_x, rect_y, rect_x + rect_width, rect_y + rect_height],
                  outline=theme['primary'], width=3)
    draw.rectangle([rect_x + 20, rect_y + 20, rect_x + rect_width - 20, rect_y + rect_height - 20],
                  fill=theme['accent'])
    
    # Add diagonal lines pattern
    for i in range(0, width + height, 100):
        draw.line([(i, 0), (i - height, height)], fill=theme['secondary'] + '20', width=1)
    
    # Add project title area
    title_bg_x, title_bg_y = 50, 50
    title_bg_width, title_bg_height = width - 100, 120
    
    # Semi-transparent background for title
    title_overlay = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    title_draw = ImageDraw.Draw(title_overlay)
    title_draw.rectangle([title_bg_x, title_bg_y, title_bg_x + title_bg_width, title_bg_y + title_bg_height],
                        fill=theme['bg'] + '90')
    
    img = Image.alpha_composite(img.convert('RGBA'), title_overlay).convert('RGB')
    draw = ImageDraw.Draw(img)
    
    # Add border
    draw.rectangle([title_bg_x, title_bg_y, title_bg_x + title_bg_width, title_bg_y + title_bg_height],
                  outline=theme['primary'], width=2)
    
    # Add technology badges area
    badge_y = height - 120
    badge_width = 150
    badge_height = 40
    
    technologies = project.get_technologies_list()[:3]  # Show first 3 technologies
    for i, tech in enumerate(technologies):
        badge_x = 60 + (i * (badge_width + 20))
        if badge_x + badge_width > width - 60:
            break
        
        # Tech badge background
        draw.rectangle([badge_x, badge_y, badge_x + badge_width, badge_y + badge_height],
                     fill=theme['accent'], outline=theme['secondary'], width=1)
        
        # Tech text (simplified - would need proper font)
        text_x = badge_x + 10
        text_y = badge_y + 10
        
    # Add corner accent
    draw.polygon([(0, 0), (100, 0), (0, 100)], fill=theme['primary'])
    draw.polygon([(width-100, height), (width, height), (width, height-100)], fill=theme['accent'])
    
    return img


def update_project_images():
    """Update all project images with enhanced versions"""
    
    projects = Project.objects.all()
    
    for project in projects:
        print(f"Creating enhanced image for: {project.title}")
        
        # Create the enhanced image
        img = create_modern_project_image(project)
        
        # Save to memory
        buffer = io.BytesIO()
        img.save(buffer, format='PNG', quality=95)
        buffer.seek(0)
        
        # Create Django file
        filename = f"{project.title.lower().replace(' ', '_').replace('-', '_')}_enhanced.png"
        django_file = InMemoryUploadedFile(
            buffer, None, filename, 'image/png', len(buffer.getvalue()), None
        )
        
        # Delete old image if exists
        if project.image:
            project.image.delete()
        
        # Save new image to project
        project.image.save(filename, django_file, save=True)
        print(f"  ✓ Enhanced image saved: {filename}")
    
    print(f"\n✅ Successfully updated images for {projects.count()} projects!")


if __name__ == "__main__":
    try:
        update_project_images()
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()