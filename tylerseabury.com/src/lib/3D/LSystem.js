export class LSystem {
    constructor( axiom = '', rules = {} ) {
        this.axiom = axiom;
        this.rules = rules;
        this.state = this.axiom;
    }

    grow( n ) {
        if ( 0 == n ) return this.state;
        this.state = this.applyRules();
        this.grow( n - 1 );
    }

    applyRules() {
        let state = `${this.state}`;
        for ( let i = state.length - 1; i >= 0; --i ) {
            const symbol = state[i];
            if ( this.rules.hasOwnProperty( symbol ) ) {
                state = state.slice( 0, i ) + this.rules[symbol] + state.slice( i + 1 );
            }
        }
        return state;
    }
}