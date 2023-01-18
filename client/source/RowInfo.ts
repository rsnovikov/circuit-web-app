class RowInfo {
  static ROW_NORMAL: number = 0; // ordinary value
  static ROW_CONST: number = 1; // value is constant
  static ROW_EQUAL: number = 2; // value is equal to another value
  nodeEq: number;
  type: number;
  mapCol: number;
  mapRow: number;
  value: number;
  rsChanges: boolean; // row's right side changes
  lsChanges: Boolean; // row's left side changes
  dropRow: Boolean; // row is not needed in matrix
  constructor() {
    this.type = RowInfo.ROW_NORMAL;
  }
}
export default RowInfo;
