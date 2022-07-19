import Element from "../core/element";
import Wire from "../elements/wire";
import { Elements } from "../types";
import { nanoid } from "nanoid";
import store from "../redux/reducer";
import {
  contextMenuAddElement,
  contextMenuClearElements
} from "../redux/state";

class ContextMenu {
  element: HTMLElement = document.createElement("ul");
  activeElement: Element;

  constructor() {
    this.element.dataset.contextMenuId = nanoid(8);
    this.element.classList.add("contextMenu");
    store.subscribe(() => {
      let { state } = store.getState();
      // if (state.contextMenu.status) {
      //   state.
      //   this.open(state.event,state.elements);
      // }
    });
    store.subscribe(() => {});
  }

  add(toolName: string, id: string) {
    const tagName: string = "li";
    const el: HTMLElement = document.createElement(tagName);
    el.id = id;
    el.classList.add("contextMenu__element");
    el.dataset.contextMenuItemId = nanoid(8);
    el.textContent =
      toolName.slice(0, 1).toUpperCase() + toolName.slice(1).toLowerCase();
    this.element.append(el);
  }

  open(event: MouseEvent, elements: Elements = []) {
    event.preventDefault();
    this.element.style.top = `${event.pageY}px`;
    this.element.style.left = `${event.pageX}px`;
    this.element.style.display = "inline-flex";
    const target: SVGSVGElement = (event.target as HTMLElement).closest(
      "[data-element-id]"
    );
    this.activeElement = elements.find(
      (elem) => elem.id === target.dataset.elementId
    ) as Element;
    this.activeElement.contextMethods.forEach((item) => {
      this.add(item.title, item.id);
      store.dispatch(contextMenuAddElement({ title: item.title, id: item.id }));
    });
  }

  close(event: MouseEvent) {
    event.preventDefault();
    this.element.innerHTML = "";
    this.element.style.display = "none";
    store.dispatch(contextMenuClearElements());
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
