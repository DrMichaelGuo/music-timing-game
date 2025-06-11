// Rhythm Master - Game Logic

class RhythmMasterGame {
    constructor() {
        this.notes = {
            semibreve: { symbol: '𝅝', beats: 4, name: 'Semibreve' },
            minim: { symbol: '𝅗𝅥', beats: 2, name: 'Minim' },
            crotchet: { symbol: '♩', beats: 1, name: 'Crotchet' },
            quaver: { symbol: '♪', beats: 0.5, name: 'Quaver' },
            semiquaver: { symbol: '♬', beats: 0.25, name: 'Semiquaver' }
        };
        
        this.currentQuestion = 0;
        this.totalQuestions = 10;
        this.score = 0;
        this.currentNote = null;
        this.gameStarted = false;
        
        // Achievement tracking
        this.gameStartTime = null;
        this.questionTimes = [];
        this.currentStreak = 0;
        this.maxStreak = 0;
        this.noteStats = {
            semibreve: { correct: 0, total: 0 },
            minim: { correct: 0, total: 0 },
            crotchet: { correct: 0, total: 0 },
            quaver: { correct: 0, total: 0 },
            semiquaver: { correct: 0, total: 0 }
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.showWelcomeScreen();
    }
    
    setupEventListeners() {
        // Welcome screen buttons
        const startGameBtn = document.getElementById('start-game-btn');
        const howToPlayBtn = document.getElementById('how-to-play-btn');
        const achievementsBtn = document.getElementById('achievements-btn');
        const backToWelcomeBtn = document.getElementById('back-to-welcome-btn');
        const backFromAchievementsBtn = document.getElementById('back-from-achievements-btn');
        
        // Game screen buttons
        const answerButtons = document.querySelectorAll('.answer-btn');
        const nextQuestionBtn = document.getElementById('next-question-btn');
        
        // Results screen buttons
        const playAgainBtn = document.getElementById('play-again-btn');
        const backToMenuBtn = document.getElementById('back-to-menu-btn');
        
        if (startGameBtn) {
            startGameBtn.addEventListener('click', () => this.startGame());
        }
        
        if (howToPlayBtn) {
            howToPlayBtn.addEventListener('click', () => this.showHowToPlayScreen());
        }
        
        if (achievementsBtn) {
            achievementsBtn.addEventListener('click', () => this.showAchievementsScreen());
        }
        
        if (backToWelcomeBtn) {
            backToWelcomeBtn.addEventListener('click', () => this.showWelcomeScreen());
        }
        
        if (backFromAchievementsBtn) {
            backFromAchievementsBtn.addEventListener('click', () => this.showWelcomeScreen());
        }
        
        answerButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleAnswer(e));
        });
        
        if (nextQuestionBtn) {
            nextQuestionBtn.addEventListener('click', () => this.nextQuestion());
        }
        
        if (playAgainBtn) {
            playAgainBtn.addEventListener('click', () => this.startGame());
        }
        
        if (backToMenuBtn) {
            backToMenuBtn.addEventListener('click', () => this.showWelcomeScreen());
        }
    }
    
    showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show target screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
        }
    }
    
    showWelcomeScreen() {
        this.showScreen('welcome-screen');
    }
    
    showHowToPlayScreen() {
        this.showScreen('how-to-play-screen');
    }
    
    showGameScreen() {
        this.showScreen('game-screen');
    }
    
    showResultsScreen() {
        this.showScreen('results-screen');
    }
    
    showAchievementsScreen() {
        this.showScreen('achievements-screen');
        // Update achievements display when screen is shown
        if (window.uiManager) {
            window.uiManager.updateAchievementsDisplay();
        }
    }
    
    startGame() {
        this.currentQuestion = 0;
        this.score = 0;
        this.gameStarted = true;
        
        // Reset achievement tracking
        this.gameStartTime = Date.now();
        this.questionTimes = [];
        this.currentStreak = 0;
        this.maxStreak = 0;
        this.noteStats = {
            semibreve: { correct: 0, total: 0 },
            minim: { correct: 0, total: 0 },
            crotchet: { correct: 0, total: 0 },
            quaver: { correct: 0, total: 0 },
            semiquaver: { correct: 0, total: 0 }
        };
        
        this.showGameScreen();
        this.nextQuestion();
    }
    
    nextQuestion() {
        if (this.currentQuestion >= this.totalQuestions) {
            this.endGame();
            return;
        }
        
        this.currentQuestion++;
        this.currentNote = this.getRandomNote();
        this.questionStartTime = Date.now(); // Track question start time
        
        this.updateGameDisplay();
        this.resetAnswerButtons();
        this.hideFeedback();
    }
    
    getRandomNote() {
        const noteKeys = Object.keys(this.notes);
        const randomKey = noteKeys[Math.floor(Math.random() * noteKeys.length)];
        return { key: randomKey, ...this.notes[randomKey] };
    }
    
    updateGameDisplay() {
        // Update score
        const scoreElement = document.getElementById('score');
        if (scoreElement) {
            scoreElement.textContent = this.score;
        }
        
        // Update progress
        const progressFill = document.getElementById('progress-fill');
        const questionCounter = document.getElementById('question-counter');
        
        if (progressFill) {
            const progressPercent = (this.currentQuestion / this.totalQuestions) * 100;
            progressFill.style.width = `${progressPercent}%`;
        }
        
        if (questionCounter) {
            questionCounter.textContent = `${this.currentQuestion}/${this.totalQuestions}`;
        }
        
        // Update current note display
        const currentNoteElement = document.getElementById('current-note');
        if (currentNoteElement && this.currentNote) {
            currentNoteElement.textContent = this.currentNote.symbol;
            // Add animation class
            currentNoteElement.classList.remove('note-float');
            setTimeout(() => {
                currentNoteElement.classList.add('note-float');
            }, 100);
        }
    }
    
    // Enhanced answer handling with better feedback
    handleAnswer(event) {
        const button = event.currentTarget;
        const selectedAnswer = button.dataset.answer;
        
        // Track response time
        const responseTime = Date.now() - this.questionStartTime;
        this.questionTimes.push(responseTime);
        
        // Add haptic feedback
        this.triggerHapticFeedback('light');
        
        // Disable all answer buttons
        this.disableAnswerButtons();
        
        // Check if answer is correct
        const isCorrect = selectedAnswer === this.currentNote.key;
        
        // Update note statistics
        this.noteStats[this.currentNote.key].total++;
        
        if (isCorrect) {
            this.score++;
            this.currentStreak++;
            this.maxStreak = Math.max(this.maxStreak, this.currentStreak);
            this.noteStats[this.currentNote.key].correct++;
            
            button.classList.add('correct');
            this.showFeedback(true, `🎉 Correct! A ${this.currentNote.name} is worth ${this.currentNote.beats} beat${this.currentNote.beats !== 1 ? 's' : ''}.`);
            this.playCorrectSound();
            this.triggerHapticFeedback('success');
            this.celebrate();
        } else {
            this.currentStreak = 0; // Reset streak on incorrect answer
            
            button.classList.add('incorrect');
            // Shake the incorrect button
            if (window.uiManager) {
                window.uiManager.shakeElement(button);
            }
            
            // Highlight correct answer
            const correctButton = document.querySelector(`[data-answer="${this.currentNote.key}"]`);
            if (correctButton) {
                correctButton.classList.add('correct');
                // Pulse the correct answer
                if (window.uiManager) {
                    window.uiManager.pulseElement(correctButton);
                }
            }
            this.showFeedback(false, `❌ Incorrect. A ${this.currentNote.name} is worth ${this.currentNote.beats} beat${this.currentNote.beats !== 1 ? 's' : ''}.`);
            this.playIncorrectSound();
            this.triggerHapticFeedback('error');
        }
        
        // Update score display with animation
        this.updateGameDisplay();
    }
    
    disableAnswerButtons() {
        document.querySelectorAll('.answer-btn').forEach(btn => {
            btn.classList.add('disabled');
        });
    }
    
    resetAnswerButtons() {
        document.querySelectorAll('.answer-btn').forEach(btn => {
            btn.classList.remove('disabled', 'correct', 'incorrect');
        });
    }
    
    showFeedback(isCorrect, message) {
        const feedback = document.getElementById('feedback');
        const feedbackText = document.getElementById('feedback-text');
        
        if (feedback && feedbackText) {
            feedbackText.textContent = message;
            feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
            feedback.classList.remove('hidden');
        }
    }
    
    hideFeedback() {
        const feedback = document.getElementById('feedback');
        if (feedback) {
            feedback.classList.add('hidden');
        }
    }
    
    endGame() {
        this.gameStarted = false;
        
        // Calculate game statistics for achievements
        const totalGameTime = Date.now() - this.gameStartTime;
        const averageResponseTime = this.questionTimes.reduce((a, b) => a + b, 0) / this.questionTimes.length;
        
        const gameData = {
            score: this.score,
            totalQuestions: this.totalQuestions,
            totalTime: totalGameTime,
            averageResponseTime: averageResponseTime,
            maxStreak: this.maxStreak,
            noteStats: this.noteStats
        };
        
        // Check for new achievements
        if (window.achievementSystem) {
            const newAchievements = window.achievementSystem.checkAchievements(gameData);
            
            // Show achievement notifications with delay
            newAchievements.forEach((achievement, index) => {
                setTimeout(() => {
                    if (window.uiManager) {
                        window.uiManager.showAchievementUnlock(achievement);
                    }
                }, (index + 1) * 1000); // Stagger notifications
            });
        }
        
        this.showResultsScreen();
        this.displayResults();
    }
    
    displayResults() {
        const finalScoreElement = document.getElementById('final-score');
        const performanceMessageElement = document.getElementById('performance-message');
        
        if (finalScoreElement) {
            finalScoreElement.textContent = `${this.score}/${this.totalQuestions}`;
        }
        
        if (performanceMessageElement) {
            const percentage = (this.score / this.totalQuestions) * 100;
            let message = '';
            
            if (percentage >= 90) {
                message = '🎵 Outstanding! You\'re a rhythm master!';
            } else if (percentage >= 80) {
                message = '🎶 Excellent work! Keep practicing!';
            } else if (percentage >= 70) {
                message = '🎼 Good job! You\'re getting the hang of it!';
            } else if (percentage >= 60) {
                message = '🎹 Not bad! Keep studying those note values!';
            } else {
                message = '🎯 Keep practicing! You\'ll improve with time!';
            }
            
            performanceMessageElement.textContent = message;
        }
    }
    
    celebrate() {
        // Add celebration animation to score element
        const scoreElement = document.getElementById('score');
        if (scoreElement) {
            scoreElement.parentElement.classList.add('celebrate');
            setTimeout(() => {
                scoreElement.parentElement.classList.remove('celebrate');
            }, 600);
        }
        
        // Show confetti for high scores
        if (window.uiManager && this.score > this.totalQuestions * 0.8) {
            window.uiManager.showConfetti();
        }
    }
    
    // Add haptic feedback for mobile devices
    triggerHapticFeedback(type = 'light') {
        if ('vibrate' in navigator) {
            switch(type) {
                case 'success':
                    navigator.vibrate([50, 30, 50]);
                    break;
                case 'error':
                    navigator.vibrate([100]);
                    break;
                case 'light':
                default:
                    navigator.vibrate(20);
                    break;
            }
        }
    }
    
    playCorrectSound() {
        // Placeholder for correct answer sound
        if (window.audioManager) {
            window.audioManager.playCorrect();
        }
    }
    
    playIncorrectSound() {
        // Placeholder for incorrect answer sound
        if (window.audioManager) {
            window.audioManager.playIncorrect();
        }
    }
    
    // Method to get current game state for debugging
    getGameState() {
        return {
            currentQuestion: this.currentQuestion,
            totalQuestions: this.totalQuestions,
            score: this.score,
            currentNote: this.currentNote,
            gameStarted: this.gameStarted
        };
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.rhythmMasterGame = new RhythmMasterGame();
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RhythmMasterGame;
}