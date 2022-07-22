import Element from "../core/element";
import { ElementTypes } from "../enums";

class Key extends Element {
  static type: string = ElementTypes.key;

  constructor(parent: "menu" | "box" = "menu") {
    super({
      d: `
				M 0 0,
				m -40 0,
				a 5 5 1 0 1 -10 0,
				a 5 5 1 0 1 10 0,
				l 73 -35,
				m 7 35,
				a 5 5 1 0 1 10 0,
				a 5 5 1 0 1 -10 0,
				m 10 0,
				l 20 0,
				m -120 0,
				l -20 0`,
      type: ElementTypes.key,
      parent,
      hitBox: {
        x1: -70,
        x2: 70,
        y1: -45,
        y2: 25
      },
      outputs: [
        {
          x: -70,
          y: 0
        },
        {
          x: 70,
          y: 0
        }
      ]
    });
  }
}

export default Key;
