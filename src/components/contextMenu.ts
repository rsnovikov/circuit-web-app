import Element from "../core/element";
import Wire from "../elements/wire";
import { Elements } from "../types";
import { log } from "util";

class ContextMenu {
  element: HTMLElement = document.createElement("ui");
  modules: string[] = [];
  layout: HTMLElement = document.querySelector(".contextMenu");

  open(event: MouseEvent, elements: Elements = []) {
    console.log(elements);
    event.preventDefault();
    this.layout.style.top = `${event.clientY}px`;
    this.layout.style.left = `${event.clientX}px`;
    this.layout.style.display = "inline-flex";
    const target: SVGSVGElement = (event.target as HTMLElement).closest(
      "[data-element-id]"
    );
    console.log(target.dataset);
    const element = elements.find(
      (elem) => elem.id === target.dataset.elementId
    ) as Element;
    this.modules = element.contextMethods.map((method) => method.title);
    console.log(this.modules);
    this.modules.forEach((module) => this.add(module));
  }

  add(toolName: string) {
    const tagName: string = "li";
    const el: HTMLElement = document.createElement(tagName);
    el.classList.add("contextMenu__element");
    el.textContent = toolName;
    this.layout.append(el);
    el.addEventListener("click", this.close.bind(this));
  }

  close(event: MouseEvent) {
    event.preventDefault();
    this.layout.innerHTML = "";
    this.layout.style.display = "none";
  }

  render(): HTMLElement {
    this.element.classList.add("contextMenu");
    return this.element;
  }
}

export default ContextMenu;
