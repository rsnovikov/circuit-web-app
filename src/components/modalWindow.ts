import { nanoid } from "nanoid";
import Element from "../core/element";

class ModalWindow {
  static background: HTMLElement = document.createElement("div");
  static inputData: number | string = "";
  static elementTriggerer: Element;
  static tirggererFunction: any;
  win: HTMLElement = document.createElement("div");
  static label: HTMLLabelElement = document.createElement("label");
  static input: HTMLInputElement = document.createElement("input");

  constructor() {
    const layout: SVGSVGElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    ModalWindow.background.classList.add("modalWindowBackground");
    ModalWindow.background.dataset.modalCloseId = nanoid(8);
    layout.classList.add("modalWindowBox__svg");
    layout.setAttribute("viewBox", "0 0 40 40");
    const line: SVGPathElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    line.setAttribute(
      "d",
      `M 310 5,
          l 30 30,
          m 0 -30,
          l -30 30`
    );
    layout.dataset.modalCloseId = nanoid(8);
    line.dataset.modalCloseId = nanoid(8);
    layout.append(line);
    this.win.classList.add("modalWindowBox");

    const modalWindowForm: HTMLElement = document.createElement("form");
    const button: HTMLButtonElement = document.createElement("input");

    modalWindowForm.classList.add("modalWindowBox__inputsContainer");
    ModalWindow.label.classList.add("modalWindowBox__inputsContainer__item");
    ModalWindow.input.classList.add("modalWindowBox__inputsContainer__item");
    button.classList.add("modalWindowBox__inputsContainer__item");
    button.classList.add("submitButton");

    modalWindowForm.setAttribute("name", "modalWindow-form");
    ModalWindow.label.setAttribute("for", "modalWindow-input1");
    ModalWindow.input.setAttribute("pattern", "\\d+");
    ModalWindow.input.setAttribute("autocomplete", "off");
    ModalWindow.input.name = "modalWindow-input1";
    ModalWindow.input.value = "test";

    button.type = "submit";
    button.name = "modalWindow-submit";
    button.value = "Enter";
    ModalWindow.input.setAttribute("required", "true");

    modalWindowForm.addEventListener("submit", (event) => {
      event.preventDefault();
      ModalWindow.toggle();
    });

    ModalWindow.input.addEventListener("focusout", (event) => {
      const target = event.target as HTMLElement;
      target.classList.add("_active");
    });
    ModalWindow.input.addEventListener("focusin", (event) => {
      const target = event.target as HTMLElement;
      target.classList.remove("_active");
    });

    button.dataset.inputId = nanoid(8);
    button.innerText = "Enter";

    modalWindowForm.append(ModalWindow.label, ModalWindow.input, button);
    this.win.append(layout, modalWindowForm);
    ModalWindow.background.append(this.win);
  }

  static open(
    elem: Element,
    func: any,
    labelName: string = "Введите значение"
  ) {
    ModalWindow.input.setAttribute("autofocus", "true");
    ModalWindow.input.value = "";
    ModalWindow.elementTriggerer = elem;
    ModalWindow.tirggererFunction = func;
    ModalWindow.label.innerText = labelName;
    ModalWindow.background.style.display = "flex";
  }

  static close() {
    ModalWindow.background.style.display = "none";
  }

  static toggle() {
    this.inputData = ModalWindow.input.value;
    this.tirggererFunction.apply(this.elementTriggerer, [this.inputData]);
    ModalWindow.close();
  }

  render(): HTMLElement {
    return ModalWindow.background;
  }
}

export default ModalWindow;
