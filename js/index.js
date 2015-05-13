/*
* Copyright (c) 2015 Vladimir Alemasov
* All rights reserved
*
* This program and the accompanying materials are distributed under 
* the terms of GNU General Public License version 2 
* as published by the Free Software Foundation.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*/

(function() {
	"use strict";

	//-----------------------------------------------------------
	// remove all selections
	function removeAllSelections() {
		$.each(jsPlumb.getAllConnections(), function(idx, conn) {
			conn.setParameter('selected', false);
			conn.setType('default');
		});
		$('.node').each(function() {
			if ($(this).hasClass('node-selected')) {
				$(this).removeClass('node-selected');
				var hot = $(this).attr('src');
				var norm = hot.replace('-hot', '');
				$(this).attr('src', norm);
			}
		});
		$('.desc').hide();
	};

	//-----------------------------------------------------------
	jsPlumb.ready(function() {

		var targetEndpoint = {
			anchor: 'Top',
			maxConnections: -1,
			parameters: {
				'type': 'targetEndpoint'
			}
		};

		var sourceEndpoint = {
			anchor: 'Bottom',
			maxConnections: -1,
			parameters: {
				'type': 'sourceEndpoint'
			}
		};

		var arrowCommon = { foldback: 0.7, width: 6, length: 14 };

		jsPlumb.setContainer($('#main'));
		jsPlumb.importDefaults({
			Connector: [ 'Bezier', {
				curviness: 100
			}],
			PaintStyle: {
				strokeStyle: '#2e6f9a',
				lineWidth: 2,
				joinstyle: 'round'
			},
			Endpoint: [ 'Blank', {
			}],
			ConnectionOverlays: [
				[ 'Arrow', { location: 1 }, arrowCommon ],
				[ 'Arrow', { location: 0, direction: -1 }, arrowCommon ]
			]
		});

		jsPlumb.addEndpoint($('#node-sensor-1'), sourceEndpoint, { uuid: 'node-sensor-1-src' });
		jsPlumb.addEndpoint($('#node-sensor-2'), sourceEndpoint, { uuid: 'node-sensor-2-src' });
		jsPlumb.addEndpoint($('#node-actuator-1'), targetEndpoint, { uuid: 'node-actuator-1-trg' });
		jsPlumb.addEndpoint($('#node-actuator-1'), sourceEndpoint, { uuid: 'node-actuator-1-src' });
		jsPlumb.addEndpoint($('#node-border-router'), targetEndpoint, { uuid: 'node-border-router-trg' });
		jsPlumb.addEndpoint($('#node-border-router'), sourceEndpoint, { uuid: 'node-border-router-src' });
		jsPlumb.addEndpoint($('#node-broker-gateway'), targetEndpoint, { uuid: 'node-broker-gateway-trg' });
		jsPlumb.addEndpoint($('#node-broker-gateway'), sourceEndpoint, { uuid: 'node-broker-gateway-src' });
		jsPlumb.addEndpoint($('#node-server-db'), targetEndpoint, { uuid: 'node-server-db-trg' });
		jsPlumb.addEndpoint($('#node-server-db'), sourceEndpoint, { uuid: 'node-server-db-src' });
		jsPlumb.addEndpoint($('#node-server-web'), targetEndpoint, { uuid: 'node-server-web-trg' });
		jsPlumb.addEndpoint($('#node-server-web'), sourceEndpoint, { uuid: 'node-server-web-src' });
		jsPlumb.addEndpoint($('#node-comp-desktop'), targetEndpoint, { uuid: 'node-comp-desktop-trg' });
		jsPlumb.connect({uuids: ['node-sensor-1-src', 'node-actuator-1-trg']}, {overlays: [[ 'Label', { label: 'WPAN', cssClass: 'aLabel' }]], parameters: { type: 'wpan'}});
		jsPlumb.connect({uuids: ['node-actuator-1-src', 'node-border-router-trg']}, {overlays: [[ 'Label', { label: 'WPAN', cssClass: 'aLabel' }]], parameters: { type: 'wpan'}});
		jsPlumb.connect({uuids: ['node-sensor-2-src', 'node-border-router-trg']}, {overlays: [[ 'Label', { label: 'WPAN', cssClass: 'aLabel' }]], parameters: { type: 'wpan'}});
		jsPlumb.connect({uuids: ['node-border-router-src', 'node-broker-gateway-trg']}, {overlays: [[ 'Label', { label: 'USB', cssClass: 'aLabel' }]], parameters: { type: 'usb'}});
		jsPlumb.connect({uuids: ['node-broker-gateway-src', 'node-server-db-trg']}, {overlays: [[ 'Label', { label: 'LAN', cssClass: 'aLabel' }]], parameters: { type: 'c-mysql'}});
		jsPlumb.connect({uuids: ['node-server-db-trg', 'node-server-web-trg']}, {overlays: [[ 'Label', { label: 'LAN', cssClass: 'aLabel' }]], parameters: { type: 'php-mysql'}, connector: ['Bezier', { curviness: 50 }]});
		jsPlumb.connect({uuids: ['node-broker-gateway-src', 'node-comp-desktop-trg']}, {overlays: [[ 'Label', { label: 'WAN', cssClass: 'aLabel' }]], parameters: { type: 'websocket'}, connector: ['Bezier', { curviness: 150 }]});
		jsPlumb.connect({uuids: ['node-server-web-trg', 'node-comp-desktop-trg']}, {overlays: [[ 'Label', { label: 'WAN', cssClass: 'aLabel' }]], parameters: { type: 'http'}, connector: ['Bezier', { curviness: 50 }]});

		var selectedType = {
			paintStyle: { strokeStyle: '#d84444' },
		};
		jsPlumb.registerConnectionType('selected', selectedType);

		jsPlumb.bind('click', function(conn, ev) {
			removeAllSelections();
			var type = conn.getParameter('type');
			switch (type) {
				case 'wpan':
					$('#conn-wpan-desc').show();
					break;
				case 'usb':
					$('#conn-usb-desc').show();
					break;
				case 'c-mysql':
					$('#conn-c-mysql-desc').show();
					break;
				case 'php-mysql':
					$('#conn-php-mysql-desc').show();
					break;
				case 'websocket':
					$('#conn-websocket-desc').show();
					break;
				case 'http':
					$('#conn-http-desc').show();
					break;
				default:
					break;
			}
			conn.setParameter('selected', true);
			conn.setType('selected');
		});

		$('.node').on('click', function(ev) {
			removeAllSelections();
			switch (ev.target.id) {
				case 'node-sensor-1':
				case 'node-sensor-2':
					$('#node-sensor-desc').show();
					break;
				case 'node-actuator-1':
					$('#node-actuator-desc').show();
					break;
				case 'node-border-router':
					$('#node-border-router-desc').show();
					break;
				case 'node-broker-gateway':
					$('#node-broker-gateway-desc').show();
					break;
				case 'node-server-db':
					$('#node-server-db-desc').show();
					break;
				case 'node-server-web':
					$('#node-server-web-desc').show();
					break;
				case 'node-comp-desktop':
					$('#node-comp-desktop-desc').show();
					break;
				default:
					break;
			}
			$(ev.target).addClass('node-selected');
			var norm = $(ev.target).attr('src');
			var hot = norm.replace('.png', '-hot.png');
			$(ev.target).attr('src', hot);
		});

		$('#node-sensor-2').trigger('click');
	});
})();
