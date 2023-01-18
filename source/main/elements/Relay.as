package main.elements
{
	import flash.events.*;
	import flash.utils.Timer;
	import main.*;
	
	public class Relay extends Element
	{
		private var position:int;
		public static const CLOSED = 1;
		public static const OPEN = 0;
		private var resistance:Number, operationCurrent:Number, poleCount:Number, delay:Number;
		
		private var oldVoltage:Number;
		private var relayTimer:Timer;
		public function Relay(_operationCurrent = 0.12, _resistance:Number = 100, _delay = 0)
		{
//			trace("Relay");
			resistance = _resistance;
			operationCurrent = _operationCurrent;
			poleCount = 1;
			position = OPEN;
			current = 0;

			oldVoltage = 0;
			delay = _delay;
			timer.visible = delay>0 ? true : false;
			relayTimer = new Timer(delay, 1);
			
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
			obj.delay = delay;
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
			delay = obj.delay;
			timer.visible = delay>0 ? true : false;
			relayTimer = new Timer(delay, 1);
		}
		override public function getFields():Array
		{
			var arr:Array = new Array();
			arr.push(super.setField("resistance", resistance, "R = ", "0-9"));
			arr.push(super.setField("delay", delay, "Delay, msec:", "0-9"));
			return arr;
		}
		private function open()
		{
			position = OPEN;
			gotoAndStop(1);
		}
		private function close()
		{
			position = CLOSED;
			gotoAndStop(2);
		}
		public function startTimer()
		{
			trace("Timer started");
			relayTimer.start();
			open();
			relayTimer.addEventListener(TimerEvent.TIMER_COMPLETE, stopTimer);
			timer.addEventListener(Event.ENTER_FRAME, enterFrame);
		}
		public function stopTimer(e:TimerEvent)
		{
			trace("Timer stopped");
			close();
			relayTimer.removeEventListener(TimerEvent.TIMER_COMPLETE, stopTimer);
			timer.removeEventListener(Event.ENTER_FRAME, enterFrame);
			relayTimer.stop();
			parent.parent["layout"].dispatchEvent(new Event(Engine.NEED_ANALYZE));
		}
		public function enterFrame(e:Event)
		{
			timer["bigArrow"].rotation += 5;
			timer["smallArrow"].rotation += 0.5;
		}
		public function toggle(e:MouseEvent)
		{
			trace ("Volts: ", volts[0], volts[1]);
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
//			trace ("Volts: ", volts[0], volts[1]);
			var voltage:Number = (volts[0]==undefined || volts[0]==undefined) ? 0 : Math.round((volts[0]-volts[1])*1000)/1000;
			if(delay>0)
			{
				var newVoltage = voltage;
				if(newVoltage!=oldVoltage)
				{
					if(voltage==0)
					{
						trace("both volts = 0!");
						stopTimer(null);
						open();
					}
					else
					if(!relayTimer.running)
					{
						trace("both volts != 0!");
						startTimer();
					}
				}
				oldVoltage = newVoltage;
			}
/*			if(position==OPEN)
		    	current = 0;
			else
			{*/
			var oldFrame:Number = currentFrame;
			if(delay==0 || !relayTimer.running)
			{
		    	current = (volts[0]-volts[1])/resistance;
				//if(current == operationCurrent)
				if(Math.abs(current)!=0)
				{
					close();
				}
				else
				{
//					trace("Opening!");
					open();
				}
			}
//			if(Math.abs(current)==0)
			if(oldFrame!=currentFrame)
				parent.parent["layout"].dispatchEvent(new Event(Engine.NEED_ANALYZE));
//			}
//	    	trace(this, " res current set to ", current, "\n");
		}
		override public function isWire():Boolean { return false; }
		override public function getConnection(n1:int, n2:int):Boolean {
//			return true;
			var odd:Number = 0, even:Number = 0;
			if(n1%2 == 0 && n2%2 == 1) { odd = n1; even = n2; }
			else if(n1%2 == 1 && n2%2 == 0) { odd = n2; even = n1;	}

			if((n1 == 0 || n2 == 0) && (n1 == 1 || n2 == 1))
				return true;
			else
				return (position == CLOSED) && (Math.abs(n1-n2)==1) && (odd<even);
		}
		override public function getInternalNodeCount():int { return 0; }
		override public function getPostCount():int { return 2 + poleCount*2; }
		override public function getVoltageSourceCount():int
		{
			return (position == OPEN) ? 0 : 1*poleCount;
	    }
		override public function stamp():void
		{
			parent.parent["sim"].stampResistor(nodes[0], nodes[1], resistance);
			if(position == CLOSED)
				parent.parent["sim"].stampVoltageSource(nodes[2], nodes[3], voltSource, 0);
		}
		override public function over(event:MouseEvent):void
		{
			var _resistance:Number = Math.round(resistance*1000)/1000;
			var str:String = super.getBaseInfo();
				str  = 'R = '+_resistance+'\n'+str;
				str  = 'delay = '+delay+'\n'+str;
/*				str  = 'volts 0 = '+volts[0]+'\n'+str;
				str  = 'volts 1 = '+volts[1]+'\n'+str;
				str  = 'volts 2 = '+volts[2]+'\n'+str;
				str  = 'volts 3 = '+volts[3]+'\n'+str;*/
			super.setStatText(str);
		}
	}
}
