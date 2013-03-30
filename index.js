var socketio = require('socket.io');

var clients = [];

exports.construct = function(config) {
	var io = socketio.listen(config.server).of('/jsPlumb');
	io.on('connection', exports.connection);
};

exports.connection = function(socket) {	
		clients.push(socket);
		console.log('connection de sockets');
		socket.on('jsPlumbConnection', exports.jsPlumbConnection);
		socket.on('connectionDrag', exports.connectionDrag);
		socket.on('connectionDragStop', exports.connectionDragStop);
		socket.on('detach', exports.detach);
};

exports.jsPlumbConnection = function(data) {
	console.log('chamando a validação de conexão');
	exports.callTestSourceBox(data, function(ret) {
		exports.callValidateTargetBox(data, ret);
	});		
};

exports.connectionDrag = function(data) {
	console.log(data);

};

exports.connectionDragStop = function(data) {
	console.log(data);
};

exports.detach = function(data) {
	console.log(data);
};

exports.callTestSourceBox = function(box, callback) {
	try{
		console.log('buscando box origem ['+box.source+'] ....');
		var tests = require(box.source+'/test.js');
		console.log('require de origem ['+box.source+'] válido');		
		console.log('testando metodo [validate] ....');

		tests.validate(function(ret) {
			console.log('resposta do teste [validate]' + JSON.stringify(ret));
			ret.boxsource = box.source;
			if(exports.isValidResponsePattern(ret)){
				console.log('retorno de test está no padrão');
				if(ret.type == 'success'){
					console.log('test retornou ['+ret.type+']');
					callback(ret.ret);					
				}else{
					console.log('test retornou ['+ret.type+']');
					exports.emmitbroadcast('test-fail', ret);
				}
			}else{
				console.log('retorno de test está fora do padrão ' + JSON.stringify(ret));				
			}
			
		});		
	}catch(err){
		console.log(err);
		exports.emmitbroadcast('box-source-not-found', {msg : 'box origem não encontrado ['+box.source+']', 'box' : JSON.stringify(box)});
	}
};

exports.callValidateTargetBox = function(box, data) {
	try{
		console.log('buscando box destino ['+box.target+'] ....');
		var validate = require(box.target+'/index.js');
		console.log('require de destino ['+box.target+'] válido');
		console.log('chamando metodo de validação');
		validate.validate(data, function(ret) {
			console.log('validando resposta do validate de ['+box.target+'] '+JSON.stringify(ret));			
			ret.boxtarget = box.target;
			ret.boxsource = box.source;
			if(exports.isValidResponsePattern(ret)){
				console.log('retorno de validate dentro do padrão');				
			}else{
				console.log('retorno de validate fora do padrão');				
			}
			console.log('emitindo resultado de validação');
			ret.msg = ret.msg+' ['+JSON.stringify(data)+']'
			exports.emmitbroadcast('validate', ret);
		});
	}catch(err){
		console.log(err);
		exports.emmitbroadcast('box-target-not-found', {msg : 'box destino não encontrado ['+box.target+']', 'box' : JSON.stringify(box)});
	}
};

exports.isValidResponsePattern = function(ret) {
	if(ret && ret.type && ret.msg && 
		(ret.type.toLowerCase() == 'info' || ret.type.toLowerCase() == 'error' || ret.type.toLowerCase() == 'success' || ret.type.toLowerCase() == 'warn')){
		return true;
	}
	return false;
};

exports.emmitbroadcast = function(event, data) {
	clients.forEach(function(socket) {
		socket.emit(event, data);
	});
};