import { nanoid } from "nanoid";

class ModalWindow {
  background: HTMLElement = document.createElement("div");
  win: HTMLElement = document.createElement("div");

  constructor() {
    const layout: SVGSVGElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    this.background.classList.add("modalWindowBackground");
    this.background.dataset.modalCloseId = nanoid(8);
    layout.classList.add("modalWindowBox__svg");
    layout.setAttribute("viewBox", "0 0 40 40");
    const line: SVGPathElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    line.setAttribute(
      "d",
      `M 5 5,
          l 30 30,
          m 0 -30,
          l -30 30`
    );
    layout.dataset.modalCloseId = nanoid(8);
    line.dataset.modalCloseId = nanoid(8);
    layout.append(line);
    this.win.classList.add("modalWindowBox");
    this.win.append(layout);
    this.background.append(this.win);
  }

  open() {
    this.background.style.display = "flex";
  }

  close() {
    this.background.style.display = "none";
  }
  render(): HTMLElement {
    return this.background;
  }
}
export default ModalWindow;
