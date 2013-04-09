function boxController ($scope, $http) {
	$scope.listBox = [];

	$http({method: 'GET', url: '/getBoxModules'})
		.success(function(data, status, headers, config) {	  	
			$scope.listBox = data;
		}).error(function(data, status, headers, config) {
			alert('Não foi possível receber os modulos do servidor');
		});

	$scope.listInstanceBox = [];	

	$scope.clickBox = function (box) {
		
		if(!box.instance){
			box.instance = 0;
		}
		box.instance++;

		var _box = {};
		_box.label = box.label+'#'+box.instance;
		_box.id = 'instance-'+box.instance+'-'+box.id;		
		_box.listProp = newInstanceProp(box.listProp);
		$scope.listInstanceBox.push(_box);			
	};

	$scope.clickInstanceBox = function (instanceBox) {		
		$scope.instanceBoxProp = instanceBox;		
	};

	$scope.refreshBox = function(box) {
		_addEndpoints(box.id, ["BottomCenter"], ["TopCenter"]);
		jsPlumb.draggable(jsPlumb.getSelector(".window"), { grid: [1, 1] });
	};

	$scope.buildDiagrama = function() {
		
	};

	var newInstanceProp = function(arrayProp) {
		var _arrayProp = [];
		for(var i in arrayProp){
			var prop = {};
			prop.key = arrayProp[i].key;
			prop.value = arrayProp[i].value;
			_arrayProp.push(prop);
		}
		return _arrayProp;
	};
}

