import * as THREE from 'three';
class LinkedPoint {
    constructor( sourceArray, vector, indexes ) {
        this.array = sourceArray;
        this.vector = vector;
        this.indexes = indexes;
    }
    updateGeometry () {
        for ( const i of this.indexes ) {
            this.array[i] = this.vector.x;
            this.array[i + 1] = this.vector.y;
            this.array[i + 2] = this.vector.z;
        }
    }
    setX ( x ) {
        this.vector.x = x;
        this.updateGeometry();
    }
    setY ( y ) {
        this.vector.y = y;
        this.updateGeometry();
    }
    setZ ( z ) {
        this.vector.z = z;
        this.updateGeometry();
    }
    setVector ( vector ) {
        this.vector = vector;
        this.updateGeometry();
    }
}

export class LinkedGeometry {
    constructor( geometry ) {
        this.geometry = geometry;
        this.array = geometry.attributes.position.array;
        this.index = {};

        let minX = Infinity;
        let maxX = -Infinity;
        let minZ = Infinity;
        let maxZ = -Infinity;

        for ( let i = 0; i < this.array.length; i += 3 ) {

            minX = Math.min( minX, this.array[i] );
            maxX = Math.max( maxX, this.array[i] );
            minZ = Math.min( minZ, this.array[i + 2] );
            maxZ = Math.max( maxZ, this.array[i + 2] );

            this.index[[
                this.array[i],
                0,
                this.array[i + 2]
            ]] = i;
        }
        console.log( 'Extremes: ', minX, maxX, minZ, maxZ, 'Size: ', this.array.length, this.array );
        console.log( this.index, Object.values( this.index ).length );
    }

    getPointIndex ( x, z ) {
        console.log( [
            x,
            0,
            z
        ].toString() );
        return this.index[[
            x,
            0,
            z
        ]];
    }

    getPoint ( x, z ) {
        console.log( 'getPoint: ', x, z );
        const p = this.getPointIndex( x, z );
        return {
            x: this.array[p.x],
            y: this.array[p.y],
            z: this.array[p.z]
        };
    }

    forEach ( f ) {
        const pos = this.geometry.attributes.position.array;
        for ( let i = 0; i < pos.length; i += 3 ) {
            let v = new THREE.Vector3(
                Math.fround( pos[i] ),
                Math.fround( pos[i + 1] ),
                Math.fround( pos[i + 2] ) );
            v = f( v );
            pos[i] = v.x;
            pos[i + 1] = v.y;
            pos[i + 2] = v.z;
        }
    }
}
