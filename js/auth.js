// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Tab Switching
    const tabButtons = document.querySelectorAll('.auth-tabs .tab-btn');
    const authForms = document.querySelectorAll('.auth-form');
    const switchTabLinks = document.querySelectorAll('.switch-tab');
    
    // Function to switch tabs
    function switchTab(tabId) {
        // Remove active class from all tabs and forms
        tabButtons.forEach(btn => btn.classList.remove('active'));
        authForms.forEach(form => form.classList.remove('active'));
        
        // Add active class to selected tab and form
        document.querySelector(`.tab-btn[data-tab="${tabId}"]`).classList.add('active');
        document.getElementById(`${tabId}-form`).classList.add('active');
    }
    
    // Tab button click event
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
    
    // Switch tab links click event
    switchTabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
    
    // Toggle Password Visibility
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const passwordInput = this.previousElementSibling;
            
            // Toggle password visibility
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            }
        });
    });
    
    // Password Strength Meter
    const passwordInput = document.getElementById('signup-password');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text span');
    
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            let strength = 0;
            
            // Calculate password strength
            if (password.length >= 8) strength += 25;
            if (password.match(/[a-z]+/)) strength += 25;
            if (password.match(/[A-Z]+/)) strength += 25;
            if (password.match(/[0-9]+/) || password.match(/[^a-zA-Z0-9]+/)) strength += 25;
            
            // Update strength bar
            strengthBar.style.width = `${strength}%`;
            
            // Update strength text and color
            if (strength <= 25) {
                strengthBar.style.backgroundColor = '#dc3545';
                strengthText.textContent = 'Weak';
                strengthText.style.color = '#dc3545';
            } else if (strength <= 50) {
                strengthBar.style.backgroundColor = '#ffc107';
                strengthText.textContent = 'Fair';
                strengthText.style.color = '#ffc107';
            } else if (strength <= 75) {
                strengthBar.style.backgroundColor = '#17a2b8';
                strengthText.textContent = 'Good';
                strengthText.style.color = '#17a2b8';
            } else {
                strengthBar.style.backgroundColor = '#28a745';
                strengthText.textContent = 'Strong';
                strengthText.style.color = '#28a745';
            }
        });
    }
    
    // Form Validation
    const loginForm = document.getElementById('login');
    const signupForm = document.getElementById('signup');
    
    // Login Form Validation
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            
            // Simple validation
            if (!email || !password) {
                showError('Please fill in all fields');
                return;
            }
            
            // Email validation
            if (!isValidEmail(email)) {
                showError('Please enter a valid email address');
                return;
            }
            
            // If validation passes, you would typically submit the form to a server
            // For demo purposes, we'll just show a success message
            showSuccess('Login successful! Redirecting...');
            
            // Simulate redirection after login
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        });
    }
    
    // Sign Up Form Validation
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const firstName = document.getElementById('first-name').value.trim();
            const lastName = document.getElementById('last-name').value.trim();
            const email = document.getElementById('signup-email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const terms = document.getElementById('terms').checked;
            
            // Simple validation
            if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
                showError('Please fill in all fields');
                return;
            }
            
            // Email validation
            if (!isValidEmail(email)) {
                showError('Please enter a valid email address');
                return;
            }
            
            // Phone validation
            if (!isValidPhone(phone)) {
                showError('Please enter a valid phone number');
                return;
            }
            
            // Password validation
            if (password.length < 8) {
                showError('Password must be at least 8 characters long');
                return;
            }
            
            // Password match validation
            if (password !== confirmPassword) {
                showError('Passwords do not match');
                return;
            }
            
            // Terms validation
            if (!terms) {
                showError('You must agree to the Terms of Service and Privacy Policy');
                return;
            }
            
            // If validation passes, you would typically submit the form to a server
            // For demo purposes, we'll just show a success message
            showSuccess('Account created successfully! Redirecting...');
            
            // Simulate redirection after signup
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        });
    }
    
    // Helper Functions
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function isValidPhone(phone) {
        const phoneRegex = /^\+?[0-9]{10,15}$/;
        return phoneRegex.test(phone);
    }
    
    function showError(message) {
        // Remove any existing messages
        removeMessages();
        
        // Create error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        // Insert error message at the top of the active form
        const activeForm = document.querySelector('.auth-form.active form');
        activeForm.insertBefore(errorDiv, activeForm.firstChild);
        
        // Scroll to top of form
        activeForm.scrollIntoView({ behavior: 'smooth' });
    }
    
    function showSuccess(message) {
        // Remove any existing messages
        removeMessages();
        
        // Create success message element
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.style.color = '#28a745';
        successDiv.style.padding = '10px';
        successDiv.style.marginBottom = '15px';
        successDiv.style.backgroundColor = '#d4edda';
        successDiv.style.borderRadius = '5px';
        successDiv.style.textAlign = 'center';
        successDiv.textContent = message;
        
        // Insert success message at the top of the active form
        const activeForm = document.querySelector('.auth-form.active form');
        activeForm.insertBefore(successDiv, activeForm.firstChild);
    }
    
    function removeMessages() {
        const errorMessages = document.querySelectorAll('.error-message');
        const successMessages = document.querySelectorAll('.success-message');
        
        errorMessages.forEach(msg => msg.remove());
        successMessages.forEach(msg => msg.remove());
    }
    
    // Social Login Buttons (Demo functionality)
    const socialButtons = document.querySelectorAll('.social-btn');
    
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            const provider = this.classList.contains('google') ? 'Google' : 'Facebook';
            alert(`${provider} authentication would be implemented here. This is just a demo.`);
        });
    });
    
    // Add link to login/signup in the header
    const navUl = document.querySelector('nav ul');
    
    if (navUl) {
        const authLi = document.createElement('li');
        const authLink = document.createElement('a');
        
        // Check if we're on the auth page
        const isAuthPage = window.location.pathname.includes('auth.html');
        
        if (isAuthPage) {
            authLink.href = '#';
            authLink.textContent = 'Login / Sign Up';
            authLink.classList.add('active');
        } else {
            authLink.href = 'auth.html';
            authLink.textContent = 'Login / Sign Up';
        }
        
        authLi.appendChild(authLink);
        navUl.appendChild(authLi);
    }
});