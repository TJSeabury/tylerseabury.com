fetch( 'http://karak_node_g420.tylerseabury.com:3000/api/graphql', {
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
        console.log( res.data );
    } );
