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

HomeWSN.Content = (function() {
	"use strict";

	var SENSORSTOPIC = 'sensors/+';
	var SENSORSPARAMETERSTOPIC = 'sensors/+/+';

	//-----------------------------------------------------------
	$(window).bind('beforeunload', function() {
		HomeWSN.Mqtt.disconnect();
	});

	//-----------------------------------------------------------
	function init() {
		HomeWSN.Sensors.init();
		HomeWSN.Mqtt.init();
		HomeWSN.Mqtt.connect();
	};

	function onConnect() {
		mqttSubscribe();
	};

	function onMessageArrived(topic, payload) {
		HomeWSN.Sensors.mqttMessage(topic, payload);
	};

	//-----------------------------------------------------------
	function getSensorsOptions() {
		var menu = false;
		var name = '';
		var url = HomeWSN.getWebServerUrl() + 'getsensorsparameters.php';
		var location = $.cookie('menu_loc');
		var type = $.cookie('menu_type');

		if (location === undefined || location === null)
			location = '';
		if (type === undefined || type === null)
			type = '';

		if (location == '' && type != '') {
			menu = true;
			name = type;
			url += '?type=' + type;
		}
		else if (type == '' && location != '') {
			menu = true;
			name = location;
			url += '?location=' + location;
		}
		else if (type != '' && location != '') {
			name = location + ' ' + type;
			url += '?location=' + location + '&type=' + type;
		}
		else {
			menu = true;
			name = 'All';
		}

		name = name + ' Sensors';

		return {name: name, menu: menu, location: location, type: type, url: url};
	};

	//-----------------------------------------------------------
	function initAfterSensorsMenuLoaded() {
		return getSensorsOptions();
	};

	function goToSensorsPage(loc, type) {
		mqttUnsubscribe();
		$.cookie('menu_loc', loc);
		$.cookie('menu_type', type);
		HomeWSN.Navbar.init();
		HomeWSN.Sensors.init();
	};

	function initAfterActuatorsMenuLoaded() {
	};

	function goToActuatorsPage(loc, type) {
		$.cookie('menu_loc', loc);
		$.cookie('menu_type', type);
		$(location).attr('href', 'actuators.html');
	};

	//-----------------------------------------------------------
	function mqttSubscribe() {
		if (HomeWSN.Mqtt.isConnected() === true) {
			HomeWSN.Mqtt.subscribe(SENSORSTOPIC, {qos: 1});
			HomeWSN.Mqtt.subscribe(SENSORSPARAMETERSTOPIC, {qos: 1});
		}
	};

	function mqttUnsubscribe() {
		if (HomeWSN.Mqtt.isConnected() === true) {
			HomeWSN.Mqtt.unsubscribe(SENSORSTOPIC, {qos: 1});
			HomeWSN.Mqtt.unsubscribe(SENSORSPARAMETERSTOPIC, {qos: 1});
		}
	};


	//-----------------------------------------------------------
	return {
		init: init,
		onConnect: onConnect,
		onMessageArrived: onMessageArrived,
		getSensorsOptions: getSensorsOptions,
		initAfterSensorsMenuLoaded: initAfterSensorsMenuLoaded,
		goToSensorsPage: goToSensorsPage,
		initAfterActuatorsMenuLoaded: initAfterActuatorsMenuLoaded,
		goToActuatorsPage: goToActuatorsPage,
		mqttSubscribe: mqttSubscribe,
		mqttUnsubscribe: mqttUnsubscribe
	};
})();
