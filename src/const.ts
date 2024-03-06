export default class Const {
  // defaut use elementui table component classnames
  static cardTableTBHeaderWraper = 'el-table__header-wrapper' // table header wraper classname
  static cardElRowClass = 'el-table__row' // table body row  classname
  static cardTableTr = 'tr' // 这里用的tr标签
  static elTableBodyWraper = 'el-table__body-wrapper' // table body wraper classname

  static cardTableTr4n = 'table_tr_4n'


  static pageForceBreakFlag = "page-force-break-flag" // 强制换页
  static spliteFlagWraper = 'page-splite-flag-wraper'
  static spliteFlag = 'page-splite-flag' // 固定模块flag class标识
  static tableRowSpanMerge = 'table-rowspan-merge' // rowspan merge flag
  static tableRowExpand = 'table-row-expand' // table row expand

  static tableClass = 'card-table' // table class 标识
  static cardTableTopWraper = 'card-table-top-wraper'
  static cardTableWraper = 'card-table-wraper'
  static cardTableBomWraper = 'card-table-bom-wraper'

  static printImg = 'print-img'
  static printImgHeight = 'print-img-height'

  //  元素的class='none-page-margin-top' 优先级 大于pageInfo传入的pagePargin的优先级，
  static NonePageMarinTop ='none-page-margin-top'  // 在元素classList加了这个标识，即使在全局pagePargin配置了需要top，有这个class的元素所在的page依然没有top;
  static NonePageMarinBottom ='none-page-margin-bottom'// 在元素classList加了这个标识，即使在全局pagePargin配置了需要bottom，有这个class的元素所在的page依然没有bottom;

  // 配置了pagePargin:{top: Npx, bottom: Npx},会自动在分页后的page合适的位置创建div,并自动加上这两个class;
  static pageMarginTopFlag = 'page-margin-top-flag' // margintop classname
  static pageMarginBottomFlag = 'page-margin-bottom-flag' // marginBottom classname


  static elTbody = 'tbody'
  static minRowsCount = 3
  static rowHeight = 40
  static headerHeight = 40
  static wrapePadTop = 20
  // 展示页面标记
  static printNormalTag = 'print-normal-tag'
  static printHeaderTag = 'print-header-tag'
  static printFooterTag = 'print-footer-tag'
  static printHeaderFooterTag = 'print-header-footer-tag'

  static pHeaderH = 50 // header高度
  static pFooterH = 44 // 尾部高度
  // 下载页面标记
  //  一个下载页面有 header + main + footer 组成
  static printPageWraper = 'print-page-wraper' // 普通页面标记类
  static printImgWraper = 'print-img-wraper' // 图片页面标记类
  static printLastWraper = 'print-last-wraper' // 最后一个页面标记class
  static printHeaderName = 'print-header-name' // header class
  static printMainName = 'print-main-name' //  主要内容 class
  static printFooterName = 'print-footer-name' //  footer class

  static setTableClass(classnames: Object) {
    for (const classname in classnames) {
      this[classname] = classnames[classname]
    }
  }
}
