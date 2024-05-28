/*!
    LibraryName: pdf-page-split
    author: droden
    Date: 2023-0807-19:40
  */
var pdfPrint = (function (exports) {
    'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

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

    function calcHeight(ele) {
        return (ele.offsetHeight +
            getStyle(ele, "marginTop") +
            getStyle(ele, "marginBottom"));
    }
    let getStyle = function (ele, attr) {
        if (typeof getComputedStyle !== "undefined") {
            getStyle = function (ele, attr) {
                return parseInt(document.defaultView.getComputedStyle(ele, null)[attr]);
            };
        }
        else {
            getStyle = function (ele, attr) {
                return parseInt(ele.currentStyle[attr]);
            };
        }
        return getStyle(ele, attr);
    };
    function findTplTag(tpl) {
        return Array.prototype.find.call(tpl.classList, (item) => item.startsWith(PrintTemplatesTag.printPdfTpl));
    }

    /**
     * 主要思想：发布订阅
     *  将动态创建的wraper 订阅到deps里面, 下载的时候统一发布deps里面的wraper；
     */
    class PdfPage {
        constructor() {
            this.deps = document.createElement("div");
            this.wraper = null;
            this.tbWraper = null;
            this.mainHeigth = 0;
            this.base = {};
            this.pageInfo = {};
            this.pageHeight = 0;
            this.headerTplMap = DfsChild.headerTplMap;
            this.footerTplMap = DfsChild.footerTplMap;
            this.deps = document.createElement("div");
        }
        createWraper(ele) {
            var _a;
            this.ele = ele;
            this.initPage();
            this.curPage = this.wraper;
            (_a = this.deps) === null || _a === void 0 ? void 0 : _a.appendChild(this.curPage);
            return this.mainHeigth;
        }
        /**
         * 初始化 imgPageWraper 和普通页面的wraper
         */
        initPage() {
            var _a;
            if (this.ele) {
                const pageType = this.getPageType(this.ele);
                if ((_a = this.ele) === null || _a === void 0 ? void 0 : _a.classList.contains(Const.printImg)) {
                    this.ele.classList.add(Const.printImgHeight);
                    this.wraper = this.createPageWraper(Const.printImgWraper, pageType);
                }
                else {
                    this.wraper = this.createPageWraper(Const.printPageWraper, pageType);
                }
                let header;
                let main;
                let footer;
                if (pageType === PrintType.NORMAL_TYPE) {
                    this.mainHeigth = this.pageHeight;
                    main = this.createModule(Const.printMainName, this.pageHeight);
                }
                if (pageType === PrintType.HEADER_TYPE) {
                    const { tpl, heigth: pHeaderH } = this.cloneTpl(this.ele, this.headerTplMap, Const.printHeaderName);
                    header = tpl;
                    this.mainHeigth = this.pageHeight - pHeaderH;
                    main = this.createModule(Const.printMainName, this.mainHeigth);
                }
                if (pageType === PrintType.FOOTER_TYPE) {
                    const { tpl, heigth: pFooterH } = this.cloneTpl(this.ele, this.footerTplMap, Const.printFooterName);
                    footer = tpl;
                    this.mainHeigth = this.pageHeight - pFooterH;
                    main = this.createModule(Const.printMainName, this.mainHeigth);
                }
                if (pageType === PrintType.HEADER_FOOTER_TYPE) {
                    const { tpl: HTpl, heigth: pHeaderH } = this.cloneTpl(this.ele, this.headerTplMap, Const.printHeaderName);
                    header = HTpl;
                    const { tpl: FTpl, heigth: pFooterH } = this.cloneTpl(this.ele, this.footerTplMap, Const.printFooterName);
                    footer = FTpl;
                    this.mainHeigth = this.pageHeight - pHeaderH - pFooterH;
                    main = this.createModule(Const.printMainName, this.mainHeigth);
                }
                header && this.wraper.appendChild(header);
                main && this.wraper.appendChild(main);
                footer && this.wraper.appendChild(footer);
            }
        }
        getPageType(ele) {
            //@ts-ignore
            const TYPES = Object.values(PrintType);
            const type = Array.from(ele.classList).find((item) => TYPES.includes(item));
            return type || this.pageInfo.defaultType || PrintType.NORMAL_TYPE;
        }
        cloneTpl(ele, map, className) {
            const flag = findTplTag(ele);
            let cloneTpl;
            let cloneheight = 0;
            let tplMap;
            if (this.pageInfo.needTpl) {
                if (map.size === 0) {
                    console.error(`needTpl：true，需要传入对应的template!`);
                }
                if (map.size > 0) {
                    if (flag && map.has(flag)) {
                        tplMap = map.get(flag);
                    }
                    else {
                        tplMap =
                            className === Const.printHeaderName
                                ? map.get(PrintTemplatesTag.printPdfTplHeaderDefault)
                                : map.get(PrintTemplatesTag.printPdfTplFooterDefault);
                    }
                    cloneTpl = tplMap.tpl.cloneNode(true);
                    cloneTpl.classList.add(className);
                    cloneheight = tplMap.height;
                    cloneTpl.style.height = cloneheight + "px";
                }
            }
            return {
                tpl: cloneTpl,
                heigth: cloneheight,
            };
        }
        /**
         * 动态创建 pdf A4 page wraper
         * @param name "print-img-wraper" 图片页面标记类;  "print-page-wraper"普通页面标记类
         * @param pageType PrintType
         * @returns
         */
        createPageWraper(name, pageType) {
            const wraper = document.createElement("div");
            wraper.classList.add(pageType);
            wraper.classList.add(name);
            return wraper;
        }
        /**
         * 创建 pdf A4纸张中的 一个个模块 header footer main
         * @param name header/footer/main 的class 类名
         * @param height header/footer/main 高度
         * @returns 创建好的模块
         */
        createModule(name, height) {
            const module = document.createElement("div");
            module.style.height = height + "px";
            module.classList.add(name);
            return module;
        }
        /**
         * 往page里面添加模块 模块类型有： 1.单独的img 2. 独立的module 3. tableModule 4.table tbody 5. table row
         * @param ele 要添加的元素 ModuleType
         * @param height 元素的高度
         * @param type  ModuleType
         * @returns 返回当前页面剩余的高度
         */
        appendModule(ele, height, type) {
            var _a, _b, _c;
            if (ele) {
                if (type === ModuleType.ROW) {
                    const main = (_a = this.wraper) === null || _a === void 0 ? void 0 : _a.querySelector(`.${Const.printMainName}`);
                    let wr = main.querySelectorAll(`.${Const.cardTableWraper}`);
                    wr = wr[Array.from(wr).length - 1];
                    const by = wr.querySelector(`${Const.elTbody}`);
                    by.appendChild(ele);
                }
                else {
                    (_c = (_b = this.wraper) === null || _b === void 0 ? void 0 : _b.querySelector(`.${Const.printMainName}`)) === null || _c === void 0 ? void 0 : _c.appendChild(ele);
                }
                this.mainHeigth = this.mainHeigth - height;
            }
            return this.mainHeigth;
        }
    }

    class DfsChild extends PdfPage {
        constructor() {
            super();
            this.childMap = new Map();
            this.flagNum = 0; // 只是为了方便 排查分页后的打印数据 中的模块 和页面元素的 之间的对应关系
            this.time = 1;
        }
        walk(ele) {
            this.time++;
            if (ele.hasChildNodes()) {
                const nodeQueue = Array.from(ele.children);
                while (nodeQueue.length > 0) {
                    const node = nodeQueue.shift();
                    if (node === null || node === void 0 ? void 0 : node.classList.contains(Const.spliteFlag)) {
                        this.setPagesMap(node);
                        continue;
                    }
                    else {
                        this.walk(node);
                    }
                }
            }
            else {
                this.setPagesMap(ele);
            }
        }
        setPagesMap(ele) {
            if (ele.classList.contains(Const.spliteFlag) && !this.childMap.has(ele)) {
                ele.classList.add(`flagNum-${this.flagNum++}`);
                this.childMap.set(ele, this.getModuleInfo(ele));
            }
        }
        getModuleInfo(ele) {
            const isTable = ele.classList.contains(Const.tableClass);
            const moduleInfo = {
                height: calcHeight(ele),
                isTable,
                tableModuleInfo: {}
            };
            if (isTable) {
                moduleInfo.tableModuleInfo = this.getTableModuleInfo(ele, moduleInfo.height);
            }
            return moduleInfo;
        }
        getTableModuleInfo(ele, height) {
            console.log('getTableModuleInfo ele', ele);
            const tbModuleInfo = {
                tbTopInfo: this.getEleHeight(ele, Const.cardTableTopWraper),
                tbHeader: this.getEleHeight(ele, Const.cardTableTBHeaderWraper),
                table: this.getEleHeight(ele, Const.cardTableWraper),
                tbBomInfo: this.getEleHeight(ele, Const.cardTableBomWraper),
                minHeight: 0,
                marginPadHeight: 0
            };
            let expandRow = ele.classList.contains(Const.tableRowExpand);
            // console.log("getMinHeight tbModuleInfo", tbModuleInfo);
            tbModuleInfo.minHeight = this.getMinHeight(ele, tbModuleInfo, height, expandRow);
            let needMerge = ele.classList.contains(Const.tableRowSpanMerge);
            if (needMerge) {
                this.setRowSpanMergeInfo(ele);
            }
            let marginPadHeight = height -
                (tbModuleInfo.tbTopInfo.height +
                    tbModuleInfo.table.height +
                    tbModuleInfo.tbBomInfo.height);
            tbModuleInfo.marginPadHeight = marginPadHeight;
            tbModuleInfo.needMerge = needMerge;
            tbModuleInfo.expandRow = expandRow;
            return tbModuleInfo;
        }
        /**
         * minHeight 最小高度 = topInfoHeight + tbHeaderheight + row * minRowsCount
         */
        getMinHeight(ele, tbModuleInfo, height, expandRow = false) {
            const nodes = Array.from(ele.querySelectorAll(Const.cardTableTr));
            const { tbTopInfo, tbHeader } = tbModuleInfo;
            let threeRowHeight = 0;
            if (nodes.length > Const.minRowsCount) {
                nodes.forEach((node, index) => {
                    if (index < Const.minRowsCount) {
                        threeRowHeight += calcHeight(node) || 0;
                    }
                    node.calcHeight = node.clientHeight;
                    if (expandRow) {
                        if (index % 4 < 3 && index % 4 > 0) {
                            node.classList.add(Const.cardTableTr4n);
                        }
                    }
                });
                return tbTopInfo.height + tbHeader.height + threeRowHeight;
            }
            else {
                nodes.forEach((node, index) => {
                    node.calcHeight = node.clientHeight;
                });
                return height;
            }
        }
        setRowSpanMergeInfo(ele) {
            let needMerge = ele.classList.contains(Const.tableRowSpanMerge);
            if (needMerge) {
                const rows = ele.querySelectorAll('.' + Const.cardElRowClass);
                let num = 0;
                rows.forEach((row, rowIndex) => {
                    const tds = row.children;
                    let mergedInfo = {
                        needMergeRow: false,
                        rowIndex,
                        tdIndex: null,
                        needRowSpanNum: 1,
                        isLeftRow: false
                    };
                    if (num > 1) {
                        num--;
                        Object.assign(mergedInfo, {
                            needMergeRow: true,
                            isLeftRow: true,
                            rowIndex,
                            tdIndex: null,
                            needRowSpanNum: num
                        });
                    }
                    else {
                        Array.from(tds).forEach((td, tdIndex) => {
                            const rowSpan = Number(td.getAttribute('rowspan'));
                            if (rowSpan > 1) {
                                num = rowSpan;
                                Object.assign(mergedInfo, {
                                    needMergeRow: true,
                                    rowIndex,
                                    tdIndex,
                                    needRowSpanNum: Number(rowSpan)
                                });
                            }
                        });
                    }
                    row.mergedInfo = mergedInfo;
                    // row.rowIndex = rowIndex;
                    // row.needMergeRow = needMergeRow;
                    // row.mergeTdArgs = mergeTdArgs;
                });
            }
            return needMerge;
        }
        getEleHeight(ele, className) {
            const module = ele.querySelector('.' + className);
            if (ele && module) {
                return {
                    module,
                    height: calcHeight(module)
                };
            }
            else {
                return {
                    module,
                    height: 0
                };
            }
        }
        static getTpl() {
            const headerTpls = this.getChildTpls(PrintTemplatesTag.printHeadertemplates);
            const footerTpls = this.getChildTpls(PrintTemplatesTag.printFooterTemplates);
            this.headerTplMap.size === 0 &&
                this.setTplFunc(headerTpls, this.headerTplMap);
            this.footerTplMap.size === 0 &&
                this.setTplFunc(footerTpls, this.footerTplMap);
            // console.log("this.headerTplMap", this.headerTplMap);
            // console.log("this.headerTplMap", this.footerTplMap);
        }
        static setTplFunc(tpls, map) {
            tpls.forEach((tpl) => {
                const flag = findTplTag(tpl);
                if (flag && !map.has(flag)) {
                    map.set(flag, {
                        tpl: tpl,
                        height: tpl.offsetHeight
                    });
                }
            });
        }
        static getChildTpls(flag) {
            const ele = document.getElementById(flag);
            if (ele) {
                return ele.childNodes;
            }
            return [];
        }
    }
    DfsChild.headerTplMap = new Map();
    DfsChild.footerTplMap = new Map();

    var PrintType;
    (function (PrintType) {
        PrintType["NORMAL_TYPE"] = "NORMAL_TYPE";
        PrintType["HEADER_TYPE"] = "HEADER_TYPE";
        PrintType["FOOTER_TYPE"] = "FOOTER_TYPE";
        PrintType["HEADER_FOOTER_TYPE"] = "HEADER_FOOTER_TYPE"; // 有头有尾
    })(PrintType || (PrintType = {}));
    var ModuleType;
    (function (ModuleType) {
        ModuleType["IMG"] = "IMG";
        ModuleType["MODULE"] = "MODULE";
        ModuleType["TB_MODULE"] = "TB_MODULE";
        ModuleType["TBODY"] = "TBODY";
        ModuleType["ROW"] = "ROW";
    })(ModuleType || (ModuleType = {}));
    var PrintTemplatesTag;
    (function (PrintTemplatesTag) {
        PrintTemplatesTag["printHeadertemplates"] = "print-header-templates";
        PrintTemplatesTag["printFooterTemplates"] = "print-footer-templates";
        PrintTemplatesTag["printPdfTpl"] = "print-pdf-tpl";
        PrintTemplatesTag["printPdfTplFooterDefault"] = "print-pdf-tpl-footer-default";
        PrintTemplatesTag["printPdfTplHeaderDefault"] = "print-pdf-tpl-header-default"; // default header tpl class
    })(PrintTemplatesTag || (PrintTemplatesTag = {}));

    class SplitePage extends DfsChild {
        constructor() {
            super();
            this.completeSplit = false;
            this.tBody = null;
            this.cloneEmptyTable = null;
        }
        tbodyAppendChild(table, row) {
            var _a;
            (_a = table.querySelector('.' + Const.elTbody)) === null || _a === void 0 ? void 0 : _a.appendChild(row);
        }
        /**
         * 拆分table
         */
        splitTable(ele, distance) {
            const moduleInfo = this.childMap.get(ele);
            const { tbTopInfo, table, tbBomInfo, minHeight, marginPadHeight, needMerge, expandRow } = moduleInfo.tableModuleInfo;
            const tbQueue = [tbTopInfo, table, tbBomInfo].filter((item) => item.height > 5);
            if (distance < minHeight) {
                distance = this.createWraper(ele) - marginPadHeight;
            }
            else {
                distance = distance - marginPadHeight;
            }
            while (tbQueue.length > 0) {
                let item = tbQueue.shift();
                let flag = false;
                if (item.module.classList.contains(Const.cardTableTopWraper) &&
                    distance > minHeight) {
                    flag = true;
                }
                if (item.module.classList.contains(Const.cardTableWraper) && distance > item.height) {
                    flag = true;
                }
                if (item.module.classList.contains(Const.cardTableBomWraper) &&
                    distance > item.height) {
                    flag = true;
                }
                if (flag) {
                    distance = this.appendModule(item.module, item.height, ModuleType.TB_MODULE);
                }
                else {
                    if (item.module.classList.contains(Const.cardTableWraper)) {
                        const module = item.module;
                        const rowQueue = this.findRows(module);
                        const headerDom = rowQueue[0].cloneNode(true);
                        this.cleanTbody(module);
                        this.cloneTable(module);
                        if (distance < minHeight) {
                            distance = this.createWraper(module);
                        }
                        distance = this.appendModule(this.createTBModule(this.cloneEmptyTable), 100, ModuleType.TBODY);
                        let tbBomHeight = tbBomInfo.height;
                        while (rowQueue.length > 0) {
                            let row = rowQueue.shift();
                            const height = row.calcHeight;
                            if (distance > height + tbBomHeight) {
                                distance = this.appendModule(row, height, ModuleType.ROW);
                            }
                            else {
                                distance = this.createWraper(module);
                                distance = this.appendModule(this.createTBModule(this.cloneEmptyTable), 100, ModuleType.TBODY);
                                if (expandRow && headerDom) {
                                    const cloneHeader = headerDom.cloneNode(true);
                                    this.appendModule(cloneHeader, 0, ModuleType.ROW);
                                }
                                if (needMerge) {
                                    console.log('needMerge', row.mergedInfo);
                                    const { needMergeRow, isLeftRow, needRowSpanNum } = row.mergedInfo;
                                    if (needMergeRow && isLeftRow && needRowSpanNum) {
                                        let td = document.createElement('td');
                                        td.classList.add('el-table_1_column_1');
                                        td.classList.add('el-table__cell');
                                        td.setAttribute('rowspan', String(needRowSpanNum));
                                        row && row.prepend(td);
                                    }
                                }
                                distance = this.appendModule(row, height, ModuleType.ROW);
                            }
                        }
                    }
                    else {
                        distance = this.createWraper(ele);
                        distance = this.appendModule(item.module, item.height, ModuleType.TB_MODULE);
                    }
                }
            }
            return distance;
        }
        /**
         * 拆分页面
         */
        splitPage(pageInfo) {
            this.pageInfo = pageInfo;
            let distance = 0;
            let idx = 0;
            const stack = [...this.childMap.keys()];
            let flag = true;
            const next = () => {
                if (idx >= stack.length)
                    return;
                const ele = stack[idx++];
                if (ele.classList.contains(Const.printImg)) {
                    this.createWraper(ele);
                    this.appendModule(ele, 0, ModuleType.IMG);
                    if (!flag) {
                        flag = true;
                    }
                }
                else {
                    if (flag) {
                        distance = this.createWraper(ele);
                        flag = false;
                    }
                    const nodeInfo = this.childMap.get(ele);
                    // 剩余距离小于 元素的高度 放不下
                    if (distance < nodeInfo.height) {
                        // 是table
                        if (nodeInfo.isTable) {
                            distance = this.splitTable(ele, distance);
                        }
                        else {
                            // 重新创建页面
                            this.createWraper(ele);
                            distance = this.appendModule(ele, nodeInfo.height, ModuleType.MODULE);
                        }
                    }
                    else {
                        // 能放下
                        distance = this.appendModule(ele, nodeInfo.height, ModuleType.MODULE);
                    }
                }
                next();
            };
            next();
        }
        cloneTable(table) {
            this.cloneEmptyTable = table.cloneNode(true);
            this.removeStyleHeight();
        }
        removeStyleHeight() {
            const next = (node) => {
                if (!node || (node.classList && node.classList.contains(Const.elTableBodyWraper)))
                    return;
                const height = node.style && node.style.height;
                if (height) {
                    node.style.height = 'auto';
                }
                if (node.hasChildNodes()) {
                    const nodeQueue = Array.from(node.children);
                    while (nodeQueue.length > 0) {
                        const curNode = nodeQueue.shift();
                        next(curNode);
                    }
                }
            };
            next(this.cloneEmptyTable);
        }
        findRows(ele) {
            const rows = ele.querySelectorAll(Const.cardTableTr);
            return Array.from(rows);
        }
        cleanTbody(ele) {
            var _a;
            const rows = ele.querySelectorAll(Const.cardTableTr);
            (_a = Array.from(rows)) === null || _a === void 0 ? void 0 : _a.forEach((row) => {
                var _a;
                (_a = row.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(row);
            });
        }
        createTBModule(cloneEmptyTable) {
            const moduleTbWraper = document.createElement('div');
            // moduleTbWraper.setAttribute("style", "border: 3px solid yellow");
            const emptyTable = cloneEmptyTable === null || cloneEmptyTable === void 0 ? void 0 : cloneEmptyTable.cloneNode(true);
            moduleTbWraper.appendChild(emptyTable);
            return moduleTbWraper;
        }
    }
    /**
     * 拆分table tbody
     */
    // splitTbody(tbody: TbQueueItem, distance: number, tbBomHeight: number) {
    //   if (tbBomHeight == null) tbBomHeight = 0;
    //   const module = tbody.module;
    //   const rowQueue = this.findRows(module);
    //   let idx = 0;
    //   this.cleanTbody(module);
    //   this.cloneTable(module as HTMLElement);
    //   distance = this.appendModule(
    //     this.createTBModule(this.cloneEmptyTable as Element),
    //     100,
    //     ModuleType.TBODY
    //   );
    //   const next = () => {
    //     if (idx >= rowQueue.length) return;
    //     const row = rowQueue[idx++];
    //     const height = (row as CurrentStyleElement).calcHeight;
    //     if (distance > height + tbBomHeight) {
    //       distance = this.appendModule(row, height, ModuleType.ROW);
    //     } else {
    //       distance = this.createWraper(module);
    //       distance = this.appendModule(
    //         this.createTBModule(this.cloneEmptyTable as Element),
    //         100,
    //         ModuleType.TBODY
    //       );
    //       distance = this.appendModule(row, height, ModuleType.ROW);
    //     }
    //     next();
    //   };
    //   next();
    //   return distance;
    // }

    class Compose extends SplitePage {
        constructor(module) {
            super();
            this.rootWraperEle = null;
            this.wraperDiv = [];
            this.pageHeight = 0;
            this.pageWidth = 0;
            this.dfsChild = null;
            this.needTpl = false;
            this.pageInfo = module.pageInfo;
            console.log("this.pageInfo", this.pageInfo);
            const { deviceParams, needTpl } = this.pageInfo;
            const { height, width } = deviceParams || { width: 0, height: 0 };
            this.pageHeight = height;
            this.pageWidth = width;
            this.needTpl = needTpl;
            this.moduleId = module.moduleId;
            this.init(this.moduleId);
        }
        init(ele) {
            this.rootWraperEle = document.querySelector(ele);
            if (this.rootWraperEle == null) {
                if (process.env.NODE_ENV === "production") {
                    console.error(`找不到${ele}包裹元素！`);
                }
                else {
                    throw new Error(`找不到${ele}包裹元素！`);
                }
                return;
            }
            this.needTpl && Compose.getTpl();
            console.log("Compose.tplMap", Compose.headerTplMap);
            this.walk(this.rootWraperEle);
            console.log("this.childMap", this.childMap);
        }
        print() {
            return new Promise((resolve, reject) => {
                this.splitPage(this.pageInfo);
                console.log("this.pageInfo111", this.pageInfo);
                console.log("this.deps", this.deps);
                if (this.rootWraperEle) {
                    this.clearContainer();
                    this.appendPage(this.deps);
                    this.deps = null;
                    Print.completedModule(this.moduleId);
                    resolve(true);
                }
                else {
                    reject(false);
                    throw new Error("布局失败");
                }
            });
        }
        clearContainer() {
            var _a;
            Array.from((_a = this.rootWraperEle) === null || _a === void 0 ? void 0 : _a.children).forEach((eleItem) => {
                var _a;
                (_a = this.rootWraperEle) === null || _a === void 0 ? void 0 : _a.removeChild(eleItem);
            });
        }
        appendPage(nodes) {
            if (this.pageInfo.lastModule) {
                const lastChild = nodes.lastElementChild;
                if (lastChild) {
                    lastChild.classList.remove(Const.printImgWraper);
                    lastChild.classList.remove(Const.printPageWraper);
                    lastChild.classList.add(Const.printLastWraper);
                }
            }
            Array.from(nodes.children).forEach((node, index, arr) => {
                var _a;
                (_a = this.rootWraperEle) === null || _a === void 0 ? void 0 : _a.appendChild(node);
            });
        }
    }

    function waterMark(markConfig) {
        const baseConfig = {
            // waterMarkId: markConfig.waterMarkId,
            waterMarkContent: "水印内容",
            waterMarkX: -10,
            waterMarkY: 40,
            waterMarkRows: 1000,
            waterMarkCols: 200,
            waterMarkXSpace: 140,
            waterMarkYSpace: 80,
            waterMarkColor: "#999999",
            waterMarkAlpha: 0.2,
            waterMarkFontSize: "25px",
            waterMarkFont: "微软雅黑",
            waterMarkWidth: 150,
            waterMarkHeight: 100,
            waterMarkAngle: 15,
        };
        const settings = Object.assign({}, baseConfig, markConfig);
        if (arguments.length === 1 && typeof arguments[0] === "object") {
            const src = arguments[0] || {};
            for (const key in src) {
                if (src[key] && settings[key] && src[key] === settings[key])
                    continue;
                else if (src[key])
                    settings[key] = src[key];
            }
        }
        const obj = document.getElementById(settings.waterMarkId);
        if (!obj) {
            throw new Error(`${markConfig.waterMarkId} must be exist in document`);
        }
        const tmpObj = document.createDocumentFragment();
        const pageWidth = obj.clientWidth;
        console.log("pageWidth", pageWidth);
        const pageHeight = obj.offsetHeight;
        const r1 = settings.waterMarkX +
            settings.waterMarkWidth * settings.waterMarkCols +
            settings.waterMarkXSpace * (settings.waterMarkCols - 1);
        if (settings.waterMarkCols == 0 || parseInt(String(r1)) > pageWidth) {
            const r2 = (pageWidth - settings.waterMarkX + settings.waterMarkXSpace) /
                (settings.waterMarkWidth + settings.waterMarkXSpace);
            settings.waterMarkCols = parseInt(String(r2));
            const r3 = (pageWidth -
                settings.waterMarkX -
                settings.waterMarkWidth * settings.waterMarkCols) /
                (settings.waterMarkCols - 1);
            settings.waterMarkXSpace = parseInt(String(r3));
        }
        if (settings.waterMarkRows == 0 ||
            parseInt(String(settings.waterMarkY +
                settings.waterMarkHeight * settings.waterMarkRows +
                settings.waterMarkYSpace * (settings.waterMarkRows - 1))) > pageHeight) {
            settings.waterMarkRows = parseInt(String((settings.waterMarkYSpace + pageHeight - settings.waterMarkY) /
                (settings.waterMarkHeight + settings.waterMarkYSpace)));
            settings.waterMarkYSpace = parseInt(String((pageHeight -
                settings.waterMarkY -
                settings.waterMarkHeight * settings.waterMarkRows) /
                (settings.waterMarkRows - 1)));
        }
        let x;
        let y;
        settings.waterMarkRows =
            settings.waterMarkRows == 0 ? 6 : settings.waterMarkRows;
        for (let i = 0; i < settings.waterMarkRows; i++) {
            y =
                settings.waterMarkY +
                    (settings.waterMarkYSpace + settings.waterMarkHeight) * i;
            y = isNaN(y) ? 40 : y;
            for (let j = 0; j < settings.waterMarkCols; j++) {
                x =
                    settings.waterMarkX +
                        (settings.waterMarkWidth + settings.waterMarkXSpace) * j;
                const markElement = document.createElement("div");
                markElement.id = "markElement" + i + j;
                markElement.appendChild(document.createTextNode(settings.waterMarkContent));
                //设置水印div倾斜显示
                markElement.style.webkitTransform =
                    "rotate(-" + settings.waterMarkAngle + "deg)";
                // @ts-ignore
                markElement.style.MozTransform =
                    "rotate(-" + settings.waterMarkAngle + "deg)";
                // @ts-ignore
                markElement.style.msTransform =
                    "rotate(-" + settings.waterMarkAngle + "deg)";
                // @ts-ignore
                markElement.style.OTransform =
                    "rotate(-" + settings.waterMarkAngle + "deg)";
                markElement.style.transform =
                    "rotate(-" + settings.waterMarkAngle + "deg)";
                markElement.style.visibility = "";
                markElement.style.position = "absolute";
                markElement.style.left = x + "px";
                markElement.style.top = y + "px";
                markElement.style.overflow = "hidden";
                markElement.style.opacity = String(settings.waterMarkAlpha);
                markElement.style.fontSize = settings.waterMarkFontSize;
                markElement.style.fontFamily = settings.waterMarkFont;
                markElement.style.color = settings.waterMarkColor;
                markElement.style.textAlign = "center";
                markElement.style.width = "auto !important";
                markElement.style.height = "auto !important";
                markElement.style.zIndex = "999999 !important";
                markElement.style.display = "block";
                markElement.style["pointer-events"] = "none";
                markElement.style.filter =
                    "alpha(opacity=" + settings.waterMarkAlpha * 100 + ")";
                markElement.setAttribute("class", "markElement");
                tmpObj.appendChild(markElement);
            }
        }
        obj.appendChild(tmpObj);
    }

    class Print {
        constructor({ selectModule, moduleMap, injectClass, callback }) {
            this.needFilter = true;
            this.selectModule = [];
            this.ModuleInfoSet = [];
            this.moduleMap = new Map();
            this.deviceParams = { width: 794, height: 1120 };
            this.injectClass = {};
            this.callback = Function.prototype;
            // 多个Map模块下载
            if (selectModule && moduleMap) {
                this.selectModule = selectModule;
                this.needFilter = true;
                this.moduleMap = moduleMap;
            }
            else {
                // 单个object模块下载
                this.ModuleInfoSet = [arguments[0]];
                this.needFilter = false;
            }
            if (injectClass) {
                this.injectClass = injectClass;
            }
            if (callback) {
                this.callback = callback;
            }
            // this.deviceParams = getDeviceParams()
            this.createPrint();
        }
        static completedModule(moduleId) {
            this.completedMap.set(moduleId, true);
        }
        createPrint() {
            return __awaiter(this, void 0, void 0, function* () {
                this.needFilter && this.filterSelectModule();
                // 注入不同ui组件的table class
                if (this.injectClass && Object.keys(this.injectClass).length > 0) {
                    Const.setTableClass(this.injectClass);
                }
                this.ModuleInfoSet.forEach((module, index) => __awaiter(this, void 0, void 0, function* () {
                    if (this.ModuleInfoSet.length - 1 === index) {
                        module.pageInfo.lastModule = true;
                    }
                    yield this.onPrint(module);
                }));
                yield this.exitCallback();
            });
        }
        exitCallback() {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log('callback');
                    this.callback && this.callback();
                    resolve(true);
                }, 0);
            });
        }
        onPrint(module) {
            return __awaiter(this, void 0, void 0, function* () {
                if (Print.completedMap.get(module.moduleId)) {
                    console.log(`${module.moduleId} 模块已经分页过了`);
                    return;
                }
                module.pageInfo.deviceParams = this.deviceParams;
                yield new Compose(module).print();
                if (module.pageInfo.waterMark) {
                    this.setWaterMark(module);
                }
            });
        }
        setWaterMark(module) {
            setTimeout(() => {
                console.log('waterMark');
                waterMark(module.pageInfo.waterMarkConfig);
            }, 300);
        }
        filterSelectModule() {
            this.ModuleInfoSet = this.selectModule
                .filter((item) => this.moduleMap.has(item))
                .map((item) => this.moduleMap.get(item));
        }
    }
    Print.completedMap = new Map();

    exports.Print = Print;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({});
//# sourceMappingURL=pdf-page-split.global.js.map
