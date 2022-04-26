import Element from "../core/element";
import { ElementTypes } from "../enums";

class Motor extends Element {
  static type: string = ElementTypes.motor;

  constructor(parent: "menu" | "box" = "menu") {
    super({
      d: `
				M 0 0,
 				m 0 -60,
 				l 0 60,
				l -50 35,
				m 100 0,
				l -50 -35
				m -75 0
				a 75 75 1 0 1 150 0
				a 75 75 1 0 1 -150 0
		`,
      type: ElementTypes.motor,
      parent
    });
  }
}

export default Motor;
