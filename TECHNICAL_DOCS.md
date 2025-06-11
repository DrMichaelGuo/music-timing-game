# Rhythm Master - Technical Documentation

## Architecture Overview

Rhythm Master is a modular, Apple-style web application built with vanilla JavaScript, CSS3, and HTML5. The application follows a component-based architecture with clear separation of concerns.

## Core Modules

### 1. RhythmMasterGame (`game.js`)
The main game logic controller.

**Key Methods:**
```javascript
// Game flow control
startGame()                    // Initialize new game
nextQuestion()                 // Progress to next question
endGame()                     // Complete game and show results

// Screen management
showWelcomeScreen()           // Display welcome screen
showGameScreen()              // Display game interface
showResultsScreen()           // Display final results
showAchievementsScreen()      // Display achievements
showHowToPlayScreen()         // Display instructions

// Game mechanics
handleAnswer(event)           // Process user answer
getRandomNote()              // Generate random note for question
updateGameDisplay()          // Refresh UI elements
```

**Properties:**
- `notes`: Object containing all musical note definitions
- `score`: Current game score
- `currentQuestion`: Current question number (1-based)
- `totalQuestions`: Total questions per game (default: 10)
- `gameStarted`: Boolean game state
- `currentNote`: Current note being asked about

### 2. AudioManager (`audio.js`)
Handles all audio functionality with Web Audio API.

**Key Methods:**
```javascript
// Sound effects
playCorrect()                 // Success sound
playIncorrect()              // Error sound
playClick()                  // UI interaction sound
playAchievement()            // Achievement unlock sound

// Audio control
setVolume(volume)            // Set global volume (0-1)
enable()                     // Enable audio
disable()                    // Disable audio
toggleAudio()                // Toggle audio on/off

// Tone generation
playTone(frequency, duration, type)  // Generate custom tone
```

### 3. UIManager (`ui.js`)
Manages user interface interactions and animations.

**Key Methods:**
```javascript
// Notifications
showSuccessMessage(message)   // Display success notification
showErrorMessage(message)     // Display error notification
showAchievementUnlock(achievement)  // Show achievement popup

// Animations
animateScoreChange(element, newScore)  // Animate score updates
showConfetti()               // Celebration effect
shakeElement(element)        // Error animation
pulseElement(element)        // Success animation

// Accessibility
setupAccessibility()         // Configure a11y features
setupKeyboardNavigation()    // Enable keyboard controls
```

### 4. AchievementSystem (`achievements.js`)
Tracks player progress and unlocks achievements.

**Achievements Available:**
- **First Steps**: Complete your first game
- **Perfect Pitch**: Get 100% on a game
- **Speed Demon**: Answer all questions quickly
- **Rhythm Master**: Complete 10 games
- **Streak Master**: Get 5 correct answers in a row
- **Note Scholar**: Correctly identify each note type

**Key Methods:**
```javascript
checkAchievements(gameData)   // Evaluate and unlock achievements
getProgress()                // Get achievement progress stats
resetAchievements()          // Reset all achievements (testing)
```

### 5. SettingsManager (`settings.js`)
Manages user preferences and application settings.

**Setting Categories:**
- **Audio**: Volume, sound effects, background music
- **Game**: Difficulty, question count, hints
- **UI**: Theme, animations, haptic feedback
- **Accessibility**: High contrast, large text, reduced motion

**Key Methods:**
```javascript
get(category, setting)       // Get setting value
set(category, setting, value) // Set setting value
applySettings()              // Apply all settings
resetToDefaults()            // Reset to default settings
exportSettings()             // Export settings as JSON
importSettings(json)         // Import settings from JSON
```

## Data Structures

### Musical Notes
```javascript
{
  semibreve: { symbol: '𝅝', beats: 4, name: 'Semibreve' },
  minim: { symbol: '𝅗𝅥', beats: 2, name: 'Minim' },
  crotchet: { symbol: '♩', beats: 1, name: 'Crotchet' },
  quaver: { symbol: '♪', beats: 0.5, name: 'Quaver' },
  semiquaver: { symbol: '♬', beats: 0.25, name: 'Semiquaver' }
}
```

### Game State
```javascript
{
  currentQuestion: Number,    // Current question (0-based)
  totalQuestions: Number,     // Total questions in game
  score: Number,             // Current score
  currentNote: Object,       // Current note object
  gameStarted: Boolean,      // Game state flag
  questionStartTime: Number, // Timestamp for response timing
  maxStreak: Number,         // Best streak in current game
  noteStats: Object         // Statistics per note type
}
```

### Achievement Data
```javascript
{
  id: String,               // Unique achievement ID
  name: String,             // Display name
  description: String,      // Description text
  icon: String,             // Emoji icon
  unlocked: Boolean,        // Unlock status
  unlockedAt: Number,       // Unlock timestamp
  hidden: Boolean           // Visibility flag
}
```

