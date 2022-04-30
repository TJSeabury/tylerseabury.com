export class ArrayQueue {
    constructor( type = Object, size = 100 ) {
        this.type = type;
        this.size = size;
        this.array = new Array( size );
        this.items = 0;
        this.head = 0;
        this.tail = -1;

    }

    isEmpty () {
        return this.items == 0;
    }

    isFull () {
        return this.items == this.size;
    }

    fillRatio () {
        return this.items / this.size;
    }

    /* grow()
    {
        this.size *= 2;
        let temp = new Array( size );
        for ( let i = 0; i <= this.items; ++i )
        {

        }
    	
    } */

    enqueue ( item ) {
        if ( this.isFull() ) throw Error( 'Cannot enqueue to full queue.' );
        this.tail = this.tail + 1 == this.size ? 0 : this.tail + 1;
        this.array[this.tail] = item;
        ++this.items;
    }

    dequeue () {
        if ( this.isEmpty() ) throw Error( 'Cannot dequeue from empty queue.' );
        let item = this.array[this.head];
        this.array[this.head] = null;
        this.head = this.head + 1 == this.size ? 0 : this.head + 1;
        --this.items;
        return item;
    }

}