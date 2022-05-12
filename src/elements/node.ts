import { nanoid } from "nanoid";

class Node {
  x: number;
  y: number;
  id: string;
  element: SVGCircleElement;
  type = "node";
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.id = nanoid(8);
    this.element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    this.element.setAttribute("cx", String(x));
    this.element.setAttribute("cy", String(y));
    this.element.setAttribute("r", "5");
  }

  render() {
    return this.element;
  }
}

export default Node;
