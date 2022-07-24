import Node from "../src/elements/node";
import Element from "../src/core/element";
import Ground from "../src/elements/ground";
import Power from "../src/elements/power";
import RowInfo from "./RowInfo";
import FindPathInfo from "./FindPathInfo";

class CirSim {
  private dumpMatrix: boolean;
  private analyzeFlag: boolean;
  private circuitMatrix: [][];
  circuitRightSide: [];
  origRightSide: [];
  origMatrix: [][];

  private circuitMatrixSize: number;
  circuitMatrixFullSize: number;

  private circuitBottom: number;

  elmList: []; // Element

  private voltageSources: [];
  private nodeList: []; //CircuitNode
  private circuitRowInfo: [];
  private circuitPermute: [];
  private circuitNonLinear: Boolean;
  private voltageSourceCount: number;

  private circuitNeedsMap: Boolean;

  private t: number;
  private timeStep: number;

  private layout: any;

  // CirSim(_l: Layout) {
  //     this.layout = _l;
  // }                                ??

  // getElmList() {
  //     let cnt: Number = this.layout.numChildren;
  //     let i: Number;
  //     elmList = new Vector.<Element>()
  //     for (i = 0; i < cnt; i++) {
  //         if (layout.getChildAt(i).name != "LayoutMask" && !(layout.getChildAt(i) is //вроде не понадобится
  //         Node
  //     ))
  //         elmList.push(layout.getChildAt(i));
  //     }
  // }

  newMatrix(rows: number, columns: number): [][] {
    let arr: [][] = [];
    let row: [] = this.newArray(columns);
    for (let i = 0; i < rows; i++) arr.push(row);
    return arr;
  }

  newArray(length: number): [] {
    let arr: [] = [];
    for (let i = 0; i < length; i++) arr.push(0);
    return arr;
  }

  private lastIterTime: number = 0;
  private steps: number = 0;

  updateCircuit(): void {
    if (this.analyzeFlag) {
      this.analyzeCircuit();
      this.analyzeFlag = false;
    }
    this.setupScopes();
    //			if (!stoppedCheck.getState())
    //			{
    try {
      this.runCircuit();
    } catch (e: Error) {
      //					e.prnumberStackTrace();
      this.analyzeFlag = true;
      return;
    }
    //			}
  }

  // getCircuitNode(n: number): CircuitNode {                 //node вроде
  //     if (n >= this.nodeList.length)                        //ниже попробую переписать
  //         return null;
  //     return CircuitNode(this.nodeList[n]);
  // }
  getCircuitNode(n: number): Node {
    if (n >= this.nodeList.length) return null;
    return this.nodeList[n];
  }
  getElm(n: number): Element {
    if (n >= this.elmList.length)
      //вроде тоже не надо и мы просто буджем брать из массива в сторе
      return null;
    return this.elmList[n];
  }

