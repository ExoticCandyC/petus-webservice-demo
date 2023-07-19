
/*
 * Simply just put $LOCALIZE$__JSON_ID__$ as the text you want to be replaced.
 * the module will replace the token with value of __JSON_ID__ from the
 * appropriate JSON file.
 */

/*
 * for (var key in localization_table)
 * {
 *     console.log(key + ":" + localization_table[key]);
 * }
 */

var localization_choice     = "EN_US";
var localization_hash       = "";
var localization_table      = {};
var localization_hash_table = {};

function localization_load_locale(symbol)
{
    console.log("Loading localization for " + symbol);

    localization_choice = symbol;
    localization_hash   = localization_hash_table[symbol];
    localization_table  = (
        function ()
        {
            var json = null;
            $.ajax({
                'async': false,
                'global': false,
                'url': ("https://exoticcandyc.github.io/petus-webservice-demo/localization/" + localization_choice + ".json"),
                'dataType': "json",
                'success': function (data) {
                    json = data;
                }
            });
            return json;
        })();

    localStorage.setItem("localize_choice", localization_choice);
    localStorage.setItem("localize_hash"  , localization_hash  );
    localStorage.setItem("localize_table" , JSON.stringify(localization_table));
}

function localization_init()
{
    localization_hash_table = (
        function ()
        {
            var json = null;
            $.ajax({
                'async': false,
                'global': false,
                'url': ("https://exoticcandyc.github.io/petus-webservice-demo/localization/table.json"),
                'dataType': "json",
                'success': function (data) {
                    json = data;
                }
            });
            return json;
        })();

    localization_choice = localStorage.getItem("localize_choice");
    localization_hash   = localStorage.getItem("localize_hash"  );
    localization_table  = localStorage.getItem("localize_table" );
    if(!localization_choice || !localization_hash || !localization_table)
    {
        console.log("localization key doesn't exist.");
        localization_load_locale("EN_US");
    }
    else if(localization_hash_table[localization_choice] !== localization_hash)
    {
        console.log("Hash mismatch, loading the values again.");
        localization_load_locale(localization_choice);
    }
    else
    {
        console.log("Localization loaded from local storage.");
        localization_table = JSON.parse(localization_table);
    }
}

function localization_replace(value)
{
    value = $.trim((value + ""));
    if(value.startsWith("$LOCALIZE$") && value.endsWith("$"))
    {
        if((value.match(/\$/g) || []).length === 3)
        {
            value = value.replace("$LOCALIZE$", "").replace("$", "");
            if(localization_table[value])
                return localization_table[value];
        }
    }
    return "$LOCALIZE_FAIL$";
}

function localization_perform()
{
    $("*").each(function( index )
    {
        temp = localization_replace($( this ).html());
        if(temp !== "$LOCALIZE_FAIL$")
            $( this ).html(temp);

        temp = localization_replace($( this ).attr('placeholder'));
        if(temp !== "$LOCALIZE_FAIL$")
            $( this ).attr('placeholder', temp);

        temp = localization_replace($( this ).val());
        if(temp !== "$LOCALIZE_FAIL$")
            $( this ).val(temp);
    });
}

$(function()
{
    localization_init();
    localization_perform();
});
