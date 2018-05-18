var app = require('./config/server');

var server = app.listen(1337, function () {
    console.log('Servidor ON');
})

var io = require('socket.io').listen(server);

io.set('log level',0);

const arrayUsuario = [];
const arraySocket = [];

io.on('connection', function (socket) {
    console.log('Usuário conectou');

    socket.on('usuarioAtualizadoParaServidor', function (data) {
        if (arrayUsuario.indexOf(data.apelido) !== -1) {
            return socket.emit('usuarioAtualizado', false); // retorna que já existe o usuario
        }
        socket.username = data.apelido;
        socket.emit('usuarioAtualizado', arrayUsuario);
        arrayUsuario.push(data.apelido);
        arraySocket.push(socket);
        io.sockets.emit('participantesParaCliente', data.apelido); // io usa .sockets agora

    });

    socket.on('disconnect', function () {
        const index = arrayUsuario.indexOf(socket.username);
        if (index !== -1) {
            arrayUsuario.splice(index, 1);
            arraySocket.splice(index, 1);
            io.sockets.emit('Removendo', socket.username); // io usa .sockets agora
        }
        console.log('Usuario Desconectou');
    });

    socket.on('msgParaServidor', function (data) {

        socket.emit(
            'msgParaCliente',
            { apelido: data.apelido, mensagem: data.mensagem }
        );

        socket.broadcast.emit(
            'msgParaCliente',
            { apelido: data.apelido, mensagem: data.mensagem }
        );
    });

    socket.on('arqParaServidor', function (data1) {
        socket.emit(
            'arqParaCliente',
            { apelido: data1.apelido, arquivo: data1.arquivo }
        );

        socket.broadcast.emit(
            'arqParaCliente',
            { apelido: data1.apelido, arquivo: data1.arquivo }
        );
    });



    function log(){
        var array = [">>> Message from server: "];
        for (var i = 0; i < arguments.length; i++) {
	  	    array.push(arguments[i]);
        }
	    socket.emit('log', array);
	}

	socket.on('message', function (message) {
		log('Got message: ', message);
        socket.broadcast.to(socket.room).emit('message', message);
	});
    
	socket.on('create or join', function (message) {
        var room = message.room;
        socket.room = room;
        var participantID = message.from;
        configNameSpaceChannel(participantID);
        
		var numClients = io.sockets.clients(room).length;

		log('Room ' + room + ' has ' + numClients + ' client(s)');
		log('Request to create or join room', room);

		if (numClients == 0){
			socket.join(room);
			socket.emit('created', room);
		} else {
			io.sockets.in(room).emit('join', room);
			socket.join(room);
			socket.emit('joined', room);
		}
	});
    
    // Setup a communication channel (namespace) to communicate with a given participant (participantID)
    function configNameSpaceChannel(participantID) {
        var socketNamespace = io.of('/'+participantID);
        
        socketNamespace.on('connection', function (socket){
            socket.on('message', function (message) {
                // Send message to everyone BUT sender
                socket.broadcast.emit('message', message);
            });
        });
    }

});