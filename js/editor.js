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

HomeWSN.Editor = (function() {
	"use strict";

	var RULES_VERSION = '1.00';

	//-----------------------------------------------------------
	function init() {
		loadSourceTopics();
		jsPlumb.ready(function() {
			HomeWSN.Editor.Flowchart.init();
		});
	}

	//-----------------------------------------------------------
	var RULES = {
		TRIGGER_CRON: {
			type: 'trigger-cron',
			title: 'Cron trigger',
			name: 'Cron trigger',
			desc: 'Use this flowchart block to trigger an event from the cron timer. Cron format is a simple, yet powerful and flexible way to define time and frequency of various actions. Only classic cron format consisting of five fields separated by white spaces is allowed.'
		},
		TRIGGER_TOPIC: {
			type: 'trigger-topic',
			title: 'Topic trigger',
			name: 'Topic trigger',
			desc: 'Use this flowchart block to trigger an event when actuator or sensor publishes on selected topic.'
		},
		CONDITION_TOPIC_VALUE: {
			type: 'condition-topic-value',
			title: 'Comparing topic to constant value',
			name: 'Comparing topic to value',
			desc: 'Use this flowchart block to compare the message payload on the selected topic to constant value.'
		},
		CONDITION_TOPIC_TOPIC: {
			type: 'condition-topic-topic',
			title: 'Comparing two topics',
			name: 'Comparing two topics',
			desc: 'Use this flowchart block to compare the message payloads on two selected topics.'
		},
		CONDITION_TOPIC_VARIABLE: {
			type: 'condition-topic-variable',
			title: 'Comparing topic to variable',
			name: 'Comparing topic to variable',
			desc: 'Use this flowchart block to compare the message payload on the selected topic to a value of a variable.'
		},
		CONDITION_VARIABLE_VALUE: {
			type: 'condition-variable-value',
			title: 'Comparing variable to constant value',
			name: 'Comparing variable to value',
			desc: 'Use this flowchart block to compare a value of a variable to constant value.'
		},
		CONDITION_VARIABLE_VARIABLE: {
			type: 'condition-variable-variable',
			title: 'Comparing two variables',
			name: 'Comparing two variables',
			desc: 'Use this flowchart block to compare the values of two variables.'
		},
		ACTION_VALUE: {
			type: 'action-value',
			title: 'Publishing constant value on topic',
			name: 'Publishing value on topic',
			desc: 'Use this flowchart block to publish constant value on the selected topic.'
		},
		ACTION_TOPIC: {
			type: 'action-topic',
			title: 'Publishing value on one topic on another',
			name: 'Publishing topic on topic',
			desc: 'Use this flowchart block to publish the message payload on the selected topic on the another selected topic.'
		},
		ACTION_VARIABLE: {
			type: 'action-variable',
			title: 'Publishing variable on topic',
			name: 'Publishing variable on topic',
			desc: 'Use this flowchart block to publish a value of a variable on the selected topic.'
		},
		VARIABLE_INIT: {
			type: 'variable-init',
			title: 'Initializing a variable',
			name: 'Initializing variable',
			desc: 'Use this flowchart block to initialize a variable setting an initial value. All variables must be initialized before using them.'
		},
		VARIABLE_SET: {
			type: 'variable-set',
			title: 'Setting a variable',
			name: 'Setting variable',
			desc: 'Use this flowchart block to set a value to a variable.'
		},
		VARIABLE_INCREMENT: {
			type: 'variable-increment',
			title: 'Increment a variable',
			name: 'Increment variable',
			desc: 'Use this flowchart block to increment a variable value.'
		},
		VARIABLE_DECREMENT: {
			type: 'variable-decrement',
			title: 'Decrement a variable',
			name: 'Decrement variable',
			desc: 'Use this flowchart block to decrement a variable value.'
		},

		getTitle: function(type) {
			for (var prop in this) {
				if (this[prop].type === type)
					return this[prop].title;
			}
			return null;
		},
		getName: function(type) {
			for (var prop in this) {
				if (this[prop].type === type)
					return this[prop].name;
			}
			return null;
		},
		getDesc: function(type) {
			for (var prop in this) {
				if (this[prop].type === type)
					return this[prop].desc;
			}
			return null;
		}
	};

	//-----------------------------------------------------------
	var sourceConditions = [
		{value: '==', text: '==', desc: 'equal to'},
		{value: '!=', text: '!=', desc: 'not equal'},
		{value: '>=', text: '>=', desc: 'greater than or equal to'},
		{value: '<=', text: '<=', desc: 'less than or equal to'},
		{value: '>', text: '>', desc: 'greater than'},
		{value: '<', text: '<', desc: 'less than'}
	];

	//-----------------------------------------------------------
	var sourceVariables = [];
	function addVariable(name) {
		for (var idx = 0; idx < sourceVariables.length; idx++) {
			if (sourceVariables[idx].value === name) {
				return false;
			}
		}
		sourceVariables.push({value: name, text: name});
		return true;
	};
	function deleteVariable(name) {
		for (var idx = 0; idx < sourceVariables.length; idx++) {
			if (sourceVariables[idx].value === name) {
				sourceVariables.splice(idx, 1);
				return true;
			}
		}
		return false;
	};
	function isVariable(name) {
		for (var idx = 0; idx < sourceVariables.length; idx++) {
			if (sourceVariables[idx].value === name)
				return true;
		}
		return false;
	};
	function renameVariable(name, newname) {
		for (var idx = 0; idx < sourceVariables.length; idx++) {
			if (sourceVariables[idx].value === name) {
				sourceVariables[idx].value = newname;
				sourceVariables[idx].text = newname;
				return true;
			}
		}
		return false;
	};


	//-----------------------------------------------------------
	var sourceTopics = [];
	var sensorDataTopics;
	var actuatorDataTopics;
	var actuatorCommandTopics;
	function loadSourceTopics() {
		$.getScript(HomeWSN.getWebServerUrl() + 'getsensorstopics.php', function(script, textStatus, jqXHR) {
			sensorDataTopics = JSON.parse(script);
			$.each(sensorDataTopics, function(idx, elem) {
				elem.value = elem.topic;
				elem.text = elem.topic;
				delete elem.topic;
			});
			$.getScript(HomeWSN.getWebServerUrl() + 'getactuatorstopics.php', function(script, textStatus, jqXHR) {
				actuatorDataTopics = JSON.parse(script);
				$.each(actuatorDataTopics, function(idx, elem) {
					elem.value = elem.topic;
					elem.text = elem.topic;
					delete elem.topic;
				});
				actuatorCommandTopics = JSON.parse(script);
				$.each(actuatorCommandTopics, function(idx, elem) {
					elem.value = elem.topic + '/command';
					elem.text = elem.topic + '/command';
					delete elem.topic;
				});
				sourceTopics.push({text: 'Topics of sensors data:', children: sensorDataTopics});
				sourceTopics.push({text: 'Topics of actuators status:', children: actuatorDataTopics});
				sourceTopics.push({text: 'Topics of actuators command:', children: actuatorCommandTopics});
			});
		});
	};

	//-----------------------------------------------------------
	// accordion chevron events
	function toggleChevron(ev) {
		$(ev.target)
			.prev('.panel-heading')
			.find('span.indicator')
			.toggleClass('glyphicon-chevron-down glyphicon-chevron-right');
	};
	$('#accordion').on('hidden.bs.collapse', toggleChevron);
	$('#accordion').on('show.bs.collapse', toggleChevron);


	// storage blocks events
	$('.storage-block').draggable({
		appendTo: '#main-container',
		containment: $('#main-container'),
		cursor: 'move',
		revertDuration: 100,
		revert: 'invalid',
		helper: function(ev, ui) {
			var pos = $(this).offset();
			$(this).removeClass('storage-block-margin');
			var $clone = $(this).clone();
			$(this).draggable('option', 'cursorAt', {
				left: ev.pageX - pos.left,
				top: ev.pageY - pos.top
			});
			return $clone;
		},
		start: function(ev, ui) {
			$(this).addClass('storage-block-margin');
		}
	});
	$('.storage-block').mousedown(function() {
		var max = 0;
		$('.jsplumb-block').each(function() {
			var z = parseInt($(this).zIndex(), 10);
			max = Math.max(max, z);
		});
		$(this).zIndex(max + 1);
	});

	// popovers
	$('[data-toggle=popover]').popover({
		trigger: 'hover',
		container: 'body',
		placement: 'right',
		delay: { 'show': '1000', 'hide': '0' }}
	);
	$('#trigger-cron').attr({
		'data-original-title': RULES.getTitle('trigger-cron'),
		'data-content': RULES.getDesc('trigger-cron')
	});
	$('#trigger-topic').attr({
		'data-original-title': RULES.getTitle('trigger-topic'),
		'data-content': RULES.getDesc('trigger-topic')
	});
	$('#condition-topic-value').attr({
		'data-original-title': RULES.getTitle('condition-topic-value'),
		'data-content': RULES.getDesc('condition-topic-value')
	});
	$('#condition-topic-topic').attr({
		'data-original-title': RULES.getTitle('condition-topic-topic'),
		'data-content': RULES.getDesc('condition-topic-topic')
	});
	$('#condition-topic-variable').attr({
		'data-original-title': RULES.getTitle('condition-topic-variable'),
		'data-content': RULES.getDesc('condition-topic-variable')
	});
	$('#condition-variable-value').attr({
		'data-original-title': RULES.getTitle('condition-variable-value'),
		'data-content': RULES.getDesc('condition-variable-value')
	});
	$('#condition-variable-variable').attr({
		'data-original-title': RULES.getTitle('condition-variable-variable'),
		'data-content': RULES.getDesc('condition-variable-variable')
	});
	$('#action-value').attr({
		'data-original-title': RULES.getTitle('action-value'),
		'data-content': RULES.getDesc('Publish value to topic')
	});
	$('#action-topic').attr({
		'data-original-title': RULES.getTitle('action-topic'),
		'data-content': RULES.getDesc('action-topic')
	});
	$('#action-variable').attr({
		'data-original-title': RULES.getTitle('action-variable'),
		'data-content': RULES.getDesc('action-variable')
	});
	$('#variable-init').attr({
		'data-original-title': RULES.getTitle('variable-init'),
		'data-content': RULES.getDesc('variable-init')
	});
	$('#variable-set').attr({
		'data-original-title': RULES.getTitle('variable-set'),
		'data-content': RULES.getDesc('variable-set')
	});
	$('#variable-increment').attr({
		'data-original-title': RULES.getTitle('variable-increment'),
		'data-content': RULES.getDesc('variable-increment')
	});
	$('#variable-decrement').attr({
		'data-original-title': RULES.getTitle('variable-decrement'),
		'data-content': RULES.getDesc('variable-decrement')
	});

	// block titles
	$('#trigger-cron .block-text-title').text(RULES.getName('trigger-cron'));
	$('#trigger-topic .block-text-title').text(RULES.getName('trigger-topic'));
	$('#condition-topic-value .block-text-title').text(RULES.getName('condition-topic-value'));
	$('#condition-topic-topic .block-text-title').text(RULES.getName('condition-topic-topic'));
	$('#condition-topic-variable .block-text-title').text(RULES.getName('condition-topic-variable'));
	$('#condition-variable-value .block-text-title').text(RULES.getName('condition-variable-value'));
	$('#condition-variable-variable .block-text-title').text(RULES.getName('condition-variable-variable'));
	$('#action-value .block-text-title').text(RULES.getName('action-value'));
	$('#action-topic .block-text-title').text(RULES.getName('action-topic'));
	$('#action-variable .block-text-title').text(RULES.getName('action-variable'));
	$('#variable-init .block-text-title').text(RULES.getName('variable-init'));
	$('#variable-set .block-text-title').text(RULES.getName('variable-set'));
	$('#variable-increment .block-text-title').text(RULES.getName('variable-increment'));
	$('#variable-decrement .block-text-title').text(RULES.getName('variable-decrement'));


	//-----------------------------------------------------------
	return {
		RULES: RULES,
		RULES_VERSION: RULES_VERSION,
		init: init,
		sourceConditions: sourceConditions,
		sourceVariables: sourceVariables,
		sourceTopics: sourceTopics,
		addVariable: addVariable,
		deleteVariable: deleteVariable,
		isVariable: isVariable,
		renameVariable: renameVariable
	};
})();