  analyzeCircuit(): void {
    this.calcCircuitBottom();
    if (this.elmList.length == 0) return;
    //stopMessage = null;
    //stopElm = null;
    let i: number, j: number;
    let vscount: number = 0;
    this.nodeList = [];
    let gotGround: Boolean = false;
    let gotRail: Boolean = false;
    let volt: Element = null;

    let ce: Element;
    //trace("ac1");
    // look for voltage or ground element
    for (i = 0; i != this.elmList.length; i++) {
      ce = this.getElm(i);
      //				if (ce is RailElm)
      //					gotRail = true;
      if (ce.type === Ground.type) {
        gotGround = true;
        break;
      }

      if (volt == null && ce.type === Power.type) volt = ce;
    }
    // if no ground, then the voltage elm's first terminal
    // is ground
    let cn: CircuitNode = new CircuitNode(); //видимо нода
    if (!gotGround && volt != null && !gotRail) {
      let pt: Ponumber = volt.getPost(0); //блять, нихуя не понял,что делает метод гетПост (находится в элементе)
      cn.x = pt.x;
      cn.y = pt.y;
      this.nodeList.push(cn);
    } else {
      // otherwise allocate extra node for ground
      cn.x = cn.y = -1;
      this.nodeList.push(cn);
    }
    //trace("ac2");
    // allocate nodes and voltage sources
    //			trace("elmList: ", elmList.length);
    for (i = 0; i != this.elmList.length; i++) {
      let ce: Element = this.getElm(i);
      let inodes: number = ce.getnumberernalNodeCount(); //обе функции возвращают просто число лол
      let ivs: number = ce.getVoltageSourceCount();
      let posts: number = ce.outputs.length; //возвращает количество аутпутов ce.

      //				trace("inodes = ", inodes, "; ivs = ", ivs, "; posts = ", posts);

      // allocate a node for each post and match posts to nodes
      for (j = 0; j != posts; j++) {
        let pt: Ponumber = ce.getPost(j);
        let k: number;
        for (k = 0; k != this.nodeList.length; k++) {
          let cn: CircuitNode = getCircuitNode(k);
          //						trace("pt.x = ", pt.x, "; cn.x = ", cn.x, "; pt.y = ", pt.y, "; cn.y = ", cn.y);
          if (pt.x == cn.x && pt.y == cn.y) {
            //							trace("breaking!");
            break;
          }
        }
        if (k == this.nodeList.length) {
          //						trace("k == this.nodeList.length");
          let cn: CircuitNode = new CircuitNode();
          cn.x = pt.x;
          cn.y = pt.y;
          let cnl: CircuitNodeLink = new CircuitNodeLink();
          cnl.num = j;
          cnl.elm = ce;
          cn.links.push(cnl);
          ce.setNode(j, this.nodeList.length); //public function setNode(p:int, n:int):void { nodes[p] = n; }
          this.nodeList.push(cn);
        } else {
          //						trace("k != this.nodeList.length");
          let cnl: CircuitNodeLink = new CircuitNodeLink();
          cnl.num = j;
          cnl.elm = ce;
          this.getCircuitNode(k).links.push(cnl); //поле в CircuitNode.as
          ce.setNode(j, k);
          // if it's the ground node, make sure the node voltage is 0,
          // cause it may not get set later
          if (k == 0) ce.setNodeVoltage(j, 0);
        }
      }
      //				trace("Nodes: ", this.nodeList.length);
      for (j = 0; j != inodes; j++) {
        let cn: CircuitNode = new CircuitNode();
        cn.x = cn.y = -1;
        cn.numberernal = true;
        let cnl: CircuitNodeLink = new CircuitNodeLink();
        cnl.num = j + posts;
        cnl.elm = ce;
        cn.links.push(cnl);
        ce.setNode(cnl.num, this.nodeList.length);
        this.nodeList.push(cn);
      }
      vscount += ivs;
    }
    //			trace("vscount = ", vscount);
    this.voltageSources = this.newArray(vscount);
    vscount = 0;
    this.circuitNonLinear = false;
    //trace("ac3");

    // determine if circuit is nonlinear
    for (i = 0; i != this.elmList.length; i++) {
      let ce: Element = this.getElm(i);
      if (ce.nonLinear()) this.circuitNonLinear = true;
      let ivs: number = ce.getVoltageSourceCount();
      for (j = 0; j != ivs; j++) {
        this.voltageSources[vscount] = ce;
        ce.setVoltageSource(j, vscount++);
      }
    }
    this.voltageSourceCount = vscount;

    let matrixSize: number = this.nodeList.length - 1 + vscount;
    /*			trace("vscount = ", vscount);
                    trace("Nodes = ", this.nodeList.length);
                    trace("Matrix Size: ", matrixSize);*/
    this.circuitMatrix = this.newMatrix(matrixSize, matrixSize);
    this.circuitRightSide = this.newArray(matrixSize);
    this.origMatrix = this.newMatrix(matrixSize, matrixSize);
    this.origRightSide = this.newArray(matrixSize);
    this.circuitMatrixSize = this.circuitMatrixFullSize = matrixSize;
    this.circuitRowInfo = this.newArray(matrixSize);
    this.circuitPermute = this.newArray(matrixSize);
    let vs: number = 0;
    for (i = 0; i != matrixSize; i++) this.circuitRowInfo[i] = new RowInfo(); //хз вообще, какого хуя в массив 0й кладется ебучий экземпляр класса, но я переписал класс RowInfo на ts
    this.circuitNeedsMap = false;

    // stamp linear circuit elements
    for (i = 0; i != this.elmList.length; i++) {
      let ce: Element = this.getElm(i);
      ce.stamp();
    }
    //trace("ac4");

    // determine nodes that are unconnected
    let closure: [] = this.newArray(this.nodeList.length); // boolean
    let changed: boolean = true;
    closure[0] = true; //опять очередное несовпадение типов
    while (changed) {
      changed = false;
      for (i = 0; i != this.elmList.length; i++) {
        let ce: Element = this.getElm(i);
        // loop through all ce's nodes to see if they are connected
        // to other nodes not in closure
        for (j = 0; j < ce.getPostCount(); j++) {
          if (!closure[ce.getNode(j)]) {
            if (ce.hasGroundConnection(j))
              closure[ce.getNode(j)] = changed = true;
            continue;
          }
          let k: number;
          for (k = 0; k != ce.getPostCount(); k++) {
            if (j == k) continue;
            let kn: number = ce.getNode(k);
            if (ce.getConnection(j, k) && !closure[kn]) {
              closure[kn] = true;
              changed = true;
            }
          }
        }
      }
      if (changed) continue;

      // connect unconnected nodes
      for (i = 0; i != this.nodeList.length; i++)
        if (!closure[i] && !this.getCircuitNode(i).numberernal) {
          // trace("node " + i + " unconnected"); хуету закоментил
          this.stampResistor(0, i, 1e8);
          closure[i] = true;
          changed = true;
          break;
        }
      /*				trace("matrixSize = " + matrixSize);

                            for (j = 0; j != circuitMatrixSize; j++) {
                                trace(j + ": ");
                                for (i = 0; i != circuitMatrixSize; i++)
                                    trace(circuitMatrix[j][i] + " ");
                                trace("  " + circuitRightSide[j] + "\n");
                            }
                            trace("\n");*/
    }
    //trace("ac5");

    for (i = 0; i != this.elmList.length; i++) {
      let ce: Element = this.getElm(i);
      // look for inductors with no current path
      /*				if (ce is InductorElm) {
                                FindPathInfo fpi = new FindPathInfo(FindPathInfo.INDUCT, ce,
                                                    ce.getNode(1));
                                // first try findPath with maximum depth of 5, to avoid slowdowns
                                if (!fpi.findPath(ce.getNode(0), 5) &&
                                    !fpi.findPath(ce.getNode(0))) {
                                    trace(ce + " no path");
                                    ce.reset();
                                }
                            }
                            // look for current sources with no current path
                            if (ce instanceof CurrentElm) {
                                FindPathInfo fpi = new FindPathInfo(FindPathInfo.INDUCT, ce, ce.getNode(1));
                                if (!fpi.findPath(ce.getNode(0))) {
                                    stop("No path for current source!", ce);
                                    return;
                                }
                            }*/
      // look for voltage source loops
      if (
        (ce.type == Power.type && ce.getPostCount() == 2) ||
        ce.type == "wire"
      ) {
        let fpi: FindPathInfo = new FindPathInfo(
          this.elmList,
          this.nodeList.length,
          FindPathInfo.VOLTAGE,
          ce,
          ce.getNode(1)
        ); //надо переписать класс FindPathInfo на ts, сделаю позже.    Ну сделал, но там опять кринж
        if (fpi.findPath(ce.getNode(0))) {
          // trace("Voltage source/wire loop with no resistance!", ce);
          //						trace(stage);
          //						Engine(parent)["status"].text = "На участке цепи с источником ЭДС отсутствует сопротивление (КЗ)"
          return;
        }
      }
      // look for shorted caps, or caps w/ voltage but no R
      /*				if (ce instanceof CapacitorElm) {
                                FindPathInfo fpi = new FindPathInfo(FindPathInfo.SHORT, ce, ce.getNode(1));
                                if (fpi.findPath(ce.getNode(0))) {
                                    trace(ce + " shorted");
                                    ce.reset();
                                } else {
                                    fpi = new FindPathInfo(FindPathInfo.CAP_V, ce, ce.getNode(1));
                                    if (fpi.findPath(ce.getNode(0))) {
                                        stop("Capacitor loop with no resistance!", ce);
                                        return;
                                    }
                                }
                            }*/
    }
    //trace("ac6");

    // simplify the matrix; this speeds things up quite a bit
    for (i = 0; i != matrixSize; i++) {
      let qm: number = -1,
        qp: number = -1;
      let qv: number = 0;
      let re: RowInfo = this.circuitRowInfo[i];
      /*trace("row " + i + " " + re.lsChanges + " " + re.rsChanges + " " + re.dropRow);*/
      if (re.lsChanges || re.dropRow || re.rsChanges) continue;
      let rsadd: Number = 0;

      // look for rows that can be removed
      for (j = 0; j != matrixSize; j++) {
        let q: Number = this.circuitMatrix[i][j];
        if (this.circuitRowInfo[j].type == RowInfo.ROW_CONST) {
          //типы
          // keep a running total of const values that have been
          // removed already
          rsadd -= this.circuitRowInfo[j].value * q; //типы
          continue;
        }
        if (q == 0) continue;
        if (qp == -1) {
          qp = j;
          qv = q;
          continue;
        }
        if (qm == -1 && q == -qv) {
          qm = j;
          continue;
        }
        break;
      }
      //				trace("line " + i + " " + qp + " " + qm + " " + j);
      if (qp != -1 && this.circuitRowInfo[qp].lsChanges) {
        //trace("lschanges"); //да что такое этот ваш trace
        continue;
      }
      if (qm != -1 && this.circuitRowInfo[qm].lsChanges) {
        //trace("lschanges");
        continue;
      }
      if (j == matrixSize) {
        if (qp == -1) {
          //trace("Matrix error");
          return;
        }
        let elt: RowInfo = this.circuitRowInfo[qp];
        if (qm == -1) {
          // we found a row with only one nonzero entry; that value
          // is a constant
          let k: number;
          for (k = 0; elt.type == RowInfo.ROW_EQUAL && k < 100; k++) {
            // follow the chain
            /*trace("following equal chain from " + i + " " + qp + " to " + elt.nodeEq);*/
            qp = elt.nodeEq;
            elt = this.circuitRowInfo[qp];
          }
          if (elt.type == RowInfo.ROW_EQUAL) {
            // break equal chains
            //trace("Break equal chain");
            elt.type = RowInfo.ROW_NORMAL;
            continue;
          }
          if (elt.type != RowInfo.ROW_NORMAL) {
            //trace("type already " + elt.type + " for " + qp + "!");
            continue;
          }
          elt.type = RowInfo.ROW_CONST;
          elt.value = (this.circuitRightSide[i] + rsadd) / qv;
          this.circuitRowInfo[i].dropRow = true;
          //trace(qp + " * " + qv + " = const " + elt.value);
          i = -1; // start over from scratch
        } else if (this.circuitRightSide[i] + rsadd == 0) {
          // we found a row with only two nonzero entries, and one
          // is the negative of the other; the values are equal
          if (elt.type != RowInfo.ROW_NORMAL) {
            //trace("swapping");
            let qq: number = qm;
            qm = qp;
            qp = qq;
            elt = this.circuitRowInfo[qp];
            if (elt.type != RowInfo.ROW_NORMAL) {
              // we should follow the chain here, but this
              // hardly ever happens so it's not worth worrying
              // about
              //trace("swap failed");
              continue;
            }
          }
          elt.type = RowInfo.ROW_EQUAL;
          elt.nodeEq = qm;
          this.circuitRowInfo[i].dropRow = true;
          //trace(qp + " = " + qm);
        }
      }
    }
    //trace("ac7");
    // find size of new matrix
    let nn: number = 0;
    for (i = 0; i != matrixSize; i++) {
      let elt: RowInfo = this.circuitRowInfo[i];
      if (elt.type == RowInfo.ROW_NORMAL) {
        elt.mapCol = nn++;
        //trace("col " + i + " maps to " + elt.mapCol);
        continue;
      }
      if (elt.type == RowInfo.ROW_EQUAL) {
        let e2: RowInfo = null;
        // resolve chains of equality; 100 max steps to avoid loops
        for (j = 0; j != 100; j++) {
          e2 = this.circuitRowInfo[elt.nodeEq];
          if (e2.type != RowInfo.ROW_EQUAL) break;
          if (i == e2.nodeEq) break;
          elt.nodeEq = e2.nodeEq;
        }
      }
      if (elt.type == RowInfo.ROW_CONST) elt.mapCol = -1;
    }
    for (i = 0; i != matrixSize; i++) {
      let elt: RowInfo = this.circuitRowInfo[i];
      if (elt.type == RowInfo.ROW_EQUAL) {
        let e2: RowInfo = this.circuitRowInfo[elt.nodeEq];
        if (e2.type == RowInfo.ROW_CONST) {
          // if something is equal to a const, it's a const
          elt.type = e2.type;
          elt.value = e2.value;
          elt.mapCol = -1;
          //trace(i + " = [late]const " + elt.value);
        } else {
          elt.mapCol = e2.mapCol;
          //trace(i + " maps to: " + e2.mapCol);
        }
      }
    }
    //trace("ac8");

    /*			trace("matrixSize = " + matrixSize);

                    for (j = 0; j != circuitMatrixSize; j++) {
                        trace(j + ": ");
                        for (i = 0; i != circuitMatrixSize; i++)
                            trace(circuitMatrix[j][i] + " ");
                        trace("  " + circuitRightSide[j] + "\n");
                    }
                    trace("\n");*/

    // make the new, simplified matrix
    let newsize: number = nn;
    let newmatx: [][] = this.newMatrix(newsize, newsize); // double
    let newrs: [] = this.newArray(newsize); // double
    let ii: number = 0;
    for (i = 0; i != matrixSize; i++) {
      let rri: RowInfo = this.circuitRowInfo[i];
      if (rri.dropRow) {
        rri.mapRow = -1;
        continue;
      }
      newrs[ii] = this.circuitRightSide[i];
      rri.mapRow = ii;
      //trace("Row " + i + " maps to " + ii);
      for (j = 0; j != matrixSize; j++) {
        let ri: RowInfo = this.circuitRowInfo[j];
        if (ri.type == RowInfo.ROW_CONST)
          newrs[ii] -= ri.value * this.circuitMatrix[i][j];
        else newmatx[ii][ri.mapCol] += this.circuitMatrix[i][j];
      }
      ii++;
    }

    this.circuitMatrix = newmatx;
    this.circuitRightSide = newrs;
    matrixSize = this.circuitMatrixSize = newsize;
    for (i = 0; i != matrixSize; i++)
      this.origRightSide[i] = this.circuitRightSide[i];
    for (i = 0; i != matrixSize; i++)
      for (j = 0; j != matrixSize; j++)
        this.origMatrix[i][j] = this.circuitMatrix[i][j];
    this.circuitNeedsMap = true;

    /*
                trace("matrixSize = " + matrixSize + " " + circuitNonLinear);
                for (j = 0; j != circuitMatrixSize; j++) {
                    for (i = 0; i != circuitMatrixSize; i++)
                    trace(circuitMatrix[j][i] + " ");
                    trace("  " + circuitRightSide[j] + "\n");
                }
                trace("\n");*/

    // if a matrix is linear, we can do the lu_factor here instead of
    // needing to do it every frame
    if (!this.circuitNonLinear) {
      if (
        !this.lu_factor(
          this.circuitMatrix,
          this.circuitMatrixSize,
          this.circuitPermute
        )
      ) {
        trace("Singular matrix!"); // stop
        return;
      }
    }
  }

