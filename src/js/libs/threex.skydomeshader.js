/* global THREE */

var THREEx = THREEx || {};

/**
 * from http://stemkoski.blogspot.fr/2013/07/shaders-in-threejs-glow-and-halo.html
 * @return {[type]} [description]
 */

THREEx.skyDomeShaderMaterial = function () {
  var vertexShader = [
    "varying vec3 vWorldPosition;",

    "void main() {",

    "vec4 worldPosition = modelMatrix * vec4( position, 1.0 );",
    "vWorldPosition = worldPosition.xyz;",

    "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

    "}",
  ].join("\n");

  var fragmentShader = [
    "uniform vec3 topColor;",
    "uniform vec3 bottomColor;",
    "uniform float offset;",
    "uniform float exponent;",

    "varying vec3 vWorldPosition;",

    "void main() {",

    "float h = normalize( vWorldPosition + offset ).y;",
    "gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 );",

    "}",
  ].join("\n");

  var uniforms = {
    //topColor: 	 { type: "c", value: new THREE.Color( 0x0077ff ) },
    topColor: { type: "c", value: new THREE.Color(0x00004d) },
    bottomColor: { type: "c", value: new THREE.Color(0xeeeeee) },
    offset: { type: "f", value: 5 },
    exponent: { type: "f", value: 0.6 },
  };

  //uniforms.topColor.value.copy( hemiLight.color );

  // create custom material from the shader code above
  //   that is within specially labeled script tags
  var material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: uniforms,
    side: THREE.BackSide,
  });

  return material;
};
