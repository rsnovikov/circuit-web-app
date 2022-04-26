import { nanoid } from "nanoid";
import { types } from "sass";

interface IOutput {
  x: number;
  y: number;
  id?: string;
}

interface IHitBox {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

interface IConstructorProps {
  d: string;
  type: string;
  parent: "menu" | "box";
  hitBox?: IHitBox;
  outputs?: IOutput[];
}

class Element {
  x: number;
  y: number;
  xStart: number;
  yStart: number;
  id: string = nanoid(8);
  hitBox: IHitBox;
  layout: SVGGElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g"
  );
  element: SVGPathElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  parent: string;
  type: string;
  elementParent: string;
  elHitBox: SVGRectElement;
  outputs: IOutput[] = [];

  constructor({ d, type, parent, hitBox, outputs }: IConstructorProps) {
    this.parent = parent;
    this.layout.dataset.elementId = this.id;
    this.element.setAttribute("d", d);
    this.type = type;
    this.elementParent = parent;
    this.element.setAttribute("stroke", "black");
    this.element.setAttribute("fill", "transparent");
    this.layout.append(this.element);
    if (hitBox) {
      this.hitBox = hitBox;
      this.elHitBox = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );
      this.elHitBox.setAttribute("x", this.hitBox.x1.toString());
      this.elHitBox.setAttribute("y", this.hitBox.y1.toString());
      this.elHitBox.setAttribute(
        "width",
        (this.hitBox.x2 - this.hitBox.x1).toString()
      );
      this.elHitBox.setAttribute(
        "height",
        (this.hitBox.y2 - this.hitBox.y1).toString()
      );
      this.elHitBox.setAttribute("fill", "transparent");
      this.layout.append(this.elHitBox);
    }
    if (outputs) {
      outputs.forEach((output) => {
        output.id = nanoid(8);
        const elOutput = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect"
        );
        this.outputs.push(output);
        const width = 15;
        const height = 15;
        elOutput.setAttribute("x", String(output.x - width / 2));
        elOutput.setAttribute("y", String(output.y - height / 2));
        elOutput.setAttribute("width", String(width));
        elOutput.setAttribute("height", String(height));
        elOutput.setAttribute("fill-opacity", "0");
        elOutput.setAttribute("fill", "red");
        elOutput.setAttribute("stroke", "none");
        elOutput.setAttribute("stroke-width", "3");
        elOutput.dataset.outputId = output.id;
        this.layout.append(elOutput);
      });
    }
  }

  render(x = 0, y = 0): SVGGElement {
    this.xStart = x;
    this.yStart = y;
    this.setPosition(x, y);
    return this.layout;
  }

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.layout.setAttribute("transform", `translate(${this.x},${this.y})`);
  }

  setParent(parent: "menu" | "box" = "box") {
    this.parent = parent;
    this.element.dataset.elementParent = parent;
  }
}

export default Element;
