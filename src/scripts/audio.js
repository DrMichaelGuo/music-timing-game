// Audio Manager for Rhythm Master

class AudioManager {
    constructor() {
        this.sounds = {};
        this.volume = 0.7;
        this.enabled = true;
        
        this.initSounds();
    }
    
    initSounds() {
        // Initialize audio files if they exist
        try {
            this.sounds.metronome = new Audio('assets/sounds/metronome.mp3');
            this.sounds.metronome.volume = this.volume;
        } catch (error) {
            console.log('Metronome sound not found, using Web Audio API fallbacks');
        }
        
        // Create Web Audio Context for generated sounds
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.log('Web Audio API not supported');
        }
    }
    
    // Play correct answer sound
    playCorrect() {
        if (!this.enabled) return;
        
        if (this.audioContext) {
            this.playTone(800, 0.2, 'sine'); // High pleasant tone
            setTimeout(() => {
                this.playTone(1000, 0.2, 'sine'); // Even higher tone
            }, 100);
        }
    }
    
    // Play incorrect answer sound
    playIncorrect() {
        if (!this.enabled) return;
        
        if (this.audioContext) {
            this.playTone(300, 0.3, 'sawtooth'); // Lower, less pleasant tone
        }
    }
    
    // Play button click sound
    playClick() {
        if (!this.enabled) return;
        
        if (this.audioContext) {
            this.playTone(600, 0.1, 'square');
        }
    }
    
    // Play game start sound
    playGameStart() {
        if (!this.enabled) return;
        
        if (this.audioContext) {
            // Ascending notes
            this.playTone(400, 0.2, 'sine');
            setTimeout(() => this.playTone(500, 0.2, 'sine'), 150);
            setTimeout(() => this.playTone(600, 0.2, 'sine'), 300);
        }
    }
    
    // Play game end sound
    playGameEnd() {
        if (!this.enabled) return;
        
        if (this.audioContext) {
            // Fanfare-like sequence
            this.playTone(600, 0.3, 'sine');
            setTimeout(() => this.playTone(800, 0.3, 'sine'), 200);
            setTimeout(() => this.playTone(1000, 0.5, 'sine'), 400);
        }
    }
    
    // Play metronome sound
    playMetronome() {
        if (!this.enabled) return;
        
        if (this.sounds.metronome) {
            this.sounds.metronome.currentTime = 0;
            this.sounds.metronome.play().catch(e => console.log('Could not play metronome sound'));
        } else if (this.audioContext) {
            // Fallback to generated metronome sound
            this.playTone(1000, 0.1, 'square');
        }
    }
    
    // Stop metronome
    stopMetronome() {
        if (this.sounds.metronome) {
            this.sounds.metronome.pause();
            this.sounds.metronome.currentTime = 0;
        }
    }
    
    // Play achievement unlock sound
    playAchievement() {
        if (!this.enabled) return;
        
        if (this.audioContext) {
            // Special achievement fanfare
            const notes = [523, 659, 784, 1047]; // C, E, G, C octave
            notes.forEach((frequency, index) => {
                setTimeout(() => {
                    this.playTone(frequency, 0.3, 'sine');
                }, index * 150);
            });
        }
    }

    // Generic tone generator using Web Audio API
    playTone(frequency, duration, type = 'sine') {
        if (!this.audioContext) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = type;
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        } catch (error) {
            console.log('Error playing tone:', error);
        }
    }
    
    // Set volume for all sounds
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        
        // Update existing audio elements
        Object.values(this.sounds).forEach(sound => {
            if (sound.volume !== undefined) {
                sound.volume = this.volume;
            }
        });
    }
    
    // Toggle audio on/off
    toggleAudio() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
    
    // Enable audio (useful for user interaction requirement)
    enable() {
        this.enabled = true;
        
        // Resume audio context if suspended (required by some browsers)
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }
    
    // Disable audio
    disable() {
        this.enabled = false;
    }
    
    // Get current audio state
    getState() {
        return {
            enabled: this.enabled,
            volume: this.volume,
            contextState: this.audioContext ? this.audioContext.state : 'not available'
        };
    }
}

// Initialize audio manager
document.addEventListener('DOMContentLoaded', () => {
    window.audioManager = new AudioManager();
    
    // Enable audio on first user interaction (required by modern browsers)
    const enableAudioOnInteraction = () => {
        window.audioManager.enable();
        document.removeEventListener('click', enableAudioOnInteraction);
        document.removeEventListener('keydown', enableAudioOnInteraction);
        document.removeEventListener('touchstart', enableAudioOnInteraction);
    };
    
    document.addEventListener('click', enableAudioOnInteraction);
    document.addEventListener('keydown', enableAudioOnInteraction);
    document.addEventListener('touchstart', enableAudioOnInteraction);
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioManager;
}