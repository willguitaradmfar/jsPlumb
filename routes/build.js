var fs = require('fs');

var allModules = [];

exports.buildOrchestrator = function(pathProject, fun) {
  var file = fs.readFileSync(pathProject+'workspace/1.diag', 'utf8');
  var diagrama = JSON.parse(file);
  console.log('diagrama name : '+diagrama.name);

  for(var i in diagrama.content){  	
  	putModule(diagrama.content[i].sourceId);
  	putModule(diagrama.content[i].targetId);
  	appendCallMethod(pathProject, getModuloFromInstance(diagrama.content[i].targetId), getModuloFromInstance(diagrama.content[i].targetId), 'next');  	
  }

  fun();
};

var getModuloFromInstance = function(instance) {
	return instance.replace(/^instance-\d-(.*)$/, '$1');
};

var putModule = function(module) {
	var _module = module.replace(/^instance-\d-(.*)$/, '$1');
	for(var i in allModules){
		if(allModules[i] == _module){
			return true;
		}
	}
	allModules.push(_module);
	return false;
};

var appendCallMethod = function(pathProject, method, box, nextMethod) {
	var fileJS = fs.readFileSync(pathProject+'workspace/1.js', 'utf8');
	var appendContent = tplMethod.replace(/\$method\$/, method).replace(/\$box\$/, box).replace(/\$nextMethod\$/, nextMethod);

	fs.writeFile(pathProject+'workspace/1.js', fileJS+appendContent, function(err) {      
      if(err) 
        console.error(err);              

        console.log('Arquivo JS salvo com sucesso');      
    });
};

var tplMethod = "\nexports.$method$ = function(data) {\n"+
				"\t$box$.init(data, function(args) {\n"+
					"\t\texports.$nextMethod$(args);\n"+
				"\t});\n"+
			"};\n";

var tplMethod = "\nexports.$method$ = function(data) {\n"+
				"\t$box$.init(data, function(args) {\n"+
					"\t\texports.$nextMethod$(args);\n"+
				"\t});\n"+
			"};\n";