
var gauge_list = {};

function setUpExampleGauge(id, labelID, prefix, decimalPoint)
{
    var gauge3 = new Gauge
    (
        document.getElementById(id),
        {
            max: 100,
            value: 50
        }
    );
    gauge_list[id] = gauge3;
    /*gauge_list["segment1-temp"].setPrefix("ºC")*/

    gauge3.setID(id);
    gauge3.setLabelID(labelID);

    if(id.endsWith("-moisture") || id.endsWith("-humidity"))
    {
        gauge3.setPrefix("%");
        gauge3.setColor("blue");
    }

    if(typeof prefix !== 'undefined')
        gauge3.setPrefix(prefix);

    if(typeof decimalPoint !== 'undefined')
        gauge3.setDecimalPoint(decimalPoint);

(function loop() {
  var value1 = Math.random() * 100,
      value2 = Math.random(),
      value3 = Math.random() * 100,
      value4 = Math.random() * 100,
      value5 = Math.random() * 200;
    if(!id.endsWith("-moisture") && !id.endsWith("-humidity"))
    {
        if(value3 < 33.33)
            gauge3.setColor("green");
        else if(value3 < 66.66)
            gauge3.setColor("orange");
        else
            gauge3.setColor("red");
    }
  gauge3.setValueAnimated(value3, 1.5);
  window.setTimeout(loop, 4000);
})();
}
