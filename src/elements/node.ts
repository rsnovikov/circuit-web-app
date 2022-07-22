import { nanoid } from "nanoid";
import { IHitBox, IOutput } from "../core/element";

interface INodeProps {
  x: number;
  y: number;
}

class Node {
  x: number;
  y: number;
  id: string;
  element: SVGCircleElement;
  type = "node";
  hitBox: IHitBox;
  layout: SVGGElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g"
  );
  elHitBox: SVGRectElement;
  outputs: IOutput[] = [];
  parent: string;

  constructor({ x, y }: INodeProps) {
    this.parent = "box";
    this.x = x;
    this.y = y;
    this.id = nanoid(8);
    this.element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    this.element.setAttribute("r", "5");
    this.element.setAttribute("stroke", "black");
    this.element.setAttribute("fill", "black");
    this.setPosition(x, y);
    this.layout.append(this.element);

    const elOutput = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    const width = 15;
    const height = 15;
    const firstOutput: IOutput = {
      x: 0,
      y: 0,
      id: nanoid(8),
      direction: "end"
    };
    this.outputs.push(firstOutput);
    elOutput.setAttribute("x", String(firstOutput.x - width / 2));
    elOutput.setAttribute("y", String(firstOutput.y - height / 2));
    elOutput.setAttribute("width", String(width));
    elOutput.setAttribute("height", String(height));
    elOutput.setAttribute("fill-opacity", "0");
    elOutput.setAttribute("fill", "red");
    elOutput.setAttribute("stroke", "none");
    elOutput.setAttribute("stroke-width", "3");
    elOutput.dataset.outputId = firstOutput.id;
    elOutput.style.display = "block";
    this.layout.append(elOutput);
    this.layout.dataset.elementId = this.id;
  }

  render() {
    return this.layout;
  }

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.setTransform();
  }

  setTransform() {
    this.layout.setAttribute("transform", `translate(${this.x},${this.y})`);
  }
}

export default Node;
