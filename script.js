// Theme switching functionality
const themeBtn = document.getElementById('theme-btn');
const body = document.body;
let isDarkMode = true;

// Photo system - two variables for photo addresses
let darkThemePhoto = 'profile-dark.JPG';  // Photo shown in dark theme
let lightThemePhoto = 'profile-light.JPG'; // Photo shown in light theme
let scrollCounter = 1; // Start at 1 so first scroll down triggers flip

// Check for saved theme preference or default to dark mode
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    isDarkMode = savedTheme === 'dark';
    updateTheme();
}

themeBtn.addEventListener('change', () => {
    isDarkMode = !isDarkMode;
    updateTheme();
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
});

function updateTheme() {
    if (isDarkMode) {
        body.removeAttribute('data-theme');
        themeBtn.checked = false;
        // Show dark theme photo
        showDarkModePhoto();
        // Update background words to dark theme colors
        updateBackgroundWordsTheme('dark');
    } else {
        body.setAttribute('data-theme', 'light');
        themeBtn.checked = true;
        // Show light theme photo
        showLightModePhoto();
        // Update background words to light theme colors
        updateBackgroundWordsTheme('light');
    }
}

// Navbar underline animation and active section detection
const navLinks = document.querySelectorAll('.nav-link');
const navUnderline = document.querySelector('.nav-underline');
const sections = document.querySelectorAll('.section');

// Initialize underline position
function updateUnderline() {
    const activeLink = document.querySelector('.nav-link.active');
    if (activeLink) {
        const rect = activeLink.getBoundingClientRect();
        const navRect = document.querySelector('.navbar').getBoundingClientRect();
        
        // Check if we're on mobile (navbar is stacked vertically)
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // On mobile, position underline below the active link
            navUnderline.style.width = `${rect.width}px`;
            navUnderline.style.left = `${rect.left - navRect.left}px`;
            navUnderline.style.top = `${rect.bottom - navRect.top + 5}px`; // Position below the link
            navUnderline.style.bottom = 'auto';
        } else {
            // On desktop, position underline closer to the text
            navUnderline.style.width = `${rect.width}px`;
            navUnderline.style.left = `${rect.left - navRect.left}px`;
            navUnderline.style.top = 'auto';
            navUnderline.style.bottom = '8px';
        }
    } else {
        // No active link (we're in hero section), hide the underline
        navUnderline.style.width = '0';
    }
}

// Update active section based on scroll position
function updateActiveSection() {
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    
    // Check if we're in the hero section (before any navigation sections)
    const heroSection = document.getElementById('hero');
    if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        
        if (scrollPosition < heroBottom) {
            // We're in the hero section, remove active class from all links
            navLinks.forEach(link => link.classList.remove('active'));
            // Hide the underline
            navUnderline.style.width = '0';
            return;
        }
    }
    
    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            // Remove active class from all links
            navLinks.forEach(link => link.classList.remove('active'));
            
            // Add active class to corresponding link
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`[data-section="${sectionId}"]`);
            if (correspondingLink) {
                correspondingLink.classList.add('active');
                updateUnderline();
            }
        }
    });
}

// No entrance animation needed - CSS handles it

// Update hero section scroll animation
function updateHeroScrollAnimation() {
    const heroSection = document.getElementById('hero');
    if (!heroSection) return;
    
    const scrollY = window.scrollY;
    const heroHeight = heroSection.offsetHeight;
    const heroTop = heroSection.offsetTop;
    
    // Calculate how far we've scrolled through the hero section (0 to 1)
    const scrollProgress = Math.min(Math.max((scrollY - heroTop) / heroHeight, 0), 1);
    
    // Get the name elements
    const firstName = document.querySelector('.first-name');
    const lastName = document.querySelector('.last-name');
    
    if (firstName && lastName) {
        // Check if initial entrance animation is complete (after 2.5 seconds total)
        const timeSinceLoad = Date.now() - (window.pageLoadTime || Date.now());
        const initialAnimationComplete = timeSinceLoad > 2500;
        
        if (initialAnimationComplete) {
            // Handle scroll-based exit animation
            if (scrollProgress > 0) {
                // Move first name further right (continuing its initial direction from left to center)
                const firstNameTransform = scrollProgress * 100; // From 0 to 100vw (right)
                firstName.style.setProperty('transform', `translateX(${firstNameTransform}vw)`, 'important');
                
                // Move last name further left (continuing its initial direction from right to center)
                const lastNameTransform = -(scrollProgress * 100); // From 0 to -100vw (left)
                lastName.style.setProperty('transform', `translateX(${lastNameTransform}vw)`, 'important');
                
                // Fade out opacity as we scroll
                const opacity = 1 - scrollProgress;
                firstName.style.setProperty('opacity', opacity, 'important');
                lastName.style.setProperty('opacity', opacity, 'important');
            } else {
                // When back at the top, reset names to center position
                firstName.style.setProperty('transform', 'translateX(0)', 'important');
                lastName.style.setProperty('transform', 'translateX(0)', 'important');
                firstName.style.setProperty('opacity', '1', 'important');
                lastName.style.setProperty('opacity', '1', 'important');
            }
        }
    }
    
    // Update info icon opacity based on scroll
    updateInfoIconOpacity(scrollProgress);
}

