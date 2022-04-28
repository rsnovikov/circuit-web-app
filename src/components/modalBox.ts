import Element from "../core/element";
import { nanoid } from "nanoid";
import Wire from "../elements/wire";
import { roundTo } from "../utils/utils";
import Node from "../elements/node";

class ModalBox {
  layout: SVGGElement;
  element: SVGRectElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect"
  );
  circElements: (Element | Wire | Node)[] = [];
  x1 = 551;
  x2 = 2249;
  y1 = 1;
  y2 = 2249;
  currentWire: Wire;

  render(): SVGGElement {
    this.init();
    return this.layout;
  }

  init() {
    this.element.setAttribute("x", String(this.x1));
    this.element.setAttribute("y", String(this.y1));
    this.element.setAttribute("width", String(this.x2 - this.x1));
    this.element.setAttribute("height", String(this.y2 - this.y1));
    this.element.setAttribute("fill", "white");
    this.element.setAttribute("stroke", "black");
    this.layout = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.layout.dataset.modalBoxId = nanoid(8);
    this.layout.append(this.element);
  }

  onBoxClick(event: MouseEvent, x: number, y: number) {
    if ((event.target as HTMLElement).dataset.outputId) {
      const target: SVGRectElement = event.target as SVGRectElement;
      if (this.currentWire) {
        this.onWireJoin(target);
      } else {
        this.onWireStart(target);
      }
    } else if ((event.target as HTMLElement).closest("[data-element-id]")) {
      console.log(event.target);
    } else {
      this.currentWire && this.onWirePut(event, x, y);
    }
  }

  onWirePut(event: MouseEvent, x: number, y: number) {
    x = roundTo(x);
    y = roundTo(y);
    this.currentWire.setPosition(x, y);
    const node = new Node(x, y);
    this.layout.append(node.render());

    this.currentWire.element2 = node.id;
    this.circElements.push(this.currentWire);
    this.circElements.push(node);

    this.currentWire = new Wire(x, y, node.id);
    this.layout.append(this.currentWire.render());
    console.log(x, y);
  }

  onWireJoin(outputElem: SVGRectElement) {
    const { x, y, element } = this.getWirePosition(outputElem);
    this.currentWire.setPosition(x, y);
    this.currentWire.element2 = element.id;
    this.circElements.push(this.currentWire);
    console.log(this.circElements);
    this.currentWire = null;
  }

  onWireMove(x: number, y: number) {
    this.currentWire.setPosition(x, y);
  }

  onWireStart(outputElem: SVGRectElement) {
    const { x, y, element } = this.getWirePosition(outputElem);
    this.currentWire = new Wire(x, y, element.id);
    this.layout.append(this.currentWire.render());
  }

  getWirePosition(outputElem: SVGRectElement) {
    const outputId = outputElem.dataset.outputId;
    const element = this.circElements.find((circElem) =>
      (circElem as Element).outputs?.find((output) => output.id === outputId)
    ) as Element;
    const output = element.outputs.find((output) => output.id === outputId);
    const x = element.x + output.x;
    const y = element.y + output.y;
    return { x, y, element };
  }

  setWiresPosition(element: Element) {
    const wires1 = this.circElements.filter((elem) => {
      if (elem.type === "wire") {
        return (elem as Wire).element2 === element.id;
      }
    });
    console.log(wires1);
    wires1.forEach((wire1: Wire) => {
      wire1.setPosition(element.x, element.y);
    });
  }
}

export default ModalBox;
