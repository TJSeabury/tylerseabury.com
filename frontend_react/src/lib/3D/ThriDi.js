import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';


import theme from './../../theme.json';

export class ThriDi {
    constructor( canvas ) {
        this.canvas = canvas;
        this.width = canvas.getBoundingClientRect().width;
        this.height = canvas.getBoundingClientRect().height;
        this.objects = [];
        this.running = false;
        this.initialize();

        this.clock = new THREE.Clock();
        this.delta = 0;
        this.interval = 1 / 24;
        this.update();
    }


    initialize () {
        let lightBlue = new THREE.Color( theme.colors.themeBlue.light );
        let near = 1;
        let far = 1000;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 40, this.width / this.height, near, far );
        this.scene.background = lightBlue; //null;
        this.scene.fog = new THREE.Fog( lightBlue, near, far );
        this.renderer = new THREE.WebGLRenderer( {
            canvas: this.canvas,
            alpha: true
        } );
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.autoClear = false;
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( this.width, this.height );
        this.renderer.antialias = true;
        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 1;
        this.camera.position.y = 25;
        this.camera.position.z = 250;
        this.controls.update();

        this.shaders();

        this.lightingNature();

        this.start();
    }

    shaders () {
        const renderPass = new RenderPass( this.scene, this.camera );
        const fxaaPass = new ShaderPass( FXAAShader );
        // const smaaPass = new SMAAPass( this.width, this.height );
        // const bloomPass = new UnrealBloomPass( 256, .15 );

        const pixelRatio = this.renderer.getPixelRatio();
        fxaaPass.material.uniforms['resolution'].value.x = 1 / ( this.width * pixelRatio );
        fxaaPass.material.uniforms['resolution'].value.y = 1 / ( this.height * pixelRatio );
        this.composer = new EffectComposer( this.renderer );
        this.composer.addPass( renderPass );
        //this.composer.addPass( bloomPass );
        //this.composer.addPass( fxaaPass );
        //this.composer.addPass( smaaPass );


        function onWindowResize () {
            this.width = this.canvas.getBoundingClientRect().width;
            this.height = this.canvas.getBoundingClientRect().height;

            this.camera.aspect = this.width / this.height;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize( this.width, this.height );
            this.composer.setSize( this.width, this.height );
            const pixelRatio = this.renderer.getPixelRatio();
            fxaaPass.material.uniforms['resolution'].value.x = 1 / ( this.width * pixelRatio );
            fxaaPass.material.uniforms['resolution'].value.y = 1 / ( this.height * pixelRatio );
        }
        window.addEventListener( 'resize', onWindowResize );
    }


    lightingSpace () {
        const scene = this.scene;
        const sun = new THREE.DirectionalLight( 'white', .70 );
        sun.position.set( -10, 0, 0 );
        sun.target.position.set( 0, 0, 0 );
        sun.castShadow = true;
        scene.add( sun );
        scene.add( sun.target );

        /* const sunScatter = new THREE.DirectionalLight( 'white', .05 );
        sunScatter.position.set(10, 0, 0);
        sunScatter.target.position.set(0, 0, 0);
        scene.add( sunScatter );
        scene.add( sunScatter.target ); */

        const scatteredLight = new THREE.HemisphereLight( 'white', theme.colors.themeBlue.light, .025 );
        scene.add( scatteredLight );
    }

    lightingNature () {
        const scene = this.scene;
        const sun = new THREE.DirectionalLight( 'white', .66 );
        sun.position.set( -10, 10, 5 );
        sun.target.position.set( 0, 0, 0 );
        sun.castShadow = true;
        let bound = 1000;
        sun.shadow.camera.top = bound;
        sun.shadow.camera.right = bound;
        sun.shadow.camera.bottom = -bound;
        sun.shadow.camera.left = -bound;
        sun.shadow.camera.far = bound;
        sun.shadow.camera.near = -bound;
        scene.add( sun );
        scene.add( sun.target );
        const scatteredLight = new THREE.HemisphereLight( 'white', theme.colors.themeBlue.light, .34 );
        scene.add( scatteredLight );
    }

    loop1 () { // doesn't work, is render blocking
        let time = 0.0;
        const deltaTime = 1 / 2;
        let currentTime = performance.now();
        let accumulator = 0.0;
        while ( true === this.running ) {
            let newTime = performance.now();
            let frameTime = newTime - currentTime;
            currentTime = newTime;
            accumulator += frameTime;
            while ( accumulator >= deltaTime ) {
                this.update( time, deltaTime );
                accumulator -= deltaTime;
                time += deltaTime;
            }
            this.render();
        }
    }

    loop ( currentTime = performance.now(), lastTime = currentTime, deltaTime = 0, interval = 1 / 24 ) {
        currentTime = performance.now();
        deltaTime += currentTime - lastTime;
        lastTime = currentTime;
        if ( deltaTime >= interval ) {
            this.update();
            this.render();
            deltaTime = 0;
        }
        requestAnimationFrame( this.loop.bind( this, currentTime, lastTime, deltaTime, interval ) );
    }

    update () {
        for ( const o of this.objects ) {
            if ( typeof o.update !== 'function' ) continue;
            o.update();
        }
        this.controls.update();
    }

    render () {
        this.composer.render();
        //this.renderer.render( this.scene, this.camera );
    }

    addObject ( renderableObject ) {
        this.objects[this.objects.length] = renderableObject;
        this.scene.add( renderableObject );
    }

    start () {
        this.running = true;
        this.loop();
    }

    stop () {
        this.running = false;
    }

}