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

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
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