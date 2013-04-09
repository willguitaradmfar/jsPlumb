var index = require('./index.js');

exports.test = function() {	

	this.validate = function(callback) {
		(new index.index()).init({v1 : 100, v2 : 33}, function(args) {
			if(args.v1 > 0 && args.v2 > 0){
				callback({msg : "testValidate está Ok", type : "success", ret : args});
			}else{
				callback({msg : "testValidate Failed ... "+JSON.stringify(args), type : "ERROr", ret : args});
			}
		});
	};

};