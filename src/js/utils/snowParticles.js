import {
  AdditiveBlending,
  BufferGeometry,
  Float32BufferAttribute,
  TextureLoader,
  PointsMaterial,
  Points,
} from "three";
import snowflake from "../../assets/img/snowflake.png";

export default class Particles {
  constructor(scene) {
    let positions = [],
      velocities = [];
    const numSnowflakes = 1000;
    const maxRange = 7,
      minRange = maxRange / 2;
    const minHeight = -5;
    const geometry = new BufferGeometry();
    const textureLoader = new TextureLoader();
    let active = true;

    for (let i = 0; i < numSnowflakes; i++) {
      positions.push(
        Math.floor(Math.random() * maxRange - minRange),
        Math.floor(Math.random() * minRange - minHeight),
        Math.floor(Math.random() * maxRange - minRange)
      );
      velocities.push(
        Math.floor(Math.random() * 6 - 3) * 0.001, // -0,024 to
        Math.floor(Math.random() * 10 + 0.12) * 0.0013,
        Math.floor(Math.random() * 6 - 3) * 0.001
      );
    }
    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geometry.setAttribute(
      "velocities",
      new Float32BufferAttribute(velocities, 3)
    );

    const flakeMaterial = new PointsMaterial({
      size: 0.07,
      map: textureLoader.load(snowflake),
      blending: AdditiveBlending,
      depthTest: false,
      transparent: true,
      opacity: 0.7,
    });

    const particles = new Points(geometry, flakeMaterial);
    scene.add(particles);

    this.active = function (bool) {
      active = bool;
    };

    this.update = function () {
      if (!active) {
        return;
      }
      for (let i = 0; i < numSnowflakes * 3; i += 3) {
        particles.geometry.attributes.position.array[i] -=
          particles.geometry.attributes.velocities.array[i];
        particles.geometry.attributes.position.array[i + 1] -=
          particles.geometry.attributes.velocities.array[i + 1];
        particles.geometry.attributes.position.array[i + 2] -=
          particles.geometry.attributes.velocities.array[i + 2];

        if (particles.geometry.attributes.position.array[i + 1] < 0) {
          particles.geometry.attributes.position.array[i] = Math.floor(
            Math.random() * maxRange - minRange
          );
          particles.geometry.attributes.position.array[i + 1] = Math.floor(
            Math.random() * minRange - minHeight
          );
          particles.geometry.attributes.position.array[i + 2] = Math.floor(
            Math.random() * maxRange - minRange
          );
        }
      }
      particles.geometry.attributes.position.needsUpdate = true;
    };
  }
}
