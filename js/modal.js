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

HomeWSN.Editor.Modal = (function() {
	"use strict";

	var rules = HomeWSN.Editor.RULES;

	$.fn.editable.defaults.mode = 'inline';

	//-----------------------------------------------------------
	function showOptionsDialog($elem) {
		var numInputs;
		var firstAuto;
		var prevVariable;
		var options = HomeWSN.Editor.Flowchart.getBlockOptions($elem);

		HomeWSN.Editor.Flowchart.disableKeyboardInput();
		$('body').append(
			'<div id="block-modal" class="modal">' +
				'<div class="modal-dialog">' +
					'<div class="modal-content">' +
						'<div class="modal-header">' +
							'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
							'<h4 class="modal-title"></h4>' +
						'</div>' +
						'<div class="modal-body">' +
							'<div id="block-modal-message" class="alert alert-danger"></div>' +
							'<table class="table table-striped" style="clear: both">' +
								'<tbody>' +
									'<tr id="block-modal-tr1" class="block-modal-tr">' +
										'<td width="20%" id="block-modal-label1"></td>' +
										'<td width="80%"><a href="#" id="block-modal-edit1" class="block-modal-edit"></a></td>' +
									'</tr>' +
									'<tr id="block-modal-tr2" class="block-modal-tr">' +
										'<td width="20%" id="block-modal-label2"></td>' +
										'<td width="80%"><a href="#" id="block-modal-edit2" class="block-modal-edit"></a></td>' +
									'</tr>' +
									'<tr id="block-modal-tr3" class="block-modal-tr">' +
										'<td width="20%" id="block-modal-label3"></td>' +
										'<td width="80%"><a href="#" id="block-modal-edit3" class="block-modal-edit"></a></td>' +
									'</tr>' +
								'</tbody>' +
							'</table>' +
							'<div id="block-modal-cron" class="alert alert-info"></div>' +
						'</div>' +
						'<div class="modal-footer">' +
							'<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
							'<button id="block-modal-save" type="button" class="btn btn-primary">Save changes</button>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>'
		);

		if (HomeWSN.Debugging === true) {
			console.log('HomeWSN.Editor.Modal.showDialog:');
			console.log(options);
		}

		$('#block-modal .block-modal-tr').hide();
		$('#block-modal #block-modal-message').hide();
		$('#block-modal #block-modal-cron').hide();

		switch (options['type']) {
			case rules.TRIGGER_CRON.type:
				numInputs = 1;
				setEditable(1, 'cron', options['value'], true);
				firstAuto = options['value'] ? false : true;
				break;
			case rules.TRIGGER_TOPIC.type:
				numInputs = 1;
				setEditable(1, 'topic', options['topic'], true);
				firstAuto = options['topic'] ? false : true;
				break;
			case rules.CONDITION_TOPIC_VALUE.type:
				numInputs = 3;
				setEditable(1, 'topic', options['topic']);
				setEditable(2, 'condition', options['condition']);
				setEditable(3, 'value', options['value'], true);
				firstAuto = options['topic'] ? false : true;
				break;
			case rules.CONDITION_TOPIC_TOPIC.type:
				numInputs = 3;
				setEditable(1, 'topic', options['topic']);
				setEditable(2, 'condition', options['condition']);
				setEditable(3, 'value-topic', options['value-topic'], true);
				firstAuto = options['topic'] ? false : true;
				break;
			case rules.CONDITION_TOPIC_VARIABLE.type:
				numInputs = 3;
				setEditable(1, 'topic', options['topic']);
				setEditable(2, 'condition', options['condition']);
				setEditable(3, 'value-variable', options['value-variable'], true);
				firstAuto = options['topic'] ? false : true;
				break;
			case rules.CONDITION_VARIABLE_VALUE.type:
				numInputs = 3;
				setEditable(1, 'variable', options['variable']);
				setEditable(2, 'condition', options['condition']);
				setEditable(3, 'value', options['value'], true);
				firstAuto = options['variable'] ? false : true;
				break;
			case rules.CONDITION_VARIABLE_VARIABLE.type:
				numInputs = 3;
				setEditable(1, 'variable', options['variable']);
				setEditable(2, 'condition', options['condition']);
				setEditable(3, 'value-variable', options['value-variable'], true);
				firstAuto = options['variable'] ? false : true;
				break;
			case rules.ACTION_VALUE.type:
				numInputs = 2;
				setEditable(1, 'topic', options['topic']);
				setEditable(2, 'value', options['value'], true);
				firstAuto = options['topic'] ? false : true;
				break;
			case rules.ACTION_TOPIC.type:
				numInputs = 2;
				setEditable(1, 'topic', options['topic']);
				setEditable(2, 'value-topic', options['value-topic'], true);
				firstAuto = options['topic'] ? false : true;
				break;
			case rules.ACTION_VARIABLE.type:
				numInputs = 2;
				setEditable(1, 'topic', options['topic']);
				setEditable(2, 'value-variable', options['value-variable'], true);
				firstAuto = options['topic'] ? false : true;
				break;
			case rules.VARIABLE_INIT.type:
				numInputs = 2;
				setEditable(1, 'variable-init', options['variable']);
				prevVariable = options['variable'];
				setEditable(2, 'value', options['value'], true);
				firstAuto = options['variable'] ? false : true;
				break;
			case rules.VARIABLE_SET.type:
				numInputs = 2;
				setEditable(1, 'variable', options['variable']);
				setEditable(2, 'value', options['value'], true);
				firstAuto = options['variable'] ? false : true;
				break;
			case rules.VARIABLE_INCREMENT.type:
			case rules.VARIABLE_DECREMENT.type:
				numInputs = 1;
				setEditable(1, 'variable', options['variable'], true);
				firstAuto = options['variable'] ? false : true;
				break;
			default:
				if (HomeWSN.Debugging === true)
					console.log('HomeWSN.Editor.Modal.showDialog: unrecognized rule');
				break;
		}

		$('#block-modal .modal-title').text(rules.getTitle(options['type']));
		$('#block-modal').modal('show');

		if (firstAuto) {
			// add event handler
			$('#block-modal .block-modal-edit').on('save.new', showNextEditable);
			// open first editable
			setTimeout(function() {
				$('#block-modal #block-modal-edit1').editable('show');
			}, 200);
		}
		
		function showNextEditable() {
			var $next = $(this).closest('tr').next().find('.block-modal-edit');
			setTimeout(function() {
				$next.editable('show');
			}, 200);
		};

		function setEditable(num, type, value, last) {
			$('#block-modal #block-modal-tr' + num).show();
			var $label = $('#block-modal #block-modal-label' + num);
			var $edit = $('#block-modal #block-modal-edit' + num);

			switch (type) {
				case 'cron':
					$label.text('Cron:');
					$edit.editable({
						type: 'text',
						name: 'value',
						success: success,
						validate: validateCron
					});
					if (value.length > 0)
						parseCron(value);
					break;
				case 'variable-init':
					$label.text('Variable:');
					$edit.editable({
						type: 'text',
						name: 'variable',
						success: success,
						validate: validateVariable
					});
					break;
				case 'value':
					$label.text('Value:');
					$edit.editable({
						type: 'text',
						name: 'value',
						success: success,
						validate: validate
					});
					break;
				case 'topic':
				case 'value-topic':
					$label.text('Topic:');
					$edit.editable({
						type: 'selectize',
						emptytext: 'empty',
						source: HomeWSN.Editor.sourceTopics,
						inputclass: 'selectize-control-topic',
						name: type,
						success: success,
						validate: validate,
						selectize: {
							create: true,
							persist: false,
							onOptionAdd: function(value, data) {
								data.optgroup = '1';
								data.desc = '';
							},
							render: {
								option: function(item, escape) {
									return '<div><span class="selectize-topic-header">' +
											escape(item.desc) +
											'</span><span class="selectize-topic">' +
											escape(item.text) +
											'</span></div>';
								}
							}
						}
					});
					break;
				case 'condition':
					$label.text('Condition:');
					$edit.editable({
						type: 'selectize',
						emptytext: 'empty',
						source: HomeWSN.Editor.sourceConditions,
						inputclass: 'selectize-control-condition',
						name: 'condition',
						success: success,
						validate: validate,
						selectize: {
							create: false,
							persist: false,
							render: {
								option: function(item, escape) {
									return '<div><span class="selectize-topic-header">' +
									escape(item.desc) +
									'</span><span class="selectize-topic">' +
									escape(item.text) +
									'</span></div>';
								}
							}
						}
					});
					break;
				case 'variable':
				case 'value-variable':
					$label.text('Variable:');
					$edit.editable({
						type: 'selectize',
						emptytext: 'empty',
						source: HomeWSN.Editor.sourceVariables,
						inputclass: 'selectize-control-variable',
						name: type,
						success: success,
						validate: validate,
						selectize: {
							create: false,
							persist: false
						}
					});
					break;
				default:
					if (HomeWSN.Debugging === true)
						console.log('Editor.Modal.setEditable: unrecognized type');
					break;
			}
			$edit.editable('setValue', value);

			function success(response, newValue) {
				if (last === true)
					$('#block-modal .block-modal-edit').off('save.new');
			};

			function validateCron(value) {
				$('#block-modal #block-modal-message').hide();
// WARNING !!!!
// ADDITIONAL CHECK FOR 4 SPACES IS NEEDED!!!!
				if ($.trim(value) === '')
					return $label.text() + ' Required field!';
				parseCron(value);
			};

			function validateVariable(value) {
				$('#block-modal #block-modal-message').hide();
				var val = $.trim(value);
				if (val === '')
					return $label.text() + ' Required field!';
				if (val !== prevVariable) {
					// variable name has been changed
					if (HomeWSN.Editor.isVariable(val) === true) {
						// new name is already exists
						return $label.text() + ' Already initialized!';
					}
				}
			};

			function validate(value) {
				$('#block-modal #block-modal-message').hide();
				if ($.trim(value) === '')
					return $label.text() + ' Required field!';
			};
		};

		function parseCron(cron) {
// WARNING !!!!
// WRONG TIME IN STRING '*/15 5 * * *'
			var shedule = prettyCron.toString(cron);
			var next = prettyCron.getNext(cron);
			$('#block-modal #block-modal-cron').html('<strong>Shedule: </strong>' + shedule + '<br><strong>Next: </strong>' + next).show();
		};

		$('#block-modal #block-modal-save').click(function() {
			var $elems = $();
			for (var cnt = 1; cnt < numInputs + 1; cnt++) {
				$elems = $elems.add($('#block-modal #block-modal-edit' + cnt));
			}
			// run validation for all values
			var errors = $elems.editable('validate');
			if ($.isEmptyObject(errors)) {
				// get all values
				var values = $elems.editable('getValue');
				HomeWSN.Editor.Flowchart.setBlockOptions($elem /*$block*/, values);
				$('#block-modal').modal('hide');
			}
			else {
				var msg = '';
				$.each(errors, function(k, v) { msg += v + "<br>"; });
				$('#block-modal #block-modal-message').html(msg).show();
			}
		});

		$('#block-modal').on('hidden.bs.modal', function() {
			// remove event handler
			$('#block-modal .block-modal-edit').off('save.new');
			// remove editable-unsaved (Bold font)
			$("#block-modal .block-modal-edit").removeClass('editable-unsaved');
			// remove style attribute on the DOM (possible style='display: none;' issue)
			$("#block-modal .block-modal-edit").removeAttr('style');
			// destroy editables
			$('#block-modal .block-modal-edit').editable('destroy');
//			http://stackoverflow.com/questions/13177426/how-to-destroy-bootstrap-modal-window-completely
//			$(this).data('bs.modal', null);
			$('#block-modal').remove();
			HomeWSN.Editor.Flowchart.enableKeyboardInput();
		});
	};


	//-----------------------------------------------------------
	function showConfirmDeleteDialog(name) {
		HomeWSN.Editor.Flowchart.disableKeyboardInput();
		$('body').append(
			'<div id="confirm-delete" class="modal">' +
				'<div class="modal-dialog">' +
					'<div class="modal-content">' +
						'<div class="modal-header">' +
							'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
							'<h4 class="modal-title">Confirm Delete</h4>' +
						'</div>' +
						'<div class="modal-body">' +
							'<p>You are about to delete the <strong><span class="variable-to-delete"></span></strong> variable initialization rule.</p>' +
							'<p>Deleting the initialization rule will automatically remove all rules, where the <strong><span class="variable-to-delete"></span></strong> variable is used!</p>' +
							'<p>Are you sure you want to proceed?</p>' +
						'</div>' +
						'<div class="modal-footer">' +
							'<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>' +
							'<button id="confirm-delete-delete" class="btn btn-danger btn-ok">Delete</button>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>'
		);
		$('#confirm-delete .variable-to-delete').text(name);
		$('#confirm-delete').modal('show');

		$('#confirm-delete #confirm-delete-delete').click(function() {
			HomeWSN.Editor.Flowchart.removeBlocks(name);
			$('#confirm-delete').modal('hide');
		});

		$('#confirm-delete').on('hidden.bs.modal', function () {
			$('#confirm-delete').remove();
			HomeWSN.Editor.Flowchart.enableKeyboardInput();
		});
	};


	//-----------------------------------------------------------
	function showConfirmDeployDialog(strRules) {
		HomeWSN.Editor.Flowchart.disableKeyboardInput();
		$('body').append(
			'<div id="confirm-deploy" class="modal">' +
				'<div class="modal-dialog">' +
					'<div class="modal-content">' +
						'<div class="modal-header">' +
							'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
							'<h4 class="modal-title">Confirm Deploy</h4>' +
						'</div>' +
						'<div class="modal-body">' +
							'<p>You are about to deploy nothing rules to the rules engine.</p>' +
							'<p>Are you sure you want to proceed?</p>' +
						'</div>' +
						'<div class="modal-footer">' +
							'<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>' +
							'<button id="confirm-deploy-deploy" class="btn btn-danger btn-ok">Deploy</button>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>'
		);
		$('#confirm-deploy').modal('show');

		$('#confirm-deploy #confirm-deploy-deploy').click(function() {
			HomeWSN.Mqtt.publish(HomeWSN.Content.RULESENGINETOPIC, strRules, true);
			$('#confirm-deploy').modal('hide');
		});

		$('#confirm-deploy').on('hidden.bs.modal', function () {
			$('#confirm-deploy').remove();
			HomeWSN.Editor.Flowchart.enableKeyboardInput();
		});
	};


	//-----------------------------------------------------------
	function showConfirmLoadDialog() {
		HomeWSN.Editor.Flowchart.disableKeyboardInput();
		$('body').append(
			'<div id="confirm-load" class="modal">' +
				'<div class="modal-dialog">' +
					'<div class="modal-content">' +
						'<div class="modal-header">' +
							'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
							'<h4 class="modal-title">Confirm Load</h4>' +
						'</div>' +
						'<div class="modal-body">' +
							'<p>You are about to load rules from the rules engine.</p>' +
							'<p>Loading the rules from the rules engine will automatically remove all your rules in the rules editor!</p>' +
							'<p>Are you sure you want to proceed?</p>' +
						'</div>' +
						'<div class="modal-footer">' +
							'<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>' +
							'<button id="confirm-load-load" class="btn btn-danger btn-ok">Load</button>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>'
		);
		$('#confirm-load').modal('show');

		$('#confirm-load #confirm-load-load').click(function() {
			HomeWSN.Mqtt.subscribe(HomeWSN.Content.RULESENGINETOPIC, {qos: 1});
			$('#confirm-load').modal('hide');
		});

		$('#confirm-load').on('hidden.bs.modal', function () {
			$('#confirm-load').remove();
			HomeWSN.Editor.Flowchart.enableKeyboardInput();
		});
	};


	//-----------------------------------------------------------
	function showExportDialog(strRules) {
		HomeWSN.Editor.Flowchart.disableKeyboardInput();
		$('body').append(
			'<div id="rules-export" class="modal">' +
				'<div class="modal-dialog">' +
					'<div class="modal-content">' +
						'<div class="modal-header">' +
							'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
							'<h4 class="modal-title">Export rules to the clipboard</h4>' +
						'</div>' +
						'<div class="modal-body">' +
							'<p>Select the text below (Ctrl-A) and copy to the clipboard (Ctrl-C):</p>' +
							'<textarea readonly wrap="soft" class="form-control" rows="10">' + strRules + '</textarea>' +
						'</div>' +
						'<div class="modal-footer">' +
							'<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>' +
							'<button id="rules-export-ok" type="button" class="btn btn-primary">OK</button>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>'
		);
		$('#rules-export').modal('show');
		$('.form-control').focus();

		$('#rules-export #rules-export-ok').click(function() {
			$('#rules-export').modal('hide');
		});

		$('#rules-export').on('hidden.bs.modal', function () {
			$('#rules-export').remove();
			HomeWSN.Editor.Flowchart.enableKeyboardInput();
		});
	};


	//-----------------------------------------------------------
	function showImportDialog() {
		HomeWSN.Editor.Flowchart.disableKeyboardInput();
		$('body').append(
			'<div id="rules-import" class="modal">' +
				'<div class="modal-dialog">' +
					'<div class="modal-content">' +
						'<div class="modal-header">' +
							'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
							'<h4 class="modal-title">Import rules from the clipboard</h4>' +
						'</div>' +
						'<div class="modal-body">' +
							'<p>Paste the rules text below (Ctrl-V) and push the OK button:</p>' +
							'<textarea wrap="soft" class="form-control" rows="10"></textarea>' +
						'</div>' +
						'<div class="modal-footer">' +
							'<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>' +
							'<button id="rules-import-ok" type="button" class="btn btn-primary">OK</button>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>'
		);
		$('#rules-import').modal('show');
		$('.form-control').focus();

		$('#rules-import #rules-import-ok').click(function() {
			HomeWSN.Editor.Flowchart.loadRules($('.form-control').val());
			$('#rules-import').modal('hide');
		});

		$('#rules-import').on('hidden.bs.modal', function () {
			$('#rules-import').remove();
			HomeWSN.Editor.Flowchart.enableKeyboardInput();
		});
	};


	//-----------------------------------------------------------
	return {
		showOptionsDialog: showOptionsDialog,
		showConfirmDeleteDialog: showConfirmDeleteDialog,
		showConfirmDeployDialog: showConfirmDeployDialog,
		showConfirmLoadDialog: showConfirmLoadDialog,
		showExportDialog: showExportDialog,
		showImportDialog: showImportDialog
	}; 
})();
