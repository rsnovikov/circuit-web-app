package main.analysis
{
	import main.Element;
	import main.elements.*;
    class FindPathInfo {
		public static const INDUCT:int  = 1;
		public static const VOLTAGE:int 	= 2;
		public static const SHORT:int   	= 3;
		public static const CAP_V:int   	= 4;
		private var used:Array; // boolean
		private var dest:int;
		private var firstElm:Element;
		private var type:int;
		private var elmList:Vector.<Element>;

		public function FindPathInfo(_elmList:Vector.<Element>, nodes:int, t:int, e:Element, d:int)
		{
			elmList = _elmList;
	    	dest = d;
		    type = t;
		    firstElm = e;
		    used = new Array(nodes);
		}
	    public function getElm(n:int):Element {
			if (n >= elmList.length)
			    return null;
			return Element(elmList[n]);
		}
		public function findPath(n1:int, depth:int = -1):Boolean
		{
	    	if (n1 == dest)
				return true;
		    if (depth-- == 0)
				return false;
		    if (used[n1]) {
				//System.out.println("used " + n1);
				return false;
		    }
		    used[n1] = true;
		    var i:int;
		    for (i = 0; i != elmList.length; i++) {
				var ce:Element = getElm(i);
				if (ce == firstElm)
		    		continue;
	/*			if (type == INDUCT) {
			    	if (ce instanceof CurrentElm)
						continue;
				}*/
				if (type == VOLTAGE) {
			    	if (!(ce.isWire() || ce is Voltage))
						continue;
				}
				if (type == SHORT && !ce.isWire())
			    	continue;
				/*if (type == CAP_V) {
				    if (!(ce.isWire() || ce instanceof CapacitorElm ||
					  ce instanceof VoltageElm))
					continue;
				}*/
				if (n1 == 0)
				{
			    	// look for posts which have a ground connection;
				    // our path can go through ground
				    var j:int;
				    for (j = 0; j != ce.getPostCount(); j++)
					if (ce.hasGroundConnection(j) && findPath(ce.getNode(j), depth))
					{
					    used[n1] = false;
					    return true;
					}
				}
				var j:int;
				for (j = 0; j != ce.getPostCount(); j++)
				{
				    //System.out.println(ce + " " + ce.getNode(j));
				    if (ce.getNode(j) == n1)
						break;
				}
				if (j == ce.getPostCount())
				    continue;
				if (ce.hasGroundConnection(j) && findPath(0, depth))
				{
				    //System.out.println(ce + " has ground");
				    used[n1] = false;
				    return true;
				}
	/*			if (type == INDUCT && ce instanceof InductorElm)
				{
				    double c = ce.getCurrent();
				    if (j == 0)
					c = -c;
				    //System.out.println("matching " + c + " to " + firstElm.getCurrent());
				    //System.out.println(ce + " " + firstElm);
				    if (Math.abs(c-firstElm.getCurrent()) > 1e-10)
						continue;
				}*/
				var k:int;
				for (k = 0; k != ce.getPostCount(); k++)
				{
				    if (j == k)
						continue;
					    //System.out.println(ce + " " + ce.getNode(j) + "-" + ce.getNode(k));
				    if (ce.getConnection(j, k) && findPath(ce.getNode(k), depth))
					{
						//System.out.println("got findpath " + n1);
						used[n1] = false;
						return true;
				    }
			    	//System.out.println("back on findpath " + n1);
				}
			}
		    used[n1] = false;
		    //System.out.println(n1 + " failed");
		    return false;
		}
    }
}
