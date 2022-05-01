import * as THREE from 'three';
import { ThriDi } from './3D/ThriDi';
import { Tree } from './3D/Tree';
import { Terrain } from './3D/Terrain';
import { Rock } from './3D/Rock';
import { useEffect } from 'react';
import { useRef } from 'react';

export default function World ( props ) {

    const containerRef = useRef( null );

    useEffect( () => {
        const engine = new ThriDi( containerRef.current );
        const size = 2000;
        let ground = new Terrain( size, size, 250, 3, 420, new THREE.Color( 'hsl(80,40%,50%)' ) );
        const waterLevel = -1;
        let waterPlane = new THREE.PlaneGeometry( size, size, 1, 100 );
        waterPlane.rotateX( -Math.PI / 2 );
        let waterMaterial = new THREE.MeshStandardMaterial( {
            color: new THREE.Color( 'hsl(210,90%,30%)' ),
            opacity: 0.8,
            roughness: 0
        } );
        waterMaterial.transparent = true;
        let water = new THREE.Mesh(
            waterPlane,
            waterMaterial
        );
        water.position.set( 0, waterLevel, 0 );
        engine.addObject( water );
        ground.receiveShadow = true;
        engine.addObject( ground );
        for ( let t = 0; t < 100; t++ ) {
            let x = Math.random() * size - size / 2;
            let z = Math.random() * size - size / 2;
            let y = ground.geometry.getHeightAtXZ( x, z );
            if ( y <= waterLevel ) {
                --t;
                continue;
            }
            let tree = Tree( 5, .5, 24 );
            let s = Math.random() * 3 + 1;
            tree.scale.set( s, s + s * Math.random() - s / 4, s );
            tree.position.set( x, y, z );
            engine.addObject( tree );
        }
        for ( let t = 0; t < 24; t++ ) {
            let x = Math.random() * size - size / 2;
            let z = Math.random() * size - size / 2;
            let y = ground.geometry.getHeightAtXZ( x, z );
            if ( y < waterLevel ) {
                --t;
                continue;
            }
            let rock = Rock( 1 );
            rock.position.set( x, y, z );
            engine.addObject( rock );
        }
        for ( let t = 0; t < 8; t++ ) {
            let x = Math.random() * size / 2 - size / 4;
            let z = Math.random() * size / 2 - size / 4;
            let y = ground.geometry.getHeightAtXZ( x, z );
            if ( y > waterLevel ) {
                --t;
                continue;
            }
            let boulder = Rock( 5 );
            boulder.position.set( x, y, z );
            engine.addObject( boulder );
        }

        return () => { };
    }, [] );


    return <figure id="world-scene" >
        <canvas
            ref={containerRef}
            style={{
                width: '100%',
                height: '100%'
            }}
        ></canvas>
    </figure>;
}