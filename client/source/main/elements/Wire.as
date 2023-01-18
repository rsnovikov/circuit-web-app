package main.elements
{
	import flash.display.*;
	import flash.events.*;
	import flash.geom.Point;
//	import flash.ui.Mouse;
//	import flash.ui.MouseCursor

	import main.Element;
	import main.Engine;
	import main.Connector;
	public class Wire extends Element
	{
		private var drawing:Boolean = false;
		private var startX, startY;
		private var endX, endY;
		private var connector1:Connector, connector2:Connector;

		public static const LINK_REMOVED = "linkRemoved";

		private var linkInfo:Object;
		public function Wire(_startX=null, _startY=null)
		{
			startX = _startX;
			startY = _startY;
			click();
			graphics.lineStyle(1, 0x000000, 1, false, LineScaleMode.VERTICAL, CapsStyle.ROUND, JointStyle.MITER, 10);

			addEventListener(Event.ADDED, added);
			addEventListener(MouseEvent.MOUSE_OVER, over);
//			addEventListener(MouseEvent.MOUSE_MOVE, draw);
//			addEventListener(MouseEvent.MOUSE_UP, draw);
		}
		private function added(e:Event)
		{
			removeEventListener(Event.ADDED, added);
			super.removeAllAttribs();
			if(startX!=null && startY!=null && endX!=null && endY!=null)
			{
				parent.addEventListener(Engine.ON_LOAD_DOCUMENT, onLoadDocument);
			}
		}
		override public function getObject():Object
		{
//			var obj:Object = super.getObject();
			var obj:Object = new Object();
			obj.name = super.getClassName();
			obj.index = parent.getChildIndex(this);

			obj.element1 = parent.getChildIndex(connector1.parent);
			obj.element2 = parent.getChildIndex(connector2.parent);
			obj.connector1 = connector1.name;
			obj.connector2 = connector2.name;
			obj.startX = startX;
			obj.startY = startY;
			obj.endX = endX;
			obj.endY = endY;
			return obj;
		}
		override public function setParams(obj:Object):void
		{
			startX = obj.startX;
			startY = obj.startY;
			endX = obj.endX;
			endY = obj.endY;

			linkInfo = new Object();
			linkInfo.element1 = obj.element1;
			linkInfo.element2 = obj.element2;
			linkInfo.connector1 = obj.connector1;
			linkInfo.connector2 = obj.connector2;
		}
		private function onLoadDocument(e:Event)
		{
			parent.removeEventListener(Engine.ON_LOAD_DOCUMENT, onLoadDocument);
//			trace(parent.getChildByName(linkInfo.element1)[linkInfo.connector1]);
			var _connector1:Connector = parent.getChildAt(linkInfo.element1)[linkInfo.connector1];
			var _connector2:Connector = parent.getChildAt(linkInfo.element2)[linkInfo.connector2];
			_connector1.removeNativeListeners();
			_connector2.removeNativeListeners();

			addEventListener(LINK_REMOVED, _connector1.onRemoveWire);
			addEventListener(LINK_REMOVED, _connector2.onRemoveWire);

			connect(_connector1, false);
			connect(_connector2, false);
			_connector1.setWire(this);
			_connector2.setWire(this);

			endDraw(endX, endY);
		}
/*		override public function over(e:MouseEvent)
		{
			trace(connector1.parent.name, connector2.name);
		}*/
		public function click()
		{
//			trace(this);
			if(!this.drawing)
				this.drawing = true;
			else
				this.drawing = false;
		}
		public function startDraw()
		{
			graphics.clear();
			graphics.lineStyle(1, 0x000000, 1, false, LineScaleMode.VERTICAL, CapsStyle.ROUND, JointStyle.MITER, 10);
			graphics.moveTo(startX, startY);			
		}
		public function draw(e:MouseEvent)
		{
			startDraw();
			endX = mouseX;
			endY = (mouseY>startY) ? mouseY - 1 : mouseY + 1;

			graphics.lineTo(endX, endY);
		}
		public function endDraw(_endX, _endY)
		{
			startDraw();
			endX = _endX;
			endY = _endY;
			graphics.lineTo(endX, endY);
		}
		public function connect(_connector:Connector, _analyze:Boolean = true)
		{
			if(_analyze)
				parent.parent["layout"].dispatchEvent(new Event(Engine.NEED_ANALYZE));
			if(connector1==null)
			{
				connector1=_connector;
			}
			else
			if(connector2==null)
			{
				connector2 = _connector;
			}
			else
				trace("All connectors involved!");
			if(connector1!=null && connector2!=null && connector2.parent==connector1.parent)
				return null;
			else return 1;
	 	}
		public function redraw()
		{
			if(connector1!=null && connector2!=null)
			{
				var startPoint:Point = connector1.calcCoord();
				startX = startPoint.x;
				startY = startPoint.y;
			
				var endPoint:Point = connector2.calcCoord();
			
				startDraw();
				endDraw(endPoint.x, endPoint.y);
			}
		}
		public function remove()
		{
			dispatchEvent(new Event(Wire.LINK_REMOVED));
			parent.removeChild(this);
		}
		override public function isWire():Boolean { return true; }
		override public function getVoltageSourceCount():int { return 1; }
		override public function stamp():void
		{
			parent.parent["sim"].stampVoltageSource(nodes[0], nodes[1], voltSource, 0);
		}
		override public function getPost(n:int):Point
		{
			var coord:Point = null;
			if(n==0)
				coord = new Point(startX, startY);
			else if(n==1)
				coord = new Point(endX, endY);
			return coord;
		}
	}
}