  calcCircuitBottom(): void {
    let i: number;
    this.circuitBottom = 0;
    for (i = 0; i != this.elmList.length; i++) {
      /*				Rectangle rect = getElm(i).boundingBox;
                            number bottom = rect.height + rect.y;
                            if (bottom > circuitBottom)
                            circuitBottom = bottom;*/
    }
  }

  // stamp independent voltage source #vs, from n1 to n2, amount v
  stampVoltageSource(n1: number, n2: number, vs: number, v: Number): void {
    let vn: number = this.nodeList.length + vs;
    //			trace("Stamping voltage");
    //			trace(n1,n2,vs,v);
    //			trace(vn);
    this.stampMatrix(vn, n1, -1);
    this.stampMatrix(vn, n2, 1);
    this.stampRightSide(vn, v);
    this.stampMatrix(n1, vn, 1);
    this.stampMatrix(n2, vn, -1);
  }

  stampResistor(n1: number, n2: number, r: number): void {
    let r0: number = 1 / r;
    if (isNaN(r0) || r0 == Infinity) {
      //trace("bad resistance " + r + " " + r0 + "\n");
    }
    this.stampMatrix(n1, n1, r0);
    this.stampMatrix(n2, n2, r0);
    this.stampMatrix(n1, n2, -r0);
    this.stampMatrix(n2, n1, -r0);
  }

