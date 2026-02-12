document.addEventListener('DOMContentLoaded', () => {
    // Select both nav links (top navbar) and hero links
    const allLinks = document.querySelectorAll('.nav-link, .hero-nav-link');
    const sections = document.querySelectorAll('.section');
    const navbar = document.querySelector('.navbar');

    function updateView(targetId) {
        // Toggle Navbar Visibility
        if (targetId === 'about') {
            navbar.classList.add('visible');
        } else {
            navbar.classList.remove('visible');
        }

        // Update Active Link State
        allLinks.forEach(nav => {
            if (nav.getAttribute('data-target') === targetId) {
                nav.classList.add('active');
            } else {
                nav.classList.remove('active');
            }
        });

        // Show/Hide Sections
        sections.forEach(section => {
            section.classList.remove('active');
        });
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    }

    allLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            updateView(targetId);
        });
    });

    // Initialize View (Default to Home logic)
    // Check if there's a specific active section or default to home
    updateView('home');
});
