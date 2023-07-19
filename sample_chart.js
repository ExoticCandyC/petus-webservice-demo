
var __random_temp = 20.0;

var charts_database = [];

function chart_resize(id)
{
    charts_database[id][0].resize(charts_database[id][1].offsetWidth, charts_database[id][1].offsetHeight);
}

function generate_random_temp()
{
    var step = (Math.random() * 2) - 1;
    if((__random_temp > 40 && step > 0) || (__random_temp < 0 && step < 0))
        step *= -1;
    __random_temp += step;
    return __random_temp;
}

function setUpExampleChart(id)
{
            // Lightweight Charts™ Example: Magnifier Tooltip
            // https://tradingview.github.io/lightweight-charts/tutorials/how_to/tooltips

            const chartOptions = {
                layout: {
                    textColor: 'gray',
                    fontSize: 16,
                    background: { type: 'solid', color: 'transparent' },
                },
            };
            // @type {import('lightweight-charts').IChartApi}
            const parent = document.getElementById(id);
            const chart = LightweightCharts.createChart(parent, chartOptions);

            charts_database[id] = [chart, parent];

            window.addEventListener('resize', () => {
                chart.resize(parent.offsetWidth, parent.offsetHeight); //window.innerHeight);
            });

            chart.applyOptions({
                leftPriceScale: {
                    visible: true,
                    borderVisible: true,
                },
                rightPriceScale: {
                    visible: false,
                },
                timeScale: {
                    timeVisible: true,
                    secondsVisible: false,
                    borderVisible: true,
                },
                crosshair: {
                    horzLine:
                    {
                        visible: true,
                        style: 2,
                        width: 3,
                        color: '#005EF3AA',
                        labelVisible: true,
                    },
                    vertLine: {
                        visible: true,
                        style: 0,
                        width: 2,
                        color: 'rgb(60 70 84 / 82%)',
                        labelVisible: true,
                    },
                },
                // hide the grid lines
                grid: {
                    vertLines: {
                        visible: false,
                    },
                    horzLines: {
                        visible: false,
                    },
                },
            });

            series = chart.addAreaSeries({
                topColor: '#005EF311',
                bottomColor: '#005EF311',
                lineColor: '#005EF3',
                lineWidth: 2,
                crossHairMarkerVisible: false,
                priceLineVisible: false,
                lastValueVisible: false,
            });
            series.priceScale().applyOptions({
                scaleMargins: {
                    top: 0.3, // leave some space for the legend
                    bottom: 0.25,
                },
            });

            var DateData    = new Date();
            DateData.setSeconds(0);
            DateData.setMinutes(Math.floor(DateData.getMinutes() / 10) * 10);
            var DateValue = DateData.getTime() / 1000;
            DateValue += DateData.getTimezoneOffset() * -60;
            var data_Series = [];
            var index;
            for(index = 0; index < 144; index++)
            {
                data_Series.unshift({ time: DateValue, value: generate_random_temp() });
                DateValue -= 600;
            }

            series.setData(data_Series);

            /*
            const container = document.getElementById(id);

            const toolTipWidth = 96;

            // Create and style the tooltip html element
            const toolTip = document.createElement('div');
            toolTip.style = `width: calc(${toolTipWidth} * var(--px)); height: 100%; position: absolute; display: none; padding: calc(8 * var(--px)); box-sizing: border-box; font-size: 12px; text-align: left; z-index: 1000; top: calc(12 * var(--px)); left: calc(12 * var(--px)); pointer-events: none; border-radius: calc(4 * var(--px)) calc(4 * var(--px)) calc(0 * var(--px)) calc(0 * var(--px)); border-bottom: none; box-shadow: 0 calc(2 * var(--px)) calc(5 * var(--px)) 0 rgba(117, 134, 150, 0.45);font-family: -apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;`;
            toolTip.style.background = `rgba(${'255, 255, 255'}, 0.10)`;
            toolTip.style.color = 'white';
            container.appendChild(toolTip);

            // update tooltip
            chart.subscribeCrosshairMove(param => {
                if (
                    param.point === undefined ||
                    !param.time ||
                    param.point.x < 0 ||
                    param.point.x > container.clientWidth ||
                    param.point.y < 0 ||
                    param.point.y > container.clientHeight
                ) {
                    toolTip.style.display = 'none';
                } else {
                    // time will be in the same format that we supplied to setData.
                    // thus it will be YYYY-MM-DD
                    const dateStr = param.time;
                    toolTip.style.display = 'block';
                    const data = param.seriesData.get(series);
                    const price = data.value !== undefined ? data.value : data.close;
                    toolTip.innerHTML = `<div style="color: #005EF3'}">Random Data</div><div style="font-size: 24px; margin: calc(4 * var(--px)) calc(0 * var(--px));">
                        ${Math.round(100 * price) / 100}
                        </div><div>
                        ${dateStr}
                        </div>`;

                    let left = param.point.x; // relative to timeScale
                    const timeScaleWidth = chart.timeScale().width();
                    const priceScaleWidth = chart.priceScale('left').width();
                    const halfTooltipWidth = toolTipWidth / 2;
                    left += priceScaleWidth - halfTooltipWidth;
                    left = Math.min(left, priceScaleWidth + timeScaleWidth - toolTipWidth);
                    left = Math.max(left, priceScaleWidth);

                    toolTip.style.left = 'calc(' + str(left)  + ' * var(--px))';
                    toolTip.style.top = 'calc(' + str(0) + ' * var(--px))';
                }
            });
            */

            chart.timeScale().fitContent();
}

