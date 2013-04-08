function boxController ($scope) {
	$scope.listBox = [
			{id : "btactw1", label : "btactw1", listProp : [{key : "NAme",	value : 'btactw1'},	{key : "idade",	value : "1"},{key : "sexo",value : "M"}]}
			,{id : "btactw2", label : "btactw2", listProp : [{key : "name",	value : 'btactw2'},	{key : "idade",	value : "2"},{key : "sexo",value : "M"}]}
			,{id : "btactw3", label : "btactw3", listProp : [{key : "name",	value : 'btactw3'},	{key : "idade",	value : "3"},{key : "sexo",value : "M"}]}
			,{id : "btactw4", label : "btactw4", listProp : [{key : "name",	value : 'btactw4'},	{key : "idade",	value : "4"},{key : "sexo",value : "M"}]}
			,{id : "btactw5", label : "btactw5", listProp : [{key : "Nome",	value : 'btactw5'},	{key : "idade",	value : "5"},{key : "sexo",value : "M"}]}
			,{id : "btactw6", label : "btactw6", listProp : [{key : "name",	value : 'btactw6'},	{key : "idade",	value : "6"},{key : "sexo",value : "M"}]}
			];

	$scope.listIntenceBox = [];

	$scope.listProp = [];

	$scope.clickBox = function (box) {
		
		if(!box.instance){
			box.instance = 0;
		}
		box.instance++;

		var _box = {};
		_box.label = box.label+'#'+box.instance;
		_box.id = 'instance-'+box.instance+'-'+box.id;
		_box.listProp = box.listProp;
		$scope.listIntenceBox.push(_box);

		setTimeout(function() {
			_addEndpoints(_box.id, ["BottomCenter"], ["TopCenter"]);
			jsPlumb.draggable(jsPlumb.getSelector(".window"), { grid: [1, 1] });
		},500);		
	};

	$scope.clickInstanceBox = function (instanceBox) {		
		$scope.listProp = instanceBox.listProp;
		$scope.instanceBoxProp = instanceBox;
	};
	
}

