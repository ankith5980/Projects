from django.shortcuts import render, redirect
from django.contrib import messages
from django.core.mail import send_mail
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import Contact, Project, Skill, BlogPost, Newsletter
from .forms import ContactForm
import json


def home(request):
    """Home page view with featured content"""
    featured_projects = Project.objects.filter(featured=True)[:6]
    skills = Skill.objects.all()
    recent_posts = BlogPost.objects.filter(published=True)[:3]
    
    context = {
        'featured_projects': featured_projects,
        'skills': skills,
        'recent_posts': recent_posts,
        'page_title': 'Home - Your Name | AI & Full-Stack Developer'
    }
    return render(request, 'home.html', context)


def about(request):
    """About page view"""
    context = {
        'page_title': 'About - Your Name | AI & Full-Stack Developer'
    }
    return render(request, 'about.html', context)


def projects(request):
    """Projects page view with all projects"""
    all_projects = Project.objects.all()
    
    context = {
        'projects': all_projects,
        'page_title': 'Projects - Your Name | Portfolio'
    }
    return render(request, 'projects.html', context)


def blog(request):
    """Blog page view with all published posts"""
    published_posts = BlogPost.objects.filter(published=True)
    
    context = {
        'posts': published_posts,
        'page_title': 'Blog - Your Name | Latest Insights'
    }
    return render(request, 'blog.html', context)


def blog_post(request, slug):
    """Individual blog post view"""
    try:
        post = BlogPost.objects.get(slug=slug, published=True)
        context = {
            'post': post,
            'page_title': f'{post.title} - Your Name Blog'
        }
        return render(request, 'blog_post.html', context)
    except BlogPost.DoesNotExist:
        messages.error(request, 'The requested blog post was not found.')
        return redirect('blog')


def contact(request):
    """Contact page view with form handling"""
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            # Check honeypot field
            if request.POST.get('website'):
                messages.error(request, 'Spam detected. Please try again.')
                return redirect('contact')
            
            # Check captcha
            captcha_answer = request.POST.get('captcha')
            if captcha_answer != '8':
                messages.error(request, 'Incorrect captcha answer. Please try again.')
                form.add_error('captcha', 'Incorrect answer. 5 + 3 = ?')
                return render(request, 'contact.html', {'form': form})
            
            # Save contact submission
            contact_submission = form.save()
            
            # Send email notification
            try:
                subject = f'New Contact Form Submission from {contact_submission.name}'
                message = f"""
                New contact form submission:
                
                Name: {contact_submission.name}
                Email: {contact_submission.email}
                Phone: {contact_submission.phone_number or 'Not provided'}
                
                Message:
                {contact_submission.message}
                
                Submitted at: {contact_submission.created_at}
                """
                
                send_mail(
                    subject=subject,
                    message=message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[settings.EMAIL_HOST_USER],
                    fail_silently=False,
                )
                
                messages.success(request, 'Thank you for your message! I\'ll get back to you soon.')
                
            except Exception as e:
                # Still show success to user, but log the email error
                messages.success(request, 'Thank you for your message! I\'ll get back to you soon.')
                print(f"Email sending failed: {e}")
            
            return redirect('contact')
        else:
            messages.error(request, 'Please correct the errors below.')
    else:
        form = ContactForm()
    
    context = {
        'form': form,
        'page_title': 'Contact - Your Name | Get In Touch'
    }
    return render(request, 'contact.html', context)


@csrf_exempt
@require_http_methods(["POST"])
def newsletter_subscribe(request):
    """Handle newsletter subscription via AJAX"""
    try:
        data = json.loads(request.body)
        email = data.get('email', '').strip().lower()
        
        if not email:
            return JsonResponse({'success': False, 'message': 'Email address is required.'})
        
        # Check if email already exists
        if Newsletter.objects.filter(email=email).exists():
            return JsonResponse({'success': False, 'message': 'You are already subscribed to our newsletter.'})
        
        # Create new subscription
        Newsletter.objects.create(email=email)
        
        # Send welcome email (optional)
        try:
            send_mail(
                subject='Welcome to Our Newsletter!',
                message=f'Thank you for subscribing to our newsletter! You\'ll receive updates about new blog posts and projects.',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=True,
            )
        except Exception as e:
            print(f"Newsletter welcome email failed: {e}")
        
        return JsonResponse({'success': True, 'message': 'Thank you for subscribing!'})
        
    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'message': 'Invalid request format.'})
    except Exception as e:
        return JsonResponse({'success': False, 'message': 'An error occurred. Please try again.'})


def api_projects(request):
    """API endpoint to get projects data"""
    projects = Project.objects.all()
    projects_data = []
    
    for project in projects:
        projects_data.append({
            'id': project.id,
            'title': project.title,
            'description': project.short_description,
            'technologies': project.get_technologies_list(),
            'demo_url': project.demo_url,
            'github_url': project.github_url,
            'featured': project.featured,
            'image': project.image.url if project.image else None,
        })
    
    return JsonResponse({'projects': projects_data})


def api_skills(request):
    """API endpoint to get skills data"""
    skills = Skill.objects.all()
    skills_data = {}
    
    for skill in skills:
        category = skill.get_category_display()
        if category not in skills_data:
            skills_data[category] = []
        
        skills_data[category].append({
            'name': skill.name,
            'proficiency': skill.proficiency,
            'icon_class': skill.icon_class,
        })
    
    return JsonResponse({'skills': skills_data})


def handler404(request, exception):
    """Custom 404 error handler"""
    context = {
        'page_title': '404 - Page Not Found'
    }
    return render(request, '404.html', context, status=404)


def handler500(request):
    """Custom 500 error handler"""
    context = {
        'page_title': '500 - Server Error'
    }
    return render(request, '500.html', context, status=500)
