import Element from "./core/element";

class MenuPanel {
  element: SVGRectElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect"
  );
  cirElements: Element[] = [];
  xElement = 150;
  yElement = 150;
  xStep = 200;
  yStep = 200;
  rowCount = 2;
  x1 = 1;
  x2 = 499;
  y1 = 1;
  y2 = 1999;

  constructor() {
    this.element.setAttribute("x", String(this.x1));
    this.element.setAttribute("y", String(this.y1));
    this.element.setAttribute("rx", "100");
    this.element.setAttribute("ry", "100");
    this.element.setAttribute("width", String(this.x1 + this.x2));
    this.element.setAttribute("height", String(this.y1 + this.y2));
    this.element.setAttribute("stroke", "black");
    this.element.setAttribute("fill", "rgba(0, 0, 0, 0.05)");
  }

  render(): SVGRectElement {
    return this.element;
  }
}

export default MenuPanel;
