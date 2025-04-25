// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initContactForm();
    initProjects();
    initMobileMenu();
    initReviewsSlider();
});

// Navigation functionality
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Only handle internal links
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const headerOffset = 100;
                    const elementPosition = targetSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Contact form handling
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                message: document.getElementById('message').value.trim()
            };
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                showFormMessage('Please enter a valid email address', 'error');
                return;
            }
            
            // Validate all fields
            if (!formData.name || !formData.email || !formData.message) {
                showFormMessage('Please fill in all fields', 'error');
                return;
            }
            
            try {
                // Simulate API call
                await submitForm(formData);
                showFormMessage('Thank you for your message! We will get back to you soon.', 'success');
                contactForm.reset();
            } catch (error) {
                showFormMessage('There was an error sending your message. Please try again.', 'error');
            }
        });
    }
}

function showFormMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;
    
    const form = document.getElementById('contactForm');
    form.appendChild(messageDiv);
    
    setTimeout(() => messageDiv.remove(), 5000);
}

async function submitForm(data) {
    // Simulate API call
    return new Promise((resolve) => {
        setTimeout(() => resolve({ success: true }), 1000);
    });
}

// Project interactions
function initProjects() {
    const projects = document.querySelectorAll('.project');
    
    projects.forEach(project => {
        project.addEventListener('mouseenter', function() {
            this.querySelector('.project-image').style.transform = 'scale(1.05)';
        });
        
        project.addEventListener('mouseleave', function() {
            this.querySelector('.project-image').style.transform = 'scale(1)';
        });
        
        project.addEventListener('click', function() {
            const projectTitle = this.querySelector('.project-title').textContent;
            navigateToProject(projectTitle);
        });
    });
}

function navigateToProject(projectTitle) {
    // Implement project navigation logic here
    console.log('Navigating to project:', projectTitle);
}

// Mobile menu handling
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;
    
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            body.classList.toggle('menu-open');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                body.classList.remove('menu-open');
            }
        });
    }
}

// Reviews slider with touch support
function initReviewsSlider() {
    const reviewsGrid = document.querySelector('.reviews-grid');
    const dots = document.querySelectorAll('.slider-dot');
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (reviewsGrid && dots.length) {
        // Touch events for mobile
        reviewsGrid.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        reviewsGrid.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                scrollToReview(index);
            });
        });

        // Auto-scroll every 5 seconds
        let autoScrollInterval = setInterval(() => autoScroll(), 5000);
        
        // Pause auto-scroll on hover
        reviewsGrid.addEventListener('mouseenter', () => {
            clearInterval(autoScrollInterval);
        });
        
        reviewsGrid.addEventListener('mouseleave', () => {
            autoScrollInterval = setInterval(() => autoScroll(), 5000);
        });
    }
}

function handleSwipe() {
    const SWIPE_THRESHOLD = 50;
    const difference = touchStartX - touchEndX;
    const reviewsGrid = document.querySelector('.reviews-grid');
    const dots = document.querySelectorAll('.slider-dot');
    const currentIndex = getCurrentReviewIndex();

    if (Math.abs(difference) > SWIPE_THRESHOLD) {
        if (difference > 0 && currentIndex < dots.length - 1) {
            // Swipe left
            scrollToReview(currentIndex + 1);
        } else if (difference < 0 && currentIndex > 0) {
            // Swipe right
            scrollToReview(currentIndex - 1);
        }
    }
}

function getCurrentReviewIndex() {
    const reviewsGrid = document.querySelector('.reviews-grid');
    const scrollPercentage = reviewsGrid.scrollLeft / (reviewsGrid.scrollWidth - reviewsGrid.clientWidth);
    const dots = document.querySelectorAll('.slider-dot');
    return Math.round(scrollPercentage * (dots.length - 1));
}

function scrollToReview(index) {
    const reviewsGrid = document.querySelector('.reviews-grid');
    const dots = document.querySelectorAll('.slider-dot');
    
    const scrollPosition = reviewsGrid.scrollWidth * (index / dots.length);
    reviewsGrid.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
    });

    updateDots(index);
}

function updateDots(activeIndex) {
    const dots = document.querySelectorAll('.slider-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === activeIndex);
    });
}

function autoScroll() {
    const currentIndex = getCurrentReviewIndex();
    const dots = document.querySelectorAll('.slider-dot');
    const nextIndex = (currentIndex + 1) % dots.length;
    scrollToReview(nextIndex);
}