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

HomeWSN.Mqtt = (function() {
	"use strict";

	var webmqtt;
	var connected = false;
	var params = HomeWSN.getMqttConnectParams();

	function init() {
		if (HomeWSN.Debugging === true)
			console.log('HomeWSN.Mqtt.init');
		webmqtt = new Paho.MQTT.Client(params.host, params.port, params.clientId);
		webmqtt.onMessageArrived = onMessageArrived;
		webmqtt.onConnectionLost = onConnectionLost;
		webmqtt.onMessageDelivered = onMessageDelivered;
		$('#webmqttmessage').css('color', 'black');
		$('#webmqttmessage').text('Not connected');

		function onMessageArrived(message) {
			if (HomeWSN.Debugging === true)
				console.log('HomeWSN.Mqtt.onMessageArrived: ' + message.destinationName + ' - ' + message.payloadString);
			if (HomeWSN.Content.onMessageArrived !== 'undefined' && $.isFunction(HomeWSN.Content.onMessageArrived))
				HomeWSN.Content.onMessageArrived(message.destinationName, message.payloadString);
		};

		function onMessageDelivered(message) {
			if (HomeWSN.Debugging === true)
				console.log('HomeWSN.Mqtt.onMessageDelivered: ' + message.destinationName + ' - ' + message.payloadString);
			if (HomeWSN.Content.onMessageDelivered !== 'undefined' && $.isFunction(HomeWSN.Content.onMessageDelivered))
				HomeWSN.Content.onMessageDelivered(message.destinationName, message.payloadString);
		};

		function onConnectionLost(responseObject) {
			connected = false;
			$('#webmqttmessage').css('color', 'red');
			if (responseObject.errorCode !== 0) {
				if (HomeWSN.Debugging === true)
					console.log('HomeWSN.Mqtt.onConnectionLost: ' + responseObject.errorMessage);
				$('#webmqttmessage').text('Connection Lost');
				setTimeout(connect, 1000);
			}
			else
				$('#webmqttmessage').text('Disconnected');
		};
	};

	function connect() {
		if (connected === true)
			return;
		if (HomeWSN.Debugging === true)
			console.log('HomeWSN.Mqtt.connect');
		setTimeout(connect, 10000);
		webmqtt.connect({onSuccess: onConnect, cleanSession: params.cleanSession, useSSL: params.useSSL, mqttVersion: 3});

		function onConnect() {
			connected = true;
			$('#webmqttmessage').css('color', 'green');
			$('#webmqttmessage').text('Connected');
			if (HomeWSN.Debugging === true)
				console.log('HomeWSN.Mqtt.onConnect');
			if (HomeWSN.Content.onConnect !== 'undefined' && $.isFunction(HomeWSN.Content.onConnect))
				HomeWSN.Content.onConnect();
		};
	};

	function disconnect() {
		if (connected === true) {
			webmqtt.disconnect();
			if (HomeWSN.Debugging === true)
				console.log('HomeWSN.Mqtt.disconnect');
		}
	};

	function subscribe(topic, options) {
		if (connected === true) {
			webmqtt.subscribe(topic, options);
			if (HomeWSN.Debugging === true)
				console.log('HomeWSN.Mqtt.subscribe');
		}
	};

	function unsubscribe(topic) {
		if (connected === true) {
			webmqtt.unsubscribe(topic);
			if (HomeWSN.Debugging === true)
				console.log('HomeWSN.Mqtt.unsubscribe');
		}
	};

	function publish(topic, payload, retained) {
		if (connected === true) {
			var message = new Paho.MQTT.Message(payload);
			message.destinationName = topic;
			message.qos = 1;
			message.retained = retained ? true : false;
			webmqtt.send(message);
			if (HomeWSN.Debugging === true)
				console.log('HomeWSN.Mqtt.publish');
		}
	};

	function isConnected() {
		return connected;
	};

	return {
		init: init,
		connect: connect,
		disconnect: disconnect,
		subscribe: subscribe,
		unsubscribe: unsubscribe,
		publish: publish,
		isConnected: isConnected
	};
})();
