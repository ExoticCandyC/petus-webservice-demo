
class ec_svg_map
{
    constructor(parentID, strokeWidth, strokeColor)
    {
        this.parentElement = document.getElementById(parentID);
        var temp = this.parentElement.childElementCount;
        this.parentElement.innerHTML += "<svg style=\"width: 100%; height: 100%; cursor: default;\"></svg>";
        this.svg = this.parentElement.children[temp];
        this.map = [];
        this.svg.addEventListener("mousedown", e => {this.mouseEvent(e)});
        this.svg.addEventListener("mouseup", e => {this.mouseEvent(e)});
        this.svg.addEventListener("mousemove", e => {this.mouseEvent(e)});
        this.svg.addEventListener("mouseleave", e => {this.mouseEvent(e)});
        this.svg.addEventListener("contextmenu", e => {this.mouseEvent(e)});
        this.drawing_enabled = false;
        this.isDrawing       = false;
        this.tempLine        = "none";

        this.pinpoint_enable = false;
        this.pinpoint_radius = "5%";
        this.pinpoint_cursor = "default";

        this.selectEvent     = NaN;

        if(typeof strokeWidth !== 'undefined')
            this.stroke_width = strokeWidth;
        else
            this.stroke_width = 3;
        if(typeof strokeColor !== 'undefined')
            this.color = strokeColor;
        else
            this.color = "#000";
        this.angleCorrectionValue = 5;
        this.minLength = 5;
    }
    enablePinpoint()
    {
        this.pinpoint_enable = true;
    }
    disablePinpoint()
    {
        this.pinpoint_enable = false;
    }
    highlightPinpoint(index, color)
    {
        for(var i = 0; i < this.svg.childElementCount; i++)
        {
            var child = this.svg.children[i];
            if(child.nodeName === "circle")
            {
                if(index === 0)
                {
                    child.style.fill = color;
                    return;
                }
                index--;
            }
        }
    }
    setPinpointColor(color)
    {
        for(var i = 0; i < this.svg.childElementCount; i++)
        {
            var child = this.svg.children[i];
            if(child.nodeName === "circle")
            {
                child.style.fill = color;
            }
        }
    }
    setPinpointCursor(cursor)
    {
        this.pinpoint_cursor = cursor;
        for(var i = 0; i < this.svg.childElementCount; i++)
        {
            var child = this.svg.children[i];
            if(child.nodeName === "circle")
            {
                child.style.cursor = cursor;
            }
        }
    }
    enableDrawing()
    {
        this.isDrawing = false;
        try
        {
            this.tempLine.remove();
            this.tempLine = "none";
        } catch(err) { };
        this.drawing_enabled = true;
        this.svg.style.cursor = "crosshair";
    }
    disableDrawing()
    {
        this.isDrawing = false;
        try
        {
            this.tempLine.remove();
            this.tempLine = "none";
        } catch(err) { };
        this.drawing_enabled = false;
        this.svg.style.cursor = "default";
    }
    clear()
    {
        this.isDrawing       = false;
        this.tempLine      = "none";
        this.svg.innerHTML = "";
    }
    clear_pins()
    {
        for(var index = (this.svg.childElementCount - 1); index > 0; index--)
        {
            var child = this.svg.children[index];
            if(child.nodeName === "circle")
                child.remove();
        }
    }
    toString()
    {
        return this.export();
    }
    export()
    {
        function encode(val)
        {
            const reference = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ~!@#^&*()_+-=";
            val = Math.floor(val * reference.length * reference.length);
            return reference[Math.floor(val / reference.length)] + reference[Math.floor(val % reference.length)];
        }

        var result = "";
        var width  = this.svg.getBoundingClientRect().width;
        var height = this.svg.getBoundingClientRect().height;
        for(var index = 0; index < this.svg.childElementCount; index++)
        {
            var child = this.svg.children[index];
            if(child.nodeName === "line")
            {
                result += encode(child.x1.baseVal.value / width);
                result += encode(child.y1.baseVal.value / height);
                result += encode(child.x2.baseVal.value / width);
                result += encode(child.y2.baseVal.value / height);
            }
        }
        return result;
    }
    export_pins()
    {
        function encode(val)
        {
            const reference = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ~!@#^&*()_+-=";
            val = Math.floor(val * reference.length * reference.length);
            return reference[Math.floor(val / reference.length)] + reference[Math.floor(val % reference.length)];
        }

        var result = "";
        var width  = this.svg.getBoundingClientRect().width;
        var height = this.svg.getBoundingClientRect().height;
        for(var index = 0; index < this.svg.childElementCount; index++)
        {
            var child = this.svg.children[index];
            if(child.nodeName === "circle")
            {
                result += encode(child.cx.baseVal.value / width);
                result += encode(child.cy.baseVal.value / height);
            }
        }
        return result;
    }
    drawLine(x1, y1, x2, y2)
    {
        this.svg.innerHTML += "<line x1=\"" + x1 + "\" y1=\"" + y1 + "\" x2=\"" + x2 + "\" y2=\" " + y2 + " \" stroke=\"" + this.color + "\" stroke-width=\"" + this.stroke_width + "\" />";
    }
    drawCircle(x, y)
    {
        var temp = this.svg.childElementCount;
        this.svg.innerHTML += "<circle cx=\"" + x + "\" cy=\"" + y + "\" r=\"" + this.pinpoint_radius + "\" />";
        this.svg.children[temp].style.cursor = this.pinpoint_cursor;
        for(var index = 0; index < this.svg.childElementCount; index++)
        {
            var child = this.svg.children[index];
            if(child.nodeName === "circle")
            {
                child.addEventListener("mousedown"  , e => {this.circleMouseEvent(e)});
                child.addEventListener("mouseup"    , e => {this.circleMouseEvent(e)});
                /*child.addEventListener("mousemove"  , e => {this.circleMouseEvent(e)});
                child.addEventListener("mouseleave" , e => {this.circleMouseEvent(e)});
                child.addEventListener("contextmenu", e => {this.circleMouseEvent(e)});*/
            }
        }
    }
    import(value)
    {
        this.clear();
        function decode(val)
        {
            const reference = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ~!@#^&*()_+-=";
            return (reference.indexOf(val[0]) * reference.length + reference.indexOf(val[1])) / Math.pow(reference.length, 2);
        }
        if(typeof value !== "string")
            return;
        if(value.length % 8 !== 0)
            return;
        var width  = this.svg.getBoundingClientRect().width;
        var height = this.svg.getBoundingClientRect().height;
        while(value.length > 0)
        {
            var x1 = decode(value) * width;
            value = value.slice(2);
            var y1 = decode(value) * height;
            value = value.slice(2);
            var x2 = decode(value) * width;
            value = value.slice(2);
            var y2 = decode(value) * height;
            value = value.slice(2);
            this.drawLine(x1, y1, x2, y2);
        }
    }
    import_pins(value)
    {
        this.clear_pins();
        function decode(val)
        {
            const reference = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ~!@#^&*()_+-=";
            return (reference.indexOf(val[0]) * reference.length + reference.indexOf(val[1])) / Math.pow(reference.length, 2);
        }
        if(typeof value !== "string")
            return;
        if(value.length % 4 !== 0)
            return;
        var width  = this.svg.getBoundingClientRect().width;
        var height = this.svg.getBoundingClientRect().height;
        while(value.length > 0)
        {
            var cx = decode(value) * width;
            value = value.slice(2);
            var cy = decode(value) * height;
            value = value.slice(2);
            this.drawCircle(cx, cy);
        }
    }
    import_pin(value, index)
    {
        index = index * 4;
        value = value.substring(index, (index + 4));
        this.import_pins(value);
    }
    __start_drawing(x, y)
    {
        this.isDrawing   = true;
        var temp = this.svg.childElementCount;
        this.drawLine(x, y, x, y);
        this.tempLine = this.svg.children[temp];
    }
    circleMouseEvent(event)
    {
        if(this.pinpoint_enable === false)
        {
            if(event.type === "mouseup")
            {
                var count = 0;
                for(var index = 0; index < this.svg.childElementCount; index++)
                {
                    var child = this.svg.children[index];
                    if(child.nodeName === "circle")
                    {
                        if(event.target === child)
                        {
                            if(typeof this.selectEvent === "function")
                                this.selectEvent(count);
                            return;
                        }
                        count++;
                    }
                }
            }
        }
    }
    mouseEvent(event)
    {
        if(event.type   === "mouseleave" ||
           event.type   === "mouseenter")
        {
            if(event.target !== this.svg)
                return;
        }
        event.preventDefault();
        var rect = this.svg.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;
        var R = 0;

        if(this.isDrawing === true)
        {
            /* angle correction */
            var X1 = this.tempLine.x1.baseVal.value;
            var Y1 = this.tempLine.y1.baseVal.value;
            var X2 = x;
            var Y2 = y;
            var DX = X2 - X1;
            var DY = Y2 - Y1;
                R  = Math.sqrt((DX * DX) + (DY * DY));
            var theta = Math.acos(DX / R);
            if(DY < 0)
                theta *= -1;
            theta = (theta / Math.PI) * 180;
            var theta2 = Math.floor((theta / this.angleCorrectionValue) + 0.5) * this.angleCorrectionValue;
            theta2 = (theta2 / 180) * Math.PI;
            DX = R * Math.cos(theta2);
            DY = R * Math.sin(theta2);
            x = Math.floor(X1 + DX);
            y = Math.floor(Y1 + DY);
        }

        if(event.type   === "mouseleave"  ||
           event.type   === "mouseenter"  ||
           event.type   === "contextmenu" ||
           event.button === 2)
        {
            this.isDrawing = false;
            if(this.tempLine !== "none")
            {
                try
                {
                    this.tempLine.remove();
                    this.tempLine = "none";
                } catch(err) { };
            }
        }
        else if(event.type === "mouseup")
        {
            if(this.drawing_enabled === true)
            {
                if(this.isDrawing === true && R < this.minLength)
                {
                    this.isDrawing = false;
                    try
                    {
                        this.tempLine.remove();
                        this.tempLine = "none";
                    } catch(err) { };
                }
                else
                    this.__start_drawing(x, y);
            }
            else if(this.pinpoint_enable === true)
            {
                this.drawCircle(x, y);
            }
        }
        else if(event.type === "mousemove")
        {
            if(this.isDrawing === true)
            {
                try
                {
                    this.tempLine.x2.baseVal.value = x;
                    this.tempLine.y2.baseVal.value = y;
                } catch(err) { };
            }
        }
    }
}




