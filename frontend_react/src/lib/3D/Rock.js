import * as THREE from 'three';
import { LinkedGeometry } from './LinkedGeometry';
import theme from './../../theme.json';

export function Rock ( baseSize = 10 ) {
    let geometry = new THREE.IcosahedronGeometry( baseSize, 1 );
    let indexedGeo = new LinkedGeometry( geometry );
    indexedGeo.forEach( p => {
        p.setX( p.vector.x + ( Math.random() * baseSize / 5 - baseSize / 10 ) );
        p.setY( p.vector.y + ( Math.random() * baseSize / 5 - baseSize / 10 ) );
        p.setZ( p.vector.z + ( Math.random() * baseSize / 5 - baseSize / 10 ) );
    } );
    let scale = x => 2.75 * Math.random() + .25;
    geometry.scale( scale(), scale(), scale() );
    geometry.computeVertexNormals();
    const rock = new THREE.Mesh(
        geometry,
        new THREE.MeshStandardMaterial( {
            color: new THREE.Color( 'hsl(230, 4%, ' + Math.round( 50 * Math.random() + 10 ) + '% )' )
        } )
    );
    let tau = 2 * Math.PI;
    rock.rotateX( tau * Math.random() );
    rock.rotateY( tau * Math.random() );
    rock.rotateZ( tau * Math.random() );
    rock.castShadow = true;
    rock.receiveShadow = true;
    return rock;
}