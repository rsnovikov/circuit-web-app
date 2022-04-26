import Element from "./core/element";

class ModalBox {
  element: SVGRectElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect"
  );
  circElements: Element[] = [];
  x1 = 551;
  x2 = 2999;
  y1 = 1;
  y2 = 2999;

  render(): SVGRectElement {
    this.init();
    return this.element;
  }

  init() {
    this.element.setAttribute("x", String(this.x1));
    this.element.setAttribute("y", String(this.y1));
    this.element.setAttribute("width", String(this.x2 - this.x1));
    this.element.setAttribute("height", String(this.y2 - this.y1));
    this.element.setAttribute("fill", "white");
    this.element.setAttribute("stroke", "black");
  }

  onOutputClick(element: SVGRectElement) {
    console.log(element);
  }
}

export default ModalBox;
