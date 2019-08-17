import { 
	MeshBasicMaterial,
	MeshLambertMaterial,
	MeshPhongMaterial,
	Geometry,
	BoxGeometry,
	BoxBufferGeometry,
	CylinderGeometry,
	PlaneBufferGeometry,
	SphereBufferGeometry,
	Mesh,
	Matrix4,
	Object3D,
	EquirectangularReflectionMapping,
    SphericalReflectionMapping,
    DoubleSide,
    ShadowMaterial
} from 'three';
import TWEEN from '@tweenjs/tween.js';
import { CSG } from '@hi-level/three-csg';

import skyPanoImg from "../../img/sky-dome-panorma.jpg";
// import soundSteam from "../../media/steam.ogg";

function tweenY ( object, rotation ) {
    new TWEEN.Tween( object.rotation ).to( {
        x: 0,
        y: rotation,
        z: 0
    }, 800 )
    .easing( TWEEN.Easing.Sinusoidal.InOut)
    // .easing( TWEEN.Easing.Quadratic.InOut)
    // .easing( TWEEN.Easing.Elastic.Out)
    .start();
}

export default class House {
    constructor(scene, textureLoader, particles) {

        const interactionObjects = [];

        const house = new Object3D();
        house.position.set(0,-0.02,0);
        scene.add( house );

        const floorMaterial = new MeshBasicMaterial( { color: 0xEEEEEE, side: DoubleSide } );
        // const floorMaterial = new MeshPhongMaterial( { color: 0xEEEEEE, side: DoubleSide } );
        // const floorMaterial = new MeshPhongMaterial( { color: 0xFFFFFF, side: DoubleSide } );
        const floorGeometry = new PlaneBufferGeometry(10, 10, 1, 1);
        const floor = new Mesh(floorGeometry, floorMaterial);
        // floor.position.y = -0.25;
        floor.rotation.x = Math.PI / 2;
        scene.add(floor);
        floor.receiveShadow = false;
        
        var planeMaterial = new ShadowMaterial();
        planeMaterial.opacity = 0.1;
        
        var plane = new Mesh( floorGeometry, planeMaterial );
        plane.rotation.x = - Math.PI / 2;
        plane.receiveShadow = true;
        plane.position.y = 0.001;
        scene.add( plane );
    
        // var material = new THREE.MeshBasicMaterial( { color: 0xFF1111, wireframe: false } );
        var material = new MeshLambertMaterial( { color: 0xFF1111, wireframe: false } );
        // var material = new THREE.MeshPhongMaterial( { color: 0xFF1111, wireframe: false } );
        var basicMaterial = new MeshBasicMaterial( { color: 0xFF1111, wireframe: false } );

        // ROOF
        var size = 0.25;
        var geometry = new CylinderGeometry( 0, size*3, size*3, 4 );
        var cylinder = new Mesh( geometry, basicMaterial.clone() );
        cylinder.material.color.setHex( 0xFFFFFF );
        cylinder.rotation.y = 45 * Math.PI / 180;
        cylinder.position.set( 0, 1 + 0.35, 0 );
        house.add( cylinder );
        
        // CHIMNEY
        var geometry = new BoxGeometry( 0.2, 0.4, 0.2 );
        const kamin = new Mesh( geometry, cylinder.material.clone() );
        kamin.material.color.setHex( 0xdae0e6 );
        kamin.position.set( -0.35, 1.2 , 0 );
        house.add( kamin );
        interactionObjects.push( kamin );
        kamin.userData.interact = function() {

            if( particles.emitter.enabled ) {
                tweenY ( this, -180 * Math.PI / 180 );
                particles.stop();
            } else {
                tweenY ( this, 0 * Math.PI / 180 );
                particles.start();
            }
            particles.emitter.enabled = !particles.emitter.enabled;

        }.bind( kamin );

        
        // INNER CHIMNEY
        var geometry = new CylinderGeometry( 0.08, 0.08, 0.1, 8 );
        const loch = new Mesh( geometry, material.clone() );
        loch.material.color.setHex( 0x222222 );
        loch.position.set( 0,0.151,0 );
        // loch.position.set( -0.35, 1.351, 0 );
        kamin.add( loch );


        // WINDOW
        const windowgeometry = new BoxGeometry( 0.2, 0.2, 0.06 );
        windowgeometry.applyMatrix( new Matrix4().makeTranslation( 0.25, -0.1, -0.48 ) );
        const windo = new Mesh( windowgeometry, material.clone() );

        const textureCube = textureLoader.load( skyPanoImg, function(texture) {
            windo.material.needsUpdate = true;
        } );
        
        // windo.material = new THREE.MeshPhongMaterial();
        // windo.material.color.setHex( 0xdae0e6 );
        windo.material.color.setHex( 0xFFFFFF );
        windo.material.transparent = true;
        windo.material.opacity = 0.4;
        windo.material.envMap = textureCube;
        textureCube.mapping = EquirectangularReflectionMapping;
        // textureCube.mapping = SphericalReflectionMapping;
        // textureCube.format = THREE.RGBAFormat;

        // windo.position.set( 0, 0.325, 0.05 );
        windo.position.set( 0, 0.5, 0.02 );
        windo.updateMatrix();
        house.add( windo );

        // DOOR CUT GEOMETRY
        const doorGeometry = new BoxGeometry( 0.3, 0.5, 0.1 );
        doorGeometry.applyMatrix( new Matrix4().makeTranslation( -0.15, -0.2, -0.5 ) );

        var mergeGeometry = new Geometry();
        mergeGeometry.merge( windo.geometry );
        mergeGeometry.merge( doorGeometry );
        // mergeGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0.5, 0 ) );

        // HOUSE
        const roomGeometry = new BoxGeometry( 1, 1, 1 );
        // roomGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0.5, 0 ) );
        var box = new Mesh( roomGeometry );
        // box.position.set( 0, 0.5, 0 );
        box.updateMatrix();

        // var cutgeo = new THREE.BoxGeometry( 0.9, 0.9, 0.9 );
        var cutgeo = box.clone();
        cutgeo.scale.multiplyScalar( 0.9 );
        cutgeo.updateMatrix();

        // cut inner box
        var cube_bsp = CSG.fromMesh(box);
        var subtract_bsp = CSG.fromMesh( cutgeo );	
        var result = cube_bsp.subtract( subtract_bsp );
        var mesh = CSG.toMesh( result, box.matrix );
        var cube_bsp = CSG.fromMesh( mesh );

        // cut door and window
        var sub = new Mesh( mergeGeometry );
        sub.updateMatrix();
        var subtract_bsp = CSG.fromMesh( sub );
        var result = cube_bsp.subtract( subtract_bsp );

        var mesh = CSG.toMesh( result, box.matrix );
        mesh.material = material;

        // mesh.geometry.computeVertexNormals();
        // var material = new THREE.MeshLambertMaterial({wireframe:true})
        // mesh.material = material;
        // mesh.material.shading = THREE.FlatShading;
        mesh.position.set( 0, 0.5, 0 );
        house.add( mesh );

        house.traverse( function( object) {
            object.castShadow = true;
            // object.receiveShadow = true;
            // mobile phone cant cast & receive Shadow
            // object.receiveShadow = true;
        });

        // DOOR
        doorGeometry.center();
        // SHIFT GEOMETRY SO THE CENTROID ( ROTATION AXIS ) IS ON THE EDGE
        doorGeometry.applyMatrix( new Matrix4().makeTranslation( 0.2, 0, 0 ) );

        var mat1 = material.clone();
        mat1.color.setHex( 0x876a14 );

        var mat2 = material.clone();
        mat2.color.setHex( 0xffffff );
        mat2.envMap = textureCube;
        mat2.reflectivity = 0.8;

        var doorMaterial = [ 
            mat1, mat1, mat1,
            mat1, mat1, mat1,
            mat2, mat2, mat2, 
        ];

        // var geometry = new THREE.SphereBufferGeometry( 0.02, 16, 16 );
        var knobGeometry = new CylinderGeometry( 0.02, 0.02, 0.01, 16 );
        knobGeometry.applyMatrix( new Matrix4().makeRotationX( Math.PI / 2 ) );
        knobGeometry.applyMatrix( new Matrix4().makeTranslation( 0.3, 0, -0.05 ) );

        doorGeometry.merge( knobGeometry, knobGeometry.matrix, 6 );

        const door = new Mesh( doorGeometry, doorMaterial );
        door.position.set( -0.35, 0.3, -0.45 );
        // door.rotation.y = -90 * Math.PI / 180;
        house.add( door );
        door.castShadow = true;
        
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

        // POST
        const postBoxCapGeometry = new CylinderGeometry( 0.04, 0.04, 0.22, 32, 1, false, 0, Math.PI );
        postBoxCapGeometry.applyMatrix( new Matrix4().makeRotationZ( 90 * Math.PI / 180 ) );
        postBoxCapGeometry.applyMatrix( new Matrix4().makeTranslation( 0, 0.2, 0 ) );

        const postBoxGeometry = new BoxGeometry( 0.22, 0.04, 0.08 );
        postBoxGeometry.applyMatrix( new Matrix4().makeTranslation( 0, 0.18, 0 ) );
        postBoxGeometry.merge( postBoxCapGeometry );

        const postBoxPoleGeometry = new CylinderGeometry( 0.02, 0.02, 0.16 );
        postBoxPoleGeometry.applyMatrix( new Matrix4().makeTranslation( 0, 0.08, 0 ) );

        const postGeometry = new Geometry();
        postGeometry.merge( postBoxPoleGeometry, postBoxPoleGeometry.matrix, 0 );
        postGeometry.merge( postBoxGeometry, postBoxGeometry.matrix, 1 );

        var mat1 = material.clone();
        mat1.color.setHex( 0x5b0202 );
        var mat2 = material.clone();
        mat2.color.setHex( 0x876a14 );

        const postMaterial = [ mat2, mat1, mat1, mat1, mat1, mat1, mat1 ];
        const post = new Mesh( postGeometry, postMaterial );
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
    
            
        const roadGeometry = new BoxGeometry( 10, 0.01, 1 );
        const stripGeometry = new BoxGeometry( 0.7, 0.01, 0.1 );

        const total = 6;
        for(let i = 0; i < total; i++ ) {
            const ht = total / 2;
            const clone = stripGeometry.clone();
            // clone.applyMatrix( new Matrix4().makeTranslation( i * 1.7 - ht - 1, 0.01, 0 ) );
            const matrix = new Matrix4().makeTranslation( i * 1.7 - ht - 1, 0.01, 0 );
            roadGeometry.merge( clone, matrix, 6 );
        }

        const asphaltMaterial = basicMaterial.clone();
        asphaltMaterial.color.setHex( 0xa1aeb3 );
        const stripMaterial = basicMaterial.clone();
        stripMaterial.color.setHex( 0xdae0e6 );

        const roadMaterial = [ 
            asphaltMaterial, asphaltMaterial, asphaltMaterial, 
            asphaltMaterial, asphaltMaterial, asphaltMaterial,
            stripMaterial, stripMaterial, stripMaterial, 
            stripMaterial, stripMaterial, stripMaterial
        ];

        const road = new Mesh( roadGeometry, roadMaterial );
        scene.add( road );
        road.position.set( 0, 0, -2.5 );
    
    }
}