const log = console.log;

/* 
All code is encapsulated in a self-exectuing anonymous function to prevent parsing and scope errors with other script files.
See: https://stackoverflow.com/questions/592396/what-is-the-purpose-of-a-self-executing-function-in-javascript
*/
(function(){
	'use strict'; // Prevents the use of some JS syntax and patters that can lead to mysterious errors.

	// Here I have aliased the document root <HTML> element as 'HTML' because 'document.documentElement' is a little bitch.
	// Read about the DOM ( document ) here: https://developer.mozilla.org/en-US/docs/Web/API/Document
	const html = document.documentElement;
	
	/* 
	This registers a function that will execute upon the 'DOMContentLoaded' event; that event 
	fires when the browser finishes parsing the html file, however, that does not mean that all assets have been parsed or loaded.
	*/
	window.addEventListener( 'DOMContentLoaded', onDOMReady );

	/* 
	This registers a function that will execute upon the 'load' event.
	The 'load' event is fired when all assets, e.g. stylesheets, scripts, images, etc..., have been parsed and loaded.
	*/
	window.addEventListener( 'load', onLoad );
	

	/* 
	It is genereally safe to perform operations on the HTML document itself when this function executes.
	Assets are another story, i.e. if you wish to find the height of an image, you very well may run into
	'undefined' errors as there is no guarantee that the image has actually loaded yet.
	The same is true of any asset or element of the DOM that relies upon assets, e.g. elements that are dynamically added via other scripts.
	*/
	function onDOMReady()
	{
		/* 
		Get the header/nav bar element node in the DOM and save it as a property of the HTML object for later use.
		See: https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector
		*/
		html.nav = html.querySelector( '.main-navigation' );

		/* 
		Here I am running two utility functions that store useful and often used window and page data as global variables 
		and register some useful event handler functions respectively.
		*/
		initializeGlobalVariables();
		initializeEventHandlers();

		canvasController( 'hero-canvas' )

		// your setup code 

	}
	
	/* 
	By the time this function executes it is safe perform operations upon anything on the webpage, with the small but
	enourmouslly frustrating exception of elements affected dynamically by third-party scripts.
	OWL-Slider.js: "My friend doesn't like you. I don't like you either!"
	Revolution-Carosel.js: *laughs in alien*
	OWL-Slider.js: "We're wanted scripts on twelve worlds!"
	You: "OK, I'll be careful!"
	OWL-Slider.js: "You'll be dead!"
	*/
	function onLoad()
	{
		// your main code

	}

	function initializeGlobalVariables()
	{
		html.ww = 0; // window width
		html.wh = 0; // window height
		html.hh = 0; // header height
		
	}


	function updateGlobalVariables()
	{
		/* 
		Use short-circuit evaluation to get the width and height with cross-browser compatibility.
		See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_Operators
		*/
		html.ww = html.clientWidth || document.body.clientWidth || window.innerWidth;
		html.wh = window.innerHeight || html.clientHeight;

		/* 
		Here we use a ternary expression to check if the header/nav bar actually exists; if it does we grab it's height, 
		if not, we just assign the header-height the very nice and safe value of 0, as it will not break any style calculations
		like 'undefined' or 'null' would.
		*/
		html.hh = html.nav ? html.nav.offsetHeight : 0;

	}

	/* 
	Executes every time the window is resized.
	*/
	function onResize()
	{
		updateGlobalVariables();
		setRootCSSVariables();

	}

	/* 
	Executes everytime the user scrolls.
	*/
	function onScroll()
	{
		// transitionHeaderStyle();

	}

	/* 
	Registers the above two functions to their respective DOM events.
	You will notice that immediatelly after registering the function to their listener, I dispatch the
	respective event to the window. This ensures that these function run at least once when they are initalized.
	*/
	function initializeEventHandlers()
	{
		window.addEventListener( 'scroll', onScroll, { passive: true } );
		window.dispatchEvent( new Event( 'scroll' ) );

		window.addEventListener( 'resize', onResize );
		window.dispatchEvent( new Event('resize') );

	}

	/* 
	Attatches your window variables to the root HTML element as inline CSS variables, i.e., 'custom properties'.
	These are accessible within your stylesheets.
	See: https://developer.mozilla.org/en-US/docs/Web/CSS/--*
	*/
	function setRootCSSVariables()
	{
		html.style.setProperty( '--window-width', ( html.ww ) + 'px' );
		html.style.setProperty( '--window-height', ( html.wh ) + 'px' );
		html.style.setProperty( '--header-height', ( html.hh ) + 'px' );
		html.style.setProperty( '--header-adjusted-window-height', ( html.wh - html.hh ) + 'px' );

	}


	function transitionHeaderStyle()
	{
		// see: https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
		requestAnimationFrame(()=>{
            /* 
            * Get the css variables from computed style.
            */
            const styles = getComputedStyle( html );

			/*
			The ratio of the viewport top edge position over the window height, e.g., 247px / 980px.
			*/
			const ratio = document.body.scrollTop / html.wh;

			/* 
			The clamped ratio. In this instance, any values over 1.0 are useless, and scrolling 
			the page further than one window height will produce a ratio larger than 1.0, so we just
			throw those values out and clamp the ratio to 1.0 when they occur.
            */
            const rCubed = ratio**3;
            const cr = rCubed >= 0.88 ? 0.88 : rCubed;
			
			/* 
			Here we set the opacity style of the element to range from 1.0 at 0px scrolled to 0.7 at 'window-height'px scrolled.
			You will notice that this will result in values larger than 1, however this still functions as the opacity property regards
			any values larger than 1.0 as 1.0 and any values less than 0 as 0.
			*/
            html.nav.style.setProperty( '--background-color', 'hsla( var( --color-primary-hsl ), ' + ( cr ) +' )' );

            let headerHeight = parseInt( styles.getPropertyValue( '--header-height' ) );
            html.nav.style.setProperty( 'height', ( headerHeight - ( headerHeight / 3 ) * cr ) + 'px' );
            html.nav.style.setProperty( 'box-shadow', '0 2px 2px 0 hsla( var( --color-dark-gray-hsl ), ' + ( cr / 4 ) + ' )' );

            /* if ( cr > 0.7 )
            {
                html.nav.style.setProperty( '--highlight', 'var( --color-dark-gray-hsl )' );
            }
            else
            {
                html.nav.style.setProperty( '--highlight', 'var( --color-highlight-hsl )' );
            } */

		});
	}

	function canvasController( canvasID )
	{
		const canvas = document.getElementById( canvasID );
		canvas.width = html.ww;
		canvas.height = html.wh;
		const ctx = canvas.getContext('2d');

		/* ctx.fillStyle = 'rgb(200, 0, 0)';
		ctx.fillRect(10, 10, 50, 50);*/

		let highlight = rgba( 255, 106, 77 );
		let primary = rgba( 230, 25, 77 );
		let lowlight = rgba( 128, 0, 57 );

		let primaryGray = primary.saturation( 60 ).brightness( 18 );
		let highlightGray = highlight.saturation( 100 ).brightness( 20 );
		let lowlightGray = lowlight.saturation( 70 ).brightness( 14 );
		let red = rgba( 255, 0, 60 );
		let green = rgba( 128, 255, 0 );
		let blue = rgba( 0, 100, 255 );

		let running = true;
		let interval = 6666;
		let colorQueue = [ 
			primaryGray,
			lowlightGray,
		];
		function loop()
		{
			if ( !running ) return;
			animation( 
				interval, 
				mixedGradient.bind( 
					null, 
					colorQueue[0], 
					colorQueue[1], 
					ctx, 
					canvas 
				) 
			);
			colorQueue.push( colorQueue.shift() );
			setTimeout( loop, interval );
		}
		loop();

		let interval2 = 3000;
		let colorQueue2 = [
			red,
			green,
			blue
		];
		let rgbText = html.querySelectorAll('.rgb-text');
		function loop2()
		{
			animation( 
				interval2, 
				(function rgbbackground( c1, c2, c3, r ){
					let c1a = {...c3};
					let c2a = {...c2};
					c1a.alpha = r;
					c2a.alpha = r;
					let mix1 = c1.blend( c2a );
					let mix2 = c2.blend( c1a );
					rgbText.forEach(el => {
						el.style.setProperty(
							'background',
							'linear-gradient(90deg, '+mix1.toString()+', '+mix2.toString()+')'
						);
						el.style.setProperty('background-clip', 'text');
						el.style.setProperty('-webkit-background-clip', 'text');
					});
					
				}).bind( 
					null, 
					colorQueue2[0], 
					colorQueue2[1],
					colorQueue2[2]
				) 
			);
			colorQueue2.push( colorQueue2.shift() );
			setTimeout( loop2, interval2 );
		}
		loop2();

	}

	/* 
	* see: https://en.wikipedia.org/wiki/Alpha_compositing
	*/
	function alphaComposite( c1, a1, c2, a2 )
	{
		let a = 1 - (1 - a2) * (1 - a1);
		return c2 * a2 / a + c1 * a1 * (1 - a2) / a;
	}

	function rgba( r, g, b, a = 1 )
	{
		return {
			red: r,
			green: g,
			blue: b,
			alpha: a,
			blend: function colorComposite( c )
			{
				let red = alphaComposite( this.red, this.alpha, c.red, c.alpha );
				let green = alphaComposite( this.green, this.alpha, c.green, c.alpha );
				let blue = alphaComposite( this.blue, this.alpha, c.blue, c.alpha );
				return rgba( red, green, blue );
			},
			saturation: function saturation( s )
			{
				let c = RGBAToHSLA( this.red, this.green, this.blue, this.alpha );
				c.saturation = s;
				return HSLAToRGBA( c.hue, c.saturation, c.lightness, c.alpha );
			},
			brightness: function brightness( b )
			{
				let c = RGBAToHSLA( this.red, this.green, this.blue, this.alpha );
				c.lightness = b;
				return HSLAToRGBA( c.hue, c.saturation, c.lightness, c.alpha );
			},
			toString: function toString()
			{
				return 'rgba('+this.red+','+this.green+','+this.blue+','+this.alpha+')';
			}
		};
	}

	function hsla( h, s, l, a = 1 )
	{
		return {
			hue: h,
			saturation: s,
			lightness: l,
			alpha: a,
			blend: function blend( c )
			{
				let c1 = HSLAToRGBA( this.hue, this.saturation, this.lightness, this.alpha );
				let c2 = HSLAToRGBA( c.hue, c.saturation, c.lightness, c.alpha );
				log( c1.toString(), c2.toString() );
				let c3 = c1.blend( c2 );
				c3 = RGBAToHSLA( c3.red, c3.green, c3.blue, c3.alpha );
				return hsla( c3.hue, c3.saturation, c3.lightness, c3.alpha );
			},
			toString: function toString()
			{
				return 'hsla('+this.hue+','+this.saturation+'%,'+this.lightness+'%,'+this.alpha+')';
			}
		};
	}

	function RGBAToHSLA( r, g, b, a ) {
		// Make r, g, and b fractions of 1
		r /= 255;
		g /= 255;
		b /= 255;
	  
		// Find greatest and smallest channel values
		let cmin = Math.min(r,g,b),
			cmax = Math.max(r,g,b),
			delta = cmax - cmin,
			h = 0,
			s = 0,
			l = 0;

		// Calculate hue
		// No difference
		if (delta == 0)
		h = 0;
		// Red is max
		else if (cmax == r)
		h = ((g - b) / delta) % 6;
		// Green is max
		else if (cmax == g)
		h = (b - r) / delta + 2;
		// Blue is max
		else
		h = (r - g) / delta + 4;

		h = Math.round(h * 60);
		
		// Make negative hues positive behind 360°
		if (h < 0)
			h += 360;

		// Calculate lightness
		l = (cmax + cmin) / 2;

		// Calculate saturation
		s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
			
		// Multiply l and s by 100
		s = +(s * 100).toFixed(1);
		l = +(l * 100).toFixed(1);

		return hsla( h, s, l, a );
	}

	function HSLAToRGBA( h, s, l, a ) {
		// Must be fractions of 1
		s /= 100;
		l /= 100;
	  
		let c = (1 - Math.abs(2 * l - 1)) * s,
			x = c * (1 - Math.abs((h / 60) % 2 - 1)),
			m = l - c/2,
			r = 0,
			g = 0,
			b = 0;

		if (0 <= h && h < 60) {
			r = c; g = x; b = 0;
		} else if (60 <= h && h < 120) {
			r = x; g = c; b = 0;
		} else if (120 <= h && h < 180) {
			r = 0; g = c; b = x;
		} else if (180 <= h && h < 240) {
			r = 0; g = x; b = c;
		} else if (240 <= h && h < 300) {
			r = x; g = 0; b = c;
		} else if (300 <= h && h < 360) {
			r = c; g = 0; b = x;
		}
		r = Math.round((r + m) * 255);
		g = Math.round((g + m) * 255);
		b = Math.round((b + m) * 255);
		
		return rgba( r, g, b, a );
	}

	function gradient( ctx, canvas, color, r )
	{
		ctx.save();
		ctx.translate( canvas.width / 2, canvas.height / 2 );
		ctx.rotate( ( 360 * r ) * Math.PI / 180 );
		ctx.translate( 0, 0 );
		let lingrad = ctx.createLinearGradient( 0, 0, canvas.height, canvas.height );
		lingrad.addColorStop(0, color );
		lingrad.addColorStop(1, 'rgb(42, 36, 34)');
		ctx.fillStyle = lingrad;
		ctx.fillRect( -canvas.width, -canvas.width, canvas.width*2, canvas.width*2 );
		ctx.restore();
	}

	function mixedGradient( color1, color2, ctx, canvas, r )
	{
		ctx.clearRect( 0, 0, canvas.width, canvas.height  );
		let c = {...color2};
		c.alpha = r;
		let mix = color1.blend( c );
		gradient( ctx, canvas, mix, r );
	}

	function animation( ms, callback )
	{
		const start = performance.now();
		const end = start + ms;
		const fr = 1000 / 60;
		let now = start;
		let last = now;
		let delta = now - last;
		let t = now - start;
		function animate()
		{
			if ( delta >= fr )
			{
				last = now;
				try 
				{
					callback( t / ms );
				}
				catch ( err )
				{
					console.error( 'Animation failed with error: ', err );
				}
			}
			now = performance.now();
			delta = now - last;
			t = now - start;
			if ( now <= end )
			{
				requestAnimationFrame( animate )
			}
		}
		requestAnimationFrame( animate )
	}

	// your functions
	
})();

class ArrayQueue
{
	constructor( type = Object, size = 100 )
	{
		this.type = type;
		this.size = size;
		this.array = new Array( size );
		this.items = 0;
		this.head = 0;
		this.tail = -1;

	}

	isEmpty()
	{
		return this.items == 0;
	}

	isFull()
	{
		return this.items == this.size;
	}

	fillRatio()
	{
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

	enqueue( item )
	{
		if ( this.isFull() ) throw Error( 'Cannot enqueue to full queue.' );
		this.tail = this.tail + 1 == this.size ? 0 : this.tail + 1;
		this.array[ this.tail ] = item;
		++this.items;
	}

	dequeue()
	{
		if ( this.isEmpty() ) throw Error( 'Cannot dequeue from empty queue.' );
		let item = this.array[ this.head ];
		this.array[ this.head ] = null;
		this.head = this.head + 1 == this.size ? 0 : this.head + 1;
		--this.items;
		return item;
	}

}