package main 
{
	import flash.display.*;
	import flash.geom.Rectangle;
	import flash.events.*;
	import flash.net.FileReference;
	import flash.net.FileFilter; 
	import flash.ui.Mouse;
	import flash.utils.*
	import main.lib.*;
	//import main.lib.json.*;
	import main.Layout;
	
	import flash.geom.Matrix;

	public class MenuPanel extends Sprite
	{
		private var layout:Layout;
		private var file:FileReference;
		public static const CLASS_ELEMENT_PREFIX = "main.elements.";
		public function MenuPanel()
		{
//			trace("testing panel");
			newButton.addEventListener(MouseEvent.CLICK, newDocument);
			openButton.addEventListener(MouseEvent.CLICK, openDocument);
			saveButton.addEventListener(MouseEvent.CLICK, saveDocument);
			saveImageButton.addEventListener(MouseEvent.CLICK, saveImage);
			listButton.addEventListener(MouseEvent.CLICK, printList);
			listButton.visible = false;
			analyzeButton.addEventListener(MouseEvent.CLICK, analyze);
			
			filename.text = "Untitled"+Math.round(Math.random()*1000)+".cm";

		}
		public function setLayout(_layout:Layout)
		{
			layout = _layout;
		}
		private function newDocument(e:Event)
		{
			Engine(parent).newLayout(e);
			filename.text = "Untitled"+Math.round(Math.random()*1000)+".cm";
		}
		private function openDocument(e:Event)
		{
			file = new FileReference();
			var textTypeFilter:FileFilter = new FileFilter("CircuitMaster Files (*.cm)", "*.cm"); 
			file.addEventListener(Event.SELECT, onFileSelected); 
			file.browse([textTypeFilter]); 
		}
        public function onFileSelected(evt:Event):void 
        { 
            file.addEventListener(Event.COMPLETE, onCompleteOpen); 
            file.load();
        }
        public function onCompleteOpen(e:Event):void 
        { 
			try
			{
				var loadObject:Object = JSON.parse(file.data.toString());
				var layoutObject:Object = layoutObject = loadObject.KeynoCircuit.Layout;
			} catch(e)
			{ 
				trace("Bad file or unknown file format: "+file.name);
				return;
			}
			Engine(parent).newLayout(e);
			if(layoutObject.elements != null)
			{
				var elements:Array = layoutObject.elements;
				var cnt:int = elements.length;
				var ClassReference:Class;
				var instance:DisplayObject;
				for(var i:int=0;i<cnt;i++)
				{
					try
					{
						ClassReference = getDefinitionByName(CLASS_ELEMENT_PREFIX+elements[i].name) as Class;
						instance = new ClassReference();
						instance["setParams"](elements[i]);
						layout.addChildAt(instance, elements[i].index);
				
					}catch(e) { trace("Bad element detected!"); }
				}
			}
			filename.text = file.name;
			layout.dispatchEvent(new Event(Engine.ON_LOAD_DOCUMENT));
			layout.dispatchEvent(new Event(Engine.NEED_ANALYZE));
			
        } 
		private function saveDocument(e:Event)
		{
			file = new FileReference();
			var cnt:Number = layout.numChildren;
			var i:Number;

			var saveObject:Object = new Object;
			var saveLayout:Object = new Object();
			saveLayout.width = stage.width;
			saveLayout.height = stage.height;
			saveLayout.scaleX = layout.scaleX;
			saveLayout.scaleY = layout.scaleY;
			
			var elements:Array = new Array();
			var elm:Object;
			var className:Array;
			var obj:Object;
			for(i=0;i<cnt;i++)
			{
				elm = new Object();
				obj = layout.getChildAt(i);
				if(obj is Element)
				{
					elm = obj.getObject();
					elements.push(elm);
//					trace("YES!", layout.getChildAt(i));*/
				}
/*				else
					trace("NO!", layout.getChildAt(i));*/
			}
			saveLayout.elements = elements;
			saveObject.KeynoCircuit = new Object();
			saveObject.KeynoCircuit.Layout = saveLayout;
			
			file.addEventListener(Event.COMPLETE, onCompleteSave);

			var jsonStr:String = JSON.stringify(saveObject);
			var filename:String = filename.text;
			file.save(jsonStr, filename);
		}
		public function onCompleteSave(e:Event):void 
		{
			filename.text = file.name;
		}
		private function printList(e:Event)
		{
			Engine(parent).printChildren();
		}
		private function analyze(e:Event)
		{
			Engine(parent).analyzeCircuit(e);
		}
		private function saveImage(e:Event)
		{
				file = new FileReference();
				var myBitmapData:BitmapData = new BitmapData(Math.floor(layout.width), Math.floor(layout.height));

				var scaleMatrix = new Matrix();
				scaleMatrix.scale(layout.scaleX, layout.scaleY);
				myBitmapData.draw(layout, scaleMatrix);

				var bounds:Rectangle = new Rectangle(0, 0, myBitmapData.width, myBitmapData.height);
				var img = myBitmapData.getPixels(bounds);

				var png = PNGEncoder.encode(myBitmapData);
				var filename = filename.text;
				file.save(png, filename.substr(0, filename.length-2)+"png");
		}
	}
}