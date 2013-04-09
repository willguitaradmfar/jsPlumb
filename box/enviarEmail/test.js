var index = require('./index.js');

exports.test = function() {

	this.validate = function(callback) {
		(new index.index()).init({dolar : 5}, function(args) {
			if(args.msg && args.msg.length > 0){
				callback({msg : "Esperado uma msg e encotrado ["+args.msg+"]", type : "success", ret : args});
			}else{
				callback({msg : "Erro de teste esperado msg ["+JSON.stringify(args)+"]", type : "error", ret : args});
			}
		});
	};

};