// ===== VIEW NAVIGATION =====
document.querySelectorAll('.nav-item[data-view]').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const viewName = item.getAttribute('data-view');
        switchView(viewName);
        
        // Update active state
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
    });
});

function switchView(viewName) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    
    // Show selected view
    const targetView = document.getElementById(`view-${viewName}`);
    if (targetView) {
        targetView.classList.add('active');
    }
    
    // Update page title
    const titles = {
        'dashboard': 'Dashboard',
        'workouts': 'Workouts',
        'progress': 'Progress',
        'nutrition': 'Nutrition',
        'coach': 'AI Coach',
        'community': 'Community',
        'settings': 'Settings'
    };
    document.title = `${titles[viewName]} - IgniteCoach`;
}

// ===== MOBILE MENU =====
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const sidebar = document.querySelector('.sidebar');

mobileMenuToggle?.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 1024 && 
        !sidebar.contains(e.target) && 
        !mobileMenuToggle.contains(e.target)) {
        sidebar.classList.remove('open');
    }
});

// ===== WORKOUT FUNCTIONS =====
function startWorkout() {
    document.getElementById('workout-modal').classList.add('active');
    startTimer();
}

function closeWorkout() {
    document.getElementById('workout-modal').classList.remove('active');
    stopTimer();
}

function finishWorkout() {
    if (confirm('Finish workout and save progress?')) {
        closeWorkout();
        showNotification('Workout completed! 🎉', 'success');
    }
}

// ===== TIMER =====
let timerInterval;
let seconds = 0;

function startTimer() {
    seconds = 0;
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        seconds++;
        updateTimerDisplay();
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function updateTimerDisplay() {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    const display = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    document.getElementById('session-timer').textContent = display;
}

// ===== QUICK CHAT =====
function sendQuickMessage() {
    const input = document.getElementById('quick-chat-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    const chatContainer = document.getElementById('quick-chat');
    
    // Add user message
    const userMsg = document.createElement('div');
    userMsg.className = 'message user';
    userMsg.innerHTML = `
        <div class="message-avatar"><i class="fas fa-user"></i></div>
        <div class="message-content"><p>${escapeHtml(message)}</p></div>
    `;
    chatContainer.appendChild(userMsg);
    
    input.value = '';
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    // Simulate AI response
    setTimeout(() => {
        const aiResponse = getAIResponse(message);
        const aiMsg = document.createElement('div');
        aiMsg.className = 'message ai';
        aiMsg.innerHTML = `
            <div class="message-avatar"><i class="fas fa-robot"></i></div>
            <div class="message-content"><p>${aiResponse}</p></div>
        `;
        chatContainer.appendChild(aiMsg);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 1000);
}

function getAIResponse(message) {
    const lower = message.toLowerCase();
    if (lower.includes('shoulder') || lower.includes('hurt')) {
        return "Try narrowing your grip to reduce strain. Want me to suggest alternative exercises that are shoulder-friendly?";
    } else if (lower.includes('tired') || lower.includes('fatigue')) {
        return "Listen to your body! Consider dropping the weight 10% and focusing on form today. Consistency > intensity.";
    } else if (lower.includes('protein') || lower.includes('food')) {
        return "Aim for 0.7-1g per pound of bodyweight. Would you like me to suggest some high-protein meal ideas?";
    } else if (lower.includes('motivation')) {
        return "Remember why you started! Even a 20-minute workout is better than none. You've got this! 🔥";
    } else {
        return "Great question! I'm here to help with form tips, workout modifications, nutrition advice, or motivation. What specifically would you like to know?";
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Enter key for chat
document.getElementById('quick-chat-input')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendQuickMessage();
});

// ===== NOTIFICATIONS =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 24px;
        background: ${type === 'success' ? 'var(--success)' : 'var(--primary)'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 9999;
        animation: slideIn 0.3s;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== LOGOUT =====
function logout() {
    if (confirm('Are you sure you want to log out?')) {
        window.location.href = 'index.html';
    }
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    // Check URL params for plan selection
    const urlParams = new URLSearchParams(window.location.search);
    const plan = urlParams.get('plan');
    if (plan) {
        showNotification(`Welcome! Starting your ${plan} plan setup...`, 'success');
    }
});