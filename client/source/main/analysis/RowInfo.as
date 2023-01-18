package main.analysis
{
	// info about each row/column of the matrix for simplification purposes
    class RowInfo
	{
		static const ROW_NORMAL:int = 0;  // ordinary value
		static const ROW_CONST:int  = 1;  // value is constant
		static const ROW_EQUAL:int  = 2;  // value is equal to another value
		public var nodeEq:int, type:int, mapCol:int, mapRow:int;
		public var value:Number;
		public var rsChanges:Boolean; // row's right side changes
		public var lsChanges:Boolean; // row's left side changes
		public var dropRow:Boolean;   // row is not needed in matrix
		public function RowInfo() { type = ROW_NORMAL; }
    }
}
