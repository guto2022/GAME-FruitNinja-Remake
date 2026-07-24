//Estados de Jogo
var PLAY=1;
var END=0;
var gameState=1;

var knife, fruit, bomb, fruitGroup, bombGroup, score, r, randomFruit, position;
var knifeImage, fruit1, fruit2, fruit3, fruit4, bombImage, gameOverImage, restartButton;
var explosionSound, knifeSwoosh;

function preload(){
  
  knifeImage = loadImage("assets/knife.png");
  bombImage = loadImage("assets/bomb.png");
  fruit1 = loadImage("assets/fruit1.png");
  fruit2 = loadImage("assets/fruit2.png");
  fruit3 = loadImage("assets/fruit3.png");
  fruit4 = loadImage("assets/fruit4.png");
  gameOverImage = loadImage("assets/fimdeJogo.png")
  
  explosionSound = loadSound("assets/explosion.mp3")
  knifeSwooshSound = loadSound("assets/knifeSwoosh.mp3")
}



function setup() {
  createCanvas(windowWidth, windowHeight);
  
  //criando espada
  knife=createSprite(40,200,20,20);
  knife.addImage(knifeImage);
  knife.scale=0.7
  
  //definir colisor para espada
  knife.setCollider("rectangle",0,0,40,120);

  //Variáveis de pontuação e Grupos
  score=0;
  fruitGroup=createGroup();
  bombGroup = createGroup();

  //Botão para recomeçar o jogo ao perder
  restartButton = createButton("Recomeçar");
  restartButton.position(width / 2 - 55, height / 2 + 130);
  restartButton.size(110, 38);
  restartButton.style("font-size", "16px");
  restartButton.mousePressed(restartGame);
  restartButton.hide();
}

function draw() {
  background("lightblue");
  
  if(gameState===PLAY){
    
    //Chamar função de frutas e função de monstro
    fruits();
    bombs();
    
    //mover espada com o mouse
    knife.y=World.mouseY;
    knife.x=World.mouseX;

    //gravidade das frutas e das bombas
    for (var i = 0; i < fruitGroup.length; i++) {
      fruitGroup[i].velocityY += 0.45;
    }

    for (var i = 0; i < bombGroup.length; i++) {
      bombGroup[i].velocityY += 0.45;
    }
  
    //Aumenta a pontuação se a espada tocar na fruta
    if(fruitGroup.isTouching(knife)){
      fruitGroup.destroyEach();
      
       knifeSwooshSound.play();
      
       score=score+2; 
    }
    else
    {
      //Vá para o estado final se a espada tocar o inimigo
      if(bombGroup.isTouching(knife)){
        gameState=END;
        //som de fim de jogo/explosão
        explosionSound.play()
        
        fruitGroup.destroyEach();
        bombGroup.destroyEach();
        fruitGroup.setVelocityXEach(0);
        bombGroup.setVelocityXEach(0);
        
        //Mude a animação da espada para fim de jogo e redefina sua posição
        knife.addImage(gameOverImage);
        knife.scale=1;
        knife.x=width/2;
        knife.y=height/2;

        //Aparece o botão de recomeçar
        restartButton.show();
      }
    }
  }
  
  drawSprites();
  //exibir pontuação
  textSize(25);
  text("Pontuação: "+ score, (windowWidth/2)-75,50);
}

function bombs() {
  if (World.frameCount % 200 === 0) {
    bomb = createSprite(400, 200, 20, 20);

    bomb.addImage(bombImage);
    bomb.scale = 0.2;
    bomb.setCollider("circle", 0, 0, 90);

    bomb.x = random(80, width - 80);
    bomb.y = height + 30;

    bomb.velocityY = random(-18, -13);
    bomb.velocityX = random(-3, 3);

    bomb.lifetime = 300;
    bombGroup.add(bomb);
  }
}

function fruits(){
  if(World.frameCount%80===0){
    fruit=createSprite(400,200,20,20);
    fruit.setCollider("circle", 0, 0, 100);
    fruit.x = random(80, width - 80);
    fruit.y = height + 30;

    fruit.velocityY = random(-18, -13);
    fruit.velocityX = random(-3, 3);
     
    fruit.scale=0.2;

    r=Math.round(random(1,4));
    if (r == 1) {
      fruit.addImage(fruit1);
    } else if (r == 2) {
      fruit.addImage(fruit2);
    } else if (r == 3) {
      fruit.addImage(fruit3);
    } else {
      fruit.addImage(fruit4);
    }
    
    fruit.lifetime = 300;
    
    fruitGroup.add(fruit);
  }
}

function restartGame() {
  score = 0;
  gameState = PLAY;

  fruitGroup.destroyEach();
  bombGroup.destroyEach();

  knife.addImage(knifeImage);
  knife.scale = 0.7;
  knife.x = World.mouseX;
  knife.y = World.mouseY;

  restartButton.hide();
}