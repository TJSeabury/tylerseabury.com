import { canvasController } from "../lib/canvasController";
import {
    useRef,
    useEffect
} from "react";

export function HomeCanvas ( props ) {
    const {
        id,
        className
    } = props;

    const ref = useRef( null );

    useEffect( () => {
        canvasController( ref.current );

        return () => { };
    }, [] );


    return <canvas
        id={id}
        className={className}
        ref={ref}
    ></canvas>;
};