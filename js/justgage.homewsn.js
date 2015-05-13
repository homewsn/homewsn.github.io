/**
 * JustGage - a handy JavaScript plugin for generating and animating nice & clean dashboard gauges.
 * Copyright (c) 2012 Bojan Djuricic - pindjur(at)gmail(dot)com | http://www.madcog.com
 * Licensed under MIT.
 * Date: 31/07/2012
 * @author Bojan Djuricic  (@Toorshia)
 * @version 1.0
 *
 * http://www.justgage.com
 */
//------------------------------------------
//- Modified by Vladimir Alemasov (c) 2013 - 2015

//------------------------------------------
//- JustGage - base "class" -

JustGage = function()
{
};

JustGage.prototype.config = function(config)
{ 
  if (!config.id) {alert("Missing id parameter for gauge!"); return false;}
  if (!document.getElementById(config.id)) {alert("No element with id: \""+config.id+"\" found!"); return false;}

  // configurable parameters
  this.config = 
  {
    // id : string 
    // this is container element id
    id : config.id,

    // value : int
    // value gauge is showing 
    value : (config.value) ? config.value : 0,

    // valueFontColor : string
    // color of label showing current value
    valueFontColor : (config.valueFontColor) ? config.valueFontColor : "#010101",

    // showValue : bool
    // hide or display gauge value
    showValue : (config.showValue != null) ? config.showValue : true,

    // min : int
    // min value
    min : (config.min) ? config.min : 0,

    // max : int
    // max value
    max : (config.max) ? config.max : 100,

    // showMinMax : bool
    // hide or display min and max values
    showMinMax : (config.showMinMax != null) ? config.showMinMax : true,

    // gaugeWidthScale : float
    // width of the gauge element
    gaugeWidthScale : (config.gaugeWidthScale) ? config.gaugeWidthScale : 1.0,

    // gaugeColor : string
    // background color of gauge element 
    gaugeColor : (config.gaugeColor) ? config.gaugeColor : "#edebeb",

    // label : string
    // text to show below value
    label : (config.label) ? config.label : "",

    // showLabel : bool
    // hide or display label
    showLabel : (config.showLabel != null) ? config.showLabel : true,

    // levelColors : string[]
    // colors of indicator, from lower to upper, in RGB format 
    levelColors : (config.levelColors) ? config.levelColors : percentColors,

    // levelColorsGradient : bool
    // whether to use gradual color change for value, or sector-based
    levelColorsGradient : (config.levelColorsGradient != null) ? config.levelColorsGradient : true,

    // labelFontColor : string
    // color of label showing label under value
    labelFontColor : (config.labelFontColor) ? config.labelFontColor : "#b3b3b3",

    // startAnimationTime : int
    // length of initial animation 
    startAnimationTime : (config.startAnimationTime) ? config.startAnimationTime : 700,

    // startAnimationType : string
    // type of initial animation (linear, >, <,  <>, bounce) 
    startAnimationType : (config.startAnimationType) ? config.startAnimationType : ">",

    // refreshAnimationTime : int
    // length of refresh animation 
    refreshAnimationTime : (config.refreshAnimationTime) ? config.refreshAnimationTime : 700,

    // refreshAnimationType : string
    // type of refresh animation (linear, >, <,  <>, bounce) 
    refreshAnimationType : (config.refreshAnimationType) ? config.refreshAnimationType : ">"
  };

  // overflow values
  if (config.value > this.config.max) this.config.value = this.config.max;
  if (config.value < this.config.min) this.config.value = this.config.min;
  this.originalValue = config.value;

  // canvas
  this.canvas = Raphael(this.config.id, "100%", "100%");

  // widget dimensions
  this.width = document.getElementById(this.config.id).clientWidth;
  this.height = document.getElementById(this.config.id).clientHeight;

  // widget path function
  this.canvas.customAttributes.pki = this.pki;
};

