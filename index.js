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
    //If I have visited the cell ar [row, column], the return

    //Mark this cell as being visited

    //Assemble randomly-ordered list of neighbors

    // For each neighbor...

    // See if that neighbor is out of bounds

    // IF we have visited that neighbor continue to the next neighbor

    //Remove a wall from either the horizontals array or verticals

    // Visit that next cell
};

stepThroughCell(startRow, startColumn);
