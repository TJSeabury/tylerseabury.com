function HSLA( color = { h: 0, s: 100, l: 50, a: 1 } )
{
    if ( "string" === typeof color ) color = hslaStringToValues( color );

    let h = color.h;
    let s = color.s;
    let l = color.l;
    let a = color.a;

    function shiftTo( color, percentage )
    {
        let n = colorDifference( color );
        n.h *= percentage;
        n.s *= percentage;
        n.l *= percentage;
        return colorSum( n );
    }
    function colorSum( color )
    {
        return HSLA({
            h: h + color.h, 
            s: s + color.s, 
            l: l + color.l, 
            a: a + color.a,
        });
    }
    function colorDifference( color )
    {
        return HSLA({
            h: h >= color.h ? -1 * (h - color.h) : color.h - h, 
            s: s >= color.s ? -1 * (s - color.s) : color.s - s, 
            l: l >= color.l ? -1 * (l - color.l) : color.l - l, 
            a: a >= color.a ? -1 * (a - color.a) : color.a - a,
        });
    }
    function cssString()
    {
        return 'hsla('+h+','+s+'%,'+l+'%,'+a+')';
    }

    function opacity( o )
    {
        a = o;
        return HSLA({
            h: h, 
            s: s,
            l: l,
            a: a
        });
    }

    function hslaStringToValues( colorString )
    {
        if ( 'string' !== typeof colorString ) return console.error('colorString must be a string.');
        const regexUnits = /hsla?\(\s*(?:(-?\d+(?:deg|g?rad|turn)?),\s*((?:\d{1,2}|100)%),\s*((?:\d{1,2}|100)%)(?:,\s*((?:\d{1,2}|100)%|0(?:\.\d+)?|1))?|(-?\d+(?:deg|g?rad|turn)?)\s+((?:\d{1,2}|100)%)\s+((?:\d{1,2}|100)%)(?:\s+((?:\d{1,2}|100)%|0(?:\.\d+)?|1))?)\s*\)/gmi;
        const regex = /hsla?\(\s*(?:(-?\d+)(?:deg|g?rad|turn)?,\s*(\d{1,2}|100)%,\s*(\d{1,2}|100)%(?:,\s*((?:\d{1,2}|100)%|0(?:\.\d+)?|1))?|(-?\d+(?:deg|g?rad|turn)?)\s+((?:\d{1,2}|100)%)\s+((?:\d{1,2}|100)%)(?:\s+((?:\d{1,2}|100)%|0(?:\.\d+)?|1))?)\s*\)/gmi;
        let extract = regex.exec( colorString );
        return {
            h: extract[1] || 0,
            s: extract[2] || 100,
            l: extract[3] || 50,
            a: extract[4] || 1
        };
    }

    return {
        shiftTo: shiftTo,
        colorSum: colorSum,
        colorDifference: colorDifference,
        opacity: opacity,
        cssString: cssString
    };

};

module.exports = {
    HSLA: HSLA
};