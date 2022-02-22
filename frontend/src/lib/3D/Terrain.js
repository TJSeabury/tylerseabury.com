import * as THREE from 'three';
import perlinNoise3d from 'perlin-noise-3d';
import { LinkedGeometry } from './LinkedGeometry';

export function Terrain( widthX, widthZ, height, resolution, seed = 1, color = new THREE.Color('green') ) {
    const noise = new perlinNoise3d( seed );
    const plane = new THREE.PlaneGeometry( widthX, widthZ, resolution, resolution );
    plane.rotateX( -Math.PI/2 );
    const indexedPlane = new LinkedGeometry( plane );
    const scale = .004;
    indexedPlane.forEach( p => {
        // Deform the plane's surface
        let x = p.vector.x;
        let y = p.vector.y;
        let z = p.vector.z;
        let n = noise.get( ( x + widthX ) * scale, 0, ( z + widthZ ) * scale ) * 2 - 1;
        p.setY( height * n );
    } );
    plane.computeVertexNormals();
    plane.getHeightAtXZ = function ( x, z ) {
        return (noise.get( ( x + widthX ) * scale, 0, ( z + widthZ ) * scale ) * 2 - 1) * height;
    };
    return new THREE.Mesh(
        plane,
        new THREE.MeshStandardMaterial({
            color: color
        })
    );
}