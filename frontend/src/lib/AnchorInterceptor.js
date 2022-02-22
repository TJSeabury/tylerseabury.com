/**
 * Anchor Interceptor
 * © Copyright 2017-2018, Tyler Seabury, All Rights reserved.
 * @author Tyler Seabury, tylerseabury@gmail.com
 * @authorURL https://github.com/TJSeabury/
 * @version 1.1.0
 */
class AnchorInterceptor
{
	constructor( headerQueryString, targets = [] )
	{
		const Animator = require('./Animator');
		this.a = window.a || ( window.a = new Animator( 20 ) );
		this.header = (
			function( hqs )
			{
				if ( ! hqs ) return false; 
				let header = document.querySelector( hqs );
				if ( undefined !== header || null !== header )
				{
					return header;
				}
			}
		)( headerQueryString );
		this.headerOffset = this.header ? this.header.offsetHeight : 0;
		this.targets = targets;
		for ( const t of this.targets )
		{
			const links = Array.from( document.querySelectorAll( '.' + t ) );
			for ( const l of links )
			{
				if ( l.localName === 'a' )
				{
					if ( ! l.classList.contains( t ) )
					{
						l.classList.add( t );
					}
				}
				else
				{
					const a = l.querySelector( 'a' );
					if ( ! a.classList.contains( t ) )
					{
						a.classList.add( t );
					}
				}
			}
		}
	}

	setTarget( anchorTarget )
	{
		sessionStorage.setItem( 'anchorTarget', anchorTarget );
	}

	getTarget()
	{
		return sessionStorage.getItem( 'anchorTarget' );
	}
	removeTarget()
	{
		if ( sessionStorage.getItem( 'anchorTarget' ) )
		{
			sessionStorage.removeItem( 'anchorTarget' );
		}
	}

	checkForTarget() {
		if ( null !== sessionStorage.getItem( 'anchorTarget' ) &&
			'' !== sessionStorage.getItem( 'anchorTarget' ) ) {
			return true;
		}
		return false;
	}

	getLinkFromTarget( target ) {
		while ( target.localName !== 'a' ) {
			if ( ! target.localName )
			{
				return false;
			}
			target = target.parentNode;
		}
		return target;
	}

	getStripURL( url )
	{
		const strippedURL = url.substring( 0, url.indexOf( '#' ) ) || url;
		return ( ( strippedURL.charAt( strippedURL.length - 1 ) === '/' ) ? strippedURL : strippedURL + '/' );
	}

	getTargetID( link )
	{
		return link.href.substring( link.href.indexOf( '#' ) + 1 );
	}

	doNavigate( url )
	{
		window.location.href = url;
	}

	doAnimate( id )
	{
		const anchorTarget = document.getElementById( id );
		if ( undefined === anchorTarget )
		{
			return;
		}
		let deltaY = this.getScrollAmount( anchorTarget ) - this.headerOffset;
		if ( 0 === deltaY )
		{
			this.removeTarget();
			return;
		}
		this.a.animate({
			duration: 1000,
			easing: this.a.easings.quadInOut,
			draw: p =>
			{
				this.headerOffset = this.header ? this.header.offsetHeight : 0;
				deltaY = this.getScrollAmount( anchorTarget ) - this.headerOffset;
				document.documentElement.scrollTop += deltaY * p;
				document.body.scrollTop += deltaY * p;
			}
		});
		this.removeTarget();
		return false;
	}

	getScrollAmount( t )
	{
		return t.getBoundingClientRect().top;
	}
	
	hasIntersectingClass( A, B )
	{
		for ( let a of A )
		{
			for ( let b of B )
			{
				if ( a === b )
				{
					return true;
				}
			}
		}
		return false;
	}

	clickHandler( event )
	{
		const link = this.getLinkFromTarget( event.target );
		if ( ! link )
		{
			return;
		}
		if ( this.targets.length > 0 && ! this.hasIntersectingClass( Array.from( link.classList ), this.targets ) )
		{
			return;
		}
		event.preventDefault();
		const url = link.href;
		const cleanURL = this.getStripURL( link.href );
		const cleanLocatation = this.getStripURL( window.location.href );
		const id = this.getTargetID( link );
		if ( -1 === url.indexOf('#') )
		{
			this.doNavigate( url );
		}
		else if ( cleanURL === cleanLocatation )
		{
			this.doAnimate( id );	
		}
		else
		{
			this.setTarget( id );
			this.doNavigate( cleanURL );
		}
	}
}

module.exports = AnchorInterceptor;