  // stamp value x in row i, column j, meaning that a voltage change
  // of dv in node j will increase the current numbero node i by x dv.
  // (Unless i or j is a voltage source node.)
  stampMatrix(i: number, j: number, x: number): void {
    //			trace("Stamping ", i, j, x);
    if (i > 0 && j > 0) {
      //				trace(circuitNeedsMap);
      if (this.circuitNeedsMap) {
        i = this.circuitRowInfo[i - 1].mapRow; // в RowInfo
        let ri: RowInfo = this.circuitRowInfo[j - 1];
        if (ri.type == RowInfo.ROW_CONST) {
          //trace("Stamping constant " + i + " " + j + " " + x);
          this.circuitRightSide[i] -= x * ri.value;
          return;
        }
        j = ri.mapCol;
        //trace("stamping " + i + " " + j + " " + x);
      } else {
        i--;
        j--;
      }
      /*				//trace("TESTING");
                            for(let k:number=0;k<=i;k++)
                                for(let l:number=0;l<=j;l++)
                                    trace(circuitMatrix[k][l]);
                            trace(circuitMatrix[5].length);*/
      this.circuitMatrix[i][j] += x;
    }
  }

  // stamp value x on the right side of row i, representing an
  // independent current source flowing numbero node i
  stampRightSide(i: number, x: Number): void {
    if (i > 0) {
      if (this.circuitNeedsMap) {
        i = this.circuitRowInfo[i - 1].mapRow;
        //trace("stamping " + i + " " + x);
      } else i--;
      this.circuitRightSide[i] += x;
    }
  }

