import {
  MeshBasicMaterial,
  MeshLambertMaterial,
  Geometry,
  BoxGeometry,
  CylinderGeometry,
  CylinderBufferGeometry,
  PlaneBufferGeometry,
  Mesh,
  Matrix4,
  Object3D,
  EquirectangularReflectionMapping,
  ShadowMaterial,
} from "three";

import { CSG } from "three-csg-ts";
import tweenY from "../utils/tweenY";

import skyPanoImg from "../../img/sky-dome-panorma.jpg";

export default class House {
  constructor(scene, textureLoader, particles) {
    const interactionObjects = [];

    const house = new Object3D();
    house.position.set(0, -0.02, 0);
    house.matrixAutoUpdate = false;
    house.updateMatrix();
    scene.add(house);

    // var material = new THREE.MeshBasicMaterial( { color: 0xFF1111, wireframe: false } );
    var material = new MeshLambertMaterial({
      color: 0xff1111,
      wireframe: false,
    });
    // var material = new THREE.MeshPhongMaterial( { color: 0xFF1111, wireframe: false } );
    var basicMaterial = new MeshBasicMaterial({
      color: 0xff1111,
      wireframe: false,
    });

    // FLOOR
    const floorMaterial = new MeshBasicMaterial({ color: 0xeeeeee });
    const floorGeometry = new PlaneBufferGeometry(10, 10, 1, 1);
    const floor = new Mesh(floorGeometry, floorMaterial);
    // floor.position.y = -0.25;
    floor.rotation.x = -Math.PI / 2;
    floor.matrixAutoUpdate = false;
    floor.updateMatrix();
    scene.add(floor);
    floor.receiveShadow = false;

    const shadowMaterial = new ShadowMaterial({ opacity: 0.1 });
    const shadowPlane = new Mesh(floorGeometry, shadowMaterial);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.receiveShadow = true;
    shadowPlane.position.y = 0.001;
    scene.add(shadowPlane);

    // ROOF
    const size = 0.25;
    const roofGeometry = new CylinderBufferGeometry(0, size * 3, size * 3, 4);
    const cylinder = new Mesh(roofGeometry, basicMaterial.clone());
    cylinder.material.color.setHex(0xffffff);
    cylinder.rotation.y = (45 * Math.PI) / 180;
    cylinder.position.set(0, 0.8 + 0.35, 0);
    cylinder.matrixAutoUpdate = false;
    cylinder.updateMatrix();
    house.add(cylinder);

    // CHIMNEY
    const chimneyGeometry = new BoxGeometry(0.2, 0.4, 0.2);
    const chimney = new Mesh(chimneyGeometry, cylinder.material.clone());
    chimney.material.color.setHex(0xdae0e6);
    // chimney.material.color.setHex( 0xFFFFFF );
    chimney.position.set(-0.35, 1.05, 0);
    house.add(chimney);
    interactionObjects.push(chimney);
    chimney.userData.interact = function () {
      if (particles.emitter.enabled) {
        tweenY(this, (-180 * Math.PI) / 180);
        particles.stop();
      } else {
        tweenY(this, (0 * Math.PI) / 180);
        particles.start();
      }
    }.bind(chimney);

    // INNER CHIMNEY
    const holeGeometry = new CylinderBufferGeometry(0.08, 0.08, 0.1, 8);
    const hole = new Mesh(holeGeometry, material.clone());
    hole.material.color.setHex(0x222222);
    hole.position.set(0, 0.151, 0);
    hole.matrixAutoUpdate = false;
    hole.updateMatrix();
    chimney.add(hole);

    // WINDOW
    const windowgeometry = new BoxGeometry(0.2, 0.2, 0.06);
    windowgeometry.applyMatrix4(
      new Matrix4().makeTranslation(0.25, -0.0, -0.48)
    );
    const window = new Mesh(windowgeometry, material.clone());

    const textureCube = textureLoader.load(skyPanoImg, function () {
      window.material.needsUpdate = true;
    });

    // windo.material.color.setHex( 0xdae0e6 );
    window.material.color.setHex(0xffffff);
    window.material.transparent = true;
    window.material.opacity = 0.4;
    window.material.envMap = textureCube;
    textureCube.mapping = EquirectangularReflectionMapping;
    // textureCube.mapping = SphericalReflectionMapping;
    // textureCube.format = THREE.RGBAFormat;

    // windo.position.set( 0, 0.325, 0.05 );
    window.position.set(0, 0.4, 0.02);
    window.matrixAutoUpdate = false;
    window.updateMatrix();
    house.add(window);

    // DOOR CUT GEOMETRY
    const doorGeometry = new BoxGeometry(0.3, 0.5, 0.1);
    doorGeometry.applyMatrix4(new Matrix4().makeTranslation(-0.15, -0.1, -0.5));

    var mergeGeometry = new Geometry();
    mergeGeometry.merge(window.geometry);
    mergeGeometry.merge(doorGeometry);
    // mergeGeometry.applyMatrix4( new THREE.Matrix4().makeTranslation( 0, 0.5, 0 ) );

    // HOUSE
    const roomGeometry = new BoxGeometry(1, 0.8, 1);
    // roomGeometry.applyMatrix4( new THREE.Matrix4().makeTranslation( 0, 0.5, 0 ) );
    var box = new Mesh(roomGeometry);
    // box.position.set( 0, 0.5, 0 );
    box.updateMatrix();

    // var cutgeo = new THREE.BoxGeometry( 0.9, 0.9, 0.9 );
    const cutgeo = box.clone();
    cutgeo.scale.multiplyScalar(0.9);
    cutgeo.updateMatrix();

    // cut inner box
    var cube_bsp = CSG.fromMesh(box);
    var subtract_bsp = CSG.fromMesh(cutgeo);
    const emptyCube = cube_bsp.subtract(subtract_bsp);

    // cut door and window
    var sub = new Mesh(mergeGeometry);
    sub.updateMatrix();
    var subtract_bsp2 = CSG.fromMesh(sub);
    // var result = cube_bsp.subtract( subtract_bsp );
    const result = emptyCube.subtract(subtract_bsp2);

    const houseMesh = CSG.toMesh(result, box.matrix);
    houseMesh.material = material;

    // houseMesh.geometry.computeVertexNormals();
    // var material = new THREE.MeshLambertMaterial({wireframe:true})
    // mesh.material = material;
    // houseMesh.material.flatShading = false;
    houseMesh.position.set(0, 0.4, 0);
    house.add(houseMesh);

    house.traverse(function (object) {
      object.castShadow = true;
      // object.receiveShadow = true;
      // object.receiveShadow = true;
    });

    // DOOR
    doorGeometry.center();
    // SHIFT GEOMETRY SO THE CENTROID ( ROTATION AXIS ) IS ON THE EDGE
    doorGeometry.applyMatrix4(new Matrix4().makeTranslation(0.2, 0, 0));

    const woodMaterial = material.clone();
    woodMaterial.color.setHex(0x876a14);

    const reflectiveMaterial = material.clone();
    reflectiveMaterial.color.setHex(0xffffff);
    reflectiveMaterial.envMap = textureCube;
    reflectiveMaterial.reflectivity = 0.8;

    const doorMaterial = [
      woodMaterial,
      woodMaterial,
      woodMaterial,
      woodMaterial,
      woodMaterial,
      woodMaterial,
      reflectiveMaterial,
      reflectiveMaterial,
      reflectiveMaterial,
    ];

    // var geometry = new THREE.SphereBufferGeometry( 0.02, 16, 16 );
    const knobGeometry = new CylinderGeometry(0.02, 0.02, 0.01, 16);
    knobGeometry.applyMatrix4(new Matrix4().makeRotationX(Math.PI / 2));
    knobGeometry.applyMatrix4(new Matrix4().makeTranslation(0.3, 0, -0.05));
    doorGeometry.merge(knobGeometry, knobGeometry.matrix, 6);

    const door = new Mesh(doorGeometry, doorMaterial);
    door.position.set(-0.35, 0.3, -0.45);
    // door.rotation.y = -90 * Math.PI / 180;
    house.add(door);
    door.castShadow = true;
    door.userData.interact = function () {
      if (this.rotation.y == 0) {
        tweenY(this, (-75 * Math.PI) / 180);
        // object.rotation.y -= 65 * Math.PI / 180;
      } else {
        tweenY(this, 0);
        // object.rotation.y = 0;
      }
    }.bind(door);

    interactionObjects.push(door);

    // POST
    const postBoxCapGeometry = new CylinderGeometry(
      0.04,
      0.04,
      0.22,
      32,
      1,
      false,
      0,
      Math.PI
    );
    postBoxCapGeometry.applyMatrix4(
      new Matrix4().makeRotationZ((90 * Math.PI) / 180)
    );
    postBoxCapGeometry.applyMatrix4(new Matrix4().makeTranslation(0, 0.2, 0));

    const postBoxGeometry = new BoxGeometry(0.22, 0.04, 0.08);
    postBoxGeometry.applyMatrix4(new Matrix4().makeTranslation(0, 0.18, 0));
    postBoxGeometry.merge(postBoxCapGeometry);

    const postBoxPoleGeometry = new CylinderGeometry(0.02, 0.02, 0.16);
    postBoxPoleGeometry.applyMatrix4(new Matrix4().makeTranslation(0, 0.08, 0));

    const postGeometry = new Geometry();
    postGeometry.merge(postBoxPoleGeometry, postBoxPoleGeometry.matrix, 0);
    postGeometry.merge(postBoxGeometry, postBoxGeometry.matrix, 1);

    const poleMaterial = material.clone();
    poleMaterial.color.setHex(0x876a14);
    const boxMaterial = material.clone();
    boxMaterial.color.setHex(0x5b0202);

    const postMaterial = [
      poleMaterial,
      boxMaterial,
      boxMaterial,
      boxMaterial,
      boxMaterial,
      boxMaterial,
      boxMaterial,
    ];
    const post = new Mesh(postGeometry, postMaterial);
    post.position.set(0.3, 0, -1);
    post.castShadow = true;
    scene.add(post);
    post.userData.interact = function () {
      if (this.rotation.y == 0) {
        tweenY(this, (-360 * Math.PI) / 180);
        // object.rotation.y -= 65 * Math.PI / 180;
      } else {
        tweenY(this, 0);
        // object.rotation.y = 0;
      }
    }.bind(post);

    interactionObjects.push(post);

    const roadGeometry = new BoxGeometry(10, 0.01, 1);
    const stripGeometry = new BoxGeometry(0.7, 0.01, 0.1);

    const total = 6;
    for (let i = 0; i < total; i++) {
      const ht = total / 2;
      const clone = stripGeometry.clone();
      // clone.applyMatrix4( new Matrix4().makeTranslation( i * 1.7 - ht - 1, 0.01, 0 ) );
      const matrix = new Matrix4().makeTranslation(i * 1.7 - ht - 1, 0.01, 0);
      roadGeometry.merge(clone, matrix, 6);
    }

    const asphaltMaterial = basicMaterial.clone();
    asphaltMaterial.color.setHex(0xa1aeb3);
    const stripMaterial = basicMaterial.clone();
    stripMaterial.color.setHex(0xdae0e6);

    const roadMaterial = [
      asphaltMaterial,
      asphaltMaterial,
      asphaltMaterial,
      asphaltMaterial,
      asphaltMaterial,
      asphaltMaterial,
      stripMaterial,
      stripMaterial,
      stripMaterial,
      stripMaterial,
      stripMaterial,
      stripMaterial,
    ];

    const road = new Mesh(roadGeometry, roadMaterial);
    scene.add(road);
    road.position.set(0, 0, -2.5);
  }
}