JustGage.prototype.show = function()
{
  // gauge
  this.gauge = this.canvas.path().attr({
    "stroke": "none",
    "fill": this.config.gaugeColor,   
    pki: [this.config.max, this.config.min, this.config.max, this.params.widgetW, this.params.widgetH, this.config.gaugeWidthScale]
  });
  this.gauge.id = this.config.id+"-gauge";

  // level
  this.level = this.canvas.path().attr({
    "stroke": "none",
    "fill": getColorForPercentage((this.config.value - this.config.min) / (this.config.max - this.config.min), this.config.levelColors, this.config.levelColorsGradient),
    pki: [this.config.min, this.config.min, this.config.max, this.params.widgetW, this.params.widgetH, this.config.gaugeWidthScale]
  });
  this.level.id = this.config.id+"-level";

  // value
  this.txtValue = this.canvas.text(this.params.valueX, this.params.valueY, this.originalValue);
  this.txtValue. attr({
    "font-size":this.params.valueFontSize,
    "font-weight":"bold",
    "font-family":"Arial",
    "fill":this.config.valueFontColor,
    "fill-opacity": (this.config.showValue == true) ? "1" : "0"
  });
  this.txtValue.id = this.config.id+"-txtvalue";

  // label
// for debug only  
// this.txtLabel = this.canvas.text(this.params.labelX, this.params.labelY, this.params.widgetH+' '+this.params.widgetW);
  this.txtLabel = this.canvas.text(this.params.labelX, this.params.labelY, this.config.label);
  this.txtLabel. attr({
    "font-size":this.params.labelFontSize,
    "font-weight":"normal",
    "font-family":"Arial",
    "fill":this.config.labelFontColor,   
    "fill-opacity": (this.config.showLabel == true) ? "1" : "0"
  });
  this.txtLabel.id = this.config.id+"-txtlabel";

  // min
  this.txtMin = this.canvas.text(this.params.minX, this.params.minY, this.config.min);
  this.txtMin. attr({
    "font-size":this.params.minFontSize,
    "font-weight":"normal",
    "font-family":"Arial",
    "fill":this.config.labelFontColor,   
    "fill-opacity": (this.config.showMinMax == true) ? "1" : "0"
  });
  this.txtMin.id = this.config.id+"-txtmin";

  // max
  this.txtMax = this.canvas.text(this.params.maxX, this.params.maxY, this.config.max);
  this.txtMax. attr({
    "font-size":this.params.maxFontSize,
    "font-weight":"normal",
    "font-family":"Arial",
    "fill":this.config.labelFontColor,   
    "fill-opacity": (this.config.showMinMax == true) ? "1" : "0"
  });
  this.txtMax.id = this.config.id+"-txtmax";

//  var defs = this.canvas.canvas.childNodes[1];
//  var svg = "http://www.w3.org/2000/svg";

  // animate 
  this.level.animate({pki: [this.config.value, this.config.min, this.config.max, this.params.widgetW, this.params.widgetH, this.config.gaugeWidthScale]},  this.config.startAnimationTime, this.config.startAnimationType);
};

// refresh gauge level
JustGage.prototype.refresh = function(value)
{
  var color;
  if (value != null)
  {
    this.originalValue = value;

    // overflow values
    if (value > this.config.max) value = this.config.max;
    if (value < this.config.min) value = this.config.min;

    color = getColorForPercentage((value - this.config.min) / (this.config.max - this.config.min), this.config.levelColors, this.config.levelColorsGradient);
    this.canvas.getById(this.config.id+"-txtvalue").attr({"text":this.originalValue});
  }
  else
  {
    this.canvas.getById(this.config.id+"-txtvalue").attr({"text":""});
  }
  this.canvas.getById(this.config.id+"-level").animate({pki: [value, this.config.min, this.config.max, this.params.widgetW, this.params.widgetH, this.config.gaugeWidthScale], "fill":color},  this.config.refreshAnimationTime, this.config.refreshAnimationType);
};

// refresh text label separately
JustGage.prototype.refreshOriginalValue = function()
{
  this.canvas.getById(this.config.id+"-txtvalue").attr({"text":this.originalValue});
};

var percentColors =
[
  "#a9d70b",
  "#f9c802",
  "#ff0000"
];

var getColorForPercentage = function(pct, col, grad)
{
    var no = col.length;
    if (no === 1) return col[0];
    var inc = (grad) ? (1 / (no - 1)) : (1 / no);
    var colors = new Array();
    for (var i = 0; i < col.length; i++) {
      var percentage = (grad) ? (inc * i) : (inc * (i + 1));
      var rval = parseInt((cutHex(col[i])).substring(0,2),16);
      var gval = parseInt((cutHex(col[i])).substring(2,4),16);
      var bval = parseInt((cutHex(col[i])).substring(4,6),16);
      colors[i] = { pct: percentage, color: { r: rval, g: gval, b: bval  } };
    }

    if(pct == 0) return 'rgb(' + [colors[0].color.r, colors[0].color.g, colors[0].color.b].join(',') + ')';
      for (var i = 0; i < colors.length; i++) {
          if (pct <= colors[i].pct) {
            if (grad == true) {
              var lower = colors[i - 1];
              var upper = colors[i];
              var range = upper.pct - lower.pct;
              var rangePct = (pct - lower.pct) / range;
              var pctLower = 1 - rangePct;
              var pctUpper = rangePct;
              var color = {
                  r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
                  g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
                  b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
              };
              return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
            } else {
              return 'rgb(' + [colors[i].color.r, colors[i].color.g, colors[i].color.b].join(',') + ')'; 
            }
          }
      }
};

function cutHex(str)
{
  return (str.charAt(0)=="#") ? str.substring(1,7) : str;
};



//------------------------------------------
//- CircularGauge - circular gauge "class" -

