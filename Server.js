var url = "localhost:";
var port = process.env.PORT || "5500";
var sockets = [];
var blackListed = [];

var adminUsername = "lbvor";
var adminPassword = "Lucabetts123";

var whiteSocket;

var content = require('fs').readFileSync(__dirname + '/index.html', 'utf8');

var http = require('http').createServer((req, res) => {
  // serve the index.html file
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', Buffer.byteLength(content));
  res.end(content);
});

var io = require('socket.io')(http);

io.on('connection', (socket) => {
    function debug(item){
        socket.emit("debug", item);
    }



    for(var index = 0; index < sockets.length; index++){
        if(sockets[index] == whiteSocket){
            canBeWhite = false;
        }
    }

    if(sockets.length == 0){
        var decider = Math.round(Math.random());

        if(decider == 0){
            whiteSocket = socket;

            console.log("White joined!");
            socket.emit('set color', 'White');

            sockets.push(socket);
        }

        else{
            console.log("Black joined!");
            socket.emit('set color', "Black");

            sockets.push(socket);
        }
    }

    else if(sockets.length == 1){
        console.log("Black joined!");
        var isBlack = false;
        for(var index = 0; index < sockets.length; index++){
            var currSocket = sockets[index];
            if(!blackListed.includes(currSocket)){
                if(whiteSocket == currSocket){
                    isBlack = true;
                }
            }
        }

        if(!isBlack){
            whiteSocket = socket;

            console.log("White joined!");
            socket.emit('set color', 'White');

            sockets.push(socket);
        }

        else{
            console.log("Black joined!");
            socket.emit('set color', "Black");

            sockets.push(socket);
        }

        for(var index = 0; index < sockets.length; index++){
            if(sockets[index] != socket){
                sockets[index].emit('other player join', "null");
            }
        }
    }

    else{
        socket.emit("error", 'Byte');
        blackListed.push(socket);
    }


    socket.on('send move', (move) => {
        if(!blackListed.includes(socket)){
            for(var index = 0; index < sockets.length; index++){
                if(sockets[index] != socket){
                    sockets[index].emit('make move', move);
                }
            }
        }
    });

    socket.on('chat message', (msg) => {
        if(!blackListed.includes(socket)){
            for(var index = 0; index < sockets.length; index++){
                if(sockets[index] != socket){
                    sockets[index].emit('got message', msg);
                }
            }
        }
    })

    socket.on('gamestate plea', (data) => {
        if(!blackListed.includes(socket)){
            var loginInfo = data.loginInfo;
            var gamestate = data.gamestate;
            var usrn = loginInfo.split(":")[0];
            var pasw = loginInfo.split(":")[1];
            if(usrn == adminUsername && pasw == adminPassword){
                for(var index = 0; index < sockets.length; index++){
                    if(sockets[index] != socket){
                        sockets[index].emit('set gamestate', gamestate);
                    }
                }
            }
        }
    });

    socket.on('reset plea', (loginInfo) => {
        if(!blackListed.includes(socket)){
            var usrn = loginInfo.split(":")[0];
            var pasw = loginInfo.split(":")[1];
            if(usrn == adminUsername && pasw == adminPassword){
                for(var index = 0; index < sockets.length; index++){
                    if(sockets[index] != socket){
                        sockets[index].emit('reset', "True");
                    }
                }
                socket.emit('reset', 'True')
            }
        }
    });

    socket.on('disconnect', () => {
        var inside = false;
        for(var index = 0; index < sockets.length; index++){
            if(sockets[index] == socket){
                inside = true;
            }
        }

        if(!inside){
            for(var index = 0; index < blackListed.length; index++){
                if(blackListed.length == socket){
                    blackListed.splice(blackListed.indexOf(socket), 1);
                    break;
                }
            }
        }

        if(inside){
            for(var index = 0; index < sockets.length; index++){
                if(sockets[index] != socket){
                    sockets[index].emit('other player left', "null");
                }
            }
            sockets.splice(sockets.indexOf(socket), 1);
            if(socket == whiteSocket){
                needWhite = true;
                console.log("White disconnected!");
            }
            else{
                console.log("Black disconnected!");
            }
        }
    });

    }
);

http.listen(port, () => {
    console.log("Hosted on " + port);
});