// Rhythm Master - Game Logic

class RhythmMasterGame {
    constructor() {
        this.notes = {
            semibreve: { 
                symbol: '𝅝', 
                beats: 4, 
                name: 'Semibreve',
                svg: '<svg class="current-note-svg" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-label="Semibreve - 4 beats"><ellipse cx="24" cy="24" rx="12" ry="8" fill="none" stroke="currentColor" stroke-width="2.5"/></svg>'
            },
            minim: { 
                symbol: '𝅗𝅥', 
                beats: 2, 
                name: 'Minim',
                svg: '<svg class="current-note-svg" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-label="Minim - 2 beats"><ellipse cx="20" cy="32" rx="8" ry="5" fill="none" stroke="currentColor" stroke-width="2"/><line x1="28" y1="32" x2="28" y2="8" stroke="currentColor" stroke-width="2"/></svg>'
            },
            crotchet: { 
                symbol: '♩', 
                beats: 1, 
                name: 'Crotchet',
                svg: '<svg class="current-note-svg" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-label="Crotchet - 1 beat"><ellipse cx="20" cy="32" rx="8" ry="5" fill="currentColor"/><line x1="28" y1="32" x2="28" y2="8" stroke="currentColor" stroke-width="2"/></svg>'
            },
            quaver: { 
                symbol: '♪', 
                beats: 0.5, 
                name: 'Quaver',
                svg: '<svg class="current-note-svg" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-label="Quaver - half beat"><ellipse cx="18" cy="32" rx="6" ry="4" fill="currentColor"/><line x1="24" y1="32" x2="24" y2="8" stroke="currentColor" stroke-width="2"/><path d="M24 8 C30 10, 34 14, 32 20 C30 18, 28 14, 26 12 C25 10, 24 9, 24 8 Z" fill="currentColor"/><path d="M24 10 C28 11, 30 14, 28 17 C27 15, 25 12, 24 10 Z" fill="currentColor" opacity="0.8"/></svg>'
            },
            semiquaver: { 
                symbol: '♬', 
                beats: 0.25, 
                name: 'Semiquaver',
                svg: '<svg class="current-note-svg" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-label="Semiquaver - quarter beat"><ellipse cx="18" cy="32" rx="6" ry="4" fill="currentColor"/><line x1="24" y1="32" x2="24" y2="8" stroke="currentColor" stroke-width="2"/><path d="M24 8 C30 9, 34 12, 32 16 C30 14, 28 11, 26 10 C25 9, 24 8, 24 8 Z" fill="currentColor"/><path d="M24 16 C30 17, 34 20, 32 24 C30 22, 28 19, 26 18 C25 17, 24 16, 24 16 Z" fill="currentColor"/><path d="M24 10 C27 11, 29 13, 28 15 C27 14, 25 12, 24 10 Z" fill="currentColor" opacity="0.7"/><path d="M24 18 C27 19, 29 21, 28 23 C27 22, 25 20, 24 18 Z" fill="currentColor" opacity="0.7"/></svg>'
            }
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
        
        // Comparison game buttons
        const startComparisonBtn = document.getElementById('start-comparison-btn');
        const comparisonAnswerButtons = document.querySelectorAll('.comparison-answer-btn');
        const nextComparisonBtn = document.getElementById('next-comparison-btn');
        const backFromComparisonBtn = document.getElementById('back-from-comparison-btn');
        const playComparisonAgainBtn = document.getElementById('play-comparison-again-btn');
        const backToMenuFromComparisonBtn = document.getElementById('back-to-menu-from-comparison-btn');
        
        if (startGameBtn) {
            startGameBtn.addEventListener('click', () => this.startGame());
        }
        
        if (startComparisonBtn) {
            startComparisonBtn.addEventListener('click', () => {
                if (window.noteComparisonGame) {
                    window.noteComparisonGame.startGame();
                }
            });
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
        
        if (startComparisonBtn) {
            startComparisonBtn.addEventListener('click', () => this.startComparisonGame());
        }
        
        comparisonAnswerButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleComparisonAnswer(e));
        });
        
        if (nextComparisonBtn) {
            nextComparisonBtn.addEventListener('click', () => this.nextQuestion());
        }
        
        if (backFromComparisonBtn) {
            backFromComparisonBtn.addEventListener('click', () => this.showWelcomeScreen());
        }
        
        if (playComparisonAgainBtn) {
            playComparisonAgainBtn.addEventListener('click', () => this.startGame());
        }
        
