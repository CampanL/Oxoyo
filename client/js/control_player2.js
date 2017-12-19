var updatePlayer2 = function(){
	deplacements = 0;
	if (cursors.right.isDown)
    {
        deplacements = 20;
    }
    else if (cursors.left.isDown)
    {	
        deplacements = -20;
    }

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
        deplacement = o.beta/150;
    });
    ball.update(deplacements, playerID);
}