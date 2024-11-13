import {
  MeshBasicMaterial,
  MeshLambertMaterial,
  BoxGeometry,
  CylinderGeometry,
  PlaneGeometry,
  Mesh,
  Matrix4,
  Object3D,
  EquirectangularReflectionMapping,
  ShadowMaterial,
} from "three";

import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";

import { CSG } from "three-csg-ts";
import tweenY from "../utils/tweenY";

import skyPanoImg from "../../assets/img/sky-dome-panorma.jpg";

export default class House {
  constructor(scene, textureLoader, particles) {
    const interactionObjects = [];

    const house = new Object3D();
    house.position.set(0, -0.02, 0);
    house.matrixAutoUpdate = false;
    house.updateMatrix();
    scene.add(house);

    // var material = new THREE.MeshBasicMaterial( { color: 0xFF1111, wireframe: false } );
    const material = new MeshLambertMaterial({
      color: 0xef3333,
      wireframe: false,
    });
    // var material = new THREE.MeshPhongMaterial( { color: 0xFF1111, wireframe: false } );
    const basicMaterial = new MeshBasicMaterial({
      color: 0x00ffff,
      wireframe: false,
    });

    // FLOOR
    const floorMaterial = new MeshBasicMaterial({ color: 0xf0f0f0 });
    const floorGeometry = new PlaneGeometry(10, 10, 1, 1);
    const floor = new Mesh(floorGeometry, floorMaterial);
    // floor.position.y = -0.25;
    floor.rotation.x = -Math.PI / 2;
    floor.matrixAutoUpdate = false;
    floor.updateMatrix();
    floor.receiveShadow = false;
    // scene.add(floor);

    const earth = new BoxGeometry(10, 0.3, 10);
    const eMesh = new Mesh(earth, floorMaterial);
    earth.applyMatrix4(new Matrix4().makeTranslation(0, -0.15, 0));
    scene.add(eMesh);

    const shadowMaterial = new ShadowMaterial({ opacity: 0.1 });
    const shadowPlane = new Mesh(floorGeometry, shadowMaterial);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.receiveShadow = true;
    shadowPlane.position.y = 0.001;
    scene.add(shadowPlane);

    // ROOF
    const size = 0.25;
    const roofGeometry = new CylinderGeometry(0, size * 3, size * 3, 4);
    const cylinder = new Mesh(roofGeometry, basicMaterial.clone());
    cylinder.material.color.setHex(0xfafafa);
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
      //   if (particles.emitter && particles.emitter.enabled) {
      if (this.rotation.y == 0) {
        particles.active(false);
        return tweenY(this, (-180 * Math.PI) / 180);
      } else {
        particles.active(true);
        return tweenY(this, (0 * Math.PI) / 180);
      }
    }.bind(chimney);

    // INNER CHIMNEY
    const holeGeometry = new CylinderGeometry(0.08, 0.08, 0.1, 8);
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
    const doorGeometry = new BoxGeometry(0.3, 0.5, 0.075);
    doorGeometry.applyMatrix4(new Matrix4().makeTranslation(-0.15, -0.1, -0.5));

    var mergeGeometry = BufferGeometryUtils.mergeGeometries([
      window.geometry,
      doorGeometry,
    ]);
    // mergeGeometry.applyMatrix4(new Matrix4().makeTranslation(0, 0, 0));

    // HOUSE
    const box = new Mesh(new BoxGeometry(1, 0.8, 1));
    // box.position.set( 0, 0.5, 0 );
    // box.updateMatrix(); // needed?

    // var cutgeo = new THREE.BoxGeometry( 0.9, 0.9, 0.9 );
    const cutgeo = box.clone();
    cutgeo.scale.multiplyScalar(0.925);
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
    // houseMesh.material.flatShading = true;
    houseMesh.position.set(0, 0.4, 0);
    houseMesh.layers.enable(1);

    house.add(houseMesh);

    house.traverse(function (object) {
      object.castShadow = true;
      // disable self-shadow from roof on house
      object.receiveShadow = false;
    });

    // DOOR

    const doorGeometry2 = new BoxGeometry(0.3, 0.5, 0.025);
    // doorGeometry2.applyMatrix4(
    //   new Matrix4().makeTranslation(-0.55, -0.1, 1.75)
    // );

    const woodMaterial = material.clone();
    woodMaterial.color.setHex(0xa78a34);

