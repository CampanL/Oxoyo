let w = window.innerWidth;
let h = window.innerHeight;
let game = new Phaser.Game(
	w, h, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render}
);

let ball = null;
let bonus = null;
let zone = null; 
let score = 0;
let gameStart = false;
let text = null
let bonusSpawn = null
let time = 0;
let secondes = 0;
let minutes = 2;


function preload(){
	game.load.image("ball", "assets/ball.png");
	game.load.image("ball_shadow", "assets/Sprite_Shadow.png");
	game.load.image("ball_bloom", "assets/Sprite_Bloom.png");
	game.load.image("bonus","assets/bonus.png") 
};

function create(){
	/*socket = io.connect();*/
	game.physics.startSystem(Phaser.Physics.ARCADE)

	text = game.add.text(w-200,20,'Score: '+score)
	timer = game.add.text(20,60,"Time "+Math.round(minutes)+" : "+Math.round(secondes)) 

	game.stage.backgroundColor = "#4488AA";
	ball = createBall();
	zone = game.add.sprite(100,h/2, "ball"); 
	zone.anchor.setTo(0.5,0.5);
	zone.scale.setTo(0.63,0.63);	
	game.physics.arcade.enable(zone);
	zone.body.setCircle(53);
	zone.body.immovable = true;

	// configuration du socket et des handlers
	socket.on("mise a jour de la position de la zone", function(data)
	{	
		score = data.score;
		zone.position.x = data.x; 
		zone.position.y = data.y;
		socket.emit('transfer position', {x:zone.position.x, y:zone.position.y, score:score})
		
		
	})

	socket.on('communication position',function(data)
	{
		zone.position.x = data.x; 
		zone.position.y = data.y;
		score = data.score
	});

	socket.on('bonus reception',function(data)
	{
		bonus = createBonus(data.x,data.y)
	})

	socket.on('reception axe X',function(data)
	{
		/*console.log(ball);*/
		ball.body.velocity.x = data.mouvement;
		ball.body.position.x=data.position;
	});

	socket.on('reception axe Y',function(data)
	{	/*console.log(ball);*/
		ball.body.velocity.y = data.mouvement;
		ball.body.position.y=data.position;
	});

	socket.on('you can move',function()
	{
		gameStart=true;
	});

	socket.on('created bonus',function(data)
	{
		bonus = createBonus(data.x,data.y)
		socket.emit('bonus communication',{x:data.x,y:data.y})
	})
	socket.on('bonus removed',function(data)
	{
		bonus.kill();
		minutes=data.minutes;
		secondes=data.secondes;
		timer.setText("Time "+Math.floor(minutes)+" : "+Math.floor(secondes))
	})
};

var createBonus = function(x,y)
	{
		let bonus =game.add.sprite(x,y,"bonus")
		bonus.anchor.setTo(.5,.5);
		bonus.scale.setTo(.45,.45);
		game.physics.arcade.enable(bonus);
		bonus.body.setCircle(53);
		bonus.body.immovable=true;
		return bonus;
	}

var createBall = function(){
	let ball_shadow = game.add.sprite(w/2, h/2,"ball_shadow");
	let ball = game.add.sprite(w/2, h/2,"ball");
	let ball_bloom = game.add.sprite(w/2, h/2,"ball_bloom");
	game.physics.arcade.enable([ball,ball_shadow,ball_bloom]);/*, Phaser.Physicipm s.ARCADE*/
	cursors = game.input.keyboard.createCursorKeys();
	ball.body.setCircle(53);
	ball_shadow.anchor.setTo(0.5,0.5);
	ball.anchor.setTo(0.5, 0.5);
	ball_bloom.anchor.setTo(0.5,0.5);
	ball.speed = 400;
	ball_shadow.speed = 400;
	ball_bloom.speed = 400;
	ball.body.collideWorldBounds = true;
	ball.body.bounce.setTo(.5, .5);
	ball.scale.setTo(0.4, 0.4);
	ball_shadow.scale.setTo(0.4,0.4);
	ball_bloom.scale.setTo(0.15,0.15);

	//let text = game.add.text(1080,0,"vous etes le joueur"+playerID);
	


	ball.update = function(value, ID){
		
		if (ID == 1)
	    {	
	        ball.body.velocity.y += value;
	        socket.emit('Mouvement Y',{deplacements:ball.body.velocity.y, position:ball.body.position.y});
	    }
	    else if (ID == 2)
	    {
	        ball.body.velocity.x += value;
	        socket.emit('Mouvement X',{deplacements:ball.body.velocity.x, position:ball.body.position.x});

	    }

	  
	    gyro.frequency = 10;
	    gyro.startTracking(function(o) {
	    	ball_bloom.body.velocity.x=ball.body.velocity.x*0.98
	    	ball_bloom.body.velocity.y=ball.body.velocity.y*0.98
	    	ball_shadow.body.velocity.x=ball.body.velocity.x*1.02
	    	ball_shadow.body.velocity.y=ball.body.velocity.y*1.02
        });
	       // updating ball velocity
	      	if (ball_shadow.x!==(ball.x-window.innerWidth*0.5)*1.02+window.innerWidth*0.5) 
	      	{
	    		ball_shadow.x=(ball.x-window.innerWidth*0.5)*1.02+window.innerWidth*0.5
	      	}
	      	if (ball_shadow.y!==(ball.y-window.innerHeight*0.5)*1.02+window.innerHeight*0.5) 
	      	{
	    		ball_shadow.y=(ball.y-window.innerHeight*0.5)*1.02+window.innerHeight*0.5
	      	}
	      	if (ball_bloom.x!==(ball.x-window.innerWidth*0.5)*0.98+window.innerWidth*0.5) 
	      	{
	    		ball_bloom.x=(ball.x-window.innerWidth*0.5)*0.98+window.innerWidth*0.5
	      	}
	      	if (ball_bloom.y!==(ball.y-window.innerHeight*0.5)*0.98+window.innerHeight*0.5) 
	      	{
	    		ball_bloom.y=(ball.y-window.innerHeight*0.5)*0.98+window.innerHeight*0.5
	      	}
	}

	return ball;

}

function update(){
	if (gameStart) 
	{
		if (Math.floor(Math.random()*300)==1) 
		{
			socket.emit('creat bonus',{w:w, h:h})
		}
		time++
		if (time==60) 
		{
			secondes--
			time=0
		}
		if(secondes<0)
		{
			if (minutes>0) 
			{
				secondes+=60;
				minutes--;
			}else
			{
				secondes=0
			}
		}else if (secondes>60) 
		{
			secondes-=60
			minutes+=1
		}
		timer.setText("Time "+Math.floor(minutes)+" : "+Math.floor(secondes))
		text.setText('Score: '+score)
		if (playerID==1) 
		{
			updatePlayer1();
		}else if (playerID==2) 
		{
			updatePlayer2();
		}
		game.physics.arcade.collide(ball,zone,zoneHit,null,this);
		game.physics.arcade.collide(ball,bonus,applyBonus,null,this);
	}
};

function zoneHit()
{
	console.log("collision");
	socket.emit("Zone collision", {w:w, h:h, score:score}); 
}

function applyBonus()
{
	secondes +=10;
	if (secondes>60) 
	{
		minutes++;
		secondes-=60;
	}
	bonus.kill();
	socket.emit('bonus collision',{secondes:secondes, minutes:minutes})
}

function render(){
	/*game.debug.body(ball);
	console.log(zone)
	game.debug.body(ball);
	game.debug.body(zone);*/
};