        if (backToMenuFromComparisonBtn) {
            backToMenuFromComparisonBtn.addEventListener('click', () => this.showWelcomeScreen());
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
            currentNoteElement.innerHTML = this.currentNote.svg;
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

// Note Value Comparison Game Class
class NoteComparisonGame {
    constructor() {
        this.notes = {
            semibreve: { beats: 4, name: 'Semibreve', plural: 'Semibreves' },
            minim: { beats: 2, name: 'Minim', plural: 'Minims' },
            crotchet: { beats: 1, name: 'Crotchet', plural: 'Crotchets' },
            quaver: { beats: 0.5, name: 'Quaver', plural: 'Quavers' },
            semiquaver: { beats: 0.25, name: 'Semiquaver', plural: 'Semiquavers' }
        };
        
        this.currentQuestion = 0;
        this.totalQuestions = 10;
        this.score = 0;
        this.currentComparison = null;
        this.gameStarted = false;
        this.gameStartTime = null;
        this.questionTimes = [];
        this.currentStreak = 0;
        this.maxStreak = 0;
    }
    
    init() {
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Comparison game buttons (excluding start button which is handled by main game)
        const comparisonAnswerButtons = document.querySelectorAll('.comparison-answer-btn');
        const nextComparisonBtn = document.getElementById('next-comparison-btn');
        const backFromComparisonBtn = document.getElementById('back-from-comparison-btn');
        const playComparisonAgainBtn = document.getElementById('play-comparison-again-btn');
        const backToMenuFromComparisonBtn = document.getElementById('back-to-menu-from-comparison-btn');
        
        comparisonAnswerButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleAnswer(e));
        });
        
        if (nextComparisonBtn) {
            nextComparisonBtn.addEventListener('click', () => this.nextQuestion());
        }
        
        if (backFromComparisonBtn) {
            backFromComparisonBtn.addEventListener('click', () => this.showWelcomeScreen());
        }
        
        if (playComparisonAgainBtn) {
            playComparisonAgainBtn.addEventListener('click', () => this.startGame());
        }
        
