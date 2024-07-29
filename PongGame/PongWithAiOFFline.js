// Global Variables
var DIRECTION = {
    IDLE: 0,
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
};

var MODE = {
	AI:	1,
	TWIN: 2,
};

var rounds = [3, 3, 3];
var Player = {
    new: function(side) {
        return {
            width: this.canvas.width * 0.02,
            height: this.canvas.height * 0.2,
            x: side === 'right' ? this.canvas.width - (this.canvas.width * 0.04) : this.canvas.width * 0.02 ,
            y: (this.canvas.height / 2) - (this.canvas.height * 0.1),
            moveY:DIRECTION.IDLE,
            score: 0,
			winRound:0,
            speed: this.canvas.width * 0.02   
        };
    }
};

var Ai = {
    new: function(side) {
        return {
            width: this.canvas.width * 0.02,
            height: this.canvas.height * 0.2,
            x: side === 'right' ? this.canvas.width - (this.canvas.width * 0.04) : this.canvas.width * 0.02 ,
            y: (this.canvas.height / 2) - (this.canvas.height * 0.1),
            moveY:DIRECTION.IDLE,
            score: 0,
			winRound:0,
            speed: this.canvas.width * 0.02   
        };
    }
};

var Ball = {
    new: function(setSpeed) {
        return {
            radius: this.canvas.width * 0.01,
            x: this.canvas.width /2,
            y: this.canvas.height / 2,
            speed: setSpeed,
            moveX: DIRECTION.IDLE,
            moveY: DIRECTION.IDLE
        };
    }
};

