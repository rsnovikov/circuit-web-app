package main.elements
{
	import main.*;
	public class Ground extends Element
	{
		public function Ground()
		{
//			trace("Ground");
		}
		override public function getPostCount():int { return 1; }
		override public function hasGroundConnection(n1:int):Boolean { return true; }
		override public function setCurrent(x:int, c:Number):void { current = -c; }
	    override public function stamp():void
		{
			parent.parent["sim"].stampVoltageSource(0, nodes[0], voltSource, 0);
		}
	}
}
