// Modern Navbar Functionality
class WasteWiseNavbar {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.navToggle = document.getElementById('nav-toggle');
        this.navLinks = document.getElementById('nav-links');
        this.navItems = document.querySelectorAll('.nav-link');
        
        this.init();
    }

    init() {
        this.handleScrollEffect();
        this.handleMobileToggle();
        this.highlightActiveLink();
        this.handleSmoothScroll();
    }

    // Add scroll effect to navbar
    handleScrollEffect() {
        if (!this.navbar) return;

        const handleScroll = () => {
            if (window.scrollY > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Check on load
        handleScroll();
    }

    // Handle mobile navigation toggle
    handleMobileToggle() {
        if (!this.navToggle || !this.navLinks) return;

        this.navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            const isOpen = this.navLinks.classList.contains('active');
            
            // Toggle menu
            this.navLinks.classList.toggle('active');
            
            // Update aria-expanded
            this.navToggle.setAttribute('aria-expanded', String(!isOpen));
            
            // Change icon
            const icon = this.navToggle.querySelector('i');
            if (icon) {
                icon.className = !isOpen ? 'fa-solid fa-times' : 'fa-solid fa-bars';
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navToggle.contains(e.target) && !this.navLinks.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Close menu when clicking on nav links
        this.navItems.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.navLinks.classList.contains('active')) {
                this.closeMenu();
            }
        });
    }

    closeMenu() {
        if (!this.navLinks || !this.navToggle) return;
        
        this.navLinks.classList.remove('active');
        this.navToggle.setAttribute('aria-expanded', 'false');
        
        const icon = this.navToggle.querySelector('i');
        if (icon) {
            icon.className = 'fa-solid fa-bars';
        }
    }

    // Highlight active navigation link based on current page
    highlightActiveLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        this.navItems.forEach(link => {
            link.classList.remove('active');
            
            const linkHref = link.getAttribute('href');
            if (linkHref === currentPage || 
                (currentPage === '' && linkHref === 'index.html') ||
                (currentPage === '/' && linkHref === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    // Add smooth scroll behavior for anchor links
    handleSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href').slice(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    
                    // Close mobile menu if open
                    this.closeMenu();
                    
                    // Smooth scroll to target
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Initialize navbar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WasteWiseNavbar();
});

// Back to top functionality (reusable across pages)
class BackToTop {
    constructor() {
        this.button = this.createButton();
        this.init();
    }

    createButton() {
        const existingBtn = document.getElementById('back-to-top');
        if (existingBtn) return existingBtn;

        const btn = document.createElement('button');
        btn.id = 'back-to-top';
        btn.className = 'back-to-top';
        btn.setAttribute('aria-label', 'Back to top');
        btn.innerHTML = '↑';
        
        // Add styles
        Object.assign(btn.style, {
            position: 'fixed',
            right: '20px',
            bottom: '20px',
            background: 'var(--green-theme-color)',
            color: 'white',
            border: 'none',
            padding: '12px 15px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: 'bold',
            display: 'none',
            zIndex: '1000',
            boxShadow: '0 4px 12px rgba(70, 215, 84, 0.3)',
            transition: 'all 0.3s ease'
        });

        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-3px)';
            btn.style.boxShadow = '0 6px 20px rgba(70, 215, 84, 0.4)';
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0)';
            btn.style.boxShadow = '0 4px 12px rgba(70, 215, 84, 0.3)';
        });

        document.body.appendChild(btn);
        return btn;
    }

    init() {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                this.button.style.display = 'block';
            } else {
                this.button.style.display = 'none';
            }
        });

        // Scroll to top when clicked
        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Initialize back to top button
document.addEventListener('DOMContentLoaded', () => {
    new BackToTop();
});