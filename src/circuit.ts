import MenuPanel from "./menuPanel";
import ModalBox from "./modalBox";
import { roundTo } from "./utils/utils";
import Element from "./core/element";
import Lamp from "./elements/lamp";
import Power from "./elements/power";
import Resistor from "./elements/resistor";
import Ground from "./elements/ground";
import Key from "./elements/key";
import Relay from "./elements/relay";
import Switch from "./elements/switch";
import Motor from "./elements/motor";

class Circuit {
  id: string;
  appBody: HTMLElement;
  layout: SVGSVGElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  selectedElement: Element;
  offset: { x: number; y: number };
  menuPanel: MenuPanel;
  modalBox: ModalBox;
  modules: any[] = [Power, Lamp, Resistor, Ground, Key, Relay, Switch, Motor];

  constructor(id: string) {
    this.id = id;
    this.appBody = document.getElementById(id);
    this.appBody.style.height = "750px";
    this.appBody.style.padding = "30px";
    this.layout.setAttribute("width", "750");
    this.layout.setAttribute("height", "750");
    this.layout.setAttribute("viewBox", "0 0 3000 3000");
    this.menuPanel = new MenuPanel();
    this.modalBox = new ModalBox();
  }

  start(): void {
    this.layout.append(this.menuPanel.render());
    this.layout.append(this.modalBox.render());
    const startX = this.menuPanel.xElement;
    this.modules.forEach((Module) => {
      const element = new Module("menu");
      this.menuPanel.cirElements.push(element);
      this.layout.append(
        element.render(this.menuPanel.xElement, this.menuPanel.yElement)
      );
      if (
        this.menuPanel.xElement ===
        startX + this.menuPanel.xStep * (this.menuPanel.rowCount - 1)
      ) {
        this.menuPanel.xElement = startX;
        this.menuPanel.yElement += this.menuPanel.yStep;
      } else {
        this.menuPanel.xElement += this.menuPanel.xStep;
      }
    });
    this.appBody.append(this.layout);
    this.makeDraggable();
  }

  protected makeDraggable() {
    const getMousePosition = (event: MouseEvent) => {
      const CTM = this.layout.getScreenCTM();
      return {
        x: (event.clientX - CTM.e) / CTM.a,
        y: (event.clientY - CTM.f) / CTM.d
      };
    };
    const startDrag = (event: MouseEvent) => {
      const elementTarget: SVGGElement = (
        event.target as SVGPathElement
      ).closest("[data-element-id]");
      if ((event.target as SVGElement).closest("[data-element-id]")) {
        this.selectedElement = [
          ...this.menuPanel.cirElements,
          ...this.modalBox.circElements
        ].find((elem) => {
          return elem.id === elementTarget.dataset.elementId;
        });
        this.offset = getMousePosition(event);
        const { x, y } = this.selectedElement;
        this.offset.x -= Number(x);
        this.offset.y -= Number(y);
      }
    };

    const drag = (event: MouseEvent) => {
      if (this.selectedElement) {
        const cord = getMousePosition(event);
        const parent: string = this.selectedElement.parent;
        const x = cord.x - this.offset.x;
        const y = cord.y - this.offset.y;
        if (parent === "menu") {
          this.selectedElement.setPosition(x, y);
        } else if (
          parent === "box" &&
          x > this.modalBox.x1 &&
          x < this.modalBox.x2 &&
          y > this.modalBox.y1 &&
          y < this.modalBox.y2
        ) {
          this.selectedElement.setPosition(x, y);
        }
      }
    };
    const endDrag = (event: MouseEvent) => {
      if (this.selectedElement) {
        const cord = getMousePosition(event);
        if (this.selectedElement.parent === "menu") {
          if (
            cord.x > this.modalBox.x1 &&
            cord.x < this.modalBox.x2 &&
            cord.y > this.modalBox.y1 &&
            cord.y < this.modalBox.y2
          ) {
            this.menuPanel.cirElements = this.menuPanel.cirElements.filter(
              (elem) => elem.id !== this.selectedElement.id
            );
            this.modalBox.circElements.push(this.selectedElement);
            this.selectedElement.setParent("box");
            this.selectedElement.setPosition(
              roundTo(cord.x - this.offset.x),
              roundTo(cord.y - this.offset.y)
            );
            console.log(this.selectedElement.type);
            const Element = this.modules.find(
              (Module) => Module.type === this.selectedElement.type
            );
            console.log(Element.type);
            const newElem = new Element("menu");
            this.menuPanel.cirElements.push(newElem);
            this.layout.append(
              newElem.render(
                this.selectedElement.xStart,
                this.selectedElement.yStart
              )
            );
            console.log(this.menuPanel.cirElements);
            console.log(this.modalBox.circElements);
          } else {
            this.selectedElement.setPosition(
              this.selectedElement.xStart,
              this.selectedElement.yStart
            );
          }
        } else if (this.selectedElement.parent === "box") {
          if (
            cord.x > this.modalBox.x1 &&
            cord.x < this.modalBox.x2 &&
            cord.y > this.modalBox.y1 &&
            cord.y < this.modalBox.y2
          ) {
            this.selectedElement.setPosition(
              roundTo(cord.x - this.offset.x),
              roundTo(cord.y - this.offset.y)
            );
          } else {
            console.log("за пределами");
          }
        }
        this.selectedElement = null;
      }
    };
    const onClick = (event: Event) => {
      if ((event.target as SVGElement).dataset.outputId) {
        this.modalBox.onOutputClick(event.target as SVGRectElement);
      }
    };
    this.layout.addEventListener("mousedown", startDrag);
    this.layout.addEventListener("mousemove", drag);
    this.layout.addEventListener("mouseup", endDrag);
    this.layout.addEventListener("mouseleave", endDrag);
    this.layout.addEventListener("click", onClick);
  }
}

export default Circuit;
