package main.elements
{
	import flash.events.*;
	import main.*;
	
	public class Node extends Element
	{
		private var posts:int = 0;
		private const MAX_POSTS = 6;
		public static const POST_CHANGED = "postConnected";
//		private var post1:Connector, post2:Connector, post3:Connector, post4:Connector, post5:Connector, post6:Connector;
		public function Node()
		{
//			trace("Node");
			doubleClickEnabled = true;
//			addEventListener(Event.POST_CHANGED, toggleNodeVisible);
			addEventListener(MouseEvent.MOUSE_OVER, over);
		}
/*		override public function over(e:MouseEvent)
		{
//			trace("posts:", posts);
		}*/
		public function addPost()
		{
/*			if(posts<6)
			{
				trace("Adding");
				posts++;
				var post:Connector = new Connector();
				this["post"+posts] = post;
				this["post"+posts].x = this["post0"].x + 1;
				this["post"+posts].y = this["post0"].y;
//				this["post"+posts].alpha = 50;
				addChild(this["post"+posts]);
			}*/
		}
/*		public function toggle(e:MouseEvent)
		{
			trace ("Volts: ", volts[0], volts[1]);
			if(position == OFF)
			{
				gotoAndStop(2);
				position = ON;
			}
			else
			{
				gotoAndStop(1);
				position = OFF;
			}
			parent.parent["layout"].dispatchEvent(new Event(Engine.NEED_ANALYZE));
		}*/
		override public function calculateCurrent():void
		{
//	    	current = 0;
//	    	trace(this, " res current set to ", current, "\n");
		}
		private function getConnectedPosts()
		{
			var i:int, j:int=0;
			for(i=0;i<MAX_POSTS;i++)
				if(this["post"+i]["hasWire"]())
					j++;
			trace("Connected posts", j);
			return j;
			
		}
		public function toggleNodeVisible():void
		{
			trace("TESTING");
			if(getConnectedPosts()>2)
				this["img"].visible = true;
			else
				this["img"].visible = false;
		}
		public function getConnector():Connector
		{
			return this["post0"];
		}
		override public function isWire():Boolean { return true; }
		override public function getConnection(n1:int, n2:int):Boolean { return true; }
		override public function getPostCount():int { return posts; }
		override public function getVoltageSourceCount():int {
			return 1;
	    }
		override public function stamp():void
		{
			parent.parent["sim"].stampVoltageSource(nodes[0], nodes[1], voltSource, 0);
		}
	}
}
