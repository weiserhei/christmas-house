import './../css/style.css';

import { 
	Scene,
	Clock,
	TextureLoader,
	MeshBasicMaterial,
	MeshLambertMaterial,
	MeshPhongMaterial,
	SphereBufferGeometry,
	Mesh,
	Fog,
	FogExp2,
	BoxBufferGeometry,
	PointLight,
	DirectionalLight,
	HemisphereLight,
	Vector2,
	Raycaster,
} from 'three';

import { WEBGL } from 'three/examples/jsm/WebGL.js';
import Stats from 'stats.js';
import TWEEN from '@tweenjs/tween.js';

import Controls from './classes/controls';
import Renderer from './classes/renderer';
import Camera from './classes/camera';
import Particles from './utils/smokeParticles';
import SnowParticles from './utils/snowParticles';

// var url = "img/07.jpg"; // white appartment
import logoImg from "../img/threejs.png";
import House from './classes/house';

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
	const mouseVector = new Vector2();
	const raycaster = new Raycaster();

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

	var hemiLight = new HemisphereLight( 0xffffff, 0xffffff, 0.6 );
    hemiLight.color.setHSL( 0.6, 1, 0.6 );
    hemiLight.groundColor.setHSL( 0.095, 0.8, 0.5 );
    hemiLight.position.set( 0, 5, 0 );
	scene.add( hemiLight );
	var dirLight = new DirectionalLight( 0xFFFFFF, 1 );
    dirLight.color.setHSL( 0.6, 0.1, 1 );
    dirLight.position.set( -1, 1.75, -1 );
    dirLight.position.multiplyScalar( 5 );
    scene.add( dirLight );
    dirLight.castShadow = true;
    // dirLight.shadow.mapSize.width = 2048;
	// dirLight.shadow.mapSize.height = 2048;
	var d = 2;

    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;

    dirLight.shadow.camera.far = 35;
    dirLight.shadow.camera.near = 1;
    // dirLight.shadow.bias = -0.0001;
	dirLight.shadow.radius = 2;

	var pointLight = new PointLight( 0xFFFF55, 3 );
	pointLight.distance = 1.5; // distance has no effect - bug?
	pointLight.position.set( 0, 0.4, 0 );
	// pointLight.castShadow = true;
	scene.add( pointLight );

	const textureLoader = new TextureLoader();
	const interactionObjects = [];
	
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
		
	new House(scene, textureLoader, interactionObjects, particles);

	window.addEventListener( 'touchstart', touchstart, true );
	window.addEventListener( 'mousemove', onMouseMove, false );
	window.addEventListener( 'mousedown', onMouseDown, false );

	function touchstart( e ) {
		if( e.touches.length > 0 ) {
			interact( e.touches[0].pageX, e.touches[0].pageY );
		}
	}

	function onMouseDown( e ) {	
		if( e.button === 1 ) {
			//middle mouse
			return;
		}
		interact( e.clientX, e.clientY );
	}

	function onMouseMove( e ) {
		const intersects = raycast( e.clientX, e.clientY );
		if ( intersects.length > 0 && intersects[0].object.userData.interact != undefined ) {
			// http://www.w3schools.com/cssref/playit.asp?filename=playcss_cursor&preval=alias
			container.style.cursor = "pointer";
		} else {
			container.style.cursor = "initial";
		}
	}

	function interact( x, y ) {
		const intersects = raycast( x, y );
		// calculate objects intersecting the picking ray
		if ( intersects.length > 0 && intersects[0].object.userData.interact != undefined ) {
			intersects[ 0 ].object.userData.interact();
		}
	}

	function raycast( x, y ) {
		mouseVector.x = 2 * (x / window.innerWidth) - 1;
		mouseVector.y = 1 - 2 * (y / window.innerHeight );
		// mouseVector.x = 2 * (e.clientX / container.offsetWidth) - 1;
		// mouseVector.y = 1 - 2 * ( e.clientY / container.offsetHeight );
		// update the picking ray with the camera and mouse position	
		raycaster.setFromCamera( mouseVector, camera.threeCamera );	
		// calculate objects intersecting the picking ray
		// return raycaster.intersectObjects( interactionObjects, true );
		return raycaster.intersectObjects( scene.children, true );
	}

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
