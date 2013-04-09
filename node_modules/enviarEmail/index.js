exports.index = function(config) {

	this.validate = function(data, callback) {	
		if(data.dolar && data.dolar > 0){		
			callback({msg : "Experado dolar e encontrado com sucesso", type : "success"});
		}else{
			callback({msg : "Obj inválido esperado dolar", type : "ERROr"});
		}
	};

	this.init = function(data, callback) {

		var total = data.total;
		callback({msg : 'Email enviado com sucesso'});
	};

};