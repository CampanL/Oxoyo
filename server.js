const express = require('express');
const http = require('http');

let nbPlayer=0;
let overload=false;
let bonusEnable=false;
let bonus = false;

////Mise a disposition des pages

var app = express();
var server = http.createServer(app);

app.use('/client', express.static(__dirname + '/client'));

app.get('/client', function(req, res){
    res.sendFile(__dirname + '/client/index.html');
});

server.listen(process.env.PORT || 8080,function(){
    console.log('Listening on '+server.address().port);
});
////Connexion et Web socket

var io = require('socket.io').listen(server);

io.on('connection', function(socket){ 
        nbPlayer++;
        if (nbPlayer<=2) 
        {
            console.log("player "+nbPlayer+" joined")
            socket.emit('playerNumber', {ball:nbPlayer});
        }   
        if (nbPlayer==2) 
        {
            socket.emit('start game');
            console.log("start game");
        }
        socket.on("Mouvement Y",function(data)
        {
            mouvement= data.deplacements;
            position = data.position;
            socket.broadcast.emit('reception axe Y',{mouvement: mouvement, position:position})
        })
        socket.on("Mouvement X",function(data)
        {
            mouvement= data.deplacements;
            position = data.position;
            socket.broadcast.emit('reception axe X',{mouvement: mouvement, position:position})
        })

        socket.on("Zone collision",function(data)
        {
            if (!overload) 
            {
                overload=true;
                zoneX = (Math.random()*(data.w-200))-(data.w-100)/2+data.w/2;
                zoneY = (Math.random()*(data.h-150))-(data.h-75)/2+data.h/2;
                score = data.score+1
                socket.emit("mise a jour de la position de la zone",{x:zoneX, y:zoneY, score:score}); 
                setTimeout(function(){overload=false},500)
            }
        })
        socket.on('transfer position',function(data)
        {
            socket.broadcast.emit('communication position',{x:data.x,y:data.y,score:data.score})
        })

        socket.on('game started',function()
        {
            bonusEnable=true;
            socket.broadcast.emit('you can move')
        })
        socket.on('creat bonus',function(data)
        {
            if (!bonus) 
            {
                bonus=true;
                bonusX = (Math.random()*(data.w-200))-(data.w-100)/2+data.w/2;
                bonusY = (Math.random()*(data.h-150))-(data.h-75)/2+data.h/2;
                socket.emit('created bonus',{x:bonusX,y:bonusY})
            }
        })
        socket.on('bonus communication',function(data)
        {
            socket.broadcast.emit('bonus reception',{x:data.x,y:data.y})
        })
        socket.on('bonus collision',function(data)
        {
            bonus=false;
            socket.broadcast.emit('bonus removed',{minutes:data.minutes, secondes:data.secondes})
        })
    });