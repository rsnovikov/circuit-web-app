import Element from "./core/element";
import Wire from "./elements/wire";
import Node from "./elements/node";

export interface IElementInput {
  x: number;
  y: number;
}

export interface IState {
  event: MouseEvent;
  elements: Elements;
  modalWindow: {
    status: boolean;
    value: string;
  };
  contextMenu: {
    status: boolean;
    content: string[];
  };
}

export type Elements = (Element | Node | Wire)[];
