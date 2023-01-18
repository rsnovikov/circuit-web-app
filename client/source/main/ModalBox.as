package main 
{
	import flash.display.*;
	import flash.events.*;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	import flash.text.TextFieldType;
	import fl.controls.Button;
	
	
/*    import flash.text.engine.TextBlock;
    import flash.text.engine.TextElement;
    import flash.text.engine.TextLine;
    import flash.text.engine.ElementFormat;*/

	import flash.geom.Point;
	public class ModalBox extends Sprite // Класс "Модальное окно"
	{
		private var background:Sprite, dialogWindow:Sprite;
		private var dialogWidth:Number, dialogHeight:Number;
		private var startDialogWidth:Number, startDialogHeight:Number;
		private var elm:Element;
		private var fieldsNumber:int = 0;
		public function ModalBox(_elm:Element)
		{
			elm = _elm;
			addEventListener(Event.ADDED, onAdded);
		}
		public function onAdded(e:Event)
		{
			removeEventListener(Event.ADDED, onAdded);
			background = new Sprite();
			addChild(background);
			drawDialog();
			drawBackground(e);
			parent.stage.addEventListener(Event.RESIZE, drawBackground);
		}
		public function drawBackground(e:Event)
		{
			background.graphics.clear();
			background.graphics.beginFill(0xD6D6D6);
			background.alpha = 0.4;
			background.graphics.drawRect(0, 0, parent.stage.stageWidth, parent.stage.stageHeight);
			background.graphics.endFill();
/*			dialogWindow.x = (parent.stage.stageWidth/3 - dialogWidth);
			dialogWindow.y = (parent.stage.stageHeight/3 - dialogHeight);*/
		}
		public function drawInput(obj:Object):void
		{
			fieldsNumber++;
			var tf:TextField = new TextField();
			tf.text = obj.value;
			tf.border = true;
			tf.x = startDialogWidth+100;
			tf.y = startDialogHeight+30*fieldsNumber;
			tf.type = TextFieldType.INPUT;
			tf.height = 20;
			tf.name = obj.name;
			tf.restrict = obj.restrict;
			dialogWindow.addChild(tf);

			var txt:TextField = new TextField();
			txt.x = startDialogWidth;
			txt.y = startDialogHeight+30*fieldsNumber;
			txt.text = obj.caption;
			txt.selectable = false;
			txt.autoSize = TextFieldAutoSize.RIGHT;
			dialogWindow.addChild(txt);
		}
		public function drawParams()
		{
			var fields:Array = elm.getFields();
			var i:int;
			for(i=0;i<fields.length;i++)
			{
				drawInput(fields[i]);
			}
		}
		private function drawButtons()
		{
			var okBtn:Button = new Button();
			okBtn.move(startDialogWidth+40, startDialogHeight+30*(fieldsNumber+1));
			okBtn.label = "OK";
			okBtn.width = 80;
			dialogWindow.addChild(okBtn);

			var cancelBtn:Button = new Button();
			cancelBtn.move(okBtn.x+okBtn.width+10, startDialogHeight+30*(fieldsNumber+1));
			cancelBtn.label = "Cancel";
			cancelBtn.width = 80;
			dialogWindow.addChild(cancelBtn);

			cancelBtn.addEventListener(MouseEvent.CLICK, cancelPressed);
			okBtn.addEventListener(MouseEvent.CLICK, okPressed);
		}
		private function okPressed(e:MouseEvent)
		{
			var fields:Array = elm.getFields();
			var i:int;
			var obj:Object = new Object();
			for(i=0;i<fields.length;i++)
			{
				var txtField = dialogWindow.getChildByName(fields[i].name);
				obj[txtField.name] = txtField.text;
			}
			elm.setParams(obj);
			parent["layout"].dispatchEvent(new Event(Engine.NEED_ANALYZE));
			parent.stage.removeEventListener(Event.RESIZE, drawBackground);
			parent.removeChild(this);
		}
		private function cancelPressed(e:MouseEvent)
		{
			parent.stage.removeEventListener(Event.RESIZE, drawBackground);
			parent.removeChild(this);
		}
		private function list()
		{
//			trace(layout.numChildren);
			var cnt:Number = dialogWindow.numChildren;
			var i:Number;
			for(i=0;i<cnt;i++)
				trace(dialogWindow.getChildAt(i), dialogWindow.getChildAt(i).name);
			trace(dialogWindow.getChildByName("tf3"));
		}
		public function drawDialog():void
		{
			dialogWidth = 100;
			dialogHeight = 50;
			startDialogWidth = (parent.stage.stageWidth - dialogWidth)/3;
			startDialogHeight = (parent.stage.stageHeight - dialogHeight)/3;
			dialogWindow = new Sprite();
			dialogWindow.graphics.clear();
			dialogWindow.graphics.beginFill(0xFFFFFF);
			dialogWindow.graphics.lineStyle(1, 0x000000, 1, false, LineScaleMode.VERTICAL, CapsStyle.NONE, JointStyle.MITER, 10);
			dialogWindow.graphics.drawRect(startDialogWidth, startDialogHeight, startDialogWidth+dialogWidth, startDialogHeight+dialogHeight);
			dialogWindow.graphics.endFill();
			addChild(dialogWindow);

//			drawInput();
//			drawInput();
//			drawInput();
			drawParams();
			drawButtons();
//			list();
		}
	}
}