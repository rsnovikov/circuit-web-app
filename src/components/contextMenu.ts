import Element from "../core/element";
import Wire from "../elements/wire";

class ContextMenu {
  element: HTMLElement = document.createElement("ui");
  modules: string[] = ["Свойства", "Удалить", "Изменить цвет", "Повернуть"];
  layout: HTMLElement = document.querySelector(".contextMenu");
  flag: boolean = false;

  open(event: MouseEvent, elements: (Element | Wire)[] = []) {
    event.preventDefault();
    this.flag = true;
    this.layout.style.top = `${event.clientY}px`;
    this.layout.style.left = `${event.clientX}px`;
    this.layout.style.display = "inline-flex";
    this.modules.forEach((el) => this.add(el));
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
    this.flag = false;
    this.layout.style.display = "none";
  }

  render(): HTMLElement {
    this.element.classList.add("contextMenu");
    return this.element;
  }
}

export default ContextMenu;
