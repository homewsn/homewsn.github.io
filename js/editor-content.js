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

	var RULESENGINETOPIC = '$SYS/rulesengine/rules';
	if (typeof HomeWSN.WebDemo !== 'undefined' && HomeWSN.WebDemo === true) {
		RULESENGINETOPIC = 'HomeWSN.WebDemo/rulesengine/rules';
	}

	//-----------------------------------------------------------
	$(window).bind('beforeunload', function() {
		HomeWSN.Mqtt.disconnect();
	});

	//-----------------------------------------------------------
	function init() {
		HomeWSN.Editor.init();
		HomeWSN.Mqtt.init();
		HomeWSN.Mqtt.connect();
	};

	function onConnect() {
	};

	function onMessageArrived(topic, payload) {
		if (topic === RULESENGINETOPIC) {
			HomeWSN.Mqtt.unsubscribe(RULESENGINETOPIC);
			HomeWSN.Editor.Flowchart.loadRules(payload);
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
	function createEditorMenu() {
		var $menu = $('#editor-menu');

		$menu.empty();
		$menu.attr({'class': 'active dropdown'});
		$menu.append($('<a/>')
			.attr({
				'href': '#',
				'class': 'dropdown-toggle',
				'data-toggle': 'dropdown'
			})
			.html('Rules Editor <b class="caret"></b>'));

		var $ul = $('<ul/>').attr({'class': 'dropdown-menu'});

		$ul.append($('<li/>').append($('<a/>').attr('href', "javascript:HomeWSN.Content.loadRules();").text('Load')));
		$ul.append($('<li/>').append($('<a/>').attr('href', "javascript:HomeWSN.Content.deployRules();").text('Deploy')));
		$ul.append($('<li/>').attr('class', 'divider'));
		$ul.append($('<li/>').append($('<a/>').attr('href', "javascript:HomeWSN.Content.importRules();").text('Import')));
		$ul.append($('<li/>').append($('<a/>').attr('href', "javascript:HomeWSN.Content.exportRules();").text('Export')));

		$menu.append($ul);
	};

	function loadRules() {
		var rules = HomeWSN.Editor.Flowchart.saveRules();
		if (rules.emptyRules === true) {
			HomeWSN.Mqtt.subscribe(RULESENGINETOPIC, {qos: 1});
		}
		else {
			HomeWSN.Editor.Modal.showConfirmLoadDialog();
		}
	};

	function deployRules() {
		var rules = HomeWSN.Editor.Flowchart.saveRules();
		if (rules.emptyRules === true) {
			HomeWSN.Editor.Modal.showConfirmDeployDialog(rules.strRules);
		}
		else {
			HomeWSN.Mqtt.publish(RULESENGINETOPIC, rules.strRules, true);
		}
	};

	function exportRules() {
		var rules = HomeWSN.Editor.Flowchart.saveRules();
		HomeWSN.Editor.Modal.showExportDialog(rules.strRules);
	};

	function importRules() {
		HomeWSN.Editor.Modal.showImportDialog();
	};

	//-----------------------------------------------------------
	return {
		RULESENGINETOPIC: RULESENGINETOPIC,
		init: init,
		onConnect: onConnect,
		onMessageArrived: onMessageArrived,
		initAfterSensorsMenuLoaded: initAfterSensorsMenuLoaded,
		goToSensorsPage: goToSensorsPage,
		initAfterActuatorsMenuLoaded: initAfterActuatorsMenuLoaded,
		goToActuatorsPage: goToActuatorsPage,
		createMenu: createEditorMenu,
		loadRules: loadRules,
		deployRules: deployRules,
		exportRules: exportRules,
		importRules: importRules
	};
})();
