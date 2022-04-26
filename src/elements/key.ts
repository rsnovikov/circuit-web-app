import Element from "../core/element";
import { ElementTypes } from "../enums";

class Key extends Element {
  static type: string = typeof ElementTypes.key;

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
				a 5 5 1 0 1 -10 0`,
      type: ElementTypes.key,
      parent
    });
  }
}

export default Key;
