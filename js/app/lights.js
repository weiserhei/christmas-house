/**
 * Setup the scene lighting
 */
define(["three","scene"], function (THREE, scene) {

    'use strict';
    // LIGHTS

    var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
    hemiLight.color.setHSL( 0.6, 1, 0.6 );
    hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
    hemiLight.position.set( 0, 5, 0 );
    scene.add( hemiLight );

    //

    var dirLight = new THREE.DirectionalLight( 0xFFFFFF, 1 );
    dirLight.color.setHSL( 0.1, 1, 0.45 );
    dirLight.position.set( -1, 1.75, -1 );
    dirLight.position.multiplyScalar( 5 );
    scene.add( dirLight );

    dirLight.castShadow = true;

    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;

    var d = 5;

    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;

    dirLight.shadow.camera.far = 35;
    dirLight.shadow.camera.near = 1;
    // dirLight.shadow.bias = -0.0001;
    // dirLight.shadowDarkness = 0.1;


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
    var pointLight = createLight( 0xFFFF55 );
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

});