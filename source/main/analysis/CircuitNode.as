package main.analysis
{
	class CircuitNode 
	{
	    public var x:Number, y:Number;
	    public var links:Vector.<CircuitNodeLink>;
	    public var internal:Boolean;
    	public function CircuitNode() { links = new Vector.<CircuitNodeLink>(); }
	}
}
