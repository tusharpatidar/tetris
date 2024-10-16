# Tetris Chrome Extension Version History

## Version 1.0

### New Features:
1. Ghost Piece:
   - Added a ghost piece feature that shows where the current piece will land.
   - Implemented with a gradient shadow and outline for better visibility.

2. Improved Background:
   - Changed the game background to a gradient from lighter blue-gray (#3a4a6e) to darker blue-gray (#2c3e50).

3. Game Over Handling:
   - Added proper game over detection and handling.
   - Displays "Game Over" text when the game ends.

4. Pause Functionality:
   - Implemented pause/resume functionality with the start button.
   - Added automatic pause when the window loses focus and resume when it regains focus.

5. Performance Optimization:
   - Implemented frame rate control using requestAnimationFrame and a target FPS.

### Visual Improvements:
1. Increased Canvas Scale:
   - Increased the canvas scale from 20 to 30 for better visuals.

2. Updated Colors:
   - Updated the colors array for more vibrant piece colors.

### Gameplay Enhancements:
1. Quick Drop:
   - Added spacebar control for quick drop functionality.

### Code Structure:
1. Reorganized Code:
   - Improved code structure for better readability and maintainability.

2. Added Comments:
   - Included comments for potential future features (e.g., mobile controls).

### Bug Fixes:
1. Fixed issues with game restart after game over.
2. Corrected pause/resume behavior.

This version represents a significant update from the original implementation, focusing on improved gameplay features, visual enhancements, and better game state management.

## v0 - First Working Version

This is the first fully functional version of the Tetris Chrome Extension.

Files included:
- manifest.json
- background.js
- popup.html
- tetris.js
- styles.css

Key features:
- Detachable game window
- Keyboard controls
- Score and level tracking
- Pause/Resume functionality
- Automatic pausing when window loses focus

Date: 10/16/2024

To revert to this version, ensure all files match the contents specified in the v0 tag.
