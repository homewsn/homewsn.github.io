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

HomeWSN.Sensors = (function() {
	"use strict";

	var sensors;

	//-----------------------------------------------------------
	function init() {
		var chart = $('#chart').highcharts();
		if (chart !== undefined) {
			chart.destroy();
		}
		var options = HomeWSN.Content.getSensorsOptions();
		$.getScript(options.url, function(script, textStatus, jqXHR) {
			sensors = JSON.parse(script);
			initSensorsPage(options);
			HomeWSN.Content.mqttSubscribe();
		});
	};

	//-----------------------------------------------------------
	function initSensorsPage(options) {
		var $sensors = $('#sensors').empty();
		var $row;
		var $col;
	
		$sensors.append(
			'<div class="page-header">' + 
				'<h4>' + options.name + '</h4>' +
			'</div>'
		);

		$row = $('<div/>').attr('class', 'row center-row');

		for (var cnt = 0; cnt < sensors.length; cnt++) {
			$col = $('<div/>').attr('class', 'col-xs-1 center-cell');
			if (sensors[cnt].icon_type === 'ImageFile') {
				// image file
				sensors[cnt].$cell = $('<div/>').attr('class', 'img-center-cell');
				sensors[cnt].$img = $('<img/>').attr('src', sensors[cnt].icon_url_na);
			}
			else if (sensors[cnt].icon_type === 'CircularGauge' || sensors[cnt].icon_type === 'LinearGauge') {
				sensors[cnt].$cell = $('<div/>').attr('class', 'gauge-center-cell');
				sensors[cnt].$img = $('<div/>').attr({ class: 'gauge-placeholder', id: 'gauge' + cnt });
			}
			sensors[cnt].$cell.data('sn', cnt);
			sensors[cnt].$cell.append(sensors[cnt].$img);
			$col.append(sensors[cnt].$cell);

			sensors[cnt].$name = $('<p/>').attr('class', 'title-placeholder');
			if (options.type === '' && options.location !== '') {
				sensors[cnt].$name.text(sensors[cnt].type + ' ' + sensors[cnt].comment);
			}
			else if (options.type !== '' && options.location === '') {
				sensors[cnt].$name.text(sensors[cnt].location + ' ' + sensors[cnt].comment);
			}
			else {
				sensors[cnt].$name.text(sensors[cnt].location + ' ' + sensors[cnt].type + ' ' + sensors[cnt].comment);
			}
			$col.append(sensors[cnt].$name);

			sensors[cnt].$message = $('<p/>').attr('class', 'title-placeholder').text('undefined');
			$col.append(sensors[cnt].$message);

			$row.append($col);
		}
		$sensors.append($row);

		initGauges();

		$('.img-center-cell, .gauge-center-cell').on('click', function(event, state) {
			var chart = $('#chart').highcharts();
			if (chart !== undefined) {
				chart.destroy();
			}
			newChart($(this).data('sn'));
		});
	};

	function initGauges() {
		for (var cnt = 0; cnt < sensors.length; cnt++) {
			if (sensors[cnt].icon_type === 'CircularGauge') {
				sensors[cnt].gauge = new CircularGauge({
					id: sensors[cnt].$img.attr('id'),
					value: 0,
					min: parseInt(sensors[cnt].value_0),
					max: parseInt(sensors[cnt].value_1),
					title: ' ',
					gaugeWidthScale: 1.0,
					levelColors: ['#FF4C05', '#F6FF05', '#69FF05', '#05F6FF'],
					label: sensors[cnt].unit,
				});
				sensors[cnt].gauge.refresh(null);
			}
			else if (sensors[cnt].icon_type === 'LinearGauge') {
				sensors[cnt].gauge = new LinearGauge({
					id: sensors[cnt].$img.attr('id'),
					value: 0,
					min: parseInt(sensors[cnt].value_0),
					max: parseInt(sensors[cnt].value_1),
					title: ' ',
					gaugeWidthScale: 1.0,
					levelColors: ['#05F6FF', '#05F6FF', '#69FF05', '#FCFF05', '#FCFF05', '#FF4C05'],
					label: sensors[cnt].unit,
				});
				sensors[cnt].gauge.refresh(null);
			}
		}
	};

	//-----------------------------------------------------------
	function mqttMessage(topic, payload) {
		if (sensors === undefined)
			return;
		var parts = topic.split('/');
		var main_topic = parts.shift();
		if (parts.length !== 0 && main_topic === 'sensors') {
			var id = parts.shift();
			if (parts.length === 0) {
				for (var cnt = 0; cnt < sensors.length; cnt++) {
					if (sensors[cnt].id == id) {
						// online / offline
						if (sensors[cnt].icon_type === 'ImageFile') {
							if (payload === 'offline') {
								sensors[cnt].$img.attr('src', sensors[cnt].icon_url_na);
								sensors[cnt].$message.text(payload);
								sensors[cnt].status = 'offline';
							}
						}
						else if (sensors[cnt].icon_type === 'CircularGauge' || sensors[cnt].icon_type === 'LinearGauge') {
							if (payload === 'offline') {
								sensors[cnt].gauge.refresh(null);
								sensors[cnt].$message.text(payload);
								sensors[cnt].status = 'offline';
							}
						}
					}
				}
			}
			else {
				var param = parts.shift();
				for (var cnt = 0; cnt < sensors.length; cnt++) {
					if (sensors[cnt].id == id && sensors[cnt].param == param) {
						sensors[cnt].status = 'online';
						if (parts.length === 0) {
							// param
							if (sensors[cnt].icon_type === 'ImageFile') {
								if (payload == '0') {
									sensors[cnt].$img.attr('src', sensors[cnt].icon_url_0);
									sensors[cnt].$message.text(sensors[cnt].value_0);
								}
								else if (payload == '1') {
									sensors[cnt].$img.attr('src', sensors[cnt].icon_url_1);
									sensors[cnt].$message.text(sensors[cnt].value_1);
								}
								break;
							}
							else if (sensors[cnt].icon_type === 'CircularGauge' || sensors[cnt].icon_type === 'LinearGauge') {
								sensors[cnt].$message.text(payload + ' ' + sensors[cnt].unit);
								sensors[cnt].gauge.refresh(payload);
								break;
							}
						}
					}
				}
			}
		}
	};

	//-----------------------------------------------------------
	function newChart(sn) {
		var url = HomeWSN.getWebServerUrl() + 'getchartdata.php?id=' + sensors[sn].id + '&param=' + sensors[sn].param + '&data_type=' + sensors[sn].data_type;
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
					text: sensors[sn].location
				},
				subtitle: {
					text: sensors[sn].type
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