CircularGauge = function(config)
{
  JustGage.prototype.config.call(this, config);

  // widget dimensions
  var widgetW = this.width;
  var widgetH = this.height;

  // value 
  var valueFontSize = 16;
  var valueX = widgetW / 2;
  var valueY = widgetH / 1.4;

  // label 
  var labelFontSize = 10;
  var labelX = widgetW / 2;
  var labelY = valueY + valueFontSize / 2 + 6;

  // min 
  var minFontSize = 10;
  var minX = (widgetW / 10) + (widgetW / 7 * this.config.gaugeWidthScale) / 2;
  var minY = widgetH / 1.13;

  // max 
  var maxFontSize = 10;
  var maxX = widgetW - (widgetW / 10) - (widgetW / 7 * this.config.gaugeWidthScale) / 2;
  var maxY = minY;

  // parameters
  this.params =
  {
    widgetW : widgetW,
    widgetH : widgetH,
    valueFontSize : valueFontSize,
    valueX : valueX,
    valueY : valueY,
    labelFontSize : labelFontSize,
    labelX : labelX,
    labelY : labelY,
    minFontSize : minFontSize,
    minX : minX,
    minY : minY,
    maxFontSize : maxFontSize,
    maxX : maxX,
    maxY : maxY
  };

  JustGage.prototype.show.call(this);
};

CircularGauge.prototype = new JustGage();

CircularGauge.prototype.pki = function(value, min, max, w, h, gws)
{
  var alpha = (1 - (value - min) / (max - min)) * Math.PI;
  var Sin = Math.sin(alpha);
  var Cos = Math.cos(alpha);
  var Cro = w / 2 - w / 10;
  var Cri = Cro - w / 7 * gws;
  var Cx = w / 2;
  var Cy = h / 1.25;

  var path = "M" + Cx + "," + Cy + " ";
  path += "m-" + (Cro) + ",0 ";
  path += "a" + Cro + "," + Cro + " 0 0,1 " + (Cro + Cro * Cos) + ",-" + (Cro * Sin) + " ";
  path += "l" + ((Cri - Cro) * Cos) + "," + ((Cro - Cri) * Sin) + " ";
  path += "a" + Cri + "," + Cri + " 0 0,0 -" + (Cri + Cri * Cos) + "," + (Cri * Sin) + " ";
  path += "Z";

  return { path: path };
};



//--------------------------------------------------
//- LinearGauge - linear temperature gauge "class" -

LinearGauge = function(config)
{
  JustGage.prototype.config.call(this, config);

  // widget dimensions
  var widgetW = this.width;
  var widgetH = this.height;

  ////////////
  var Cx = widgetW / 2;
  var Cr = widgetW / 10 * this.config.gaugeWidthScale;
  var Cy = widgetH - Cr;
  var Rw = widgetW / 10 * this.config.gaugeWidthScale;
  var Rh = widgetH - 2 * Cr - widgetH / 5;
  var Ch = Math.sqrt(Math.pow(Cr, 2) - Math.pow(Rw / 2, 2));

  // min 
  var minFontSize = 10;
  var minX = Cx - Cr - minFontSize;
  var minY = widgetH - 2 * Cr;

  // max 
  var maxFontSize = 10;
  var maxX = Cx - Cr - maxFontSize;
  var maxY = minY - Rh + maxFontSize / 2;

  // label
  var labelFontSize = 10;
  var labelX = Cx - Cr - labelFontSize;
  var labelY = minY - Rh / 2 + labelFontSize / 2;

  // value
  var valueFontSize = 16;
  var valueX = Cx + Cr + valueFontSize;
  var valueY = minY - Rh / 2 + labelFontSize / 2;


  // parameters
  this.params =
  {
    widgetW : widgetW,
    widgetH : widgetH,
    valueFontSize : valueFontSize,
    valueX : valueX,
    valueY : valueY,
    labelFontSize : labelFontSize,
    labelX : labelX,
    labelY : labelY,
    minFontSize : minFontSize,
    minX : minX,
    minY : minY,
    maxFontSize : maxFontSize,
    maxX : maxX,
    maxY : maxY
  };

  JustGage.prototype.show.call(this);
};

LinearGauge.prototype = new JustGage();

LinearGauge.prototype.pki = function(value, min, max, w, h, gws)
{
  var Cx = w / 2;
  var Cr = w / 10 * gws;
  var Cy = h - Cr;
  var Rw = w / 10 * gws;
  var Rh = ((value - min) / (max - min)) * (h - 2 * Cr - h / 5);
  var Ch = Math.sqrt(Math.pow(Cr, 2) - Math.pow(Rw / 2, 2));

  var path = "M" + Cx + "," + Cy + " ";
  path += "m-" + (Rw / 2) + ",-" + Ch + " ";
  path += "a" + Cr + "," + Cr + " 0 1,0 " + Rw + ",0 ";
  path += "v-" + Rh + " ";
  path += "h-" + Rw + " ";
  path += "Z";

  return { path: path };
};
