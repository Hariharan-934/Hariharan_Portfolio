/* ==========================================
   TYPING + DELETING LOOP (ROTATING TITLES)
========================================== */

const roles = ["Python","App","Web","SQL"];
const typingElement = document.getElementById("typing");

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeLoop() {
    if (!typingElement) return;

    const currentRole = roles[roleIndex];

    if (!isDeleting) {
        typingElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentRole.length) {
            setTimeout(() => isDeleting = true, 1000);
        }
    } else {
        typingElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
        }
    }

    setTimeout(typeLoop, isDeleting ? 60 : 120);
}

typeLoop();


/* ==========================================
   HAMBURGER MENU
========================================== */

function toggleMenu() {
    document.getElementById("navLinks").classList.toggle("active");
}

// Auto close menu on link click (mobile)
document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        document.getElementById("navLinks").classList.remove("active");
    });
});


/* ==========================================
   DARK / LIGHT MODE (Saved)
========================================== */

const themeToggle = document.getElementById("themeToggle");

// Load saved theme
if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-mode");
    if (themeToggle) themeToggle.innerHTML = "☀️";
}

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("light-mode");

        if (document.body.classList.contains("light-mode")) {
            themeToggle.innerHTML = "☀️";
            localStorage.setItem("theme", "light");
        } else {
            themeToggle.innerHTML = "🌙";
            localStorage.setItem("theme", "dark");
        }
    });
}


/* ==========================================
   SECTION SCROLL ANIMATION
========================================== */

const sections = document.querySelectorAll(".section");
const skillSection = document.getElementById("skills");
const skillBars = document.querySelectorAll(".skill-progress");
const skillsCanvas = document.getElementById("skillsParticles");
const skillsCtx = skillsCanvas ? skillsCanvas.getContext("2d") : null;
let skillsAnimated = false;
let skillsBgParticles = [];

function setupSkillsParticles() {
    if (!skillsCanvas || !skillsCtx || !skillSection) return;

    skillsCanvas.width = skillSection.offsetWidth;
    skillsCanvas.height = skillSection.offsetHeight;

    const count = Math.max(22, Math.floor(skillsCanvas.width / 40));
    skillsBgParticles = Array.from({ length: count }, () => ({
        x: Math.random() * skillsCanvas.width,
        y: Math.random() * skillsCanvas.height,
        radius: Math.random() * 1.6 + 1,
        dx: (Math.random() - 0.5) * 0.35,
        dy: (Math.random() - 0.5) * 0.35
    }));
}

function animateSkillsParticles() {
    if (!skillsCanvas || !skillsCtx) return;

    skillsCtx.clearRect(0, 0, skillsCanvas.width, skillsCanvas.height);

    skillsBgParticles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > skillsCanvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > skillsCanvas.height) p.dy *= -1;

        skillsCtx.beginPath();
        skillsCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        skillsCtx.fillStyle = "rgba(235,235,235,0.55)";
        skillsCtx.fill();
    });

    for (let a = 0; a < skillsBgParticles.length; a++) {
        for (let b = a + 1; b < skillsBgParticles.length; b++) {
            const dx = skillsBgParticles[a].x - skillsBgParticles[b].x;
            const dy = skillsBgParticles[a].y - skillsBgParticles[b].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                const opacity = 1 - (distance / 100);
                skillsCtx.beginPath();
                skillsCtx.strokeStyle = "rgba(210,210,210," + opacity * 0.18 + ")";
                skillsCtx.moveTo(skillsBgParticles[a].x, skillsBgParticles[a].y);
                skillsCtx.lineTo(skillsBgParticles[b].x, skillsBgParticles[b].y);
                skillsCtx.stroke();
            }
        }
    }

    requestAnimationFrame(animateSkillsParticles);
}

if (skillsCanvas && skillsCtx) {
    setupSkillsParticles();
    window.addEventListener("resize", setupSkillsParticles);
    animateSkillsParticles();
}

function animateSkillBars() {
    if (skillsAnimated) return;
    skillBars.forEach(bar => {
        const targetWidth = bar.dataset.width || "0%";
        bar.style.width = targetWidth;
    });
    skillsAnimated = true;
}

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
            if (entry.target === skillSection) {
                animateSkillBars();
            }
        }
    });
}, { threshold: 0.3 });

sections.forEach(section => {
    observer.observe(section);
});


/* ==========================================
   PROJECT SLIDER (ONE AT A TIME)
   AUTO SLIDE EVERY 5 SECONDS
========================================== */

let currentProject = 0;
const track = document.getElementById("projectTrack");
let autoSlideInterval;

if (track) {

    const totalProjects = track.children.length;

    function updateSlider() {
        track.style.transform = `translateX(-${currentProject * 100}%)`;
    }

    window.changeProject = function(direction) {
        currentProject += direction;

        if (currentProject < 0) {
            currentProject = totalProjects - 1;
        }

        if (currentProject >= totalProjects) {
            currentProject = 0;
        }

        updateSlider();
        resetAutoSlide();
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            currentProject++;
            if (currentProject >= totalProjects) {
                currentProject = 0;
            }
            updateSlider();
        }, 5000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    // Pause on hover
    track.addEventListener("mouseenter", () => {
        clearInterval(autoSlideInterval);
    });

    track.addEventListener("mouseleave", () => {
        startAutoSlide();
    });

    startAutoSlide();
}



/* ==========================================
   AUTO SCROLL BETWEEN SECTIONS
// ========================================== */

// let autoScrollInterval;
// const allSections = document.querySelectorAll(".section");
// let currentSectionIndex = 0;
// let userScrolling = false;

// function scrollToSection(index) {
//     if (index >= allSections.length) {
//         index = 0;
//     }

//     currentSectionIndex = index;

//     allSections[currentSectionIndex].scrollIntoView({
//         behavior: "smooth"
//     });
// }

// function startAutoScroll() {
//     autoScrollInterval = setInterval(() => {
//         if (!userScrolling) {
//             currentSectionIndex++;
//             if (currentSectionIndex >= allSections.length) {
//                 currentSectionIndex = 0;
//             }
//             scrollToSection(currentSectionIndex);
//         }
//     }, 8000); // change section every 8 seconds
// }

// function stopAutoScrollTemporarily() {
//     userScrolling = true;
//     clearInterval(autoScrollInterval);

//     setTimeout(() => {
//         userScrolling = false;
//         startAutoScroll();
//     }, 10000); // resume after 10 seconds
// }

// // Detect manual scroll
// window.addEventListener("wheel", stopAutoScrollTemporarily);
// window.addEventListener("touchstart", stopAutoScrollTemporarily);

// // Start auto scroll
// startAutoScroll();
