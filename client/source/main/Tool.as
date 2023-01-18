package main
{
	import flash.display.*;
	import flash.events.MouseEvent;
	public class Tool extends MovieClip
	{
		public function Tool()
		{
			stop();
			addEventListener(MouseEvent.CLICK, click);
//			addEventListener(MouseEvent.MOUSE_UP, drop);
//			addEventListener(MouseEvent.MOUSE_OUT, drop);
		}
		private function click(event:MouseEvent)
		{
/*			if (this.currentFrameLabel=="up")
			{
				gotoAndStop("down");
			}
			else
			{
				gotoAndStop("up");
			}*/
		}
	}
}