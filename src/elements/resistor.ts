import Element from "../core/element";
import { ElementTypes } from "../enums";

class Resistor extends Element {
  static type: string = ElementTypes.resistor;

  constructor(parent: "menu" | "box" = "menu") {
    super({
      d: `
			M 0 0 
			m -50 0
			v -20
			h 100
			v 40
			h -100
			z
			l -20 0
			m 120 0
			l 20 0
		`,
      type: ElementTypes.resistor,
      parent,
      outputs: [
        {
          x: 70,
          y: 0
        },
        {
          x: -70,
          y: 0
        }
      ]
    });
  }
}

export default Resistor;
