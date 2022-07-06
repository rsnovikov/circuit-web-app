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
				l -50 -35,
				m -70 0,
				a 70 70 1 0 1 140 0,
				a 70 70 1 0 1 -140 0,
				l -40 0,
				m 180 0,
				l 40 0,
				m -110 70,
				l 0 40
		`,
      type: ElementTypes.motor,
      parent,
      outputs: [
        {
          x: -110,
          y: 0
        },
        {
          x: 110,
          y: 0
        },
        {
          x: 0,
          y: 110
        }
      ]
    });
  }
}

export default Motor;
