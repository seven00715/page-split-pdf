"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Const {
    static setTableClass(classnames) {
        for (const classname in classnames) {
            this[classname] = classnames[classname];
        }
    }
}
// defaut use elementui table component classnames
Const.cardTableTBHeaderWraper = 'el-table__header-wrapper'; // table header wraper classname
Const.cardElRowClass = 'el-table__row'; // table body row  classname
Const.cardTableTr = 'tr'; // 这里用的tr标签
Const.elTableBodyWraper = 'el-table__body-wrapper'; // table body wraper classname
Const.cardTableTr4n = 'table_tr_4n';
Const.pageForceBreakFlag = "page-force-break-flag"; // 强制换页
Const.spliteFlagWraper = 'page-splite-flag-wraper';
Const.spliteFlag = 'page-splite-flag'; // 固定模块flag class标识
Const.tableRowSpanMerge = 'table-rowspan-merge'; // rowspan merge flag
Const.tableRowExpand = 'table-row-expand'; // table row expand
Const.tableClass = 'card-table'; // table class 标识
Const.cardTableTopWraper = 'card-table-top-wraper';
Const.cardTableWraper = 'card-table-wraper';
Const.cardTableBomWraper = 'card-table-bom-wraper';
Const.printImg = 'print-img';
Const.printImgHeight = 'print-img-height';
//  元素的class='none-page-margin-top' 优先级 大于pageInfo传入的pagePargin的优先级，
Const.NonePageMarinTop = 'none-page-margin-top'; // 在元素classList加了这个标识，即使在全局pagePargin配置了需要top，有这个class的元素所在的page依然没有top;
Const.NonePageMarinBottom = 'none-page-margin-bottom'; // 在元素classList加了这个标识，即使在全局pagePargin配置了需要bottom，有这个class的元素所在的page依然没有bottom;
Const.NonePageNumber = 'none-page-number'; // 在元素classList加了这个标识，此页面不计入页码，也不展示页码，例如封面
// 配置了pagePargin:{top: Npx, bottom: Npx},会自动在分页后的page合适的位置创建div,并自动加上这两个class;
Const.pageMarginTopFlag = 'page-margin-top-flag'; // margintop classname
Const.pageMarginBottomFlag = 'page-margin-bottom-flag'; // marginBottom classname
Const.pageNumberWrapperFlag = 'page-number-wrapper-flag'; // 页码盒子 classname
Const.pageSummaryWrapperFlag = 'page-summary-wrapper-flag'; // 摘要盒子 classname
Const.elTbody = 'tbody';
Const.minRowsCount = 3;
Const.rowHeight = 40;
Const.headerHeight = 40;
Const.wrapePadTop = 20;
// 展示页面标记
Const.printNormalTag = 'print-normal-tag';
Const.printHeaderTag = 'print-header-tag';
Const.printFooterTag = 'print-footer-tag';
Const.printHeaderFooterTag = 'print-header-footer-tag';
Const.pHeaderH = 50; // header高度
Const.pFooterH = 44; // 尾部高度
// 下载页面标记
//  一个下载页面有 header + main + footer 组成
Const.printPageWraper = 'print-page-wraper'; // 普通页面标记类
Const.printImgWraper = 'print-img-wraper'; // 图片页面标记类
Const.printLastWraper = 'print-last-wraper'; // 最后一个页面标记class
Const.printHeaderName = 'print-header-name'; // header class
Const.printMainName = 'print-main-name'; //  主要内容 class
Const.printFooterName = 'print-footer-name'; //  footer class
exports.default = Const;