function setUpExampleTempChart(id)
{
            // Lightweight Charts™ Example: Magnifier Tooltip
            // https://tradingview.github.io/lightweight-charts/tutorials/how_to/tooltips

            const chartOptions = {
                layout: {
                    textColor: 'gray',
                    fontSize: 16,
                    background: { color: 'transparent' },
                },
            };
            // @type {import('lightweight-charts').IChartApi}
            const parent = document.getElementById(id);
            const chart = LightweightCharts.createChart(parent, chartOptions);
            window.addEventListener('resize', () => {
                chart.resize(parent.offsetWidth, parent.offsetHeight); //window.innerHeight);
            });

            chart.applyOptions({
                leftPriceScale: {
                    visible: true,
                    borderVisible: true,
                },
                rightPriceScale: {
                    visible: false,
                },
                timeScale: {
                    timeVisible: true,
                    secondsVisible: false,
                    borderVisible: true,
                },
                crosshair: {
                    horzLine:
                    {
                        visible: true,
                        style: 2,
                        width: 3,
                        color: '#CC6600AA',
                        labelVisible: true,
                    },
                    vertLine: {
                        visible: true,
                        style: 0,
                        width: 2,
                        color: 'rgb(60 70 84 / 82%)',
                        labelVisible: true,
                    },
                },
                // hide the grid lines
                grid: {
                    vertLines: {
                        visible: false,
                    },
                    horzLines: {
                        visible: false,
                    },
                },
            });

            series = chart.addAreaSeries({
                topColor: '#FF990011',
                bottomColor: '#FF990011',
                lineColor: '#FF9900',
                lineWidth: 2,
                crossHairMarkerVisible: false,
                priceLineVisible: false,
                lastValueVisible: false,
            });
            series.priceScale().applyOptions({
                scaleMargins: {
                    top: 0.3, // leave some space for the legend
                    bottom: 0.25,
                },
            });

            var DateData    = new Date();
            DateData.setSeconds(0);
            DateData.setMinutes(Math.floor(DateData.getMinutes() / 10) * 10);
            var DateValue = DateData.getTime() / 1000;
            DateValue += DateData.getTimezoneOffset() * -60;
            var data_Series = [];
            var index;
            for(index = 0; index < 144; index++)
            {
                data_Series.unshift({ time: DateValue, value: generate_random_temp() });
                DateValue -= 600;
            }

            series.setData(data_Series);

            chart.timeScale().fitContent();
}
