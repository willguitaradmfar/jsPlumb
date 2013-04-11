var fs = require('fs');

var allModules = [];
var allInstanceSource = [];
var allInstanceTarget = [];

exports.buildOrchestrator = function(pathProject, fun) {
  var file = fs.readFileSync(pathProject+'workspace/1.diag', 'utf8');
  var diagrama = JSON.parse(file);
  console.log('diagrama name : '+diagrama.name);

  clearFileJS(pathProject);

  for(var i in diagrama.content){
  	putModule(diagrama.content[i].sourceId);
  	putModule(diagrama.content[i].targetId);  	
  }

  for(var i in diagrama.content){
  	putInstanceSource(diagrama.content[i].sourceId);  	 	
  }

  for(var i in diagrama.content){
  	putInstanceTarget(diagrama.content[i].targetId);  	 	
  }

  //cria os require
  for(var i in allModules){
  	appendRequire(pathProject, getModuloFromInstance(allModules[i]));
  }

  //cria os method
  for(var i in allInstanceSource){
  	appendCallMethod(pathProject
  		, getModuloFromInstance(allInstanceSource[i])
  		, getModuloFromInstance(allInstanceSource[i])
  		, getModuloFromInstance(allInstanceTarget[i]));
  }

  fun();
};

var getModuloFromInstance = function(instance) {
	return instance.replace(/^instance-\d-(.*)$/, '$1');
};

var putInstanceTarget = function(module) {
	var _module = module;
	for(var i in allInstanceTarget){
		if(allInstanceTarget[i] == _module){
			return true;
		}
	}
	allInstanceTarget.push(_module);
	return false;
};

var putInstanceSource = function(module) {
	var _module = module;
	for(var i in allInstanceSource){
		if(allInstanceSource[i] == _module){
			return true;
		}
	}
	allInstanceSource.push(_module);
	return false;
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

var clearFileJS = function(pathProject) {
	fs.writeFileSync(pathProject+'workspace/1.js', '');
};

var appendCallMethod = function(pathProject, method, box, nextMethod) {
	var fileJS = fs.readFileSync(pathProject+'workspace/1.js', 'utf8');
	var appendContent = tplMethod.replace(/\$method\$/, method).replace(/\$box\$/, box).replace(/\$nextMethod\$/, nextMethod);

	fs.writeFileSync(pathProject+'workspace/1.js', fileJS+appendContent);
};

var appendRequire = function(pathProject, box) {
	var fileJS = fs.readFileSync(pathProject+'workspace/1.js', 'utf8');
	var appendContent = tplRequire.replace(/\$box\$/, box).replace(/\$box\$/, box);

	fs.writeFileSync(pathProject+'workspace/1.js', fileJS+appendContent);
};

var tplRequire = "var $box$ = require('$box$/index.js');\n";

var tplMethod = "\nexports.$method$ = function(data) {\n"+
				"\t$box$.init(data, function(args) {\n"+
					"\t\texports.$nextMethod$(args);\n"+
				"\t});\n"+
			"};\n";

