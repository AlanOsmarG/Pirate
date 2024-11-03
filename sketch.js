const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
var engine, world, backgroundImg;

var canvas, angle, tower, ground, canon, canonball, boat;

var balls = []
var boats = []
var boatAnim = []
var boatBroken = []
var splash = []
var boatData, brokenData, spriteSheetBoat, spriteSheetBroken
var splashData, SpriteSheetSplash;

function preload() {
  backgroundImg = loadImage("./assets/background.gif");
  towerImage = loadImage("./assets/tower.png");
  spriteSheetBoat = loadImage("./assets/boat/boat.png");
  spriteSheetBroken = loadImage("./assets/boat/broken_boat.png");
  boatData = loadJSON("./assets/boat/boat.json");
  brokenData = loadJSON("./assets/boat/broken_boat.json");
  SpriteSheetSplash = loadImage("./assets/water_splash/water_splash.png");
  splashData = loadJSON("./assets/water_splash/water_splash.json");

}

function setup() {

  canvas = createCanvas(1200, 600);
  engine = Engine.create();
  world = engine.world;
  angle = -PI/4;
  canon = new Cannon(180, 110, 130, 100, angle);
  canonball = new Canonball(180, 120);
  
  var boatFrames = boatData.frames 
  for(var i = 0;i < boatFrames.lenght;i++){
    var pos = boatFrames[i].position;
    var img = spriteSheetBoat.get(pos.x, pos.y, pos.w, pos.h);
    boatAnim.push(img)
  }
  var brokenFrames = brokenData.frames 
  for(var i = 0;i < brokenFrames.lenght;i++){
    var pos = brokenFrames[i].position;
    var img = spriteSheetBroken.get(pos.x, pos.y, pos.w, pos.h);
    boatBroken.push(img)
  }


  var options = {
    isStatic: true
  }

  ground = Bodies.rectangle(0, height - 1, width * 2, 1, options);
  World.add(world, ground);

  tower = Bodies.rectangle(160, 350, 160, 310, options);
  World.add(world, tower);

}

function draw() {
  image(backgroundImg,0,0,1200,600)
  Engine.update(engine);

  canon.display();
  rect(ground.position.x, ground.position.y, width * 2, 1);
 
  showBoats();
 


  for(var i = 0; i<balls.length; i++){
    show_canonballs(balls[i], i);
    for(var j = 0;j<boats.length; j++){
      if(balls[i] !== undefined && boats[j] !== undefined){
        var collition = matter.SAT.collides(balls[i].body, boats[j].body)
        if(collition.collided){
          boats[j].remove(j)
          Matter.World.remove(world, balls[i].body)
          balls.splice(i, 1)
          i--
        }
      }
    }
  }

  push();
  imageMode(CENTER);
  image(towerImage,tower.position.x, tower.position.y, 160, 310);
  pop();  
}

function keyReleased(){
  if(keyCode === DOWN_ARROW){
    balls[balls.length - 1].shoot();

  }
}

function keyPressed(){
  if(keyCode === DOWN_ARROW){
    var canonball = new Canonball(canon.x, canon.y);
    balls.push(canonball)
    
  }
}

function show_canonballs(ball, index){
ball.display()
if(ball.body.position.x >= width || ball.body.position.y >= height - 50){
if(!ball.isSink){
  ball.remove(index)
}
}
 
}

function showBoats(){
  if(boats.lenght > 0){
  
    if(boats.lenght < 4 && boats[boats.lenght - 1].body.position.x < width - 300){
  var positions = [-40, -60, -70, -20];
  var position = random(positions);
  var boat = new Boat(width, height - 50, 150, 150, position, boatAnim);
  boats.push(boat)
  }
  for(var i = 0;i < boats.lenght; i++){
  Matter.Body.setVelocity(boats[i].body, {x:-1, y:0});
  boats[i].display();
  boats[i].animate();
  }
  }
  else{
    var boat = new Boat(width, height - 50, 150, 150, -100, boatAnim);
    boats.push(boat);
  }
}

