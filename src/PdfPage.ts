import { Ele, PageInfo, PrintTemplatesTag, TplMap, TplMapItem } from '../index';
import { ModuleType, PrintType } from '../index'
import { findTplTag } from './utils'
import DfsChild from './DfsChild'
import Const from './const'
/**
 * 主要思想：发布订阅
 *  将动态创建的wraper 订阅到deps里面, 下载的时候统一发布deps里面的wraper；
 */
export default class PdfPage {
  constructor() {
    this.deps = document.createElement('div')
  }
  deps: Ele = document.createElement('div')
  curPage: any
  ele: any
  wraper: Ele = null
  tbWraper: Ele = null
  mainHeight = 0
  base = {}
  pageInfo: PageInfo = {}
  pageHeight = 0
  module!: PageInfo
  headerTplMap = DfsChild.headerTplMap
  footerTplMap = DfsChild.footerTplMap

  createWraper(ele: Ele) {
    this.ele = ele
    this.initPage()
    this.curPage = this.wraper
    this.deps?.appendChild(this.curPage)
    return this.mainHeight
  }
  /**
   * 初始化 imgPageWraper 和普通页面的wraper
   */
  initPage() {
    console.log('this.module', this.module)
    if (this.ele) {
      const pageType = this.getPageType(this.ele as HTMLElement)
      if (this.ele?.classList.contains(Const.printImg)) {
        ;(this.ele as HTMLElement).classList.add(Const.printImgHeight)
        this.wraper = this.createPageWraper(Const.printImgWraper, pageType)
      } else {
        this.wraper = this.createPageWraper(Const.printPageWraper, pageType)
      }
      const { marginTop, marginBottom } = this.createMarginWraper(this.ele)
      let header
      let main
      let footer

      if (pageType === PrintType.NORMAL_TYPE) {
        this.mainHeight = this.pageHeight
        this.mainHeight = this.reduceMargin(
          this.mainHeight,
          marginTop,
          marginBottom
        )
        main = this.createModule(Const.printMainName, this.mainHeight)
      } else if (pageType === PrintType.HEADER_TYPE) {
        const { tpl, heigth: pHeaderH } = this.cloneTpl(
          this.ele,
          this.headerTplMap,
          Const.printHeaderName,
        )
        header = tpl
        this.mainHeight = this.pageHeight - pHeaderH
        this.mainHeight = this.reduceMargin(
          this.mainHeight,
          marginTop,
          marginBottom
        )
        main = this.createModule(Const.printMainName, this.mainHeight)
      } else if (pageType === PrintType.FOOTER_TYPE) {
        const { tpl, heigth: pFooterH } = this.cloneTpl(
          this.ele,
          this.footerTplMap,
          Const.printFooterName,
        )
        footer = tpl
        this.mainHeight = this.pageHeight - pFooterH
        this.mainHeight = this.reduceMargin(
          this.mainHeight,
          marginTop,
          marginBottom
        )
        main = this.createModule(Const.printMainName, this.mainHeight)
      } else if (pageType === PrintType.HEADER_FOOTER_TYPE) {
        const { tpl: HTpl, heigth: pHeaderH } = this.cloneTpl(
          this.ele,
          this.headerTplMap,
          Const.printHeaderName,
        )
        header = HTpl
        const { tpl: FTpl, heigth: pFooterH } = this.cloneTpl(
          this.ele,
          this.footerTplMap,
          Const.printFooterName,
        )
        footer = FTpl
        this.mainHeight = this.pageHeight - pHeaderH - pFooterH
        this.mainHeight = this.reduceMargin(
          this.mainHeight,
          marginTop,
          marginBottom
        )
        main = this.createModule(Const.printMainName, this.mainHeight)
      }
      console.log('create this.mainHeight', this.mainHeight)
      marginTop && this.wraper.appendChild(marginTop)
      header && this.wraper.appendChild(header)
      main && this.wraper.appendChild(main)
      footer && this.wraper.appendChild(footer)
      marginBottom && this.wraper.appendChild(marginBottom)
    }
  }

  reduceMargin(mainHeight, marginTop, marginBottom) {
    const margin = this.module.pageInfo.pageMargin;
    const top = (marginTop && margin && margin.top) || 0
    const bottom = (marginBottom && margin && margin.bottom) || 0
    return mainHeight - top - bottom
  }

