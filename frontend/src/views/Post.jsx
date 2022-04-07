import { renderContentNode } from "../lib/Utils";

export default function Post ( props ) {
    const {
        post
    } = props;
    return <article
        id={post.id}
    >
        <header>
            <figure>
                <img src={`http://localhost:9000${post.featuredImage.url}`} alt='' />
            </figure>
            <h1>{post.title}</h1>
        </header>
        {post.content.document.map( node => renderContentNode( node ) )}
    </article>;
};