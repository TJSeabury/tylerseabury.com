import * as THREE from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import perlinNoise3d from 'perlin-noise-3d';
import { LinkedGeometry } from './LinkedGeometry';

const theme = require('../../../../theme.json').theme;

export function Planet( radius ) {
    const planeTop = new THREE.PlaneGeometry( radius*2, radius*2, radius*2, radius*2 );
    const planeFront = new THREE.PlaneGeometry( radius*2, radius*2, radius*2, radius*2 );
    const planeRight = new THREE.PlaneGeometry( radius*2, radius*2, radius*2, radius*2 );
    const planeBack = new THREE.PlaneGeometry( radius*2, radius*2, radius*2, radius*2 );
    const planeLeft = new THREE.PlaneGeometry( radius*2, radius*2, radius*2, radius*2 );
    const planeBottom = new THREE.PlaneGeometry( radius*2, radius*2, radius*2, radius*2 );

    planeTop.rotateX( -Math.PI/2 );
    planeTop.translate( 0, radius, 0 );
    planeFront.translate( 0, 0, radius );
    planeRight.rotateY( Math.PI/2 );
    planeRight.translate( radius, 0, 0 );
    planeBack.rotateY( Math.PI );
    planeBack.translate( 0, 0, -radius );
    planeLeft.rotateY( -Math.PI/2 );
    planeLeft.translate( -radius, 0, 0 );
    planeBottom.rotateX( Math.PI/2 );
    planeBottom.translate( 0, -radius, 0 );

    const planet = BufferGeometryUtils.mergeBufferGeometries([ 
        planeTop,
        planeFront,
        planeRight,
        planeBack,
        planeLeft,
        planeBottom
    ]);

    planet.setAttribute( 'color', new THREE.Float32BufferAttribute( Array( planet.attributes.position.array.length ).fill( 0 ), 3 ) );

    const linked = new LinkedGeometry( planet );

    const noise = new perlinNoise3d();
    let water = new THREE.Color( theme.colors.themeBlue.DEFAULT );
    let sand = new THREE.Color( 'hsl( 55, 40%, 75% )' );
    let land = new THREE.Color( theme.colors.themeCyan.dark );
    let snow = new THREE.Color( theme.colors.themeGray.white );

    let diameter = radius * 2;
    let rFrac = radius / 12;

    linked.forEach( p => {
        // Inflate the object into a sphere
        let length = p.vector.length();
        let s = radius / length;
        let x = p.vector.x * s;
        let y = p.vector.y * s;
        let z = p.vector.z * s;

        // Deform the sphere's surface
        let scale = 6.32;
        let n = noise.get( 
            ( ( x + radius ) / diameter ) * scale, 
            ( ( y + radius ) / diameter ) * scale, 
            ( ( z + radius ) / diameter ) * scale
        ) * 2 - 1;
        s = Math.max( radius + rFrac * n, radius ) / radius;
        p.setX( x * s );
        p.setY( y * s );
        p.setZ( z * s );

        // Set the vertex colors
        let c = linked.geometry.attributes.color.array;
        let color = water;
        if ( n > -.03 ) color = sand;
        if ( n > .03 ) color = land;
        if ( n > .33 || Math.abs( p.vector.y ) > radius * 0.95 ) color = snow;
        for ( const i of p.indexes ) {
            c[i] = color.r;
            c[i+1] = color.g;
            c[i+2] = color.b;
        }

    } );

    planet.colorsNeedUpdate = true;

    planet.computeVertexNormals();

    const mesh = new THREE.Mesh(
        planet,
        new THREE.MeshStandardMaterial({
            vertexColors: THREE.FaceColors,
            //flatShading: true,
        })
    );

    mesh.update = function() {
        mesh.rotateY( 0.0005 );
    };

    return mesh;
}