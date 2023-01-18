package main.elements
{
	import main.*;
	import flash.events.Event;
	import flash.events.TextEvent;
	public class Text extends Element
	{
		public function Text()
		{
//			trace("Text here");
//			val.addEventListener(Event.CHANGE, textChange);
		}
		override public function getObject():Object
		{
			var obj:Object = super.getObject();
			obj.val = val.text;
			return obj;
		}
		override public function setParams(obj:Object):void
		{
			super.setParams(obj);
			val.text = obj.val;
			val.width = val.textWidth+20;
			val.height = val.textHeight+20;
			val.x = -(val.textWidth+20)/2;
			val.y = 0;
			trace(val.x);
			if(val.text.length==0)
				parent.removeChild(this);
		}
		override public function getFields():Array
		{
			var arr:Array = new Array();
			arr.push(super.setField("val", val.text, "Text: "));
			return arr;
		}
		override public function getPostCount():int { return 0; } 
	}
}
