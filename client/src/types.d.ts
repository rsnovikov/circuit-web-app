import Element from "./core/element";
import Wire from "./elements/wire";
import Node from "./elements/node";

export type Elements = (Element | Node | Wire)[];
export type CircElement = Element | Node | Wire;
export interface IState {
  circElements: Elements;
}

export type Ponumber = Point | null;
