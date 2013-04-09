var fs = require('fs');

exports.pathProject = __dirname.replace(/(^.*)routes/, '$1');
exports.box = [];

exports.index = function(req, res){
  console.log('teste');
  res.render('index', { title: 'SNODEJS - Manager Spaces' });
};


exports.getBoxModules = function(req, res){  

  res.end(JSON.stringify(exports.box));
};

exports.scanBox = function(req, res){
	exports.box = [];
	var data = fs.readdirSync(exports.pathProject+'box/');
	for(var i in data){
  		console.log(data[i]);
  		var _require = require(exports.pathProject+'box/'+data[i]+'/index.js');
  		var _obj = new _require.index();

  		var b = {};
  		b.id = data[i];
  		b.label = _obj.label || data[i];
      b.category = _obj.category || 'ALL';
  		b.listProp = [];

  		for(var i in _obj){
  			if(typeof(_obj[i]) != 'function' && i != 'label' && i != 'id' && i != 'category'){          
    				var prop = {};
    				prop.key = i;
    				prop.value = _obj[i];            
    				b.listProp.push(prop);
          }
  			}
  		
  		exports.box.push(b);
  	} 
	res.end(JSON.stringify({scanBox : 'Scaneado com sucesso', box : data}));  
};