var Game = {
    initialize: function () {
		console.log(this.name + " is being initialized.");
        this.canvas = document.querySelector('canvas');
        this.context = this.canvas.getContext('2d');

		this.canvas.tableHeight = 90;
		this.canvas.tableWidth = this.canvas.tableHeight * 0.75;
        this.canvas.height = (this.canvas.tableWidth * window.innerWidth) / 100;
		this.canvas.width = (this.canvas.tableHeight * window.innerHeight) / 100;
        this.canvas.style.width = this.canvas.tableWidth + 'vw';
        this.canvas.style.height = this.canvas.tableHeight + 'vh';
		
		this.mode = MODE.AI;
		Pong.menu();
		if (this.mode === MODE.AI) {
			console.log("AI Model initialize")
			this.rightPlayer = Player.new.call(this, 'right');
			this.leftPlayer = Ai.new.call(this, 'left');
			this.ball = Ball.new.call(this, this.canvas.width * 0.008);
			this.turn = this.rightPlayer;
		} else {
			console.log("2-Player initialize")
			this.rightPlayer = Player.new.call(this, 'right');
			this.leftPlayer = Player.new.call(this, 'left');
			this.ball = Ball.new.call(this, this.canvas.width * 0.008);
			this.turn = this.rightPlayer;
		}

		this.starting = false;
        this.over = false;
        this.timmer = 0;
        this.round = 0;
		//Start New Game
		Pong.start();
    },

	draw: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // console.log("Draw table");
        this.context.fillStyle = '#2D3748';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // console.log("middle line")
        this.context.beginPath();
        this.context.strokeStyle = '#ffffff';
        this.context.setLineDash([this.canvas.width * 0.08, this.canvas.width * 0.08]);
        this.context.moveTo(this.canvas.width / 2, this.canvas.height * 0.1);
        this.context.lineTo(this.canvas.width / 2, this.canvas.height * 0.9);
        this.context.lineWidth = this.canvas.width * 0.01;
        this.context.stroke();
		//Set and Write
		this.context.fillStyle = '#ffffff';
		this.context.font = '1.5rem Aldrich';
		this.context.textAlign = 'center';
		// console.log("Game Score and Round")
        this.context.fillText(
            'Round ' + (Pong.round + 1),
			(this.canvas.width / 2), 
            (this.canvas.height * 0.05)
        );
		this.context.fillText(
            this.leftPlayer.winRound + ':' + this.rightPlayer.winRound,
			(this.canvas.width / 2), 
            (this.canvas.height * 0.08)
        );
        this.context.fillText(
            'Grab a paddle to start the game',
			(this.canvas.width / 2), 
            (this.canvas.height * 0.95)
        );
		this.context.font = '4rem Aldrich';
		//Player score (Left Player)
		this.context.fillText(
			this.rightPlayer.score.toString(),
			(this.canvas.width * 0.75), 
            this.canvas.height * 0.15
		);
		//Player Score (Right Player)
		this.context.fillText(
			this.leftPlayer.score.toString(),
			(this.canvas.width * 0.25), 
            this.canvas.height * 0.15
		);
		// console.log("Paddles and ball")
        this.context.fillRect(
            this.rightPlayer.x,
            this.rightPlayer.y,
            this.rightPlayer.width,
            this.rightPlayer.height
        );

        this.context.fillRect(
            this.leftPlayer.x,
            this.leftPlayer.y,
            this.leftPlayer.width,
            this.leftPlayer.height
        );
		//ball
        this.context.beginPath();
        this.context.setLineDash([]);
        this.context.arc(
            this.ball.x,
            this.ball.y,
            this.ball.radius,
            0,
            2 * Math.PI,
            false);
        this.context.stroke();
        this.context.lineWidth = 5;
        this.context.fill();
	},

	endGameMenu: function (text) {
		Pong.context.font = '2rem Aldrich';
		this.context.fillStyle = '#2D3748';
        this.context.fillRect(
            (this.canvas.width / 2) - (this.canvas.width * 0.25),
            this.canvas.height / 2 - (this.canvas.height * 0.1),
            (this.canvas.width * 0.25) * 2,
            (this.canvas.height * 0.1) * 2
        );
        this.context.fillStyle = '#F9B10B';
        this.context.fillText(
            text,
            this.canvas.width / 2,
            this.canvas.height /2 - 20
        );
		setTimeout(function(){
			Pong = Object.assign(Pong, Game);
			Pong.initialize();
		}, 3000);
	},

	// Wait for a delay to have passed after each turn.
	_turnDelayIsOver: function() {
		return ((new Date()).getTime() - this.timmer >= 1000);
	},

    _resetTurn: function(victory, loser){
		this.ball = Ball.new.call(this, this.ball.speed);
		this.turn = loser;
		this.timmer = (new Date()).getTime();

		victory.score++;
	},

	update: function (){
		if (!this.over) {
			if (this.ball.x <= 0){
                console.log('Right-Player get point!')
                Pong._resetTurn.call(this, this.rightPlayer, this.leftPlayer);
            }
            if (this.ball.x >= this.canvas.width){
                console.log('Left-Player get point!')
                Pong._resetTurn.call(this, this.leftPlayer, this.rightPlayer);
            }
            if (this.ball.y <= (this.ball.radius)){
                console.log('The Ball collide upper limmits')
                this.ball.moveY = DIRECTION.DOWN;
            }
            if (this.ball.y >= ( this.canvas.height - this.ball.radius)){
                console.log('The Ball collide lower limmits')
                this.ball.moveY = DIRECTION.UP;
            }
			//Key event to move Player
			//Left-Player move
			if (this.leftPlayer.moveY === DIRECTION.UP){ this.leftPlayer.y -= this.leftPlayer.speed;}
			if (this.leftPlayer.moveY === DIRECTION.DOWN){ this.leftPlayer.y += this.leftPlayer.speed;} 
			//Right-Player move
			if (this.rightPlayer.moveY === DIRECTION.UP) {this.rightPlayer.y -= this.rightPlayer.speed;}
			if (this.rightPlayer.moveY === DIRECTION.DOWN) {this.rightPlayer.y += this.rightPlayer.speed;}
			//randomize the direction
			if (Pong._turnDelayIsOver.call(this) && this.turn){
				this.ball.moveX = this.turn === this.leftPlayer ? DIRECTION.LEFT : DIRECTION.RIGHT;
				this.ball.moveY = [DIRECTION.UP, DIRECTION.DOWN][Math.floor(Math.random() * 2)];
				console.log('random :' + this.ball.moveY);
				this.ball.y = Math.floor(Math.random() * (this.canvas.height - 400)) + 200;
				this.turn = null;
			}
			//If Player collides with bound
			if(this.leftPlayer.y <= 0)this.leftPlayer.y = 0;
			if(this.leftPlayer.y >= (this.canvas.height - this.leftPlayer.height)) this.leftPlayer.y = (this.canvas.height - this.leftPlayer.height);
			if(this.rightPlayer.y <= 0)this.rightPlayer.y = 0;
			if(this.rightPlayer.y >= (this.canvas.height - this.rightPlayer.height)) this.rightPlayer.y = (this.canvas.height - this.rightPlayer.height);
			//The ball move based on moveX and moveY value
			if (this.ball.moveX === DIRECTION.LEFT){
				this.ball.x -= this.ball.speed;
			} else if (this.ball.moveX === DIRECTION.RIGHT){
				this.ball.x += this.ball.speed;
			}
			if (this.ball.moveY === DIRECTION.UP){
				this.ball.y -= this.ball.speed;
			} else if (this.ball.moveY === DIRECTION.DOWN){
				this.ball.y += this.ball.speed;
			}
			//Player hits The Ball
			if ((this.ball.y <= (this.leftPlayer.y + this.leftPlayer.height)) && ((this.ball.y + this.ball.radius) >= this.leftPlayer.y)){
				if((this.ball.x - this.ball.radius) <= (this.leftPlayer.x + this.leftPlayer.width)&& this.ball.x >= (this.leftPlayer.x + this.leftPlayer.width)) {
					console.log('Left-Player hits the ball');
					// console.log('ballX:' + this.ball.x);
					// console.log('ballY:' + this.ball.y);
					this.ball.x = (this.leftPlayer.x + this.leftPlayer.width + this.ball.radius);
					this.ball.moveX = DIRECTION.RIGHT;
				}
			}
			if ((this.ball.y <= (this.rightPlayer.y + this.rightPlayer.height)) && ((this.ball.y + this.ball.radius) >= this.rightPlayer.y)){
				if((this.ball.x + this.ball.radius) >= this.rightPlayer.x && this.ball.x <= this.rightPlayer.x) {
					console.log('Right-Player hits the ball');
					// console.log('ballX:' + this.ball.x);
					// console.log('ballY:' + this.ball.y);
					this.ball.x = (this.rightPlayer.x - this.ball.radius);
					this.ball.moveX = DIRECTION.LEFT;
				}
			}
		}
		//Handle round
		//Check Winner of the round
		if(this.leftPlayer.score === rounds[this.round]){
			this.leftPlayer.winRound += 1;
			if(this.round === rounds.length || this.leftPlayer.winRound === 2){
				this.over = true;
				setTimeout(function () {Pong.endGameMenu('Left-Player is the Winner!');}, 1000);
			} else {
				this.leftPlayer.score = 0;
				this.rightPlayer.score = 0;
				this.ball.speed *= 1.3;
				this.round += 1;
			}
		} else if (this.rightPlayer.score === rounds[this.round]){
			this.rightPlayer.winRound += 1;
			if(this.round === rounds.length || this.rightPlayer.winRound === 2){
				this.over = true;
				setTimeout(function () {Pong.endGameMenu('Right-Player is the Winner!');}, 1000);
			} else {
				this.rightPlayer.score = 0;
				this.leftPlayer.score = 0;
				this.ball.speed *= 1.3;
				this.round += 1;
			}
		}
	},

	menu: function () {
		console.log("Choose play mode")
		this.context.font = '1.5rem Aldrich';
        this.context.fillStyle = '#2D3748';
        this.context.fillRect(
            (this.canvas.width / 2) - (this.canvas.width * 0.25),
            this.canvas.height / 2 - (this.canvas.height * 0.1),
            (this.canvas.width * 0.25) * 2,
            (this.canvas.height * 0.1) * 2
        );
        this.context.fillStyle = '#F9B10B';
        this.context.fillText(
            "Choose Play Mode",
            this.canvas.width / 2,
            this.canvas.height /2 - 20
        );
        this.context.fillText(
            "'A' : AI MODE",
            this.canvas.width / 2,
            this.canvas.height /2 + 20
        );
		this.context.fillText(
            "'B' : 2 PLAYER MODE",
            this.canvas.width / 2,
            this.canvas.height /2 + 40
        );
		Pong.WaitPlayChoose();
	},

	WaitPlayChoose: function (key) {
		document.addEventListener('keydown',
			function (key) {

			});
	},

    listen: function () {
        document.addEventListener('keydown', 
            function (key) {
                if(Pong.starting === false) {
                    Pong.starting = true;
                    window.requestAnimationFrame(Pong.loop);
                }
                //Handle Right Player
                if (key.code === 'w') Pong.rightPlayer.moveY = DIRECTION.UP;
                if (key.code === 's') Pong.rightPlayer.moveY = DIRECTION.DOWN;
                //Handle Left Player
                if (key.keyCode === 87) Pong.leftPlayer.moveY = DIRECTION.UP;
                if (key.keyCode === 83) Pong.leftPlayer.moveY = DIRECTION.DOWN;

            });
        document.addEventListener('keyup',
            function (key) {
                Pong.rightPlayer.moveY = DIRECTION.IDLE;
                Pong.leftPlayer.moveY = DIRECTION.IDLE;
            });
    },

    loop: function () {
        
        Pong.update();
        Pong.draw();
        if(!Pong.over) requestAnimationFrame(Pong.loop);
    },

	start: function (){
        Pong.draw();
		console.log("How to play")
		this.context.font = '1.5rem Aldrich';
        this.context.fillStyle = '#2D3748';
        this.context.fillRect(
            (this.canvas.width / 2) - (this.canvas.width * 0.25),
            this.canvas.height / 2 - (this.canvas.height * 0.1),
            (this.canvas.width * 0.25) * 2,
            (this.canvas.height * 0.1) * 2
        );
        this.context.fillStyle = '#F9B10B';
        this.context.fillText(
            "Press any key to begin",
            this.canvas.width / 2,
            this.canvas.height /2 - 20
        );
        this.context.fillText(
            "'w' and 's' || '↑' and '↓'",
            this.canvas.width / 2,
            this.canvas.height /2 + 20
        );
        Pong.listen();
    }
};

var Pong = Object.assign({}, Game);
Pong.name = "Pong Game"
Pong.initialize();

