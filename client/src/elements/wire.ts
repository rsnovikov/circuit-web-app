import { nanoid } from "nanoid";
import store from "../store/reducer";
import { removeElement } from "../store/circuit";

class Wire {
  layout: SVGLineElement;
  element1: string;
  element2: string;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  id: string;
  parent = "box";
  type = "wire";
  outputs: any = {
    length: 2
  };

  constructor(xStart: number, yStart: number, elem1: string) {
    this.id = nanoid(8);
    this.x1 = xStart;
    this.y1 = yStart;
    this.layout = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );
    this.layout.setAttribute("x1", String(xStart));
    this.layout.setAttribute("x2", String(xStart));
    this.element1 = elem1;
    this.layout.setAttribute("y1", String(yStart));
    this.layout.setAttribute("y2", String(yStart));
    this.layout.setAttribute("stroke", "blue");
    this.layout.dataset.wireId = this.id;
  }

  render() {
    return this.layout;
  }

  setPositionEnd(x: number, y: number) {
    this.x2 = x;
    this.y2 = y;
    this.layout.setAttribute("x2", String(x));
    this.layout.setAttribute("y2", String(y));
  }

  setPositionStart(x: number, y: number) {
    this.x1 = x;
    this.y1 = y;
    this.layout.setAttribute("x1", String(x));
    this.layout.setAttribute("y1", String(y));
  }

  remove() {
    this.layout.remove();
    store.dispatch(removeElement({ id: this.id }));
  }

  getVoltageSourceCount(): number {
    return 1;
  }

  hasGroundConnection(): boolean {
    return false;
  }

  getConnection(n1: number, n2: number): boolean {
    return true;
  }
  nonLinear() {
    return false;
  }

  getPostCount() {
    return this.outputs.length;
  }
}

export default Wire;
