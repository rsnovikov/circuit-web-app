package main 
{
	import flash.display.*;
	import flash.utils.*;
	import flash.events.MouseEvent;
	import flash.geom.Point;
	import main.elements.*;
	import main.analysis.*;
	import main.Element;
//	import main.Line;
//	import main.lib.json.*;

	public class Layout extends Sprite // Класс "Рабочая область"
	{
		public static const GRID:Number = 16;
		public static const ON_REDRAW_LINKS = "onRedrawLinks";
		public var drawing:Boolean = false;
		private const layoutX = 130; // Координаты начала отрисовки рабочей области.
		private const layoutY = 60;
		private const maxScale = 7; // Максимальный коэффициент масштабирования схемы

		public var limitX = 0; // Сюда запишется размер окна
		public var limitY = 0;
		
		public var _wire:Wire;
		private var _mask:Sprite, _grid:Sprite;
		
		private var absoluteX:Number;
		private var absoluteY:Number;

		public function Layout()
		{
			x = layoutX;
			y = layoutY;
			
//			mouseChildren = false;
			doubleClickEnabled = true;
			addEventListener(MouseEvent.MOUSE_WHEEL, resize);
		}
		public function newLine(e:MouseEvent, _connector:Connector):Wire
		{
			var startPoint:Point = _connector.calcCoord();
//			trace(startPoint);
			if(!drawing)
			{
//				addEventListener(MouseEvent.DOUBLE_CLICK, removeLine);
				addEventListener(MouseEvent.DOUBLE_CLICK, breakLine);
				_wire = new Wire(startPoint.x, startPoint.y);
				_wire.click();
				addChild(_wire);
				addEventListener(MouseEvent.MOUSE_MOVE, _wire.draw);
				drawing = true;
			}
			else
			{
//				removeEventListener(MouseEvent.DOUBLE_CLICK, removeLine);
				removeEventListener(MouseEvent.DOUBLE_CLICK, breakLine);
				removeEventListener(MouseEvent.MOUSE_MOVE, _wire.draw);
				_wire.endDraw(startPoint.x, startPoint.y);
				drawing = false;
			}
			if(_wire.connect(_connector)==null)
			{
				_wire.remove();
				return null;
			}
			else
				return _wire;
		}
		public function breakLine(e:MouseEvent)
		{
/*			var _connector:Connector = new Connector();
			_connector.x = mouseX;
			_connector.y = mouseY;
			addChild(_connector);
			_connector.click(e);*/
//			_wire.endDraw(mouseX, mouseY);
			var _node:Node = new Node();
			var coord:Point = _node.snapToGrid(new Point(mouseX, mouseY));
			_node.x = coord.x;
			_node.y = coord.y;
			addChild(_node);
//			_wire.connect(_node.getConnector());
			_node.getConnector().click(e);
			_node.addPost();
		}
		public function removeLine(e:MouseEvent)
		{
//			if(drawing)
//			{
				drawing = false;
				_wire.remove();
//			}
		}
		public function redrawMask()
		{
			if(_mask!=null)
				removeChild(_mask);

			_mask = new Sprite();
			_mask.graphics.beginFill(0x000000);
			_mask.graphics.drawRect(0, 0, absoluteX+1, absoluteY+1);
			_mask.name = "LayoutMask";
			addChild(_mask);

			mask = _mask;
		}
		public function drawGrid()
		{
			if(_grid!=null)
				removeChild(_grid);

			_grid = new Sprite();
			_grid.graphics.lineStyle(1, 0xEFEFEF, 1, false, LineScaleMode.VERTICAL, CapsStyle.ROUND, JointStyle.MITER, 10);

			var endWidth:int = Math.round(stage.stageWidth/GRID);
			for(var i:int=0; i<=endWidth; i++)
			{
				_grid.graphics.moveTo(i*GRID, 0);
				_grid.graphics.lineTo(i*GRID, 400);
			}
			for(var i:int=0; i<=endWidth; i++)
			{
				_grid.graphics.moveTo(0, i*GRID);
				_grid.graphics.lineTo(stage.stageHeight, i*GRID);
			}
			addChild(_grid);
		}
		public function drawFrame()
		{
			limitX = stage.stageWidth;
			limitY = stage.stageHeight;
			absoluteX = (limitX-layoutX-20)/scaleX;
			absoluteY = (limitY-layoutY-20)/scaleY;

			graphics.clear();
//			graphics.beginFill(0xFAFAFA);
			graphics.beginFill(0xFFFFFF);
			graphics.lineStyle(1/scaleX, 0x000000, 1, false, LineScaleMode.VERTICAL, CapsStyle.NONE, JointStyle.MITER, 10);
			graphics.drawRect(0, 0, absoluteX, absoluteY);
			graphics.endFill();

			redrawMask();
		}
		public function dropElement()
		{
			
		}
		public function resize(e:MouseEvent)
		{
			if(e.delta>0 && scaleX<maxScale)
			{
				this.scaleX += 0.5;
				this.scaleY += 0.5;
			}
			else if(e.delta<0 && scaleX>1)
			{
				this.scaleX -= 0.5;
				this.scaleY -= 0.5;
			}
			drawFrame();
		}
	}
}