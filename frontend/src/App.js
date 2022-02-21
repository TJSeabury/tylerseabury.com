import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import { uniqueId } from 'lodash';

function App () {
    const [content, setContent] = useState( null );

    useEffect( () => {
        async function getContent () {
            await fetch( 'http://karak_node_g420.tylerseabury.com:3000/api/graphql', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify( {
                    query: `{
                    posts {
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
                    console.log( content );
                } );
        }
        getContent();
        return () => {
        };
    }, [content] );

    const RenderContent = ( props ) => {
        const post = props.content?.posts[0];
        if ( !post ) return <div>Nothing to show yet.</div>;
        console.log( post );
        return <article
            id={post.id}
        >
            {post.content.document.map( p => <p key={uniqueId( 'para-' )}>{p.children[0].text}</p> )}
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
