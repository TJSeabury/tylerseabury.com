import { animation } from "./Utils";
import {
    rgba,
    mixedGradient,
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

    let primaryGray = primary.saturation( 60 ).brightness( 18 );
    let highlightGray = highlight.saturation( 100 ).brightness( 20 );
    let lowlightGray = lowlight.saturation( 70 ).brightness( 14 );

    let running = true;
    let interval = 6666;
    let colorQueue = [
        primaryGray,
        lowlightGray,
    ];
    function loop () {
        if ( !running ) return;
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
        colorQueue.push( colorQueue.shift() );
        setTimeout( loop, interval );
    }
    loop();
}