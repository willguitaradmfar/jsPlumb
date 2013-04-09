exports.index = function(config) {

	this.label = "Somar";
	this.Decimal = "2";
	this.Cor = "Red";

	this.validate = function(data, callback) {	
		if(data['v1'] != undefined && data['v2'] != undefined){		
			callback({msg : "Obj válido", type : "success"});
		}else{
			callback({msg : "Obj inválido esperado (v1 e v2)", type : "ERROr"});
		}
	};

	this.init = function(data, callback) {
		
		var total = (data.v1-0)+(data.v2-0);

		callback({total : total});
	};
};