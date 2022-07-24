package main.elements
{
	import flash.events.*;
	import flash.utils.Timer;
	import main.*;
	
	public class Relay3 extends Element
	{
		private var position:int;
		public static const UPPER = 1;
		public static const LOWER = 0;
		private var resistance:Number, operationCurrent:Number, poleCount:Number;
		
		private var oldVoltage:Number;
		private var relayTimer:Timer;
		public function Relay3(_operationCurrent = 0.12, _resistance:Number = 100)
		{
//			trace("Relay");
			resistance = _resistance;
			operationCurrent = _operationCurrent;
			poleCount = 1;
			position = LOWER;
			current = 0;

			oldVoltage = 0;
			addEventListener(Event.ADDED, added);
		}
		private function added(e:Event)
		{
			removeEventListener(Event.ADDED, added);
			doubleClickEnabled = true;
			if(parent is Layout)
			{
				addEventListener(MouseEvent.DOUBLE_CLICK, toggle);
			}
		}
		override public function getObject():Object
		{
			var obj:Object = super.getObject();
			obj.operationCurrent = operationCurrent;
			obj.resistance = resistance;
			obj.position = position;
			return obj;
		}
		override public function setParams(obj:Object):void
		{
			super.setParams(obj);
			if(obj.operationCurrent!=null)
				operationCurrent = obj.operationCurrent;
			resistance = obj.resistance;
			if(obj.position!=null)
				position = obj.position;
		}
		override public function getFields():Array
		{
			var arr:Array = new Array();
			arr.push(super.setField("resistance", resistance, "R = ", "0-9"));
			return arr;
		}
		public function toggle(e:MouseEvent)
		{
//			trace ("Volts: ", volts[0], volts[1]);
			if(position == LOWER)
			{
				gotoAndStop(2);
				position = UPPER;
			}
			else
			{
				gotoAndStop(1);
				position = LOWER;
			}
			parent.parent["layout"].dispatchEvent(new Event(Engine.NEED_ANALYZE));
		}
		override public function calculateCurrent():void
		{
			var oldFrame:Number = currentFrame;

			current = (volts[0]-volts[1])/resistance;
			if(Math.abs(current)>0)
			{
				gotoAndStop(2);
				position = UPPER;
			}
			else
			{
				gotoAndStop(1);
				position = LOWER;
			}
			if(oldFrame!=currentFrame)
				parent.parent["layout"].dispatchEvent(new Event(Engine.NEED_ANALYZE));
		}
		override public function isWire():Boolean { return false; }
		override public function getConnection(n1:int, n2:int):Boolean {

			if(((n1==3 && n2==4) || (n2==3 && n1==4)) && position == UPPER)
				return true;
			if(((n1==3 && n2==2) || (n2==3 && n1==2)) && position == LOWER)
				return true;
			if((n1 == 0 || n2 == 0) && (n1 == 1 || n2 == 1))
				return true;
			return false;
		}
		override public function getInternalNodeCount():int { return 0; }
		override public function getPostCount():int { return 2 + 3; }
		override public function getVoltageSourceCount():int
		{
			return 1;
	    }
		override public function stamp():void
		{
			parent.parent["sim"].stampResistor(nodes[0], nodes[1], resistance);
			if(position == LOWER)
				parent.parent["sim"].stampVoltageSource(nodes[2], nodes[3], voltSource, 0);
			else if(position == UPPER)
				parent.parent["sim"].stampVoltageSource(nodes[3], nodes[4], voltSource, 0);
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
