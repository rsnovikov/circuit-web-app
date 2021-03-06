import Element from "../core/element";
import { ElementTypes } from "../enums";

class Switch extends Element {
  static type: string = ElementTypes.switch;

  constructor(parent: "menu" | "box" = "menu") {
    super({
      d: `
			M 0 0,
			m 0 20,
			h -20,
			v 30,
			h-40,
			m 40 0,
			v 30,
			h 40,
			v -30,
			h 40,
			m -40 0,
			v -30,
			h -20,
			m 0 -5,
			v -10,
			m 0 -5,
			v-10,
			m 0 -5,
			v -10,
			m 0 -5,
			v-10,
			m 0 -5,
			v -10,
			m 0 -5,
			v-10,
			m 0 -5,
			v -10,
			m 0 -5,
			v-10,
			m -60 5,
			h 120,
			v 10,
			m 0 60,
			v 10,
			h -120,
			m 0 -40,
			h 20,
			l 110 32
		`,
      type: ElementTypes.switch,
      parent,
      hitBox: {
        x1: -65,
        x2: 65,
        y1: -100,
        y2: 90
      },
      outputs: [
        {
          x: -60,
          y: -95
        },
        {
          x: -60,
          y: -55
        },
        {
          x: -60,
          y: -15
        },
        {
          x: -60,
          y: 50
        },
        {
          x: 60,
          y: 50
        }
      ]
    });
  }
}

export default Switch;
