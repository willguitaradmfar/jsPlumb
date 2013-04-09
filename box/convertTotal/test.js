var index = require('./index.js');
exports.test = function() {

	this.validate = function(callback) {
		(new index.index()).init({total : 200}, function(args) {
			if(args.dolar == 288){
				callback({msg : "testInit OK", type : "success", ret : args});
			}else{
				callback({msg : "testInit Failed ... "+JSON.stringify(args), type : "ERROr", ret : args});
			}
		});
	};

	this.test1 = function(callback) {
		(new index.index()).init({total : 100}, function(args) {
			if(args.dolar == 145){
				callback({msg : "testInit OK", type : "success", ret : args});
			}else{
				callback({msg : "testInit Failed ... "+JSON.stringify(args), type : "ERROr", ret : args});
			}
		});
	};

	this.test2 = function(callback) {
		(new index.index()).init({total : 200}, function(args) {
			if(args.dolar == 288){
				callback({msg : "testInit OK", type : "success", ret : args});
			}else{
				callback({msg : "testInit Failed ... "+JSON.stringify(args), type : "ERROr", ret : args});
			}
		});
	};
};