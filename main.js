// ===== NAVIGATION =====
const mobileToggle = document.querySelector('.mobile-toggle');
const navMenu = document.querySelector('.nav-menu');

mobileToggle?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== STATS COUNTER ANIMATION =====
const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            el.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
};

// Intersection Observer for stats
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.stat-number');
            counters.forEach(counter => animateCounter(counter));
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsBar = document.querySelector('.stats-bar');
if (statsBar) statsObserver.observe(statsBar);

// ===== PRICING TOGGLE =====
function toggleBilling() {
    const toggle = document.getElementById('billing-toggle');
    const monthlyPrices = document.querySelectorAll('.amount.monthly');
    const yearlyPrices = document.querySelectorAll('.amount.yearly');
    const yearlyLabels = document.querySelectorAll('.yearly-price');
    const labels = document.querySelectorAll('.toggle-label');
    
    if (toggle.checked) {
        // Yearly
        monthlyPrices.forEach(el => el.classList.add('hidden'));
        yearlyPrices.forEach(el => el.classList.remove('hidden'));
        yearlyLabels.forEach(el => el.classList.remove('hidden'));
        labels[0].classList.remove('active');
        labels[1].classList.add('active');
    } else {
        // Monthly
        monthlyPrices.forEach(el => el.classList.remove('hidden'));
        yearlyPrices.forEach(el => el.classList.add('hidden'));
        yearlyLabels.forEach(el => el.classList.add('hidden'));
        labels[0].classList.add('active');
        labels[1].classList.remove('active');
    }
}

function togglePricing(type) {
    const toggle = document.getElementById('billing-toggle');
    toggle.checked = type === 'yearly';
    toggleBilling();
}

// ===== FAQ ACCORDION =====
function toggleFaq(button) {
    const answer = button.nextElementSibling;
    const isActive = button.classList.contains('active');
    
    // Close all others
    document.querySelectorAll('.faq-question').forEach(q => {
        q.classList.remove('active');
        q.nextElementSibling.classList.remove('active');
        q.nextElementSibling.style.maxHeight = null;
    });
    
    // Toggle current
    if (!isActive) {
        button.classList.add('active');
        answer.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
    }
}

// ===== DEMO WORKOUT GENERATOR =====
const demoWorkouts = {
    strength: {
        gym: ['Barbell Squat', 'Bench Press', 'Deadlift', 'Overhead Press', 'Barbell Row'],
        dumbbells: ['Goblet Squat', 'Dumbbell Press', 'Romanian Deadlift', 'Lateral Raise', 'Row'],
        home: ['Squat', 'Push-up', 'Doorway Row', 'Pike Push-up', 'Lunge'],
        bodyweight: ['Pistol Squat', 'Push-up', 'Pull-up', 'Handstand Push-up', 'L-sit']
    },
    muscle: {
        gym: ['Incline Press', 'Cable Fly', 'Lat Pulldown', 'Leg Curl', 'Calf Raise'],
        dumbbells: ['Incline Dumbbell Press', 'Flys', 'Pullover', 'Goblet Squat', 'Curl'],
        home: ['Dips', 'Chin-ups', 'Bulgarian Split Squat', 'Face Pulls', 'Leg Raises'],
        bodyweight: ['Ring Dips', 'Muscle-ups', 'Pistol Squats', 'Nordic Curls', 'Planche']
    },
    fatloss: {
        gym: ['Kettlebell Swing', 'Battle Ropes', 'Box Jumps', 'Sled Push', 'Rowing'],
        dumbbells: ['Thrusters', 'Snatch', 'Clean & Press', 'Farmer Walk', 'Burpees'],
        home: ['Jump Rope', 'Mountain Climbers', 'Burpees', 'High Knees', 'Jump Squats'],
        bodyweight: ['Burpees', 'Mountain Climbers', 'Jumping Jacks', 'Sprints', 'Bear Crawl']
    },
    endurance: {
        gym: ['Running', 'Cycling', 'Elliptical', 'Stair Master', 'Rowing'],
        dumbbells: ['Circuit Training', 'Complexes', 'AMRAP', 'EMOM', 'Tabata'],
        home: ['Jump Rope', 'Running', 'Cycling', 'HIIT', 'Circuit'],
        bodyweight: ['Running', 'Burpees', 'Jumping Jacks', 'High Knees', 'Butt Kicks']
    }
};

function generateDemoWorkout() {
    const goal = document.getElementById('demo-goal').value;
    const equipment = document.getElementById('demo-equipment').value;
    const time = document.getElementById('demo-time').value;
    const resultDiv = document.getElementById('demo-result');
    
    const exercises = demoWorkouts[goal][equipment];
    const sets = time === '30' ? 3 : time === '45' ? 4 : time === '60' ? 4 : 5;
    const reps = goal === 'strength' ? '5-8' : goal === 'muscle' ? '8-12' : goal === 'fatloss' ? '15-20' : '20+';
    
    let html = `
        <div class="demo-workout-result">
            <h3>🔥 Your AI-Generated ${goal.charAt(0).toUpperCase() + goal.slice(1)} Workout</h3>
            <p><strong>Duration:</strong> ${time} minutes | <strong>Equipment:</strong> ${equipment}</p>
            <div class="demo-exercises">
    `;
    
    exercises.forEach((ex, idx) => {
        html += `
            <div class="demo-exercise-item">
                <span class="ex-number">${idx + 1}</span>
                <div class="ex-info">
                    <strong>${ex}</strong>
                    <span>${sets} sets × ${reps} reps</span>
                </div>
            </div>
        `;
    });
    
    html += `
            </div>
            <p style="margin-top: 20px; color: var(--text-secondary); font-size: 0.9rem;">
                <i class="fas fa-info-circle"></i>
                This is a demo. Sign up to get fully personalized workouts with progressive overload tracking!
            </p>
        </div>
    `;
    
    resultDiv.innerHTML = html;
    resultDiv.classList.remove('hidden');
}

// ===== MODAL =====
function openDemo() {
    document.getElementById('demo-modal').classList.add('active');
}

function closeDemo() {
    document.getElementById('demo-modal').classList.remove('active');
}

// Close modal on outside click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .testimonial-card, .pricing-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s, transform 0.6s';
    observer.observe(el);
});

// ===== NAVBAR SCROLL EFFECT =====
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(15,15,15,0.95)';
    } else {
        navbar.style.background = 'rgba(15,15,15,0.8)';
    }
    
    lastScroll = currentScroll;
});