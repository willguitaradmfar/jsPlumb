var _http = require('http')
var socketio = require('socket.io');
var path = require('path');
var routes = require('./routes/index.js');

var express = require('express');

var app = express();

var http = _http.createServer(app);

var clients = [];

app.configure(function(){
  app.set('port', 8081);  
  app.set('view', __dirname + '/view/');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser({uploadDir:'/tmp'}));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public/'));
  app.use(express.static(path.join(__dirname, '/public')));
});

app.get('/getBoxModules', routes.getBoxModules);
app.get('/scanBox', routes.scanBox);
app.post('/buildDiagrama', routes.buildDiagrama);

exports.construct = function() {
	var io = socketio.listen(http).of('/jsPlumb');
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
		var boxOrigem = box.source.replace(/^instance-\d-(.*)$/, '$1');
		console.log('buscando box origem ['+boxOrigem+'] ....');
		var tests = require('./box/'+boxOrigem+'/test.js');
		if(tests)console.log('require de origem ['+boxOrigem+'] válido');		
		console.log('testando metodo [validate] ....');

		//cria uma nova instancia de module test
		var _objTest = new tests.test();

		_objTest.validate(function(ret) {
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
		exports.emmitbroadcast('box-source-not-found', {msg : 'box origem não encontrado ['+boxOrigem+']', 'box' : JSON.stringify(box)});
	}
};

exports.callValidateTargetBox = function(box, data) {
	try{
		var boxTarget = box.target.replace(/^instance-\d-(.*)$/, '$1');
		console.log('buscando box destino ['+boxTarget+'] ....');
		var validate = require('./box/'+boxTarget+'/index.js');
		if(validate) console.log('require de destino ['+boxTarget+'] válido');
		console.log('chamando metodo de validação');

		var _objIndex = new validate.index();

		_objIndex.validate(data, function(ret) {
			console.log('validando resposta do validate de ['+boxTarget+'] '+JSON.stringify(ret));			
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
		exports.emmitbroadcast('box-target-not-found', {msg : 'box destino não encontrado ['+boxTarget+']', 'box' : JSON.stringify(box)});
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

http.listen(process.env.PORT || app.get('port'), "0.0.0.0");
exports.construct();
console.log('Server running at '+app.get('port'));