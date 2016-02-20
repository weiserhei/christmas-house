/**
 * Core application handling
 * Initialize scene and Configurator
 */
define([
    "three",
    "TWEEN",
    "scene",
    "camera",
    "renderer",
    "controls",
    "stats",
    "threex.skydomeshader",
    "ShaderParticleEngine",
    "clock",
    "lights",
    "container",
    "snowParticles",
    "smokeParticles",
], function ( THREE, TWEEN, scene, camera, renderer, controls, stats, THREEx, SPE, clock, lights, container, snowParticles, smokeParticles ) {
	
	'use strict';
	// variables used in init()
	var particleGroup = snowParticles, 
		particleGroupCrash = smokeParticles;
	var raycaster = new THREE.Raycaster();
	var mouseVector = new THREE.Vector2();
	var interactionObjects = [];

    var initialize = function () {

		// LOADING MANAGER
		var loadingManager = new THREE.LoadingManager ();

		loadingManager.onProgress= function ( item, loaded, total ) {
			// progressbar.style.width = 1 / ( total / loaded ) * barwidth +"px";
		};

		loadingManager.onLoad = function () {

			animate();

			function tweenCamera ( camera, newPosition ) {

				new TWEEN.Tween( camera.position ).to( {
					x: newPosition.x,
					y: newPosition.y,
					z: newPosition.z
					}, 500 )
					.easing( TWEEN.Easing.Sinusoidal.InOut)
					// .easing( TWEEN.Easing.Quadratic.InOut)
					// .easing( TWEEN.Easing.Elastic.Out)
					.start();

			}

			camera.position.y = 1;
			var newPosition = camera.position.clone();
			newPosition.y = 0.504;

			tweenCamera( camera, newPosition );

		};
		
		// FLOOR
		// var textureLoader = new THREE.TextureLoader();
		// var floorTexture = textureLoader.load( 'img/checkerboard.jpg' );
		// floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
		// floorTexture.repeat.set( 10, 10 );
		// var floorMaterial = new THREE.MeshBasicMaterial( { color: 0x444444, map: floorTexture, side: THREE.DoubleSide } );
		var floorMaterial = new THREE.MeshBasicMaterial( { color: 0xEEEEEE, side: THREE.DoubleSide } );
		var floorGeometry = new THREE.PlaneBufferGeometry(10, 10, 1, 1);
		// var floorGeometry = new THREE.BoxGeometry( 10, 0.5, 10 );

		// var shadedFloorMaterial = new THREE.MeshLambertMaterial( { color: 0xEEEEEE } );
		// shadedFloorMaterial.color.setHex( 0xAAAAAA );

		// var floorMat = new THREE.MultiMaterial( [ 
		//                                        // left				// right
		//                                        shadedFloorMaterial, shadedFloorMaterial,
		//                                        // top				// bottom
		//                                        floorMaterial, shadedFloorMaterial,
		//                                        // back				// front
		//                                        shadedFloorMaterial, shadedFloorMaterial,
		//                                        ] );

		var floor = new THREE.Mesh(floorGeometry, floorMaterial);
		// floor.position.y = -0.25;
		floor.rotation.x = Math.PI / 2;
		scene.add(floor);
		floor.receiveShadow = true;

		// SKYDOME	
		//renderer.gammaInput = true;
		renderer.gammaOutput = true;

		var skyGeo = new THREE.SphereBufferGeometry( 400, 32, 15 );
		var skyMat = THREEx.skyDomeShaderMaterial();

		var sky = new THREE.Mesh( skyGeo, skyMat );
		scene.add( sky );
		
		scene.fog = new THREE.Fog( 0xc1c1c1, 4, 20 );
		scene.fog.color.copy( skyMat.uniforms.bottomColor.value );

		// CONTAINER BOX
		// var material = new THREE.MeshBasicMaterial( { wireframe: true, transparent: true, opacity: 0.5 } );
		// var box = new THREE.Mesh( new THREE.BoxGeometry( 10, 6, 10 ), material );
		// box.position.set( 0, 3, 0 );
		// scene.add( box );

		// GEOMETRY

		var house = new THREE.Object3D();
		scene.add( house );
		
		// var material = new THREE.MeshBasicMaterial( { color: 0xFF1111, wireframe: false } );
		var material = new THREE.MeshLambertMaterial( { color: 0xFF1111, wireframe: false } );
		// var material = new THREE.MeshPhongMaterial( { color: 0xFF1111, wireframe: false } );
		var basicMaterial = new THREE.MeshBasicMaterial( { color: 0xFF1111, wireframe: false } );
		
		// ROOF
		var size = 0.25;
		var geometry = new THREE.CylinderGeometry( 0, size*3, size*3, 4 );
		var cylinder = new THREE.Mesh( geometry, basicMaterial.clone() );
		cylinder.material.color.setHex( 0xFFFFFF );
		cylinder.rotation.y = 45 * Math.PI / 180;
		cylinder.position.set( 0, 1 + 0.35, 0 );
		house.add( cylinder );
		
		// CHIMNEY
		var geometry = new THREE.BoxGeometry( 0.2, 0.4, 0.2 );
		var kamin = new THREE.Mesh( geometry, cylinder.material.clone() );
		kamin.material.color.setHex( 0xdae0e6 );
		kamin.position.set( -0.35, 1.2 , 0 );
		house.add( kamin );
		interactionObjects.push( kamin );
		kamin.userData.interact = function() {

			if( particleGroupCrash.emitters[0].enabled ) {
				tweenY ( this, -180 * Math.PI / 180 );
				// crashemitter.disable();
				particleGroupCrash.emitters[0].disable();
			} else {
				tweenY ( this, 0 * Math.PI / 180 );
				// crashemitter.enable();
				particleGroupCrash.emitters[0].enable();
			}
			particleGroupCrash.emitters[0].enabled = !particleGroupCrash.emitters[0].enabled;

		}.bind( kamin );

		// INNER CHIMNEY
		var geometry = new THREE.CylinderGeometry( 0.08, 0.08, 0.1, 8 );
		var loch = new THREE.Mesh( geometry, material.clone() );
		loch.material.color.setHex( 0x222222 );
		loch.position.set( -0.35, 1.351, 0 );
		house.add( loch );


		// SKYBOX
		// var imagePrefix = "assets/textures/cube/pisa/";
		// var imageSuffix = ".png";
		// var imagePrefix = "img/sunnysky/";
		// var directions  = [ "px", "nx", "py", "ny", "pz", "nz" ];
		// // var imagePrefix = "assets/textures/cube/Bridge2/";
		// // var directions  = [ "posx", "negx", "posy", "negy", "posz", "negz" ];
		// var imageSuffix = ".jpg";

		// var urls = [];
		// for ( var i = 0; i < 6; i++ ){
		// 	urls.push( imagePrefix + directions[i] + imageSuffix );
		//  }

		// var loader = new THREE.CubeTextureLoader( loadingManager );
		// var textureCube = loader.load( urls );

		// TESTS
		var loader = new THREE.TextureLoader( loadingManager );

		var url = "img/07.jpg"; // white appartment
		var url = "img/sky-dome-panorma.jpg";
		var textureCube = loader.load( url );

		// textureCube.format = THREE.RGBAFormat;
		textureCube.mapping = THREE.EquirectangularReflectionMapping;
		// textureCube.mapping = THREE.SphericalReflectionMapping;

		// WINDOW
		var windowgeometry = new THREE.BoxGeometry( 0.2, 0.2, 0.1 );
		windowgeometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0.25, -0.1, -0.5 ) );
		var windo = new THREE.Mesh( windowgeometry, material.clone() );

		// windo.material = new THREE.MeshPhongMaterial();
		windo.material.color.setHex( 0xdae0e6 );
		windo.material.transparent = true;
		windo.material.opacity = 0.4;
		windo.material.envMap = textureCube;
		// windo.position.set( 0, 0.325, 0.05 );
		windo.position.set( 0, 0.5, 0.05 );
		// windo.updateMatrix();
		house.add( windo );

		// DOOR CUT GEOMETRY
		var doorGeometry = new THREE.BoxGeometry( 0.3, 0.5, 0.1 );
		doorGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( -0.15, -0.2, -0.5 ) );

		var mergeGeometry = new THREE.Geometry();
		mergeGeometry.merge( windo.geometry );
		mergeGeometry.merge( doorGeometry );
		// mergeGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0.5, 0 ) );

		// HOUSE
		var roomGeometry = new THREE.BoxGeometry( 1, 1, 1 );
		// roomGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0.5, 0 ) );
		var box = new THREE.Mesh( roomGeometry );
		// box.position.set( 0, 0.5, 0 );

		// var cutgeo = new THREE.BoxGeometry( 0.9, 0.9, 0.9 );
		var cutgeo = box.clone();
		cutgeo.scale.multiplyScalar( 0.9 );

		var cube_bsp = new ThreeBSP( box );
		var subtract_bsp = new ThreeBSP( cutgeo );

		var result = cube_bsp.subtract( subtract_bsp );
		var mesh = result.toMesh();
		
		var cube_bsp = new ThreeBSP( mesh );

		var sub = new THREE.Mesh( mergeGeometry );
		var subtract_bsp = new ThreeBSP( sub );
		var result = cube_bsp.subtract( subtract_bsp );
		var mesh = result.toMesh( material );

		// mesh.geometry.computeVertexNormals();
		// var material = new THREE.MeshLambertMaterial({wireframe:true})
		// mesh.material = material;
		// mesh.material.shading = THREE.FlatShading;
		mesh.position.set( 0, 0.5, 0 );
		house.add( mesh );

		house.traverse( function( object) {
			object.castShadow = true;
			// mobile phone cant cast & receive Shadow
			// object.receiveShadow = true;
		});

		// DOOR
		doorGeometry.center();
		// SHIFT GEOMETRY SO THE CENTROID ( ROTATION AXIS ) IS ON THE EDGE
		doorGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0.2, 0, 0 ) );

		var mat1 = material.clone();
		mat1.color.setHex( 0x876a14 );

		var mat2 = material.clone();
		mat2.color.setHex( 0xffffff );
		mat2.envMap = textureCube;
		mat2.reflectivity = 0.8;

		var doorMaterial = new THREE.MultiMaterial( [ 
		                                           mat1, mat1, mat1,
		                                           mat1, mat1, mat1,
		                                           mat2, mat2, mat2, 
		                                           ] );

		// var geometry = new THREE.SphereBufferGeometry( 0.02, 16, 16 );
		var knobGeometry = new THREE.CylinderGeometry( 0.02, 0.02, 0.01, 16 );
		knobGeometry.applyMatrix( new THREE.Matrix4().makeRotationX( Math.PI / 2 ) );
		knobGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0.3, 0, -0.05 ) );

		doorGeometry.merge( knobGeometry, knobGeometry.matrix, 6 );

		var door = new THREE.Mesh( doorGeometry, doorMaterial );
		door.position.set( -0.35, 0.3, -0.45 );
		// door.rotation.y = -90 * Math.PI / 180;
		house.add( door );
		
		interactionObjects.push( door );

		door.userData.interact = function() {

			if( this.rotation.y == 0 ) {
				tweenY ( this, -75 * Math.PI / 180 );
				// object.rotation.y -= 65 * Math.PI / 180;
			} else {
				tweenY ( this, 0 );
				// object.rotation.y = 0;
			}

		}.bind( door );

		// windo.material = new THREE.MeshPhongMaterial();
		// windo.material.color.setHex( 0xdae0e6 );
		// windo.material.transparent = true;
		// windo.material.opacity = 0.4;
		// windo.material.envMap = textureCube;


		// POST
		var postBoxCapGeometry = new THREE.CylinderGeometry( 0.04, 0.04, 0.22, 32, 1, false, 0, Math.PI );
		postBoxCapGeometry.applyMatrix( new THREE.Matrix4().makeRotationZ( 90 * Math.PI / 180 ) );
		postBoxCapGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0.2, 0 ) );

		var postBoxGeometry = new THREE.BoxGeometry( 0.22, 0.04, 0.08 );
		postBoxGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0.18, 0 ) );
		postBoxGeometry.merge( postBoxCapGeometry );

		var postBoxPoleGeometry = new THREE.CylinderGeometry( 0.02, 0.02, 0.16 );
		postBoxPoleGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0.08, 0 ) );

		var postGeometry = new THREE.Geometry();
		postGeometry.merge( postBoxPoleGeometry, postBoxPoleGeometry.matrix, 0 );
		postGeometry.merge( postBoxGeometry, postBoxGeometry.matrix, 1 );

		var mat1 = material.clone();
		mat1.color.setHex( 0x5b0202 );
		var mat2 = material.clone();
		mat2.color.setHex( 0x876a14 );

		var multiMaterial = new THREE.MultiMaterial( [ mat2, mat1, mat1, mat1, mat1, mat1, mat1 ] );
		var post = new THREE.Mesh( postGeometry, multiMaterial );
		post.position.set( 0.3, 0, -1 );
		post.castShadow = true;
		scene.add( post );
		interactionObjects.push( post );

		post.userData.interact = function() {

			if( this.rotation.y == 0 ) {
				tweenY ( this, -360 * Math.PI / 180 );

				// object.rotation.y -= 65 * Math.PI / 180;
			} else {
				tweenY ( this, 0 );
				// object.rotation.y = 0;
			}

		}.bind( post );

		var roadGeometry = new THREE.BoxGeometry( 10, 0.01, 1 );
		var stripGeometry = new THREE.BoxGeometry( 0.7, 0.01, 0.1 );
		
		var total = 6;
		for ( var i = 0; i < total; i++ ) {
			
			var ht = total / 2;
			
			var clone = stripGeometry.clone();
			clone.applyMatrix( new THREE.Matrix4().makeTranslation( i * 1.7 - ht - 1, 0.01, 0 ) );
			roadGeometry.merge( clone, clone.matrix, 6 );
			
		}

		var roadMaterial = material.clone();
		var asphaltMaterial = basicMaterial.clone();
		asphaltMaterial.color.setHex( 0xa1aeb3 );
		var stripMaterial = basicMaterial.clone();
		stripMaterial.color.setHex( 0xdae0e6 );

		var roadMaterial = new THREE.MultiMaterial( [ 
		                                           asphaltMaterial, asphaltMaterial, asphaltMaterial, 
		                                           asphaltMaterial, asphaltMaterial, asphaltMaterial,
		                                           stripMaterial, stripMaterial, stripMaterial, 
		                                           stripMaterial, stripMaterial, stripMaterial
		                                           ] );

		var road = new THREE.Mesh( roadGeometry, roadMaterial );
		scene.add( road );
		road.position.set( 0, 0, -2.5 );

	};

	window.addEventListener( 'touchstart', touchstart, false );
	window.addEventListener( 'mousemove', onMouseMove, false );
	window.addEventListener( 'mousedown', onMouseDown, false );


	function touchstart( event ) {
		raycast( event );
	}

	function onMouseDown( event ) {	

		if( event.button === 1 ) {
			//middle mouse
			return;
		}

		raycast( event );
	}

	function onMouseMove( e ) {

		mouseVector.x = 2 * (e.clientX / window.innerWidth) - 1;
		mouseVector.y = 1 - 2 * ( e.clientY / window.innerHeight );

		// update the picking ray with the camera and mouse position	
		raycaster.setFromCamera( mouseVector, camera );	

		// calculate objects intersecting the picking ray
		var intersects = raycaster.intersectObjects( interactionObjects, true );

		if ( intersects.length > 0 ) {
			// http://www.w3schools.com/cssref/playit.asp?filename=playcss_cursor&preval=alias
			container.style.cursor = "pointer";
			// chrome
		} else {
			container.style.cursor = "initial";
			// container.style.cursor = "-webkit-grab";
		}

	}

	function tweenY ( object, rotation ) {

		new TWEEN.Tween( object.rotation ).to( {
			x: 0,
			y: rotation,
			z: 0}, 800 )
			.easing( TWEEN.Easing.Sinusoidal.InOut)
			// .easing( TWEEN.Easing.Quadratic.InOut)
			// .easing( TWEEN.Easing.Elastic.Out)
			.start();

	}

	function raycast( e ) {

		mouseVector.x = 2 * (e.clientX / window.innerWidth) - 1;
		mouseVector.y = 1 - 2 * ( e.clientY / window.innerHeight );

		// update the picking ray with the camera and mouse position	
		raycaster.setFromCamera( mouseVector, camera );	

		// calculate objects intersecting the picking ray
		var intersects = raycaster.intersectObjects( interactionObjects, true );
		
		if ( intersects.length > 0 ) {

			var object = intersects[ 0 ].object;

			object.userData.interact();
		
		}
	}

    var animate = function () {

		requestAnimationFrame( animate );
		var delta = clock.getDelta();
		particleGroup.tick( delta );
		particleGroupCrash.tick( delta );
		stats.update();
		TWEEN.update();
		controls.update();
		renderer.render( scene, camera );

    };

    return {
        initialize: initialize,
        animate: animate
    }
});