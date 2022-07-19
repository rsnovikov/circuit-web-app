import Element from "../core/element";
import { ElementTypes } from "../enums";

class Relay extends Element {
  static type: string = ElementTypes.relay;

  constructor(parent: "menu" | "box" = "menu") {
    super({
      d: `
			M 0 0,
			m 0 -20,
			h -20,
			v -30,
			h -40,
			m 40 0,
			v -30,
			h 40,
			v 30,
			h 40,
			m -40 0,
			v 30,
			h-20,
			m 0 10,
			l 0 10,
			m 0 10,
			l 0 10,
			m 0 10,
			l 0 10,
			m 0 10,
			l 0 10,
			m 0 10,
			l 0 10,
			m 0 10,
			m -40 -35,
			a 5 5 1 0 1 -10 0,
			a 5 5 1 0 1 10 0,
			l 73 -35,
			m 7 35,
			a 5 5 1 0 1 10 0,
			a 5 5 1 0 1 -10 0,
			m 10 0,
			l 20 0,
			m -120 0,
			l -20 0
		`,
      type: ElementTypes.relay,
      parent,
      hitBox: {
        x1: -60,
        x2: 60,
        y1: -80,
        y2: 80
      },
      outputs: [
        {
          x: 60,
          y: -50
        },
        {
          x: -60,
          y: -50
        },
        {
          x: -70,
          y: 55
        },
        {
          x: 70,
          y: 55
        }
      ]
    });
  }
}

export default Relay;
