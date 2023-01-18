import Element from "../core/element";
import { ElementTypes } from "../enums";
import { nanoid } from "nanoid";

class Motor extends Element {
  static type: string = ElementTypes.motor;
  motorAxis = document.createElementNS("http://www.w3.org/2000/svg", "path");
  constructor(parent: "menu" | "box" = "menu") {
    super({
      d: `
				M 0 0,
				m -70 0,
				a 70 70 1 0 1 140 0,
				a 70 70 1 0 1 -140 0l -40 0,
        m 180 0,
        l 40 0,
        m -110 70,
        l 0 40
		`,
      type: ElementTypes.motor,
      parent,
      outputs: [
        {
          x: -110,
          y: 0
        },
        {
          x: 110,
          y: 0
        },
        {
          x: 0,
          y: 110
        }
      ]
    });

    this.motorAxis.setAttribute(
      "d",
      `M 0 0,
        m 0 -60,
      l 0 60,
    l -50 35,
      m 100 0,
    l -50 -35`
    );
    this.motorAxis.setAttribute("fill", "transparent");
    this.motorAxis.setAttribute("stroke", "black");
    this.motorAxis.setAttribute("stroke-width", "2");
    this.layout.append(this.motorAxis);
    // this.contextMethods.push({
    //   id: nanoid(8),
    //   title: "Включить мотор",
    //   method: this.motorOn
    // });
  }

  // async motorOn() {
  //   let counter = 0;
  //   while (counter < 100) {
  //     setTimeout(() => {
  //       this.motorAxis.setAttribute("transform", `rotate(${360})`);
  //       counter++;
  //     }, 100);
  //   }
  // }
}

export default Motor;
