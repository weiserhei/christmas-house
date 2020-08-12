import { Vector2, Raycaster } from "three";

export default class InteractionController {
  constructor(scene, camera, container) {
    const mouseVector = new Vector2();
    const raycaster = new Raycaster();

    window.addEventListener("touchstart", touchstart, true);
    window.addEventListener("mousemove", onMouseMove, false);
    window.addEventListener("mousedown", onMouseDown, false);

    function touchstart(e) {
      if (e.touches.length > 0) {
        interact(e.touches[0].pageX, e.touches[0].pageY);
      }
    }

    function onMouseDown(e) {
      if (e.button === 1) {
        //middle mouse
        return;
      }
      interact(e.clientX, e.clientY);
    }

    function onMouseMove(e) {
      const intersects = raycast(e.clientX, e.clientY);
      if (
        intersects.length > 0 &&
        intersects[0].object.userData.interact != undefined
      ) {
        // http://www.w3schools.com/cssref/playit.asp?filename=playcss_cursor&preval=alias
        container.style.cursor = "pointer";
      } else {
        container.style.cursor = "initial";
      }
    }

    function interact(x, y) {
      const intersects = raycast(x, y);
      // calculate objects intersecting the picking ray
      if (
        intersects.length > 0 &&
        intersects[0].object.userData.interact != undefined
      ) {
        intersects[0].object.userData.interact();
      }
    }

    function raycast(x, y) {
      mouseVector.x = 2 * (x / window.innerWidth) - 1;
      mouseVector.y = 1 - 2 * (y / window.innerHeight);
      // mouseVector.x = 2 * (e.clientX / container.offsetWidth) - 1;
      // mouseVector.y = 1 - 2 * ( e.clientY / container.offsetHeight );
      // update the picking ray with the camera and mouse position
      raycaster.setFromCamera(mouseVector, camera);
      // calculate objects intersecting the picking ray
      // return raycaster.intersectObjects( interactionObjects, true );
      return raycaster.intersectObjects(scene.children, true);
    }
  }
}
