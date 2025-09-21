from django.core.management.base import BaseCommand
from portfolio.models import Project
from PIL import Image, ImageDraw
import io
from django.core.files.uploadedfile import InMemoryUploadedFile


class Command(BaseCommand):
    help = 'Generate or update project images'

    def add_arguments(self, parser):
        parser.add_argument(
            '--project-id',
            type=int,
            help='Update image for specific project ID',
        )
        parser.add_argument(
            '--all',
            action='store_true',
            help='Update images for all projects',
        )

    def handle(self, *args, **options):
        if options['project_id']:
            try:
                project = Project.objects.get(id=options['project_id'])
                self.update_project_image(project)
                self.stdout.write(
                    self.style.SUCCESS(f'Successfully updated image for project: {project.title}')
                )
            except Project.DoesNotExist:
                self.stdout.write(
                    self.style.ERROR(f'Project with ID {options["project_id"]} does not exist')
                )
        elif options['all']:
            projects = Project.objects.all()
            for project in projects:
                self.update_project_image(project)
            
            self.stdout.write(
                self.style.SUCCESS(f'Successfully updated images for {projects.count()} projects')
            )
        else:
            self.stdout.write(
                self.style.ERROR('Please specify --project-id or --all')
            )

    def update_project_image(self, project):
        """Update image for a single project"""
        
        # Color schemes based on project type
        color_schemes = {
            'ai': '#3b82f6',      # Blue for AI projects
            'chat': '#10b981',    # Green for chat apps
            'ecommerce': '#ea580c', # Orange for e-commerce
            'portfolio': '#a855f7',  # Purple for portfolio
            'workflow': '#6b7280',   # Gray for workflow
            'agent': '#dc2626',      # Red for agent systems
        }
        
        # Determine color based on project
        color = color_schemes.get('workflow')  # Default
        title_lower = project.title.lower()
        
        if 'ai' in title_lower:
            color = color_schemes['ai']
        elif 'chat' in title_lower:
            color = color_schemes['chat']
        elif 'commerce' in title_lower:
            color = color_schemes['ecommerce']
        elif 'portfolio' in title_lower:
            color = color_schemes['portfolio']
        elif 'agent' in title_lower:
            color = color_schemes['agent']
        
        # Create a simple gradient image
        width, height = 800, 600
        img = Image.new('RGB', (width, height), '#1f2937')
        draw = ImageDraw.Draw(img)
        
        # Create gradient
        for y in range(height):
            alpha = y / height
            r = int(31 * (1-alpha) + int(color[1:3], 16) * alpha * 0.3)
            g = int(41 * (1-alpha) + int(color[3:5], 16) * alpha * 0.3)
            b = int(55 * (1-alpha) + int(color[5:7], 16) * alpha * 0.3)
            draw.line([(0, y), (width, y)], fill=(r, g, b))
        
        # Add some geometric elements
        draw.rectangle([50, 50, width-50, height-50], outline=color, width=3)
        draw.ellipse([width-200, height-200, width-50, height-50], outline=color, width=2)
        
        # Save image
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        buffer.seek(0)
        
        filename = f"{project.title.lower().replace(' ', '_').replace('-', '_')}_generated.png"
        django_file = InMemoryUploadedFile(
            buffer, None, filename, 'image/png', len(buffer.getvalue()), None
        )
        
        # Delete old image if exists
        if project.image:
            project.image.delete()
        
        # Save new image
        project.image.save(filename, django_file, save=True)
        
        self.stdout.write(f'  ✓ Generated image: {filename}')