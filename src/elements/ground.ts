import Element from "../core/element";
import { ElementTypes } from "../enums";

class Ground extends Element {
  static type: string = ElementTypes.ground;

  constructor(parent: "menu" | "box" = "menu") {
    super({
      d: `
			M 0 0,
			v -40,
			m -20 40,
			h 40,
			m -7.5 5,
			h -25,
			m 7.5 5,
			h 10
		`,
      type: ElementTypes.ground,
      parent,
      hitBox: {
        x1: -20,
        x2: 20,
        y1: -40,
        y2: 25
      },
      outputs: [
        {
          x: 0,
          y: -40
        }
      ]
    });
  }
}

export default Ground;
