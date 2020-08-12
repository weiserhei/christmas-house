import "./../css/style.css";

import {
  Scene,
  Clock,
  TextureLoader,
  SphereBufferGeometry,
  Mesh,
  Fog,
  BoxBufferGeometry,
  MeshLambertMaterial,
} from "three";
import { WEBGL } from "three/examples/jsm/WebGL.js";
import Stats from "stats.js";
import TWEEN from "@tweenjs/tween.js";
import { THREEx } from "./libs/threex.skydomeshader";

import Controls from "./classes/controls";
import Renderer from "./classes/renderer";
import Camera from "./classes/camera";
import InteractionController from "./classes/interactionController";
import Particles from "./utils/smokeParticles";
import SnowParticles from "./utils/snowParticles";
import * as Lights from "./utils/lights";
import House from "./classes/house";

import logoImg from "../img/threejs.png";

if (WEBGL.isWebGLAvailable()) {
  init();
} else {
  const warning = WEBGL.getWebGLErrorMessage();
  document.body.appendChild(warning);
}

function init() {
  const container = document.body;
  const clock = new Clock();
  let delta = 0;

  const stats = new Stats();
  container.appendChild(stats.dom);

  const scene = new Scene();

  const renderer = new Renderer(container);
  const camera = new Camera(renderer.threeRenderer);
  const controls = new Controls(
    camera.threeCamera,
    renderer.threeRenderer.domElement
  );
  controls.threeControls.update();

  const textureLoader = new TextureLoader();

  const particles = new Particles(scene);
  const particles2 = new SnowParticles(scene);

  // SKYBOX
  const skyGeo = new SphereBufferGeometry(400, 32, 15);
  const skyMat = THREEx.skyDomeShaderMaterial();

  const sky = new Mesh(skyGeo, skyMat);
  scene.add(sky);
  scene.fog = new Fog(skyMat.uniforms.bottomColor.value, 1, 15);

  Lights.default(scene);

  const T_logo = textureLoader.load(logoImg);
  const logo = new Mesh(
    new BoxBufferGeometry(0.2, 0.1, 0.01),
    new MeshLambertMaterial({ map: T_logo })
  );
  logo.position.set(0, 0.3, -0.1);
  let grow = 0;
  logo.userData.update = function (delta) {
    grow += delta;
    logo.position.y = 0.3 + Math.sin(grow * 2) / 20;
    logo.rotation.z = 0.0 + Math.cos(grow) / 2;
  };
  scene.add(logo);

  new House(scene, textureLoader, particles);
  new InteractionController(scene, camera.threeCamera, container);

  function update(delta) {
    TWEEN.update();
    particles.update(delta);
    particles2.update(delta);
    controls.threeControls.update();
    logo.userData.update(delta);
    stats.update();
  }

  function animate() {
    requestAnimationFrame(animate);
    delta = clock.getDelta();
    update(delta);
    renderer.render(scene, camera.threeCamera);
  }

  animate();
}
