package main.elements
{
	import main.*;
	import flash.events.*;
	import flash.geom.Point;

	public class Lamp extends Element
	{
		private var resistance:Number, nominalVoltage:Number, nominalCurrent:Number;
		public function Lamp(_resistance:Number = 100, _nominalVoltage:Number = 12)
		{
			nominalVoltage = _nominalVoltage;
			resistance = _resistance;
			nominalCurrent = nominalVoltage/resistance;
			beginAnim();
		}
		override public function getObject():Object
		{
			var obj:Object = super.getObject();
			obj.resistance = resistance;
			obj.nominalVoltage = nominalVoltage;
			return obj;
		}
		override public function setParams(obj:Object):void
		{
			super.setParams(obj);
			resistance = obj.resistance;
			nominalVoltage = obj.nominalVoltage;
			nominalCurrent = nominalVoltage/resistance;
		}
		override public function getFields():Array
		{
			var arr:Array = new Array();
			arr.push(super.setField("resistance", resistance, "R = ", "0-9"));
			arr.push(super.setField("nominalVoltage", nominalVoltage, "Vmax = ", "0-9"));
			
			return arr;
		}
		public function beginAnim()
		{
			this["light"].alpha = 0;
//			this["light"].visible = false;
			this["broken"].stop();
			this["broken"].visible = false;
		}
		override public function calculateCurrent():void
		{
			beginAnim();
	    	current = (volts[0]-volts[1])/resistance;
			if(!isNaN(current))
			{
				var glow:Number = Math.abs(current) / (Math.abs(nominalCurrent)/100);
//				trace("Glow: ", glow);
				if(glow<=100)
				{
					this["light"].alpha = glow/100;
//					this["light"].visible = true;
				}
				else
				{
					this["broken"].visible = true;
					this["broken"].play();
				}
			}
//	    	trace(this, " res current set to ", current, "\n");

		}
		override public function stamp():void
		{
//			trace("Stamping resistor");
//			trace(parent.parent["sim"].circuitMatrix);
	    	parent.parent["sim"].stampResistor(nodes[0], nodes[1], resistance);
		}
		override public function over(e:MouseEvent):void
		{
			var _resistance:Number = Math.round(resistance*1000)/1000;
			var str:String = super.getBaseInfo();
				str  = 'R = '+_resistance+'\n'+str;;
				str += "Vmax = "+nominalVoltage;
			super.setStatText(str);		
		}
	}
}