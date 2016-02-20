// variables used in init()
var scene, camera, renderer, stats, clock, controls;

var particleGroup, particleGroupCrash;

// Setup the scene
function init() {

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 10000);
	camera.position.z = -8;
	camera.position.y = 1.8;

	camera.position.z = -3.738;
	camera.position.y = 0.504;
	camera.position.x = -1.767;

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    //renderer.setClearColor(0xaaaaaa);
	renderer.shadowMap.enabled = true;
	// renderer.shadowMap.type = THREE.BasicShadowMap;
	// renderer.shadowMap.type = THREE.PCFShadowMap;

    stats = new Stats();
    clock = new THREE.Clock();

    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0';

    document.body.appendChild( renderer.domElement );
    document.body.appendChild( stats.domElement );
	
	// CONTROLS
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.enableDamping = true;
	controls.rotateSpeed = 0.15;
	controls.dampingFactor = 0.1;
	controls.target.set( 0, 0.7, 0 );
	controls.maxPolarAngle = 1.03 * Math.PI/2;
	controls.minDistance = 2;
	controls.maxDistance = 9;

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
	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.position.y = 0;
	floor.rotation.x = Math.PI / 2;
	scene.add(floor);
	floor.receiveShadow = true;	

	// LIGHTS

	hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
	hemiLight.color.setHSL( 0.6, 1, 0.6 );
	hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
	hemiLight.position.set( 0, 5, 0 );
	scene.add( hemiLight );

	//

	dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
	dirLight.color.setHSL( 0.1, 1, 0.45 );
	dirLight.position.set( -1, 1.75, -1 );
	dirLight.position.multiplyScalar( 5 );
	scene.add( dirLight );

	dirLight.castShadow = true;

	dirLight.shadowMapWidth = 2048;
	dirLight.shadowMapHeight = 2048;

	var d = 5;

	dirLight.shadowCameraLeft = -d;
	dirLight.shadowCameraRight = d;
	dirLight.shadowCameraTop = d;
	dirLight.shadowCameraBottom = -d;

	dirLight.shadowCameraFar = 35;
	dirLight.shadowCameraNear = 1;
	dirLight.shadowBias = -0.0001;
	dirLight.shadowDarkness = 0.1;


	function createLight( color ) {

		var pointLight = new THREE.PointLight( color, 3, 2 );
		// pointLight.castShadow = true;
		// pointLight.shadowCameraNear = 0.1;
		// pointLight.shadowCameraFar = 3;
		// pointLight.shadowMapWidth = 2048;
		// pointLight.shadowMapHeight = 2048;
		// pointLight.shadowBias = 0.01;
		// pointLight.shadowDarkness = 0.5;

		// var geometry = new THREE.SphereGeometry( 0.1, 32, 32 );
		// var material = new THREE.MeshBasicMaterial( { color: color } );
		// var sphere = new THREE.Mesh( geometry, material );
		// pointLight.add( sphere );

		return pointLight

	}

	// pointLight = createLight( 0xFFAA00 );
	pointLight = createLight( 0xFFFF55 );
	pointLight.position.set( 0, 0.4, 0 );
	scene.add( pointLight );

	// var light = new THREE.SpotLight( 0xFFAA00, 2 );
	// scene.add( light );
	// light.position.set( 0, 0.9, 0 );

	// light.angle = 0.6 * Math.PI/2;
	// light.distance = light.position.y + 2;
	// light.exponent = 10;
	// light.shadowDarkness = 0.1;
	// light.castShadow = true;


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

	interactionObjects = [];

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
	kamin.name = "kamin";
	house.add( kamin );
	interactionObjects.push( kamin );

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
	var geometry = new THREE.BoxGeometry( 0.3, 0.5, 0.1 );
	geometry.applyMatrix( new THREE.Matrix4().makeTranslation( -0.15, -0.2, -0.5 ) );

	var mergeGeometry = new THREE.Geometry();
	mergeGeometry.merge( windo.geometry );
	mergeGeometry.merge( geometry );
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
	geometry.center();
	// SHIFT GEOMETRY SO THE CENTROID ( ROTATION AXIS ) IS ON THE EDGE
	geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0.2, 0, 0 ) );
	var door = new THREE.Mesh( geometry, material.clone() );
	door.position.set( -0.35, 0.3, -0.45 );
	door.material.color.setHex( 0x876a14 );
	door.name = "door";
	// door.rotation.y = -90 * Math.PI / 180;
	house.add( door );
	interactionObjects.push( door );

	// windo.material = new THREE.MeshPhongMaterial();
	// windo.material.color.setHex( 0xdae0e6 );
	// windo.material.transparent = true;
	// windo.material.opacity = 0.4;
	// windo.material.envMap = textureCube;

	// var geometry = new THREE.SphereBufferGeometry( 0.02, 16, 16 );
	var geometry = new THREE.CylinderGeometry( 0.02, 0.02, 0.01, 16 );
	geometry.applyMatrix( new THREE.Matrix4().makeRotationX( Math.PI / 2 ) );
	var knob = new THREE.Mesh( geometry, material.clone() );
	knob.material.color.setHex( 0xffffff );
	knob.material.envMap = textureCube;
	knob.material.reflectivity = 0.8;
	knob.position.set( 0.3, 0, -0.05 );
	door.add( knob );

	// POST
	var post = new THREE.Object3D();
	post.position.set( 0.3, 0, -1 );
	post.name = "postkasten";
	scene.add( post );
	interactionObjects.push( post );

	var geometry = new THREE.CylinderGeometry( 0.04, 0.04, 0.22, 32, 1, false, 0, Math.PI );
	var cylinder = new THREE.Mesh( geometry, material.clone() );
	cylinder.material.color.setHex( 0x5b0202 );
	cylinder.position.set( 0, 0.20, 0 );
	cylinder.rotation.z = 90 * Math.PI / 180;
	post.add( cylinder );

	var geometry = new THREE.BoxGeometry( 0.22, 0.04, 0.08 );
	var box = new THREE.Mesh( geometry, cylinder.material.clone() );
	post.add( box );
	box.position.set( 0, 0.18, 0 );
	
	var geometry = new THREE.CylinderGeometry( 0.02, 0.02, 0.16 );
	var cylinder = new THREE.Mesh( geometry, material.clone() );
	cylinder.material.color.setHex( 0x876a14 );
	cylinder.position.set( 0, 0.08, 0 );
	post.add( cylinder );

	post.traverse( function( object) {
		object.castShadow = true;
	});
	
	
	var road = new THREE.Object3D();
	scene.add( road );
	road.position.set( 0, 0, -2.5 );
	
	var geometry = new THREE.BoxGeometry( 10, 0.05, 1 );
	// var material = new THREE.MeshBasicMaterial( { color: 0xa1aeb3 } );
	var mesh = new THREE.Mesh( geometry, basicMaterial.clone() );
	mesh.material.color.setHex( 0xa1aeb3 );
	road.add( mesh );
	
	var geometry = new THREE.BoxGeometry( 0.7, 0.05, 0.1 );
	// var material = new THREE.MeshBasicMaterial( { color: 0xdae0e6 } );
	var mesh = new THREE.Mesh( geometry, basicMaterial.clone() );
	mesh.material.color.setHex( 0xdae0e6 );
	mesh.position.set( 0, 0.01, 0 );
	
	var total = 6;
	for ( var i = 0; i < total; i++ ) {
		
		var ht = total / 2;
		
		var clone = mesh.clone();
		clone.position.set( i * 1.7 - ht - 1, 0.01, 0 );
		road.add( clone );
		
	}


	var textureLoader = new THREE.TextureLoader( loadingManager );
	var url = 'img/snowflake.png';
	var T_snowflake = textureLoader.load( url );

    particleGroup = new SPE.Group({
		texture: {
            value: T_snowflake
        },
		fog: true
	});

	/* Stemkoski Particle Engine Preset */
	/*
	snow :
	{
	positionStyle    : Type.CUBE,
	positionBase     : new THREE.Vector3( 0, 200, 0 ),
	positionSpread   : new THREE.Vector3( 500, 0, 500 ),

	velocityStyle    : Type.CUBE,
	velocityBase     : new THREE.Vector3( 0, -60, 0 ),
	velocitySpread   : new THREE.Vector3( 50, 20, 50 ), 
	accelerationBase : new THREE.Vector3( 0, -10,0 ),

	angleBase               : 0,
	angleSpread             : 720,
	angleVelocityBase       :  0,
	angleVelocitySpread     : 60,

	particleTexture : THREE.ImageUtils.loadTexture( 'images/snowflake.png' ),
		
	sizeTween    : new Tween( [0, 0.25], [1, 10] ),
	colorBase   : new THREE.Vector3(0.66, 1.0, 0.9), // H,S,L
	opacityTween : new Tween( [2, 3], [0.8, 0] ),

	particlesPerSecond : 200,
	particleDeathAge   : 4.0,		
	emitterDeathAge    : 60
	}
	*/
	var emitter = new SPE.Emitter({
        maxAge: {
            value: 16
        },
		position: {
            value: new THREE.Vector3(0, 6, 0),
            spread: new THREE.Vector3( 9, 0, 9 )
        },
		
		rotation: {
			//axis: new THREE.Vector3( 0, 1, 0 ),
			//spread: new THREE.Vector3( 0, 720, 0 ),
			//angle: 100 * Math.PI / 180,
		},

		acceleration: {
            value: new THREE.Vector3(0, -0.02, 0),
            //spread: new THREE.Vector3( 0, -10, 0 )
        },

		velocity: {
            value: new THREE.Vector3(0, -0.04, 0),
            spread: new THREE.Vector3(0.5, -0.01, 0.2)
        },

        color: {
            value: [ new THREE.Color( 0xCCCCFF ) ]
        },
		
		opacity: {
			value: [ 1, 0.8 ]
		},

		size: {
			value: [ 0.05, 0.1 ],
			spread: [ 0.05, 0.1 ]
		},
		activeMultiplier: 0.5,
		particleCount: 3000
	});

	particleGroup.addEmitter( emitter );
	scene.add( particleGroup.mesh );
	particleGroup.tick( 16 );
	
	// Workaround for frustum culling
	// https://github.com/squarefeet/ShaderParticleEngine/issues/51#issuecomment-61577200
	var radius = 15; //the joy of treakable parameter!

	// particleGroup.mesh.geometry.computeBoundingSphere();
	// particleGroup.mesh.geometry.boundingSphere.radius = radius;

	// var helper = new THREE.Mesh( new THREE.SphereBufferGeometry( radius ), new THREE.MeshBasicMaterial ( { wireframe: true } ) );
	// scene.add( helper );
	
	/*
	document.querySelector('.numParticles').textContent =
		'Total particles: ' + emitter.particleCount;
	*/
	
	
	var loader = new THREE.TextureLoader( loadingManager );
	var url = 'img/cloudSml.png';
	var T_cloud = loader.load( url );

	particleGroupCrash = new SPE.Group({
		texture: {
			value: T_cloud
		},
		blending: THREE.NormalBlending
	});

	crashemitter = new SPE.Emitter({

		maxAge: { value: 28 },
		position: { 
			value: new THREE.Vector3( -0.35, 1.4, 0 ),
			spread: new THREE.Vector3( 0.1, 0.05, 0.1 ),
		},
		size: {
			value: [ 0.2, 1 ],
			spread: [ 0, 0.1, 0.2 ]
		},
		acceleration: {
			value: new THREE.Vector3( 0, 0.002, 0 ),
		},
		
		rotation: {
			axis: new THREE.Vector3( 0, -1, 0 ),
			spread: new THREE.Vector3( 0, 0, 0 ),
			angle: 720 * Math.PI / 180,
		},
		
		velocity: {
			value: new THREE.Vector3( 0.03, 0.06, 0.03 ),
			spread: new THREE.Vector3( 0.025, 0.04, 0.025 )
		},
		opacity: {
			value: [ 0.2, 0.4, 0 ]
		},
		color: {
			value: [ new THREE.Color( 0xAAAAAA ), new THREE.Color( 0xFFFFFF ) ],
			spread: [ new THREE.Vector3( 0, 0, 0.1 ), new THREE.Vector3( 0, 0, 0 ) ]
		},
		// activeMultiplier: 0.5,
		particleCount: 2500,
	});
	
	particleGroupCrash.addEmitter( crashemitter );
	crashemitter.enabled = true;
	scene.add( particleGroupCrash.mesh );
	// particleGroupCrash.tick( 28 );

	raycaster = new THREE.Raycaster();
	mouseVector = new THREE.Vector2();

}

