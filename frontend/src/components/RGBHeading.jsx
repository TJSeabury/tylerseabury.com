import {
    rgba,
} from '../lib/color';
import { animation } from '../lib/Utils';
import {
    useRef,
    useEffect
} from 'react';

const levelsEnum = [1, 2, 3, 4, 5, 6];

export function RGBHeading ( props ) {
    const {
        children,
        headingLevel
    } = props;

    if ( !levelsEnum.includes( headingLevel ) ) throw new Error( "Heading level out of allowed set." );

    const ref = useRef( null );

    useEffect( () => {
        const rgbText = ref.current;

        let interval = 3000;

        const red = rgba( 255, 0, 60 );
        const green = rgba( 128, 255, 0 );
        const blue = rgba( 0, 100, 255 );

        let colorQueue = [
            red,
            green,
            blue
        ];
        ( function loop2 () {
            animation(
                interval,
                ( function rgbbackground ( c1, c2, c3, r ) {
                    let c1a = { ...c3 };
                    let c2a = { ...c2 };
                    c1a.alpha = r;
                    c2a.alpha = r;
                    let mix1 = c1.blend( c2a );
                    let mix2 = c2.blend( c1a );
                    rgbText.style.setProperty(
                        'background',
                        'linear-gradient(90deg, ' + mix1.toString() + ', ' + mix2.toString() + ')'
                    );
                    rgbText.style.setProperty( 'background-clip', 'text' );
                    rgbText.style.setProperty( '-webkit-background-clip', 'text' );

                } ).bind(
                    null,
                    colorQueue[0],
                    colorQueue[1],
                    colorQueue[2]
                )
            );
            colorQueue.push( colorQueue.shift() );
            setTimeout( loop2, interval );
        } )();
        return () => { };
    }, [] );

    const Heading = `h${1}`;

    return <Heading
        ref={ref}
        className="rgb-text"
    >
        {children}
    </Heading>;

};