// Michael Waetzman, mwae@bu.edu

var http = require('http'),
    fs = require('fs'),
    express = require('express'),     
    path = require('path'),
    app = express();

fs.readFile('./index.html', function (err, html) {
        if (err) {
            throw err; 
        }       
        http.createServer(function(request, response) {  
            response.writeHeader(200, {"Content-Type": "text/html"});  
            response.write(html);  

            response.end();  
        }).listen(8080);
    });

    var io = socketio.listen(http);

    // Define/initialize our global vars
    var socketCount = 0
    var brightness = 0; //static variable to hold the current brightness
    var swstate = 0;
     

    io.sockets.on('connection', function(socket){
    //console.log(socket.id);
    // Socket has connected, increase socket count
    socketCount++
    // Let all sockets know how many are connected
    io.sockets.emit('users connected', socketCount)
     
    socket.emit('swstate', swstate);
     
    socket.on('swstate',function(){
    swstate = 1 - swstate;
    //console.log(swstate);
    io.emit('swstate', swstate);
    });
     
    socket.emit('led', {value: brightness}); //send the new client the current brightness
     
    socket.on('led', function (data) { //makes the socket react to 'led' packets by calling this function
    brightness = data.value; //updates brightness from the data object
    io.sockets.emit('led', {value: brightness}); //sends the updated brightness to all connected clients
    });
     
    });
     
    process.on('SIGINT', function() {
    //Do things on Script Termination...
    console.log('\n Bye!')
    process.exit();
    });
