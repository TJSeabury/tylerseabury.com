import * as THREE from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import theme from './../../theme.json';



export function Tree ( height, diameter, leaves ) {
    const tree = new THREE.Group();

    const trunkMesh = new THREE.Mesh(
        Trunk( height, diameter ),
        new THREE.MeshStandardMaterial( {
            color: new THREE.Color( 'brown' )
        } )
    );
    trunkMesh.castShadow = true;
    trunkMesh.receiveShadow = true;
    tree.add( trunkMesh );
    let cone = new THREE.ConeGeometry( .5, 1, 3, 1 );
    cone.translate( 0, .5, 0 );
    const leafMesh = new THREE.Mesh(
        cone, //Leaf(),
        new THREE.MeshStandardMaterial( { color: new THREE.Color( 'hsl(140,50%,20%)' ) } )
    );
    leafMesh.castShadow = true;
    //leafMesh.receiveShadow = true;

    let twoThirdsRad = -2 * Math.PI / 3;
    let quarterHeight = height / 4;
    let thirdHeight = height / 3;
    let halfHeight = height / 2;
    let twoThirdsHeight = thirdHeight * 2;
    let leafInterval = twoThirdsHeight / leaves;
    for ( let l = 0; l < leaves; l++ ) {
        let r = l / ( leaves + 1 );
        let leaf = leafMesh.clone();
        leaf.rotateX( twoThirdsRad );
        leaf.scale.set( quarterHeight * ( 1 - r ), halfHeight * ( 1 - r ), quarterHeight * ( 1 - r ) );
        leaf.rotateOnWorldAxis( new THREE.Vector3( 0, 1, 0 ), 120 * Math.PI * r + ( Math.PI / 2 ) * Math.random() );
        leaf.position.set( 0, thirdHeight + leafInterval * l, 0 );
        tree.add( leaf );
    }

    return tree;

    function Trunk ( height, diameter ) {
        let segments = [];
        let segHeight = diameter;
        let nSegs = height / diameter;
        let radius = diameter / 2;
        let prevRadius = radius;
        for ( let s = 0; s <= nSegs; s++ ) {
            prevRadius = radius;
            radius *= .7;
            if ( s === nSegs ) radius = 0;
            let segment = new THREE.CylinderGeometry( radius, prevRadius, segHeight, 5, 1, true );
            segment.translate( 0, segHeight * s, 0 );
            segments[s] = segment;
        }
        let trunk = BufferGeometryUtils.mergeBufferGeometries( segments );
        //trunk.computeVertexNormals();
        return trunk;
    }

    function Branch () {

    }

    function Leaf () {
        let leaf = new THREE.Shape();
        leaf.moveTo( 0, 0 );
        leaf.lineTo( .5, 0 );
        leaf.lineTo( 0, 1 );
        leaf.lineTo( -.5, 0 );
        leaf.lineTo( 0, 0 );
        return new THREE.ShapeGeometry( leaf );
    }

    function Cursor ( pos = new THREE.Vector3( 0, 0, 0 ) ) {

    }
}

