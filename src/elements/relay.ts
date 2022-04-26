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
			a 5 5 1 0 1 -10 0
		`,
      type: ElementTypes.relay,
      parent
    });
  }
}

export default Relay;
