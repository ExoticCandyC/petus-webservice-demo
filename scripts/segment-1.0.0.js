
/*var ec_segment_page;*/

ec_segment_page = "";

/* Update loop */
(function ec_segment_page_update()
{
    try{ ec_segment_page.update(); } catch(err) { };
    window.setTimeout(ec_segment_page_update, 5000);
})();

function string_array_to_num_array(array)
{
    var i;
    array = array.split(",");
    for(i = 0; i < array.length; i++)
        array[i] = Number(array[i]);
    return array;
}

class ec_segment_sensor_t
{
    constructor(parent, factor_id, unit, max)
    {
        this.parent = parent;
        this.factor_id = factor_id;
        this.parentElement = $("#seg-sens" + factor_id + "-div")[0];
        this.index  = this.parentElement.children.length;
        this.ID_prefix = "seg-sens" + factor_id + "-val" + this.index;
        //this.parentElement.innerHTML += "<details id=\"" + this.ID_prefix + "-box\" class=\"extended-details online\"><summary><div class=\"column-container\"><div class=\"column-container-side\"><div id=\"" + this.ID_prefix + "-gauge\" class=\"gauge-summary\"></div></div><div class=\"column-container-side\"><h3 id=\"" + this.ID_prefix + "\"></h3></div><div class=\"column-container-filler\"></div><div class=\"column-container-side\"><h2 id=\"seg-sens2-val1-stat\"></h2></div></div></summary><div class=\"folder\"><div class=\"seg-grid\"><div class=\"seg-map\"><div id=\"" + this.ID_prefix + "-map\"></div></div><div class=\"seg-chart\" id=\"" + this.ID_prefix + "-chart\"></div></div></div></details>";
        this.parentElement.innerHTML += "<details id=\"" + this.ID_prefix + "-box\" class=\"extended-details offline\"><summary><div class=\"column-container\"><div class=\"column-container-side\"><div id=\"" + this.ID_prefix + "-gauge\" class=\"gauge-summary\"></div></div><div class=\"column-container-side\"><h3 id=\"" + this.ID_prefix + "\"></h3></div><div class=\"column-container-filler\"></div><div class=\"column-container-side\"><h2 id=\"seg-sens2-val1-stat\"></h2></div></div></summary><div class=\"folder\"><div class=\"seg-grid\"><div class=\"seg-map\"><div id=\"" + this.ID_prefix + "-map\"></div></div><div class=\"seg-chart\" id=\"" + this.ID_prefix + "-chart\"></div></div></div></details>";
    }
    setupVisuals()
    {
        this.gauge = new Gauge
                        (
                            document.getElementById((this.ID_prefix + "-gauge")),
                            {
                                max: this.parent.sensMax[this.factor_id],
                                value: 0
                            }
                        );
        this.gauge.setID((this.ID_prefix + "-gauge"));
        this.gauge.setLabelID((this.ID_prefix));
        this.gauge.setPrefix(this.parent.sensUnit[this.factor_id]);
        this.gauge.setDecimalPoint(this.parent.sensRound[this.factor_id]);

        this.svg_map = new ec_svg_map(this.ID_prefix + "-map");
        this.svg_map.import(this.parent.map);

        this.chart = new ec_chart_t(this.ID_prefix + "-chart", "#FF9900", "#FF990011", "#CC6600AA", "rgb(60 70 84 / 82%)", "white", 16);

        this.svg_map.import_pin(this.parent.sensPins[this.factor_id], this.index);
    }
    isOnline()
    {
        return !document.getElementById(this.ID_prefix + "-box").classList.contains("offline");
    }
    markOffline()
    {
        try
        {
            document.getElementById(this.ID_prefix + "-box").classList.add("offline");
            document.getElementById(this.ID_prefix + "-box").classList.remove("online");
        } catch(err) { };
    }
    markOnline()
    {
        try
        {
            document.getElementById(this.ID_prefix + "-box").classList.add("online");
            document.getElementById(this.ID_prefix + "-box").classList.remove("offline");
        } catch(err) { };
    }
};

