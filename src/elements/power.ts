import Element from "../core/element";
import { ElementTypes } from "../enums";

class Power extends Element {
  static type: string = ElementTypes.power;

  constructor(parent: "menu" | "box" = "menu") {
    super({
      d: `
		    M 0 0,
				m 5 20,
				l 0 -40,
				m 0 -50,
				l -10 0,
				m 5 -5,
				l 0 10,
				m -2 15,
				l 0 100
				m 0 -50
				l -30 0
				m 35 0
				l 30 0
		`,
      type: ElementTypes.power,
      parent,
      hitBox: {
        x1: -30,
        x2: 30,
        y1: -60,
        y2: 60
      },
      outputs: [
        {
          x: -30,
          y: 0
        },
        {
          x: 30,
          y: 0
        }
      ]
    });
  }
}

export default Power;
