import CircuitNodeLink from "./circuitNodeLink";

class CircuitNode {
  x: number;
  y: number;
  links: CircuitNodeLink[];
  internal: boolean;
  constructor() {
    this.links = [];
  }
}

export default CircuitNode;
