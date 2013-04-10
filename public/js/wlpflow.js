function boxController ($scope, $http, $window) {

	var wlpflowdiagrama = [];

	var socket = io.connect('/jsPlumb');
	$scope.listBox = [];
	$scope.listInstanceBox = [];

	$http({method: 'GET', url: '/getBoxModules'})
	.success(function(data, status, headers, config) {	  	
		$scope.listBox = data;
	}).error(function(data, status, headers, config) {
		alert('Não foi possível receber os modulos do servidor');
	});	

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
		$http({method: 'POST', url: '/buildDiagrama', data : wlpflowdiagrama})
		.success(function(data, status, headers, config) {	  	
			alert(data.msg);
		}).error(function(data, status, headers, config) {
			alert('Não foi possível montar o diagrama');
		});
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

	//---------------------------------------//
	//-- ABAIXO O JSPLUMB DA APLICAÇÃO 
	//-- DENTRO DO CONTROLLER ANGULARJS PARA
	//-- TER $scope
	//---------------------------------------//	

	socket.on('test-fail', function(data) {	
		console.log('test-fail '+JSON.stringify(data));
	});

	socket.on('validate', function(data) {
		console.log('validate '+JSON.stringify(data));
		if(data && data.type && data.type.toLowerCase() == 'error'){
			console.log('validate error'+JSON.stringify(data));
			jsPlumb.select({source : data.boxsource, target : data.boxtarget}).setPaintStyle({strokeStyle: "red"});
		}else if(data && data.type && data.type.toLowerCase() == 'success'){
			console.log('validate success'+JSON.stringify(data));
			jsPlumb.select({source : data.boxsource, target : data.boxtarget}).setPaintStyle({strokeStyle: "green"});
		}else {
			console.log('validate ?'+JSON.stringify(data));
			jsPlumb.select({source : data.boxsource, target : data.boxtarget}).setPaintStyle({strokeStyle: "yellow"});
		}
	});

	socket.on('box-source-not-found', function(data) {
		console.log('box-source-not-found '+JSON.stringify(data));		
	});

	socket.on('box-target-not-found', function(data) {
		console.log('box-target-not-found '+JSON.stringify(data));		
	});


	$window.jsPlumbDemo = {
		init : function() {
			jsPlumb.importDefaults({
				DragOptions : { cursor: 'pointer', zIndex:2000 },
				EndpointStyles : [{ fillStyle:'#27AE60' }, { fillStyle:'#2980B9' }],
				Endpoints : [ [ "Dot", {radius:7} ], [ "Dot", { radius:7 } ]],
				ConnectionOverlays : [
					[ "Arrow", { location:0.9 } ],
					[ "Label", {
						location:0.1,
						id:"label",
						cssClass:"aLabel"
					}]
				]
			});

			var connectorPaintStyle = {
				lineWidth:2,
				strokeStyle:"black",
				joinstyle:"round",
				outlineColor:"#EAEDEF",
				outlineWidth:7
			},

			connectorHoverStyle = {
				lineWidth:2,
				strokeStyle:"black"
			},

			sourceEndpoint = {
				endpoint:"Dot",
				paintStyle:{ fillStyle:"#2980B9",radius:7 },
				isSource:true,
				connector:[ "Flowchart", { stub:[40, 60], gap:10 } ],
				connectorStyle:connectorPaintStyle,
				hoverPaintStyle:connectorHoverStyle,
				connectorHoverStyle:connectorHoverStyle,
                dragOptions:{},
                overlays:[
                	[ "Label", {
	                	location:[0.5, 1.5],
	                	label:"out",
	                	cssClass:"endpointSourceLabel"
	                } ]
                ]
			},

			targetEndpoint = {
				endpoint:"Dot",
				paintStyle:{ fillStyle:"#27AE60",radius:7 },
				hoverPaintStyle:connectorHoverStyle,
				maxConnections:-1,
				dropOptions:{ hoverClass:"hover", activeClass:"active" },
				isTarget:true,
                overlays:[
                	[ "Label", { location:[0.5, -0.5], label:"in", cssClass:"endpointTargetLabel" } ]
                ]
			},
			init = function(connection) {
				connection.getOverlay("label").setLabel(connection.sourceId.replace(/^instance-\d-(.*)$/, '$1') + " >> - >> " + connection.targetId.replace(/^instance-\d-(.*)$/, '$1'));
				connection.bind("editCompleted", function(o) {
					if (typeof console != "undefined")
						console.log("connection edited. path is now ", o.path);
				});
			};

			var allSourceEndpoints = [], allTargetEndpoints = [];
			_addEndpoints = function(toId, sourceAnchors, targetAnchors) {
				for (var i = 0; i < sourceAnchors.length; i++) {
					var sourceUUID = toId + sourceAnchors[i];
					allSourceEndpoints.push(jsPlumb.addEndpoint(toId, sourceEndpoint, { anchor:sourceAnchors[i], uuid:sourceUUID }));
				}
				for (var j = 0; j < targetAnchors.length; j++) {
					var targetUUID = toId + targetAnchors[j];
					allTargetEndpoints.push(jsPlumb.addEndpoint(toId, targetEndpoint, { anchor:targetAnchors[j], uuid:targetUUID }));
				}
			};

			jsPlumb.bind("jsPlumbConnection", function(connInfo, originalEvent) {
				console.log('jsPlumbConnection');
				init(connInfo.connection);
				socket.emit('jsPlumbConnection', 
					{
						action : 'jsPlumbConnection', 
						source : connInfo.connection.sourceId, 
						target : connInfo.connection.targetId
					});
			});

			jsPlumb.bind("click", function(conn, originalEvent) {
				console.log('detach');
				remConn(conn);
				socket.emit('detach', 
					{
						action : 'detach', 
						source : conn.sourceId, 
						target : conn.targetId
					});
				jsPlumb.detach(conn);

			});

			jsPlumb.bind("dblclick", function(connInfo, originalEvent) {
				console.log('dblclick');
				if (confirm("Delete box " + connInfo.sourceId +"?"))
					jsPlumb.detach(connInfo);
			});

			jsPlumb.bind("connectionDrag", function(connection) {				
				console.log("connection " + connection.id + " is being dragged source:"+connection.sourceId +" target:"+connection.targetId );				

				socket.emit('connectionDrag', 
					{
						action : 'connectionDrag', 
						source : connection.sourceId, 
						target : connection.targetId
					});
			});

			jsPlumb.bind("connectionDragStop", function(connection) {				
				addConn(connection);
				console.log("connection STOP is was dragged source:"+connection.sourceId +" target:"+connection.targetId );				
				socket.emit('connectionDragStop', 
					{
						action : 'connectionDragStop', 
						source : connection.sourceId, 
						target : connection.targetId
					});
			});
		}
	};

	var isInstance = function(args) {
		return /^instance-\d-.*$/.test(args);
	};

	var addConn = function(connection) {
		if(isInstance(connection.targetId)
			&& isInstance(connection.sourceId)){
			var conn = {};
			conn.sourceId = connection.sourceId;
			conn.targetId = connection.targetId;

			for(var i in $scope.listInstanceBox){
				if($scope.listInstanceBox[i].id == connection.sourceId){
					conn.sourceListProp = $scope.listInstanceBox[i].listProp;
				}
				if($scope.listInstanceBox[i].id == connection.targetId){
					conn.targetListProp = $scope.listInstanceBox[i].listProp;
				}
			}

			wlpflowdiagrama.push(conn);
		}		
	};

	var remConn = function(connection) {		
		for(var i in wlpflowdiagrama){
			if(wlpflowdiagrama[i].sourceId == connection.sourceId
				&& wlpflowdiagrama[i].targetId == connection.targetId){
				wlpflowdiagrama.splice(i,1);
			}
		}
	};

	setInterval(function() {
		console.log(wlpflowdiagrama);
		$('#boxTests').text(JSON.stringify(wlpflowdiagrama));
	}, 2000);
}