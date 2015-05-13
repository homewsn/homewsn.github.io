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
			anchor: 'Right',
			maxConnections: -1,
			parameters: {
				'type': 'targetEndpoint'
			}
		};

		var sourceEndpoint = {
			anchor: 'Left',
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

		jsPlumb.addEndpoint($('#node-server-mqtt'), sourceEndpoint, { uuid: 'node-server-mqtt-src' });
		jsPlumb.addEndpoint($('#node-server-web'), sourceEndpoint, { uuid: 'node-server-web-src' });
		jsPlumb.addEndpoint($('#node-comp-desktop-1'), targetEndpoint, { uuid: 'node-comp-desktop-1-trg' });
		jsPlumb.addEndpoint($('#node-comp-desktop-2'), targetEndpoint, { uuid: 'node-comp-desktop-2-trg' });
		jsPlumb.connect({uuids: ['node-server-mqtt-src', 'node-comp-desktop-1-trg']}, {parameters: { type: 'mqtt-comp-1'}});
		jsPlumb.connect({uuids: ['node-server-mqtt-src', 'node-comp-desktop-2-trg']}, {parameters: { type: 'mqtt-comp-2'}});
		jsPlumb.connect({uuids: ['node-server-web-src', 'node-comp-desktop-1-trg']}, {parameters: { type: 'web-comp-1'}});
		jsPlumb.connect({uuids: ['node-server-web-src', 'node-comp-desktop-2-trg']}, {parameters: { type: 'web-comp-2'}});

		var selectedType = {
			paintStyle: { strokeStyle: '#d84444' },
		};
		jsPlumb.registerConnectionType('selected', selectedType);


		$('.node').on('click', function(ev) {
			removeAllSelections();
			switch (ev.target.id) {
				case 'node-comp-desktop-1':
					$('#node-comp-desktop-1-desc').show();
					break;
				case 'node-comp-desktop-2':
					$('#node-comp-desktop-2-desc').show();
					break;
				case 'node-server-mqtt':
					$('#node-server-mqtt-desc').show();
					break;
				case 'node-server-web':
					$('#node-server-web-desc').show();
					break;
				default:
					break;
			}
			$(ev.target).addClass('node-selected');
			var norm = $(ev.target).attr('src');
			var hot = norm.replace('.png', '-hot.png');
			$(ev.target).attr('src', hot);
		});

		$('#node-comp-desktop-1').trigger('click');
	});
})();
