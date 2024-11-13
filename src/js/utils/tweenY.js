// import TWEEN from "@tweenjs/tween.js";
import { Tween, Group, Easing } from "@tweenjs/tween.js";

export default function tweenY(object, rotation) {
  return (
    new Tween(object.rotation)
      .to(
        {
          x: 0,
          y: rotation,
          z: 0,
        },
        800
      )
      .easing(Easing.Sinusoidal.InOut)
      // .easing( TWEEN.Easing.Quadratic.InOut)
      // .easing( TWEEN.Easing.Elastic.Out)
      .start()
      .onComplete()
  );
}
