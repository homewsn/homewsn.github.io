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

HomeWSN.Actuators = (function() {
	"use strict";

	var actuators;

	//-----------------------------------------------------------
	function init() {
		var chart = $('#chart').highcharts();
		if (chart !== undefined) {
			chart.destroy();
		}
		var options = HomeWSN.Content.getActuatorsOptions();
		$.getScript(options.url, function(script, textStatus, jqXHR) {
			actuators = JSON.parse(script);
			initActuatorsPage(options);
			HomeWSN.Content.mqttSubscribe();
		});
	};

	//-----------------------------------------------------------
	function initActuatorsPage(options) {
		var $actuators = $('#actuators').empty();
		var $row;
		var $col;

		$actuators.append(
			'<div class="page-header">' + 
				'<h4>' + options.name + '</h4>' +
			'</div>'
		);

		$row = $('<div/>').attr('class', 'row center-row');

		for (var cnt = 0; cnt < actuators.length; cnt++) {
			$col = $('<div/>').attr('class', 'col-xs-1 center-cell');
			if (actuators[cnt].icon_type === 'ImageFile') {
				// image file
				actuators[cnt].$cell = $('<div/>').attr('class', 'img-center-cell');
				actuators[cnt].$img = $('<img/>').attr('src', actuators[cnt].icon_url_na);
			}
			else {
				// what esle?
			}
			actuators[cnt].$cell.data('sn', cnt);
			actuators[cnt].$cell.append(actuators[cnt].$img);
			$col.append(actuators[cnt].$cell);

			actuators[cnt].$name = $('<p/>').attr('class', 'title-placeholder');
			if (options.type === '' && options.location !== '') {
				actuators[cnt].$name.text(actuators[cnt].type + ' ' + actuators[cnt].comment);
			}
			else if (options.type !== '' && options.location === '') {
				actuators[cnt].$name.text(actuators[cnt].location + ' ' + actuators[cnt].comment);
			}
			else {
				actuators[cnt].$name.text(actuators[cnt].location + ' ' + actuators[cnt].type + ' ' + actuators[cnt].comment);
			}
			$col.append(actuators[cnt].$name);

			if (actuators[cnt].icon_type === 'ImageFile') {
				// bootstrap-switch
				actuators[cnt].$input = $('<input>').attr({ type: 'checkbox', 'data-size': 'mini' });
				$col.append(actuators[cnt].$input);
				actuators[cnt].$input.bootstrapSwitch({ state: null, onColor: 'actuator' });
				actuators[cnt].$input.bootstrapSwitch('readonly', true);
				actuators[cnt].$input.bootstrapSwitch('indeterminate', true);
				actuators[cnt].$input.data('sn', cnt);
			}
			else {
				// what else?
			}

			$row.append($col);
		}
		$actuators.append($row);

		$('.bootstrap-switch').on('switchChange.bootstrapSwitch', function(event, state) {
			var sn = $(event.target).data('sn');
			actuators[sn].$input.bootstrapSwitch('readonly', true);
			actuators[sn].$input.bootstrapSwitch('indeterminate', true);
			var command = state ? '1' : '0';
			HomeWSN.Content.mqttPublish(actuators[sn].id, actuators[sn].param, command);
		});

		$('.img-center-cell').on('click', function(event, state) {
			var chart = $('#chart').highcharts();
			if (chart !== undefined) {
				chart.destroy();
			}
			newChart($(this).data('sn'));
		});
	};

	//-----------------------------------------------------------
	function mqttMessage(topic, payload) {
		if (actuators === undefined)
			return;
		var parts = topic.split('/');
		var main_topic = parts.shift();
		if (parts.length !== 0 && main_topic === 'actuators') {
			var id = parts.shift();
			if (parts.length === 0) {
				// what here? see sensors.js
			}
			else {
				var param = parts.shift();
				for (var cnt = 0; cnt < actuators.length; cnt++) {
					if (actuators[cnt].id == id && actuators[cnt].param == param) {
						actuators[cnt].status = 'online';
						if (parts.length === 0) {
							// param
							if (actuators[cnt].icon_type === 'ImageFile') {
								actuators[cnt].$input.bootstrapSwitch('readonly', false);
								actuators[cnt].$input.bootstrapSwitch('indeterminate', false);
								if (payload == '0') {
									actuators[cnt].$img.attr('src', actuators[cnt].icon_url_0);
									actuators[cnt].$input.bootstrapSwitch('state', false, 'false');
								}
								else if (payload == '1') {
									actuators[cnt].$img.attr('src', actuators[cnt].icon_url_1);
									actuators[cnt].$input.bootstrapSwitch('state', true, 'false');
								}
								break;
							}
							else {
								// what else?
							}
						}
					}
				}
			}
		}
	};

	//-----------------------------------------------------------
	function newChart(sn) {
		var url = HomeWSN.getWebServerUrl() + 'getchartdata.php?id=' + actuators[sn].id + '&param=' + actuators[sn].param + '&data_type=' + actuators[sn].data_type;
		var chart;

		$.getJSON(url, function(data) {
			chart = new Highcharts.StockChart({
				chart: {
					renderTo: 'chart',
					type: 'line',
					zoomType: 'x',
					style: {
						fontFamily: document.body.style.fontFamily
					}
				},
				navigator: {
					adaptToUpdatedData: false,
					series: {
						data: data
					}
				},
				scrollbar: {
					liveRedraw: false
				},
				title: {
					text: actuators[sn].location
				},
				subtitle: {
					text: actuators[sn].type
				},
				rangeSelector: {
					buttons: [{
						type: 'hour',
						count: 1,
						text: '1h'
					}, {
						type: 'day',
						count: 1,
						text: '1d'
					}, {
						type: 'week',
						count: 1,
						text: '1w'
					}, {
						type: 'month',
						count: 1,
						text: '1m'
					}, {
						type: 'year',
						count: 1,
						text: '1y'
					}, {
						type: 'all',
						text: 'All'
					}],
					selected : 5,			// all
					inputEnabled: false		// it supports only days
					},
				xAxis: {
					events: {
						afterSetExtremes: afterSetExtremes
					},
					minRange: 3600 * 1000 // one hour
				},
				series:	[{
					data: data,
					dataGrouping: {
						enabled: false
					}
				}]
			});
		});

		function afterSetExtremes(e) {
			chart.showLoading('Loading data from server...');
			$.getJSON(url + '&start=' + Math.round(e.min) + '&end=' + Math.round(e.max), function(data) {
				chart.series[0].setData(data);
				chart.hideLoading();
			});
		};
	};


	//-----------------------------------------------------------
	return {
		init: init,
		mqttMessage: mqttMessage
	};
})();