    const reflectiveMaterial = material.clone();
    reflectiveMaterial.color.setHex(0xffffff);
    reflectiveMaterial.envMap = textureCube;
    reflectiveMaterial.reflectivity = 0.8;

    const doorMaterial = [woodMaterial, reflectiveMaterial];

    // var geometry = new THREE.SphereBufferGeometry( 0.02, 16, 16 );
    const knobGeometry = new CylinderGeometry(0.02, 0.02, 0.01, 16);
    knobGeometry.applyMatrix4(new Matrix4().makeRotationX(Math.PI / 2));
    knobGeometry.applyMatrix4(new Matrix4().makeTranslation(0.25, 0, -0.005));

    doorGeometry2.center();
    // SHIFT GEOMETRY SO THE CENTROID ( ROTATION AXIS ) IS ON THE EDGE
    doorGeometry2.applyMatrix4(new Matrix4().makeTranslation(0.15, 0, 0.01));

    const doorFinalGeometry = BufferGeometryUtils.mergeGeometries(
      [doorGeometry2, knobGeometry],
      true
    );

    const door = new Mesh(doorFinalGeometry, doorMaterial);
    // door.position.set(-0.35, 0.3, -0.45);
    door.position.set(-0.3, 0.3, -0.49);
    // door.rotation.y = -90 * Math.PI / 180;
    house.add(door);

    door.castShadow = true;
    door.userData.interact = function () {
      if (this.rotation.y == 0) {
        return tweenY(this, (-75 * Math.PI) / 180);
        // object.rotation.y -= 65 * Math.PI / 180;
      } else {
        return tweenY(this, 0);
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
    const newPostBoxGeometry = BufferGeometryUtils.mergeGeometries([
      postBoxGeometry,
      postBoxCapGeometry,
    ]);

    const postBoxPoleGeometry = new CylinderGeometry(0.02, 0.02, 0.16);
    postBoxPoleGeometry.applyMatrix4(new Matrix4().makeTranslation(0, 0.08, 0));

    const newPostGeometry = BufferGeometryUtils.mergeGeometries(
      [postBoxPoleGeometry, newPostBoxGeometry],
      true
    );

    const poleMaterial = material.clone();
    poleMaterial.color.setHex(0x876a14);
    const boxMaterial = material.clone();
    boxMaterial.color.setHex(0x6b1212);

    const postMaterial = [poleMaterial, boxMaterial];

    const post = new Mesh(newPostGeometry, postMaterial);
    post.position.set(0.3, 0, -1);
    post.castShadow = true;
    scene.add(post);
    post.userData.interact = function () {
      if (this.rotation.y == 0) {
        return tweenY(this, (-360 * Math.PI) / 180);
        // object.rotation.y -= 65 * Math.PI / 180;
      } else {
        return tweenY(this, 0);
        // object.rotation.y = 0;
      }
    }.bind(post);

    interactionObjects.push(post);

    const roadGeometry = new BoxGeometry(10.05, 0.11, 1.5);
    roadGeometry.applyMatrix4(new Matrix4().makeTranslation(0, -0.05, 0));
    const stripGeometry = new BoxGeometry(0.9, 0.005, 0.1);
    // stripGeometry.addGroup(0, 1, 0); // not needed idk

    const asphaltMaterial = basicMaterial.clone();
    asphaltMaterial.color.setHex(0xc1cad0);
    // asphaltMaterial.wireframe = true;
    const stripMaterial = basicMaterial.clone();
    // stripMaterial.wireframe = true;
    stripMaterial.color.setHex(0xeaf0f6);

    const streetMaterial = [asphaltMaterial, stripMaterial];

    let streetGeometry = [roadGeometry];
    const total = 6;
    for (let i = 0; i < total; i++) {
      const clone = stripGeometry.clone();
      clone.applyMatrix4(
        new Matrix4().makeTranslation(i * 1.7 - total / 2 - 1, 0.005, 0)
      );
      // add each strip geometry into the array
      streetGeometry.push(clone);
      //add a material for each geometry into the array
      streetMaterial.push(stripMaterial);
    }
    streetGeometry = BufferGeometryUtils.mergeGeometries(streetGeometry, true);

    const streetMesh = new Mesh(streetGeometry, streetMaterial);
    streetMesh.position.set(0, 0, -2.5);
    scene.add(streetMesh);
    // this.update = function (delta) {
    //   //   console.log("hello from", door);
    // };

    interactionObjects.forEach((o) => {
      o.layers.enable(1);
    });
  }
}