// Update info icon opacity based on scroll progress
function updateInfoIconOpacity(scrollProgress) {
    const infoIcon = document.getElementById('info-icon');
    if (!infoIcon) return;
    
    // Start fading out when scroll begins, completely fade out by 50% scroll
    const fadeStart = 0;
    const fadeEnd = 0.5;
    
    if (scrollProgress <= fadeStart) {
        // At the top, fully visible
        infoIcon.style.opacity = '1';
    } else if (scrollProgress >= fadeEnd) {
        // Past fade end, completely hidden
        infoIcon.style.opacity = '0';
    } else {
        // During fade, calculate opacity
        const fadeProgress = (scrollProgress - fadeStart) / (fadeEnd - fadeStart);
        const opacity = 1 - fadeProgress;
        infoIcon.style.opacity = opacity.toString();
    }
}



// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            const isContact = targetId === 'contact';
            if (isContact) {
                // Position contact section to match the visual layout exactly
                const sectionTop = targetSection.offsetTop;
                const navbarHeight = 80; // Account for fixed navbar
                const titleOffset = 80; // Match the scroll-margin-top used by other sections
                
                const targetTop = sectionTop - navbarHeight + titleOffset;
                
                window.scrollTo({ top: targetTop, behavior: 'smooth' });
            } else {
                const targetPosition = targetSection.offsetTop - 65; // Scroll further down for better positioning
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Update underline position on window resize
window.addEventListener('resize', () => {
    // Add a small delay to ensure layout has fully adjusted
    setTimeout(() => {
        updateUnderline();
        updateHeroScrollAnimation();
    }, 100);
});

// Handle orientation change on mobile devices
window.addEventListener('orientationchange', () => {
    // Add a longer delay for orientation changes
    setTimeout(() => {
        updateUnderline();
        updateHeroScrollAnimation();
    }, 300);
});

// Update active section and underline on scroll
window.addEventListener('scroll', () => {
    updateActiveSection();
    updateHeroScrollAnimation();
});

// Initialize EmailJS
(function() {
    emailjs.init("5qJ-qZdE_OSefij_X"); // You'll add your EmailJS public key here
})();

// Handle contact form submission
document.addEventListener('DOMContentLoaded', () => {
    // Set page load time for hero animation timing
    window.pageLoadTime = Date.now();
    
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            // Send email using EmailJS
            emailjs.send('service_luvoo37', 'template_crw12yb', formData)
                .then(function(response) {
                    // Success
                    submitBtn.textContent = 'Message Sent!';
                    submitBtn.style.background = 'var(--text-primary)';
                    submitBtn.style.color = 'var(--bg-primary)';
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Reset button after 3 seconds
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.style.background = 'transparent';
                        submitBtn.style.color = 'var(--text-primary)';
                        submitBtn.disabled = false;
                    }, 3000);
                }, function(error) {
                    // Error
                    submitBtn.textContent = 'Failed to Send';
                    submitBtn.style.background = '#ff4444';
                    
                    // Reset button after 3 seconds
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.style.background = 'transparent';
                        submitBtn.style.color = 'var(--text-primary)';
                        submitBtn.disabled = false;
                    }, 3000);
                });
        });
    }
    
    // Prevent scroll restoration on page reload
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    
    // Don't scroll on page load - let the browser handle it naturally
    // This prevents the mismatch between reload and navigation
    
    updateActiveSection();
    updateUnderline();
    updateHeroScrollAnimation();
    updatePhotoFlip(); // Initialize photo flip state
    
    // Initialize background words system
    initBackgroundWords();
    
    // Initialize info icon click functionality
    initInfoIcon();
});

