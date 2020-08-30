const { //module aliases
    Engine, 
    Render, 
    Runner, 
    World, 
    Bodies,
    MouseConstraint,
    Mouse 
} = Matter;

//Width and Heigth defined
const width = 1000;
const height = 700;

const engine = Engine.create();//Create an engine

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

World.add(
    world,
    MouseConstraint.create(engine, {
        mouse: Mouse.create(render.canvas)
    })
);


//Create the walls
const walls = [
    Bodies.rectangle(500, 0, 1000, 30, {isStatic: true}),
    Bodies.rectangle(500, 700, 1000, 30, {isStatic: true}),
    Bodies.rectangle(0, 350, 30, 700, {isStatic: true}),
    Bodies.rectangle(1000, 350, 30, 700, {isStatic: true})
];

World.add(world, walls);

//Create a circle

//const circleOne = Bodies.circle(500, 100, 60);

//World.add(world, circleOne);

for (let x = 0; x < 40; x++){
    const xRand = Math.floor(Math.random() * width);
    const yRand = Math.floor(Math.random() * height);
    const ratioRand = Math.floor(Math.random() * 100);

    if(ratioRand < 50){
        World.add(world, Bodies.circle(xRand, yRand, ratioRand, {
            render: {
                fillStyle: 'blue'
            }
        }));
    }else{
        World.add(world, Bodies.rectangle(xRand, yRand, ratioRand, ratioRand, {
            render: {
                fillStyle: 'green'
            }
        }));
    };

    
};  
