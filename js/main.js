require.config({
    // Default load path for js files
    baseUrl: 'js/app',
    // export globals
    shim: {
        // --- Use shim to mix together all THREE.js subcomponents
        'threeCore': {exports: "THREE"},
        'OrbitControls': {deps: ['threeCore'], exports: "THREE"},
        // --- end THREE sub-components
        'detector': { exports: 'Detector' },
        'Stats': {exports: "Stats"},
        'TWEEN': {exports: "TWEEN"},
        'ShaderParticleEngine': {deps: ['threeCore'], exports: "SPE"},
        'csg': {deps: ['threeCore'] }, //, exports: "SPE"},
        'ThreeCSG': {deps: ['threeCore'], exports: "ThreeBSP" },
        'threex.skydomeshader': {deps: ['threeCore'], exports: "THREEx"},

    },
    // Third party code lives in js/lib
    paths: {
        'jquery': "http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min",
        'dat': "../lib/dat.gui.min",
        'TWEEN': "../lib/tween.min",
        // --- start THREE sub-components
        // 'threeCore': "../../scripts/three.js/build/three.min",
        'threeCore': "../lib/three/three",
        // 'threeCore': "../../scripts/three.js/build/three.minr73",
        // 'threeCore': "../../scripts/three.js/build/three.ci",
        'three': "../lib/three",
        'OrbitControls': "../lib/three/controls/OrbitControls",
        'Stats': "../lib/three/stats.min",
        'detector': "../lib/three/Detector",
        'ShaderParticleEngine': "../lib/SPE.min",
        'csg': "../lib/csg.js",
        'ThreeCSG': "../lib/ThreeCSG",
        'threex.skydomeshader': "../lib/threex.skydomeshader"
        // --- end THREE sub-components

    }
});

require([
    // Load our app module and pass it to our definition function
    'app',
	'detector',
], function (App,Detector) {

	if ( ! Detector.webgl ) {
	
		// loadingScreen.container.style.display = "none";
		// message.style.display = "none";
		// loadingScreen.message.innerHTML = "<h1>No webGL, no panoglobe! :(</h1>";
		Detector.addGetWebGLMessage();
		
	} else {
		
		// The "app" dependency is passed in as "App"
		App.initialize();
		// App.animate();

	}
	
});