function boxController ($scope, $http) {
	$scope.listBox = [];

	$http({method: 'GET', url: '/getBoxModules'}).success(function(data, status, headers, config) {	  	
		$scope.listBox = data;
	}).error(function(data, status, headers, config) {
		alert('Não foi possível receber os modulos do servidor');
	});

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

