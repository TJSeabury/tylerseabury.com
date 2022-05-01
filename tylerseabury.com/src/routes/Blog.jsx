import { useEffect, useState } from 'react';
import Layout from '../views/Layout';
import Post from '../views/Post';

export default function Blog () {
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

    useEffect( () => {
        getContent();
        return () => { };
    }, [] );

    if ( !content ) return <div>Nothing to show yet.</div>;
    const post = content?.posts?.[0];
    return <Layout>
        <Post
            post={post}
        />
    </Layout>;
}