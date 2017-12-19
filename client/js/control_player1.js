var updatePlayer1 = function(){
	deplacements = 0;
	if (cursors.up.isDown)
    {
        deplacements = -20;
    }
    else if (cursors.down.isDown)
    {
        deplacements = 20;
    }
    gyro.frequency = 10;
    gyro.startTracking(function(o) {
        deplacement= o.gamma/150;
    });
    ball.update(deplacements, playerID);
}