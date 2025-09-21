// Main JavaScript functionality
$(document).ready(function() {
    
    // Initialize all components
    initializePortfolio();
    
    function initializePortfolio() {
        // Mobile menu toggle
        setupMobileMenu();
        
        // Form enhancements
        enhanceForms();
        
        // Project filtering
        setupProjectFiltering();
        
        // Blog search functionality
        setupBlogSearch();
        
        // Newsletter subscription
        setupNewsletterForm();
        
        // Theme switcher (if needed)
        setupThemeControls();
        
        // Scroll progress indicator
        setupScrollProgress();
        
        // Lazy loading for images
        setupLazyLoading();
        
        // Cookie consent (if needed)
        setupCookieConsent();
        
        // Contact form validation
        setupContactFormValidation();
        
        // Performance monitoring
        monitorPerformance();
    }
    
    // Mobile menu functionality
    function setupMobileMenu() {
        const navToggler = $('.navbar-toggler');
        const navCollapse = $('.navbar-collapse');
        
        navToggler.on('click', function() {
            $(this).toggleClass('active');
        });
        
        // Close menu when clicking on a link
        $('.nav-link').on('click', function() {
            if (window.innerWidth < 992) {
                navCollapse.collapse('hide');
                navToggler.removeClass('active');
            }
        });
        
        // Close menu when clicking outside
        $(document).on('click', function(e) {
            if (!$(e.target).closest('.navbar').length && navCollapse.hasClass('show')) {
                navCollapse.collapse('hide');
                navToggler.removeClass('active');
            }
        });
    }
    
    // Enhanced form functionality
    function enhanceForms() {
        // Floating labels
        $('.form-control').on('focus blur', function(e) {
            const $this = $(this);
            const $parent = $this.closest('.form-group');
            
            if (e.type === 'focus' || $this.val().length > 0) {
                $parent.addClass('focused');
            } else {
                $parent.removeClass('focused');
            }
        });
        
        // Check for autofilled fields
        setTimeout(function() {
            $('.form-control').each(function() {
                if ($(this).val().length > 0) {
                    $(this).closest('.form-group').addClass('focused');
                }
            });
        }, 100);
        
        // Character count for textareas
        $('.form-control[maxlength]').each(function() {
            const $this = $(this);
            const maxLength = $this.attr('maxlength');
            const $counter = $('<small class="form-text text-muted char-counter"></small>');
            $this.after($counter);
            
            function updateCounter() {
                const currentLength = $this.val().length;
                $counter.text(`${currentLength}/${maxLength} characters`);
                
                if (currentLength > maxLength * 0.9) {
                    $counter.addClass('text-warning');
                } else {
                    $counter.removeClass('text-warning');
                }
            }
            
            $this.on('input', updateCounter);
            updateCounter();
        });
    }
    
    // Project filtering
    function setupProjectFiltering() {
        const $filterButtons = $('.project-filter-btn');
        const $projects = $('.project-card').parent();
        
        $filterButtons.on('click', function(e) {
            e.preventDefault();
            const filter = $(this).data('filter');
            
            // Update active button
            $filterButtons.removeClass('active');
            $(this).addClass('active');
            
            // Filter projects
            $projects.each(function() {
                const $project = $(this);
                const categories = $project.data('categories') || '';
                
                if (filter === 'all' || categories.includes(filter)) {
                    $project.show().addClass('animate__animated animate__fadeIn');
                } else {
                    $project.hide().removeClass('animate__animated animate__fadeIn');
                }
            });
        });
    }
    
    // Blog search functionality
    function setupBlogSearch() {
        const $searchInput = $('#blog-search');
        const $blogPosts = $('.blog-card').parent();
        
        if ($searchInput.length) {
            let searchTimeout;
            
            $searchInput.on('input', function() {
                clearTimeout(searchTimeout);
                const query = $(this).val().toLowerCase();
                
                searchTimeout = setTimeout(function() {
                    $blogPosts.each(function() {
                        const $post = $(this);
                        const title = $post.find('.blog-title').text().toLowerCase();
                        const excerpt = $post.find('.blog-excerpt').text().toLowerCase();
                        
                        if (title.includes(query) || excerpt.includes(query) || query === '') {
                            $post.show().addClass('animate__animated animate__fadeIn');
                        } else {
                            $post.hide().removeClass('animate__animated animate__fadeIn');
                        }
                    });
                }, 300);
            });
        }
    }
    
    // Newsletter subscription
    function setupNewsletterForm() {
        $('#newsletter-form').on('submit', function(e) {
            e.preventDefault();
            const $form = $(this);
            const $email = $form.find('input[type="email"]');
            const $button = $form.find('button[type="submit"]');
            
            // Simple email validation
            const email = $email.val().trim();
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show loading state
            $button.prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i> Subscribing...');
            
            // Simulate API call
            setTimeout(function() {
                showNotification('Thank you for subscribing to our newsletter!', 'success');
                $form[0].reset();
                $button.prop('disabled', false).html('<i class="fas fa-paper-plane"></i> Subscribe');
            }, 1500);
        });
    }
    
    // Theme controls (dark/light mode toggle)
    function setupThemeControls() {
        const $themeToggle = $('.theme-toggle');
        
        $themeToggle.on('click', function() {
            $('body').toggleClass('light-theme dark-theme');
            const isLight = $('body').hasClass('light-theme');
            
            // Save preference
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            
            // Update toggle icon
            $(this).find('i').toggleClass('fa-sun fa-moon');
        });
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            $('body').removeClass('dark-theme').addClass('light-theme');
            $themeToggle.find('i').removeClass('fa-moon').addClass('fa-sun');
        }
    }
    
    // Scroll progress indicator
    function setupScrollProgress() {
        const $progressBar = $('<div class="scroll-progress"></div>');
        $progressBar.css({
            'position': 'fixed',
            'top': '0',
            'left': '0',
            'width': '0%',
            'height': '3px',
            'background': 'linear-gradient(90deg, #00f5ff, #bf00ff)',
            'z-index': '9999',
            'transition': 'width 0.1s ease'
        });
        
        $('body').append($progressBar);
        
        $(window).on('scroll', function() {
            const scrollTop = $(window).scrollTop();
            const docHeight = $(document).height() - $(window).height();
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            $progressBar.css('width', scrollPercent + '%');
        });
    }
    
    // Lazy loading for images
    function setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
    
    // Cookie consent
    function setupCookieConsent() {
        if (!localStorage.getItem('cookieConsent')) {
            const $cookieBanner = $(`
                <div class="cookie-banner">
                    <div class="container">
                        <div class="row align-items-center">
                            <div class="col-md-8">
                                <p class="mb-0">We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.</p>
                            </div>
                            <div class="col-md-4 text-md-end mt-2 mt-md-0">
                                <button class="btn btn-outline-neon btn-sm me-2" id="cookie-decline">Decline</button>
                                <button class="btn btn-neon btn-sm" id="cookie-accept">Accept</button>
                            </div>
                        </div>
                    </div>
                </div>
            `);
            
            $cookieBanner.css({
                'position': 'fixed',
                'bottom': '0',
                'left': '0',
                'right': '0',
                'background': 'rgba(26, 26, 26, 0.95)',
                'border-top': '1px solid rgba(0, 245, 255, 0.3)',
                'backdrop-filter': 'blur(20px)',
                'z-index': '9998',
                'padding': '1rem 0'
            });
            
            $('body').append($cookieBanner);
            
            $('#cookie-accept, #cookie-decline').on('click', function() {
                localStorage.setItem('cookieConsent', $(this).attr('id') === 'cookie-accept' ? 'accepted' : 'declined');
                $cookieBanner.fadeOut();
            });
        }
    }
    
    // Contact form validation
    function setupContactFormValidation() {
        $('#contactForm').on('submit', function(e) {
            let isValid = true;
            
            // Remove previous error states
            $('.form-group').removeClass('has-error');
            $('.error-message').remove();
            
            // Validate required fields
            $(this).find('[required]').each(function() {
                const $field = $(this);
                const $group = $field.closest('.form-group');
                
                if (!$field.val().trim()) {
                    $group.addClass('has-error');
                    $group.append('<small class="error-message text-danger">This field is required.</small>');
                    isValid = false;
                }
            });
            
            // Validate email format
            const $email = $(this).find('input[type="email"]');
            if ($email.val() && !isValidEmail($email.val())) {
                $email.closest('.form-group').addClass('has-error');
                $email.closest('.form-group').append('<small class="error-message text-danger">Please enter a valid email address.</small>');
                isValid = false;
            }
            
            // Validate phone number
            const $phone = $(this).find('input[type="tel"]');
            if ($phone.val() && !isValidPhone($phone.val())) {
                $phone.closest('.form-group').addClass('has-error');
                $phone.closest('.form-group').append('<small class="error-message text-danger">Please enter a valid phone number.</small>');
                isValid = false;
            }
            
            // Validate captcha
            const $captcha = $(this).find('input[name="captcha"]');
            if ($captcha.val() != 8) {
                $captcha.closest('.form-group').addClass('has-error');
                $captcha.closest('.form-group').append('<small class="error-message text-danger">Incorrect answer. 5 + 3 = ?</small>');
                isValid = false;
            }
            
            if (!isValid) {
                e.preventDefault();
                // Scroll to first error
                const $firstError = $('.has-error').first();
                if ($firstError.length) {
                    $('html, body').animate({
                        scrollTop: $firstError.offset().top - 100
                    }, 500);
                }
            }
        });
    }
    
    // Performance monitoring
    function monitorPerformance() {
        // Monitor page load time
        window.addEventListener('load', function() {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log('Page load time:', loadTime + 'ms');
            
            // Log slow loading times
            if (loadTime > 3000) {
                console.warn('Slow page load detected:', loadTime + 'ms');
            }
        });
        
        // Monitor JavaScript errors
        window.addEventListener('error', function(e) {
            console.error('JavaScript error:', e.error);
        });
    }
    
    // Utility functions
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }
    
    function showNotification(message, type = 'info') {
        const $notification = $(`
            <div class="notification notification-${type}">
                <div class="notification-content">
                    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                    <span>${message}</span>
                    <button class="notification-close">&times;</button>
                </div>
            </div>
        `);
        
        $notification.css({
            'position': 'fixed',
            'top': '20px',
            'right': '20px',
            'background': type === 'success' ? 'rgba(57, 255, 20, 0.1)' : type === 'error' ? 'rgba(255, 20, 147, 0.1)' : 'rgba(0, 245, 255, 0.1)',
            'border': `1px solid ${type === 'success' ? '#39ff14' : type === 'error' ? '#ff1493' : '#00f5ff'}`,
            'color': type === 'success' ? '#39ff14' : type === 'error' ? '#ff1493' : '#00f5ff',
            'padding': '1rem',
            'border-radius': '10px',
            'backdrop-filter': 'blur(20px)',
            'z-index': '10000',
            'transform': 'translateX(100%)',
            'transition': 'transform 0.3s ease'
        });
        
        $('body').append($notification);
        
        setTimeout(() => {
            $notification.css('transform', 'translateX(0)');
        }, 100);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            $notification.css('transform', 'translateX(100%)');
            setTimeout(() => $notification.remove(), 300);
        }, 5000);
        
        // Manual close
        $notification.find('.notification-close').on('click', function() {
            $notification.css('transform', 'translateX(100%)');
            setTimeout(() => $notification.remove(), 300);
        });
    }
    
    // Keyboard shortcuts
    $(document).on('keydown', function(e) {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const $searchInput = $('#blog-search, #site-search');
            if ($searchInput.length) {
                $searchInput.focus();
            }
        }
        
        // ESC to close modals/menus
        if (e.key === 'Escape') {
            $('.navbar-collapse').collapse('hide');
            $('.modal').modal('hide');
        }
    });
    
    // Add CSS for notification styles
    $('<style>')
        .prop('type', 'text/css')
        .html(`
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .notification-close {
                background: none;
                border: none;
                color: inherit;
                font-size: 1.2rem;
                cursor: pointer;
                margin-left: auto;
            }
            .has-error .form-control {
                border-color: #ff1493;
                box-shadow: 0 0 0 3px rgba(255, 20, 147, 0.1);
            }
            .error-message {
                display: block;
                margin-top: 0.5rem;
            }
        `)
        .appendTo('head');
});

// Service Worker registration for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}