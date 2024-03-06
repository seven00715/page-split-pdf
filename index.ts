import DfsChild from './src/DfsChild'

export { Print } from './src/index'

export declare class PrintPageDeclare extends DfsChild {
  print: () => Promise<boolean>
}

export interface PrintParmas {
  moduleMap: ModuleMap | ModuleInfo
  selectModule?: string[]
  injectClass?: BaseClass
  callback?: Function
  deviceParams?: {width: number, height: number},
  pageMargin?: {
    top: number;
    bottom: number;
  }
}

export interface BaseClass {
  cardTableTBHeaderWraper: string
  cardElRowClass: string
  elTableBodyWraper: string
}


export enum PrintType {
  NORMAL_TYPE = 'NORMAL_TYPE', // 无头无尾
  HEADER_TYPE = 'HEADER_TYPE', // 有头无尾
  FOOTER_TYPE = 'FOOTER_TYPE', // 无头有尾
  HEADER_FOOTER_TYPE = 'HEADER_FOOTER_TYPE' // 有头有尾
}

export enum ModuleType {
  IMG = 'IMG',
  MODULE = 'MODULE',
  TB_MODULE = 'TB_MODULE',
  TBODY = 'TBODY',
  ROW = 'ROW'
}

export const enum ShapeFlags {
  NORMAL_PAGE = 1,
  HEADER_PAGE = 1 << 1,
  FOOTER_PAGE = 1 << 2,
  TOTAL_PAGE = ShapeFlags.HEADER_PAGE | ShapeFlags.FOOTER_PAGE
}

export interface PageInfo {
  title?: string
  needTpl?: boolean // 是否需要模板
  defaultType?: PrintType
  waterMark?: boolean
  waterMarkConfig?: MarkConfig // 需要waterMark为true
  pageMargin?: {
    top: number;
    bottom: number;
  },
  [PropName: string]: any
}
export interface ModuleInfo {
  moduleId: string
  pageInfo: PageInfo
}
export interface DeviceParams {
  width: number
  height: number
}
export type ModuleMap = Map<string, ModuleInfo>
export interface CurrentStyleElement extends Element {
  currentStyle: {
    [propName: string]: any
  }
  calcHeight: number
  mergedInfo: {
    needMergeRow: boolean
    needRowSpanNum: number
    isLeftRow: boolean
  }
}

export enum PrintTemplatesTag {
  printHeadertemplates = 'print-header-templates', // header template wraper
  printFooterTemplates = 'print-footer-templates', // footer template wraper
  printPdfTpl = 'print-pdf-tpl', //  template
  printPdfTplFooterDefault = 'print-pdf-tpl-footer-default', // default footer tpl class
  printPdfTplHeaderDefault = 'print-pdf-tpl-header-default' // default header tpl class
}

export type Ele = Element | null

export interface TplMapItem {
  tpl: Element
  height: number
}

export type TplMap = Map<string, TplMapItem>

export interface EleStyleInfo {
  height: number
  isTable: boolean
  tableModuleInfo: TbModuleInfo
}

export interface TbModuleInfoItem {
  module: HTMLElement
  height: number
  talbeWraper?: boolean
  tbHeaderHeight?: number
}
export interface TbQueueItem {
  height: number
  module: HTMLElement
}
export interface TbModuleInfo {
  tbTopInfo: TbQueueItem
  tbHeader: TbQueueItem
  table: TbQueueItem
  tbBomInfo: TbQueueItem
  minHeight: number
  marginPadHeight: number
  needMerge?: boolean
  expandRow?: boolean
}
export interface MarkConfig {
  waterMarkId: string // 要做水印的根元素id
  waterMarkContent: string // 水印内容
  waterMarkColor?: string //水印颜色
  waterMarkAlpha?: number // 水印透明度
  waterMarkY?: number
  waterMarkRows?: number
  waterMarkCols?: number
  waterMarkXSpace?: number // 水印之间水平间隔
  waterMarkYSpace?: number // 水印之间垂直间隔
  waterMarkFontSize?: string // 水印字体大小
  waterMarkFont?: string // 水印字体
  waterMarkWidth?: number // 水印宽度
  waterMarkHeight?: number // 水印高度
  waterMarkAngle?: number // 水印旋转角度
}
