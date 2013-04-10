
exports.constructor = function(data) {
	conversor.init(data, function(args) {
		exports.somar(args);
	});
};

exports.instance-1-somarvalores = function(data) {
	instance-1-somarvalores.init(data, function(args) {
		exports.next(args);
	});
};

exports.somarvalores = function(data) {
	somarvalores.init(data, function(args) {
		exports.next(args);
	});
};
