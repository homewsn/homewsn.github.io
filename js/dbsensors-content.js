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

	//-----------------------------------------------------------
	function init() {
		var sensors;
		$.getScript(HomeWSN.getWebServerUrl() + 'getsensors.php', function(script, textStatus, jqXHR) {
			sensors = JSON.parse(script);
			createTableSensors(sensors);
		});
	};

	//-----------------------------------------------------------
	function createTableSensors(sensors) {
		var colSet = [];
		var rowHash = sensors[0];
		var $headerTr = $('<tr/>');
		var $table = $('#edittable');

		for (var key in rowHash)
		{
			colSet.push(key);
			if (key == 'id')
				$headerTr.append($('<th/>').text('Sensor #'));
			else if (key == 'ip')
				$headerTr.append($('<th/>').text('Sensor IP'));
			else if (key == 'location')
				$headerTr.append($('<th/>').text('Location'));
			else
				$headerTr.append($('<th/>').text(key));
		}
		$table.append($headerTr);

		for (var rowIndex = 0 ; rowIndex < sensors.length ; rowIndex++)
		{
			var $row = $('<tr/>');
			for (var colIndex = 0 ; colIndex < colSet.length ; colIndex++)
			{
				var headerValue = colSet[colIndex];
				var cellValue = sensors[rowIndex][headerValue];
				var pk = sensors[rowIndex]['id'];
				if (headerValue == 'location')
					$row.append($('<td/>').html('<a href="#" class="location-editable" data-name="location" data-pk="' + pk + '">' + cellValue + '</a>'));
				else
					$row.append($('<td/>').text(cellValue));
			}
			$table.append($row);
		}

		$.fn.editable.defaults.mode = 'popup';

		$('.location-editable').editable({
			type: 'text',
			url: HomeWSN.getWebServerUrl() + 'postsensors.php',
			title: 'Enter location:',
			validate: function(value) {
				if ($.trim(value) == '')
					return 'This field is required';
			},
			success: function(response, newValue) {
				HomeWSN.Navbar.init();
			}
		});
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
		initAfterSensorsMenuLoaded: initAfterSensorsMenuLoaded,
		goToSensorsPage: goToSensorsPage,
		initAfterActuatorsMenuLoaded: initAfterActuatorsMenuLoaded,
		goToActuatorsPage: goToActuatorsPage
	};
})();
