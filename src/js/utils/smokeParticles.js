import { TextureLoader, NormalBlending, Vector3, Color } from 'three';
import SPE from "shader-particle-engine";

import cloud from "../../img/cloudSml.png";
// import soundSteam from "../../media/steam.ogg";

export default class Particles {
    constructor(scene) {

        const loader = new TextureLoader();

        const particleGroup = new SPE.Group({
            texture: {
                value: loader.load( cloud )
            },
            blending: NormalBlending,
            maxParticleCount: 3000,
            // fog fix: https://github.com/squarefeet/ShaderParticleEngine/pull/132/files
            fog: true
        });

        const emitter = new SPE.Emitter({
            maxAge: { value: 28 },
            position: { 
                value: new Vector3( -0.35, 1.25, 0 ),
                spread: new Vector3( 0.1, 0.05, 0.1 ),
            },
            size: {
                value: [ 0.5, 1, 5 ],
                spread: [ 0, 0.1, 0.2 ]
            },
            acceleration: {
                value: new Vector3( 0, 0.002, 0 ),
            },
            rotation: {
                axis: new Vector3( 0, -1, 0 ),
                spread: new Vector3( 0, 0, 0 ),
                angle: 720 * Math.PI / 180,
            },
            velocity: {
                value: new Vector3( 0.03, 0.06, 0.03 ),
                spread: new Vector3( 0.025, 0.04, 0.025 )
            },
            opacity: {
                value: [ 0.2, 0.4, 0 ]
            },
            color: {
                value: [ new Color( 0xAAAAAA ), new Color( 0xFFFFFF ) ],
                spread: [ new Vector3( 0, 0, 0.1 ), new Vector3( 0, 0, 0 ) ]
            },
            // activeMultiplier: 0.5,
            particleCount: 2500,
        });

        particleGroup.addEmitter( emitter );
        // emitter.enabled = true;
        scene.add( particleGroup.mesh );
        // particleGroupCrash.tick( 28 );

        // smokeEmitter.disable();
        // particleGroup.mesh.frustumCulled = false;
        this.emitter = emitter;
        this.particleGroup = particleGroup;

        this.stop = function() {
            emitter.enabled = false;
            emitter.disable();
        }
        
        this.start = function() {
            // sound.play();
            emitter.enabled = true;
            emitter.enable();
        }

        this.update = function ( delta ) {
            if( particleGroup ) {
                particleGroup.tick( delta );
            }
        }

    }

}