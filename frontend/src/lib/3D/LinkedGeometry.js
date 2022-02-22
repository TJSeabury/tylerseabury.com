import * as THREE from 'three';
class LinkedPoint {
    constructor( sourceArray, vector, indexes ) {
        this.array = sourceArray;
        this.vector = vector;
        this.indexes = [...indexes];
    }
    updateGeometry() {
        for ( const i of this.indexes ) {
            this.array[i] = this.vector.x;
            this.array[i+1] = this.vector.y;
            this.array[i+2] = this.vector.z;
        }
    }
    setX( x ){
        this.vector.x = x;
        this.updateGeometry();
    }
    setY( y ){
        this.vector.y = y;
        this.updateGeometry();
    }
    setZ( z ){
        this.vector.z = z;
        this.updateGeometry();
    }
    setVector( vector ){
        this.vector = vector;
        this.updateGeometry();
    }
}
export class LinkedGeometry {
    constructor( geometry ) {
        this.geometry = geometry;
        const pos = geometry.attributes.position.array;
        this.points = [];
        for ( let i = 0; i < pos.length; i += 3 ) {
            let v = new THREE.Vector3( Math.fround(pos[i]), Math.fround(pos[i+1]), Math.fround(pos[i+2]) );
            let pi = -1;
            this.points.forEach( (p, idx) => {
                if (  v.equals( p.vector ) ) {
                    pi = idx;
                }
            } );
            if ( pi >= 0 ) {
                this.points[pi].indexes.push(i);
            }
            else {
                this.points.push( new LinkedPoint( pos, v, [i] ) );
            }
        }
    }
    forEach( f ){
        for ( const p of this.points ) {
            f( p );
        }
    }
}
