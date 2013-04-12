var formularioDeEntrada = require('formularioDeEntrada/index.js');
var somarvalores = require('somarvalores/index.js');
var enviarEmail = require('enviarEmail/index.js');

exports.constructor = function(data) {
	console.log('constructor');
	console.log(data);
	exports.formularioDeEntrada(data);
};

exports.formularioDeEntrada = function(data) {
	var _index = new formularioDeEntrada.index();

	_index.init(data, function(args) {
		exports.somarvalores(args);
	});
};

exports.somarvalores = function(data) {
	var _index = new somarvalores.index();
		_index.Decimal = '2'
		_index.Decimal = '2'
		_index.Cor = 'Red'
		_index.Cor = 'Red'

	_index.init(data, function(args) {
		exports.enviarEmail(args);
	});
};

exports.enviarEmail = function(data) {
	var _index = new enviarEmail.index();
undefined
	_index.init(data, function(args) {
		exports.destroy(args);
	});
};

exports.destroy = function(data) {
	console.log('destroy');
	console.log(data);
};
exports.constructor({v1 : 100, v2 : 33});
