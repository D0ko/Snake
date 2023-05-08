var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

var grid = 16;
var count = 0;
var apples = [];

var snake = {
    x: 160,
    y: 160,
    dx: grid,
    dy: 0,
    cells: [],
    maxCells: 3
};

var apple = {
    x: 0,
    y: 0
};

apples.push({x: 320, y: 320});

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
    if (path !== null && path.length > 1) {
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

function getDistance(x1, y1, x2, y2) {
    let dx = x2 - x1;
    let dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

function getClosestApple(snake, apples) {
    let closestApple = apples[0];
    let minDistance = getDistance(snake.x, snake.y, closestApple.x, closestApple.y);
    for (let i = 1; i < apples.length; i++) {
        let distance = getDistance(snake.x, snake.y, apples[i].x, apples[i].y);
        if (distance < minDistance) {
            closestApple = apples[i];
            minDistance = distance;
        }
    }
    return closestApple;
}

function loop() {
    requestAnimationFrame(loop);

    if (++count < 2) {
        return;
    }

    apple = getClosestApple(snake, apples);

    let path = findPath({x: snake.x, y: snake.y}, {x: apple.x, y: apple.y}, snake.cells);
    snake = move(path, snake);

    count = 0;
    context.clearRect(0,0,canvas.width,canvas.height);
    context.textAlign = 'center';
    context.font = "20px context-police"
    context.fillText("score: " + (snake.cells.length - 3), canvas.width / 2, 20);

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
    apples.forEach(function(apple) {
        context.fillRect(apple.x, apple.y, grid-1, grid-1);
    })

    context.fillStyle = 'white';
    snake.cells.forEach(function(cell, index) {
        context.fillRect(cell.x, cell.y, grid-1, grid-1);  

        for (var i = 0; i < apples.length; i++) {
            if (cell.x === apples[i].x && cell.y === apples[i].y) {
                snake.maxCells++;

                if (apples.length === 1) {
                    apples[i].x = getRandomInt(0, canvas.width / 16) * grid;
                    apples[i].y = getRandomInt(0, canvas.height / 16) * grid;
                    while (snake.cells.includes({x: apples[i].x, y: apples[i].y})) {
                        apples[i].x = getRandomInt(0, canvas.width / 16) * grid;
                        apples[i].y = getRandomInt(0, canvas.height / 16) * grid;
                    }
                } else {
                    apples.splice(i, 1);
                }
                break;
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
                apples = [{x: 320, y: 320}];
            }
        }
    });
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'p') {
        var newApple = {
            x: getRandomInt(0, canvas.width / 16) * grid,
            y: getRandomInt(0, canvas.height / 16) * grid,
        };
        apples.push(newApple);
    }
})

requestAnimationFrame(loop);
