exports.index = function(req, res){
  console.log('teste');
  res.render('index', { title: 'SNODEJS - Manager Spaces' });
};


exports.getBoxModules = function(req, res){  

var box = [{id : "convertTotal", label : "ConvertTotal", listProp : [{key : "NAme",	value : 'btactw1'},	{key : "idade",	value : "1"},{key : "sexo",value : "M"}]}
			,{id : "enviarEmail", label : "EnviarEmail", listProp : [{key : "name",	value : 'btactw2'},	{key : "idade",	value : "2"},{key : "sexo",value : "M"}]}
			,{id : "formularioDeEntrada", label : "FormularioDeEntrada", listProp : [{key : "name",	value : 'btactw3'},	{key : "idade",	value : "3"},{key : "sexo",value : "M"}]}
			,{id : "somarvalores", label : "Somarvalores", listProp : [{key : "name",	value : 'btactw4'},	{key : "idade",	value : "4"},{key : "sexo",value : "M"}]}			
			];

  res.end(JSON.stringify(box));
};