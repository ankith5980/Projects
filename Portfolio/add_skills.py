"""
Script to add comprehensive technical skills to the portfolio website
"""

import os
import sys
import django

# Setup Django environment
sys.path.append('C:/Users/ankit/Desktop/Projects/Portfolio')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portfolio_website.settings')
django.setup()

from portfolio.models import Skill

def add_technical_skills():
    """Add comprehensive technical skills across all categories"""
    
    skills_data = [
        # AI/ML Skills
        {'name': 'Python', 'category': 'ai_ml', 'proficiency': 95, 'icon_class': 'fab fa-python'},
        {'name': 'TensorFlow', 'category': 'ai_ml', 'proficiency': 88, 'icon_class': 'fas fa-brain'},
        {'name': 'PyTorch', 'category': 'ai_ml', 'proficiency': 85, 'icon_class': 'fas fa-fire'},
        {'name': 'LangChain', 'category': 'ai_ml', 'proficiency': 90, 'icon_class': 'fas fa-link'},
        {'name': 'OpenAI API', 'category': 'ai_ml', 'proficiency': 92, 'icon_class': 'fas fa-robot'},
        {'name': 'LangGraph', 'category': 'ai_ml', 'proficiency': 87, 'icon_class': 'fas fa-project-diagram'},
        {'name': 'Scikit-learn', 'category': 'ai_ml', 'proficiency': 83, 'icon_class': 'fas fa-chart-line'},
        {'name': 'Pandas', 'category': 'ai_ml', 'proficiency': 90, 'icon_class': 'fas fa-table'},
        {'name': 'NumPy', 'category': 'ai_ml', 'proficiency': 88, 'icon_class': 'fas fa-calculator'},
        
        # Frontend Skills
        {'name': 'React', 'category': 'frontend', 'proficiency': 92, 'icon_class': 'fab fa-react'},
        {'name': 'Next.js', 'category': 'frontend', 'proficiency': 89, 'icon_class': 'fas fa-forward'},
        {'name': 'TypeScript', 'category': 'frontend', 'proficiency': 90, 'icon_class': 'fab fa-js-square'},
        {'name': 'JavaScript', 'category': 'frontend', 'proficiency': 94, 'icon_class': 'fab fa-js'},
        {'name': 'Vue.js', 'category': 'frontend', 'proficiency': 85, 'icon_class': 'fab fa-vuejs'},
        {'name': 'HTML5', 'category': 'frontend', 'proficiency': 96, 'icon_class': 'fab fa-html5'},
        {'name': 'CSS3', 'category': 'frontend', 'proficiency': 93, 'icon_class': 'fab fa-css3-alt'},
        {'name': 'Tailwind CSS', 'category': 'frontend', 'proficiency': 87, 'icon_class': 'fas fa-wind'},
        {'name': 'Bootstrap', 'category': 'frontend', 'proficiency': 91, 'icon_class': 'fab fa-bootstrap'},
        
        # Backend Skills
        {'name': 'Django', 'category': 'backend', 'proficiency': 93, 'icon_class': 'fas fa-server'},
        {'name': 'FastAPI', 'category': 'backend', 'proficiency': 89, 'icon_class': 'fas fa-bolt'},
        {'name': 'Node.js', 'category': 'backend', 'proficiency': 90, 'icon_class': 'fab fa-node-js'},
        {'name': 'Express.js', 'category': 'backend', 'proficiency': 88, 'icon_class': 'fas fa-route'},
        {'name': 'Flask', 'category': 'backend', 'proficiency': 85, 'icon_class': 'fas fa-flask'},
        {'name': 'GraphQL', 'category': 'backend', 'proficiency': 82, 'icon_class': 'fas fa-code-branch'},
        {'name': 'REST APIs', 'category': 'backend', 'proficiency': 94, 'icon_class': 'fas fa-exchange-alt'},
        {'name': 'WebSocket', 'category': 'backend', 'proficiency': 87, 'icon_class': 'fas fa-wifi'},
        {'name': 'Microservices', 'category': 'backend', 'proficiency': 86, 'icon_class': 'fas fa-cubes'},
        
        # Database Skills
        {'name': 'PostgreSQL', 'category': 'database', 'proficiency': 91, 'icon_class': 'fas fa-elephant'},
        {'name': 'MongoDB', 'category': 'database', 'proficiency': 89, 'icon_class': 'fas fa-leaf'},
        {'name': 'Redis', 'category': 'database', 'proficiency': 85, 'icon_class': 'fas fa-memory'},
        {'name': 'SQLite', 'category': 'database', 'proficiency': 88, 'icon_class': 'fas fa-database'},
        {'name': 'MySQL', 'category': 'database', 'proficiency': 87, 'icon_class': 'fas fa-server'},
        {'name': 'Elasticsearch', 'category': 'database', 'proficiency': 78, 'icon_class': 'fas fa-search'},
        
        # DevOps Skills
        {'name': 'Docker', 'category': 'devops', 'proficiency': 88, 'icon_class': 'fab fa-docker'},
        {'name': 'Kubernetes', 'category': 'devops', 'proficiency': 82, 'icon_class': 'fas fa-dharmachakra'},
        {'name': 'AWS', 'category': 'devops', 'proficiency': 85, 'icon_class': 'fab fa-aws'},
        {'name': 'Heroku', 'category': 'devops', 'proficiency': 90, 'icon_class': 'fas fa-cloud'},
        {'name': 'Vercel', 'category': 'devops', 'proficiency': 89, 'icon_class': 'fas fa-rocket'},
        {'name': 'GitHub Actions', 'category': 'devops', 'proficiency': 86, 'icon_class': 'fab fa-github'},
        {'name': 'Jenkins', 'category': 'devops', 'proficiency': 79, 'icon_class': 'fas fa-cogs'},
        {'name': 'Linux', 'category': 'devops', 'proficiency': 87, 'icon_class': 'fab fa-linux'},
        {'name': 'Nginx', 'category': 'devops', 'proficiency': 81, 'icon_class': 'fas fa-server'},
        
        # Tools Skills
        {'name': 'Git', 'category': 'tools', 'proficiency': 95, 'icon_class': 'fab fa-git-alt'},
        {'name': 'VS Code', 'category': 'tools', 'proficiency': 96, 'icon_class': 'fas fa-code'},
        {'name': 'Postman', 'category': 'tools', 'proficiency': 92, 'icon_class': 'fas fa-paper-plane'},
        {'name': 'Figma', 'category': 'tools', 'proficiency': 83, 'icon_class': 'fab fa-figma'},
        {'name': 'Jupyter', 'category': 'tools', 'proficiency': 89, 'icon_class': 'fas fa-book'},
        {'name': 'Slack', 'category': 'tools', 'proficiency': 91, 'icon_class': 'fab fa-slack'},
        {'name': 'Jira', 'category': 'tools', 'proficiency': 84, 'icon_class': 'fab fa-jira'},
        {'name': 'Notion', 'category': 'tools', 'proficiency': 88, 'icon_class': 'fas fa-sticky-note'},
    ]
    
    print("=== ADDING TECHNICAL SKILLS ===\n")
    
    # Clear existing skills (optional)
    existing_count = Skill.objects.count()
    if existing_count > 0:
        Skill.objects.all().delete()
        print(f"🗑️  Cleared {existing_count} existing skills")
    
    # Add new skills
    created_count = 0
    categories_count = {}
    
    for skill_data in skills_data:
        skill = Skill.objects.create(**skill_data)
        category = skill_data['category']
        
        if category not in categories_count:
            categories_count[category] = 0
        categories_count[category] += 1
        
        created_count += 1
        print(f"✅ Added {skill_data['name']} ({skill_data['proficiency']}%) - {category}")
    
    print(f"\n🎉 Successfully added {created_count} technical skills!")
    
    # Display summary by category
    print("\n=== SKILLS SUMMARY BY CATEGORY ===")
    category_names = {
        'ai_ml': 'AI/ML',
        'frontend': 'Frontend',
        'backend': 'Backend', 
        'database': 'Database',
        'devops': 'DevOps',
        'tools': 'Tools'
    }
    
    for category, count in categories_count.items():
        category_display = category_names.get(category, category.title())
        avg_proficiency = Skill.objects.filter(category=category).aggregate(
            avg_prof=django.db.models.Avg('proficiency')
        )['avg_prof']
        
        print(f"{category_display}: {count} skills (Avg: {avg_proficiency:.1f}%)")
    
    print(f"\n📊 Total Skills: {created_count}")
    print(f"💯 Highest Proficiency: {max(s['proficiency'] for s in skills_data)}%")
    print(f"📈 Average Proficiency: {sum(s['proficiency'] for s in skills_data) / len(skills_data):.1f}%")

if __name__ == "__main__":
    try:
        # Import Django's db models for aggregation
        import django.db.models
        add_technical_skills()
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()