window.addEventListener( 'click', onMouseClick, false );
window.addEventListener( 'touchstart', touchstart, false );
// window.addEventListener( 'mousemove', onMouseMove, false );

function touchstart( event ) {
	raycast( event );
}

function onMouseClick( event ) {	

	if( event.button === 1 ) {
		//middle mouse
		return;
	}
	raycast( event );
}

function onMouseMove( e ) {

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

		if ( object.name === "door") {

			if( object.rotation.y == 0 ) {
				tweenY ( object, -75 * Math.PI / 180 );
				// object.rotation.y -= 65 * Math.PI / 180;
			} else {
				tweenY ( object, 0 );
				// object.rotation.y = 0;
			}
		} else if ( object.parent.name === "postkasten" ) {

			if( object.parent.rotation.y == 0 ) {
				tweenY ( object.parent, -360 * Math.PI / 180 );

				// object.rotation.y -= 65 * Math.PI / 180;
			} else {
				tweenY ( object.parent, 0 );
				// object.rotation.y = 0;
			}
			
		} else if ( object.name === "kamin" ) {

			if( crashemitter.enabled ) {
				tweenY ( object, -180 * Math.PI / 180 );
				crashemitter.disable();
			} else {
				tweenY ( object, 0 * Math.PI / 180 );
				crashemitter.enable();
			}
			crashemitter.enabled = !crashemitter.enabled;
		}
	
	}
}



function animate() {

    requestAnimationFrame( animate );
    render( clock.getDelta() );
    stats.update();
	controls.update();
	TWEEN.update();
}


function render( dt ) {
	particleGroup.tick( dt );
	particleGroupCrash.tick( dt );
	renderer.render( scene, camera );
}


window.addEventListener( 'resize', function() {
	var w = window.innerWidth,
		h = window.innerHeight;

	camera.aspect = w / h;
	camera.updateProjectionMatrix();

	renderer.setSize( w, h );				

}, false );

init();