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

var HomeWSN = (function() {
	"use strict";

	//-----------------------------------------------------------
	// DEBUGGING
	var Debugging = false;
	// disable crossDomain requests
	if (Debugging === true)
		$.ajaxSetup({crossDomain: false});

	//-----------------------------------------------------------
	// DEMO
	var WebDemo = true;

	//-----------------------------------------------------------
	function getMqttConnectParams() {
		var host;
		var port = 8082;
		var clientId = 'HomeWSN.WebUI';
		var randomLong = Math.floor(Math.random() * 4294967295); // 2^32

		if (WebDemo === true) {
//			host = 'test.mosquitto.org';
//			port = 8080;
			host = 'broker.hivemq.com';
			port = 8000;
			clientId = 'HomeWSN.WebDemo.' + randomLong.toString();
		}
		else {
			if (Debugging === true) {
				host = '127.0.0.1';
			}
			else {
				host = document.location.hostname;
			}
		}

		return {host: host, port: port, clientId: clientId, cleanSession: true, useSSL: false};
	}

	//-----------------------------------------------------------
	function getWebServerUrl() {
		var url;

		if (Debugging === true) {
			url = '';
		}
		else
			url = document.location.origin + '/';

		return url;
	}

	//-----------------------------------------------------------
	$(function() {
		if (typeof HomeWSN.Navbar !== 'undefined')
			HomeWSN.Navbar.init();
		if (typeof HomeWSN.Content !== 'undefined')
			HomeWSN.Content.init();
	});

	//-----------------------------------------------------------
	return {
		Debugging: Debugging,
		WebDemo: WebDemo,
		getMqttConnectParams: getMqttConnectParams,
		getWebServerUrl: getWebServerUrl
	};
})();
