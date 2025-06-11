// UI Manager for Rhythm Master

class UIManager {
    constructor() {
        this.animations = new Map();
        this.init();
    }
    
    init() {
        this.setupAnimations();
        this.setupAccessibility();
        this.setupKeyboardNavigation();
    }
    
    // Setup smooth animations for UI elements
    setupAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        document.querySelectorAll('.note-item, .answer-btn').forEach(el => {
            observer.observe(el);
        });
    }
    
    // Setup accessibility features
    setupAccessibility() {
        // Add ARIA labels where needed
        const answerButtons = document.querySelectorAll('.answer-btn');
        answerButtons.forEach(btn => {
            const noteName = btn.querySelector('.answer-name')?.textContent;
            const noteBeats = btn.querySelector('.answer-beats')?.textContent;
            if (noteName && noteBeats) {
                btn.setAttribute('aria-label', `${noteName}, ${noteBeats}`);
            }
        });
        
        // Add skip link for keyboard users
        this.addSkipLink();
    }
    
    // Add skip navigation link
    addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-blue);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 1000;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    // Setup keyboard navigation
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Handle escape key to go back
            if (e.key === 'Escape') {
                const activeScreen = document.querySelector('.screen.active');
                if (activeScreen) {
                    const screenId = activeScreen.id;
                    if (screenId === 'game-screen' || screenId === 'how-to-play-screen') {
                        window.rhythmMasterGame?.showWelcomeScreen();
                    }
                }
            }
            
            // Handle number keys for answers (1-5)
            if (e.key >= '1' && e.key <= '5') {
                const gameScreen = document.getElementById('game-screen');
                if (gameScreen && gameScreen.classList.contains('active')) {
                    const answerButtons = document.querySelectorAll('.answer-btn:not(.disabled)');
                    const buttonIndex = parseInt(e.key) - 1;
                    if (answerButtons[buttonIndex]) {
                        answerButtons[buttonIndex].click();
                    }
                }
            }
        });
    }
    
    // Show loading state
    showLoading(element, text = 'Loading...') {
        if (!element) return;
        
        const originalContent = element.innerHTML;
        element.innerHTML = `
            <div class="loading-state">
                <div class="spinner"></div>
                <span>${text}</span>
            </div>
        `;
        
        return () => {
            element.innerHTML = originalContent;
        };
    }
    
    // Show success message with animation
    showSuccessMessage(message, duration = 3000) {
        this.showNotification(message, 'success', duration);
    }
    
    // Show error message with animation
    showErrorMessage(message, duration = 3000) {
        this.showNotification(message, 'error', duration);
    }
    
    // Generic notification system
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success-green)' : 
                        type === 'error' ? 'var(--error-red)' : 'var(--primary-blue)'};
            color: white;
            padding: var(--spacing-md) var(--spacing-lg);
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-large);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, duration);
    }
    
    // Animate score change
    animateScoreChange(element, newScore, oldScore = 0) {
        if (!element) return;
        
        const duration = 1000;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            
            const currentScore = Math.floor(oldScore + (newScore - oldScore) * easeOutQuart);
            element.textContent = currentScore;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    // Animate progress bar
    animateProgress(element, percentage, duration = 500) {
        if (!element) return;
        
        element.style.transition = `width ${duration}ms ease-out`;
        element.style.width = `${percentage}%`;
    }
    
    // Add confetti effect for celebrations
    showConfetti() {
        const colors = ['#007AFF', '#34C759', '#FF9500', '#FF3B30', '#5856D6'];
        const confettiCount = 50;
        
        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                this.createConfettiPiece(colors[Math.floor(Math.random() * colors.length)]);
            }, i * 50);
        }
    }
    
    createConfettiPiece(color) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${color};
            left: ${Math.random() * 100}vw;
            top: -10px;
            z-index: 1000;
            pointer-events: none;
            border-radius: 2px;
            animation: confetti-fall 3s ease-out forwards;
        `;
        
        document.body.appendChild(confetti);
        
        // Remove after animation
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
            }
        }, 3000);
    }
    
    // Shake animation for incorrect answers
    shakeElement(element) {
        if (!element) return;
        
        element.classList.add('shake');
        setTimeout(() => {
            element.classList.remove('shake');
        }, 500);
    }
    
    // Pulse animation for correct answers
    pulseElement(element) {
        if (!element) return;
        
        element.classList.add('pulse');
        setTimeout(() => {
            element.classList.remove('pulse');
        }, 500);
    }
    
    // Update theme (future feature)
    setTheme(theme) {
        document.body.setAttribute('data-theme', theme);
    }
    
    // Get user preferences
    getUserPreferences() {
        return {
            reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        };
    }
    
    // Respect user's motion preferences
    respectMotionPreferences() {
        const prefersReducedMotion = this.getUserPreferences().reducedMotion;
        
        if (prefersReducedMotion) {
            document.body.classList.add('reduce-motion');
        }
    }
    
    // Achievement-related UI methods
    showAchievementUnlock(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-notification-header">
                <span class="achievement-notification-icon">${achievement.icon}</span>
                <span class="achievement-notification-title">Achievement Unlocked!</span>
            </div>
            <div class="achievement-notification-name">${achievement.name}</div>
            <div class="achievement-notification-description">${achievement.description}</div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 4000);
        
        // Play achievement sound
        if (window.audioManager) {
            window.audioManager.playAchievement();
        }
    }
    
    // Update achievements display
    updateAchievementsDisplay() {
        if (!window.achievementSystem) return;
        
        const progress = window.achievementSystem.getProgress();
        const achievements = window.achievementSystem.getDisplayAchievements();
        
        // Update progress bar
        const countElement = document.getElementById('achievement-count');
        const progressFill = document.getElementById('achievement-progress-fill');
        
        if (countElement) {
            countElement.textContent = `${progress.unlockedCount}/${progress.totalCount}`;
        }
        
        if (progressFill) {
            progressFill.style.width = `${progress.percentage}%`;
        }
        
        // Update achievements list
        const listElement = document.getElementById('achievements-list');
        if (listElement) {
            listElement.innerHTML = achievements.map(achievement => `
                <div class="achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}">
                    <div class="achievement-icon">${achievement.icon}</div>
                    <div class="achievement-info">
                        <div class="achievement-name">${achievement.name}</div>
                        <div class="achievement-description">${achievement.description}</div>
                        ${achievement.unlocked && achievement.unlockedAt ? 
                            `<div class="achievement-date">Unlocked ${new Date(achievement.unlockedAt).toLocaleDateString()}</div>` : 
                            ''}
                    </div>
                </div>
            `).join('');
        }
        
        // Update stats
        this.updateStatsDisplay(progress.stats);
    }
    
    // Update stats display
    updateStatsDisplay(stats) {
        const elements = {
            'games-played': stats.gamesPlayed,
            'total-score': stats.totalScore,
            'best-streak': stats.bestStreak,
            'average-score': stats.gamesPlayed > 0 ? 
                Math.round((stats.totalScore / (stats.gamesPlayed * 10)) * 100) + '%' : '0%'
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }
}

// Add confetti animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes confetti-fall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
        20%, 40%, 60%, 80% { transform: translateX(3px); }
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    .shake {
        animation: shake 0.5s ease-in-out;
    }
    
    .pulse {
        animation: pulse 0.5s ease-in-out;
    }
    
    .reduce-motion * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
    
    .animate-in {
        animation: slideInUp 0.6s ease-out;
    }
`;
document.head.appendChild(style);

// Initialize UI manager
document.addEventListener('DOMContentLoaded', () => {
    window.uiManager = new UIManager();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIManager;
}