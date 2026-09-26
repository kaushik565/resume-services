// script.js

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');
const header = document.getElementById('header');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    const icon = mobileMenuBtn.querySelector('i');
    if (mobileMenu.classList.contains('hidden')) {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    } else {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    }
});

// Close mobile menu when clicking a link
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// Sticky header shadow on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
        header.classList.add('shadow-md');
        header.classList.remove('shadow-sm');
    } else {
        header.classList.remove('shadow-md');
        header.classList.add('shadow-sm');
    }
});

// FAQ Accordion
const faqBtns = document.querySelectorAll('.faq-btn');

faqBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const content = btn.nextElementSibling;
        const icon = btn.querySelector('i');
        
        // Toggle current
        content.classList.toggle('hidden');
        if (content.classList.contains('hidden')) {
            icon.classList.remove('fa-chevron-up', 'text-brandOrange');
            icon.classList.add('fa-chevron-down', 'text-gray-400');
        } else {
            icon.classList.remove('fa-chevron-down', 'text-gray-400');
            icon.classList.add('fa-chevron-up', 'text-brandOrange');
        }
    });
});

// Package Selection Helper
window.selectPackage = function(packageId) {
    const select = document.getElementById('package-select');
    if (select) {
        select.value = packageId;
        
        // Add a subtle highlight animation to the select box
        select.classList.add('ring-4', 'ring-orange-200');
        setTimeout(() => {
            select.classList.remove('ring-4', 'ring-orange-200');
        }, 1000);
    }
};

// Handle file upload display
document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const fileNameDisplay = this.parentElement.nextElementSibling;
            if (this.files && this.files.length > 0) {
                fileNameDisplay.textContent = this.files[0].name;
                fileNameDisplay.classList.remove('text-gray-500');
                fileNameDisplay.classList.add('text-brandOrange', 'font-semibold');
            } else {
                fileNameDisplay.textContent = 'or drag and drop';
                fileNameDisplay.classList.add('text-gray-500');
                fileNameDisplay.classList.remove('text-brandOrange', 'font-semibold');
            }
        });
    }
});

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result;
            resolve({
                data: result.split(',')[1],
                mimeType: file.type,
                name: file.name
            });
        };
        reader.onerror = error => reject(error);
    });
}

// Form Submission Integration
window.submitForm = async function(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Submitting...';
    submitBtn.disabled = true;
    
    try {
        const form = e.target;
        
        // Gather data safely using placeholder selectors
        const getVal = (selector) => {
            const el = form.querySelector(selector);
            return el ? el.value : '';
        };
        
        const fileInput = form.querySelector('input[type="file"]');
        let fileData = null;
        let fileName = null;
        let fileMimeType = null;
        
        if (fileInput && fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const base64 = await getBase64(file);
            fileData = base64.data;
            fileName = base64.name;
            fileMimeType = base64.mimeType;
        }
        
        const data = {
            fullName: getVal('input[placeholder="John Doe"]'),
            email: getVal('input[type="email"]'),
            whatsapp: getVal('input[type="tel"]'),
            location: getVal('input[placeholder="City, State"]'),
            careerLevel: getVal('select:not(#package-select)'),
            service: getVal('#package-select'),
            targetRole: getVal('input[placeholder="e.g. Software Engineer"]'),
            highestQualification: getVal('input[placeholder="e.g. B.Tech Computer Science"]'),
            yearsExperience: getVal('input[placeholder*="2.5 Years"]'),
            company: getVal('input[placeholder="Leave blank if fresher"]'),
            skills: getVal('input[placeholder*="Java"]'),
            linkedin: getVal('input[type="url"]'),
            additionalRequirements: getVal('textarea'),
            fileData: fileData,
            fileName: fileName,
            fileMimeType: fileMimeType
        };
        
        // =========================================================================
        // IMPORTANT: REPLACE THIS URL WITH YOUR GOOGLE APPS SCRIPT WEB APP URL
        // =========================================================================
        const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyk1Vvz08MYSPoFfYjyUmWpfDWgnrVQrQMGn7iTfquKullWOhlZQP6bJJWPjLqylDsF/exec';
        
        if (SCRIPT_URL === '' || SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL') {
            alert('Please configure your Google Apps Script URL in script.js first!');
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            return;
        }
        
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            }
        });
        
        const result = await response.json();
        
        if (result.result === 'success') {
            const successMsg = document.getElementById('form-success');
            
            // Set dynamic UPI payment logic
            const upiId = '8886875787.etb@icici';
            const payeeName = 'PENKE LAKSHMANA SAI KAUSHIK';
            const selectedPackage = getVal('#package-select');
            const amount = selectedPackage === 'professional' ? '299' : '100';
            
            // Create UPI Intent URI
            const upiLinkStr = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR`;
            
            document.getElementById('upi-link').href = upiLinkStr;
            document.getElementById('qr-code').src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiLinkStr)}`;
            document.getElementById('pay-amount').textContent = amount;
            
            // Set dynamic email
            const customerEmail = data.email || 'your email';
            document.getElementById('customer-email').textContent = customerEmail;

            form.style.display = 'none';
            successMsg.classList.remove('hidden');
            
            const orderSection = document.getElementById('order');
            window.scrollTo({
                top: orderSection.offsetTop - 80,
                behavior: 'smooth'
            });
        } else {
            alert('Error submitting form: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while submitting. Please try again or contact via WhatsApp.');
    } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
};

window.resetForm = function() {
    const form = document.getElementById('resume-form');
    const successMsg = document.getElementById('form-success');
    
    form.reset();
    
    // Reset file display
    const fileInput = form.querySelector('input[type="file"]');
    if (fileInput) {
        const fileNameDisplay = fileInput.parentElement.nextElementSibling;
        fileNameDisplay.textContent = 'or drag and drop';
        fileNameDisplay.classList.add('text-gray-500');
        fileNameDisplay.classList.remove('text-brandOrange', 'font-semibold');
    }
    
    form.style.display = 'block';
    successMsg.classList.add('hidden');
};

// Simple Intersection Observer for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('opacity-100', 'translate-y-0');
                entry.target.classList.remove('opacity-0', 'translate-y-8');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const animateElements = document.querySelectorAll('.grid > div, section h2, .faq-btn');
    
    animateElements.forEach(el => {
        if(!el.closest('.resume-mockup')) {
            el.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-8');
            observer.observe(el);
        }
    });
});

window.confirmPayment = function() {
    document.getElementById('form-success').classList.add('hidden');
    document.getElementById('payment-confirmed').classList.remove('hidden');
    
    // Pass amount to confirm screen
    const amount = document.getElementById('pay-amount').textContent;
    const confirmSpan = document.getElementById('confirm-pay-amount');
    if(confirmSpan) confirmSpan.textContent = amount;

    // Start 2 hour countdown timer
    let timeRemaining = 2 * 60 * 60; // 2 hours in seconds
    const hoursEl = document.getElementById('timer-hours');
    const minsEl = document.getElementById('timer-minutes');
    const secsEl = document.getElementById('timer-seconds');
    
    const updateTimer = () => {
        if (timeRemaining <= 0) return;
        timeRemaining--;
        const h = Math.floor(timeRemaining / 3600);
        const m = Math.floor((timeRemaining % 3600) / 60);
        const s = timeRemaining % 60;
        if(hoursEl) hoursEl.textContent = h.toString().padStart(2, '0');
        if(minsEl) minsEl.textContent = m.toString().padStart(2, '0');
        if(secsEl) secsEl.textContent = s.toString().padStart(2, '0');
    };
    
    setInterval(updateTimer, 1000);
    updateTimer(); // call once immediately
};