// Add intersection observer for better performance
const observerOptions = {
    threshold: 0.5,
    rootMargin: '-50px 0px -50px 0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('id');
            const correspondingLink = document.querySelector(`[data-section="${sectionId}"]`);
            
            if (correspondingLink) {
                navLinks.forEach(link => link.classList.remove('active'));
                correspondingLink.classList.add('active');
                updateUnderline();
            }
        }
    });
}, observerOptions);

// Observe all sections
sections.forEach(section => {
    sectionObserver.observe(section);
});

// Simple section detection for navbar highlighting
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Only update if scrolling direction changed significantly
    if (Math.abs(scrollTop - lastScrollTop) > 50) {
        updateActiveSection();
        lastScrollTop = scrollTop;
    }
    
    // Update photo flip on scroll
    updatePhotoFlip();
});



// Photo display system - tracks which photo should be shown
let lastScrollY = 0;

function updatePhotoFlip() {
    const aboutSection = document.getElementById('about');
    const profilePhoto = document.querySelector('.profile-photo');
    
    if (!aboutSection || !profilePhoto) return;
    
    const scrollY = window.scrollY;
    const aboutTop = aboutSection.offsetTop;
    const aboutHeight = aboutSection.offsetHeight;
    
    // Calculate how far we've scrolled through the about section (0 to 1)
    const scrollProgress = Math.min(Math.max((scrollY - aboutTop) / aboutHeight, 0), 1);
    
    // Two-threshold system for reliable photo flipping
    const threshold1 = 0.05;          // First threshold - scroll up to this point
    const threshold2 = 0.4;           // Second threshold - flip when scrolling down past this
    
    // When scrolling up above threshold1, set counter to 1
    
    // When scrolling up above threshold1, set counter to 1
    if (scrollY < lastScrollY && scrollProgress <= threshold1) {
        scrollCounter = 1;
    }
    
    // For first load case: if we're past threshold2 and counter is still 1, allow first flip
    if (scrollY > lastScrollY && scrollProgress >= threshold2 && scrollCounter === 1) {
        // Exchange the theme photo addresses
        [darkThemePhoto, lightThemePhoto] = [lightThemePhoto, darkThemePhoto];
        scrollCounter = 0; // Reset counter after flip
        
        // Update both image sources
        const darkImg = document.querySelector('.dark-mode-img');
        const lightImg = document.querySelector('.light-mode-img');
        if (darkImg && lightImg) {
            darkImg.src = darkThemePhoto;
            lightImg.src = lightThemePhoto;
        }
    }
    
    lastScrollY = scrollY;
}

// Show dark mode photo
function showDarkModePhoto() {
    const darkImg = document.querySelector('.dark-mode-img');
    const lightImg = document.querySelector('.light-mode-img');
    if (darkImg && lightImg) {
        darkImg.src = darkThemePhoto;
        lightImg.src = lightThemePhoto;
        darkImg.style.display = 'block';
        lightImg.style.display = 'none';
    }
}

// Show light mode photo
function showLightModePhoto() {
    const darkImg = document.querySelector('.dark-mode-img');
    const lightImg = document.querySelector('.light-mode-img');
    if (darkImg && lightImg) {
        darkImg.src = darkThemePhoto;
        lightImg.src = lightThemePhoto;
        darkImg.style.display = 'none';
        lightImg.style.display = 'block';
    }
}



// Reset photo flip state when theme changes so scroll flipping works
function resetPhotoFlipState() {
    // Reset photo addresses to their original state
    darkThemePhoto = 'profile-dark.JPG';
    lightThemePhoto = 'profile-light.JPG';
    scrollCounter = 1; // Reset scroll counter to 1 so first scroll works
    
    // Update the actual image sources
    const darkImg = document.querySelector('.dark-mode-img');
    const lightImg = document.querySelector('.light-mode-img');
    if (darkImg && lightImg) {
        darkImg.src = darkThemePhoto;
        lightImg.src = lightThemePhoto;
    }
}



