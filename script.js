document.addEventListener('DOMContentLoaded', () => {

    // Global variables for DOM elements
    const header = document.getElementById('main-header');
    const navLinks = document.querySelectorAll('#navbar a');
    const menuToggle = document.querySelector('.menu-toggle');
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // ----------------------------------------------------------------------
    // 1. Navbar Animation, Smooth Scroll, and Active Link Update
    // ----------------------------------------------------------------------

    /**
     * Updates the active navigation link based on the current scroll position.
     */
    const updateNavLinks = () => {
        let currentSectionId = '';
        const headerHeight = header.offsetHeight;
        
        // Find the section currently in view
        sections.forEach(section => {
            // Offset scroll position to account for the fixed header
            const sectionTop = section.offsetTop - headerHeight - 100; 
            if (scrollY >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // Set 'active' class on corresponding nav link
        navLinks.forEach(link => {
            link.classList.remove('active');
            // Check if the link href includes the current section ID
            if (link.href.includes(currentSectionId) && currentSectionId) {
                link.classList.add('active');
            }
        });
    };

    /**
     * Handles header shrink/glass effect on scroll and calls updateNavLinks.
     */
    const handleScroll = () => {
        // Toggle 'scrolled' class for CSS glassmorphism effect
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        updateNavLinks(); 
    };

    // Attach scroll and resize listeners
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', updateNavLinks); 
    handleScroll(); // Initial check on page load

    // Smooth Scroll implementation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            const offset = header.offsetHeight; 

            // Scroll to the target element with offset
            window.scrollTo({
                top: targetElement.offsetTop - offset + 1, 
                behavior: 'smooth'
            });

            // Close mobile menu if open
            if (navbar.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });

    // Mobile Menu Toggle Logic
    const toggleMobileMenu = () => {
        navbar.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        // Toggle between hamburger (fa-bars) and close (fa-times) icons
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times'); 
    }

    menuToggle.addEventListener('click', toggleMobileMenu);

    // ----------------------------------------------------------------------
    // 2. Theme Toggle (Dark/Light Mode)
    // ----------------------------------------------------------------------
    
    // Check local storage for previous theme, default to 'dark'
    const currentTheme = localStorage.getItem('theme') || 'dark';

    // Set initial theme and icon on page load
    const applyTheme = (theme) => {
        const isLight = theme === 'light';
        body.classList.toggle('light-mode', isLight);
        themeToggle.querySelector('i').classList.toggle('fa-sun', !isLight);
        themeToggle.querySelector('i').classList.toggle('fa-moon', isLight);
    };

    applyTheme(currentTheme);

    // Event listener for theme button click
    themeToggle.addEventListener('click', () => {
        const newTheme = body.classList.contains('light-mode') ? 'dark' : 'light';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // ----------------------------------------------------------------------
    // 3. Interactive Animations (Typing Effect & Scroll Reveal)
    // ----------------------------------------------------------------------

    // a) Typing Effect for Hero Title
    const typingTextElement = document.getElementById('typingText');
    const titles = ['Software Engineering Undergraduate','Full-Stack Web Enthusiast','Problem Solver','Future Network Architect'];

    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeText() {
        if (!typingTextElement) return;

        const currentTitle = titles[titleIndex];
        
        if (isDeleting) {
            typingTextElement.textContent = currentTitle.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingTextElement.textContent = currentTitle.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typingSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === currentTitle.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at the end of the phrase
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length; // Move to next phrase
            typingSpeed = 500; // Pause before starting the next phrase
        }

        setTimeout(typeText, typingSpeed);
    }

    // Start the typing animation
    typeText();


    // b) Intersection Observer for Fade-in Animations and Skill Bars
    const elementsToObserve = [
        ...document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right'),
        ...document.querySelectorAll('.skill-bar')
    ];

    const observerOptions = {
        root: null,
        threshold: 0.2, // Trigger when 20% of the element is visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 1. General Fade-in/Directional Animation
                entry.target.classList.add('is-visible');

                // 2. Skill Bar Animation
                if (entry.target.classList.contains('skill-bar')) {
                    const level = entry.target.dataset.level;
                    // Apply the final width to trigger the CSS transition
                    entry.target.style.width = level; 
                }

                // Stop observing once visible
                observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all required elements
    elementsToObserve.forEach(el => observer.observe(el)); 


   // ----------------------------------------------------------------------
    // 4. Contact Form Submission (Using EmailJS)
    // ----------------------------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    const EMAILJS_SERVICE_ID = 'service_y6n423u'; 
    const EMAILJS_TEMPLATE_ID = 'template_mu92wr5'; 
    const EMAILJS_PUBLIC_KEY = '-XPbUFNnB3TG1N7Gz'; 
    const RECEIVING_EMAIL = 'himashadevakaluarachchi@gmail.com'; 
    // -----------------------------

    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }


    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // 1. Client-side validation check
        if (!contactForm.checkValidity()) {
            formStatus.style.color = '#FF4444'; 
            formStatus.textContent = 'Please fill out all required fields correctly.';
            return;
        }

        const submitButton = contactForm.querySelector('.submit-button');
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        formStatus.textContent = ''; 

        // 2. Prepare the data payload (Template Parameters)
        const templateParams = {
            user_name: document.getElementById('name').value, 
            user_email: document.getElementById('email').value, 
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value,
            
            // This is added to ensure the correct recipient is used in the template
            recipient_email: RECEIVING_EMAIL,
        };

        // 3. Send the email using the EmailJS SDK
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
            .then((response) => {
                console.log('SUCCESS!', response.status, response.text);
                
                // Show success message
                formStatus.style.color = 'var(--accent-color)';
                formStatus.textContent = 'Success! Your message has been sent. I will be in touch soon.';
                contactForm.reset(); 
            }, (error) => {
                console.error('FAILED...', error);
                
                // Show failure message
                formStatus.style.color = '#FF4444'; 
                formStatus.textContent = 'Failed to send message. Please ensure your EmailJS template is correct.';
            })
            .finally(() => {
                // Re-enable button and clear status after 5 seconds
                submitButton.disabled = false;
                submitButton.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
                setTimeout(() => {
                    formStatus.textContent = '';
                }, 5000);
            });
    });

});