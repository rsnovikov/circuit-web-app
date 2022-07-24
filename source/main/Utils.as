package main {
  import flash.utils.ByteArray;
  public class Utils {
    /**
     * Clones the specified object
     * 
     */
    public static function clone(source:Object):* {
        var copier:ByteArray = new ByteArray();
        copier.writeObject(source);
        copier.position = 0;
        return copier.readObject();
    }
  }
}