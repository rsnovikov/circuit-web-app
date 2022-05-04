import Element from "../core/element";
import Wire from "../elements/wire";

class ContextMenu {
  modules: HTMLElement[] = [];
  layout: HTMLElement = document.querySelector(".contextMenu");
  flag: boolean = false;

  open(event: MouseEvent, elements: (Element | Wire)[] = []) {
    event.preventDefault();
    this.flag = true;
    this.layout.style.top = `${event.clientY}px`;
    this.layout.style.left = `${event.clientX}px`;
    this.layout.style.display = "inline-flex";
    this.add("Свойства");
    this.add("Удалить");
    this.add("Изменить цвет");
    this.add("Повернуть");
  }

  add(toolName: string) {
    const tagName: string = "li";
    const el: HTMLElement = document.createElement(tagName);
    el.classList.add("contextMenu__element");
    el.textContent = toolName;
    this.layout.append(el);
  }

  close(event: MouseEvent) {
    event.preventDefault();
    this.layout.innerHTML = "";
    this.flag = false;
    this.layout.style.display = "none";
  }
}

export default ContextMenu;
