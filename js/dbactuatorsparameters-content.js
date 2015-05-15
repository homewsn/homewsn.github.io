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
		var actuators;
		$.getScript(HomeWSN.getWebServerUrl() + 'getactuatorsparameters.php', function(script, textStatus, jqXHR) {
			actuators = JSON.parse(script);
			createTable(actuators);
		});
	};

	//-----------------------------------------------------------
	function createTable(actuators) {
		var colSet = [];
		var rowHash = actuators[0];
		var $headerTr = $('<tr/>');
		var $table = $('#edittable');

		for (var key in rowHash)
		{
			colSet.push(key);
			if (key == 'id')
				$headerTr.append($('<th/>').text('Actuator #'));
			else if (key == 'param')
				$headerTr.append($('<th/>').text('Param #'));
			else if (key == 'unit')
				$headerTr.append($('<th/>').text('Unit'));
			else if (key == 'data_type')
				$headerTr.append($('<th/>').text('Data type'));
			else if (key == 'icon_type')
				$headerTr.append($('<th/>').text('Image type'));
			else if (key == 'icon_url_na')
				$headerTr.append($('<th/>').text('Image n/a'));
			else if (key == 'icon_url_0')
				$headerTr.append($('<th/>').text('Image 0'));
			else if (key == 'icon_url_1')
				$headerTr.append($('<th/>').text('Image 1'));
			else if (key == 'value_0')
				$headerTr.append($('<th/>').text('State 0'));
			else if (key == 'value_1')
				$headerTr.append($('<th/>').text('State 1'));
			else if (key == 'location')
				$headerTr.append($('<th/>').text('Location'));
			else if (key == 'type')
				$headerTr.append($('<th/>').text('Type'));
			else if (key == 'comment')
				$headerTr.append($('<th/>').text('Comment'));
			else
				$headerTr.append($('<th/>').text(key));
		}
		$table.append($headerTr);

		for (var rowIndex = 0 ; rowIndex < actuators.length ; rowIndex++)
		{
			var $row = $('<tr/>');
			for (var colIndex = 0 ; colIndex < colSet.length ; colIndex++)
			{
				var headerValue = colSet[colIndex];
				var cellValue = actuators[rowIndex][headerValue];
				var pk = actuators[rowIndex]['id'] + '-' + actuators[rowIndex]['param'];
				if (headerValue == 'icon_type')
					$row.append($('<td/>').html('<a href="#" class="icontype-editable" data-name="icon_type" data-value="' + cellValue + '" data-pk="' + pk + '">' + cellValue + '</a>'));
				else if (headerValue == 'icon_url_na')
					$row.append($('<td/>').html('<a href="#" class="nonval-editable" data-title="Enter image URL for nonconnected state:" data-name="icon_url_na" data-pk="' + pk + '">' + cellValue + '</a>'));
				else if (headerValue == 'icon_url_0')
					$row.append($('<td/>').html('<a href="#" class="nonval-editable" data-title="Enter image URL for state 0:" data-name="icon_url_0" data-pk="' + pk + '">' + cellValue + '</a>'));
				else if (headerValue == 'icon_url_1')
					$row.append($('<td/>').html('<a href="#" class="nonval-editable" data-title="Enter image URL for state 1:" data-name="icon_url_1" data-pk="' + pk + '">' + cellValue + '</a>'));
				else if (headerValue == 'value_0')
					$row.append($('<td/>').html('<a href="#" class="val-editable" data-title="Enter text for state 0 or min value:" data-name="value_0" data-pk="' + pk + '">' + cellValue + '</a>'));
				else if (headerValue == 'value_1')
					$row.append($('<td/>').html('<a href="#" class="val-editable" data-title="Enter text for state 1 or max value:" data-name="value_1" data-pk="' + pk + '">' + cellValue + '</a>'));
				else if (headerValue == 'type')
					$row.append($('<td/>').html('<a href="#" class="type-editable" data-name="type" data-pk="' + pk + '">' + cellValue + '</a>'));
				else if (headerValue == 'comment')
					$row.append($('<td/>').html('<a href="#" class="nonval-editable" data-title="Enter additional name of the device:" data-name="comment" data-pk="' + pk + '">' + cellValue + '</a>'));
				else
					$row.append($('<td/>').text(cellValue));
			}
			$table.append($row);
		}

		var rows = $table.find('> tbody > tr');
		for (var rowIndex = 1 ; rowIndex < rows.length ; rowIndex++)
		{
			var $row = rows[rowIndex];
			if ($("a[data-name='icon_type']", $row).text() != 'ImageFile') {
				$("a[data-name='icon_url_na']", $row).hide();
				$("a[data-name='icon_url_0']", $row).hide();
				$("a[data-name='icon_url_1']", $row).hide();
			}
		}

		$.fn.editable.defaults.mode = 'popup';
		$.fn.editable.defaults.url = HomeWSN.getWebServerUrl() + 'postparameters.php';

		$('.icontype-editable').editable({
			type: 'select',
			title: 'Select image type:',
			validate: function(value) {
				if ($.trim(value) == '')
					return 'This field is required';
			},
			source: [
				{value: 'ImageFile', text: 'ImageFile'},
				{value: 'CircularGauge', text: 'CircularGauge'},
				{value: 'LinearGauge', text: 'LinearGauge'}
			],
			success: function(response, newValue) {
				var $row = $(this).parents('tr');
				if (newValue == 'ImageFile') {
					$("a[data-name='icon_url_na']", $row).show();
					$("a[data-name='icon_url_0']", $row).show();
					$("a[data-name='icon_url_1']", $row).show();
				}
				else {
					$("a[data-name='icon_url_na']", $row).hide();
					$("a[data-name='icon_url_0']", $row).hide();
					$("a[data-name='icon_url_1']", $row).hide();
				}
			}
		});

		$('.nonval-editable').editable({
			type: 'text',
		});

		$('.val-editable').editable({
			type: 'text',
			validate: function(value) {
				if ($.trim(value) == '')
					return 'This field is required';
			}
		});

		$('.type-editable').editable({
			type: 'text',
			title: 'Enter type of the device:',
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
