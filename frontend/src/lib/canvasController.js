import { animation } from "./Utils";
import {
    rgba,
} from './color';

export function canvasController ( canvasElement ) {
    const html = document.documentElement;
    const canvas = canvasElement;
    canvas.width = html.ww;
    canvas.height = html.wh;
    const ctx = canvas.getContext( '2d' );

    let highlight = rgba( 255, 106, 77 );
    let primary = rgba( 230, 25, 77 );
    let lowlight = rgba( 128, 0, 57 );
    const red = rgba( 255, 0, 60 );
    const green = rgba( 128, 255, 0 );
    const blue = rgba( 0, 100, 255 );

    let primaryGray = primary.saturation( 60 ).brightness( 18 );
    let highlightGray = highlight.saturation( 100 ).brightness( 20 );
    let lowlightGray = lowlight.saturation( 70 ).brightness( 14 );

    let interval = 60000;
    let colorQueue = [
        primaryGray,
        lowlightGray,
        red,
        green,
        blue
    ];

    function mixedGradient ( color1, color2, ctx, canvas, r ) {
        colorQueue.push( colorQueue.shift() );
        ctx.clearRect( 0, 0, canvas.width, canvas.height );
        let c = { ...color2 };
        c.alpha = r;
        let mix = color1.blend( c );
        gradient( ctx, canvas, mix, r );
    }

    animation(
        interval,
        mixedGradient.bind(
            null,
            colorQueue[0],
            colorQueue[1],
            ctx,
            canvas
        )
    );
};

function gradient ( ctx, canvas, color, r ) {
    ctx.save();
    ctx.translate( canvas.width / 2, canvas.height / 2 );
    ctx.rotate( ( 360 * r ) * Math.PI / 180 );
    ctx.translate( 0, 0 );
    let lingrad = ctx.createLinearGradient( 0, 0, canvas.height, canvas.height );
    lingrad.addColorStop( 0, color );
    lingrad.addColorStop( 1, 'rgb(42, 36, 34)' );
    ctx.fillStyle = lingrad;
    ctx.fillRect( -canvas.width, -canvas.width, canvas.width * 2, canvas.width * 2 );
    ctx.restore();
}