  private converged: Boolean;
  subiterCount: number = 5000;
  subIterations: number;

  runCircuit(): void {
    if (this.circuitMatrix == null || this.elmList.length == 0) {
      this.circuitMatrix = null;
      return;
    }
    let iter: number;
    let debugprnumber: boolean = this.dumpMatrix;
    this.dumpMatrix = false;
    const getIterCount: number = 1;
    let steprate: number = Number(160 * getIterCount);
    let tm: number = new Date().getMilliseconds();
    let lit: number = this.lastIterTime;
    if (1000 >= steprate * (tm - this.lastIterTime)) return;
    for (iter = 1; ; iter++) {
      let i: number, j: number, k: number, subiter: number;
      for (i = 0; i != this.elmList.length; i++) {
        let ce: Element = this.getElm(i);
        ce.startIteration();
      }
      this.steps++;
      for (subiter = 0; subiter != this.subiterCount; subiter++) {
        this.converged = true;
        this.subIterations = subiter;
        for (i = 0; i != this.circuitMatrixSize; i++)
          this.circuitRightSide[i] = this.origRightSide[i];
        if (this.circuitNonLinear) {
          for (i = 0; i != this.circuitMatrixSize; i++)
            for (j = 0; j != this.circuitMatrixSize; j++)
              this.circuitMatrix[i][j] = this.origMatrix[i][j];
        }
        for (i = 0; i != this.elmList.length; i++) {
          let ce = this.getElm(i); //добавил объявление, иначе не видит переменную
          ce.doStep();
        }
        //					if (stopMessage != null)
        //				    	return;
        let prnumberit: Boolean = debugprnumber;
        debugprnumber = false;
        for (j = 0; j != this.circuitMatrixSize; j++) {
          for (i = 0; i != this.circuitMatrixSize; i++) {
            let x: number = this.circuitMatrix[i][j];
            if (isNaN(x) || x == Infinity) {
              //trace("nan/infinite matrix!");
              return;
            }
          }
        }
        if (prnumberit) {
          for (j = 0; j != this.circuitMatrixSize; j++) {
            for (i = 0; i != this.circuitMatrixSize; i++) {
              // trace(this.circuitMatrix[j][i] + ",");
              // trace("  " + this.circuitRightSide[j]);
            }
          }
          //trace("\n");
        }
        if (this.circuitNonLinear) {
          if (this.converged && subiter > 0) break;
          if (
            !this.lu_factor(
              this.circuitMatrix,
              this.circuitMatrixSize,
              this.circuitPermute
            )
          ) {
            //trace("Singular matrix!", null);
            return;
          }
        }
        this.lu_solve(
          this.circuitMatrix,
          this.circuitMatrixSize,
          this.circuitPermute,
          this.circuitRightSide
        );

        for (j = 0; j != this.circuitMatrixFullSize; j++) {
          let ri: RowInfo = this.circuitRowInfo[j];
          let res: number = 0;
          if (ri.type == RowInfo.ROW_CONST) res = ri.value;
          else res = this.circuitRightSide[ri.mapCol];
          /*trace(j + " " + res + " " +
                        ri.type + " " + ri.mapCol);*/
          if (isNaN(res)) {
            this.converged = false;
            //debugprnumber = true;
            break;
          }
          if (j < this.nodeList.length - 1) {
            let cn: CircuitNode = this.getCircuitNode(j + 1);
            for (k = 0; k != cn.links.length; k++) {
              let cnl: CircuitNodeLink = CircuitNodeLink(cn.links[k]);
              cnl.elm.setNodeVoltage(cnl.num, res);
            }
          } else {
            let ji: number = j - (this.nodeList.length - 1);
            //trace("setting vsrc " + ji + " to " + res);
            this.voltageSources[ji].setCurrent(ji, res); //метод добавить, делает он конечно пиздец дохуя public function setCurrent(x:int, c:Number):void { current = c; }
          }
        }
        if (!this.circuitNonLinear) break;
      } // subiter
      if (subiter > 5)
        if (subiter == this.subiterCount) {
          //trace("converged after " + subiter + " iterations\n");
          //trace("Convergence failed!");
          break;
        }
      this.t += this.timeStep;
      //				for (i = 0; i != scopeCount; i++)
      //					scopes[i].timeStep();
      tm = new Date().getMilliseconds();
      lit = tm;
      let lastFrameTime: number = 1;
      if (
        iter * 1000 >= steprate * (tm - this.lastIterTime) ||
        tm - lastFrameTime > 500
      )
        break;
    } // iter
    this.lastIterTime = lit;
    //trace((Date.currentTimeMillis()-lastFrameTime)/(double) iter);*/
  }

