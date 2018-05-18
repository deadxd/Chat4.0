module.exports = function(application, socketIoServer){
	application.post('/chat', function(req, res){
		application.app.controllers.chat.iniciaChat(application, req, res);
	});

	application.get('/chat', function(req, res){
		application.app.controllers.chat.iniciaChat(application, req, res);
	});

	application.post('/api/photo', function(req, res){
		application.app.controllers.chat.uploaded(application, req, res);
	});

	application.get('/download', function(req, res){
		application.app.controllers.chat.download(application, req, res);
	});

	application.get('/:path', function(req, res){
		application.app.controllers.chat.room(application, req, res);
	});
}