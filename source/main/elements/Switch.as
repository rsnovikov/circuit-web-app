package main.elements
{
	import flash.events.*;
	import main.*;
	
	public class Switch extends Element
	{
		private var position:int;
		public static const CLOSED = 1;
		public static const OPEN = 0;
		public function Switch()
		{
//			trace("Switch");
			position = OPEN;
			addEventListener(Event.ADDED, added);
		}
		private function added(e:Event)
		{
			removeEventListener(Event.ADDED, added);
			doubleClickEnabled = true;
			if(parent is Layout)
				addEventListener(MouseEvent.DOUBLE_CLICK, toggle);
		}
		override public function getObject():Object
		{
			var obj:Object = super.getObject();
			obj.position = position;
			return obj;
		}
		override public function setParams(obj:Object):void
		{
			super.setParams(obj);
			position = obj.position;
			gotoAndStop(position+1);
		}
		public function toggle(e:MouseEvent)
		{
//			trace ("Volts: ", volts[0], volts[1]);
			if(position == OPEN)
			{
				gotoAndStop(2);
				position = CLOSED;
			}
			else
			{
				gotoAndStop(1);
				position = OPEN;
			}
			parent.parent["layout"].dispatchEvent(new Event(Engine.NEED_ANALYZE));
		}
		override public function calculateCurrent():void
		{
			if(position==OPEN)
		    	current = 0;
//			trace(nodes[0], nodes[1]);
//	    	trace(this, " res current set to ", current, "\n");
		}
		override public function isWire():Boolean { return true; }
		override public function getConnection(n1:int, n2:int):Boolean { return position == CLOSED; }
		override public function getVoltageSourceCount():int {
			return (position == OPEN) ? 0 : 1;
	    }
		override public function stamp():void
		{
			if(position == CLOSED)
				parent.parent["sim"].stampVoltageSource(nodes[0], nodes[1], voltSource, 0);
		}
	}
}