// Add smooth reveal animations for sections
const revealOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, revealOptions);

// Observe all sections for reveal animation
sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    revealObserver.observe(section);
});

// ===== BACKGROUND WORDS SYSTEM =====
let backgroundWords = [];

let activeWords = [];
const maxWords = 46; // Increased to maintain crowding with faster 5-second animations

// Tab visibility tracking to prevent sync issues
let isTabVisible = true;
let lastVisibilityChange = Date.now();
let wordsNeedRedistribution = false;

// Function to check if a position overlaps with existing words
function checkOverlap(x, y) {
    const minDistance = 60; // Reduced to prevent clustering and oscillation
    
    for (const activeWord of activeWords) {
        const activeX = parseInt(activeWord.style.left);
        const activeY = parseInt(activeWord.style.top);
        
        const distance = Math.sqrt((x - activeX) ** 2 + (y - activeY) ** 2);
        if (distance < minDistance) {
            return true; // Overlap detected
        }
    }
    return false; // No overlap
}

// Function to update background words theme without recreating them
function updateBackgroundWordsTheme(theme) {
    // Update CSS variable instead of individual word styles
    if (theme === 'light') {
        document.documentElement.style.setProperty('--bg-word-color', 'rgba(0, 0, 0, 0.7)');
    } else {
        document.documentElement.style.setProperty('--bg-word-color', 'rgba(255, 255, 255, 0.7)');
    }
}

