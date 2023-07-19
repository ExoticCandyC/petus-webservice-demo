/*
 * A 2nd layer for:
 *      TradingView Lightweight Charts™ v4.0.1
 */


/*
    time  = 0;
    value = generate_random_temp();
    test  = new ec_chart_t("test", '#ea456f', '#ea456f11', '#ea456fcc', 'rgb(60 70 84 / 82%)', 'white', 16);
*/

/*
    for(index = 0; index < 1000; index++)
    {
        test.addData(time, value);
        time += 600;
        value = generate_random_temp();
    }
*/
class ec_chart_t
{
    constructor(parentID, _lineColor, _chartColor, _crosshairHcolor, _crosshairVcolor, _textColor, _fontSize)
    {
        const chartOptions =
        {
            layout:
            {
                textColor: _textColor,
                fontSize: _fontSize,
                background: { color: 'transparent' },
            },
        };
        this.parent = document.getElementById(parentID);
        this.chart = LightweightCharts.createChart(this.parent, chartOptions);

        this.chart.applyOptions(
            {
                leftPriceScale:
                {
                    visible: true,
                    borderVisible: true,
                },
                rightPriceScale:
                {
                    visible: false,
                },
                timeScale:
                {
                    timeVisible: true,
                    /*secondsVisible: false,*/
                    borderVisible: true,
                },
                crosshair:
                {
                    horzLine:
                    {
                        visible: true,
                        style: 2,
                        width: 3,
                        color: _crosshairHcolor,
                        labelVisible: true,
                    },
                    vertLine:
                    {
                        visible: true,
                        style: 0,
                        width: 2,
                        color: _crosshairVcolor,
                        labelVisible: true,
                    },
                },
                grid:
                {
                    vertLines:
                    {
                        visible: false,
                    },
                    horzLines:
                    {
                        visible: false,
                    },
                },
            });
        this.dataSeries = this.chart.addAreaSeries({
            topColor: _chartColor,
            bottomColor: _chartColor,
            lineColor: _lineColor,
            lineWidth: 2,
            crossHairMarkerVisible: false,
            priceLineVisible: false,
            lastValueVisible: false,
        });
        this.dataSeries.priceScale().applyOptions({
            scaleMargins: {
                top: 0.3,
                bottom: 0.25,
            },
        });
        this.dataSeries.setData([]);
        this.dataCount = 0;
    }
    addDataNow(_value)
    {
        var _now = new Date();
        var _nowt = _now.getTime() / 1000;
        _nowt += _now.getTimezoneOffset() * -60;
        this.dataSeries.update({ time: _nowt, value: _value });
        this.dataCount++;
    }
    addData(_time, _value)
    {
        this.dataSeries.update({ time: _time, value: _value });
        this.dataCount++;
    }
    fitContent()
    {
        this.chart.timeScale().fitContent();
    }
    resize()
    {
        this.chart.resize(this.parent.offsetWidth, this.parent.offsetHeight);
    }
    setChartColor(_lineColor, _chartColor)
    {
        this.dataSeries.applyOptions(
            {
                topColor: _chartColor,
                bottomColor: _chartColor,
                lineColor: _lineColor
            });
    }
}

