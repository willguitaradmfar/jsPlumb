var formularioDeEntrada = require('formularioDeEntrada/index.js');
var somarvalores = require('somarvalores/index.js');
var convertTotal = require('convertTotal/index.js');
var enviarEmail = require('enviarEmail/index.js');

exports.formularioDeEntrada = function(data) {
	formularioDeEntrada.init(data, function(args) {
		exports.somarvalores(args);
	});
};

exports.somarvalores = function(data) {
	somarvalores.init(data, function(args) {
		exports.convertTotal(args);
	});
};

exports.convertTotal = function(data) {
	convertTotal.init(data, function(args) {
		exports.enviarEmail(args);
	});
};
