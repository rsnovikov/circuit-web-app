package main
{
	import main.elements.*;
	import main.analysis.CirSim;
	import flash.display.*;
	import flash.geom.Rectangle;
	import flash.geom.Point;
	import flash.events.MouseEvent;
	import flash.events.Event;
	import flash.events.EventDispatcher;
    import flash.events.ContextMenuEvent;

	import flash.utils.*

    import flash.ui.ContextMenu;
    import flash.ui.ContextMenuItem;
    import flash.ui.ContextMenuBuiltInItems;

	public class Element extends MovieClip
	{
		private var startX, startY:Number;
		private var myContextMenu:ContextMenu;
		
		private var dragX:Number, dragY:Number, dropX:Number, dropY:Number;

		public var nodes:Array, volts:Array;
		public var current:Number;
		public var voltSource:int;
		
		public static var sim:CirSim;
		
//		public static const ELEMENT_MOVED = "elementMoved";
//		public static const EDIT_RESISTANCE = 0x000000

		public function Element()
		{
			dispatchEvent(new Event(Engine.NEED_ANALYZE));
			stop();
			startX = x;
			startY = y;
			allocNodes();
			addEventListener(Event.ADDED, added);
		}
		private function added(e:Event)
		{
			removeEventListener(Event.ADDED, added);
			if(parent is Layout)
			{
				addEventListener(MouseEvent.MOUSE_OVER, over);
				addEventListener(MouseEvent.MOUSE_OUT, out);
				initContextMenu();
			}
			addEventListener(MouseEvent.MOUSE_DOWN, drag);
			addEventListener(MouseEvent.MOUSE_UP, drop);

		}
		static function initClass(s:CirSim):void
		{
			sim = s;
		}
		public function getClassName():String
		{
			var className:Array = getQualifiedClassName(this).split(new RegExp(/::/));;
			return className[1];
		}
		public function getObject():Object
		{
			var obj:Object = new Object();
			obj.name = getClassName();
			obj.index = parent.getChildIndex(this);
			obj.x = x;
			obj.y = y;
			obj.rotation = rotation;
			return obj;
		}
		public function setParams(obj:Object):void
		{
			if(obj!=null)
			{
				if(obj.x!=null)
					x = obj.x;
				if(obj.y!=null)
					y = obj.y;
				if(obj.rotation!=null)
					rotation = obj.rotation;
			}
		}
		public function setField(name:String, value, caption:String = "", restrict:String = null):Object
		{
			var obj:Object = new Object;
			obj.name = name;
			obj.value = value;
			obj.caption = caption;
			obj.restrict = restrict;
			return obj;
		}
		public function getFields():Array
		{
			return null;
		}
		private function allocNodes():void {
    		nodes = new Array(getPostCount()+getInternalNodeCount());
    		volts = new Array(getPostCount()+getInternalNodeCount());
		}
		public function setNodeVoltage(n:int, c:Number):void { 
			volts[n] = Math.round(c*5)/5;
	        calculateCurrent();
		}
		public function calculateCurrent():void {}
		public function doStep():void {}
		public function getConnection(n1:int, n2:int):Boolean { return true; }
		public function hasGroundConnection(n1:int):Boolean { return false; }
		public function isWire():Boolean { return false; }
	    public function getInternalNodeCount():int { return 0; }
	    public function getVoltageSourceCount():int { return 0; }
		public function getPostCount():int { return 2; }
		public function getNode(n:int):int { return nodes[n]; }
		public function getPost(n:int):Point
		{
			return (n == 0 || n < getPostCount()) ? this["post"+n].calcCoord() : null;
		}
		public function nonLinear() { return false; }
		public function setCurrent(x:int, c:Number):void { current = c; }
		public function setVoltageSource(n:int, v:int) { voltSource = v; }
		public function setNode(p:int, n:int):void { nodes[p] = n; }
		public function stamp():void {}
		public function startIteration():void {}
		private function drag(event:MouseEvent){
			dragX = x;
			dragY = y;
		 	var bounds:Rectangle = new Rectangle(width/2, height/2, Math.floor(parent.width/parent.scaleX-width), Math.floor(parent.height/parent.scaleY-height));
			startDrag(false, bounds);
//			dispatchEvent(new Event(ELEMENT_MOVED));
		}
		public function snapToGrid(coord:Point):Point
		{
			var moduleX:Number = coord.x % Layout.GRID;
			var moduleY:Number = coord.y % Layout.GRID;
			coord.x = (moduleX<Layout.GRID/2) ? coord.x - moduleX : coord.x + Layout.GRID - moduleX;
			coord.y = (moduleY<Layout.GRID/2) ? coord.y - moduleY : coord.y + Layout.GRID - moduleY;
			return coord;
		}
		private function drop(event:MouseEvent){
			stopDrag();
			dropX = x;
			dropY = y;

			if(!(parent is Layout))
			{
				if(dropTarget!=null && dropTarget is Layout)
				{
					var point1:Point = new Point(x, y);
					var newObj = new (this as Object).constructor();

					var point2:Point = dropTarget.globalToLocal(point1);
					point2 = snapToGrid(point2);

					newObj.x = point2.x;
					newObj.y = point2.y;
					//newObj.initContextMenu();
					parent["layout"].addChild(newObj);
					parent["layout"].dispatchEvent(new Event(Engine.NEED_ANALYZE));
				}
				x = startX;
				y = startY;
			}
			else
			{
				var newCoord:Point = snapToGrid(new Point(x, y) );
				x = newCoord.x;
				y = newCoord.y;
			}
			dispatchEvent(new Event(Layout.ON_REDRAW_LINKS, true));
		}
		public function initContextMenu():void {
			myContextMenu = new ContextMenu();
            removeDefaultItems();

			addContextItem("Повернуть элемент", rotate);
			addContextItem("Удалить элемент", remove);
			if(getFields()!=null)
				addContextItem("Свойства элемента", editProperties);
            this.contextMenu = myContextMenu;
		}
		public function removeAllAttribs():void
		{
//			trace("Removing listeners!");
			removeEventListener(MouseEvent.MOUSE_DOWN, drag);
			removeEventListener(MouseEvent.MOUSE_UP, drop);
			this.contextMenu = null;
		}
        private function removeDefaultItems():void {
            myContextMenu.hideBuiltInItems();
            var defaultItems:ContextMenuBuiltInItems = myContextMenu.builtInItems;
        }
		private function addContextItem(itemLabel:String, func:Function):void {
            var item:ContextMenuItem = new ContextMenuItem(itemLabel);
            myContextMenu.customItems.push(item);
            item.addEventListener(ContextMenuEvent.MENU_ITEM_SELECT, func);			
		}
		private function rotate(event:ContextMenuEvent):void
		{
			trace(this.rotation);
			this.rotation += 90;
			dispatchEvent(new Event(Layout.ON_REDRAW_LINKS, true));
		}
		private function remove(event:ContextMenuEvent):void
		{
			removeEventListener(MouseEvent.MOUSE_OUT, out);
			var obj = parent;
			parent.removeChild(this);
			obj.dispatchEvent(new Event(Engine.NEED_ANALYZE));
		}
		private function editProperties(e:ContextMenuEvent):void
		{
			parent.parent["newModalWindow"](e, this);
		}
		private function test(e:ContextMenuEvent):void
		{
			trace(parent.parent["sim"]);
		}
		public function getBaseInfo():String
		{
			var _current:Number = Math.round(current*1000)/1000;
			var _voltage:Number = Math.round((volts[0]-volts[1])*1000)/1000;
			var str:String = "I = "+_current+"\n";
				str		  += "V = "+_voltage+"\n";
/*			var	str:String = "x = "+x+"\n";
				str		  += "y = "+y;*/
			return str;
		}
		public function over(e:MouseEvent):void
		{
//			calculateCurrent();
//			trace(current);
			
		}
		public function out(e:MouseEvent):void
		{
			setStatText("");
//			Engine(parent.parent).stat.text = "";
//			calculateCurrent();
//			trace(current);
		}
		public function setStatText(str:String)
		{
			Engine(parent.parent).stat.text = str;
		}
	}
}