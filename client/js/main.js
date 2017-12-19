console.log('hello world');
let socket; 
let playerID =0;
socket = io.connect();

socket.on('playerNumber',function(data)
{

	console.log(data)

	console.log("you are Player " + data.ball); 

	playerID = data.ball;
		/*game.load.script("control_player"+data.ball+".js", "../Dual_Mobile_2/client/js/control_player"+data.ball+".js");*/
		console.log("load player "+data.ball);
		let control = ""; 
		if(playerID == 1)
			{control="↑ et ↓"}
		else if(playerID)
			{control="← et →"}

		let text = game.add.text(20,20, " Vos contrôles sont : "+control);
})
socket.on('start game',function()
{
	console.log("game has started")
	gameStart = true;
	socket.emit('game started')
})
