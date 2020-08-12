import TWEEN from "@tweenjs/tween.js";
export default function tweenY(object, rotation) {
  new TWEEN.Tween(object.rotation)
    .to(
      {
        x: 0,
        y: rotation,
        z: 0,
      },
      800
    )
    .easing(TWEEN.Easing.Sinusoidal.InOut)
    // .easing( TWEEN.Easing.Quadratic.InOut)
    // .easing( TWEEN.Easing.Elastic.Out)
    .start();
}
