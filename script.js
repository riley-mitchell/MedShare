// Wait for the DOM to load
 document.addEventListener('DOMContentLoaded', function() {
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
         if (window.scrollY > 10) {
             navbar.style.boxShadow = 'var(--shadow-md)';
         } else {
             navbar.style.boxShadow = 'var(--shadow-sm)';
         }
     });
     
     // FAQ accordion functionality
     const faqItems = document.querySelectorAll('.faq-item');
     
     faqItems.forEach(item => {
         const question = item.querySelector('.faq-question');
         
         question.addEventListener('click', () => {
             // Close all other open FAQs
             faqItems.forEach(otherItem => {
                 if (otherItem !== item && otherItem.classList.contains('active')) {
                     otherItem.classList.remove('active');
                     otherItem.querySelector('.toggle-icon i').className = 'fas fa-plus';
                 }
             });
             
             // Toggle current FAQ
             item.classList.toggle('active');
             
             // Toggle icon
             const icon = item.querySelector('.toggle-icon i');
             if (item.classList.contains('active')) {
                 icon.className = 'fas fa-minus';
             } else {
                 icon.className = 'fas fa-plus';
             }
         });
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
         testimonials[index].style.display = 'block';
         dots[index].classList.add('active');
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
     
     // Form validation for future implementation
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
     
     // Sample notification system
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
     
     // Example of how to use the notification system
     // Uncomment to test
     /*
     document.querySelector('.btn-primary').addEventListener('click', function() {
         showNotification('Welcome to MedShare! Your secure medical information storage.', 'success');
     });
     */
     
     // Mock authentication for demo purposes
     const loginForm = document.getElementById('login-form');
     const signupForm = document.getElementById('signup-form');
     
     if (loginForm) {
         loginForm.addEventListener('submit', function(e) {
             e.preventDefault();
             
             // Show a loading state
             const submitBtn = this.querySelector('button[type="submit"]');
             const originalText = submitBtn.textContent;
             submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
             submitBtn.disabled = true;
             
             // Simulate API call delay
             setTimeout(() => {
                 // Reset button
                 submitBtn.innerHTML = originalText;
                 submitBtn.disabled = false;
                 
                 // Show success notification and redirect (in a real app)
                 showNotification('Successfully logged in! Redirecting to your dashboard...', 'success');
                 
                 // Simulate redirect
                 setTimeout(() => {
                     window.location.href = "#dashboard";
                 }, 1500);
             }, 1500);
         });
     }
     
     if (signupForm) {
         signupForm.addEventListener('submit', function(e) {
             e.preventDefault();
             
             // Show a loading state
             const submitBtn = this.querySelector('button[type="submit"]');
             const originalText = submitBtn.textContent;
             submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
             submitBtn.disabled = true;
             
             // Simulate API call delay
             setTimeout(() => {
                 // Reset button
                 submitBtn.innerHTML = originalText;
                 submitBtn.disabled = false;
                 
                 // Show success notification and redirect (in a real app)
                 showNotification('Account created successfully! Redirecting to your dashboard...', 'success');
                 
                 // Simulate redirect
                 setTimeout(() => {
                     window.location.href = "#dashboard";
                 }, 1500);
             }, 2000);
         });
     }

  // Emergency sharing toggle functionality
document.getElementById('emergencyToggle').addEventListener('change', function() {
    const statusElement = document.querySelector('.status-indicator');
    if (this.checked) {
        statusElement.textContent = 'Active';
        statusElement.classList.remove('inactive');
        statusElement.classList.add('active');
        // Show a confirmation dialog
        if (confirm('Enabling Emergency Sharing will allow emergency medical services to access your critical medical information in case of an emergency. Continue?')) {
            // You would typically make an API call here to update the user's preferences
            console.log('Emergency sharing activated');
        } else {
            // User canceled, reset the toggle
            this.checked = false;
            statusElement.textContent = 'Inactive';
            statusElement.classList.remove('active');
            statusElement.classList.add('inactive');
        }
    } else {
        statusElement.textContent = 'Inactive';
        statusElement.classList.remove('active');
        statusElement.classList.add('inactive');
        console.log('Emergency sharing deactivated');
    }
});
  
 });
