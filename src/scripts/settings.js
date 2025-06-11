// Settings and Preferences System for Rhythm Master

class SettingsManager {
    constructor() {
        this.defaultSettings = {
            audio: {
                enabled: true,
                volume: 0.7,
                soundEffects: true,
                backgroundMusic: false
            },
            game: {
                difficulty: 'normal', // easy, normal, hard
                questionCount: 10,
                timeLimit: false,
                showHints: true
            },
            ui: {
                theme: 'auto', // light, dark, auto
                animations: true,
                hapticFeedback: true,
                reducedMotion: false
            },
            accessibility: {
                highContrast: false,
                largeText: false,
                keyboardNavigation: true,
                screenReader: false
            }
        };
        
        this.settings = { ...this.defaultSettings };
        this.loadSettings();
        this.applySettings();
    }
    
    // Load settings from localStorage
    loadSettings() {
        try {
            const saved = localStorage.getItem('rhythmMaster_settings');
            if (saved) {
                const savedSettings = JSON.parse(saved);
                this.settings = this.mergeSettings(this.defaultSettings, savedSettings);
            }
        } catch (error) {
            console.log('Could not load settings:', error);
            this.settings = { ...this.defaultSettings };
        }
    }
    
    // Merge saved settings with defaults (in case new settings are added)
    mergeSettings(defaults, saved) {
        const merged = {};
        
        Object.keys(defaults).forEach(category => {
            merged[category] = {};
            Object.keys(defaults[category]).forEach(setting => {
                merged[category][setting] = saved[category] && saved[category][setting] !== undefined
                    ? saved[category][setting]
                    : defaults[category][setting];
            });
        });
        
        return merged;
    }
    
    // Save settings to localStorage
    saveSettings() {
        try {
            localStorage.setItem('rhythmMaster_settings', JSON.stringify(this.settings));
        } catch (error) {
            console.log('Could not save settings:', error);
        }
    }
    
    // Get a setting value
    get(category, setting) {
        return this.settings[category] && this.settings[category][setting];
    }
    
    // Set a setting value
    set(category, setting, value) {
        if (!this.settings[category]) {
            this.settings[category] = {};
        }
        
        this.settings[category][setting] = value;
        this.saveSettings();
        this.applySetting(category, setting, value);
    }
    
    // Get all settings
    getAll() {
        return { ...this.settings };
    }
    
    // Apply all settings
    applySettings() {
        Object.keys(this.settings).forEach(category => {
            Object.keys(this.settings[category]).forEach(setting => {
                this.applySetting(category, setting, this.settings[category][setting]);
            });
        });
    }
    
    // Apply a specific setting
    applySetting(category, setting, value) {
        switch (`${category}.${setting}`) {
            case 'audio.enabled':
                if (window.audioManager) {
                    if (value) {
                        window.audioManager.enable();
                    } else {
                        window.audioManager.disable();
                    }
                }
                break;
                
            case 'audio.volume':
                if (window.audioManager) {
                    window.audioManager.setVolume(value);
                }
                break;
                
            case 'ui.theme':
                this.applyTheme(value);
                break;
                
            case 'ui.animations':
                document.body.classList.toggle('no-animations', !value);
                break;
                
            case 'ui.reducedMotion':
                document.body.classList.toggle('reduce-motion', value);
                break;
                
            case 'accessibility.highContrast':
                document.body.classList.toggle('high-contrast', value);
                break;
                
            case 'accessibility.largeText':
                document.body.classList.toggle('large-text', value);
                break;
                
            case 'game.questionCount':
                if (window.rhythmMasterGame) {
                    window.rhythmMasterGame.totalQuestions = value;
                }
                break;
        }
    }
    
    // Apply theme setting
    applyTheme(theme) {
        const root = document.documentElement;
        
        if (theme === 'auto') {
            // Use system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        } else {
            root.setAttribute('data-theme', theme);
        }
    }
    
    // Reset to defaults
    resetToDefaults() {
        this.settings = { ...this.defaultSettings };
        this.saveSettings();
        this.applySettings();
    }
    
    // Export settings for backup
    exportSettings() {
        return JSON.stringify(this.settings, null, 2);
    }
    
    // Import settings from backup
    importSettings(settingsJson) {
        try {
            const importedSettings = JSON.parse(settingsJson);
            this.settings = this.mergeSettings(this.defaultSettings, importedSettings);
            this.saveSettings();
            this.applySettings();
            return true;
        } catch (error) {
            console.error('Could not import settings:', error);
            return false;
        }
    }
    
    // Get settings for display in UI
    getDisplaySettings() {
        return {
            categories: [
                {
                    name: 'Audio',
                    key: 'audio',
                    settings: [
                        { key: 'enabled', name: 'Sound Effects', type: 'boolean' },
                        { key: 'volume', name: 'Volume', type: 'range', min: 0, max: 1, step: 0.1 }
                    ]
                },
                {
                    name: 'Game',
                    key: 'game',
                    settings: [
                        { 
                            key: 'difficulty', 
                            name: 'Difficulty', 
                            type: 'select', 
                            options: [
                                { value: 'easy', label: 'Easy' },
                                { value: 'normal', label: 'Normal' },
                                { value: 'hard', label: 'Hard' }
                            ]
                        },
                        { 
                            key: 'questionCount', 
                            name: 'Questions per Game', 
                            type: 'select',
                            options: [
                                { value: 5, label: '5 Questions' },
                                { value: 10, label: '10 Questions' },
                                { value: 15, label: '15 Questions' },
                                { value: 20, label: '20 Questions' }
                            ]
                        },
                        { key: 'showHints', name: 'Show Hints', type: 'boolean' }
                    ]
                },
                {
                    name: 'Interface',
                    key: 'ui',
                    settings: [
                        { 
                            key: 'theme', 
                            name: 'Theme', 
                            type: 'select',
                            options: [
                                { value: 'light', label: 'Light' },
                                { value: 'dark', label: 'Dark' },
                                { value: 'auto', label: 'Auto' }
                            ]
                        },
                        { key: 'animations', name: 'Animations', type: 'boolean' },
                        { key: 'hapticFeedback', name: 'Haptic Feedback', type: 'boolean' }
                    ]
                },
                {
                    name: 'Accessibility',
                    key: 'accessibility',
                    settings: [
                        { key: 'highContrast', name: 'High Contrast', type: 'boolean' },
                        { key: 'largeText', name: 'Large Text', type: 'boolean' },
                        { key: 'reducedMotion', name: 'Reduced Motion', type: 'boolean' }
                    ]
                }
            ]
        };
    }
}

// Initialize settings manager
document.addEventListener('DOMContentLoaded', () => {
    window.settingsManager = new SettingsManager();
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (window.settingsManager.get('ui', 'theme') === 'auto') {
            window.settingsManager.applyTheme('auto');
        }
    });
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SettingsManager;
}
