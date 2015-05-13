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

HomeWSN.Editor.Flowchart = (function() {
	"use strict";

	var DIV_SUFFIX = '-block';
	var rules = HomeWSN.Editor.RULES;
	var input = true;

	var targetEndpoint = {
		anchor: 'Top',
		isTarget: true,
		dropOptions: {
			hoverClass: 'target-drop-hover-endpoint',
			activeClass: 'target-drop-active-endpoint'
		},
		cssClass: 'target-endpoint',
		hoverClass: 'target-hover-endpoint',
		maxConnections: -1,
		parameters: {
			'type': 'targetEndpoint'
		}
	};

	var sourceEndpoint = {
		anchor: 'Bottom',
		isSource: true,
		cssClass: 'source-endpoint',
		hoverClass: 'source-hover-endpoint',
		dragAllowedWhenFull: false,
		parameters: {
			'type': 'sourceEndpoint'
		}
	};

	var sourceTrueEndpoint = {
		anchor: [ 1, 1, 0, 1, -20, 0 ],
		isSource: true,
		cssClass: 'source-endpoint',
		hoverClass: 'source-hover-endpoint',
		dragAllowedWhenFull: false,
		connectorOverlays: [
			[ 'Label', {
				label: 'true',
				id: 'label',
				location: 0.15,
				cssClass: 'true-connection-label'
			}]
		],
		parameters: {
			'type': 'sourceTrueEndpoint'
		}
	};

	var sourceFalseEndpoint = {
		anchor: [ 0, 1, 0, 1, 20, 0 ],
		isSource: true,
		cssClass: 'source-endpoint',
		hoverClass: 'source-hover-endpoint',
		dragAllowedWhenFull: false,
		connectorOverlays: [
			[ 'Label', {
				label: 'false',
				id: 'label',
				location: 0.15,
				cssClass: 'false-connection-label'
			}]
		],
		parameters: {
			'type': 'sourceFalseEndpoint'
		}
	};

	//-----------------------------------------------------------
	// create needed information and endpoints for new $block
	function createBlock($block, options, arrElem, conns) {
		switch (options.type) {
			case rules.TRIGGER_CRON.type:
				if (typeof arrElem !== 'undefined' && typeof conns !== 'undefined') {
					options['value'] = arrElem['value'];
					options['nextid'] = arrElem['nextid'];
					conns['nextid'] = arrElem['nextid'];
				}
				else {
					options['value'] = '';
					options['nextid'] = 0;
				}
				jsPlumb.addEndpoint($block, sourceEndpoint);
				break;
			case rules.TRIGGER_TOPIC.type:
				if (typeof arrElem !== 'undefined' && typeof conns !== 'undefined') {
					options['topic'] = arrElem['topic'];
					options['nextid'] = arrElem['nextid'];
					conns['nextid'] = arrElem['nextid'];
				}
				else {
					options['topic'] = '';
					options['nextid'] = 0;
				}
				jsPlumb.addEndpoint($block, sourceEndpoint);
				break;
			case rules.CONDITION_TOPIC_VALUE.type:
				if (typeof arrElem !== 'undefined' && typeof conns !== 'undefined') {
					options['topic'] = arrElem['topic'];
					options['condition'] = arrElem['condition'];
					options['value'] = arrElem['value'];
					options['nextid-true'] = arrElem['nextid-true'];
					options['nextid-false'] = arrElem['nextid-false'];
					conns['nextid-true'] = arrElem['nextid-true'];
					conns['nextid-false'] = arrElem['nextid-false'];
				}
				else {
					options['topic'] = '';
					options['condition'] = '';
					options['value'] = '';
					options['nextid-true'] = 0;
					options['nextid-false'] = 0;
				}
				jsPlumb.addEndpoint($block, targetEndpoint);
				jsPlumb.addEndpoint($block, sourceTrueEndpoint);
				jsPlumb.addEndpoint($block, sourceFalseEndpoint);
				break;
			case rules.CONDITION_TOPIC_TOPIC.type:
				if (typeof arrElem !== 'undefined' && typeof conns !== 'undefined') {
					options['topic'] = arrElem['topic'];
					options['condition'] = arrElem['condition'];
					options['value-topic'] = arrElem['value-topic'];
					options['nextid-true'] = arrElem['nextid-true'];
					options['nextid-false'] = arrElem['nextid-false'];
					conns['nextid-true'] = arrElem['nextid-true'];
					conns['nextid-false'] = arrElem['nextid-false'];
				}
				else {
					options['topic'] = '';
					options['condition'] = '';
					options['value-topic'] = '';
					options['nextid-true'] = 0;
					options['nextid-false'] = 0;
				}
				jsPlumb.addEndpoint($block, targetEndpoint);
				jsPlumb.addEndpoint($block, sourceTrueEndpoint);
				jsPlumb.addEndpoint($block, sourceFalseEndpoint);
				break;
			case rules.CONDITION_TOPIC_VARIABLE.type:
				if (typeof arrElem !== 'undefined' && typeof conns !== 'undefined') {
					options['topic'] = arrElem['topic'];
					options['condition'] = arrElem['condition'];
					options['value-variable'] = arrElem['value-variable'];
					options['nextid-true'] = arrElem['nextid-true'];
					options['nextid-false'] = arrElem['nextid-false'];
					conns['nextid-true'] = arrElem['nextid-true'];
					conns['nextid-false'] = arrElem['nextid-false'];
				}
				else {
					options['topic'] = '';
					options['condition'] = '';
					options['value-variable'] = '';
					options['nextid-true'] = 0;
					options['nextid-false'] = 0;
				}
				jsPlumb.addEndpoint($block, targetEndpoint);
				jsPlumb.addEndpoint($block, sourceTrueEndpoint);
				jsPlumb.addEndpoint($block, sourceFalseEndpoint);
				break;
			case rules.CONDITION_VARIABLE_VALUE.type:
				if (typeof arrElem !== 'undefined' && typeof conns !== 'undefined') {
					options['variable'] = arrElem['variable'];
					options['condition'] = arrElem['condition'];
					options['value'] = arrElem['value'];
					options['nextid-true'] = arrElem['nextid-true'];
					options['nextid-false'] = arrElem['nextid-false'];
					conns['nextid-true'] = arrElem['nextid-true'];
					conns['nextid-false'] = arrElem['nextid-false'];
				}
				else {
					options['variable'] = '';
					options['condition'] = '';
					options['value'] = '';
					options['nextid-true'] = 0;
					options['nextid-false'] = 0;
				}
				jsPlumb.addEndpoint($block, targetEndpoint);
				jsPlumb.addEndpoint($block, sourceTrueEndpoint);
				jsPlumb.addEndpoint($block, sourceFalseEndpoint);
				break;
			case rules.CONDITION_VARIABLE_VARIABLE.type:
				if (typeof arrElem !== 'undefined' && typeof conns !== 'undefined') {
					options['variable'] = arrElem['variable'];
					options['condition'] = arrElem['condition'];
					options['value-variable'] = arrElem['value-variable'];
					options['nextid-true'] = arrElem['nextid-true'];
					options['nextid-false'] = arrElem['nextid-false'];
					conns['nextid-true'] = arrElem['nextid-true'];
					conns['nextid-false'] = arrElem['nextid-false'];
				}
				else {
					options['variable'] = '';
					options['condition'] = '';
					options['value-variable'] = '';
					options['nextid-true'] = 0;
					options['nextid-false'] = 0;
				}
				jsPlumb.addEndpoint($block, targetEndpoint);
				jsPlumb.addEndpoint($block, sourceTrueEndpoint);
				jsPlumb.addEndpoint($block, sourceFalseEndpoint);
				break;
			case rules.ACTION_VALUE.type:
				if (typeof arrElem !== 'undefined' && typeof conns !== 'undefined') {
					options['topic'] = arrElem['topic'];
					options['value'] = arrElem['value'];
					options['retain'] = arrElem['retain'];
					options['nextid'] = arrElem['nextid'];
					conns['nextid'] = arrElem['nextid'];
				}
				else {
					options['topic'] = '';
					options['value'] = '';
					options['retain'] = 0;
					options['nextid'] = 0;
				}
				jsPlumb.addEndpoint($block, targetEndpoint);
				jsPlumb.addEndpoint($block, sourceEndpoint);
				break;
			case rules.ACTION_TOPIC.type:
				if (typeof arrElem !== 'undefined' && typeof conns !== 'undefined') {
					options['topic'] = arrElem['topic'];
					options['value-topic'] = arrElem['value-topic'];
					options['retain'] = arrElem['retain'];
					options['nextid'] = arrElem['nextid'];
					conns['nextid'] = arrElem['nextid'];
				}
				else {
					options['topic'] = '';
					options['value-topic'] = '';
					options['retain'] = 0;
					options['nextid'] = 0;
				}
				jsPlumb.addEndpoint($block, targetEndpoint);
				jsPlumb.addEndpoint($block, sourceEndpoint);
				break;
			case rules.ACTION_VARIABLE.type:
				if (typeof arrElem !== 'undefined' && typeof conns !== 'undefined') {
					options['topic'] = arrElem['topic'];
					options['value-variable'] = arrElem['value-variable'];
					options['retain'] = arrElem['retain'];
					options['nextid'] = arrElem['nextid'];
					conns['nextid'] = arrElem['nextid'];
				}
				else {
					options['topic'] = '';
					options['value-variable'] = '';
					options['retain'] = 0;
					options['nextid'] = 0;
				}
				jsPlumb.addEndpoint($block, targetEndpoint);
				jsPlumb.addEndpoint($block, sourceEndpoint);
				break;
			case rules.VARIABLE_INIT.type:
				if (typeof arrElem !== 'undefined' && typeof conns !== 'undefined') {
					options['variable'] = arrElem['variable'];
					options['value'] = arrElem['value'];
					options['retain'] = arrElem['retain'];
					HomeWSN.Editor.addVariable(arrElem['variable']);
				}
				else {
					options['variable'] = '';
					options['value'] = '';
					options['retain'] = 0;
				}
				break;
			case rules.VARIABLE_SET.type:
				if (typeof arrElem !== 'undefined' && typeof conns !== 'undefined') {
					options['variable'] = arrElem['variable'];
					options['value'] = arrElem['value'];
					options['retain'] = arrElem['retain'];
					options['nextid'] = arrElem['nextid'];
					conns['nextid'] = arrElem['nextid'];
				}
				else {
					options['variable'] = '';
					options['value'] = '';
					options['retain'] = 0;
					options['nextid'] = 0;
				}
				jsPlumb.addEndpoint($block, targetEndpoint);
				jsPlumb.addEndpoint($block, sourceEndpoint);
				break;
			case rules.VARIABLE_INCREMENT.type:
			case rules.VARIABLE_DECREMENT.type:
				if (typeof arrElem !== 'undefined' && typeof conns !== 'undefined') {
					options['variable'] = arrElem['variable'];
					options['retain'] = arrElem['retain'];
					options['nextid'] = arrElem['nextid'];
					conns['nextid'] = arrElem['nextid'];
				}
				else {
					options['variable'] = '';
					options['retain'] = 0;
					options['nextid'] = 0;
				}
				jsPlumb.addEndpoint($block, targetEndpoint);
				jsPlumb.addEndpoint($block, sourceEndpoint);
				break;
			default:
				if (HomeWSN.Debugging === true)
					console.log('HomeWSN.Editor.Flowchart.createBlock: unrecognized block type');
				break;
		}

		var endpoints = jsPlumb.getEndpoints($block);
		if (endpoints != undefined) {
			for (var cnt = 0; cnt < endpoints.length; cnt++)
				$(endpoints[cnt].canvas).zIndex($block.zIndex());
		}
	};

	function getBlockOptions($elem) {
		return $elem.data('options');
	}

	function setBlockOptions($elem, values) {
		var options = $elem.data('options');
		if (options['type'] === rules.VARIABLE_INIT.type) {
			var name = options['variable'];
			var newname = values['variable'];
			if (name === '') {
				HomeWSN.Editor.addVariable(newname);
			}
			else if (name !== newname) {
				HomeWSN.Editor.renameVariable(name, newname);
				// rename all variables in the blocks
				$('.jsplumb-block').each(function() {
					var blockOptions = $(this).data('options');
					if (blockOptions['variable'] === name ||
						blockOptions['value-variable'] === name) {
						if (blockOptions['variable'] === name) {
							$.extend(blockOptions, {'variable': newname});
						}
						else {
							$.extend(blockOptions, {'value-variable': newname});
						}
						// automatically saved blockOptions in data
						// https://api.jquery.com/data/
//						$(this).data('options', blockOptions);
						showBlockOptions($(this), blockOptions);
					}
				});
			}
		}
		$.extend(options, values);
		// automatically saved options in data
		// https://api.jquery.com/data/
//		$elem.data('options', options);
		showBlockOptions($elem, options);
	}

	//-----------------------------------------------------------
	function showBlockOptions($elem, options) {
		var msg;

		if (HomeWSN.Debugging === true) {
			console.log('HomeWSN.Editor.Flowchart.showBlockOptions:');
			console.log(options);
		}

		switch (options['type']) {
			case rules.TRIGGER_CRON.type:
				msg = options['value'];
				break;
			case rules.TRIGGER_TOPIC.type:
				msg = options['topic'];
				break;
			case rules.CONDITION_TOPIC_VALUE.type:
				msg = options['topic'] + ' ' + options['condition'] + ' ' + options['value'] + ' ?';
				break;
			case rules.CONDITION_TOPIC_TOPIC.type:
				msg = options['topic'] + ' ' + options['condition'] + ' ' + options['value-topic'] + ' ?';
				break;
			case rules.CONDITION_TOPIC_VARIABLE.type:
				msg = options['topic'] + ' ' + options['condition'] + ' ' + options['value-variable'] + ' ?';
				break;
			case rules.CONDITION_VARIABLE_VALUE.type:
				msg = options['variable'] + ' ' + options['condition'] + ' ' + options['value'] + ' ?';
				break;
			case rules.CONDITION_VARIABLE_VARIABLE.type:
				msg = options['variable'] + ' ' + options['condition'] + ' ' + options['value-variable'] + ' ?';
				break;
			case rules.ACTION_VALUE.type:
				msg = options['topic'] + ' = ' + options['value'];
				break;
			case rules.ACTION_TOPIC.type:
				msg = options['topic'] + ' = ' + options['value-topic'];
				break;
			case rules.ACTION_VARIABLE.type:
				msg = options['topic'] + ' = ' + options['value-variable'];
				break;
			case rules.VARIABLE_INIT.type:
				msg = 'var ' + options['variable'] + ' = ' + options['value'];
				break;
			case rules.VARIABLE_SET.type:
				msg = options['variable'] + ' = ' + options['value'];
				break;
			case rules.VARIABLE_INCREMENT.type:
				msg = '++' + options['variable'];
				break;
			case rules.VARIABLE_DECREMENT.type:
				msg = '--' + options['variable'];
				break;
			default:
				console.log('HomeWSN.Editor.Flowchart.setBlockOptions :unrecognized rule');
				break;
		}
		$('.block-text-message', $elem).text(msg);
	};

	//-----------------------------------------------------------
	// remove all selections
	function removeAllSelections() {
		$.each(jsPlumb.getAllConnections(), function(idx, conn) {
			conn.setParameter('selected', false);
			conn.setType('default');
		});
		$('.jsplumb-block').each(function() {
			$(this).removeClass('jsplumb-block-selected');
		});
	};

	//-----------------------------------------------------------
	// set block selection
	function setBlockSelection($block) {
		removeAllSelections();
		$block.addClass('jsplumb-block-selected');
	};

	//-----------------------------------------------------------
	function removeBlocks(name) {
		$('.jsplumb-block-selected').each(function() {
			jsPlumb.remove($(this));
		});
		if (name !== null && typeof name === 'string') {
			HomeWSN.Editor.deleteVariable(name);
		}
	};

	//-----------------------------------------------------------
	// events
	$('#rect').mousedown(function(ev) {
		if (ev.target.id === 'rect')
			removeAllSelections();
	});

	$('html').keyup(function(ev) {
		if (input === false) {
			return;
		}
		if (ev.keyCode == 46) {
			var name = null;
			var confirm = false;
			// DEL key
			if ($('._jsPlumb_dragging').length > 0) {
				alert("Don't try to remove a connection while dragging");
				return;
			}
			// delete selected connection or block
			$.each(jsPlumb.getAllConnections(), function (idx, conn) {
				if (conn.getParameter('selected') === true) {
					setNextId(conn.sourceId, '0', conn.endpoints[0].getParameter('type'));
					jsPlumb.detach(conn);
					return false;
				}
			});
			$('.jsplumb-block-selected').each(function() {
				var selBlockOptions = $(this).data('options');
				if (selBlockOptions['type'] === rules.VARIABLE_INIT.type) {
					name = selBlockOptions['variable'];
					confirm = true;
					$('.jsplumb-block').each(function() {
						var blockOptions = $(this).data('options');
						if (blockOptions['variable'] === selBlockOptions['variable'] ||
							blockOptions['value-variable'] === selBlockOptions['variable']) {
							$(this).addClass('jsplumb-block-selected');
						}
					});
				}
			});
			if (confirm === true) {
				HomeWSN.Editor.Modal.showConfirmDeleteDialog(name);
			}
			else {
				removeBlocks(name);
			}
		}
	});

	//-----------------------------------------------------------
	$('#workspace').droppable({
		accept: '.storage-block',
		tolerance: 'fit',
		drop: function(ev, ui) {
			var off_x = ui.offset.left - $('#rect').offset().left;
			var off_y = ui.offset.top - $('#rect').offset().top;
			var randomLong = Math.floor(Math.random() * 4294967295); // 2^32

			var $block = ui.helper.clone()
				.removeAttr('class data-toggle data-original-title title data-content')
				.attr({
					id: randomLong + DIV_SUFFIX,
					class: 'jsplumb-block'
				})
				.css({
					position: 'absolute',
					left: off_x,
					top: off_y
				})
				.appendTo('#rect');

			jsPlumb.draggable($block, {
				containment: '#rect',
				cursor: 'move',
				distance: 0,
				start: function(ev, ui) {
					blockToTop($(this));
				}
			});

			var options = {};
			options['id'] = parseInt($block.attr('id'), 10); // remove DIV_SUFFIX and convert to number
			options['type'] = ui.draggable.attr('id');
			createBlock($block, options);
			setBlockSelection($block);
			$block.data('options', options);

			jsPlumb.repaint($block);
			HomeWSN.Editor.Modal.showOptionsDialog($block);

			$block.dblclick(function(ev) {
				HomeWSN.Editor.Modal.showOptionsDialog($(this));
			});

			$block.mousedown(function(ev) {
				setBlockSelection($(this));
			});
		}
	});


	//-----------------------------------------------------------
	// jsPlumb events
	jsPlumb.bind('beforeDrag', function(params) {
		if (HomeWSN.Debugging === true)
			console.log('HomeWSN.Editor.Flowchart: jsPlumb.beforeDrag event');
		var sourceId;
		if (params.endpoint.isSource === true)
			sourceId = params.sourceId;
		else {
			// lets assume (params.endpoint.isTarget === true) only because of my case
			if (params.endpoint.connections.length > 0)
				sourceId = params.endpoint.connections[0].sourceId;
		}
		return {sourceId: sourceId};
	});
	jsPlumb.bind('connectionDrag', function(conn) {
		if (HomeWSN.Debugging === true)
			console.log('HomeWSN.Editor.Flowchart: jsPlumb.connectionDrag event');
		var sourceId = conn.getData().sourceId;
		if (sourceId != undefined) {
			var endpoints = jsPlumb.getEndpoints(sourceId);
			for (var cnt = 0; cnt < endpoints.length; cnt++) {
				if (endpoints[cnt].isTarget === true) {
					$(endpoints[cnt].canvas).droppable('disable');
					break;
				}
			}
		}
		removeAllSelections();
		conn.setParameter('selected', true);
		conn.setType('selected');
	});
	jsPlumb.bind('connectionDragStop', function(conn, ev) {
		if (HomeWSN.Debugging === true)
			console.log('HomeWSN.Editor.Flowchart: jsPlumb.connectionDragStop event');
		if (conn.sourceId != null)
		{
			var endpoints = jsPlumb.getEndpoints(conn.sourceId);
			for (var cnt = 0; cnt < endpoints.length; cnt++) {
				if (endpoints[cnt].isTarget === true) {
					$(endpoints[cnt].canvas).droppable('enable');
					break;
				}
			}
			setNextId(conn.sourceId, conn.targetId, conn.endpoints[0].getParameter('type'));
		}
	});
	jsPlumb.bind('click', function(conn, ev) {
		removeAllSelections();
		conn.setParameter('selected', true);
		conn.setType('selected');
	});

	//-----------------------------------------------------------
	function setNextId(sourceId, targetId, type) {
		var next;

		switch (type) {
			case 'sourceEndpoint':
				next = 'nextid';
				break;
			case 'sourceTrueEndpoint':
				next = 'nextid-true';
				break;
			case 'sourceFalseEndpoint':
				next = 'nextid-false';
				break;
			default:
				console.log('HomeWSN.Editor.Flowchart.setNextId: unrecognized endpoint type');
				break;
		}

		if (next != undefined) {
			var nextId = parseInt(targetId, 10); // remove DIV_SUFFIX and convert to number
			var options = $('#' + sourceId).data('options');
			options[next] = nextId;
			// automatically saved options in data
			// https://api.jquery.com/data/
//			$('#' + sourceId).data('options', options);
		}
	}

	//-----------------------------------------------------------
	function blockToTop($block) {
		var maxIndex = 0;
		$('.jsplumb-block').each(function() {
			var zIndex = parseInt($(this).zIndex(), 10);
			maxIndex = Math.max(maxIndex, zIndex);
		});
		++maxIndex;
		$block.zIndex(maxIndex);
		var endpoints = jsPlumb.getEndpoints($block);
		if (endpoints != undefined) {
			for (var cnt = 0; cnt < endpoints.length; cnt++)
				$(endpoints[cnt].canvas).zIndex(maxIndex);
		}
	};

	//-----------------------------------------------------------
	// initialization
	function init() {
		jsPlumb.setContainer($('#rect'));
		jsPlumb.importDefaults({
			Connector: [ 'Flowchart', {
				stub: [12, 20],
				alwaysRespectStubs: true,
				gap: 8,
				cornerRadius: 5
			}],
			PaintStyle: {
				strokeStyle: '#2e6f9a',
				lineWidth: 2,
				joinstyle: 'round'
			},
			Endpoint: [ 'Dot', {
				radius: 8
			}],
			ConnectionOverlays: [
				[ 'Arrow', {
					width: 6,
					length: 14,
					location: 1,
					id: 'arrow'
				}]
			]
		});

		var selectedType = {
			paintStyle: { strokeStyle: '#d84444' },
		};
		jsPlumb.registerConnectionType('selected', selectedType);
	};

	//-----------------------------------------------------------
	// load rules
	function loadRules(strRules) {
		var objRules = JSON.parse(strRules);
		var version = objRules['version'];
		var arrBlocks = objRules['nodes'];

		jsPlumb.deleteEveryEndpoint();
		$(".jsplumb-block").remove();

		for (var cnt = 0; cnt < arrBlocks.length; cnt++) {

			var $div = $('<div/>').attr('class', 'block-text');
			$div.html('<span class="block-text-title"></span><br><span class="block-text-message"></span>');
			$('.block-text-title', $div).text(HomeWSN.Editor.RULES.getName(arrBlocks[cnt]['type']));
		
			var strStyle = 	'left: ' + arrBlocks[cnt]['left'] + ';' + 
							' top: ' + arrBlocks[cnt]['top'] + ';' + 
							' z-index: ' + arrBlocks[cnt]['z-index'] + ';';

			var $block = $('<div/>', {
				'id': arrBlocks[cnt]['id'] + DIV_SUFFIX, // add DIV_SUFFIX and convert to string
				'class': 'jsplumb-block',
				'style': strStyle
				})
				.append($div)
				.appendTo('#rect');
			
			var options = {};
			var conns = {};
			conns.id = arrBlocks[cnt]['id'];
			options['id'] = parseInt($block.attr('id'), 10); // remove DIV_SUFFIX and convert to number
			options['type'] = arrBlocks[cnt]['type'];

			createBlock($block, options, arrBlocks[cnt], conns);
			showBlockOptions($block, options);

			$block.data('options', options);
			$block.data('conns', conns);

			jsPlumb.draggable($block, {
				containment: '#rect',
				cursor: 'move',
				distance: 0,
				start: function(ev, ui) {
					blockToTop($(this));
				}
			});
		}

		$('.jsplumb-block').each(function() {
			var conns = $(this).data('conns');
			if (conns['nextid'] != undefined && conns['nextid'] != 0)
				connectBlocks(conns['id'], conns['nextid'], 'sourceEndpoint', 'targetEndpoint');
			if (conns['nextid-true'] != undefined && conns['nextid-true'] != 0)
				connectBlocks(conns['id'], conns['nextid-true'], 'sourceTrueEndpoint', 'targetEndpoint');
			if (conns['nextid-false'] != undefined && conns['nextid-false'] != 0)
				connectBlocks(conns['id'], conns['nextid-false'], 'sourceFalseEndpoint', 'targetEndpoint');
			$(this).removeData('conns');
		});

		jsPlumb.repaintEverything(true);

		function connectBlocks(id_source, id_target, type_source, type_target) {
			var ends_source = jsPlumb.getEndpoints(id_source + DIV_SUFFIX); // add DIV_SUFFIX and convert to string
			var ends_target = jsPlumb.getEndpoints(id_target + DIV_SUFFIX); // add DIV_SUFFIX and convert to string
			for (var cnt_source = 0; cnt_source < ends_source.length; cnt_source++) {
				var end_source = ends_source[cnt_source];
				if (end_source.getParameter('type') == type_source) {
					for (var cnt_target = 0; cnt_target < ends_target.length; cnt_target++) {
						var end_target = ends_target[cnt_target];
						if (end_target.getParameter('type') == type_target) {
							// add data additionally to restrict loopback links in jsPlumb.connectionDrag event
							jsPlumb.connect({source: end_source, target: end_target}, {data: {sourceId: id_source + DIV_SUFFIX}});
							break;
						}
					}
					break;
				}
			}
		}

		$('.jsplumb-block').dblclick(function(ev) {
			HomeWSN.Editor.Modal.showOptionsDialog($(this));
		});

		$('.jsplumb-block').mousedown(function(ev) {
			setBlockSelection($(this));
		});
	};


	//-----------------------------------------------------------
	// save rules
	function saveRules() {
		var arrBlocks = [];
		$('.jsplumb-block').each(function (idx, elem) {
			var blockOptions = {};
			$.extend(blockOptions, $(elem).data('options'));
			blockOptions['left'] = $(elem).css('left');
			blockOptions['top'] = $(elem).css('top');
			blockOptions['z-index'] = $(elem).css('z-index');
			arrBlocks.push(blockOptions);
		});
		var emptyRules = arrBlocks.length === 0 ? true : false;
		var objRules = {};
		objRules.nodes = arrBlocks;
		objRules.version = HomeWSN.Editor.RULES_VERSION;
		var strRules = JSON.stringify(objRules);
		return { strRules: strRules, emptyRules: emptyRules };
	};

	//-----------------------------------------------------------
	return {
		init: init,
		loadRules: loadRules,
		saveRules: saveRules,
		getBlockOptions: getBlockOptions,
		setBlockOptions: setBlockOptions,
		removeBlocks: removeBlocks,
		enableKeyboardInput: function() {
			input = true;
		},
		disableKeyboardInput: function() {
			input = false;
		}
	}; 
})();
