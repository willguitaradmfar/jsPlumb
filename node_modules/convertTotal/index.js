
exports.index = function(config) {

	this.validate = function(data, callback) {
		if(data.total && data.total > 0){
			callback({msg : "Obj válido data.total é > 0 "+JSON.stringify(data), type : "success"});
		}else{
			callback({msg : "Obj inválido", type : "erroR"});
		}
	};

	this.init = function(data, callback) {
		var convertido = data.total*1.44;
		callback({dolar : convertido});
	};
};