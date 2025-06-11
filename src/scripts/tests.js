// Simple Test Suite for Rhythm Master Game

class RhythmMasterTests {
    constructor() {
        this.tests = [];
        this.results = {
            passed: 0,
            failed: 0,
            total: 0
        };
    }
    
    // Test runner
    async runTests() {
        console.log('🎵 Running Rhythm Master Tests...\n');
        
        // Wait for DOM to be ready
        await this.waitForDOM();
        
        // Game logic tests
        this.testNoteGeneration();
        this.testScoreTracking();
        this.testProgressTracking();
        this.testAchievementSystem();
        this.testAudioSystem();
        this.testUIResponsiveness();
        
        // Display results
        this.displayResults();
    }
    
    // Wait for DOM and game initialization
    waitForDOM() {
        return new Promise(resolve => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }
    
    // Test note generation
    testNoteGeneration() {
        this.test('Note Generation', () => {
            const game = new RhythmMasterGame();
            const note = game.getRandomNote();
            
            this.assert(note !== null, 'Note should be generated');
            this.assert(note.key, 'Note should have a key');
            this.assert(note.symbol, 'Note should have a symbol');
            this.assert(note.beats, 'Note should have beats value');
            this.assert(note.name, 'Note should have a name');
            
            const validKeys = ['semibreve', 'minim', 'crotchet', 'quaver', 'semiquaver'];
            this.assert(validKeys.includes(note.key), 'Note key should be valid');
        });
    }
    
    // Test score tracking
    testScoreTracking() {
        this.test('Score Tracking', () => {
            const game = new RhythmMasterGame();
            
            this.assert(game.score === 0, 'Initial score should be 0');
            this.assert(game.currentQuestion === 0, 'Initial question should be 0');
            this.assert(game.totalQuestions === 10, 'Total questions should be 10');
        });
    }
    
    // Test progress tracking
    testProgressTracking() {
        this.test('Progress Tracking', () => {
            const game = new RhythmMasterGame();
            
            // Test game state
            const state = game.getGameState();
            this.assert(state.currentQuestion === 0, 'Initial current question should be 0');
            this.assert(state.score === 0, 'Initial score should be 0');
            this.assert(state.gameStarted === false, 'Game should not be started initially');
        });
    }
    
    // Test achievement system
    testAchievementSystem() {
        this.test('Achievement System', () => {
            if (window.achievementSystem) {
                const progress = window.achievementSystem.getProgress();
                
                this.assert(progress.totalCount > 0, 'Should have achievements defined');
                this.assert(progress.unlockedCount >= 0, 'Unlocked count should be non-negative');
                this.assert(progress.percentage >= 0 && progress.percentage <= 100, 'Percentage should be valid');
                
                const achievements = window.achievementSystem.getDisplayAchievements();
                this.assert(Array.isArray(achievements), 'Should return array of achievements');
            } else {
                console.warn('Achievement system not available for testing');
            }
        });
    }
    
    // Test audio system
    testAudioSystem() {
        this.test('Audio System', () => {
            if (window.audioManager) {
                const state = window.audioManager.getState();
                
                this.assert(typeof state.enabled === 'boolean', 'Audio enabled state should be boolean');
                this.assert(typeof state.volume === 'number', 'Volume should be number');
                this.assert(state.volume >= 0 && state.volume <= 1, 'Volume should be between 0 and 1');
            } else {
                console.warn('Audio manager not available for testing');
            }
        });
    }
    
    // Test UI responsiveness
    testUIResponsiveness() {
        this.test('UI Responsiveness', () => {
            // Test essential elements exist
            const welcomeScreen = document.getElementById('welcome-screen');
            const gameScreen = document.getElementById('game-screen');
            const resultsScreen = document.getElementById('results-screen');
            const achievementsScreen = document.getElementById('achievements-screen');
            
            this.assert(welcomeScreen !== null, 'Welcome screen should exist');
            this.assert(gameScreen !== null, 'Game screen should exist');
            this.assert(resultsScreen !== null, 'Results screen should exist');
            this.assert(achievementsScreen !== null, 'Achievements screen should exist');
            
            // Test buttons exist
            const startButton = document.getElementById('start-game-btn');
            const howToPlayButton = document.getElementById('how-to-play-btn');
            const achievementsButton = document.getElementById('achievements-btn');
            
            this.assert(startButton !== null, 'Start button should exist');
            this.assert(howToPlayButton !== null, 'How to play button should exist');
            this.assert(achievementsButton !== null, 'Achievements button should exist');
            
            // Test answer buttons exist
            const answerButtons = document.querySelectorAll('.answer-btn');
            this.assert(answerButtons.length === 5, 'Should have 5 answer buttons');
        });
    }
    
    // Test helper
    test(name, testFunction) {
        try {
            testFunction();
            this.results.passed++;
            console.log(`✅ ${name}`);
        } catch (error) {
            this.results.failed++;
            console.error(`❌ ${name}: ${error.message}`);
        }
        this.results.total++;
    }
    
    // Assertion helper
    assert(condition, message) {
        if (!condition) {
            throw new Error(message);
        }
    }
    
    // Display test results
    displayResults() {
        console.log('\n📊 Test Results:');
        console.log(`   Total: ${this.results.total}`);
        console.log(`   Passed: ${this.results.passed}`);
        console.log(`   Failed: ${this.results.failed}`);
        console.log(`   Success Rate: ${Math.round((this.results.passed / this.results.total) * 100)}%`);
        
        if (this.results.failed === 0) {
            console.log('\n🎉 All tests passed! The game is working correctly.');
        } else {
            console.log('\n⚠️  Some tests failed. Please check the issues above.');
        }
    }
}

// Auto-run tests in development mode
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Run tests after everything loads
    setTimeout(() => {
        if (confirm('Run automated tests for Rhythm Master?')) {
            const tester = new RhythmMasterTests();
            tester.runTests();
        }
    }, 1000);
}

// Export for manual testing
window.RhythmMasterTests = RhythmMasterTests;
