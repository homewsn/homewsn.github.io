/*
* Copyright (c) 2015, 2017 Vladimir Alemasov
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

HomeWSN.Simulator = (function() {
	"use strict";

	var devices = [];

	//-----------------------------------------------------------
	function init() {
		loadDevices();
	};

	//-----------------------------------------------------------
	function loadDevices() {
		$.getScript(HomeWSN.getWebServerUrl() + 'getactuatorsparameters.php', function(script, textStatus, jqXHR) {
			var actuators = JSON.parse(script);
			$.each(actuators, function(idx, elem) {
				elem.device = 'actuator';
				devices.push(elem);
			});
			$.getScript(HomeWSN.getWebServerUrl() + 'getsensorsparameters.php', function(script, textStatus, jqXHR) {
				var sensors = JSON.parse(script);
				$.each(sensors, function(idx, elem) {
					elem.device = 'sensor';
					devices.push(elem);
				});
				initSimulatorPage();
			});
		});
	};

	//-----------------------------------------------------------
	function initSimulatorPage() {
		var colSet = [];
		var $headerTr = $('<tr/>');
		var $table = $('#edittable');

		colSet.push('device');
		$headerTr.append($('<th/>').text('Device type'));
		colSet.push('id');
		$headerTr.append($('<th/>').text('Device #'));
		colSet.push('param');
		$headerTr.append($('<th/>').text('Param #'));
		colSet.push('desc');
		$headerTr.append($('<th/>').text('Device description'));
		colSet.push('command');
		$headerTr.append($('<th/>').text('Control action or measurement result').attr({'class': 'text-center-cell'}));
		colSet.push('status');
		$headerTr.append($('<th/>').text('Status').attr({'class': 'text-center-cell'}));

		$table.append($headerTr);

		for (var rowIndex = 0 ; rowIndex < devices.length ; rowIndex++)
		{
			var $row = $('<tr/>');
			for (var colIndex = 0 ; colIndex < colSet.length ; colIndex++)
			{
				var headerValue = colSet[colIndex];
				if (headerValue === 'id' || headerValue === 'param')
					$row.append($('<td/>').text(devices[rowIndex][headerValue]));
				else if (headerValue === 'desc')
					$row.append($('<td/>').text(devices[rowIndex]['location'] + ' ' + devices[rowIndex]['type'] + ' ' + devices[rowIndex]['comment']));
				else if (headerValue === 'device')
					$row.append($('<td/>').html(devices[rowIndex]['device']));
				else if (headerValue === 'command') {
					if (devices[rowIndex]['icon_type'] === 'ImageFile') {
						// bootstrap-switch
						var state = Math.floor(Math.random() * 2); // 0 or 1
						devices[rowIndex].$input = $('<input>').attr({ type: 'checkbox', 'data-size': 'mini' }).prop('checked', state);
						$row.append($('<td/>').append(devices[rowIndex].$input).attr({'class': 'text-center-cell'}));
						devices[rowIndex].$input.bootstrapSwitch();
						devices[rowIndex].$input.data('sn', rowIndex);
					}
					else if (devices[rowIndex]['device'] === 'sensor' && (devices[rowIndex]['icon_type'] === 'CircularGauge' || devices[rowIndex]['icon_type'] === 'LinearGauge')) {
						// bootstrap-slider
						var state = Math.floor(Math.random() * (parseInt(devices[rowIndex]['value_1'], 10) - parseInt(devices[rowIndex]['value_0'], 10))) + parseInt(devices[rowIndex]['value_0'], 10); // value_0 <-> value_1
						devices[rowIndex].$input = $('<input>').attr({ type: 'text', 'data-slider-min': devices[rowIndex]['value_0'], 'data-slider-max': devices[rowIndex]['value_1'], 'data-slider-value': state.toString() });
						$row.append($('<td/>').append(devices[rowIndex].$input).attr({'class': 'text-center-cell'}));
						devices[rowIndex].$input.slider();
						devices[rowIndex].$input.data('sn', rowIndex);
					}
					else {
						if (HomeWSN.Debugging === true)
							console.log('HomeWSN.Simulator.initSimulatorPage: unrecognized device type');
					}
				}
				else if (headerValue === 'status') {
					if (devices[rowIndex]['icon_type'] === 'ImageFile') {
						// image
						var $div = $('<div/>').attr({'class': 'text-center-cell'});
						var src = devices[rowIndex].$input.bootstrapSwitch('state') ? devices[rowIndex].icon_url_1 : devices[rowIndex].icon_url_0;
						devices[rowIndex].$status = $('<img/>').attr({'src': src});
						$row.append($('<td/>').append($div.append(devices[rowIndex].$status)));
					}
					else {
						// text
						devices[rowIndex].$status = $('<div/>').attr({'class': 'text-bold'});
						$row.append($('<td/>').append(devices[rowIndex].$status).attr({'class': 'text-status-center-cell'}));
						devices[rowIndex].$status.text(devices[rowIndex].$input.slider('getValue').toString());
					}
				}
			}
			$table.append($row);
		}

		$('.bootstrap-switch').on('switchChange.bootstrapSwitch', function(event, state) {
			var sn = $(event.target).data('sn');
			var payload = state ? '1' : '0';
			var topic = devices[sn].device === 'actuator' ? 'actuators/' : 'sensors/';
			topic += devices[sn].id + '/' + devices[sn].param;
			// exert control action
			var src = state ? devices[sn].icon_url_1 : devices[sn].icon_url_0;
			devices[sn].$status.attr('src', src);
			// change device status
			HomeWSN.Content.mqttPublish(topic, payload, true);
		});

		$('.slider').on('change', function(event) {
			var sn = $(event.target).parent().find('input').data('sn');
			var payload = event.value.newValue.toString();
			var topic = devices[sn].device === 'actuator' ? 'actuators/' : 'sensors/';
			topic += devices[sn].id + '/' + devices[sn].param;
			// exert control action
			devices[sn].$status.text(payload);
			// change device status
			HomeWSN.Content.mqttPublish(topic, payload, true);
		});
	};

	//-----------------------------------------------------------
	function initPublish() {
		for (var cnt = 0; cnt < devices.length; cnt++) {
			var payload;
			var topic = devices[cnt].device === 'actuator' ? 'actuators/' : 'sensors/';
			topic += devices[cnt].id + '/' + devices[cnt].param;
			if (devices[cnt]['icon_type'] === 'ImageFile') {
				payload = devices[cnt].$input.bootstrapSwitch('state') ? '1' : '0';
			}
			else if (devices[cnt]['icon_type'] === 'CircularGauge' || devices[cnt]['icon_type'] === 'LinearGauge') {
				payload = devices[cnt].$input.slider('getValue').toString();
			}
			else {
				if (HomeWSN.Debugging === true)
					console.log('HomeWSN.Simulator.initSimulatorPage: unrecognized device type');
			}
			// change device status
			HomeWSN.Content.mqttPublish(topic, payload, true);
		}
	};

	//-----------------------------------------------------------
	function mqttMessage(topic, payload) {
		if (devices === undefined)
			return;
		var parts = topic.split('/');
		var main_topic = parts.shift();
		if (parts.length !== 0 && main_topic === 'actuators') {
			var id = parts.shift();
			if (parts.length !== 0) {
				var param = parts.shift();
				for (var cnt = 0; cnt < devices.length; cnt++) {
					if (devices[cnt].id == id && devices[cnt].param == param && devices[cnt].device === 'actuator') {
						var command = parts.shift();
						if (parts.length === 0) {
							if (payload == '0') {
								devices[cnt].$input.bootstrapSwitch('state', false);
							}
							else if (payload == '1') {
								devices[cnt].$input.bootstrapSwitch('state', true);
							}
							break;
						}
					}
				}
			}
		}
	};


	//-----------------------------------------------------------
	return {
		init: init,
		initPublish: initPublish,
		mqttMessage: mqttMessage
	};
})();
