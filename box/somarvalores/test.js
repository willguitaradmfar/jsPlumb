var index = require('./index.js');

exports.test = function() {

	this.validate = function(callback) {
		(new index.index()).init({v1 : 100, v2 : 33}, function(args) {
			if(args.total == 133){
				callback({msg : "testInit OK", type : "success", ret : args});
			}else{
				callback({msg : "testInit Failed ... "+JSON.stringify(args), type : "ERROr", ret : args});
			}
		});
	};

	this.test1 = function(callback) {
		(new index.index()).init({v1 : 100, v2 : 33}, function(args) {
			if(args.total == 133){
				callback({msg : "testInit OK", type : "success"});
			}else{
				callback({msg : "testInit Failed ... "+JSON.stringify(args), type : "ERROr"});
			}
		});
	};

	this.test2 = function(callback) {
		(new index.index()).init({v2 : 200, v1 : 83}, function(args) {
			if(args.total == 283){
				callback({msg : "testInit OK", type : "success"});
			}else{
				callback({msg : "testInit Failed ... "+JSON.stringify(args), type : "ERROr"});
			}
		});
	};
};