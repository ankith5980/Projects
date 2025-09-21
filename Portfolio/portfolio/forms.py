from django import forms
from django.core.validators import RegexValidator
from .models import Contact, Newsletter


class ContactForm(forms.ModelForm):
    """Contact form with enhanced validation and styling"""
    
    # Override fields with custom widgets and validation
    name = forms.CharField(
        max_length=100,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Your full name',
            'required': True
        }),
        label="Full Name"
    )
    
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={
            'class': 'form-control',
            'placeholder': 'your.email@example.com',
            'required': True
        }),
        label="Email Address"
    )
    
    phone_number = forms.CharField(
        max_length=17,
        required=False,
        validators=[RegexValidator(
            regex=r'^\+?1?\d{9,15}$',
            message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
        )],
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': '+1234567890',
            'type': 'tel'
        }),
        label="Phone Number (Optional)"
    )
    
    message = forms.CharField(
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            'placeholder': 'Tell me about your project or what you\'d like to discuss...',
            'rows': 6,
            'required': True,
            'maxlength': 2000
        }),
        label="Message"
    )
    
    # Additional fields for security and categorization
    subject = forms.ChoiceField(
        choices=[
            ('', 'Select a subject'),
            ('project', 'Project Inquiry'),
            ('collaboration', 'Collaboration'),
            ('job', 'Job Opportunity'),
            ('consultation', 'Consultation'),
            ('other', 'Other'),
        ],
        required=False,
        widget=forms.Select(attrs={
            'class': 'form-control'
        }),
        label="Subject"
    )
    
    # Honeypot field for spam protection (hidden via CSS)
    website = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={
            'style': 'display:none;',
            'tabindex': '-1',
            'autocomplete': 'off'
        })
    )
    
    # Simple math captcha
    captcha = forms.IntegerField(
        widget=forms.NumberInput(attrs={
            'class': 'form-control',
            'placeholder': 'Enter the answer',
            'min': '0',
            'max': '20'
        }),
        label="Security Check: What is 5 + 3?",
        help_text="Please solve this simple math problem to verify you're human."
    )
    
    class Meta:
        model = Contact
        fields = ['name', 'email', 'phone_number', 'message']
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        # Add CSS classes to all fields
        for field_name, field in self.fields.items():
            if field_name not in ['website']:  # Skip honeypot field
                field.widget.attrs.update({
                    'class': field.widget.attrs.get('class', '') + ' form-control'
                })
    
    def clean_captcha(self):
        """Validate the captcha answer"""
        captcha = self.cleaned_data.get('captcha')
        if captcha != 8:  # 5 + 3 = 8
            raise forms.ValidationError("Incorrect answer. Please try again.")
        return captcha
    
    def clean_website(self):
        """Check honeypot field for spam"""
        website = self.cleaned_data.get('website')
        if website:
            raise forms.ValidationError("Spam detected.")
        return website
    
    def clean_message(self):
        """Clean and validate message content"""
        message = self.cleaned_data.get('message')
        
        if message:
            # Remove excessive whitespace
            message = ' '.join(message.split())
            
            # Check for spam-like content
            spam_keywords = ['viagra', 'casino', 'lottery', 'winner', 'congratulations', 'click here']
            message_lower = message.lower()
            
            for keyword in spam_keywords:
                if keyword in message_lower:
                    raise forms.ValidationError("Your message appears to contain spam content.")
            
            # Minimum message length
            if len(message) < 10:
                raise forms.ValidationError("Please provide a more detailed message (at least 10 characters).")
        
        return message
    
    def clean_email(self):
        """Clean and validate email"""
        email = self.cleaned_data.get('email')
        
        if email:
            email = email.lower().strip()
            
            # Check for disposable email domains (basic list)
            disposable_domains = [
                '10minutemail.com', 'tempmail.org', 'guerrillamail.com',
                'mailinator.com', 'throwaway.email'
            ]
            
            email_domain = email.split('@')[-1]
            if email_domain in disposable_domains:
                raise forms.ValidationError("Please use a permanent email address.")
        
        return email


class NewsletterForm(forms.ModelForm):
    """Newsletter subscription form"""
    
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={
            'class': 'form-control',
            'placeholder': 'Enter your email address',
            'required': True
        }),
        label="Email Address"
    )
    
    class Meta:
        model = Newsletter
        fields = ['email']
    
    def clean_email(self):
        """Validate email and check for duplicates"""
        email = self.cleaned_data.get('email')
        
        if email:
            email = email.lower().strip()
            
            # Check if already subscribed
            if Newsletter.objects.filter(email=email, is_active=True).exists():
                raise forms.ValidationError("This email is already subscribed to our newsletter.")
        
        return email


class ProjectFilterForm(forms.Form):
    """Form for filtering projects by category or technology"""
    
    CATEGORY_CHOICES = [
        ('all', 'All Projects'),
        ('ai_ml', 'AI/ML'),
        ('web', 'Web Development'),
        ('mobile', 'Mobile Apps'),
        ('desktop', 'Desktop Applications'),
        ('api', 'APIs & Backend'),
        ('data', 'Data Science'),
    ]
    
    category = forms.ChoiceField(
        choices=CATEGORY_CHOICES,
        required=False,
        widget=forms.Select(attrs={
            'class': 'form-select',
            'onchange': 'filterProjects()'
        })
    )
    
    search = forms.CharField(
        max_length=100,
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Search projects...',
            'oninput': 'searchProjects()'
        })
    )


class BlogSearchForm(forms.Form):
    """Form for searching blog posts"""
    
    search = forms.CharField(
        max_length=200,
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Search articles...',
            'id': 'blog-search'
        }),
        label="Search Articles"
    )