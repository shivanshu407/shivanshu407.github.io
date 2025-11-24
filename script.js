// --- Custom Cursor ---
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

// --- Typing Effect ---
const typingText = document.querySelector('.typing-text');
const words = ["Software Developer", "Hardware Enthusiast", "FPGA Engineer", "AI Researcher"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
        typingText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        setTimeout(type, 2000); // Pause at end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(type, 500); // Pause before new word
    } else {
        setTimeout(type, isDeleting ? 50 : 100);
    }
}

document.addEventListener('DOMContentLoaded', type);

// --- Draggable Terminal Window ---
const terminal = document.getElementById('terminal-window');
const header = terminal.querySelector('.window-header');
const closeBtn = terminal.querySelector('.control.close');
const navTerminal = document.querySelector('[data-target="terminal"]');

let isDragging = false;
let startX, startY, initialLeft, initialTop;

header.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;

    const rect = terminal.getBoundingClientRect();
    initialLeft = rect.left;
    initialTop = rect.top;

    terminal.style.transition = 'none'; // Disable transition for smooth drag
});

window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    terminal.style.left = `${initialLeft + dx}px`;
    terminal.style.top = `${initialTop + dy}px`;
});

window.addEventListener('mouseup', () => {
    isDragging = false;
    terminal.style.transition = 'opacity 0.3s, transform 0.3s'; // Re-enable
});

// Open/Close Terminal
navTerminal.addEventListener('click', () => {
    terminal.classList.remove('closed');
    terminal.style.left = '30%'; // Reset position
    terminal.style.top = '20%';
});

closeBtn.addEventListener('click', () => {
    terminal.classList.add('closed');
});

// --- Project Drawer (Pull Up) ---
const drawer = document.getElementById('projects-drawer');
const navProjects = document.querySelector('[data-target="projects-drawer"]');
const drawerHandle = document.querySelector('.drawer-handle');
const exploreBtn = document.getElementById('explore-btn');

function toggleDrawer(e) {
    e.stopPropagation(); // Prevent immediate closing
    drawer.classList.toggle('open');
}

navProjects.addEventListener('click', toggleDrawer);
drawerHandle.addEventListener('click', toggleDrawer);
exploreBtn.addEventListener('click', toggleDrawer);

// Close drawer when clicking anywhere else
document.addEventListener('click', (e) => {
    if (drawer.classList.contains('open') &&
        !drawer.contains(e.target) &&
        e.target !== navProjects &&
        e.target !== exploreBtn) {
        drawer.classList.remove('open');
    }
});

// --- Contact & Resume Modals ---
const contactModal = document.getElementById('contact-modal');
const resumeModal = document.getElementById('resume-modal');
const navContact = document.querySelector('[data-target="contact-modal"]');
const navResume = document.querySelector('[data-target="resume-modal"]');
const closeContact = document.querySelector('.close-modal:not(.close-resume)');
const closeResume = document.querySelector('.close-resume');

function openModal(modal) {
    modal.classList.add('active');
}

function closeModalFunc(modal) {
    modal.classList.remove('active');
}

navContact.addEventListener('click', () => openModal(contactModal));
if (navResume) navResume.addEventListener('click', () => openModal(resumeModal));

if (closeContact) closeContact.addEventListener('click', () => closeModalFunc(contactModal));
if (closeResume) closeResume.addEventListener('click', () => closeModalFunc(resumeModal));

// Close on outside click
[contactModal, resumeModal].forEach(modal => {
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModalFunc(modal);
            }
        });
    }
});

// --- Canvas Particles (Cyberpunk Grid/Nodes) ---
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
        ctx.fillStyle = 'rgba(0, 243, 255, 0.5)'; // Neon Blue
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const count = Math.floor(width * height / 20000);
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p, index) => {
        p.update();
        p.draw();

        for (let j = index + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 150) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 243, 255, ${0.1 - dist / 1500})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }
    });
    requestAnimationFrame(animate);
}

initParticles();
animate();
