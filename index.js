const { //module aliases
    Engine, 
    Render, 
    Runner, 
    World, 
    Bodies,
    Body, 
    Events
    } = Matter;

//Cells of square defined
const cellsHorizontal = 6;
const cellsVertical = 5;
//Width and Heigth defined
const width = window.innerWidth;
const height = window.innerHeight;

const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;

const engine = Engine.create();//Create an engine
engine.world.gravity.y = 0;
const { world } = engine;

const render = Render.create({//Create a renderer
    element: document.body,
    engine: engine,
    options: {
        wireframes: false,
        width,
        height
    }
});
Render.run(render);
Runner.run(Runner.create(), engine);

//Create the walls
const walls = [
    Bodies.rectangle(width/2, 0, width, 2, {isStatic: true}),
    Bodies.rectangle(width/2, height, width, 2, {isStatic: true}),
    Bodies.rectangle(0, height/2, 2, height, {isStatic: true}),
    Bodies.rectangle(width, height/2, 2, height, {isStatic: true})
];
World.add(world, walls);

// MAZE GENERATION
const shuffle = (arr) => {//Shuffling Neighboor Pairs
    let counter = arr.length;

    while (counter > 0) {
        const index = Math.floor(Math.random() * counter);
        counter--;

        const temp = arr[counter];
        arr[counter] = arr[index];
        arr[index] = temp;
    };
    return arr;
};

const grid = Array(cellsVertical)//This create a new Array with 3 elements
    .fill(null)//Set in every array elements a default value
    .map(() => Array(cellsHorizontal).fill(false));//creates a new array with the results of calling a function for every array element.
const verticals = Array(cellsVertical)
    .fill(null)
    .map(() => Array(cellsHorizontal -1).fill(false));
const horizontals = Array(cellsVertical -1)
    .fill(null)
    .map(() => Array(cellsHorizontal).fill(false));

const startRow = Math.floor(Math.random() * cellsVertical);
const startColumn = Math.floor(Math.random() * cellsHorizontal);

const stepThroughCell = (row, column) => {
    // If i have visted the cell at [row, column], then return
    if (grid[row][column]) {
      return;
    }
  
    // Mark this cell as being visited
    grid[row][column] = true;
  
    // Assemble randomly-ordered list of neighbors
    const neighbors = shuffle([
      [row - 1, column, 'up'],
      [row, column + 1, 'right'],
      [row + 1, column, 'down'],
      [row, column - 1, 'left']
    ]);
    // For each neighbor....
    for (let neighbor of neighbors) {
      const [nextRow, nextColumn, direction] = neighbor;
  
      // See if that neighbor is out of bounds
      if (
        nextRow < 0 ||
        nextRow >= cellsVertical ||
        nextColumn < 0 ||
        nextColumn >= cellsHorizontal
      ) {
        continue;
      }
  
      // If we have visited that neighbor, continue to next neighbor
      if (grid[nextRow][nextColumn]) {
        continue;
      }
  
      // Remove a wall from either horizontals or verticals
      if (direction === 'left') {
        verticals[row][column - 1] = true;
      } else if (direction === 'right') {
        verticals[row][column] = true;
      } else if (direction === 'up') {
        horizontals[row - 1][column] = true;
      } else if (direction === 'down') {
        horizontals[row][column] = true;
      }
  
      stepThroughCell(nextRow, nextColumn);
    }
  
    // Visit that next cell
  };
  
  stepThroughCell(startRow, startColumn);
//Drawing horizontals walls
horizontals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if(open) {
      return;
    }

    const wall = Bodies.rectangle(
      columnIndex * unitLengthX + unitLengthX / 2,
      rowIndex * unitLengthY + unitLengthY,
      unitLengthX,
      10,
      {
        label: 'wall',
        isStatic: true,
        render: {
          fillStyle: 'blue'
        }
      }
    );
    World.add(world, wall);
  });
});
//Drawing verticals walls
verticals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if(open){
      return;
    }

    const wall = Bodies.rectangle(
      columnIndex * unitLengthX + unitLengthX,
      rowIndex * unitLengthY + unitLengthY / 2,
      10,
      unitLengthY,
      {
        label: 'wall',
        isStatic: true,
        render: {
          fillStyle: 'blue'
        }
      }
    );
    World.add(world, wall);
  });
});

//Drawing the goal
const goal = Bodies.rectangle(
  width - unitLengthX / 2,
  height - unitLengthY / 2,
  unitLengthX * 0.6,
  unitLengthY * 0.6,
  {
    label: 'goal',
    isStatic: true,
    render: {
      fillStyle: 'green'
    }
  }
);
World.add(world, goal);

//Drawing the ball
const ballRadius = Math.min(unitLengthX, unitLengthY) / 4;
const ball = Bodies.circle(
  unitLengthX / 4,
  unitLengthY / 4,
  ballRadius,
  {
    label: 'ball',
    render: {
      fillStyle: 'red'
    }
  }
);
World.add(world, ball);

document.addEventListener('keydown', event => {
  const { x, y } = ball.velocity;
  console.log(x, y);
  if(event.keyCode === 87){
    Body.setVelocity(ball, { x, y: y - 5});
  }
  if(event.keyCode === 68){
    Body.setVelocity(ball, {x: x + 5, y});
  }
  if(event.keyCode === 83){
    Body.setVelocity(ball, {x, y: y + 5});
  }
  if(event.keyCode === 65){
    Body.setVelocity(ball, {x: x - 5, y});
  }
});

//Win Condition

Events.on(engine, 'collisionStart', event => {
  event.pairs.forEach(collision => {
    const labels = ['ball', 'goal'];

    if (
      labels.includes(collision.bodyA.label) &&
      labels.includes(collision.bodyB.label)
    ) {
      document.querySelector('.winner').classList.remove('.hidden');
      world.gravity.y = 1;
      world.bodies.forEach(body => {
        if (body.label === 'wall') {
          Body.setStatic(body, false);
        }
      });
    }
  });
});