document.addEventListener('DOMContentLoaded', () => {
    /* =========================================
       Custom Cursor Logic
       ========================================= */
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');

    // Check if device supports hover (desktop)
    if (window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Dot follows exactly
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Outline follows with a slight delay for smooth effect
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });

            // Global background mask
            document.body.style.setProperty('--cursor-x', `${posX}px`);
            document.body.style.setProperty('--cursor-y', `${posY}px`);
        });

        // Add hover effects for interactive elements
        const interactables = document.querySelectorAll('a, button, input, textarea');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorOutline.style.backgroundColor = 'rgba(139, 92, 246, 0.1)';
            });

            el.addEventListener('mouseleave', () => {
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorOutline.style.backgroundColor = 'transparent';
            });
        });
    }

    /* =========================================
       Sticky Navigation
       ========================================= */
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.pill-nav .nav-link');

    window.addEventListener('scroll', () => {
        // Sticky Navigation Background (Optional, if you still use it)
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active Link Switching on Scroll
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Activate when scrolled a third of the way into the section
            if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (current && link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    /* =========================================
       Scroll Reveal Animations
       ========================================= */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-up, .fade-in, .fade-left');
    animatedElements.forEach(el => observer.observe(el));

    /* =========================================
       Form Submission (Prevent Default for Demo)
       ========================================= */
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;

            btn.innerHTML = '<span>Sent Successfully!</span> <i class="fas fa-check"></i>';
            btn.style.background = 'linear-gradient(135deg, #FFD500, #F39C12)';

            contactForm.reset();

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
            }, 3000);
        });
    }

    /* =========================================
       Language Cycler (Typing Effect)
       ========================================= */
    const helloText = document.getElementById('hello-text');
    if (helloText) {
        // English - Hindi - Spanish - French - German - Italian
        const languages = ["HELLO", "NAMASTE", "HOLA", "BONJOUR", "HALLO", "CIAO"];
        let langIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeWriter() {
            const currentWord = languages[langIndex];
            
            if (isDeleting) {
                helloText.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                helloText.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            // Typing speed logic
            let typeSpeed = isDeleting ? 50 : 150;

            // If word is completely typed, pause before deleting
            if (!isDeleting && charIndex === currentWord.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } 
            // If word is completely deleted, switch to next word and pause before typing
            else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                langIndex = (langIndex + 1) % languages.length;
                typeSpeed = 500;
            }

            setTimeout(typeWriter, typeSpeed);
        }

        // Start typing effect
        helloText.textContent = "";
        setTimeout(typeWriter, 1000);
    }

    /* =========================================
       Dynamic 3D Parallax Tilt for Hero Image
       ========================================= */
    const heroImageBox = document.querySelector('.hero-image-box');
    if (heroImageBox) {
        heroImageBox.addEventListener('mousemove', (e) => {
            const rect = heroImageBox.getBoundingClientRect();
            // Calculate mouse position relative to center of box (-1 to 1)
            const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
            const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
            
            // Calculate rotation amounts (max 15 degrees)
            const rotateX = -y * 15; // Moving mouse up (y<0) rotates X positively (top tilts away)
            const rotateY = x * 15;  // Moving mouse right (x>0) rotates Y positively (right tilts away)

            heroImageBox.style.setProperty('--tilt-x', `${rotateX}deg`);
            heroImageBox.style.setProperty('--tilt-y', `${rotateY}deg`);
        });

        heroImageBox.addEventListener('mouseleave', () => {
            heroImageBox.style.setProperty('--tilt-x', `0deg`);
            heroImageBox.style.setProperty('--tilt-y', `0deg`);
        });
    }

    /* =========================================
       Projects Deck Click-to-Swap Logic
       ========================================= */
    const projectCards = document.querySelectorAll('.projects-deck .project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('click', function() {
            // If the clicked card is already the center, do nothing
            if (this.classList.contains('card-center')) return;

            // Find the current center card
            const currentCenter = document.querySelector('.projects-deck .card-center');
            
            // Determine the position class of the clicked card (card-left or card-right)
            const clickedClass = this.classList.contains('card-left') ? 'card-left' : 'card-right';

            // Swap classes
            this.classList.remove(clickedClass);
            this.classList.add('card-center');
            
            currentCenter.classList.remove('card-center');
            currentCenter.classList.add(clickedClass);
        });
    });
});
