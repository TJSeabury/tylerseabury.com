import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import { uniqueId } from 'lodash';

function App () {
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
        let content = null;
        switch ( node.type ) {
            case 'paragraph':
                content = <p
                    key={uniqueId( 'paragraph-' )}
                >
                    {node.children[0].text}
                </p>;
                break;
            case 'heading':
                switch ( node.level ) {
                    case 1:
                    case 2:
                        content = <h2
                            key={uniqueId( 'heading-' )}
                        >
                            {node.children[0].text}
                        </h2>;
                        break;
                    case 3:
                        content = <h3
                            key={uniqueId( 'heading-' )}
                        >
                            {node.children[0].text}
                        </h3>;
                        break;
                    case 4:
                    case 5:
                    case 6:
                        content = <h4
                            key={uniqueId( 'heading-' )}
                        >
                            {node.children[0].text}
                        </h4>;
                        break;
                    default:
                        break;
                }
                break;
            case 'code':
                content = <pre
                    key={uniqueId( 'code-' )}
                ><code>
                        {node.children[0].text}
                    </code></pre>;
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

    const RenderContent = ( props ) => {
        if ( !props.content ) return <div>Nothing to show yet.</div>;
        const post = props.content?.posts[0];
        return <article
            id={post.id}
        >
            <header>
                <figure>
                    <img src={`http://localhost:9000/${post.featuredImage.url}`} alt='' />
                </figure>
                <h1>{post.title}</h1>
            </header>
            {post.content.document.map( node => renderContentNode( node ) )}
        </article>;
    };

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
            </header>
            <main>
                <RenderContent
                    content={content}
                />
            </main>
        </div>
    );
}

export default App;
