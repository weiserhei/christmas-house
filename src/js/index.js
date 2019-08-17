import './../css/style.css';

import { 
	Scene,
	Clock,
	TextureLoader,
	MeshPhongMaterial,
	SphereBufferGeometry,
	Mesh,
	Fog,
	BoxBufferGeometry,
} from 'three';

import { WEBGL } from 'three/examples/jsm/WebGL.js';
import Stats from 'stats.js';
import TWEEN from '@tweenjs/tween.js';

import Controls from './classes/controls';
import Renderer from './classes/renderer';
import Camera from './classes/camera';
import InteractionController from './classes/interactionController';
import Particles from './utils/smokeParticles';
import SnowParticles from './utils/snowParticles';
import * as Lights from './utils/lights';
import House from './classes/house';

// var url = "img/07.jpg"; // white appartment
import logoImg from "../img/threejs.png";

if (WEBGL.isWebGLAvailable()) {
    init();
} else {
  const warning = WEBGL.getWebGLErrorMessage();
  document.body.appendChild(warning);
}

function init () {
    
    const container = document.body;
	const clock = new Clock();
	let delta = 0;

    const stats = new Stats();
    container.appendChild( stats.dom );

	const scene = new Scene();
	// scene.background = new THREE.Color(Config.scene.background);
	
	const THREEx = require("./libs/threex.skydomeshader");
	const skyGeo = new SphereBufferGeometry( 400, 32, 15 );
	var skyMat = THREEx.skyDomeShaderMaterial();

	var sky = new Mesh( skyGeo, skyMat );
	scene.add( sky );
	scene.fog = new Fog( skyMat.uniforms.bottomColor.value, 1, 15 );

	const particles = new Particles(scene);
	const particles2 = new SnowParticles(scene);

    const renderer = new Renderer(container);
	const camera = new Camera(renderer.threeRenderer);
	const controls = new Controls(camera.threeCamera, renderer.threeRenderer.domElement);
	controls.threeControls.update();

	Lights.default(scene);

	const textureLoader = new TextureLoader();
	
	const logo = textureLoader.load(logoImg);
	const cube = new Mesh(new BoxBufferGeometry(0.2, 0.1, 0.01), new MeshPhongMaterial({map: logo}));
	cube.castShadow = true;
	cube.position.set(0,0.3,-0.1);
	let grow = 0;
	cube.userData.update = function( delta ) {
		grow += delta;
		cube.position.y = 0.3 + Math.sin(grow * 2) / 20;
		cube.rotation.z = 0.0 + Math.cos(grow) / 2;
	}
	scene.add( cube );
		
	new House(scene, textureLoader, particles);
	new InteractionController(scene, camera.threeCamera, container);

	function update(delta) {
        TWEEN.update();
        particles.update( delta );
        particles2.update( delta );
		controls.threeControls.update();
		cube.userData.update( delta );
		stats.update();
	}

	const animate = function animate() {
		requestAnimationFrame(animate);
		delta = clock.getDelta();
		update(delta);
		renderer.render(scene, camera.threeCamera);
	};

	animate();
}
