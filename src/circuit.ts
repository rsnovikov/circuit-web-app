import MenuPanel from "./components/menuPanel";
import ModalBox from "./components/modalBox";
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
import ContextMenu from "./components/contextMenu";
import ModalWindow from "./components/modalWindow";

class Circuit {
  id: string;
  appBody: HTMLElement;
  layout: SVGSVGElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  draggableElement: Element;
  offset: { x: number; y: number };
  menuPanel: MenuPanel;
  modalBox: ModalBox;
  contextMenu: ContextMenu;
  modalWindow: ModalWindow;
  modules: any[] = [Power, Lamp, Resistor, Ground, Key, Relay, Switch, Motor];

  constructor(id: string) {
    this.id = id;
    this.appBody = document.getElementById(id);
    this.appBody.style.height = "750px";
    this.appBody.style.padding = "30px";
    this.layout.setAttribute("width", "750");
    this.layout.setAttribute("height", "750");
    this.layout.setAttribute("viewBox", "0 0 2250 2250");
    this.menuPanel = new MenuPanel();
    this.modalBox = new ModalBox();
    this.contextMenu = new ContextMenu();
    this.modalWindow = new ModalWindow();
  }

  start(): void {
    this.appBody.append(this.contextMenu.render());
    this.layout.append(this.menuPanel.render());
    this.layout.append(this.modalBox.render());
    this.appBody.append(this.modalWindow.render());
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
    this.appBody.addEventListener("click", this.onClick.bind(this));
    this.appBody.addEventListener("contextmenu", this.onContextMenu.bind(this));
  }

  protected getMousePosition(event: MouseEvent) {
    const CTM = this.layout.getScreenCTM();
    return {
      x: (event.clientX - CTM.e) / CTM.a,
      y: (event.clientY - CTM.f) / CTM.d
    };
  }

  protected startDrag(event: MouseEvent) {
    const elementTarget: SVGGElement =
      (event.target as SVGPathElement).closest("[data-element-id]") ||
      (event.target as SVGPathElement).closest("[data-node-id]");
    if (elementTarget) {
      this.draggableElement = [
        ...this.menuPanel.cirElements,
        ...(this.modalBox.circElements as Element[])
      ].find((elem) => {
        return elem.id === elementTarget.dataset.elementId;
      });
      console.log(this.draggableElement);
      this.offset = this.getMousePosition(event);
      const { x, y } = this.draggableElement;
      this.offset.x -= Number(x);
      this.offset.y -= Number(y);
    }
  }

  protected drag(event: MouseEvent) {
    if (this.draggableElement) {
      const cord = this.getMousePosition(event);
      const parent: string = this.draggableElement.parent;
      const x = cord.x - this.offset.x;
      const y = cord.y - this.offset.y;
      if (parent === "menu") {
        this.draggableElement.setPosition(x, y);
      } else if (
        parent === "box" &&
        x > this.modalBox.x1 &&
        x < this.modalBox.x2 &&
        y > this.modalBox.y1 &&
        y < this.modalBox.y2
      ) {
        this.draggableElement.setPosition(x, y);
        this.modalBox.setWiresPosition(this.draggableElement, { put: false });
      }
    } else if (this.modalBox.currentWire) {
      const { x, y } = this.getMousePosition(event);
      this.modalBox.onWireMove(x, y);
    }
  }

  protected endDrag(event: MouseEvent) {
    if (this.draggableElement) {
      const cord = this.getMousePosition(event);
      if (this.draggableElement.parent === "menu") {
        if (
          cord.x > this.modalBox.x1 &&
          cord.x < this.modalBox.x2 &&
          cord.y > this.modalBox.y1 &&
          cord.y < this.modalBox.y2
        ) {
          this.menuPanel.cirElements = this.menuPanel.cirElements.filter(
            (elem) => elem.id !== this.draggableElement.id
          );
          this.modalBox.circElements.push(this.draggableElement);
          this.draggableElement.setParent("box");
          this.draggableElement.setPosition(
            roundTo(cord.x - this.offset.x),
            roundTo(cord.y - this.offset.y)
          );
          const Element = this.modules.find(
            (Module) => Module.type === this.draggableElement.type
          );
          const newElem = new Element("menu");
          this.menuPanel.cirElements.push(newElem);
          this.layout.append(
            newElem.render(
              this.draggableElement.xStart,
              this.draggableElement.yStart
            )
          );
        } else {
          this.draggableElement.setPosition(
            this.draggableElement.xStart,
            this.draggableElement.yStart
          );
        }
      } else if (this.draggableElement.parent === "box") {
        this.draggableElement.setPosition(
          roundTo(cord.x - this.offset.x),
          roundTo(cord.y - this.offset.y)
        );
        this.modalBox.setWiresPosition(this.draggableElement, {
          put: true
        });
      }
      this.draggableElement = null;
    }
  }

  protected onClick(event: MouseEvent) {
    const cord = this.getMousePosition(event);
    const target = event.target as HTMLElement;
    if (target.dataset.inputId && /\d+/.test(ModalWindow.input.value)) {
      ModalWindow.toggle();
    } else if (target.dataset.modalCloseId) {
      ModalWindow.close();
    } else if (target.dataset.contextMenuItemId) {
      this.contextMenu.toggle(event);
    } else if (
      cord.x > this.modalBox.x1 &&
      cord.x < this.modalBox.x2 &&
      cord.y > this.modalBox.y1 &&
      cord.y < this.modalBox.y2
    ) {
      this.contextMenu.close(event);
      this.modalBox.onBoxClick(event, cord.x, cord.y);
    }
  }

  protected onContextMenu(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const cord = this.getMousePosition(event);
    if (target.classList.contains("contextMenu__element")) {
      this.contextMenu.close(event);
    } else if (
      cord.x > this.modalBox.x1 &&
      cord.x < this.modalBox.x2 &&
      cord.y > this.modalBox.y1 &&
      cord.y < this.modalBox.y2
    ) {
      this.contextMenu.close(event);
      if (target.closest("[data-element-id]")) {
        this.contextMenu.open(event, this.modalBox.circElements);
      }
    }
  }

  protected makeDraggable() {
    this.layout.addEventListener("mousedown", this.startDrag.bind(this));
    this.layout.addEventListener("mousemove", this.drag.bind(this));
    this.layout.addEventListener("mouseup", this.endDrag.bind(this));
    this.layout.addEventListener("mouseleave", this.endDrag.bind(this));
  }
}

export default Circuit;
