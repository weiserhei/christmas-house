/**
 * Setup the renderer
 */
define(["three","scene"], function (THREE, scene) {

    'use strict';

    var loader = new THREE.TextureLoader();
    var url = 'img/cloudSml.png';
    var T_cloud = loader.load( url );

    var particleGroupCrash = new SPE.Group({
        texture: {
            value: T_cloud
        },
        blending: THREE.NormalBlending
    });

    var crashemitter = new SPE.Emitter({

        maxAge: { value: 28 },
        position: { 
            value: new THREE.Vector3( -0.35, 1.4, 0 ),
            spread: new THREE.Vector3( 0.1, 0.05, 0.1 ),
        },
        size: {
            value: [ 0.2, 1 ],
            spread: [ 0, 0.1, 0.2 ]
        },
        acceleration: {
            value: new THREE.Vector3( 0, 0.002, 0 ),
        },
        
        rotation: {
            axis: new THREE.Vector3( 0, -1, 0 ),
            spread: new THREE.Vector3( 0, 0, 0 ),
            angle: 720 * Math.PI / 180,
        },
        
        velocity: {
            value: new THREE.Vector3( 0.03, 0.06, 0.03 ),
            spread: new THREE.Vector3( 0.025, 0.04, 0.025 )
        },
        opacity: {
            value: [ 0.2, 0.4, 0 ]
        },
        color: {
            value: [ new THREE.Color( 0xAAAAAA ), new THREE.Color( 0xFFFFFF ) ],
            spread: [ new THREE.Vector3( 0, 0, 0.1 ), new THREE.Vector3( 0, 0, 0 ) ]
        },
        // activeMultiplier: 0.5,
        particleCount: 2500,
    });
    
    particleGroupCrash.addEmitter( crashemitter );
    crashemitter.enabled = true;
    scene.add( particleGroupCrash.mesh );
    // particleGroupCrash.tick( 28 );

    return particleGroupCrash;
});