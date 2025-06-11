# 🎵 Rhythm Master - Musical Timing Game

A beautiful, Apple-style web game designed to help users master musical time values including semibreves, minims, crotchets, quavers, and semiquavers.

![Rhythm Master Game](https://img.shields.io/badge/Game-Music%20Education-blue)
![Web Technologies](https://img.shields.io/badge/Tech-HTML%2FCSS%2FJS-green)
![Design](https://img.shields.io/badge/Design-Apple%20Style-lightgrey)

## ✨ Features

### 🎮 Game Features
- **Interactive Learning**: Learn musical note values through engaging gameplay
- **Progressive Difficulty**: 10 questions per game with immediate feedback
- **Score Tracking**: Real-time scoring and performance evaluation
- **Beautiful UI**: Apple-inspired design with smooth animations
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

### 🎯 Educational Content
- **Semibreve** (𝅝) - 4 beats (whole note)
- **Minim** (𝅗𝅥) - 2 beats (half note)  
- **Crotchet** (♩) - 1 beat (quarter note)
- **Quaver** (♪) - ½ beat (eighth note)
- **Semiquaver** (♬) - ¼ beat (sixteenth note)

### 🔊 Audio Features
- **Smart Audio System**: Web Audio API with fallback sounds
- **Sound Effects**: Correct/incorrect answer feedback
- **Accessibility**: Works with or without audio enabled

### ♿ Accessibility
- **Keyboard Navigation**: Full keyboard support with shortcuts
- **Screen Reader Friendly**: Proper ARIA labels and semantic HTML
- **Motion Preferences**: Respects user's reduced motion preferences
- **Focus Management**: Clear focus indicators throughout

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Node.js (for development server) - optional

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/rhythm-master-game.git
   cd rhythm-master-game
   ```

2. **Install dependencies** (optional, for development server)
   ```bash
   npm install
   ```

3. **Run the game**
   
   **Option A: Development Server**
   ```bash
   npm start
   ```
   
   **Option B: Simple HTTP Server**
   ```bash
   python3 -m http.server 8080 -d src
   ```
   
   **Option C: Direct File Access**
   Simply open `src/index.html` in your web browser

4. **Open in browser**
   Navigate to `http://localhost:8080` (if using server) or open the HTML file directly

## 🎯 How to Play

1. **Start the Game**: Click "Start Playing" on the welcome screen
2. **Learn the Notes**: Visit "How to Play" to review note values
3. **Answer Questions**: Identify the time value of the displayed musical note
4. **Get Feedback**: Receive immediate feedback on your answers
5. **Track Progress**: Watch your score and progress through 10 questions
6. **See Results**: Get performance feedback and play again!

### 🎹 Keyboard Shortcuts
- **Numbers 1-5**: Select answer options during gameplay
- **Escape**: Return to main menu from any screen
- **Tab**: Navigate through interactive elements

## 🛠 Technologies Used

### Frontend
- **HTML5**: Semantic markup and accessibility
- **CSS3**: Modern styling with CSS custom properties and animations
- **JavaScript ES6+**: Game logic and interactivity
- **Web Audio API**: Sound generation and playback

### Design System
- **Apple Human Interface Guidelines**: Design principles and aesthetics
- **CSS Grid & Flexbox**: Modern layout techniques
- **CSS Custom Properties**: Consistent theming and maintainability
- **Responsive Design**: Mobile-first approach

### Development Tools
- **Live Server**: Development server with hot reload
- **Modern JavaScript**: Classes, arrow functions, async/await
- **Progressive Enhancement**: Works without JavaScript for basic content

## 📁 Project Structure

```
rhythm-master-game/
├── src/
│   ├── index.html              # Main HTML file
│   ├── styles/
│   │   ├── main.css           # Core styles and layout
│   │   └── components.css     # Component-specific styles
│   ├── scripts/
│   │   ├── game.js           # Game logic and state management
│   │   ├── audio.js          # Audio system and sound effects
│   │   └── ui.js             # UI interactions and animations
│   └── assets/
│       ├── sounds/           # Audio files (optional)
│       └── images/           # Game images (if any)
├── package.json              # Project configuration
└── README.md                # This file
```

## 🎨 Design Philosophy

This game follows Apple's Human Interface Guidelines with:

- **Clarity**: Clean, readable typography and intuitive layouts
- **Deference**: Content takes precedence over decorative elements  
- **Depth**: Subtle animations and shadows create hierarchy
- **Consistency**: Unified color palette, spacing, and interaction patterns
- **Accessibility**: Works for users of all abilities

## 🔧 Customization

### Adding Custom Sounds
Place audio files in `src/assets/sounds/` and update the audio manager:

```javascript
// In audio.js
this.sounds.customSound = new Audio('assets/sounds/your-sound.mp3');
```

### Modifying Game Settings
Edit game parameters in `game.js`:

```javascript
// Change number of questions
this.totalQuestions = 15;

// Add new note types
this.notes.demisemiquaver = { 
    symbol: '♬♬', 
    beats: 0.125, 
    name: 'Demisemiquaver' 
};
```

### Styling Customization
Update CSS custom properties in `main.css`:

```css
:root {
    --primary-blue: #007AFF;    /* Change primary color */
    --font-family: 'Your Font'; /* Change typography */
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Setup

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Musical notation symbols from Unicode standard
- Apple Human Interface Guidelines for design inspiration
- Web Audio API for sound generation
- Modern CSS techniques and best practices

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact [your-email@example.com](mailto:your-email@example.com).

---

**Happy Learning! 🎵**

To get started with the Music Timing Game, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/music-timing-game.git
   ```
2. Navigate to the project directory:
   ```
   cd music-timing-game
   ```
3. Open the `src/index.html` file in your web browser to play the game.

## How to Play

1. Start the game by clicking the "Start" button.
2. Listen to the audio cues and select the correct time value corresponding to the sound.
3. Earn points for correct answers and track your progress.
4. Challenge yourself to improve your score!

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Web Audio API

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.