// import { CircElement, Elements } from "../src/types";
// import Element from "../src/core/element";
// import Power from "../src/elements/power";
//
// class FindPathInfo {
//   static INDUCT: number = 1;
//   static VOLTAGE: number = 2;
//   static SHORT: number = 3;
//   static CAP_V: number = 4;
//   private used: any[]; // boolean
//   private dest: number;
//   private firstElm: CircElement;
//   private type: number;
//   private elmList: Elements; // может быть, а может быть и нет
//
//   constructor(
//     _elmList: Elements,
//     nodes: number,
//     t: number,
//     e: CircElement,
//     d: number
//   ) {
//     this.elmList = _elmList;
//     this.dest = d;
//     this.type = t;
//     this.firstElm = e;
//     this.used = new Array(nodes);
//   }
//   getElm(n: number): any {
//     if (n >= this.elmList.length) return null;
//     return this.elmList[n];
//   }
//   findPath(n1: number, depth: number = -1): boolean {
//     if (n1 == this.dest) return true;
//     if (depth-- == 0) return false;
//     if (this.used[n1]) {
//       //System.out.prnumberln("used " + n1);
//       return false;
//     }
//     this.used[n1] = true;
//     let i: number;
//     for (i = 0; i != this.elmList.length; i++) {
//       let ce: Element = this.getElm(i);
//       if (ce == this.firstElm) continue;
//       /*			if (type == INDUCT) {
//                   if (ce instanceof CurrentElm)
//                   continue;
//               }*/
//       if (this.type == FindPathInfo.VOLTAGE) {
//         if (ce.type != "wire") continue;
//       }
//       if (this.type == FindPathInfo.SHORT && ce.type != "wire") continue;
//       /*if (type == CAP_V) {
//             if (!(ce.isWire() || ce instanceof CapacitorElm ||
//             ce instanceof VoltageElm))
//           continue;
//         }*/
//       if (n1 == 0) {
//         // look for posts which have a ground connection;
//         // our path can go through ground
//         let j: number;
//         for (j = 0; j != ce.getPostCount(); j++)
//           if (
//             ce.hasGroundConnection(j) &&
//             this.findPath(ce.getNode(j), depth)
//           ) {
//             this.used[n1] = false;
//             return true;
//           }
//       }
//       let j: number;
//       for (j = 0; j != ce.getPostCount(); j++) {
//         //System.out.prnumberln(ce + " " + ce.getNode(j));
//         if (ce.getNode(j) == n1) break;
//       }
//       if (j == ce.getPostCount()) continue;
//       if (ce.hasGroundConnection(j) && this.findPath(0, depth)) {
//         //System.out.prnumberln(ce + " has ground");
//         this.used[n1] = false;
//         return true;
//       }
//       /*			if (type == INDUCT && ce instanceof InductorElm)
//               {
//                   double c = ce.getCurrent();
//                   if (j == 0)
//                 c = -c;
//                   //System.out.prnumberln("matching " + c + " to " + firstElm.getCurrent());
//                   //System.out.prnumberln(ce + " " + firstElm);
//                   if (Math.abs(c-firstElm.getCurrent()) > 1e-10)
//                   continue;
//               }*/
//       let k: number;
//       for (k = 0; k != ce.getPostCount(); k++) {
//         if (j == k) continue;
//         //System.out.prnumberln(ce + " " + ce.getNode(j) + "-" + ce.getNode(k));
//         if (ce.getConnection(j, k) && this.findPath(ce.getNode(k), depth)) {
//           //System.out.prnumberln("got findpath " + n1);
//           this.used[n1] = false;
//           return true;
//         }
//         //System.out.prnumberln("back on findpath " + n1);
//       }
//     }
//     this.used[n1] = false;
//     //System.out.prnumberln(n1 + " failed");
//     return false;
//   }
// }
//
// export default FindPathInfo;
