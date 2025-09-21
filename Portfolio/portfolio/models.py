from django.db import models
from django.core.validators import RegexValidator
from django.utils import timezone


class Contact(models.Model):
    """Model to store contact form submissions"""
    name = models.CharField(max_length=100, verbose_name="Full Name")
    
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
    )
    phone_number = models.CharField(validators=[phone_regex], max_length=17, blank=True)
    
    email = models.EmailField(verbose_name="Email Address")
    message = models.TextField(verbose_name="Message")
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Contact Message"
        verbose_name_plural = "Contact Messages"
    
    def __str__(self):
        return f"{self.name} - {self.email} ({self.created_at.strftime('%Y-%m-%d %H:%M')})"


class Project(models.Model):
    """Model to store portfolio projects"""
    title = models.CharField(max_length=200)
    description = models.TextField()
    short_description = models.CharField(max_length=300, help_text="Brief description for project cards")
    image = models.ImageField(upload_to='projects/', blank=True, null=True)
    demo_url = models.URLField(blank=True, null=True, verbose_name="Demo URL")
    github_url = models.URLField(blank=True, null=True, verbose_name="GitHub URL")
    technologies = models.CharField(max_length=500, help_text="Comma-separated list of technologies")
    featured = models.BooleanField(default=False, help_text="Show on homepage")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-featured', '-created_at']
    
    def __str__(self):
        return self.title
    
    def get_technologies_list(self):
        """Return technologies as a list"""
        return [tech.strip() for tech in self.technologies.split(',') if tech.strip()]


class Skill(models.Model):
    """Model to store skills with categories"""
    CATEGORY_CHOICES = [
        ('frontend', 'Frontend'),
        ('backend', 'Backend'),
        ('ai_ml', 'AI/ML'),
        ('database', 'Database'),
        ('devops', 'DevOps'),
        ('tools', 'Tools'),
        ('other', 'Other'),
    ]
    
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    proficiency = models.IntegerField(
        default=50,
        help_text="Proficiency level (0-100)"
    )
    icon_class = models.CharField(
        max_length=100,
        blank=True,
        help_text="Font Awesome or other icon class"
    )
    
    class Meta:
        ordering = ['category', '-proficiency', 'name']
    
    def __str__(self):
        return f"{self.name} ({self.get_category_display()})"


class BlogPost(models.Model):
    """Model for blog posts"""
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    content = models.TextField()
    excerpt = models.TextField(max_length=500, help_text="Brief excerpt for blog listing")
    featured_image = models.ImageField(upload_to='blog/', blank=True, null=True)
    published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title
    
    def get_absolute_url(self):
        return f"/blog/{self.slug}/"


class Newsletter(models.Model):
    """Model for newsletter subscriptions"""
    email = models.EmailField(unique=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.email
