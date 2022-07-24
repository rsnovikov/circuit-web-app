package main.elements
{
	import main.*;
	import flash.events.*;
	import flash.geom.Point;

	public class Motor extends Element
	{
		private var resistance:Number;
		private var direction:int = 1;
		private const ROTATION_COEFFICIENT = 10;
		public function Motor(_resistance:Number = 100)
		{
			resistance = _resistance;
//			trace("Resistor", x, y, this.name);
			addEventListener(Event.ADDED, added)
		}
		public function added(e:Event)
		{
			
		}
		private function startMotor()
		{
			stopMotor();
			addEventListener(Event.ENTER_FRAME, addRotateEvent)
		}
		private function stopMotor()
		{
			if(hasEventListener(Event.ENTER_FRAME))
				removeEventListener(Event.ENTER_FRAME, addRotateEvent)
		}
		private function addRotateEvent(e:Event)
		{
			propeller.rotation-=current*direction*ROTATION_COEFFICIENT;
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
			var voltage1:Number = Math.round((volts[0]-volts[1])*100)/100;
			var voltage2:Number = Math.round((volts[0]-volts[2])*100)/100;
//			trace("voltages: ",voltage1, voltage2);
			if((voltage1!=0 && voltage2!=0) || (voltage1==0 && voltage2==0))
			{
				current = 0;
			}
			else
			if(voltage1!=0)
			{
//				trace("First case");
				direction = 1;
		    	current = (volts[0]-volts[1])/resistance;
			}
			else if(voltage2!=0)
			{
//				trace("Second case");
				direction = -1;
		    	current = (volts[0]-volts[2])/resistance;
			}
			if(current!=0)
				startMotor();
			else
				stopMotor();
//			trace("current="+current+",  volts[0]="+volts[0]+", volts[1]="+volts[1]+", volts[2]="+volts[2]);
//	    	trace(this, " res current set to ", current, "\n");
		}
		override public function getPostCount():int { return 3; }
		override public function stamp():void
		{
			trace("Stamping motor-resistor");
	    	parent.parent["sim"].stampResistor(nodes[0], nodes[1], resistance);
			parent.parent["sim"].stampResistor(nodes[0], nodes[2], resistance);
		}
		override public function over(event:MouseEvent):void
		{
			var _resistance:Number = Math.round(resistance*1000)/1000;
			var str:String = super.getBaseInfo();
				str  = 'R = '+_resistance+'\n'+str;
/*				str  = 'Volts 0 = '+volts[0]+'\n'+str;
				str  = 'Volts 1 = '+volts[1]+'\n'+str;
				str  = 'Volts 2 = '+volts[2]+'\n'+str;*/
			super.setStatText(str);
		}
	}
}