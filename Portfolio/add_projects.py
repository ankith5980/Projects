"""
Script to add 6 featured projects to the portfolio website
Run this script to populate the database with sample projects
"""

import os
import sys
import django

# Setup Django environment
sys.path.append('C:/Users/ankit/Desktop/Projects/Portfolio')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portfolio_website.settings')
django.setup()

from portfolio.models import Project

def create_featured_projects():
    """Create 6 featured projects for the portfolio"""
    
    projects_data = [
        {
            'title': 'AI-Powered Chat Assistant',
            'short_description': 'Intelligent chatbot using natural language processing and machine learning for customer support automation.',
            'description': 'A sophisticated AI chat assistant built with Python, TensorFlow, and Django. Features include natural language understanding, sentiment analysis, and real-time response generation. Integrates with multiple platforms and provides analytics dashboard for performance monitoring.',
            'technologies': 'Python, TensorFlow, Django, NLP, REST API, PostgreSQL',
            'github_url': 'https://github.com/ankith5980/ai-chat-assistant',
            'demo_url': 'https://ai-chat-demo.herokuapp.com',
            'featured': True
        },
        {
            'title': 'E-Commerce Platform',
            'short_description': 'Full-stack e-commerce solution with real-time inventory management and secure payment processing.',
            'description': 'Modern e-commerce platform built with React and Django. Features include user authentication, product catalog, shopping cart, order management, payment integration with Stripe, and admin dashboard. Fully responsive design with SEO optimization.',
            'technologies': 'React, Django, PostgreSQL, Stripe API, Redis, Docker',
            'github_url': 'https://github.com/ankith5980/ecommerce-platform',
            'demo_url': 'https://ecommerce-demo.netlify.app',
            'featured': True
        },
        {
            'title': 'Smart Home IoT Dashboard',
            'short_description': 'Real-time monitoring and control system for IoT devices with data visualization and automation.',
            'description': 'IoT dashboard for smart home management with real-time device monitoring, automated scheduling, and energy consumption analytics. Built with Node.js backend, React frontend, and MQTT for device communication.',
            'technologies': 'Node.js, React, MongoDB, MQTT, Chart.js, Socket.io',
            'github_url': 'https://github.com/ankith5980/smart-home-dashboard',
            'demo_url': 'https://smart-home-demo.vercel.app',
            'featured': True
        },
        {
            'title': 'Machine Learning Stock Predictor',
            'short_description': 'Advanced ML model for stock price prediction using technical indicators and sentiment analysis.',
            'description': 'Machine learning application that predicts stock prices using historical data, technical indicators, and news sentiment analysis. Features LSTM neural networks, real-time data feeds, and interactive visualization dashboard.',
            'technologies': 'Python, TensorFlow, Pandas, Alpha Vantage API, Streamlit',
            'github_url': 'https://github.com/ankith5980/ml-stock-predictor',
            'demo_url': 'https://stock-predictor-ml.streamlit.app',
            'featured': True
        },
        {
            'title': 'Cloud-Native Microservices App',
            'short_description': 'Scalable microservices architecture deployed on Kubernetes with CI/CD pipeline automation.',
            'description': 'Enterprise-grade microservices application with Docker containerization, Kubernetes orchestration, and automated CI/CD pipeline. Includes API gateway, service discovery, monitoring, and logging solutions.',
            'technologies': 'Docker, Kubernetes, Node.js, MongoDB, Jenkins, Prometheus',
            'github_url': 'https://github.com/ankith5980/microservices-app',
            'demo_url': 'https://microservices-demo.k8s.io',
            'featured': True
        },
        {
            'title': 'Real-time Collaboration Tool',
            'short_description': 'Multi-user collaborative platform with real-time editing, video calls, and project management features.',
            'description': 'Real-time collaboration platform similar to Slack and Notion combined. Features include real-time document editing, video conferencing, task management, file sharing, and team communication tools.',
            'technologies': 'React, Node.js, Socket.io, WebRTC, MongoDB, AWS S3',
            'github_url': 'https://github.com/ankith5980/collaboration-tool',
            'demo_url': 'https://collab-tool-demo.herokuapp.com',
            'featured': True
        }
    ]
    
    print("Creating featured projects...")
    
    # Clear existing projects (optional)
    # Project.objects.all().delete()
    
    created_count = 0
    for project_data in projects_data:
        # Check if project with this title already exists
        if not Project.objects.filter(title=project_data['title']).exists():
            project = Project.objects.create(**project_data)
            print(f"✅ Created project: {project.title}")
            created_count += 1
        else:
            print(f"⚠️  Project already exists: {project_data['title']}")
    
    print(f"\n🎉 Successfully created {created_count} featured projects!")
    print("\nFeatured Projects Summary:")
    
    featured_projects = Project.objects.filter(featured=True)
    for i, project in enumerate(featured_projects, 1):
        print(f"{i}. {project.title}")
        print(f"   Technologies: {project.technologies}")
        print(f"   GitHub: {project.github_url}")
        print(f"   Demo: {project.demo_url}")
        print()

if __name__ == "__main__":
    try:
        create_featured_projects()
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()