class ec_segment_page_t
{
    constructor(segment_id, map)
    {
        this._constructor(segment_id, map);
    }
    _constructor(segment_id, map)
    {
        this.segment_id = segment_id;
        /* This is just a testing value */
        $("#segName").html("Segment " + (segment_id + 1));
        var segment_data = (
            function ()
            {
                var json = null;
                $.ajax({
                    'async': false,
                    'global': false,
                    'url': ("/dynamic/segment" + segment_id + ".json"),
                    'dataType': "json",
                    'success': function (data) {
                        json = data;
                    }
                });
                return json;
            })();

        var key;

        /* v1 */
        /*
        this.map = null;
        this.map = map;

        this.sensGauge = null;
        this.sensGauge = [];
        this.sensors   = null;
        this.sensors   = [];
        this.sensUnit  = null;
        this.sensUnit  = [];
        this.sensRound = null;
        this.sensRound = [];
        this.sensMin   = null;
        this.sensMin   = [];
        this.sensMax   = null;
        this.sensMax   = [];
        this.sensPins  = null;
        this.sensPins  = [];
        */

        /* v2 */
        /*delete this.map;
        delete this.sensGauge;
        delete this.sensors;
        delete this.sensUnit;
        delete this.sensRound;
        delete this.sensMin;
        delete this.sensMax;
        delete this.sensPins;*/

        this.map = map;
        this.sensGauge = [];
        this.sensors   = [];
        this.sensUnit  = [];
        this.sensRound = [];
        this.sensMin   = [];
        this.sensMax   = [];
        this.sensPins  = [];

        this.cleanup_segment_page();
        var index;
        var index2;
        index = 0;
        for(key in segment_data['sens'])
            this.segment_add_new_factor(index++, key);

        index = 0;
        for(key in segment_data['sens'])
        {
            this.sensUnit[index]  = segment_data['sens'][key]['unit'];
            this.sensPins[index]  = segment_data['sens'][key]['pos'];
            this.sensRound[index] = Number(segment_data['sens'][key]['round']);
            this.sensMin[index]   = Number(segment_data['sens'][key]['min']);
            this.sensMax[index]   = Number(segment_data['sens'][key]['max']);
            this.segment_setup_factors(index++);
        }

        index = 0;
        for(key in segment_data['sens'])
        {
            for(index2 = 0; index2 < Number(segment_data['sens'][key]['count']); index2++)
                this.sensors[index][index2] = new ec_segment_sensor_t(this, index);
            index++;
        }

        index = 0;
        for(key in segment_data['sens'])
        {
            for(index2 = 0; index2 < Number(segment_data['sens'][key]['count']); index2++)
                this.sensors[index][index2].setupVisuals();
            index++;
        }

        this.update(segment_data);
    }
    update(data)
    {
        var segment_id = this.segment_id;
        if(typeof data === "undefined")
        {
            data = (
                function ()
                {
                    var json = null;
                    $.ajax({
                        'async': false,
                        'global': false,
                        'url': ("/dynamic/update_segment" + segment_id + ".json"),
                        'dataType': "json",
                        'success': function (_data) {
                            json = _data;
                        }
                    });
                    return json;
                })();
        }
        var index = 0;
        var index2 = 0;
        var index3 = 0;
        var key;
        var max = NaN;
        var min = NaN;
        var avg = 0;
        var avgCount = 0;
        var Time_Start = 0;
        var Time_Step  = 600; /* 10 minutes */
        var values;
        var status_array = "";
        for(key in data['sens'])
        {
            if(Time_Start === 0)
            {
                values = string_array_to_num_array(data['sens'][key]["0"]);
                var _now = new Date();
                /*_now.setSeconds(0);
                _now.setMinutes(Math.floor(_now.getMinutes() / 10) * 10);*/
                var _nowt = _now.getTime() / 1000;
                _nowt += _now.getTimezoneOffset() * -60;
                Time_Start = _nowt - (Time_Step * (values.length - 1));
            }

            status_array = data['sens'][key]["s"];

            avg = 0;
            avgCount = 0;
            for(index2 = 0; index2 < this.sensors[index].length; index2++)
            {
                values = string_array_to_num_array(data['sens'][key][String(index2)]);
                var value  = values[values.length - 1];
                this.sensors[index][index2].gauge.setValueAnimated(value, 0.5);

                for(index3 = 0; index3 < values.length; index3++)
                    this.sensors[index][index2].chart.addData((Time_Start + (Time_Step * index3)), values[index3]);

                if(status_array[index2] === "1")
                {
                    this.sensors[index][index2].markOnline();
                    avg += value;
                    avgCount++;
                    if(index2 == 0)
                    {
                        max = value;
                        min = value;
                    }
                    else
                    {
                        if(min < value)
                            min = value;
                        else if(max > value)
                            max = value;
                    }
                }
                else
                    this.sensors[index][index2].markOffline();
            }
            avg = avg / avgCount;
            this.segment_set_overal(index++, avg, min, max);
        }
        values = null;
        Time_Start= null;
        Time_Step = null;
        status_array = null;
    }
    cleanup_segment_page()
    {
        $("#segSens").html("");
    }
    segment_set_overal(factor_id, average, min, max)
    {
        var ID_prefix = "#seg-sens" + factor_id;
        this.sensGauge[factor_id].setValueAnimated(average, 0.5);
        min = Math.floor((min * this.sensRound[factor_id]) + 0.5) / this.sensRound[factor_id];
        max = Math.floor((max * this.sensRound[factor_id]) + 0.5) / this.sensRound[factor_id];
        $(ID_prefix + "-min").html(min + this.sensUnit[factor_id]);
        $(ID_prefix + "-max").html(max + this.sensUnit[factor_id]);
    }
    segment_setup_factors(factor_id)
    {
        var ID_prefix = "seg-sens" + factor_id;
        this.sensGauge[factor_id] = new Gauge
                        (
                            document.getElementById((ID_prefix + "-gauge")),
                            {
                                max: this.sensMax[factor_id],
                                value: 0
                            }
                        );
        this.sensGauge[factor_id].setID((ID_prefix + "-gauge"));
        this.sensGauge[factor_id].setLabelID((ID_prefix + "-avg"));
        this.sensGauge[factor_id].setPrefix(this.sensUnit[factor_id]);
        this.sensGauge[factor_id].setDecimalPoint(this.sensRound[factor_id]);
        this.segment_set_overal(factor_id, 0, 0, 0);
    }
    segment_add_new_factor(factor_id, name)
    {
        this.sensors[factor_id] = null;
        this.sensors[factor_id] = [];
        var factor_name  = "$LOCALIZE$" + name + "$";
        var parent = $("#segSens")[0];
        var ID_prefix = "seg-sens" + factor_id;
        parent.innerHTML += "<div id=\"" + ID_prefix + "\" class=\"details-container\"><details><summary><div class=\"column-container\"><div class=\"column-container-side\"><div id=\"" + ID_prefix + "-gauge\" class=\"gauge-summary\"></div></div><div class=\"column-container-side\"><h2 id=\"" + ID_prefix + "-name\">" + localization_replace(factor_name) + "</h2></div><div class=\"column-container-filler\"></div><div class=\"column-container-side\"><h3 class=\"seg-sens-summary\">" + localization_replace("$LOCALIZE$keyword_average$") + "</h3><h3 id=\"" + ID_prefix + "-avg\" class=\"seg-sens-summary\"></h3></div><div class=\"column-container-side\"><h3 class=\"seg-sens-summary\">" + localization_replace("$LOCALIZE$keyword_min$") + "</h3><h3 id=\"" + ID_prefix + "-min\" class=\"seg-sens-summary\"></h3></div><div class=\"column-container-side\"><h3 class=\"seg-sens-summary\">" + localization_replace("$LOCALIZE$keyword_max$") + "</h3><h3 id=\"" + ID_prefix + "-max\" class=\"seg-sens-summary\"></h3></div></div></summary><div class=\"folder\" id=\"" + ID_prefix + "-div\"></div></details></div>";
    }
    resize()
    {
        var index1 = 0;
        var index2 = 0;
        for(index1 = 0; index1 < this.sensors.length; index1++)
            for(index2 = 0; index2 < this.sensors[index1].length; index2++)
                this.sensors[index1][index2].chart.resize();
    }
}

window.addEventListener('resize', () =>{try{ec_segment_page.resize();} catch(err) { };});

/* This is just a testing value */
$(function()
{
    ec_segment_page = new ec_segment_page_t(0, "2t3f+E3f+E3f+E+C+E+C2U+C2U+C2U2S7X+C7X^77X^7jN^7jN^7jN+CT#+qT#&4T#&4*y&4*y&4*y+qka3rkaWhBD3fBDVUTb3rTbV*");
});
