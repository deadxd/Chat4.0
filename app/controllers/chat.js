/**
 * This module serves as the router to the different views. It handles
 * any incoming requests.
 *
 * @param app An express object that handles our requests/responses
 * @param socketIoServer The host address of this server to be injected in the views for the socketio communication
 */

module.exports.iniciaChat = function (application, req, res) {

	var dadosForm = req.body;

	req.assert('apelido', 'Nome ou apelido é obrigatório').notEmpty();
	req.assert('apelido', 'Nome ou apelido deve conter entre 3 e 15 caracteres').len(3, 15);

	var erros = req.validationErrors();
	if (erros) {
		res.render("index", { validacao: erros })
		return;
	}

	res.render("chat", { dadosForm: dadosForm });
}

module.exports.uploaded = function (application, req, res) {
	var multer = require('multer');

	var storage = multer.diskStorage({
		destination: function (req, file, callback) {
			callback(null, './app/public/uploads');
		},
		filename: function (req, file, callback) {
			callback(null, file.originalname);
		}
	});
	var upload = multer({ storage: storage }).single('userPhoto');

	upload(req, res, function (err) {
		if (err) {
			return res.end("Error ao enviar arquivo.");
		}
		res.end("Arquivo enviado");
	});
}

module.exports.room = function (application, req, res) {
	var path = req.params.path;
	var socketIoServer = '127.0.0.1';
        res.render('room', {"hostAddress":socketIoServer});
}