  // 判断是否需要page marginTop 和 marginBottom
  createMarginWraper(ele: HTMLDivElement) {
    let marginTop, marginBottom
    const pageMargin = this.module.pageInfo.pageMargin
    const boolTop = ele && ele.classList.contains(Const.NonePageMarinTop)
    const boolBottom = ele && ele.classList.contains(Const.NonePageMarinBottom)
    if (pageMargin && pageMargin.top > 0 && !boolTop) {
      marginTop = this.createBoxWraper(Const.pageMarginTopFlag, pageMargin.top)
    }

    if (pageMargin && pageMargin.bottom > 0 && !boolBottom) {
      marginBottom = this.createBoxWraper(
        Const.pageMarginBottomFlag,
        pageMargin.bottom,
      )
    }
    return {
      marginTop,
      marginBottom,
    }
  }

  createBoxWraper(classname: string, height: number) {
    const divHeight = String(height)
    const div = document.createElement('div')
    div.classList.add(classname)
    div.style.height = divHeight + 'px'
    return div
  }

  getPageType(ele: HTMLElement) {
    //@ts-ignore
    const TYPES = Object.values(PrintType)
    const type = Array.from(ele.classList).find((item) =>
      TYPES.includes(item as PrintType),
    )
    return type || this.pageInfo.defaultType || PrintType.NORMAL_TYPE
  }

  cloneTpl(ele: Element, map: TplMap, className: string) {
    const flag = findTplTag(ele)
    let cloneTpl!: HTMLDivElement
    let cloneheight = 0
    let tplMap: TplMapItem
    if (this.pageInfo.needTpl) {
      if (map.size === 0) {
        console.error(`needTpl：true，需要传入对应的template!`)
      }
      if (map.size > 0) {
        if (flag && map.has(flag)) {
          tplMap = map.get(flag) as TplMapItem
        } else {
          tplMap =
            className === Const.printHeaderName
              ? (map.get(
                  PrintTemplatesTag.printPdfTplHeaderDefault,
                ) as TplMapItem)
              : (map.get(
                  PrintTemplatesTag.printPdfTplFooterDefault,
                ) as TplMapItem)
        }
        cloneTpl = tplMap.tpl.cloneNode(true) as HTMLDivElement
        cloneTpl.classList.add(className)
        cloneheight = tplMap.height
        cloneTpl.style.height = cloneheight + 'px'
      }
    }

    return {
      tpl: cloneTpl,
      heigth: cloneheight,
    }
  }

  /**
   * 动态创建 pdf A4 page wraper
   * @param name "print-img-wraper" 图片页面标记类;  "print-page-wraper"普通页面标记类
   * @param pageType PrintType
   * @returns
   */
  createPageWraper(name: string, pageType: string): HTMLElement {
    const wraper = document.createElement('div')
    wraper.classList.add(pageType)
    wraper.classList.add(name)
    return wraper
  }

  /**
   * 创建 pdf A4纸张中的 一个个模块 header footer main
   * @param name header/footer/main 的class 类名
   * @param height header/footer/main 高度
   * @returns 创建好的模块
   */
  createModule(name: string, height: number) {
    const module = document.createElement('div')
    module.style.height = height + 'px'
    module.classList.add(name)
    return module
  }

  /**
   * 往page里面添加模块 模块类型有： 1.单独的img 2. 独立的module 3. tableModule 4.table tbody 5. table row
   * @param ele 要添加的元素 ModuleType
   * @param height 元素的高度
   * @param type  ModuleType
   * @returns 返回当前页面剩余的高度
   */
  appendModule(ele: Ele, height: number, type: ModuleType): number {
    if (ele) {
      if (type === ModuleType.ROW) {
        const main = (this.wraper as any)?.querySelector(
          `.${Const.printMainName}`,
        )
        let wr = main.querySelectorAll(`.${Const.cardTableWraper}`)
        wr = wr[Array.from(wr).length - 1]
        const by = wr.querySelector(`${Const.elTbody}`)
        by.appendChild(ele as Element)
      } else {
        this.wraper
          ?.querySelector(`.${Const.printMainName}`)
          ?.appendChild(ele as Element)
      }
      this.mainHeight = this.mainHeight - height
    }
    return this.mainHeight
  }
}
