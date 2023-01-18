import Element from "../core/element";
import { nanoid } from "nanoid";
import Wire from "../elements/wire";
import { roundTo } from "../utils/utils";
import Node from "../elements/node";
import store from "../store/reducer";
import { addElement } from "../store/circuit";

class ModalBox {
  layout: SVGGElement;
  element: SVGRectElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect"
  );
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
    } else {
      this.currentWire && this.onWirePut(event, x, y);
    }
  }

  onWirePut(event: MouseEvent, x: number, y: number) {
    x = roundTo(x);
    y = roundTo(y);
    this.currentWire?.setPositionEnd(x, y);
    const node = new Node({ x, y, endWireId: this.currentWire.id });
    this.layout.append(node.render());

    this.currentWire.element2 = node.id;
    store.dispatch(addElement(this.currentWire));
    store.dispatch(addElement(node));
    this.currentWire = new Wire(x, y, node.id);
    node.addWire(this.currentWire.id, "start");
    this.layout.append(this.currentWire.render());
  }

  onWireJoin(outputElem: SVGRectElement) {
    const { x, y, element } = this.getWirePosition(outputElem);

    this.currentWire?.setPositionEnd(x, y);
    const newOutputs = element.outputs.map((output) => {
      if (output.id === outputElem.dataset.outputId && !output.wireId) {
        this.currentWire.element2 = element.id;
        store.dispatch(addElement(this.currentWire));
        output.direction = "end";
        output.wireId = this.currentWire.id;
        this.currentWire = null;
      }
      return output;
    });
    element.outputs = [...newOutputs];
  }

  onWireMove(x: number, y: number) {
    this.currentWire?.setPositionEnd(x, y);
  }

  onWireStart(outputElem: SVGRectElement) {
    const { x, y, element } = this.getWirePosition(outputElem);

    const newOutputs = element.outputs.map((output) => {
      if (output.id === outputElem.dataset.outputId && !output.wireId) {
        this.currentWire = new Wire(x, y, element.id);
        output.direction = "start";
        output.wireId = this.currentWire.id;
        this.layout.append(this.currentWire.render());
      }
      return output;
    });
    element.outputs = [...newOutputs];
  }

  getWirePosition(outputElem: SVGRectElement) {
    const outputId = outputElem.dataset.outputId;
    const element = store
      .getState()
      .circuit.circElements.find((circElem) =>
        (circElem as Element).outputs?.find((output) => output.id === outputId)
      ) as Element;
    const output = element.outputs.find((output) => output.id === outputId);
    const x = element.x + output.x;
    const y = element.y + output.y;
    return { x, y, element };
  }

  setWirePosition(element: Element, options: { put: boolean }) {
    element.outputs.forEach((output) => {
      if (output.wireId) {
        const wire = store
          .getState()
          .circuit.circElements.find((el) => el.id === output.wireId) as Wire;
        const x = (options.put ? roundTo(element.x) : element.x) + output.x;
        const y = (options.put ? roundTo(element.y) : element.y) + output.y;
        if (output.direction === "start") {
          wire?.setPositionStart(x, y);
        } else if (output.direction === "end") {
          wire?.setPositionEnd(x, y);
        }
      }
    });
  }
}

export default ModalBox;
