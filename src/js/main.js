import "./../style.css";
import {
  Scene,
  BoxGeometry,
  Mesh,
  Clock,
  TextureLoader,
  SphereGeometry,
  Fog,
  FogExp2,
  MeshLambertMaterial,
  Vector3,
  MathUtils,
} from "three";

import { Sky } from "three/addons/objects/Sky.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
// import * as THREEx from "./libs/threex.skydomeshader";

import { WebGL } from "three/addons";
import Stats from "three/addons/libs/stats.module.js";
import Controls from "./classes/controls";
import Renderer from "./classes/renderer";
import Camera from "./classes/camera";
import InteractionController from "./classes/interactionController";
import Particles from "./utils/snowParticles.js";
// import Particles from "./utils/smokeSPE.js";
// import SnowParticles from "./utils/snowSPE";
import * as Lights from "./utils/lights";
import House from "./classes/house";

import logoImg from "../assets/img/threejs.png";

if (WebGL.isWebGL2Available()) {
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

  // const particles = {};
  const particles = new Particles(scene);
  // const particles2 = new SnowParticles(scene);

  // Add Sky
  let sky = new Sky();
  sky.scale.setScalar(450000);
  scene.add(sky);

  let sun = new Vector3();

  /// GUI

  const effectController = {
    turbidity: 3,
    rayleigh: 0.46,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.619,
    elevation: 30.3,
    azimuth: 180,
    // exposure: 0.5452,
    exposure: 1,
    // turbidity: 10,
    // rayleigh: 3,
    // mieCoefficient: 0.005,
    // mieDirectionalG: 0.7,
    // elevation: 2,
    // azimuth: 180,
    // exposure: renderer.threeRenderer.toneMappingExposure,
  };

  function guiChanged() {
    const uniforms = sky.material.uniforms;
    uniforms["turbidity"].value = effectController.turbidity;
    uniforms["rayleigh"].value = effectController.rayleigh;
    uniforms["mieCoefficient"].value = effectController.mieCoefficient;
    uniforms["mieDirectionalG"].value = effectController.mieDirectionalG;

    const phi = MathUtils.degToRad(90 - effectController.elevation);
    const theta = MathUtils.degToRad(effectController.azimuth);

    sun.setFromSphericalCoords(1, phi, theta);

    uniforms["sunPosition"].value.copy(sun);

    renderer.threeRenderer.toneMappingExposure = effectController.exposure;
  }
  // const gui = new GUI();
  // gui.add(effectController, "turbidity", 0.0, 20.0, 0.1).onChange(guiChanged);
  // gui.add(effectController, "rayleigh", 0.0, 4, 0.001).onChange(guiChanged);
  // gui
  //   .add(effectController, "mieCoefficient", 0.0, 0.1, 0.001)
  //   .onChange(guiChanged);
  // gui
  //   .add(effectController, "mieDirectionalG", 0.0, 1, 0.001)
  //   .onChange(guiChanged);
  // gui.add(effectController, "elevation", 0, 90, 0.1).onChange(guiChanged);
  // gui.add(effectController, "azimuth", -180, 180, 0.1).onChange(guiChanged);
  // gui.add(effectController, "exposure", 0, 1, 0.0001).onChange(guiChanged);
  guiChanged();

  // SKYBOX
  // const skyGeo = new SphereGeometry(400, 32, 15);
  // const skyMat = THREEx.skyDomeShaderMaterial();

  // const sky = new Mesh(skyGeo, skyMat);
  // scene.add(sky);
  // scene.fog = new Fog(skyMat.uniforms.bottomColor.value, 1, 7);
  scene.fog = new FogExp2(0xfafaff, 0.15);

  Lights.default(scene);

  const T_logo = textureLoader.load(logoImg);
  const logo = new Mesh(
    new BoxGeometry(0.2, 0.1, 0.01),
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
  const ic = new InteractionController(scene, camera.threeCamera, container);

  function update(delta) {
    particles.update();
    // particles2.update(delta);
    controls.threeControls.update();
    ic.update(delta);
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
