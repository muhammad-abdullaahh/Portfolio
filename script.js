// ================= toggle icon navbar =================
const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');

const contactForm = document.getElementById('contact-form');
const successModal = document.getElementById('success-modal');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const submitBtn = contactForm.querySelector('.btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> Sending...";

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    successModal.classList.add('active');
                    contactForm.reset();
                } else {
                    alert('Something went wrong. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred. Please check your connection.');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = "Send Message";
            });
    });
}

function closeModal() {
    successModal.classList.remove('active');
}

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
};

// ================= scroll section active link =================
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
            });
        };
    });

    // sticky navbar
    let header = document.querySelector('header');
    header.classList.toggle('sticky', window.scrollY > 100);

    // remove toggle icon and navbar when clicked
    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');
};

// ================= Particle Background =================
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    draw(color) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = hexToRgba(color, 0.2);
        ctx.fill();
    }
    update(color) {
        if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
        if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw(color);
    }
}

function hexToRgba(hex, opacity) {
    let r = 0, g = 0, b = 0;
    if (hex.startsWith('#')) {
        if (hex.length === 4) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
        } else {
            r = parseInt(hex.slice(1, 3), 16);
            g = parseInt(hex.slice(3, 5), 16);
            b = parseInt(hex.slice(5, 7), 16);
        }
    }
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 12000;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 1.5) + 0.5;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 1.5) - 0.75;
        let directionY = (Math.random() * 1.5) - 0.75;
        particlesArray.push(new Particle(x, y, directionX, directionY, size));
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    const color = getComputedStyle(document.body).getPropertyValue('--main-color').trim();
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update(color);
    }
    connect(color);
}

function connect(color) {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            if (distance < (canvas.width / 8) * (canvas.height / 8)) {
                opacityValue = 1 - (distance / 25000);
                ctx.strokeStyle = hexToRgba(color, opacityValue * 0.25); // Increased from 0.15
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

window.addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init();
});

init();
animate();

// ================= Theme Switcher =================
const themeSwitcher = document.querySelector('.theme-switcher');
const themeBtn = document.querySelector('.theme-btn');
const themeOpts = document.querySelectorAll('.theme-opt');

themeBtn.onclick = () => {
    themeSwitcher.classList.toggle('active');
};

themeOpts.forEach(opt => {
    opt.onclick = () => {
        const theme = opt.getAttribute('data-theme');
        setTheme(theme);
        themeSwitcher.classList.remove('active');
    };
});

function setTheme(theme) {
    // Remove all theme classes
    document.body.classList.remove('light-theme', 'blue-theme', 'emerald-theme', 'warm-theme');

    // Add selected theme class
    if (theme !== 'dark') {
        document.body.classList.add(`${theme}-theme`);
    }

    // Update active state in UI
    themeOpts.forEach(opt => {
        opt.classList.remove('active');
        if (opt.getAttribute('data-theme') === theme) {
            opt.classList.add('active');
        }
    });

    // Save to localStorage
    localStorage.setItem('selected-theme', theme);
}

// Load saved theme
const savedTheme = localStorage.getItem('selected-theme');
if (savedTheme) {
    setTheme(savedTheme);
}

// Close switcher when clicking outside
document.addEventListener('click', (e) => {
    if (!themeSwitcher.contains(e.target)) {
        themeSwitcher.classList.remove('active');
    }
});

// ================= Scroll Reveal =================
ScrollReveal({
    distance: '80px',
    duration: 2000,
    delay: 200,
});

ScrollReveal().reveal('.home-content, .heading', { origin: 'top' });
ScrollReveal().reveal('.home-img, .services-container, .portfolio-box, .contact form', { origin: 'bottom' });
ScrollReveal().reveal('.home-content h1, .about-img', { origin: 'left' });
ScrollReveal().reveal('.home-content p, .about-content p', { origin: 'right' });

