/* 
* see: https://en.wikipedia.org/wiki/Alpha_compositing
*/
export function alphaComposite ( c1, a1, c2, a2 ) {
    let a = 1 - ( 1 - a2 ) * ( 1 - a1 );
    return c2 * a2 / a + c1 * a1 * ( 1 - a2 ) / a;
}

export function rgba ( r, g, b, a = 1 ) {
    return {
        red: r,
        green: g,
        blue: b,
        alpha: a,
        blend: function colorComposite ( c ) {
            let red = alphaComposite( this.red, this.alpha, c.red, c.alpha );
            let green = alphaComposite( this.green, this.alpha, c.green, c.alpha );
            let blue = alphaComposite( this.blue, this.alpha, c.blue, c.alpha );
            return rgba( red, green, blue );
        },
        saturation: function saturation ( s ) {
            let c = RGBAToHSLA( this.red, this.green, this.blue, this.alpha );
            c.saturation = s;
            return HSLAToRGBA( c.hue, c.saturation, c.lightness, c.alpha );
        },
        brightness: function brightness ( b ) {
            let c = RGBAToHSLA( this.red, this.green, this.blue, this.alpha );
            c.lightness = b;
            return HSLAToRGBA( c.hue, c.saturation, c.lightness, c.alpha );
        },
        toString: function toString () {
            return 'rgba(' + this.red + ',' + this.green + ',' + this.blue + ',' + this.alpha + ')';
        }
    };
}

export function hsla ( h, s, l, a = 1 ) {
    return {
        hue: h,
        saturation: s,
        lightness: l,
        alpha: a,
        blend: function blend ( c ) {
            let c1 = HSLAToRGBA( this.hue, this.saturation, this.lightness, this.alpha );
            let c2 = HSLAToRGBA( c.hue, c.saturation, c.lightness, c.alpha );
            console.log( c1.toString(), c2.toString() );
            let c3 = c1.blend( c2 );
            c3 = RGBAToHSLA( c3.red, c3.green, c3.blue, c3.alpha );
            return hsla( c3.hue, c3.saturation, c3.lightness, c3.alpha );
        },
        toString: function toString () {
            return 'hsla(' + this.hue + ',' + this.saturation + '%,' + this.lightness + '%,' + this.alpha + ')';
        }
    };
}

export function RGBAToHSLA ( r, g, b, a ) {
    // Make r, g, and b fractions of 1
    r /= 255;
    g /= 255;
    b /= 255;

    // Find greatest and smallest channel values
    let cmin = Math.min( r, g, b ),
        cmax = Math.max( r, g, b ),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

    // Calculate hue
    // No difference
    if ( delta == 0 )
        h = 0;
    // Red is max
    else if ( cmax == r )
        h = ( ( g - b ) / delta ) % 6;
    // Green is max
    else if ( cmax == g )
        h = ( b - r ) / delta + 2;
    // Blue is max
    else
        h = ( r - g ) / delta + 4;

    h = Math.round( h * 60 );

    // Make negative hues positive behind 360°
    if ( h < 0 )
        h += 360;

    // Calculate lightness
    l = ( cmax + cmin ) / 2;

    // Calculate saturation
    s = delta == 0 ? 0 : delta / ( 1 - Math.abs( 2 * l - 1 ) );

    // Multiply l and s by 100
    s = +( s * 100 ).toFixed( 1 );
    l = +( l * 100 ).toFixed( 1 );

    return hsla( h, s, l, a );
}

export function HSLAToRGBA ( h, s, l, a ) {
    // Must be fractions of 1
    s /= 100;
    l /= 100;

    let c = ( 1 - Math.abs( 2 * l - 1 ) ) * s,
        x = c * ( 1 - Math.abs( ( h / 60 ) % 2 - 1 ) ),
        m = l - c / 2,
        r = 0,
        g = 0,
        b = 0;

    if ( 0 <= h && h < 60 ) {
        r = c; g = x; b = 0;
    } else if ( 60 <= h && h < 120 ) {
        r = x; g = c; b = 0;
    } else if ( 120 <= h && h < 180 ) {
        r = 0; g = c; b = x;
    } else if ( 180 <= h && h < 240 ) {
        r = 0; g = x; b = c;
    } else if ( 240 <= h && h < 300 ) {
        r = x; g = 0; b = c;
    } else if ( 300 <= h && h < 360 ) {
        r = c; g = 0; b = x;
    }
    r = Math.round( ( r + m ) * 255 );
    g = Math.round( ( g + m ) * 255 );
    b = Math.round( ( b + m ) * 255 );

    return rgba( r, g, b, a );
}