        if (backToMenuFromComparisonBtn) {
            backToMenuFromComparisonBtn.addEventListener('click', () => this.showWelcomeScreen());
        }
    }
    
    showWelcomeScreen() {
        this.showScreen('welcome-screen');
    }
    
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
        }
    }
    
    startGame() {
        this.currentQuestion = 0;
        this.score = 0;
        this.gameStarted = true;
        this.gameStartTime = Date.now();
        this.questionTimes = [];
        this.currentStreak = 0;
        this.maxStreak = 0;
        
        this.showScreen('comparison-screen');
        this.nextQuestion();
    }
    
    nextQuestion() {
        if (this.currentQuestion >= this.totalQuestions) {
            this.endGame();
            return;
        }
        
        this.currentQuestion++;
        this.currentComparison = this.generateComparison();
        this.questionStartTime = Date.now();
        
        this.updateGameDisplay();
        this.resetAnswerButtons();
        this.hideFeedback();
    }
    
    generateComparison() {
        const noteKeys = Object.keys(this.notes);
        
        // Pick two different notes for comparison
        let note1Key, note2Key;
        do {
            note1Key = noteKeys[Math.floor(Math.random() * noteKeys.length)];
            note2Key = noteKeys[Math.floor(Math.random() * noteKeys.length)];
        } while (note1Key === note2Key);
        
        const note1 = this.notes[note1Key];
        const note2 = this.notes[note2Key];
        
        // Calculate the relationship
        const ratio = note1.beats / note2.beats;
        
        // Create question based on ratio
        let question, correctAnswer, options;
        
        if (ratio >= 1) {
            // How many note2s equal one note1?
            correctAnswer = Math.round(ratio);
            question = `How many ${note2.plural.toLowerCase()} equal one ${note1.name.toLowerCase()}?`;
            options = this.generateOptions(correctAnswer, 'number');
        } else {
            // How many note1s equal one note2?
            correctAnswer = Math.round(1 / ratio);
            question = `How many ${note1.plural.toLowerCase()} equal one ${note2.name.toLowerCase()}?`;
            options = this.generateOptions(correctAnswer, 'number');
        }
        
        // Add some variety with different question formats
        const questionTypes = [
            'equality',
            'fill_in_beats',
            'which_is_longer'
        ];
        
        const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
        
        if (questionType === 'fill_in_beats' && Math.random() > 0.3) {
            // Alternative question: "A semibreve is worth how many beats?"
            const targetNote = Math.random() > 0.5 ? note1 : note2;
            question = `A ${targetNote.name.toLowerCase()} is worth how many beats?`;
            correctAnswer = targetNote.beats;
            options = this.generateBeatsOptions(correctAnswer);
        } else if (questionType === 'which_is_longer' && Math.random() > 0.5) {
            // Alternative question: "Which note is longer?"
            const longerNote = note1.beats > note2.beats ? note1 : note2;
            question = `Which note lasts longer?`;
            correctAnswer = longerNote.name;
            options = [note1.name, note2.name];
            
            // Add two more random note names as options
            const otherNotes = noteKeys.filter(key => key !== note1Key && key !== note2Key);
            while (options.length < 4 && otherNotes.length > 0) {
                const randomNote = otherNotes.splice(Math.floor(Math.random() * otherNotes.length), 1)[0];
                options.push(this.notes[randomNote].name);
            }
            
            // Shuffle options
            options = options.sort(() => Math.random() - 0.5);
        }
        
        return {
            question,
            correctAnswer,
            options,
            note1: { key: note1Key, ...note1 },
            note2: { key: note2Key, ...note2 }
        };
    }
    
    generateOptions(correct, type) {
        const options = [correct];
        
        // Generate incorrect options
        while (options.length < 4) {
            let option;
            if (type === 'number') {
                // Generate numbers around the correct answer
                const variation = Math.max(1, Math.floor(correct * 0.5));
                option = correct + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * variation + 1);
                if (option <= 0) option = correct + variation;
                
                if (!options.includes(option) && option > 0) {
                    options.push(option);
                }
            } else {
                // For non-number types, break out to avoid infinite loop
                break;
            }
        }
        
        // Shuffle options
        return options.sort(() => Math.random() - 0.5);
    }
    
    generateBeatsOptions(correct) {
        const commonBeats = [0.25, 0.5, 1, 2, 4];
        const options = [correct];
        
        // Add other beat values as options
        for (const beats of commonBeats) {
            if (beats !== correct && options.length < 4) {
                options.push(beats);
            }
        }
        
        // If we still need more options, add some variations
        let attempts = 0;
        while (options.length < 4 && attempts < 10) {
            attempts++;
            const variation = correct * (Math.random() > 0.5 ? 2 : 0.5);
            if (!options.includes(variation) && variation > 0 && variation <= 8) {
                options.push(variation);
            } else {
                const randomValue = Math.max(0.25, correct + (Math.random() > 0.5 ? 1 : -1) * Math.random());
                if (!options.includes(randomValue)) {
                    options.push(randomValue);
                }
            }
        }
        
        // Ensure we have at least 4 options
        while (options.length < 4) {
            options.push(options.length); // Simple fallback
        }
        
        // Shuffle options
        return options.sort(() => Math.random() - 0.5);
    }
    
    updateGameDisplay() {
        // Update score
        const scoreElement = document.getElementById('comparison-score');
        if (scoreElement) {
            scoreElement.textContent = this.score;
        }
        
        // Update progress
        const progressFill = document.getElementById('comparison-progress-fill');
        const questionCounter = document.getElementById('comparison-question-counter');
        
        if (progressFill) {
            const progressPercent = (this.currentQuestion / this.totalQuestions) * 100;
            progressFill.style.width = `${progressPercent}%`;
        }
        
        if (questionCounter) {
            questionCounter.textContent = `${this.currentQuestion}/${this.totalQuestions}`;
        }
        
        // Update question
        const questionElement = document.getElementById('comparison-question-text');
        if (questionElement && this.currentComparison) {
            questionElement.textContent = this.currentComparison.question;
        }
        
        // Update answer buttons
        const answerButtons = document.querySelectorAll('.comparison-answer-btn');
        if (this.currentComparison && answerButtons.length >= 4) {
            this.currentComparison.options.forEach((option, index) => {
                if (answerButtons[index]) {
                    // Display the option appropriately
                    const displayText = typeof option === 'number' ? 
                        (option % 1 === 0 ? option.toString() : option.toString()) : 
                        option;
                    answerButtons[index].textContent = displayText;
                    answerButtons[index].dataset.answer = option;
                }
            });
        }
    }
    
    handleAnswer(event) {
        const button = event.currentTarget;
        const selectedAnswer = button.dataset.answer;
        
        // Track response time
        const responseTime = Date.now() - this.questionStartTime;
        this.questionTimes.push(responseTime);
        
        // Disable all answer buttons
        this.disableAnswerButtons();
        
        // Check if answer is correct (handle both numbers and strings)
        let isCorrect = false;
        if (typeof this.currentComparison.correctAnswer === 'number') {
            isCorrect = parseFloat(selectedAnswer) === this.currentComparison.correctAnswer;
        } else {
            isCorrect = selectedAnswer === this.currentComparison.correctAnswer;
        }
        
        if (isCorrect) {
            this.score++;
            this.currentStreak++;
            this.maxStreak = Math.max(this.maxStreak, this.currentStreak);
            
            button.classList.add('correct');
            this.showFeedback(true, `🎉 Correct! The answer is ${this.currentComparison.correctAnswer}.`);
            this.playCorrectSound();
        } else {
            this.currentStreak = 0;
            
            button.classList.add('incorrect');
            
            // Highlight correct answer
            const correctButton = document.querySelector(`.comparison-answer-btn[data-answer="${this.currentComparison.correctAnswer}"]`);
            if (correctButton) {
                correctButton.classList.add('correct');
            }
            
            this.showFeedback(false, `❌ Incorrect. The correct answer is ${this.currentComparison.correctAnswer}.`);
            this.playIncorrectSound();
        }
        
        this.updateGameDisplay();
    }
    
    disableAnswerButtons() {
        document.querySelectorAll('.comparison-answer-btn').forEach(btn => {
            btn.classList.add('disabled');
        });
    }
    
    resetAnswerButtons() {
        document.querySelectorAll('.comparison-answer-btn').forEach(btn => {
            btn.classList.remove('disabled', 'correct', 'incorrect');
        });
    }
    
    showFeedback(isCorrect, message) {
        const feedback = document.getElementById('comparison-feedback');
        const feedbackText = document.getElementById('comparison-feedback-text');
        
        if (feedback && feedbackText) {
            feedbackText.textContent = message;
            feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
            feedback.classList.remove('hidden');
        }
    }
    
    hideFeedback() {
        const feedback = document.getElementById('comparison-feedback');
        if (feedback) {
            feedback.classList.add('hidden');
        }
    }
    
    playCorrectSound() {
        if (window.audioManager) {
            window.audioManager.playCorrect();
        }
    }
    
    playIncorrectSound() {
        if (window.audioManager) {
            window.audioManager.playIncorrect();
        }
    }
    
    endGame() {
        this.gameStarted = false;
        this.displayResults();
        this.showScreen('comparison-results-screen');
        
        // Track statistics and achievements
        this.updateStats();
        this.checkAchievements();
    }
    
    displayResults() {
        const finalScoreElement = document.getElementById('comparison-final-score');
        const performanceMessageElement = document.getElementById('comparison-performance-message');
        
        if (finalScoreElement) {
            finalScoreElement.textContent = `${this.score}/${this.totalQuestions}`;
        }
        
        if (performanceMessageElement) {
            const percentage = (this.score / this.totalQuestions) * 100;
            let message = '';
            
            if (percentage >= 90) {
                message = '🧮 Outstanding! You\'re a note value master!';
            } else if (percentage >= 80) {
                message = '🎯 Excellent work! You understand note relationships!';
            } else if (percentage >= 70) {
                message = '📊 Good job! You\'re getting the hang of it!';
            } else if (percentage >= 60) {
                message = '🔢 Not bad! Keep studying those note values!';
            } else {
                message = '📚 Keep practicing! You\'ll improve with time!';
            }
            
            performanceMessageElement.textContent = message;
        }
    }
    
    updateStats() {
        // Update game statistics (placeholder for future implementation)
        if (window.settingsManager) {
            const stats = window.settingsManager.getStats();
            stats.comparisonGamesPlayed = (stats.comparisonGamesPlayed || 0) + 1;
            stats.comparisonTotalScore = (stats.comparisonTotalScore || 0) + this.score;
            stats.comparisonBestStreak = Math.max(stats.comparisonBestStreak || 0, this.maxStreak);
            window.settingsManager.saveStats(stats);
        }
    }
    
    checkAchievements() {
        // Check for achievements (placeholder for future implementation)
        if (window.achievementSystem) {
            // Perfect score achievement
            if (this.score === this.totalQuestions) {
                window.achievementSystem.unlock('comparison-perfect');
            }
            
            // Speed achievement
            const avgTime = this.questionTimes.reduce((a, b) => a + b, 0) / this.questionTimes.length;
            if (avgTime < 3000) { // Less than 3 seconds average
                window.achievementSystem.unlock('comparison-speed');
            }
        }
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.rhythmMasterGame = new RhythmMasterGame();
    window.noteComparisonGame = new NoteComparisonGame();
    window.noteComparisonGame.init();
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RhythmMasterGame;
}