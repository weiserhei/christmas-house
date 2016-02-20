/**
 * Create a camera
 *
 */
define(["three","renderer"], function (THREE,renderer) {

    'use strict';

    // CAMERA
    var screen_width    = window.innerWidth;
    var screen_height   = window.innerHeight;
    var aspect = screen_width / screen_height;
    // var view_angle  = 25;
    var view_angle  = 60;
    var near = 0.1;
    var far = 1000;
    
    var camera  = new THREE.PerspectiveCamera( view_angle, aspect, near, far );
    // CAMERA INITIAL POSITION
    camera.position.z = -8;
    camera.position.y = 1.8;

    camera.position.z = -3.738;
    camera.position.y = 0.504;
    camera.position.x = -1.767;

    // camera.lookAt( new THREE.Vector3( 0, 20, 0) );   
    // scene.add( camera );

    var callback    = function(){

        var width = window.innerWidth;
        var height = window.innerHeight;
        
        // notify the renderer of the size change
        renderer.setSize( width, height );
        // update the camera
        camera.aspect   = width / height;
        camera.updateProjectionMatrix();
    
    }

    window.addEventListener( 'resize', callback, false );

    return camera;

});