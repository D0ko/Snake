# Snake Game

This is a simple snake game implemented using HTML, CSS, and JavaScript. The snake moves around the canvas, eating apples to grow longer. The game ends when the snake collides with itself.

## Features

*   Snake movement using pathfinding algorithm
*   Apple eating and snake growth
*   Collision detection with self
*   Score tracking

## How to Play

1.  Open `index.html` in your browser.
2.  The snake will start moving automatically.
3.  The snake will try to reach the apple.
4.  If you want to add an apple press 'p'.
5.  The game ends when the snake collides with itself.

## Files

*   `index.html`: The main HTML file that sets up the game.
*   `style.css`: The CSS file that styles the game.
*   `script.js`: The JavaScript file that contains the game logic.
*   `font.ttf`: The font file used for the score.

## Game Logic

The game logic is implemented in `script.js`. Here's a brief overview:

*   The `loop()` function is the main game loop. It updates the game state and renders the game.
*   The `findPath()` function calculates the shortest path from the snake's head to the apple using A*.
*   The `move()` function moves the snake along the calculated path.
*   The `getClosestApple()` function finds the closest apple to the snake.
*   The `getRandomInt()` function generates a random integer within a specified range.

## External Libraries

*   No external libraries are used.

## Improvements

*   Add keyboard controls for snake movement.
*   Implement different difficulty levels.
*   Add a game over screen.
*   Implement score saving.
