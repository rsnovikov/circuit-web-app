package main 
{
	import flash.display.*;
	import flash.events.MouseEvent;

	public class TestCircle extends Sprite
	{
		public var circle:Sprite = new Sprite();
		public var target1:Sprite = new Sprite();
		public var target2:Sprite = new Sprite();
		
		public function TestCircle()
		{
			circle.graphics.beginFill(0xFFCC00);
			circle.graphics.drawCircle(0, 0, 40);
			target1.graphics.beginFill(0xCCFF00);
			target1.graphics.drawRect(0, 0, 100, 100);
			target1.name = "target1";
			target2.graphics.beginFill(0xCCFF00);
			target2.graphics.drawRect(0, 200, 100, 100);
			target2.name = "target2";

			addChild(target1);
			addChild(target2);
			addChild(circle);
			circle.addEventListener(MouseEvent.MOUSE_DOWN, mouseDown) 

			function mouseDown(event:MouseEvent):void {
	    		circle.startDrag();
			}
			circle.addEventListener(MouseEvent.MOUSE_UP, mouseReleased);

			function mouseReleased(event:MouseEvent):void {
	    		circle.stopDrag();
				if(circle.dropTarget!=null)
					trace(circle.dropTarget.name);
			}
		}
	}
}