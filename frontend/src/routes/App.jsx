import { useEffect, useState } from 'react';
import { uniqueId } from 'lodash';
import Code from '../Code';
import Layout from '../Layout';

export default function App () {
    const [content, setContent] = useState( null );

    async function getContent () {
        await fetch( 'http://localhost:9000/api/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( {
                query: `{
                    posts {
                        featuredImage {
                            url
                        }
                        title
                        publishDate
                        id
                        content {
                            document
                        }
                    }
                }`
            } ),
        } )
            .then( res => res.json() )
            .then( res => {
                setContent( res.data );
                console.log( res.data );
            } );
    }

    const renderContentNode = node => {
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

    useEffect( () => {
        getContent();
        return () => { };
    }, [] );

    if ( !content ) return <div>Nothing to show yet.</div>;
    const post = content?.posts?.[0];
    return <Layout>
        <article
            id={post.id}
        >
            <header>
                <figure>
                    <img src={`http://localhost:9000/${post.featuredImage.url}`} alt='' />
                </figure>
                <h1>{post.title}</h1>
            </header>
            {post.content.document.map( node => renderContentNode( node ) )}
        </article>
    </Layout>;
}