function createBackgroundWord(startAtRandomStage = false) {
    // Don't create if we have too many words
    if (activeWords.length >= maxWords) return;
    
    // Don't create if words haven't been loaded yet
    if (!backgroundWords || backgroundWords.length === 0) return;
    
    // Get hero section
    const heroSection = document.getElementById('hero');
    if (!heroSection) return;
    
    // Create word element
    const word = document.createElement('div');
    word.className = 'background-word';
    
    // Get random word
    const randomIndex = Math.floor(Math.random() * backgroundWords.length);
    word.textContent = backgroundWords[randomIndex];
    
    // Simple random positioning - let natural randomness handle distribution
    let x, y;
    let attempts = 0;
    const maxAttempts = 100;
    
    do {
        x = Math.random() * (heroSection.offsetWidth - 80);
        y = Math.random() * (heroSection.offsetHeight - 25);
        attempts++;
        
        // Simple overlap check - no smart distribution logic
        let hasOverlap = false;
        for (const activeWord of activeWords) {
            const activeX = parseInt(activeWord.style.left);
            const activeY = parseInt(activeWord.style.top);
            const distance = Math.sqrt((x - activeX) ** 2 + (y - activeY) ** 2);
            if (distance < 65) { // Moderate spacing
                hasOverlap = true;
                break;
            }
        }
        
        if (!hasOverlap) break;
    } while (attempts < maxAttempts);
    
    // Always use a position - don't block word creation
    if (attempts >= maxAttempts) {
        x = Math.random() * (heroSection.offsetWidth - 80);
        y = Math.random() * (heroSection.offsetHeight - 25);
    }
    
    word.style.left = x + 'px';
    word.style.top = y + 'px';
    word.style.position = 'absolute';
    
    // Use CSS animations instead of JavaScript timing for better performance and no sync issues
    const totalTime = 5.0; // Total animation time in seconds (faster)
    
    // Create unique animation with random start time
    const randomStart = startAtRandomStage ? Math.random() * totalTime : 0;
    const animationName = `wordFade_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create unique keyframes for this word
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ${animationName} {
            0% { opacity: 0; }
            15% { opacity: 0.85; }
            62% { opacity: 0.85; }
            100% { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Apply animation with random start time
    word.style.animation = `${animationName} ${totalTime}s linear ${randomStart}s infinite`;
    
    // Add to hero section
    heroSection.appendChild(word);
    activeWords.push(word);
    
    // Remove word and style after animation completes
    setTimeout(() => {
        if (word.parentNode) {
            word.parentNode.removeChild(word);
            activeWords = activeWords.filter(w => w !== word);
            
            // Remove the unique style element
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
            
            // Create new word with spread out timing to prevent waves
            setTimeout(() => createBackgroundWord(true), Math.random() * 1500);
        }
    }, (totalTime + randomStart) * 1000);
}

function updateBackgroundWords() {
    // Create new word if we have room
    if (activeWords.length < maxWords) {
        createBackgroundWord();
    }
}

function loadBackgroundWords() {
    return fetch('./background-words.txt')
        .then(response => response.text())
        .then(text => {
            backgroundWords = text.split('\n').filter(word => word.trim() !== '').map(word => word.toUpperCase());
        })
        .catch(error => {
            // Fallback words if file loading fails
            backgroundWords = ['ALGORITHM', 'STACK', 'MERGE', 'ARCHITECTURE', 'TYPESCRIPT', 'MARKDOWN', 'CLIENT', 'BINARY', 'CLASS', 'PERFORMANCE'];
        });
}

function initBackgroundWords() {
    // Load words first, then initialize
    loadBackgroundWords().then(() => {
        // Start background words very early (1 second)
        const heroAnimationDelay = 1000;
        
        setTimeout(() => {
            // Create words with much more staggered timing to prevent waves
            let wordsCreated = 0;
            
            function createInitialWord() {
                if (wordsCreated < maxWords) {
                    // Create word with random start stage to avoid synchronized lifecycles
                    createBackgroundWord(true);
                    wordsCreated++;
                    
                    // More aggressive creation to fill screen faster
                    const randomDelay = 50 + Math.random() * 300; // 0.05 to 0.35 seconds
                    setTimeout(createInitialWord, randomDelay);
                } else {
                    // All initial words created, start the continuous replacement system
                    setInterval(() => {
                        // Replace words that have finished their lifecycle
                        if (activeWords.length < maxWords) {
                            // Much more random timing to completely break up waves
                            const randomGap = Math.random() * 2000; // 0 to 2 seconds random gap
                            setTimeout(() => {
                                createBackgroundWord(true);
                            }, randomGap);
                        }
                    }, 100); // Check more frequently for better distribution
                }
            }
            
            // Start creating initial words after hero animation completes
            createInitialWord();
        }, heroAnimationDelay);
    });
    
    // CSS animations handle all timing automatically - no manual tracking needed
}

// CSS animations are immune to tab focus issues - no need for complex tracking

function redistributeWordsAfterTabFocus() {
    // Clear all existing words and recreate them with fresh random timing
    activeWords.forEach(word => {
        if (word.parentNode) {
            word.parentNode.removeChild(word);
        }
    });
    activeWords = [];
    
    // Create new words with fresh random timing
    setTimeout(() => {
        for (let i = 0; i < maxWords; i++) {
            setTimeout(() => {
                createBackgroundWord(true);
            }, Math.random() * 1000); // Spread creation over 1 second
        }
    }, 100);
}

// Info icon functionality
function initInfoIcon() {
    const infoIcon = document.getElementById('info-icon');
    if (!infoIcon) return;
    
    let tooltipTimer = null;
    
    // Toggle tooltip on click
    infoIcon.addEventListener('click', function(e) {
        e.preventDefault();
        this.classList.toggle('active');
        
        // Clear any existing timer
        if (tooltipTimer) {
            clearTimeout(tooltipTimer);
            tooltipTimer = null;
        }
        
        // If tooltip is now active, start fade-out and hide sequence
        if (this.classList.contains('active')) {
            // Start fading out after 5 seconds
            setTimeout(() => {
                if (infoIcon.classList.contains('active')) {
                    infoIcon.classList.add('fading');
                }
            }, 5000); // 5 seconds
            
            // Completely hide after 7 seconds
            tooltipTimer = setTimeout(() => {
                this.classList.remove('active');
                this.classList.remove('fading');
                tooltipTimer = null;
            }, 7000); // 7 seconds
        }
    });
    
    // Close tooltip when clicking outside
    document.addEventListener('click', function(e) {
        if (!infoIcon.contains(e.target)) {
            infoIcon.classList.remove('active');
            infoIcon.classList.remove('fading');
            if (tooltipTimer) {
                clearTimeout(tooltipTimer);
                tooltipTimer = null;
            }
        }
    });
    
    // Close tooltip on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            infoIcon.classList.remove('active');
            infoIcon.classList.remove('fading');
            if (tooltipTimer) {
                clearTimeout(tooltipTimer);
                tooltipTimer = null;
            }
        }
    });
}
