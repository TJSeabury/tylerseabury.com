import * as THREE from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { LinkedGeometry } from './lib/3D/LinkedGeometry';

export function Cloud() {

    let cloud = new THREE.BufferGeometry();

    const tuft1 = new THREE.IcosahedronGeometry( 1, 1 );
    tuft1.translate(-3.5,-1,0);

    const tuft2 = new THREE.IcosahedronGeometry( 1.5, 1 );
    tuft2.translate(-2,-.5,0);

    const tuft3 = new THREE.IcosahedronGeometry( 2.0, 2 );
    tuft3.translate(0,0,0);

    const tuft4 = new THREE.IcosahedronGeometry( 1.5, 1 );
    tuft4.translate(2,-.1,0);

    const tuft5 = new THREE.IcosahedronGeometry( 1, 1 );
    tuft5.translate(3.5,-.25,0);

    cloud = BufferGeometryUtils.mergeBufferGeometries([tuft1, tuft2, tuft3, tuft4, tuft5]);
    const linked = new LinkedGeometry( cloud );

    // Deform the cloud's surface
    linked.forEach( p => {
        p.setVector( new THREE.Vector3(
            p.vector.x + Math.random()/3 - 1/6,
            p.vector.y + Math.random()/3 - 1/6,
            p.vector.z + Math.random()/3 - 1/6
        ) );
    } );

    cloud.computeFaceNormals();

    return new THREE.Mesh(
        cloud,
        new THREE.MeshStandardMaterial({
            color: 'white',
            flatShading: true
        })
    );
}