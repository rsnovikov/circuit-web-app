import Element from "../core/element";
import { ElementTypes } from "../enums";

class Lamp extends Element {
  static type: string = ElementTypes.lamp;

  constructor(parent: "menu" | "box" = "menu") {
    super({
      d: `
				M 0 0,
 				m -50 0,
 				a 50 50 1 0 1 100 0,
 				a 50 50 1 0 1 -100 0,
 				m 15 35,
 				l 70 -70,
 				m -70 0,
 				l 70 70
 				m 15 -35
 				l 30 0
 				m -130 0
 				l -30 0`,
      type: ElementTypes.lamp,
      parent,
      outputs: [
        {
          x: 75,
          y: 0
        },
        {
          x: -75,
          y: 0
        }
      ]
    });
  }
}

export default Lamp;
