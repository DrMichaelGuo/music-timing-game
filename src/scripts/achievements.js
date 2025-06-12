// Achievement System for Rhythm Master

class AchievementSystem {
    constructor() {
        this.achievements = {
            'first_try': {
                id: 'first_try',
                name: 'First Steps',
                description: 'Complete your first game',
                icon: '🎯',
                unlocked: false,
                hidden: false
            },
            'perfect_score': {
                id: 'perfect_score',
                name: 'Perfect Pitch',
                description: 'Get 100% on a game',
                icon: '🏆',
                unlocked: false,
                hidden: false
            },
            'speed_demon': {
                id: 'speed_demon',
                name: 'Speed Demon',
                description: 'Answer all questions in under 2 seconds each',
                icon: '⚡',
                unlocked: false,
                hidden: false
            },
            'rhythm_master': {
                id: 'rhythm_master',
                name: 'Rhythm Master',
                description: 'Complete 10 games',
                icon: '🎵',
                unlocked: false,
                hidden: false
            },
            'streak_master': {
                id: 'streak_master',
                name: 'Streak Master',
                description: 'Get 5 correct answers in a row',
                icon: '🔥',
                unlocked: false,
                hidden: false
            },
            'note_scholar': {
                id: 'note_scholar',
                name: 'Note Scholar',
                description: 'Correctly identify each note type at least once',
                icon: '📚',
                unlocked: false,
                hidden: false
            },
            'comparison_perfect': {
                id: 'comparison_perfect',
                name: 'Math Maestro',
                description: 'Get 100% on a Note Comparison game',
                icon: '🧮',
                unlocked: false,
                hidden: false
            },
            'comparison_speed': {
                id: 'comparison_speed',
                name: 'Quick Calculator',
                description: 'Answer comparison questions in under 3 seconds each',
                icon: '⚡',
                unlocked: false,
                hidden: false
            },
            'comparison_master': {
                id: 'comparison_master',
                name: 'Relationship Expert',
                description: 'Complete 5 Note Comparison games',
                icon: '🔗',
                unlocked: false,
                hidden: false
            }
        };
        
        this.gameStats = {
            gamesPlayed: 0,
            totalScore: 0,
            averageTime: 0,
            currentStreak: 0,
            bestStreak: 0,
            noteTypeStats: {
                semibreve: { correct: 0, total: 0 },
                minim: { correct: 0, total: 0 },
                crotchet: { correct: 0, total: 0 },
                quaver: { correct: 0, total: 0 },
                semiquaver: { correct: 0, total: 0 }
            }
        };
        
        this.loadProgress();
    }
    
    // Load progress from localStorage
    loadProgress() {
        try {
            const saved = localStorage.getItem('rhythmMaster_achievements');
            if (saved) {
                const data = JSON.parse(saved);
                this.achievements = { ...this.achievements, ...data.achievements };
                this.gameStats = { ...this.gameStats, ...data.gameStats };
            }
        } catch (error) {
            console.log('Could not load achievement progress:', error);
        }
    }
    
    // Save progress to localStorage
    saveProgress() {
        try {
            const data = {
                achievements: this.achievements,
                gameStats: this.gameStats,
                lastSaved: Date.now()
            };
            localStorage.setItem('rhythmMaster_achievements', JSON.stringify(data));
        } catch (error) {
            console.log('Could not save achievement progress:', error);
        }
    }
    
