package main.tools
{
	import main.*;
	import flash.events.*;
	public class Line extends Tool
	{
		public function Line()
		{
//			trace("Line tool");
			addEventListener(MouseEvent.CLICK, click);
		}
		private function click(event:MouseEvent)
		{
//			trace("Testing!");
			if(currentFrameLabel=="up")
			{
				gotoAndStop("down");
			}
			else if(currentFrameLabel=="down")
				gotoAndStop("up");
			stage.dispatchEvent(new Event(Engine.LINE_TOOL));
		}
		public function inUse():Boolean
		{
			return (currentFrameLabel=="down" ? true : false);
		}
	}
}