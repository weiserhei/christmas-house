import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Controls based on orbit controls
export default class Controls {
  constructor(camera, container) {
    const controls = new OrbitControls(camera, container);
    this.threeControls = controls;
    this.camera = camera;

    controls.target.set(0, 0, 0);
    controls.enableDamping = true;
    controls.rotateSpeed = 0.25;
    controls.dampingFactor = 0.1;
    controls.target.set(0, 0.7, 0);
    controls.maxPolarAngle = (1.03 * Math.PI) / 2;
    controls.minDistance = 2;
    controls.maxDistance = 9;

    function handleMouseMove() {
      document.body.style.cursor = "grabbing";
    }

    function onMouseUp() {
      container.removeEventListener("mousemove", handleMouseMove, false);
      document.body.style.cursor = "default";
    }

    container.addEventListener(
      "mousedown",
      () => {
        container.addEventListener("mousemove", handleMouseMove, false);
        container.addEventListener("mouseup", onMouseUp, false);
        container.addEventListener("mouseout", onMouseUp, false);
      },
      false
    );
  }
}
