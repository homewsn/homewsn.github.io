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

(function ($) {
	"use strict";

	var Constructor = function (options) {
		this.init('selectize', options, Constructor.defaults);

		options.selectize = options.selectize || {};

		if ($.isFunction(options.selectize.options)) {
			var source = options.selectize.options.call();
			options.selectize.options = source;
		}

		if (!options.selectize.options && !options.selectize.optgroups && options.source) {
			var source = options.source;
			if ($.isFunction(options.source))
				source = options.source.call();
			// check format and convert x-editable format to selectize format (if needed)
			var result = this.convertSource(source, options.selectize.create);
			options.selectize.options = result.options;
			options.selectize.optgroups = result.optgroups;
			if (options.selectize.optgroups.length > 0) {
				options.selectize.optgroupField = 'optgroup';
				if (!options.selectize.sortField)
					options.selectize.sortField = 'optgroup';
			}
			if (!$.isFunction(options.selectize.onOptionAdd) && options.selectize.create === true) {
				options.selectize.onOptionAdd = function(value, data) {
					data.optgroup = '1';
				}
			}
		}
	};

	$.fn.editableutils.inherit(Constructor, $.fn.editabletypes.abstractinput);

	$.extend(Constructor.prototype, {
		render: function() {
			this.setClass();
			if (this.options.inputclass)
				this.$input.attr('class', this.options.inputclass)
			this.$input.selectize(this.options.selectize);
			this.$input[0].selectize.focus();
	   },

		value2html: function(value, element) {
			var text = '', data,
			   that = this;
			text = value;
			Constructor.superclass.value2html.call(this, text, element);
		},

		html2value: function(html) {
			return this.str2value(html);
		},

		value2input: function(value) {
			this.$input[0].selectize.addOption({value: value, text: value});
			this.$input[0].selectize.setValue(value);
		},

		input2value: function() {
			var value = this.$input[0].selectize.getValue();
			return value;
		},

		str2value: function(str, separator) {
			return str;
		},
		convertSource: function(source, create) {
			var optgroups = [];
			var optgroups_cnt = 1;
			var options = [];

			if ($.isArray(source) && source.length && source[0].text !== undefined) {
				if (source[0].children !== undefined) {
					// option groups
					if (create === true) {
						optgroups.push({id: optgroups_cnt, value: optgroups_cnt, label: ''});
						optgroups_cnt++;
					}
					for (var cnt = 0; cnt < source.length; cnt++) {
						if (source[cnt].children !== undefined && source[cnt].text !== undefined) {
							optgroups.push({id: optgroups_cnt, value: optgroups_cnt, label: source[cnt].text});
							for (var idx = 0; idx < source[cnt].children.length; ++idx)
								source[cnt].children[idx].optgroup = optgroups_cnt;
							options = options.concat(source[cnt].children);
							optgroups_cnt++;
						}
					}
				}
				else
					options = source;
			}
			return {optgroups: optgroups, options: options};
		},

		destroy: function() {
			if (typeof this.$input !== 'undefined' && typeof this.$input[0].selectize !== 'undefined')
				this.$input[0].selectize.destroy();
		}
	});

	Constructor.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
		/**
		@property tpl
		@default <select>
		**/
		tpl:'<select>',
		/**
		Configuration of selectize. [Full list of options](http://brianreavis.github.io/selectize.js/).

		@property selectize
		@type object
		@default null
		**/
		selectize: null,
		/**
		Source data for select. It will be assigned to selectize `options` property and kept here just for convenience.

		@property source
		@type array|string|function
		@default null
		**/
		source: null,
	});

	$.fn.editabletypes.selectize = Constructor;

}(window.jQuery));
