package main
{
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.events.EventDispatcher;
	import flash.events.Event;
	import main.elements.Wire;
	import main.elements.Node;
	
	import flash.geom.Point;
	public class Connector extends Sprite
	{
		private var coord:Point;
		private var wire:Wire = null;
		public function Connector(multipleLink:Boolean = false)
		{
			alpha = 0;
			addEventListener(Event.ADDED, added);
		}
		private function added(e:Event)
		{
			removeEventListener(Event.ADDED, added);
			if(parent.parent==null || parent.parent is Layout)
			{
				addNativeListeners();
				parent.addEventListener(MouseEvent.MOUSE_DOWN, startRedraw);
				parent.addEventListener(MouseEvent.MOUSE_UP, stopRedraw);
				parent.addEventListener(Event.REMOVED_FROM_STAGE, onRemove);
				parent.addEventListener(Layout.ON_REDRAW_LINKS, redrawLinks);
//				stage.addEventListener(Engine.LINE_TOOL, onLineToolChange);
			}
		}
		private function addNativeListeners()
		{
			visible = true;
			if(!hasEventListener(MouseEvent.MOUSE_OVER))
				addEventListener(MouseEvent.MOUSE_OVER, over);
			if(!hasEventListener(MouseEvent.MOUSE_OUT))
				addEventListener(MouseEvent.MOUSE_OUT, out);
			if(!hasEventListener(MouseEvent.CLICK))
				addEventListener(MouseEvent.CLICK, click);
		}
		public function removeNativeListeners()
		{
//			trace("Removing listeners");
			alpha = 0;
			visible = false;
			removeEventListener(MouseEvent.MOUSE_OVER, over);
			removeEventListener(MouseEvent.MOUSE_OUT, out);
			removeEventListener(MouseEvent.CLICK, click);
		}
		public function init(e:Event){
			trace(parent.parent);
//			removeEventListener(
		}
		public function calcCoord() {
			coord = new Point(x, y);
			coord = parent.localToGlobal(coord);
			coord = parent.parent.globalToLocal(coord);
			return coord;
		}
		public function onLineToolChange(e:Event)
		{
			trace("CHANGED!!!");
		}
		public function get layoutX():Number{
			return coord.x;
		}
		public function get layoutY():Number{
			return coord.y;
		}
		private function over(e:MouseEvent)
		{
			this.alpha = 100;
//			parent.stopDrag();
//			trace(wire);
		}
		private function out(e:MouseEvent)
		{
			this.alpha = 0;
		}
		public function click(e:MouseEvent)
		{
//			calcCoord();
//			trace(this.name, parent.name);
			if(wire==null)
			{
//				trace("wire is null!");
				wire = parent.parent["newLine"](e, this);
				if(wire!=null)
				{
					removeNativeListeners();
					wire.addEventListener(Wire.LINK_REMOVED, onRemoveWire);
				}
			}
			if(parent is Node)
				parent["toggleNodeVisible"]();
		}
		private function stopRedraw(e:Event)
		{
			removeEventListener(Event.ENTER_FRAME, redrawLinks);
//			removeEventListener(MouseEvent.MOUSE_MOVE, redrawLinks);
		}
		private function startRedraw(e:Event)
		{
			addEventListener(Event.ENTER_FRAME, redrawLinks);
//			addEventListener(MouseEvent.MOUSE_MOVE, redrawLinks);
		}
		private function redrawLinks(e:Event) // функция перерисовывает связи между точками
		{
			if(wire!=null)
				wire.redraw();
		}
		public function setWire(_wire:Wire):void
		{
			wire = _wire;
			if(parent is Node)
				parent["toggleNodeVisible"]();
		}
		public function hasWire():Boolean
		{
			if(wire==null)
				return false;
			else
				return true;
		}
		private function onRemove(e:Event)
		{
			if(wire!=null)
			{
				wire.remove();
				trace("Removing");
			}
		}
		public function onRemoveWire(e:Event)
		{
			addNativeListeners();
			trace("REMOVED!");
			wire = null;
			if(parent is Node)
				parent["toggleNodeVisible"]();
		}
	}
}