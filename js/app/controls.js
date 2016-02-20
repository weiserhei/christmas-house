/**
 * Setup the control method
 */
define(["three","camera","container"], function (THREE, camera, container) {

    'use strict';

	// CONTROLS

	var controls = new THREE.OrbitControls( camera, container );
	controls.enableDamping = true;
	controls.rotateSpeed = 0.15;
	controls.dampingFactor = 0.1;
	controls.target.set( 0, 0.7, 0 );
	controls.maxPolarAngle = 1.03 * Math.PI/2;
	controls.minDistance = 2;
	controls.maxDistance = 9;

	// http://www.w3schools.com/cssref/playit.asp?filename=playcss_cursor&preval=alias
	container.style.cursor = "grab";
	// chrome
	container.style.cursor = "-webkit-grab";

	// controls.constraint.dollyIn( 1.3 );
	// controls.enablePan = false;
	// controls.enableKeys = false;
	// controls.minDistance	= 200;
	// controls.maxDistance	= 700;
	// controls.zoomSpeed	= 0.3;
	// controls.rotateSpeed = 0.5;

	// smooth Zoom
	// controls.constraint.smoothZoom = true;
	// controls.constraint.zoomDampingFactor = 0.2;
	// controls.constraint.smoothZoomSpeed = 2.0;

	// controls.target.set( 0, 10, 0 );

    return controls;
});