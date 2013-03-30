;(function() {

	var _initialised = false,
		showConnectionInfo = function(s) {
			$("#list").html(s);
			$("#list").fadeIn({complete:function() { jsPlumb.repaintEverything(); }});
		},	
		hideConnectionInfo = function() {
			$("#list").fadeOut({complete:function() { jsPlumb.repaintEverything(); }});
		},
		connections = [],
		updateConnections = function(conn, remove) {
			if (!remove) connections.push(conn);
			else {
				var idx = -1;
				for (var i = 0; i < connections.length; i++) {
					if (connections[i] == conn) {
						idx = i; break;
					}
				}
				if (idx != -1) connections.splice(idx, 1);
			}
			if (connections.length > 0) {
				var s = "<span><strong>Connections</strong></span><br/><br/><table><tr><th>Scope</th><th>Source</th><th>Target</th></tr>";
				for (var j = 0; j < connections.length; j++) {
					s = s + "<tr><td>" + connections[j].scope + "</td>" + "<td>" + connections[j].sourceId + "</td><td>" + connections[j].targetId + "</td></tr>";
				}
				showConnectionInfo(s);
			} else 
				hideConnectionInfo();
		};
	
	window.jsPlumbDemo = {
		init : function() {		
			
			jsPlumb.importDefaults({
				DragOptions : { cursor: 'pointer', zIndex:2000 },
				PaintStyle : { strokeStyle:'#666' },
				EndpointStyle : { width:20, height:16, strokeStyle:'#666' },
				Endpoint : "Rectangle",
				Anchors : ["TopCenter", "TopCenter"]
			});												
			
			jsPlumb.bind("connection", function(info, originalEvent) {
				updateConnections(info.connection);
			});
			jsPlumb.bind("connectionDetached", function(info, originalEvent) {
				updateConnections(info.connection, true);
			});
			
			var exampleDropOptions = {
				tolerance:"touch",
				hoverClass:"dropHover",
				activeClass:"dragActive"
			};

			var exampleColor = "#00f";
			var exampleEndpoint = {
				endpoint:"Rectangle",
				paintStyle:{ width:25, height:21, fillStyle:exampleColor },
				isSource:true,
				reattach:true,
				scope:"blue rectangle",
				connectorStyle : {
					gradient:{stops:[[0, exampleColor], [0.5, "#09098e"], [1, exampleColor]]},
					lineWidth:5,
					strokeStyle:exampleColor,
					dashstyle:"2 2"
				},
				isTarget:true,
				beforeDrop:function(params) { 
					return confirm("Connect " + params.sourceId + " to " + params.targetId + "?"); 
				},				
				dropOptions : exampleDropOptions
			};

			var color2 = "#316b31";
			var exampleEndpoint2 = {
				endpoint:["Dot", { radius:15 }],
				paintStyle:{ fillStyle:color2 },
				isSource:true,
				scope:"green dot",
				connectorStyle:{ strokeStyle:color2, lineWidth:8 },
				connector: ["Bezier", { curviness:63 } ],
				maxConnections:3,
				isTarget:true,
				dropOptions : exampleDropOptions
			};

		
			var example3Color = "rgba(229,219,61,0.5)";
			var exampleEndpoint3 = {
				endpoint:["Dot", {radius:17} ],
				anchor:"BottomLeft",
				paintStyle:{ fillStyle:example3Color, opacity:0.5 },
				isSource:true,
				scope:'yellow dot',
				connectorStyle:{ strokeStyle:example3Color, lineWidth:4 },
				connector : "Straight",
				isTarget:true,
				dropOptions : exampleDropOptions,
				beforeDetach:function(conn) { 
					return confirm("Detach connection?"); 
				},
				onMaxConnections:function(info) {
					alert("Cannot drop connection " + info.connection.id + " : maxConnections has been reached on Endpoint " + info.endpoint.id);
				}
			};

			
			var e1 = jsPlumb.addEndpoint('window1', { anchor:[0.5, 1, 0, 1] }, exampleEndpoint2);
			
			var anchors = [[1, 0.2, 1, 0], [0.8, 1, 0, 1], [0, 0.8, -1, 0], [0.2, 0, 0, -1] ],
				maxConnectionsCallback = function(info) {
					alert("Cannot drop connection " + info.connection.id + " : maxConnections has been reached on Endpoint " + info.endpoint.id);
				};
				
			var e1 = jsPlumb.addEndpoint("window1", { anchor:anchors }, exampleEndpoint);
			// you can bind for a maxConnections callback using a standard bind call, but you can also supply 'onMaxConnections' in an Endpoint definition - see exampleEndpoint3 above.
			e1.bind("maxConnections", maxConnectionsCallback);

			var e2 = jsPlumb.addEndpoint('window2', { anchor:[0.5, 1, 0, 1] }, exampleEndpoint);

			e2.bind("maxConnections", maxConnectionsCallback);
			jsPlumb.addEndpoint('window2', { anchor:"RightMiddle" }, exampleEndpoint2);

			var e3 = jsPlumb.addEndpoint("window3", { anchor:[0.25, 0, 0, -1] }, exampleEndpoint);
			e3.bind("maxConnections", maxConnectionsCallback);
			jsPlumb.addEndpoint("window3", { anchor:[0.75, 0, 0, -1] }, exampleEndpoint2);

			var e4 = jsPlumb.addEndpoint("window4", { anchor:[1, 0.5, 1, 0] }, exampleEndpoint);
			e4.bind("maxConnections", maxConnectionsCallback);			
			jsPlumb.addEndpoint("window4", { anchor:[0.25, 0, 0, -1] }, exampleEndpoint2);

			jsPlumb.addEndpoint("foo", { anchor:[0.5, 0, 0, 0] }, exampleEndpoint2);
			jsPlumb.addEndpoint("foo", { anchor:[0, 0, 0, 0] }, exampleEndpoint);
			jsPlumb.addEndpoint("foo", { anchor:[1, 0, 0, 0] }, exampleEndpoint);

			// make .window divs draggable
			jsPlumb.draggable($(".window"));

			// add endpoint of type 3 using a selector. 
			jsPlumb.addEndpoint($(".window"), exampleEndpoint3);

			//			
			if (!_initialised) {
				$(".hide").click(function() {
					jsPlumb.toggle($(this).attr("rel"));
				});
	
				$(".drag").click(function() {
					var s = jsPlumb.toggleDraggable($(this).attr("rel"));
					$(this).html(s ? 'disable dragging' : 'enable dragging');
					if (!s)
						$("#" + $(this).attr("rel")).addClass('drag-locked');
					else
						$("#" + $(this).attr("rel")).removeClass('drag-locked');
					$("#" + $(this).attr("rel")).css("cursor", s ? "pointer" : "default");
				});
	
				$(".detach").click(function() {
					jsPlumb.detachAllConnections($(this).attr("rel"));
				});
	
				$("#clear").click(function() { 
					jsPlumb.detachEveryConnection();
					showConnectionInfo("");
				});
				
				_initialised = true;
			}
		}
	};	
})();