package main 
{
	import flash.display.*;
	import flash.geom.Rectangle;
	import flash.events.*;
	import flash.geom.Point;
	import flash.net.FileReference;
	import flash.ui.Mouse;

	import main.elements.*;
	import main.*
	import main.analysis.*
	//import main.lib.json.*;

	public class Engine extends MovieClip
	{
		public var layout:Layout;
		public var statWindow:Sprite;
		public var sim:CirSim;
		public static const NEED_ANALYZE = "needAnalyze";
		public static const ON_LOAD_DOCUMENT = "onLoadDocument";
		public static const LINE_TOOL = "lineTool";
		public static const STAT_WINDOW_X = "5";
		public static const STAT_WINDOW_Y = "330";
		
		private var analyzeIterations:int;
		public function Engine()
		{
			analyzeIterations = 0;
			stage.scaleMode = StageScaleMode.NO_SCALE; 
			stage.showDefaultContextMenu = false;
			stage.align = StageAlign.TOP_LEFT;
			
//			newLayout();
			layout = new Layout();
			
			statWindow = new Sprite();
			drawStat();
			addChild(statWindow);
			swapChildren(stat, statWindow);

			addChild(layout);
			menuPanel.setLayout(layout);
			layout.drawFrame();
//			layout.drawGrid();
			layout.addEventListener(Engine.NEED_ANALYZE, incrementIter);

			swapChildren(menuPanel, layout);

			stage.addEventListener(Event.RESIZE, function(){
				layout.drawFrame();
//				drawStat();
			});
			sim = new CirSim(layout);
		}
		public function newLayout(e:Event)
		{
			sim = new CirSim(layout);
			var i:Number = 0;
			while(layout.numChildren-1)
			{
				if(layout.getChildAt(i).name=="LayoutMask")
					i++;
				layout.removeChildAt(i);
			}
			layout.drawFrame();
		}
		public function drawStat()
		{
			stat.height = stage.height - stat.y;
			statWindow.graphics.clear();
			statWindow.graphics.lineStyle(1, 0x000000, 1, false, LineScaleMode.VERTICAL, CapsStyle.NONE, JointStyle.MITER, 10);
			statWindow.graphics.beginFill(0xFFFFFF);
			statWindow.graphics.drawRect(STAT_WINDOW_X, STAT_WINDOW_Y, 115, stage.height-STAT_WINDOW_Y-10);
			statWindow.graphics.endFill();
		}
		public function saveBitmap()
		{

		}
		public function printChildren()
		{
//			trace(layout.numChildren);
			var cnt:Number = layout.numChildren;
			var i:Number;
			for(i=0;i<cnt;i++)
				trace(layout.getChildAt(i), layout.getChildAt(i).name);
		}
		public function incrementIter(e:Event)
		{
			analyzeIterations++;
			if(analyzeIterations==1)
			{
				analyzeCircuit(e);
			}
		}
		public function analyzeCircuit(e:Event)
		{
			trace("Analyzing");
			while(analyzeIterations>0)
			{
				dispatchEvent(new Event(Layout.ON_REDRAW_LINKS, true));
				sim = new CirSim(layout);
				sim.getElmList();
				sim.analyzeCircuit();
				sim.runCircuit();
				analyzeIterations--;
			}
		}
		public function newModalWindow(e:Event, elm:Element)
		{
			var _modalBox:ModalBox = new ModalBox(elm);
			addChild(_modalBox);
		}
	}
}