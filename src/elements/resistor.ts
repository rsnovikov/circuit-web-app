import Element from "../core/element";
import { ElementTypes } from "../enums";
import { nanoid } from "nanoid";
import ModalWindow from "../components/modalWindow";

class Resistor extends Element {
  static type: string = ElementTypes.resistor;
  resistance: number = 100;

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
    this.contextMethods.push({
      id: nanoid(8),
      title: "Изменить сопротивление",
      method: this.resistanceChangeCall
    });
  }

  resistanceChangeCall() {
    ModalWindow.open(this, this.resistanceChange, "Введите сопротивление (Ом)");
  }

  resistanceChange(res: number) {
    this.resistance = Number(res);
    console.log(this);
  }
}

export default Resistor;
