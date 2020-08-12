import { PointLight, DirectionalLight, HemisphereLight } from "three";

export default function x(scene) {
  var hemiLight = new HemisphereLight(0xffffff, 0xffffff, 0.6);
  hemiLight.color.setHSL(0.6, 1, 0.6);
  hemiLight.groundColor.setHSL(0.095, 0.8, 0.5);
  hemiLight.position.set(0, 5, 0);
  scene.add(hemiLight);
  var dirLight = new DirectionalLight(0xffffff, 1);
  dirLight.color.setHSL(0.6, 0.1, 1);
  dirLight.position.set(-1, 1.75, -1);
  dirLight.position.multiplyScalar(5);
  scene.add(dirLight);
  dirLight.castShadow = true;
  // dirLight.shadow.mapSize.width = 2048;
  // dirLight.shadow.mapSize.height = 2048;
  var d = 2;

  dirLight.shadow.camera.left = -d;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = -d;

  dirLight.shadow.camera.far = 35;
  dirLight.shadow.camera.near = 1;
  // dirLight.shadow.bias = -0.0001;
  dirLight.shadow.radius = 2;

  var pointLight = new PointLight(0xffff55, 3);
  pointLight.distance = 1.5; // distance has no effect - bug?
  pointLight.position.set(0, 0.4, 0);
  // pointLight.castShadow = true;
  scene.add(pointLight);
}
