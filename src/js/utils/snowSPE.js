import { TextureLoader, Vector3, Color } from "three";
import SPE from "shader-particle-engine";

import snowflake from "../../assets/img/snowflake.png";

// let SPE = spe.default(THREE);

export default class Particles {
  constructor(scene) {
    const loader = new TextureLoader();

    const particleGroup = new SPE.Group({
      texture: {
        value: loader.load(snowflake),
      },
      // fog fix: https://github.com/squarefeet/ShaderParticleEngine/pull/132/files
      fog: true,
      maxParticleCount: 3000,
    });

    const emitter = new SPE.Emitter({
      maxAge: {
        value: 16,
      },
      position: {
        value: new Vector3(0, 6, 0),
        spread: new Vector3(9, 0, 9),
      },

      rotation: {
        //axis: new THREE.Vector3( 0, 1, 0 ),
        //spread: new THREE.Vector3( 0, 720, 0 ),
        //angle: 100 * Math.PI / 180,
      },

      acceleration: {
        value: new Vector3(0, -0.02, 0),
        //spread: new THREE.Vector3( 0, -10, 0 )
      },

      velocity: {
        value: new Vector3(0, -0.04, 0),
        spread: new Vector3(0.5, -0.01, 0.2),
      },

      color: {
        value: [new Color(0xccccff)],
      },

      opacity: {
        value: [1, 0.5],
      },

      size: {
        value: [0.05, 0.1],
        spread: [0.05, 0.1],
      },
      activeMultiplier: 0.5,
      particleCount: 3000,
    });

    particleGroup.addEmitter(emitter);
    emitter.enabled = true;
    scene.add(particleGroup.mesh);
    // particleGroupCrash.tick( 28 );
    particleGroup.tick(16);

    // smokeEmitter.disable();
    // particleGroup.mesh.frustumCulled = false;
    this.emitter = emitter;
    this.particleGroup = particleGroup;

    this.stop = function () {
      emitter.disable();
    };

    this.start = function () {
      // sound.play();
      emitter.enable();
    };

    this.update = function (delta) {
      if (particleGroup) {
        particleGroup.tick(delta);
      }
    };
  }
}
