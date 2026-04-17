// Scroll Reveal Animation
function reveal() {
    var reveals = document.querySelectorAll(".reveal");
    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}

window.addEventListener("scroll", reveal);

// Trigger reveal on load
window.addEventListener("load", () => {
    reveal();
    
    // Log for verification
    console.log("AFC Landing Page Initialized");
});

// Smooth Scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Meta Pixel WhatsApp Click Tracking & Link Automation
document.addEventListener('DOMContentLoaded', () => {
    const waButtons = document.querySelectorAll('a[href*="wa.me"], a[href*="api.whatsapp.com"], .btn-wa');
    
    waButtons.forEach(button => {
        // Automatically add target="_blank" for seamless tracking and better UX
        if (button.tagName === 'A') {
            button.setAttribute('target', '_blank');
            button.setAttribute('rel', 'noopener noreferrer');
        }

        button.addEventListener('click', (e) => {
            const label = button.getAttribute('data-label') || 'General WhatsApp';
            
            // Trigger Meta Pixel Event
            if (typeof fbq !== 'undefined') {
                fbq('track', 'Contact', {
                    content_name: label,
                    content_category: 'Lead Generation'
                });
                console.log(`Tracking: Sent 'Contact' event for ${label}`);
            } else {
                console.warn('Meta Pixel (fbq) not loaded yet.');
            }
            
            // Note: because we use target="_blank", the page doesn't unload, 
            // so the Pixel event has plenty of time to fire correctly.
        });
    });
});

// FAQ Accordion Logic
document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
});
