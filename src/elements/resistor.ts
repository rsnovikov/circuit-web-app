import Element from "../core/element";
import { ElementTypes } from "../enums";

class Resistor extends Element {
  static type: string = ElementTypes.resistor;

  constructor(parent: "menu" | "box" = "menu") {
    super({
      d: `
			M 0 0 
			m -75 0 
			v -25
			h 150
			v 50
			h -150
			 z
		`,
      type: ElementTypes.resistor,
      parent
    });
  }
}

export default Resistor;
