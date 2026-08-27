/* =========================================================================
   IKARA ORPHANAGE CHHARITY TRUST JAVASCRIPT COMPLETE ACCESSIBLE EVERYWHERE FILE.
   ========================================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* ---------------------------------------------------------------
       PRELOADER
    --------------------------------------------------------------- */
    const preloader = document.getElementById("preloader");
    const percentText = document.getElementById("loading-percent");

    if (preloader) {
        let progress = 0;
        const loader = setInterval(() => {
            progress += 4;
            if (progress > 100) progress = 100;
            if (percentText) percentText.textContent = progress + "%";
            if (progress >= 100) {
                clearInterval(loader);
                setTimeout(() => preloader.classList.add("hide"), 300);
            }
        }, 30);
    }

    /* ---------------------------------------------------------------
       SCROLL PROGRESS BAR
    --------------------------------------------------------------- */
    const progressBar = document.getElementById("progress-bar");

    function updateProgressBar() {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        if (progressBar) progressBar.style.width = progress + "%";
    }
 
    /* ---------------------------------------------------------------
       STICKY / SCROLLED HEADER
    --------------------------------------------------------------- */
    const header = document.querySelector("header");

    function updateHeader() {
        if (!header) return;
        header.classList.toggle("scrolled", window.scrollY > 30);
    }

    /* ---------------------------------------------------------------
       COUNTER ANIMATION (stat numbers)
    --------------------------------------------------------------- */
    const counters = document.querySelectorAll(".counter");
    let countersStarted = false;

    function startCounters() {
        counters.forEach(counter => {
            const target = +counter.getAttribute("data-target");
            const duration = 1400;
            const start = performance.now();

            function tick(now) {
                const p = Math.min((now - start) / duration, 1);
                counter.textContent = Math.floor(p * target).toLocaleString();
                if (p < 1) requestAnimationFrame(tick);
                else counter.textContent = target.toLocaleString();
            }
            requestAnimationFrame(tick);
        });
    }

    function checkCounters() {
        if (countersStarted || !counters.length) return;
        const impact = document.querySelector(".impact");
        if (!impact) return;
        const rect = impact.getBoundingClientRect();
        if (rect.top < window.innerHeight - 150) {
            startCounters();
            countersStarted = true;
        }
    }

    /* ---------------------------------------------------------------
       REVEAL ON SCROLL
    --------------------------------------------------------------- */
    const revealElements = document.querySelectorAll(
        ".stat, .program-card, .objective-card, .timeline-item, .blog-card, .team-card, .testimonial"
    );
    revealElements.forEach(el => el.classList.add("fade-up"));

    function revealOnScroll() {
        revealElements.forEach(el => {
            const top = el.getBoundingClientRect().top;
            if (top < window.innerHeight - 80) el.classList.add("show");
        });
    }

    /* ---------------------------------------------------------------
       DONATION PROGRESS BAR FILL
    --------------------------------------------------------------- */
    const progressFill = document.querySelector(".progress-fill");
    if (progressFill) {
        const target = +(progressFill.dataset.target || 45);
        requestAnimationFrame(() => { progressFill.style.width = target + "%"; });
    }

    /* ---------------------------------------------------------------
       COMBINED SCROLL LISTENER
    --------------------------------------------------------------- */
    window.addEventListener("scroll", () => {
        updateProgressBar();
        updateHeader();
        checkCounters();
        revealOnScroll();
    });
    updateProgressBar();
    updateHeader();
    checkCounters();
    revealOnScroll();

    /* ---------------------------------------------------------------
       MOBILE MENU
    --------------------------------------------------------------- */
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    menuToggle?.addEventListener("click", () => {
        navLinks?.classList.toggle("active");
    });

    /* Dropdown — click to open on touch/mobile, hover handled by CSS on desktop */
    document.querySelectorAll(".has-dropdown > a").forEach(link => {
        link.addEventListener("click", (e) => {
            if (window.innerWidth <= 1080) {
                e.preventDefault();
                link.parentElement.classList.toggle("open");
            }
        });
    });

    /* ---------------------------------------------------------------
       ACTIVE NAV LINK (by current filename)
    --------------------------------------------------------------- */
    const currentPage = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a").forEach(link => {
        const href = link.getAttribute("href");
        if (href === currentPage) link.classList.add("active");
    });

    /* ---------------------------------------------------------------
       DARK MODE TOGGLE (kept as an optional affordance)
    --------------------------------------------------------------- */
    const darkBtn = document.getElementById("darkModeBtn");
    darkBtn?.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });

    /* ---------------------------------------------------------------
       SMOOTH SCROLL FOR ANCHOR LINKS
    --------------------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            const id = this.getAttribute("href");
            if (id.length < 2) return;
            const target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth" });
                navLinks?.classList.remove("active");
            }
        });
    });

    /* ---------------------------------------------------------------
       TOAST MESSAGE
    --------------------------------------------------------------- */
    function showToast(message) {
        const toast = document.createElement("div");
        toast.textContent = message;
        Object.assign(toast.style, {
            position: "fixed", bottom: "100px", right: "20px",
            background: "#14213A", color: "#F6F1E6", padding: "14px 24px",
            borderRadius: "12px", zIndex: 9999, fontFamily: "Inter, sans-serif",
            fontSize: "14px", boxShadow: "0 15px 35px -15px rgba(0,0,0,.4)"
        });
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3200);
    }
    window.showToast = showToast;

    /* ---------------------------------------------------------------
       ALL FORMS — friendly front-end confirmation (no backend wired)
    --------------------------------------------------------------- */
    document.querySelectorAll("form").forEach(form => {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            showToast("Thank you — your submission has been received.");
            this.reset();
        });
    });

    /* ---------------------------------------------------------------
       GRACEFUL IMAGE FALLBACK
       Any photo that hasn't been dropped into /images yet degrades to a
       soft branded placeholder instead of a broken-image icon.
    --------------------------------------------------------------- */
    document.querySelectorAll("img").forEach(img => {
        if (img.id === "scale-image") return; // logo has its own art
        img.addEventListener("error", function () {
            const holder = this.parentElement;
            if (holder) holder.classList.add("img-missing");
        }, { once: true });
    });

    /* ---------------------------------------------------------------
       GALLERY LIGHTBOX
    --------------------------------------------------------------- */
    document.querySelectorAll(".gallery-grid img").forEach(img => {
        img.addEventListener("click", () => {
            const overlay = document.createElement("div");
            Object.assign(overlay.style, {
                position: "fixed", inset: 0, background: "rgba(20,33,58,.92)",
                display: "flex", alignItems: "center", justifyContent: "center",
                zIndex: 9999, cursor: "zoom-out", padding: "30px"
            });
            const image = document.createElement("img");
            image.src = img.src;
            Object.assign(image.style, {
                maxWidth: "90%", maxHeight: "90%", borderRadius: "16px",
                boxShadow: "0 30px 80px rgba(0,0,0,.5)"
            });
            overlay.appendChild(image);
            overlay.addEventListener("click", () => overlay.remove());
            document.body.appendChild(overlay);
        });
    });

    /* ---------------------------------------------------------------
       GALLERY / BLOG FILTER BUTTONS
    --------------------------------------------------------------- */
    function wireFilters(filterSelector, itemSelector, attr) {
        const buttons = document.querySelectorAll(filterSelector);
        if (!buttons.length) return;
        const items = document.querySelectorAll(itemSelector);
        buttons.forEach(btn => {
            btn.addEventListener("click", () => {
                buttons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                const filter = btn.textContent.trim().toLowerCase();
                items.forEach(item => {
                    const tag = (item.getAttribute(attr) || item.dataset.category || "").toLowerCase();
                    const matches = filter === "all" || tag.includes(filter) || item.textContent.toLowerCase().includes(filter);
                    item.style.display = matches ? "" : "none";
                });
            });
        });
    }
    wireFilters(".gallery-filters .filter-btn", ".gallery-grid img", "alt");
    wireFilters(".blog-categories .category-btn", ".blog-grid .blog-card", "data-category");

    /* ---------------------------------------------------------------
       FAQ ACCORDION
    --------------------------------------------------------------- */
    document.querySelectorAll(".faq-question").forEach(question => {
        question.addEventListener("click", () => {
            const answer = question.nextElementSibling;
            const isOpen = question.classList.contains("open");
            document.querySelectorAll(".faq-question").forEach(q => q.classList.remove("open"));
            document.querySelectorAll(".faq-answer").forEach(a => a.classList.remove("open"));
            if (!isOpen) {
                question.classList.add("open");
                answer?.classList.add("open");
            }
        });
    });

    const expandAll = document.getElementById("expandAll");
    const collapseAll = document.getElementById("collapseAll");
    expandAll?.addEventListener("click", () => {
        document.querySelectorAll(".faq-question").forEach(q => q.classList.add("open"));
        document.querySelectorAll(".faq-answer").forEach(a => a.classList.add("open"));
    });
    collapseAll?.addEventListener("click", () => {
        document.querySelectorAll(".faq-question").forEach(q => q.classList.remove("open"));
        document.querySelectorAll(".faq-answer").forEach(a => a.classList.remove("open"));
    });

    /* ---------------------------------------------------------------
       TESTIMONIAL AUTO SLIDER
    --------------------------------------------------------------- */
    const testimonials = document.querySelectorAll(".testimonial");
    if (testimonials.length > 1) {
        let current = 0;
        testimonials.forEach((t, i) => { if (i !== 0) t.style.display = "none"; });
        setInterval(() => {
            testimonials[current].style.display = "none";
            current = (current + 1) % testimonials.length;
            testimonials[current].style.display = "block";
        }, 5000);
    }

    /* ---------------------------------------------------------------
       EVENT COUNTDOWN
    --------------------------------------------------------------- */
    const countdown = document.getElementById("countdown");
    if (countdown) {
        const eventDate = new Date(countdown.dataset.date || "2026-07-20T09:00:00");
        const daysEl = document.getElementById("days");
        const hoursEl = document.getElementById("hours");
        const minutesEl = document.getElementById("minutes");
        const secondsEl = document.getElementById("seconds");

        function updateCountdown() {
            const diff = eventDate - new Date();
            if (diff <= 0) {
                [daysEl, hoursEl, minutesEl, secondsEl].forEach(el => { if (el) el.textContent = "00"; });
                return;
            }
            const d = Math.floor(diff / 86400000);
            const h = Math.floor((diff % 86400000) / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            if (daysEl) daysEl.textContent = String(d).padStart(2, "0");
            if (hoursEl) hoursEl.textContent = String(h).padStart(2, "0");
            if (minutesEl) minutesEl.textContent = String(m).padStart(2, "0");
            if (secondsEl) secondsEl.textContent = String(s).padStart(2, "0");
        }
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    /* ---------------------------------------------------------------
       AUTO YEAR
    --------------------------------------------------------------- */
    document.querySelectorAll(".year").forEach(el => { el.textContent = new Date().getFullYear(); });

    /* ---------------------------------------------------------------
       HOMEPAGE EVENTS SLIDER
       Tries to load live events from the backend API. If the API is
       unreachable (not deployed yet, offline, etc.) the static fallback
       slide already in the HTML is left exactly as-is — the homepage
       never shows a broken or empty slider.
    --------------------------------------------------------------- */
 // 1. Identify Elements
const slides = document.querySelectorAll('.event-slide');
const paginationContainer = document.getElementById('paginationContainer');
let currentIndex = 0;
let slideInterval;

// 2. Dynamically Generate Navigation Dots
slides.forEach((_, index) => {
  const dot = document.createElement('button');
  dot.classList.add('dot');
  if (index === 0) dot.classList.add('active');
  dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
  
  // Allow manual override click
  dot.addEventListener('click', () => {
    goToSlide(index);
    resetTimer();
  });
  
  paginationContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.dot');

// 3. State Management Function
function goToSlide(nextIndex) {
  // Deactivate current slide/dot
  slides[currentIndex].classList.remove('active');
  dots[currentIndex].classList.remove('active');
  
  // Update Index
  currentIndex = nextIndex;
  
  // Activate new slide/dot
  slides[currentIndex].classList.add('active');
  dots[currentIndex].classList.add('active');
}

// 4. Automatic Loop Logic
function startTimer() {
  slideInterval = setInterval(() => {
    let nextIndex = (currentIndex + 1) % slides.length;
    goToSlide(nextIndex);
  }, 5000); // Transitions automatically every 5 seconds
}

function resetTimer() {
  clearInterval(slideInterval);
  startTimer();
}

// Initialize core loops
startTimer();
});