## CSS Architecture

### Design System Variables
```css
:root {
  /* Colors */
  --primary-blue: #007AFF;
  --success-green: #34C759;
  --error-red: #FF3B30;
  --warning-orange: #FF9500;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-xxl: 48px;
  
  /* Typography */
  --font-family: 'SF Pro Display', -apple-system, ...;
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-md: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 24px;
  --font-size-xxl: 32px;
  --font-size-xxxl: 48px;
}
```

### Component Classes
- `.screen`: Main content containers
- `.interactive-card`: Hoverable card components
- `.primary-button`, `.secondary-button`: Button variants
- `.answer-btn`: Answer option buttons
- `.floating-element`: Animated floating elements
- `.glass-effect`: Glassmorphism styling

## Event System

### Game Events
```javascript
// Answer selection
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('answer-btn')) {
    game.handleAnswer(e);
  }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.key >= '1' && e.key <= '5') {
    // Select answer option
  }
  if (e.key === 'Escape') {
    // Return to main menu
  }
});
```

### Achievement Events
```javascript
// Achievement unlock
window.achievementSystem.addEventListener('unlock', (achievement) => {
  window.uiManager.showAchievementUnlock(achievement);
});
```

## Browser Compatibility

### Supported Features
- **ES6+ JavaScript**: Classes, arrow functions, template literals
- **CSS Grid & Flexbox**: Modern layout
- **Web Audio API**: Sound generation
- **Local Storage**: Settings and progress persistence
- **CSS Custom Properties**: Theming system

### Fallbacks
- Web Audio API fallback for older browsers
- CSS graceful degradation
- Progressive enhancement for JavaScript features

## Performance Considerations

### Optimizations
- Efficient DOM queries with caching
- CSS transforms for animations (hardware acceleration)
- Minimal reflows and repaints
- Event delegation for better performance
- Lazy loading of non-critical features

### Memory Management
- Event listener cleanup
- Animation frame management
- Local storage size monitoring
- Object pooling for frequently created objects

## Accessibility Features

### WCAG 2.1 Compliance
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Proper ARIA labels
- **High Contrast Mode**: Enhanced visibility
- **Reduced Motion**: Respects user preferences
- **Focus Management**: Clear focus indicators

### Keyboard Shortcuts
- `1-5`: Select answer options
- `Escape`: Return to main menu
- `Tab`: Navigate through interface
- `Enter/Space`: Activate buttons

## Testing

### Test Categories
1. **Unit Tests**: Individual function testing
2. **Integration Tests**: Component interaction testing
3. **UI Tests**: Interface responsiveness testing
4. **Achievement Tests**: Progress tracking validation
5. **Audio Tests**: Sound system verification

### Running Tests
```javascript
// Manual test execution
const tester = new RhythmMasterTests();
tester.runTests();

// Automated testing (development mode)
// Tests run automatically on localhost
```

## Deployment

### Production Build
1. Minify CSS and JavaScript files
2. Optimize images and assets
3. Remove test scripts
4. Configure web server headers
5. Enable compression (gzip/brotli)

### File Structure
```
src/
├── index.html              # Main application file
├── styles/
│   ├── main.css           # Core styles
│   └── components.css     # Component styles
├── scripts/
│   ├── game.js           # Game logic
│   ├── audio.js          # Audio system
│   ├── ui.js             # UI management
│   ├── achievements.js   # Achievement system
│   ├── settings.js       # Settings management
│   └── tests.js          # Test suite
└── assets/
    └── sounds/           # Audio files
```

## Extension Points

### Adding New Features
1. **New Note Types**: Extend the `notes` object
2. **Custom Achievements**: Add to achievement system
3. **Themes**: Extend CSS custom properties
4. **Game Modes**: Create new game logic variants
5. **Internationalization**: Add language support

### Plugin Architecture
The modular design allows for easy extension:
```javascript
// Example: Custom difficulty plugin
class DifficultyPlugin {
  constructor(game) {
    this.game = game;
    this.setupDifficultyModes();
  }
  
  setupDifficultyModes() {
    // Custom difficulty implementation
  }
}
```

## API Reference

### Global Objects
- `window.rhythmMasterGame`: Main game instance
- `window.audioManager`: Audio system
- `window.uiManager`: UI controller
- `window.achievementSystem`: Achievement tracker
- `window.settingsManager`: Settings controller

### Configuration
```javascript
// Customize game settings
window.rhythmMasterGame.totalQuestions = 15;
window.audioManager.setVolume(0.5);
window.settingsManager.set('ui', 'theme', 'dark');
```

This documentation provides a comprehensive overview of the Rhythm Master architecture and can be extended as new features are added.
