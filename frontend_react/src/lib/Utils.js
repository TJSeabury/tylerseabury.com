import { uniqueId } from 'lodash';
import Code from '../views/Code';

export const renderContentNode = node => {
    const text = node?.children[0]?.text ?? '';
    let content = null;
    switch ( node.type ) {
        case 'paragraph':
            content = <p
                key={uniqueId( 'paragraph-' )}
            >
                {text}
            </p>;
            break;
        case 'heading':
            switch ( node.level ) {
                case 1:
                case 2:
                    content = <h2
                        key={uniqueId( 'heading-' )}
                    >
                        {text}
                    </h2>;
                    break;
                case 3:
                    content = <h3
                        key={uniqueId( 'heading-' )}
                    >
                        {text}
                    </h3>;
                    break;
                case 4:
                case 5:
                case 6:
                    content = <h4
                        key={uniqueId( 'heading-' )}
                    >
                        {text}
                    </h4>;
                    break;
                default:
                    break;
            }
            break;
        case 'code':
            content = <Code code={text} language="javascript" />;
            break;
        default:
            break;
    }
    return content;
};

export function animation ( ms, callback ) {
    const start = performance.now();
    const end = start + ms;
    const fr = 1000 / 60;
    let now = start;
    let last = now;
    let delta = now - last;
    let t = now - start;
    function animate () {
        if ( delta >= fr ) {
            last = now;
            try {
                callback( t / ms );
            }
            catch ( err ) {
                console.error( 'Animation failed with error: ', err );
            }
        }
        now = performance.now();
        delta = now - last;
        t = now - start;
        if ( now <= end ) {
            requestAnimationFrame( animate );
        }
    }
    requestAnimationFrame( animate );
}