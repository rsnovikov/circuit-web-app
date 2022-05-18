import Element from "../core/element";
import Wire from "../elements/wire";
import { Elements } from "../types";
import { nanoid } from "nanoid";

class ContextMenu {
  element: HTMLElement = document.createElement("ul");
  modules: string[] = [];
  activeElement: Element;

  constructor() {
    this.element.dataset.contextMenuId = nanoid(8);
    this.element.classList.add("contextMenu");
  }

  add(toolName: string, id: string) {
    const tagName: string = "li";
    const el: HTMLElement = document.createElement(tagName);
    el.id = id;
    el.classList.add("contextMenu__element");
    el.dataset.contextMenuItemId = nanoid(8);
    el.textContent = toolName;
    this.element.append(el);
  }

  open(event: MouseEvent, elements: Elements = []) {
    event.preventDefault();
    this.element.style.top = `${event.clientY}px`;
    this.element.style.left = `${event.clientX}px`;
    this.element.style.display = "inline-flex";
    const target: SVGSVGElement = (event.target as HTMLElement).closest(
      "[data-element-id]"
    );
    this.activeElement = elements.find(
      (elem) => elem.id === target.dataset.elementId
    ) as Element;
    console.log(this.activeElement);
    this.activeElement.contextMethods.forEach((item) => {
      this.add(item.title, item.id);
    });
  }

  close(event: MouseEvent) {
    event.preventDefault();
    this.element.innerHTML = "";
    this.element.style.display = "none";
  }

  toggle(event: MouseEvent) {
    const e = event.target as HTMLElement;
    this.activeElement.contextMethods.forEach((item) => {
      if (item.id === e.id) {
        item.method.call(this.activeElement);
        this.close(event);
      }
    });
  }

  render(): HTMLElement {
    return this.element;
  }
}

export default ContextMenu;
