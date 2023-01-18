import store from "./src/store/reducer";
import { nanoid } from "nanoid";
import config from "./config";
class CircuitController {

  onClick(event: Event) {
    const target = event.target as HTMLElement;

    switch (target.dataset.controllerType) {
    case "downloadSVG":
      this.onDownloadSVG();
      break;
    }
  }

  async onDownloadSVG() {

    const circElements = store.getState().circuit.circElements;

    const layoutSVG: SVGSVGElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    layoutSVG.innerHTML = circElements.reduce((acc, el) => {
      return acc + el.layout.outerHTML;
    }, "");
    const requestBody = {
      id: nanoid(),
      layoutSVG: layoutSVG.outerHTML
    }

    const response = await fetch(`${config.apiUrl}/downloadSVG`, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    window.open(`${config.apiUrl}/downloadSVG/${data.id}`, '_blank');
  }
}

export default CircuitController;