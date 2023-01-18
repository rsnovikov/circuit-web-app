package main.elements
{
	import flash.events.MouseEvent;
	import main.*;
	public class Voltage extends Element
	{
		public var maxVoltage:Number;
		public var bias:Number = 0;
		public function Voltage(_maxVoltage:Number = 12)
		{
			maxVoltage = _maxVoltage;
		}
	    override public function stamp():void
		{
			parent.parent["sim"].stampVoltageSource(nodes[0], nodes[1], voltSource, getVoltage());
		}
		override public function getObject():Object
		{
			var obj:Object = super.getObject();
			obj.maxVoltage = maxVoltage;
			return obj;
		}
		override public function setParams(obj:Object):void
		{
			super.setParams(obj);
			maxVoltage = obj.maxVoltage;
		}
		override public function getFields():Array
		{
			var arr:Array = new Array();
			arr.push(super.setField("maxVoltage", maxVoltage, "Vmax = ", "0-9"));
			return arr;
		}
		public function getVoltage():Number
		{
			return maxVoltage+bias;
		}
		override public function getVoltageSourceCount():int { return 1; }
		override public function over(e:MouseEvent):void
		{
			var _maxVoltage:Number = Math.round(maxVoltage*1000)/1000;
			var str:String = super.getBaseInfo();
				str  = 'Vmax = '+_maxVoltage+'\n'+str;
			super.setStatText(str);
		}
    }
}