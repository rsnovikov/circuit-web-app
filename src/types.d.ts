import Element from "./core/element";
import Wire from "./elements/wire";
import Node from "./elements/node";

export interface IElementInput {
  x: number;
  y: number;
}

export type Elements = (Element | Node | Wire)[];
