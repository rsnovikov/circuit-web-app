package main.analysis
{
	import flash.display.*;
	import flash.geom.Point;
	import flash.events.*;
	import flash.events.Event;
	import main.elements.*;
	import main.*
	public class CirSim
	{
	    private var dumpMatrix:Boolean;
		private var analyzeFlag:Boolean;
 		private var circuitMatrix:Array, circuitRightSide:Array, origRightSide:Array, origMatrix:Array;

		private var circuitMatrixSize:int, circuitMatrixFullSize:int;

		private var circuitBottom:int;

		public var elmList:Vector.<Element>;

		private var voltageSources:Array;
		private var nodeList:Vector.<CircuitNode>;
		private var circuitRowInfo:Array;
		private var circuitPermute:Array;
		private var circuitNonLinear:Boolean;
		private var voltageSourceCount:int;
		
		private var circuitNeedsMap:Boolean;
		
		private var t:Number;
		private var timeStep:Number;
		
		private var layout:Layout
		public function CirSim(_l:Layout)
		{
			layout = _l;
		}
		public function getElmList()
		{
			var cnt:Number = layout.numChildren;
			var i:Number;
			elmList = new Vector.<Element>()
			for(i=0;i<cnt;i++)
			{
				if(layout.getChildAt(i).name!="LayoutMask" && !(layout.getChildAt(i) is Node))
					elmList.push(layout.getChildAt(i));
			}
		}
		public function newMatrix(rows:int, columns:int):Array
		{
			var i:int, j:int;
			var arr:Array = new Array(columns);
			for(j=0;j<=rows;j++)
				arr[j] = new Array(rows);
			for(i=0;i<=columns;i++)
				for(j=0;j<=rows;j++)
					arr[i][j] = 0;
			return arr;
		}
		public function newArray(length:int):Array
		{
			var i:int;
			var arr:Array = new Array(length);
			for(i=0;i<=length;i++)
				arr[i] = 0;
			return arr;
		}
		private var lastIterTime:int = 0;
		private var steps:int = 0;
 		public function updateCircuit():void
		{
			if (analyzeFlag)
			{
	    		analyzeCircuit();
	    		analyzeFlag = false;
			}
			setupScopes();
//			if (!stoppedCheck.getState())
//			{
	    		try {
					runCircuit();
	   			} catch (e:Error) {
//					e.printStackTrace();
					analyzeFlag = true;
					return;
				}
//			}
		}
	    public function getCircuitNode(n:int):CircuitNode {
			if (n >= nodeList.length)
			    return null;
			return CircuitNode(nodeList[n]);
	    }
		public function getElm(n:int):Element {
			if (n >= elmList.length)
				return null;
			return Element(elmList[n]);
		}
		public function analyzeCircuit():void {
			calcCircuitBottom();
			if (elmList.length==0)
				return;
			//stopMessage = null;
			//stopElm = null;
			var i:int, j:int;
			var vscount:int = 0;
			nodeList = new Vector.<CircuitNode>();
			var gotGround:Boolean = false;
			var gotRail:Boolean = false;
			var volt:Element = null;
			
			var ce:Element;
			//trace("ac1");
			// look for voltage or ground element
			for (i = 0; i != elmList.length; i++) {
				ce = getElm(i);
//				if (ce is RailElm)
//					gotRail = true;
				if (ce is Ground) {
					gotGround = true;
					break;
				}

				if (volt == null && ce is Voltage)
					volt = ce;
			}
			// if no ground, then the voltage elm's first terminal
			// is ground
			var cn:CircuitNode = new CircuitNode();
			if (!gotGround && volt != null && !gotRail) {
				var pt:Point = volt.getPost(0);
				cn.x = pt.x;
				cn.y = pt.y;
				nodeList.push(cn);
			} else {
				// otherwise allocate extra node for ground
				cn.x = cn.y = -1;
				nodeList.push(cn);
			}
			//trace("ac2");
			// allocate nodes and voltage sources
//			trace("elmList: ", elmList.length);
			for (i = 0; i != elmList.length; i++) {
				var ce:Element = getElm(i);
				var inodes:int = ce.getInternalNodeCount();
				var ivs:int = ce.getVoltageSourceCount();
				var posts:int = ce.getPostCount();
				
//				trace("inodes = ", inodes, "; ivs = ", ivs, "; posts = ", posts);
	    
				// allocate a node for each post and match posts to nodes
				for (j = 0; j != posts; j++) {
					var pt:Point = ce.getPost(j);
					var k:int;
					for (k = 0; k != nodeList.length; k++) {
						var cn:CircuitNode = getCircuitNode(k);
//						trace("pt.x = ", pt.x, "; cn.x = ", cn.x, "; pt.y = ", pt.y, "; cn.y = ", cn.y); 
						if (pt.x == cn.x && pt.y == cn.y)
						{
//							trace("breaking!");
							break;
						}
					}
					if (k == nodeList.length) {
//						trace("k == nodeList.length");
						var cn:CircuitNode = new CircuitNode();
						cn.x = pt.x;
						cn.y = pt.y;
						var cnl:CircuitNodeLink = new CircuitNodeLink();
						cnl.num = j;
						cnl.elm = ce;
						cn.links.push(cnl);
						ce.setNode(j, nodeList.length);
						nodeList.push(cn);
					} else {
//						trace("k != nodeList.length");
						var cnl:CircuitNodeLink = new CircuitNodeLink();
						cnl.num = j;
						cnl.elm = ce;
						getCircuitNode(k).links.push(cnl);
						ce.setNode(j, k);
						// if it's the ground node, make sure the node voltage is 0,
						// cause it may not get set later
						if (k == 0)
							ce.setNodeVoltage(j, 0);
					}
				}
//				trace("Nodes: ", nodeList.length);
				for (j = 0; j != inodes; j++)
				{
					var cn:CircuitNode = new CircuitNode();
					cn.x = cn.y = -1;
					cn.internal = true;
					var cnl:CircuitNodeLink = new CircuitNodeLink();
					cnl.num = j+posts;
					cnl.elm = ce;
					cn.links.push(cnl);
					ce.setNode(cnl.num, nodeList.length);
					nodeList.push(cn);
				}
				vscount += ivs;
			}
//			trace("vscount = ", vscount);
			voltageSources = newArray(vscount);
			vscount = 0;
			circuitNonLinear = false;
			//trace("ac3");


			// determine if circuit is nonlinear
			for (i = 0; i != elmList.length; i++) {
				var ce:Element = getElm(i);
				if (ce.nonLinear())
					circuitNonLinear = true;
				var ivs:int = ce.getVoltageSourceCount();
				for (j = 0; j != ivs; j++) {
					voltageSources[vscount] = ce;
					ce.setVoltageSource(j, vscount++);
				}
			}
			voltageSourceCount = vscount;

			var matrixSize:int = nodeList.length-1 + vscount;
/*			trace("vscount = ", vscount);
			trace("Nodes = ", nodeList.length);
			trace("Matrix Size: ", matrixSize);*/
			circuitMatrix = newMatrix(matrixSize, matrixSize);
			circuitRightSide = newArray(matrixSize);
			origMatrix = newMatrix(matrixSize, matrixSize);
			origRightSide = newArray(matrixSize);
			circuitMatrixSize = circuitMatrixFullSize = matrixSize;
			circuitRowInfo = newArray(matrixSize);
			circuitPermute = newArray(matrixSize);
			var vs:int = 0;
			for (i = 0; i != matrixSize; i++)
				circuitRowInfo[i] = new RowInfo();
			circuitNeedsMap = false;
	
			// stamp linear circuit elements
			for (i = 0; i != elmList.length; i++) {
				var ce:Element = getElm(i);
				ce.stamp();
			}
			//trace("ac4");

			// determine nodes that are unconnected
			var closure:Array = newArray(nodeList.length); // boolean
			var tempclosure:Array = newArray(nodeList.length); // boolean
			var changed:Boolean = true;
			closure[0] = true;
			while (changed) {
				changed = false;
				for (i = 0; i != elmList.length; i++) {
					var ce:Element = getElm(i);
					// loop through all ce's nodes to see if they are connected
					// to other nodes not in closure
					for (j = 0; j < ce.getPostCount(); j++) {
						if (!closure[ce.getNode(j)]) {
							if (ce.hasGroundConnection(j))
								closure[ce.getNode(j)] = changed = true;
							continue;
						}
						var k:int;
						for (k = 0; k != ce.getPostCount(); k++) {
							if (j == k)
								continue;
							var kn:int = ce.getNode(k);
							if (ce.getConnection(j, k) && !closure[kn]) {
								closure[kn] = true;
								changed = true;
							}
						}
					}
				}
				if (changed)
					continue;

				// connect unconnected nodes
				for (i = 0; i != nodeList.length; i++)
				if (!closure[i] && !getCircuitNode(i).internal) {
					trace("node " + i + " unconnected");
					stampResistor(0, i, 1e8);
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

			for (i = 0; i != elmList.length; i++) {
				var ce:Element = getElm(i);
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
				if ((ce is Voltage && ce.getPostCount() == 2) || ce is Wire) {
					var fpi:FindPathInfo = new FindPathInfo(elmList, nodeList.length, FindPathInfo.VOLTAGE, ce, ce.getNode(1));
					if (fpi.findPath(ce.getNode(0))) {
						trace("Voltage source/wire loop with no resistance!", ce);
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
				var qm:int = -1, qp:int = -1;
				var qv:Number = 0;
				var re:RowInfo = circuitRowInfo[i];
				/*trace("row " + i + " " + re.lsChanges + " " + re.rsChanges + " " + re.dropRow);*/
				if (re.lsChanges || re.dropRow || re.rsChanges)
					continue;
				var rsadd:Number = 0;

				// look for rows that can be removed
				for (j = 0; j != matrixSize; j++) {
					var q:Number = circuitMatrix[i][j];
					if (circuitRowInfo[j].type == RowInfo.ROW_CONST) {
						// keep a running total of const values that have been
						// removed already
						rsadd -= circuitRowInfo[j].value*q;
						continue;
					}
					if (q == 0)
						continue;
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
				if (qp != -1 && circuitRowInfo[qp].lsChanges) {
					trace("lschanges");
					continue;
				}
				if (qm != -1 && circuitRowInfo[qm].lsChanges) {
					trace("lschanges");
					continue;
				}
				if (j == matrixSize) {
					if (qp == -1) {
						trace("Matrix error");
						return;
					}
					var elt:RowInfo = circuitRowInfo[qp];
					if (qm == -1) {
						// we found a row with only one nonzero entry; that value
						// is a constant
						var k:int;
						for (k = 0; elt.type == RowInfo.ROW_EQUAL && k < 100; k++) {
							// follow the chain
							/*trace("following equal chain from " + i + " " + qp + " to " + elt.nodeEq);*/
							qp = elt.nodeEq;
							elt = circuitRowInfo[qp];
						}
						if (elt.type == RowInfo.ROW_EQUAL) {
							// break equal chains
							//trace("Break equal chain");
							elt.type = RowInfo.ROW_NORMAL;
							continue;
						}
						if (elt.type != RowInfo.ROW_NORMAL) {
							trace("type already " + elt.type + " for " + qp + "!");
							continue;
						}
						elt.type = RowInfo.ROW_CONST;
						elt.value = (circuitRightSide[i]+rsadd)/qv;
						circuitRowInfo[i].dropRow = true;
						//trace(qp + " * " + qv + " = const " + elt.value);
						i = -1; // start over from scratch
					} else if (circuitRightSide[i]+rsadd == 0) {
						// we found a row with only two nonzero entries, and one
						// is the negative of the other; the values are equal
						if (elt.type != RowInfo.ROW_NORMAL) {
							//trace("swapping");
							var qq:int = qm;
							qm = qp; qp = qq;
							elt = circuitRowInfo[qp];
							if (elt.type != RowInfo.ROW_NORMAL) {
								// we should follow the chain here, but this
								// hardly ever happens so it's not worth worrying
								// about
								trace("swap failed");
								continue;
							}
						}
						elt.type = RowInfo.ROW_EQUAL;
						elt.nodeEq = qm;
						circuitRowInfo[i].dropRow = true;
						//trace(qp + " = " + qm);
					}
				}
			}
			//trace("ac7");
			// find size of new matrix
			var nn:int = 0;
			for (i = 0; i != matrixSize; i++) {
				var elt:RowInfo = circuitRowInfo[i];
				if (elt.type == RowInfo.ROW_NORMAL) {
					elt.mapCol = nn++;
					//trace("col " + i + " maps to " + elt.mapCol);
					continue;
				}
				if (elt.type == RowInfo.ROW_EQUAL) {
					var e2:RowInfo = null;
					// resolve chains of equality; 100 max steps to avoid loops
					for (j = 0; j != 100; j++) {
						e2 = circuitRowInfo[elt.nodeEq];
						if (e2.type != RowInfo.ROW_EQUAL)
							break;
						if (i == e2.nodeEq)
							break;
						elt.nodeEq = e2.nodeEq;
					}
				}
				if (elt.type == RowInfo.ROW_CONST)
					elt.mapCol = -1;
			}
			for (i = 0; i != matrixSize; i++) {
					var elt:RowInfo = circuitRowInfo[i];
					if (elt.type == RowInfo.ROW_EQUAL) {
					var e2:RowInfo = circuitRowInfo[elt.nodeEq];
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
			var newsize:int = nn;
			var newmatx:Array = newMatrix(newsize, newsize); // double
			var newrs:Array   = newArray(newsize); // double
			var ii:int = 0;
			for (i = 0; i != matrixSize; i++) {
				var rri:RowInfo = circuitRowInfo[i];
				if (rri.dropRow) {
					rri.mapRow = -1;
					continue;
				}
				newrs[ii] = circuitRightSide[i];
				rri.mapRow = ii;
				//trace("Row " + i + " maps to " + ii);
				for (j = 0; j != matrixSize; j++) {
					var ri:RowInfo = circuitRowInfo[j];
					if (ri.type == RowInfo.ROW_CONST)
						newrs[ii] -= ri.value*circuitMatrix[i][j];
					else
						newmatx[ii][ri.mapCol] += circuitMatrix[i][j];
				}
				ii++;
			}

			circuitMatrix = newmatx;
			circuitRightSide = newrs;
			matrixSize = circuitMatrixSize = newsize;
			for (i = 0; i != matrixSize; i++)
				origRightSide[i] = circuitRightSide[i];
			for (i = 0; i != matrixSize; i++)
				for (j = 0; j != matrixSize; j++)
					origMatrix[i][j] = circuitMatrix[i][j];
			circuitNeedsMap = true;

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
			if (!circuitNonLinear) {
				if (!lu_factor(circuitMatrix, circuitMatrixSize, circuitPermute)) {
					trace("Singular matrix!"); // stop
					return;
				}
			}
		}

		private function calcCircuitBottom():void {
			var i:int;
			circuitBottom = 0;
			for (i = 0; i != elmList.length; i++) {
/*				Rectangle rect = getElm(i).boundingBox;
				int bottom = rect.height + rect.y;
				if (bottom > circuitBottom)
				circuitBottom = bottom;*/
			}
		}
		// stamp independent voltage source #vs, from n1 to n2, amount v
		public function stampVoltageSource(n1:int, n2:int, vs:int, v:Number):void
		{
			var vn:int = nodeList.length+vs;
//			trace("Stamping voltage");
//			trace(n1,n2,vs,v);
//			trace(vn);
			stampMatrix(vn, n1, -1);
			stampMatrix(vn, n2, 1);
			stampRightSide(vn, v);
			stampMatrix(n1, vn, 1);
			stampMatrix(n2, vn, -1);
		}
		public function stampResistor(n1:int, n2:int, r:Number):void {
			var r0:Number = 1/r;
			if (isNaN(r0) || r0 == Infinity) {
				trace("bad resistance " + r + " " + r0 + "\n");
			    var a:int = 0;
			    a /= a; // WTF?
			}
			stampMatrix(n1, n1, r0);
			stampMatrix(n2, n2, r0);
			stampMatrix(n1, n2, -r0);
			stampMatrix(n2, n1, -r0);
		}
	    // stamp value x in row i, column j, meaning that a voltage change
	    // of dv in node j will increase the current into node i by x dv.
    	// (Unless i or j is a voltage source node.)
		public function stampMatrix(i:int, j:int, x:Number):void
		{
//			trace("Stamping ", i, j, x);
			if (i > 0 && j > 0)
			{
//				trace(circuitNeedsMap);
				if (circuitNeedsMap) {
					i = circuitRowInfo[i-1].mapRow;
					var ri:RowInfo = circuitRowInfo[j-1];
					if (ri.type == RowInfo.ROW_CONST) {
						trace("Stamping constant " + i + " " + j + " " + x);
						circuitRightSide[i] -= x*ri.value;
						return;
					}
					j = ri.mapCol;
					trace("stamping " + i + " " + j + " " + x);
				} else {
					i--;
					j--;
				}
/*				trace("TESTING");
				for(var k:int=0;k<=i;k++)
					for(var l:int=0;l<=j;l++)
						trace(circuitMatrix[k][l]);
				trace(circuitMatrix[5].length);*/
				circuitMatrix[i][j] += x;
			}
		}
		// stamp value x on the right side of row i, representing an
		// independent current source flowing into node i
		public function stampRightSide(i:int, x:Number):void
		{
			if (i > 0)
			{
	    		if (circuitNeedsMap) {
					i = circuitRowInfo[i-1].mapRow;
					//trace("stamping " + i + " " + x);
				} else
					i--;
				circuitRightSide[i] += x;
			}
		}

		private var converged:Boolean;
		const subiterCount:int = 5000;
		var subIterations:int;
		public function runCircuit():void
		{
			if (circuitMatrix == null || elmList.length == 0)
			{
				circuitMatrix = null;
				return;
			}
			var iter:int;
			var debugprint:Boolean = dumpMatrix;
			dumpMatrix = false;
			const getIterCount:int = 1;
			var steprate:int = int(160*getIterCount);
			var tm:int = (new Date()).getMilliseconds();
			var lit:int = lastIterTime;
			if (1000 >= steprate*(tm-lastIterTime))
	    		return;
			for (iter = 1; ; iter++) 
			{
				var i:int, j:int, k:int, subiter:int;
				for (i = 0; i != elmList.length; i++)
				{
					var ce:Element  = getElm(i);
					ce.startIteration();
				}
				steps++;
				for (subiter = 0; subiter != subiterCount; subiter++)
				{
					converged = true;
					subIterations = subiter;
					for (i = 0; i != circuitMatrixSize; i++)
						circuitRightSide[i] = origRightSide[i];
					if (circuitNonLinear) 
					{
						for (i = 0; i != circuitMatrixSize; i++)
							for (j = 0; j != circuitMatrixSize; j++)
								circuitMatrix[i][j] = origMatrix[i][j];
					}
					for (i = 0; i != elmList.length; i++) {
						ce = getElm(i);
						ce.doStep();
					}
//					if (stopMessage != null)
//				    	return;
					var printit:Boolean = debugprint;
					debugprint = false;
					for (j = 0; j != circuitMatrixSize; j++) {
						for (i = 0; i != circuitMatrixSize; i++) {
							var x:Number = circuitMatrix[i][j];
							if (isNaN(x) || x == Infinity) {
								trace("nan/infinite matrix!");
								return;
							}
						}
					}
					if (printit) {
						for (j = 0; j != circuitMatrixSize; j++) {
						for (i = 0; i != circuitMatrixSize; i++)
							trace(circuitMatrix[j][i] + ",");
							trace("  " + circuitRightSide[j]);
						}
						trace("\n");
					}
					if (circuitNonLinear) {
						if (converged && subiter > 0)
							break;
						if (!lu_factor(circuitMatrix, circuitMatrixSize, circuitPermute))
						{
							trace("Singular matrix!", null);
							return;
						}
					}
					lu_solve(circuitMatrix, circuitMatrixSize, circuitPermute, circuitRightSide);
			
					for (j = 0; j != circuitMatrixFullSize; j++)
					{
						var ri:RowInfo = circuitRowInfo[j];
						var res:Number = 0;
						if(ri.type == RowInfo.ROW_CONST)
							res = ri.value;
						else
							res = circuitRightSide[ri.mapCol];
						/*trace(j + " " + res + " " +
							ri.type + " " + ri.mapCol);*/
						if (isNaN(res)) {
							converged = false;
							//debugprint = true;
							break;
						}
						if (j < nodeList.length-1) {
							var cn:CircuitNode = getCircuitNode(j+1);
							for (k = 0; k != cn.links.length; k++) {
								var cnl:CircuitNodeLink = CircuitNodeLink(cn.links[k]);
								cnl.elm.setNodeVoltage(cnl.num, res);
							}
						} else {
							var ji:int = j-(nodeList.length-1);
							//trace("setting vsrc " + ji + " to " + res);
							voltageSources[ji].setCurrent(ji, res);
						}
					}
					if (!circuitNonLinear)
						break;
				} // subiter
				if (subiter > 5)
					trace("converged after " + subiter + " iterations\n");
				if (subiter == subiterCount) {
					trace("Convergence failed!");
					break;
				}
				t += timeStep;
//				for (i = 0; i != scopeCount; i++)
//					scopes[i].timeStep();
				tm = (new Date()).getMilliseconds();
				lit = tm;
				var lastFrameTime:int = 1;
				if (iter*1000 >= steprate*(tm-lastIterTime) || (tm-lastFrameTime > 500))
					break;
			} // iter
			lastIterTime = lit;
			//trace((Date.currentTimeMillis()-lastFrameTime)/(double) iter);*/
    	}
		private function setupScopes():void
		{
			
		}
		// factors a matrix into upper and lower triangular matrices by
		// gaussian elimination.  On entry, a[0..n-1][0..n-1] is the
		// matrix to be factored.  ipvt[] returns an integer vector of pivot
		// indices, used in the lu_solve() routine.
		private function lu_factor(a:Array, n:int, ipvt:Array):Boolean 
		{
			var scaleFactors:Array; // double
			var i:int,j:int,k:int;

			scaleFactors = newArray(n);
	
			// divide each row by its largest element, keeping track of the
			// scaling factors
			for (i = 0; i != n; i++)
			{
				var largest:Number = 0;
				for (j = 0; j != n; j++)
				{
					var x:Number = Math.abs(a[i][j]);
					if (x > largest)
						largest = x;
				}
				// if all zeros, it's a singular matrix
				if (largest == 0)
					return false;
				scaleFactors[i] = 1.0/largest;
			}
	
			// use Crout's method; loop through the columns
			for (j = 0; j != n; j++) {
	    
				// calculate upper triangular elements for this column
				for (i = 0; i != j; i++) {
					var q:Number = a[i][j];
					for (k = 0; k != i; k++)
						q -= a[i][k]*a[k][j];
					a[i][j] = q;
				}

				// calculate lower triangular elements for this column
				var largest:Number = 0;
				var largestRow:int = -1;
				for (i = j; i != n; i++)
				{
					var q:Number = a[i][j];
					for (k = 0; k != j; k++)
						q -= a[i][k]*a[k][j];
					a[i][j] = q;
					var x:Number = Math.abs(q);
					if (x >= largest) {
						largest = x;
						largestRow = i;
					}
				}
	    
				// pivoting
				if (j != largestRow) {
					var x:Number;
					for (k = 0; k != n; k++) {
						x = a[largestRow][k];
						a[largestRow][k] = a[j][k];
						a[j][k] = x;
					}
					scaleFactors[largestRow] = scaleFactors[j];
				}

				// keep track of row interchanges
				ipvt[j] = largestRow;

				// avoid zeros
				if (a[j][j] == 0.0) {
					trace("avoided zero");
				a[j][j]=1e-18;
			}

			if (j != n-1) {
				var mult:Number = 1.0/a[j][j];
				for (i = j+1; i != n; i++)
					a[i][j] *= mult;
			}
		}
		return true;
    }

    // Solves the set of n linear equations using a LU factorization
    // previously performed by lu_factor.  On input, b[0..n-1] is the right
    // hand side of the equations, and on output, contains the solution.
    private function lu_solve(a:Array, n:int, ipvt:Array, b:Array):void 
	{
		var i:int;

		// find first nonzero b element
		for (i = 0; i != n; i++) {
		    var row:int = ipvt[i];

		    var swap:Number = b[row];
		    b[row] = b[i];
		    b[i] = swap;
		    if (swap != 0)
				break;
		}
	
		var bi:int = i++;
		for (; i < n; i++) {
			var row:int = ipvt[i];
	    	var j:int;
		    var tot:Number = b[row];
	    
			b[row] = b[i];
		    // forward substitution using the lower triangular matrix
			for (j = bi; j < i; j++)
				tot -= a[i][j]*b[j];
			b[i] = tot;
		}
		for (i = n-1; i >= 0; i--) 
		{
			var tot:Number = b[i];

			// back-substitution using the upper triangular matrix
	  		var j:int;
			for (j = i+1; j != n; j++)
				tot -= a[i][j]*b[j];
				b[i] = tot/a[i][i];
		}
		}
	}
}