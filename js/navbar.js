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

HomeWSN.Navbar = (function() {
	"use strict";

	function init() {
		loadActuatorsMenu();
		loadSensorsMenu();
		if (typeof HomeWSN.Content !== 'undefined' && $.isFunction(HomeWSN.Content.createMenu))
			HomeWSN.Content.createMenu();
		if (typeof HomeWSN.WebDemo !== 'undefined' && HomeWSN.WebDemo === true)
			createSimulatorMenu();
	};

	function loadActuatorsMenu() {
		var locations;
		var types;
		var options;

		$.getScript(HomeWSN.getWebServerUrl() + 'getactuatorslocations.php', function(script, textStatus, jqXHR) {
			locations = JSON.parse(script);
			$.getScript(HomeWSN.getWebServerUrl() + 'getactuatorstypes.php', function(script, textStatus, jqXHR) {
				types = JSON.parse(script);
				var options;
				if (typeof HomeWSN.Content !== 'undefined' && $.isFunction(HomeWSN.Content.initAfterActuatorsMenuLoaded))
					options = HomeWSN.Content.initAfterActuatorsMenuLoaded();
				createActuatorsMenu(locations, types, options);
			});
		});
	};

	function createActuatorsMenu(locations, types, options) {
		var location;
		var type;
		var menu;
		var $li;

		if (typeof options !== 'undefined')
		{
			location = options.location;
			type = options.type;
			menu = options.menu;
		}

		var $menu = $('#actuators-menu').empty();

		$menu.append($('<li/>').attr('class', 'dropdown-header').text('Locations'));
		for (var cnt = 0; cnt < locations.length; cnt++) {
			if (location === locations[cnt] && menu === true) {
				$li = $('<li/>').attr('class', 'active').append($('<a/>').attr('href', "javascript:;").text(locations[cnt]));
			}
			else {
				$li = $('<li/>').append($('<a/>').attr('href', "javascript:HomeWSN.Content.goToActuatorsPage('" + locations[cnt] + "', '');").text(locations[cnt]));
			}
			$menu.append($li);
		}
		$menu.append($('<li/>').attr('class', 'divider'));
		$menu.append($('<li/>').attr('class', 'dropdown-header').text('Types of devices'));
		for (var cnt = 0; cnt < types.length; cnt++) {
			if (type === types[cnt] && menu === true) {
				$li = $('<li/>').attr('class', 'active').append($('<a/>').attr('href', "javascript:;").text(types[cnt]));
			}
			else {
				$li = $('<li/>').append($('<a/>').attr('href', "javascript:HomeWSN.Content.goToActuatorsPage('','" + types[cnt] + "');").text(types[cnt]));
			}
			$menu.append($li);
		}
		$menu.append($('<li/>').attr('class', 'divider'));
		if (type === '' && location === '' && menu === true) {
			$li = $('<li/>').attr('class', 'active').append($('<a/>').attr('href', "javascript:;").text('All Actuators'));
		}
		else {
			$li = $('<li/>').append($('<a/>').attr('href', "javascript:HomeWSN.Content.goToActuatorsPage('','');").text('All Actuators'));
		}
		$menu.append($li);
	};

	function loadSensorsMenu() {
		var locations;
		var types;
		var options;

		$.getScript(HomeWSN.getWebServerUrl() + 'getsensorslocations.php', function(script, textStatus, jqXHR) {
			locations = JSON.parse(script);
			$.getScript(HomeWSN.getWebServerUrl() + 'getsensorstypes.php', function(script, textStatus, jqXHR) {
				types = JSON.parse(script);
				var options;
				if (typeof HomeWSN.Content !== 'undefined' && $.isFunction(HomeWSN.Content.initAfterSensorsMenuLoaded))
					options = HomeWSN.Content.initAfterSensorsMenuLoaded();
				createSensorsMenu(locations, types, options);
			});
		});
	};

	function createSensorsMenu(locations, types, options) {
		var location;
		var type;
		var menu;
		var $li;

		if (typeof options !== 'undefined')
		{
			location = options.location;
			type = options.type;
			menu = options.menu;
		}

		var $menu = $('#sensors-menu').empty();

		$menu.append($('<li/>').attr('class', 'dropdown-header').text('Locations'));
		for (var cnt = 0; cnt < locations.length; cnt++) {
			if (location === locations[cnt] && menu === true) {
				$li = $('<li/>').attr('class', 'active').append($('<a/>').attr('href', "javascript:;").text(locations[cnt]));
			}
			else {
				$li = $('<li/>').append($('<a/>').attr('href', "javascript:HomeWSN.Content.goToSensorsPage('" + locations[cnt] + "', '');").text(locations[cnt]));
			}
			$menu.append($li);
		}
		$menu.append($('<li/>').attr('class', 'divider'));
		$menu.append($('<li/>').attr('class', 'dropdown-header').text('Types of measured parameters'));
		for (var cnt = 0; cnt < types.length; cnt++) {
			if (type === types[cnt] && menu === true) {
				$li = $('<li/>').attr('class', 'active').append($('<a/>').attr('href', "javascript:;").text(types[cnt]));
			}
			else {
				$li = $('<li/>').append($('<a/>').attr('href', "javascript:HomeWSN.Content.goToSensorsPage('','" + types[cnt] + "');").text(types[cnt]));
			}
			$menu.append($li);
		}
		$menu.append($('<li/>').attr('class', 'divider'));
		if (type === '' && location === '' && menu === true) {
			$li = $('<li/>').attr('class', 'active').append($('<a/>').attr('href', "javascript:;").text('All Sensors'));
		}
		else {
			$li = $('<li/>').append($('<a/>').attr('href', "javascript:HomeWSN.Content.goToSensorsPage('','');").text('All Sensors'));
		}
		$menu.append($li);
	};

	function createSimulatorMenu() {
		if ($('#simulator-menu').length)
			return;
		var $menu = $('.navbar-nav');
		var $li = $('<li/>').append($('<a/>').attr('href', "devices-simulator.html").text('Devices Simulator'));
		$li.attr('id', 'simulator-menu');
		$menu.append($li);
	};

	return {
		init: init
	};
})();
