import Element from "../core/element";
import { ElementTypes } from "../enums";
import { nanoid } from "nanoid";
import ModalWindow from "../components/modalWindow";

class Lamp extends Element {
  static type: string = ElementTypes.lamp;
  physisData = {
    resistance: 50,
    voltage: 5,
    maxVoltage: 20
  };

  constructor(parent: "menu" | "box" = "menu") {
    super({
      d: `
				M 0 0,
 				m -50 0,
 				a 50 50 1 0 1 100 0,
 				a 50 50 1 0 1 -100 0,
 				m 15 35,
 				l 70 -70,
 				m -70 0,
 				l 70 70
 				m 15 -35
 				l 30 0
 				m -130 0
 				l -30 0`,
      type: ElementTypes.lamp,
      parent,
      outputs: [
        {
          x: 80,
          y: 0
        },
        {
          x: -80,
          y: 0
        }
      ]
    });
    this.contextMethods.push({
      id: nanoid(8),
      title: "Изменить сопротивление",
      method: this.resistanceChangeCall
    });
    this.contextMethods.push({
      id: nanoid(8),
      title: "Изменить напряжение",
      method: this.voltageChangeCall
    });
  }

  resistanceChangeCall() {
    ModalWindow.open(this, this.resistanceChange, "Введите сопротивление (Ом)");
  }

  resistanceChange(res: number) {
    this.physisData.resistance = Number(res);
    this.update();
  }
  voltageChangeCall() {
    ModalWindow.open(this, this.voltageChange, "Введите напряжение (В)");
  }

  voltageChange(res: number) {
    this.physisData.voltage = Number(res);
    this.update();
  }

  update() {
    const lightPower = this.physisData.voltage / this.physisData.maxVoltage;
    if (lightPower < 1) {
      this.element.setAttribute("fill", `rgba(255, 95, 0, ${lightPower})`);
    } else {
      this.element.setAttribute("fill", "red");
    }
  }
}

export default Lamp;
