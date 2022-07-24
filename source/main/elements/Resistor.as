package main.elements
{
	import main.*;
	import flash.events.*;
	import flash.geom.Point;

	public class Resistor extends Element
	{
		private var resistance:Number;
		public function Resistor(_resistance:Number = 100)
		{
			resistance = _resistance;
//			trace("Resistor", x, y, this.name);
		}
		override public function getObject():Object
		{
			var obj:Object = super.getObject();
			obj.resistance = resistance;
			return obj;
		}
		override public function setParams(obj:Object):void
		{
			super.setParams(obj);
			resistance = obj.resistance;
		}
		override public function getFields():Array
		{
			var arr:Array = new Array();
			arr.push(super.setField("resistance", resistance, "R = ", "0-9"));
			return arr;
		}
		override public function calculateCurrent():void
		{
	    	current = (volts[0]-volts[1])/resistance;
//			trace(volts[0]);
//	    	trace(this, " res current set to ", current, "\n");
		}
		override public function getPostCount():int { return 2; }
		override public function stamp():void
		{
			trace("Stamping resistor");
//			trace(parent.parent["sim"].circuitMatrix);
	    	parent.parent["sim"].stampResistor(nodes[0], nodes[1], resistance);
		}
		override public function over(event:MouseEvent):void
		{
			var _resistance:Number = Math.round(resistance*1000)/1000;
			var str:String = super.getBaseInfo();
				str  = 'R = '+_resistance+'\n'+str;
			super.setStatText(str);
		}
	}
}