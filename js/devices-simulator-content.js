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

	var ACTUATORSCOMMANDSTOPIC = 'actuators/+/+/command';

	//-----------------------------------------------------------
	$(window).bind('beforeunload', function() {
		HomeWSN.Mqtt.disconnect();
	});

	//-----------------------------------------------------------
	function init() {
		HomeWSN.Simulator.init();
		HomeWSN.Mqtt.init();
		HomeWSN.Mqtt.connect();
	};

	function onConnect() {
		HomeWSN.Simulator.initPublish();
		mqttSubscribe();
	};

	function onMessageArrived(topic, payload) {
		HomeWSN.Simulator.mqttMessage(topic, payload);
	};

	//-----------------------------------------------------------
	function mqttSubscribe() {
		if (HomeWSN.Mqtt.isConnected() === true) {
			HomeWSN.Mqtt.subscribe(ACTUATORSCOMMANDSTOPIC, {qos: 1});
		}
	};

	function mqttPublish(topic, command, retained) {
		if (HomeWSN.Mqtt.isConnected() === true) {
			HomeWSN.Mqtt.publish(topic, command, retained);
		}
	};

	//-----------------------------------------------------------
	function initAfterSensorsMenuLoaded() {
	};

	function goToSensorsPage(loc, type) {
		$.cookie('menu_loc', loc);
		$.cookie('menu_type', type);
		$(location).attr('href', 'sensors.html');
	};

	function initAfterActuatorsMenuLoaded() {
	};

	function goToActuatorsPage(loc, type) {
		$.cookie('menu_loc', loc);
		$.cookie('menu_type', type);
		$(location).attr('href', 'actuators.html');
	};

	//-----------------------------------------------------------
	return {
		init: init,
		onConnect: onConnect,
		onMessageArrived: onMessageArrived,
		mqttSubscribe: mqttSubscribe,
		mqttPublish: mqttPublish,
		initAfterSensorsMenuLoaded: initAfterSensorsMenuLoaded,
		goToSensorsPage: goToSensorsPage,
		initAfterActuatorsMenuLoaded: initAfterActuatorsMenuLoaded,
		goToActuatorsPage: goToActuatorsPage
	};
})();
