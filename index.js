const { //module aliases
    Engine, 
    Render, 
    Runner, 
    World, 
    Bodies
    } = Matter;

//Cells of square defined
const cellSide = 3;
//Width and Heigth defined
const width = 800;
const height = 800;

const engine = Engine.create();//Create an engine
const { world } = engine;

const render = Render.create({//Create a renderer
    element: document.body,
    engine: engine,
    options: {
        wireframes: true,
        width,
        height
    }
});
Render.run(render);
Runner.run(Runner.create(), engine);

//Create the walls
const walls = [
    Bodies.rectangle(width/2, 0, width, 30, {isStatic: true}),
    Bodies.rectangle(width/2, height, width, 30, {isStatic: true}),
    Bodies.rectangle(0, height/2, 30, height, {isStatic: true}),
    Bodies.rectangle(width, height/2, 30, height, {isStatic: true})
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

const grid = Array(cellSide)//This create a new Array with 3 elements
    .fill(null)//Set in every array elements a default value
    .map(() => Array(cellSide).fill(false));//creates a new array with the results of calling a function for every array element.
const verticals = Array(cellSide)
    .fill(null)
    .map(() => Array(cellSide-1).fill(false));
const horizontals = Array(cellSide-1)
    .fill(null)
    .map(() => Array(cellSide).fill(false));

const startRow = Math.floor(Math.random() * cellSide);
const startColumn = Math.floor(Math.random() * cellSide);

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
        nextRow >= cellSide ||
        nextColumn < 0 ||
        nextColumn >= cellSide
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