  // factors a matrix numbero upper and lower triangular matrices by
  // gaussian elimination.  On entry, a[0..n-1][0..n-1] is the
  // matrix to be factored.  ipvt[] returns an numbereger vector of pivot
  // indices, used in the lu_solve() routine.

  lu_factor(a: [][], n: number, ipvt: []): Boolean {
    let scaleFactors: []; // double
    let i: number, j: number, k: number;

    scaleFactors = this.newArray(n);

    // divide each row by its largest element, keeping track of the
    // scaling factors
    for (i = 0; i != n; i++) {
      let largest: number = 0;
      for (j = 0; j != n; j++) {
        let x: number = Math.abs(a[i][j]);
        if (x > largest) largest = x;
      }
      // if all zeros, it's a singular matrix
      if (largest == 0) return false;
      scaleFactors[i] = 1.0 / largest; //типы
    }

    // use Crout's method; loop through the columns
    for (j = 0; j != n; j++) {
      // calculate upper triangular elements for this column
      for (i = 0; i != j; i++) {
        let q: number = a[i][j];
        for (k = 0; k != i; k++) q -= a[i][k] * a[k][j];
        a[i][j] = q;
      }

      // calculate lower triangular elements for this column
      let largest: number = 0;
      let largestRow: number = -1;
      for (i = j; i != n; i++) {
        let q: number = a[i][j];
        for (k = 0; k != j; k++) q -= a[i][k] * a[k][j];
        a[i][j] = q;
        let x: number = Math.abs(q);
        if (x >= largest) {
          largest = x;
          largestRow = i;
        }
      }

      // pivoting
      if (j != largestRow) {
        let x: Number;
        for (k = 0; k != n; k++) {
          x = a[largestRow][k];
          a[largestRow][k] = a[j][k];
          a[j][k] = x;
        }
        scaleFactors[largestRow] = scaleFactors[j];
      }

      // keep track of row numbererchanges
      ipvt[j] = largestRow;

      // avoid zeros
      if (a[j][j] == 0.0) {
        //trace("avoided zero");
        a[j][j] = 1e-18;
      }

      if (j != n - 1) {
        let mult: number = 1.0 / a[j][j];
        for (i = j + 1; i != n; i++) a[i][j] *= mult;
      }
    }
    return true;
  }

  // Solves the set of n linear equations using a LU factorization
  // previously performed by lu_factor.  On input, b[0..n-1] is the right
  // hand side of the equations, and on output, contains the solution.

  lu_solve(a: [][], n: number, ipvt: [], b: []): void {
    let i: number;

    // find first nonzero b element
    for (i = 0; i != n; i++) {
      let row: number = ipvt[i];

      let swap: number = b[row];
      b[row] = b[i];
      b[i] = swap;
      if (swap != 0) break;
    }

    let bi: number = i++;
    for (; i < n; i++) {
      let row: number = ipvt[i];
      let j: number;
      let tot: number = b[row];

      b[row] = b[i];
      // forward substitution using the lower triangular matrix
      for (j = bi; j < i; j++) tot -= a[i][j] * b[j];
      b[i] = tot;
    }
    for (i = n - 1; i >= 0; i--) {
      let tot: number = b[i];

      // back-substitution using the upper triangular matrix
      let j: number;
      for (j = i + 1; j != n; j++) tot -= a[i][j] * b[j];
      b[i] = tot / a[i][i];
    }
  }
}
export default CirSim;
