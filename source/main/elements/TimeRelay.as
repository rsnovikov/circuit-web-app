package main.elements
{
	import flash.events.*;
	import flash.utils.Timer;
	import main.*;
	
	public class TimeRelay extends Element
	{
		private var position:int;
		private var relayTimer:Timer;
		private var delay:Number;
		public static const CLOSED = 1;
		public static const OPEN = 0;
//		public var oldVolts:Array;
		public var oldVoltage:Number;
		public function TimeRelay(_delay:int = 4000)
		{
			trace("Time relay");
			delay = _delay;

			doubleClickEnabled = true;
/*			oldVolts = new Array();
			oldVolts[0] = 0;
			oldVolts[1] = 0;*/
			oldVoltage = 0;
			position = OPEN;
			relayTimer = new Timer(delay, 1);
//            arrowTimer.addEventListener(TimerEvent.TIMER, timerHandler);
		}
		public function startTimer()
		{
			trace("Timer started");
//			timed_out = false;
			relayTimer.start();
			position = OPEN;
			relayTimer.addEventListener(TimerEvent.TIMER_COMPLETE, stopTimer);
			addEventListener(Event.ENTER_FRAME, enterFrame);
		}
		public function stopTimer(e:TimerEvent)
		{
			trace("Timer stopped");
			position = CLOSED;
//			timed_out = true;
			relayTimer.removeEventListener(TimerEvent.TIMER_COMPLETE, stopTimer);
			removeEventListener(Event.ENTER_FRAME, enterFrame);
			relayTimer.stop();
			parent.parent["layout"].dispatchEvent(new Event(Engine.NEED_ANALYZE));
		}
		public function enterFrame(e:Event)
		{
			this["bigArrow"].rotation += 5;
			this["smallArrow"].rotation += 0.5;
		}
		override public function calculateCurrent():void
		{
			trace(volts[0], volts[1]);

			var newVoltage = (volts[0]>volts[1]) ? volts[0] : volts[1]
			if(newVoltage!=oldVoltage)
			{
				position = OPEN;
				if(!relayTimer.running && (volts[0] || volts[1]))
					startTimer();
			}
//				stopTimer(null);
			oldVoltage = newVoltage;

			if(position==OPEN)
		    	current = 0;
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
