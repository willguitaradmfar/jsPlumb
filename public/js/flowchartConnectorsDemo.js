;(function() {

	var socket = io.connect('/jsPlumb');

	socket.on('test-fail', function(data) {
		console.log(data);		
		if(data && data.type && data.type.toLowerCase() == 'error'){
			jsPlumb.select({source : data.boxsource, target : data.boxtarget}).setPaintStyle({strokeStyle: "red"});
		}else if(data && data.type && data.type.toLowerCase() == 'success'){
			jsPlumb.select({source : data.boxsource, target : data.boxtarget}).setPaintStyle({strokeStyle: "green"});
		}else {
			jsPlumb.select({source : data.boxsource, target : data.boxtarget}).setPaintStyle({strokeStyle: "yellow"});
		}

	});

	socket.on('validate', function(data) {
		console.log(data);
		if(data && data.type && data.type.toLowerCase() == 'error'){
			jsPlumb.select({source : data.boxsource, target : data.boxtarget}).setPaintStyle({strokeStyle: "red"});
		}else if(data && data.type && data.type.toLowerCase() == 'success'){
			jsPlumb.select({source : data.boxsource, target : data.boxtarget}).setPaintStyle({strokeStyle: "green"});
		}else {
			jsPlumb.select({source : data.boxsource, target : data.boxtarget}).setPaintStyle({strokeStyle: "yellow"});
		}
	});

	socket.on('box-source-not-found', function(data) {
		console.log(data);		
	});

	socket.on('box-target-not-found', function(data) {
		console.log(data);		
	});

	window.jsPlumbDemo = {
		init : function() {
			jsPlumb.importDefaults({
				DragOptions : { cursor: 'pointer', zIndex:2000 },
				EndpointStyles : [{ fillStyle:'#225588' }, { fillStyle:'#558822' }],
				Endpoints : [ [ "Dot", {radius:7} ], [ "Dot", { radius:11 } ]],
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
				lineWidth:3,
				strokeStyle:"gray"
			},

			sourceEndpoint = {
				endpoint:"Dot",
				paintStyle:{ fillStyle:"#225588",radius:10 },
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
				paintStyle:{ fillStyle:"#558822",radius:11 },
				hoverPaintStyle:connectorHoverStyle,
				maxConnections:-1,
				dropOptions:{ hoverClass:"hover", activeClass:"active" },
				
				isTarget:true,
                overlays:[
                	[ "Label", { location:[0.5, -0.5], label:"in", cssClass:"endpointTargetLabel" } ]
                ]
			},
			init = function(connection) {				
				connection.getOverlay("label").setLabel(connection.sourceId + " - " + connection.targetId);
				connection.bind("editCompleted", function(o) {
					if (typeof console != "undefined")
						console.log("connection edited. path is now ", o.path);
				});
			};

			var allSourceEndpoints = [], allTargetEndpoints = [];
			_addEndpoints = function(toId, sourceAnchors, targetAnchors) {
				for (var i = 0; i < sourceAnchors.length; i++) {
					var sourceUUID = toId + sourceAnchors[i];						
					allSourceEndpoints.push(jsPlumb.addEndpoint(toId, sourceEndpoint, { anchor:sourceAnchors[i], uuid:sourceUUID}));
				}
				for (var j = 0; j < targetAnchors.length; j++) {
					var targetUUID = toId + targetAnchors[j];						
					allTargetEndpoints.push(jsPlumb.addEndpoint(toId, targetEndpoint, { anchor:targetAnchors[j], uuid:targetUUID}));
				}
			};
			
			$('#bbb').on('click',function() {
				var id = $('#box').val();
				if(id.length > 0){
					$('#main').append($('<div class="window"><strong>'+id+'</strong><br/><br/></div>').attr({'id': id}));
					_addEndpoints(id, ["BottomCenter"],["TopCenter"]);
					jsPlumb.draggable(jsPlumb.getSelector(".window"), { grid: [1, 1] });
				}
			});

			_addEndpoints("convertTotal", ["BottomCenter"],["TopCenter"]);			
			_addEndpoints("somarvalores", ["BottomCenter"],["TopCenter"]);			
			
			jsPlumb.bind("jsPlumbConnection", function(connInfo, originalEvent) {
				init(connInfo.connection);
				//alert(' >> jsPlumbConnection ' + connInfo);				
				socket.emit('jsPlumbConnection', {action : 'jsPlumbConnection', source : connInfo.connection.sourceId, target : connInfo.connection.targetId});
			});

			jsPlumb.draggable(jsPlumb.getSelector(".window"), { grid: [1, 1] });

			jsPlumb.bind("click", function(conn, originalEvent) {
				//alert(' >> delete conexão source:'+conn.sourceId+' target:'+conn.targetId);
				socket.emit('detach', {action : 'detach', source : conn.sourceId, target : conn.targetId});
				jsPlumb.detach(conn);
			});

			jsPlumb.bind("connectionDrag", function(connection) {
				//alert(">> arrastando " + connection.id + " is being dragged");
				socket.emit('connectionDrag', {action : 'connectionDrag', source : connection.sourceId, target : connection.targetId});
			});

			jsPlumb.bind("connectionDragStop", function(connection) {
				//alert(">> largadoem source : "+connection.sourceId +" target : "+connection.targetId);				
				socket.emit('connectionDragStop', {action : 'connectionDragStop', source : connection.sourceId, target : connection.targetId});
			});
		}
	};
})();