    // Check and unlock achievements
    checkAchievements(gameData) {
        const newUnlocks = [];
        
        // First try achievement
        if (this.gameStats.gamesPlayed === 0 && !this.achievements.first_try.unlocked) {
            this.unlockAchievement('first_try');
            newUnlocks.push(this.achievements.first_try);
        }
        
        // Perfect score achievement
        if (gameData.score === gameData.totalQuestions && !this.achievements.perfect_score.unlocked) {
            this.unlockAchievement('perfect_score');
            newUnlocks.push(this.achievements.perfect_score);
        }
        
        // Speed demon achievement
        if (gameData.averageResponseTime < 2000 && !this.achievements.speed_demon.unlocked) {
            this.unlockAchievement('speed_demon');
            newUnlocks.push(this.achievements.speed_demon);
        }
        
        // Update game stats
        this.gameStats.gamesPlayed++;
        this.gameStats.totalScore += gameData.score;
        
        // Check rhythm master achievement (10 games)
        if (this.gameStats.gamesPlayed >= 10 && !this.achievements.rhythm_master.unlocked) {
            this.unlockAchievement('rhythm_master');
            newUnlocks.push(this.achievements.rhythm_master);
        }
        
        // Check streak achievements
        if (gameData.maxStreak >= 5 && !this.achievements.streak_master.unlocked) {
            this.unlockAchievement('streak_master');
            newUnlocks.push(this.achievements.streak_master);
        }
        
        // Check note scholar achievement
        this.updateNoteStats(gameData.noteStats);
        if (this.checkNoteScholar() && !this.achievements.note_scholar.unlocked) {
            this.unlockAchievement('note_scholar');
            newUnlocks.push(this.achievements.note_scholar);
        }
        
        // Comparison game achievements
        if (gameData.gameMode === 'comparison') {
            // Perfect score in comparison
            if (gameData.score === gameData.totalQuestions && !this.achievements.comparison_perfect.unlocked) {
                this.unlockAchievement('comparison_perfect');
                newUnlocks.push(this.achievements.comparison_perfect);
            }
            
            // Speed in comparison
            if (gameData.averageResponseTime < 3000 && !this.achievements.comparison_speed.unlocked) {
                this.unlockAchievement('comparison_speed');
                newUnlocks.push(this.achievements.comparison_speed);
            }
            
            // Mastery in comparison
            if (this.gameStats.gamesPlayed >= 5 && !this.achievements.comparison_master.unlocked) {
                this.unlockAchievement('comparison_master');
                newUnlocks.push(this.achievements.comparison_master);
            }
        }
        
        this.saveProgress();
        return newUnlocks;
    }
    
    // Unlock an achievement
    unlockAchievement(achievementId) {
        if (this.achievements[achievementId]) {
            this.achievements[achievementId].unlocked = true;
            this.achievements[achievementId].unlockedAt = Date.now();
            
            // Trigger celebration
            this.celebrateAchievement(this.achievements[achievementId]);
        }
    }
    
    // Update note type statistics
    updateNoteStats(noteStats) {
        Object.keys(noteStats).forEach(noteType => {
            if (this.gameStats.noteTypeStats[noteType]) {
                this.gameStats.noteTypeStats[noteType].correct += noteStats[noteType].correct;
                this.gameStats.noteTypeStats[noteType].total += noteStats[noteType].total;
            }
        });
    }
    
    // Check if note scholar achievement should be unlocked
    checkNoteScholar() {
        return Object.values(this.gameStats.noteTypeStats).every(stat => stat.correct > 0);
    }
    
    // Celebrate achievement unlock
    celebrateAchievement(achievement) {
        if (window.uiManager) {
            // Show achievement notification
            window.uiManager.showAchievementUnlock(achievement);
            
            // Trigger confetti
            setTimeout(() => {
                window.uiManager.showConfetti();
            }, 500);
        }
        
        // Play achievement sound
        if (window.audioManager) {
            window.audioManager.playAchievement();
        }
    }
    
    // Get achievement progress for display
    getProgress() {
        const unlockedCount = Object.values(this.achievements).filter(a => a.unlocked).length;
        const totalCount = Object.keys(this.achievements).length;
        
        return {
            unlockedCount,
            totalCount,
            percentage: Math.round((unlockedCount / totalCount) * 100),
            achievements: this.achievements,
            stats: this.gameStats
        };
    }
    
    // Get achievements for display
    getDisplayAchievements() {
        return Object.values(this.achievements)
            .filter(achievement => !achievement.hidden)
            .sort((a, b) => {
                if (a.unlocked && !b.unlocked) return -1;
                if (!a.unlocked && b.unlocked) return 1;
                return 0;
            });
    }
    
    // Reset all achievements (for testing)
    resetAchievements() {
        Object.keys(this.achievements).forEach(key => {
            this.achievements[key].unlocked = false;
            delete this.achievements[key].unlockedAt;
        });
        
        this.gameStats = {
            gamesPlayed: 0,
            totalScore: 0,
            averageTime: 0,
            currentStreak: 0,
            bestStreak: 0,
            noteTypeStats: {
                semibreve: { correct: 0, total: 0 },
                minim: { correct: 0, total: 0 },
                crotchet: { correct: 0, total: 0 },
                quaver: { correct: 0, total: 0 },
                semiquaver: { correct: 0, total: 0 }
            }
        };
        
        this.saveProgress();
    }
}

// Initialize achievement system
document.addEventListener('DOMContentLoaded', () => {
    window.achievementSystem = new AchievementSystem();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AchievementSystem;
}
