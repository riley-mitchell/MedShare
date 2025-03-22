// Firebase configuration - IMPORTANT: Replace with your actual Firebase config
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Modal functions with transitions
// To open modal
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = 'block';
  // Trigger reflow to enable transition
  void modal.offsetWidth;
  modal.classList.add('active');
}

// To close modal
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.remove('active');
  // Wait for transition to complete before hiding
  setTimeout(() => {
    modal.style.display = 'none';
  }, 300);
}

// Single document ready function
document.addEventListener('DOMContentLoaded', function() {
    // ===== FIREBASE AUTHENTICATION FUNCTIONALITY =====
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const loginBtn = document.querySelector('a[href="#login"]');
    const signupBtn = document.querySelector('a[href="#signup"]');
    const showLoginBtn = document.getElementById('showLoginBtn');
    const showSignupBtn = document.getElementById('showSignupBtn');
    const closeButtons = document.querySelectorAll('.close');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const forgotPassword = document.getElementById('forgotPassword');
    const loginError = document.getElementById('loginError');
    const signupError = document.getElementById('signupError');
    const createAccountBtns = document.querySelectorAll('a[href="#signup"].btn');
    
    // Update links to use new modal functions
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openModal('loginModal');
        });
    }
    
    if (signupBtn) {
        signupBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openModal('signupModal');
        });
    }
    
    createAccountBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            openModal('signupModal');
        });
    });
    
    // Switch between modals using new functions
    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            closeModal('signupModal');
            setTimeout(() => {
                openModal('loginModal');
            }, 300); // Wait for previous modal to close
        });
    }
    
    if (showSignupBtn) {
        showSignupBtn.addEventListener('click', function(e) {
            e.preventDefault();
            closeModal('loginModal');
            setTimeout(() => {
                openModal('signupModal');
            }, 300); // Wait for previous modal to close
        });
    }
    
    // Close modals using new closeModal function
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });
    
    // Close when clicking outside modal
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });
    
    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // Show loading state
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
            submitBtn.disabled = true;
            loginError.style.display = 'none';
            
            // Authenticate with Firebase
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Successful login
                    showNotification('Successfully logged in!', 'success');
                    closeModal('loginModal');
                    
                    // Reset form
                    loginForm.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    // Redirect to dashboard or refresh page
                    setTimeout(() => {
                        window.location.href = "dashboard.html";
                    }, 1000);
                })
                .catch((error) => {
                    // Handle errors
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    // Display error message
                    loginError.textContent = getAuthErrorMessage(error.code);
                    loginError.style.display = 'block';
                    
                    console.error("Login error:", error);
                });
        });
    }
    
    // Handle signup form submission
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('signupConfirmPassword').value;
            
            // Validate passwords match
            if (password !== confirmPassword) {
                signupError.textContent = "Passwords do not match.";
                signupError.style.display = 'block';
                return;
            }
            
            // Show loading state
            const submitBtn = signupForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
            submitBtn.disabled = true;
            signupError.style.display = 'none';
            
            // Create user in Firebase
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Update user profile with name
                    return userCredential.user.updateProfile({
                        displayName: name
                    }).then(() => {
                        // Successful account creation
                        showNotification('Account created successfully!', 'success');
                        closeModal('signupModal');
                        
                        // Reset form
                        signupForm.reset();
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                        
                        // Redirect to dashboard
                        window.location.href = "dashboard.html";
                    });
                })
                .catch((error) => {
                    // Handle errors
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    // Display error message
                    signupError.textContent = getAuthErrorMessage(error.code);
                    signupError.style.display = 'block';
                    
                    console.error("Signup error:", error);
                });
        });
    }
    
    // Handle forgot password
    if (forgotPassword) {
        forgotPassword.addEventListener('click', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            
            if (!email) {
                loginError.textContent = "Please enter your email address to reset your password.";
                loginError.style.display = 'block';
                return;
            }
            
            firebase.auth().sendPasswordResetEmail(email)
                .then(() => {
                    loginError.style.display = 'none';
                    showNotification('Password reset email sent. Check your inbox.', 'success');
                })
                .catch((error) => {
                    loginError.textContent = getAuthErrorMessage(error.code);
                    loginError.style.display = 'block';
                    console.error("Password reset error:", error);
                });
        });
    }
    
    // Check auth state on page load
    firebase.auth().onAuthStateChanged(function(user) {
        updateUIForAuthState(user);
    });
    
    // ===== GENERAL UI FUNCTIONALITY =====
    
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when a nav link is clicked
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Fixed header behavior - add shadow on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 10) {
                navbar.style.boxShadow = 'var(--shadow-md)';
            } else {
                navbar.style.boxShadow = 'var(--shadow-sm)';
            }
        }
    });
    
    // FAQ accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', () => {
                // Close all other open FAQs
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        const otherIcon = otherItem.querySelector('.toggle-icon i');
                        if (otherIcon) otherIcon.className = 'fas fa-plus';
                    }
                });
                
                // Toggle current FAQ
                item.classList.toggle('active');
                
                // Toggle icon
                const icon = item.querySelector('.toggle-icon i');
                if (icon) {
                    if (item.classList.contains('active')) {
                        icon.className = 'fas fa-minus';
                    } else {
                        icon.className = 'fas fa-plus';
                    }
                }
            });
        }
    });
    
    // Testimonial slider functionality
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    let currentSlide = 0;
    
    // Hide all testimonials except the first one
    function showSlide(index) {
        // Hide all testimonials
        testimonials.forEach(testimonial => {
            testimonial.style.display = 'none';
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show the current testimonial and activate the corresponding dot
        if (testimonials[index]) testimonials[index].style.display = 'block';
        if (dots[index]) dots[index].classList.add('active');
    }
    
    // Initialize the slider
    if (testimonials.length > 0 && dots.length > 0) {
        showSlide(currentSlide);
        
        // Event listeners for navigation
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                currentSlide = (currentSlide - 1 + testimonials.length) % testimonials.length;
                showSlide(currentSlide);
            });
            
            nextBtn.addEventListener('click', () => {
                currentSlide = (currentSlide + 1) % testimonials.length;
                showSlide(currentSlide);
            });
        }
        
        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
            });
        });
        
        // Auto-advance slides every 5 seconds
        setInterval(() => {
            currentSlide = (currentSlide + 1) % testimonials.length;
            showSlide(currentSlide);
        }, 5000);
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Offset for fixed header
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Form validation
    function setupFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                let isValid = true;
                const requiredFields = form.querySelectorAll('[required]');
                
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        isValid = false;
                        
                        // Add error class and message
                        field.classList.add('error');
                        
                        // Create error message if it doesn't exist
                        let errorMessage = field.nextElementSibling;
                        if (!errorMessage || !errorMessage.classList.contains('error-message')) {
                            errorMessage = document.createElement('div');
                            errorMessage.className = 'error-message';
                            errorMessage.textContent = 'This field is required';
                            field.parentNode.insertBefore(errorMessage, field.nextSibling);
                        }
                    } else {
                        // Remove error class and message
                        field.classList.remove('error');
                        const errorMessage = field.nextElementSibling;
                        if (errorMessage && errorMessage.classList.contains('error-message')) {
                            errorMessage.remove();
                        }
                    }
                });
                
                if (!isValid) {
                    e.preventDefault();
                }
            });
        });
    }
    
    // Call form validation setup
    setupFormValidation();
    
    // Simulate data loading - for dashboard pages
    function simulateLoading() {
        const loaders = document.querySelectorAll('.loader');
        
        loaders.forEach(loader => {
            setTimeout(() => {
                loader.classList.add('loaded');
                
                // Get the content container that should be shown
                const contentId = loader.getAttribute('data-content');
                if (contentId) {
                    const content = document.getElementById(contentId);
                    if (content) {
                        content.style.display = 'block';
                    }
                }
            }, Math.random() * 1000 + 500); // Random loading time between 500-1500ms
        });
    }
    
    // Execute loading simulation if loaders exist
    if (document.querySelector('.loader')) {
        simulateLoading();
    }
    
    // Document upload preview for future implementation
    const fileInputs = document.querySelectorAll('input[type="file"]');
    
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const previewContainer = this.nextElementSibling;
            
            if (previewContainer && previewContainer.classList.contains('file-preview')) {
                // Clear previous previews
                previewContainer.innerHTML = '';
                
                if (this.files && this.files.length > 0) {
                    for (let i = 0; i < this.files.length; i++) {
                        const file = this.files[i];
                        const fileDiv = document.createElement('div');
                        fileDiv.className = 'file-item';
                        
                        // Create file icon based on type
                        const icon = document.createElement('i');
                        if (file.type.startsWith('image/')) {
                            icon.className = 'fas fa-file-image';
                        } else if (file.type === 'application/pdf') {
                            icon.className = 'fas fa-file-pdf';
                        } else {
                            icon.className = 'fas fa-file';
                        }
                        
                        // Create file name
                        const fileName = document.createElement('span');
                        fileName.textContent = file.name;
                        
                        // Add to preview
                        fileDiv.appendChild(icon);
                        fileDiv.appendChild(fileName);
                        previewContainer.appendChild(fileDiv);
                    }
                }
            }
        });
    });
    
    // Animation on scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('animated');
            }
        });
    }
    
    // Initial check and add scroll listener
    if (document.querySelector('.animate-on-scroll')) {
        animateOnScroll();
        window.addEventListener('scroll', animateOnScroll);
    }
    
    // Show current year in the footer
    const yearElements = document.querySelectorAll('.current-year');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(element => {
        element.textContent = currentYear;
    });
});

