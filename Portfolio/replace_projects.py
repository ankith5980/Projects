"""
Script to replace existing projects with new project data
"""

import os
import sys
import django

# Setup Django environment
sys.path.append('C:/Users/ankit/Desktop/Projects/Portfolio')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portfolio_website.settings')
django.setup()

from portfolio.models import Project

def replace_with_new_projects():
    """Replace existing projects with new project data"""
    
    # New project data with complete descriptions
    new_projects_data = [
        {
            'title': 'Smart Agent System',
            'short_description': 'A sophisticated multi-agent orchestration framework using LangGraph and OpenAI. This system enables scalable, cooperative workflows for intelligent decision-making processes',
            'description': 'An advanced multi-agent orchestration system built with LangGraph and OpenAI that revolutionizes how AI agents collaborate and execute complex tasks. The framework provides intelligent task delegation, real-time coordination between multiple AI agents, and sophisticated decision-making capabilities. Features include dynamic workflow creation, agent state management, custom tool integration, and comprehensive monitoring dashboards. The system supports both synchronous and asynchronous agent interactions, making it ideal for enterprise-level automation and complex problem-solving scenarios.',
            'technologies': 'Python, LangGraph, OpenAI, FastAPI',
            'github_url': 'https://github.com/ankith5980/smart-agent-system',
            'demo_url': 'https://smart-agents-demo.vercel.app',
            'featured': True
        },
        {
            'title': 'Portfolio Builder',
            'short_description': 'Dynamic portfolio generator with customizable templates and real world GitHub integration. Features automated updates and AI powered content suggestions.',
            'description': 'A comprehensive portfolio generation platform that automatically creates stunning, professional portfolios by integrating with GitHub repositories and leveraging AI for content optimization. The system analyzes your coding projects, generates compelling descriptions, and suggests improvements using advanced natural language processing. Features include drag-and-drop template customization, real-time GitHub synchronization, SEO optimization, responsive design templates, and AI-powered content suggestions that help showcase your work in the best possible light.',
            'technologies': 'React, Node.js, GitHub API, AI Integration',
            'github_url': 'https://github.com/ankith5980/portfolio-builder',
            'demo_url': 'https://portfolio-builder-ai.netlify.app',
            'featured': True
        },
        {
            'title': 'TaskFlow AI',
            'short_description': 'Multi-step task delegation engine with plugin-based LLM agents. Inspired by Auto-GPT and CrewAI frameworks for intelligent automation.',
            'description': 'An intelligent task automation framework inspired by Auto-GPT and CrewAI that breaks down complex objectives into manageable subtasks and delegates them to specialized AI agents. The system features a robust plugin architecture allowing custom tool integration, intelligent task prioritization, and autonomous execution workflows. Built with TypeScript and LangChain, it provides enterprise-grade reliability with comprehensive logging, error handling, and rollback capabilities. The microservices architecture ensures scalability and allows for distributed processing across multiple environments.',
            'technologies': 'TypeScript, LangChain, Plugin System, Microservices',
            'github_url': 'https://github.com/ankith5980/taskflow-ai',
            'demo_url': 'https://taskflow-ai-demo.herokuapp.com',
            'featured': True
        },
        {
            'title': 'E-Commerce Platform',
            'short_description': 'Full-stack e-commerce solution with real-time inventory management, payment processing, and advanced analytics dashboard.',
            'description': 'A modern, full-stack e-commerce platform built with Next.js that delivers exceptional shopping experiences with enterprise-level features. The system includes real-time inventory tracking, secure payment processing via Stripe, comprehensive order management, and an advanced analytics dashboard with business intelligence insights. Features Redis caching for optimal performance, PostgreSQL for reliable data storage, automated email notifications, multi-vendor support, and responsive design that works flawlessly across all devices. The platform is designed for scalability and includes comprehensive admin tools for managing products, orders, and customer relationships.',
            'technologies': 'Next.js, PostgreSQL, Stripe, Redis',
            'github_url': 'https://github.com/ankith5980/nextjs-ecommerce',
            'demo_url': 'https://ecommerce-nextjs-demo.vercel.app',
            'featured': True
        },
        {
            'title': 'Real-time Chat App',
            'short_description': 'Scalable real-time messaging application with WebSocket connections, file sharing, and end-to-end encryption.',
            'description': 'A high-performance real-time messaging application built with Socket.io and React that supports thousands of concurrent users with enterprise-grade security features. The platform includes end-to-end encryption for secure communications, real-time file sharing with drag-and-drop functionality, group chat management, user presence indicators, and message history with search capabilities. Built on a scalable Express.js backend with MongoDB for persistent storage, the application features push notifications, emoji reactions, typing indicators, and administrative tools for content moderation and user management.',
            'technologies': 'Socket.io, Express.js, MongoDB, React',
            'github_url': 'https://github.com/ankith5980/realtime-chat-app',
            'demo_url': 'https://realtime-chat-demo.onrender.com',
            'featured': True
        },
        {
            'title': 'AI Content Generator',
            'short_description': 'Intelligent content creation tool powered by GPT-4, featuring customizable templates and multi-language support.',
            'description': 'An advanced AI-powered content creation platform that leverages GPT-4 to generate high-quality, engaging content across multiple formats and languages. The system features customizable templates for blogs, social media, marketing copy, and technical documentation, with intelligent tone and style adaptation. Built with Python Flask backend and Vue.js frontend, it includes content optimization suggestions, plagiarism detection, SEO analysis, and collaborative editing features. The platform supports over 25 languages, batch content generation, content scheduling, and integrates with popular content management systems and social media platforms.',
            'technologies': 'OpenAI API, Python, Flask, Vue.js',
            'github_url': 'https://github.com/ankith5980/ai-content-generator',
            'demo_url': 'https://ai-content-gen.streamlit.app',
            'featured': True
        }
    ]
    
    print("=== REPLACING PROJECTS WITH NEW DATA ===\n")
    
    # Delete existing featured projects
    existing_projects = Project.objects.filter(featured=True)
    deleted_count = existing_projects.count()
    existing_projects.delete()
    print(f"🗑️  Deleted {deleted_count} existing featured projects")
    
    # Create new projects
    created_count = 0
    for project_data in new_projects_data:
        project = Project.objects.create(**project_data)
        print(f"✅ Created: {project.title}")
        created_count += 1
    
    print(f"\n🎉 Successfully replaced projects!")
    print(f"   Deleted: {deleted_count} old projects")
    print(f"   Created: {created_count} new projects")
    
    print("\n=== NEW FEATURED PROJECTS ===")
    new_projects = Project.objects.filter(featured=True).order_by('id')
    for i, project in enumerate(new_projects, 1):
        print(f"\n{i}. {project.title}")
        print(f"   Technologies: {project.technologies}")
        print(f"   GitHub: {project.github_url}")
        print(f"   Demo: {project.demo_url}")

if __name__ == "__main__":
    try:
        replace_with_new_projects()
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()