var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

var grid = 16;
var count = 0;

var snake = {
    x: 160,
    y: 160,
    dx: grid,
    dy: 0,

    cells: [],
    maxCells: 3
};

var apple = {
    x: 320,
    y: 320
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function findPath(start, end, obstacles) {
    const queue = [start];
    const visited = new Set();
    const parentMap = new Map();
    
    visited.add(`${start.x},${start.y}`);
    
    while (queue.length > 0) {
        const current = queue.shift();
        
        if (current.x === end.x && current.y === end.y) {
            return constructPath(parentMap, start, end);
        }
        
        const neighbors = getNeighbors(current, obstacles, visited);
        for (let neighbor of neighbors) {
            visited.add(`${neighbor.x},${neighbor.y}`);
            queue.push(neighbor);
            parentMap.set(`${neighbor.x},${neighbor.y}`, current);
        }
    }
    return null;
}
  
function getNeighbors(coord, obstacles, visited) {
    const neighbors = [];
    const directions = [[0, grid], [grid, 0], [0, -grid], [-grid, 0]];
    
    for (let dir of directions) {
        const neighbor = { x: coord.x + dir[0], y: coord.y + dir[1] };
      
        if (isValidCoord(neighbor, obstacles, visited)) {
            neighbors.push(neighbor);
        }
    }
    return neighbors;
}
  
function isValidCoord(coord, obstacles, visited) {
    if (coord.x < 0 || coord.x >= canvas.width || coord.y < 0 || coord.y >= canvas.height) {
        return false;
    }
    
    if (visited.has(`${coord.x},${coord.y}`)) {
        return false;
    }
    
    for (let obstacle of obstacles) {
        if (obstacle.x === coord.x && obstacle.y === coord.y) {
            return false;
        }
    }
    return true;
}
  
function constructPath(parentMap, start, end) {
    const path = [end];
    let current = end;
    
    while (current.x !== start.x || current.y !== start.y) {
        current = parentMap.get(`${current.x},${current.y}`);
        path.unshift(current);
    }
    return path;
}

function move(path, snake) {
    if (path !== null) {
        let cell = path[1];
        try {
            if (cell.x < snake.x && snake.dx === 0) {
                snake.dx = -grid;
                snake.dy = 0;
            } else if (cell.x > snake.x && snake.dx === 0) {
                snake.dx = grid;
                snake.dy = 0;
            } else if (cell.y < snake.y && snake.dy === 0) {
                snake.dy = -grid;
                snake.dx = 0;
            } else if (cell.y > snake.y && snake.dy === 0) {
                snake.dy = grid;
                snake.dx = 0;
            }
        } catch (error) {
            console.error('error :', error);
        }
    }
    return snake;
}

function loop() {
    requestAnimationFrame(loop);

    if (++count < 2) {
        return;
    }

    let path = findPath({x: snake.x, y: snake.y}, {x: apple.x, y: apple.y}, snake.cells);
    snake = move(path, snake);

    count = 0;
    context.clearRect(0,0,canvas.width,canvas.height);

    snake.x += snake.dx;
    snake.y += snake.dy;

    if (snake.x < 0) {
        snake.x = canvas.width - grid;
    } else if (snake.x >= canvas.width) {
        snake.x = 0;
    }
    if (snake.y < 0) {
        snake.y = canvas.height - grid;
    } else if (snake.y >= canvas.height) {
        snake.y = 0;
    }

    snake.cells.unshift({x: snake.x, y: snake.y});

    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }

    context.fillStyle = 'red';
    context.fillRect(apple.x, apple.y, grid-1, grid-1);

    context.fillStyle = 'white';
    snake.cells.forEach(function(cell, index) {
        context.fillRect(cell.x, cell.y, grid-1, grid-1);  
        if (cell.x === apple.x && cell.y === apple.y) {
            snake.maxCells++;

            apple.x = getRandomInt(0, canvas.width / 16) * grid;
            apple.y = getRandomInt(0, canvas.height / 16) * grid;
            while (snake.cells.includes({x: apple.x, y: apple.y})) {
                apple.x = getRandomInt(0, canvas.width / 16) * grid;
                apple.y = getRandomInt(0, canvas.height / 16) * grid;
            }
        }

        for (var i = index + 1; i < snake.cells.length; i++) {
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                console.log("mort  | score :", snake.cells.length);
                snake.x = 160;
                snake.y = 160;
                snake.cells = [];
                snake.maxCells = 3;
                snake.dx = grid;
                snake.dy = 0;
                while (snake.cells.includes({x: apple.x, y: apple.y})) {
                    apple.x = getRandomInt(0, canvas.width / 16) * grid;
                    apple.y = getRandomInt(0, canvas.height / 16) * grid;
                }
            }
        }
    });
}

requestAnimationFrame(loop);