// ===== HELPER FUNCTIONS =====

// Function to show notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <p>${message}</p>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
}

// Function to handle user interface updates based on auth state
function updateUIForAuthState(user) {
    const loginBtn = document.querySelector('a[href="#login"]');
    const signupBtn = document.querySelector('a[href="#signup"]');
    
    if (!loginBtn || !signupBtn) return;
    
    if (user) {
        // User is signed in
        console.log("User is signed in:", user.displayName);
        
        // Update navigation
        loginBtn.style.display = 'none';
        signupBtn.style.display = 'none';
        
        // Here you would add UI elements for logged in users
        // For example, a logout button and a link to the dashboard
        // You could modify your HTML to include these elements with display:none by default
        
        // For now, let's just add a notification
        showNotification('Welcome back, ' + (user.displayName || 'User') + '!', 'success');
    } else {
        // User is signed out
        console.log("User is signed out");
        
        // Reset UI
        loginBtn.style.display = 'block';
        signupBtn.style.display = 'block';
    }
}

// Function to get user-friendly error messages
function getAuthErrorMessage(errorCode) {
    switch (errorCode) {
        case 'auth/invalid-email':
            return 'The email address is not valid.';
        case 'auth/user-disabled':
            return 'This account has been disabled.';
        case 'auth/user-not-found':
            return 'No account found with this email.';
        case 'auth/wrong-password':
            return 'Incorrect password.';
        case 'auth/email-already-in-use':
            return 'An account with this email already exists.';
        case 'auth/weak-password':
            return 'Password is too weak. Use at least 6 characters.';
        case 'auth/network-request-failed':
            return 'Network error. Check your connection and try again.';
        case 'auth/too-many-requests':
            return 'Too many unsuccessful login attempts. Try again later.';
        default:
            return 'An error occurred. Please try again.';
    }
}
