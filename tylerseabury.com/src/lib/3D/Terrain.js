import * as THREE from 'three';
import perlinNoise3d from 'perlin-noise-3d';
import { LinkedGeometry } from './LinkedGeometry';

export function Terrain ( widthX, widthZ, height, resolution, seed = 1, color = new THREE.Color( 'green' ) ) {
    const noise = new perlinNoise3d( seed );
    const noise2 = new perlinNoise3d( seed + 1 );
    const stepX = widthX / resolution;
    const stepZ = widthZ / resolution;
    const plane = new THREE.PlaneGeometry( widthX, widthZ, resolution, resolution );
    plane.rotateX( -Math.PI / 2 );
    const indexedPlane = new LinkedGeometry( plane );

    // Deform the plane's surface
    let scale = .004;
    indexedPlane.forEach( p => {
        let n = noise.get(
            ( p.x /* + widthX */ ) * scale,
            0,
            ( p.z /* + widthZ */ ) * scale
        ) * 2 - 1;
        p.y = height * n;
        return p;
    } );

    // Do it again
    /* scale = .002;
    indexedPlane.forEach( p => {
        let n = noise2.get(
            ( p.x + widthX ) * scale,
            0,
            ( p.z + widthZ ) * scale
        ) * 2 - 1;
        p.y = height * n;
        return p;
    } ); */

    plane.computeVertexNormals();

    plane.getHeightAtXZ = function ( x, z ) {
        console.log( 'getHeightAtXZ: ', x, z );
        const lerp = ( a, b, x ) => a + ( b - a ) * x;
        const xFloor = Math.floor( x / stepX ) * stepX - widthX;
        const zFloor = Math.floor( z / stepZ ) * stepZ - widthZ;
        const xa = ( x % stepX ) / stepX;
        const za = ( z % stepZ ) / stepZ;
        console.log( `
            xFloor: ${xFloor}
            xa: ${xa}
            zFloor: ${zFloor}
            za: ${za}
        `);
        const corners = [
            [xFloor, zFloor],
            [xFloor + stepX, zFloor],
            [xFloor + stepX, zFloor + stepZ],
            [xFloor, zFloor + stepZ]
        ];
        const heights = corners.map( ( [x, z] ) => {
            return indexedPlane.getPoint( x, z )?.y;
        } );
        const xh1 = lerp( heights[0], heights[1], xa );
        const xh2 = lerp( heights[2], heights[3], xa );
        const zh = lerp( xh1, xh2, za );
        return zh;
    };
    /* plane.getHeightAtXZ = function ( x, z ) {
        return ( noise.get( ( x + widthX ) * scale, 0, ( z + widthZ ) * scale ) * 2 - 1 ) * height;
    }; */

    return new THREE.Mesh(
        plane,
        new THREE.MeshStandardMaterial( {
            color: color
        } )
    );
}