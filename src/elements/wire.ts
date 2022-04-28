class Wire {
  element: SVGLineElement;
  element1: string;
  element2: string;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  id: string;
  type = "wire";
  constructor(xStart: number, yStart: number, elem1: string) {
    this.x1 = xStart;
    this.y1 = yStart;
    this.element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );
    this.element.setAttribute("x1", String(xStart));
    this.element.setAttribute("x2", String(xStart));
    this.element1 = elem1;
    this.element.setAttribute("y1", String(yStart));
    this.element.setAttribute("y2", String(yStart));
    this.element.setAttribute("stroke", "blue");
  }

  render() {
    return this.element;
  }

  setPosition(x: number, y: number) {
    this.x2 = x;
    this.y2 = y;
    this.element.setAttribute("x2", String(x));
    this.element.setAttribute("y2", String(y));
  }
}

export default Wire;
