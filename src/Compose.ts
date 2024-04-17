import { PrintPageDeclare, ModuleInfo, PageInfo, Print } from "../index";
import Const from "./const";
import SplitePage from "./SplitePage";
import { createWrapper } from "./utils";

export default class Compose extends SplitePage implements PrintPageDeclare {
  constructor(module: ModuleInfo) {
    super();
    this.pageInfo = module.pageInfo;
    console.log("this.pageInfo", this.pageInfo);
    const { deviceParams, needTpl } = this.pageInfo;
    console.log('deviceParams', deviceParams)
    const { height, width } = deviceParams || { width: 0, height: 0 };
    this.pageHeight = height;
    this.pageWidth = width;
    this.needTpl = needTpl as boolean;
    this.moduleId = module.moduleId;
    this.module = module;
    this.init(this.moduleId);
  }
  module!: ModuleInfo;
  rootWraperEle: HTMLElement | null = null;
  wraperDiv = [];
  moduleId: string;
  pageInfo: PageInfo;
  pageHeight = 0;
  pageWidth = 0;
  dfsChild = null;
  needTpl = false;
  init(ele: string) {
    this.rootWraperEle = document.querySelector(ele);
    if (this.rootWraperEle == null) {
      // @ts-ignore
      if (process.env.NODE_ENV === "production") {
        console.error(`找不到${ele}包裹元素！`);
      } else {
        throw new Error(`找不到${ele}包裹元素！`);
      }
      return;
    }

    this.needTpl && Compose.getTpl();
    console.log("Compose.tplMap", Compose.headerTplMap);
    this.walk(this.rootWraperEle as HTMLElement);
    console.log("this.childMap", this.childMap);
  }

  print() {
    return new Promise(
      (resolve: (value: boolean) => void, reject: (value: boolean) => void) => {
        this.splitPage(this.pageInfo);
        console.log("this.pageInfo111", this.pageInfo);
        console.log("this.deps", this.deps);
        if (this.rootWraperEle) {
          this.clearContainer();
          this.appendPage(this.deps as HTMLElement);
          this.deps = null;
          Print.completedModule(this.moduleId);
          resolve(true);
        } else {
          reject(false);
          throw new Error("布局失败");
        }
      }
    );
  }

  clearContainer() {
    Array.from((this.rootWraperEle as HTMLElement)?.children).forEach(
      (eleItem) => {
        this.rootWraperEle?.removeChild(eleItem);
      }
    );
  }

  appendPage(nodes: HTMLElement) {
    if (this.pageInfo.lastModule) {
      const lastChild = nodes.lastElementChild;
      if (lastChild) {
        lastChild.classList.remove(Const.printImgWraper);
        lastChild.classList.remove(Const.printPageWraper);
        lastChild.classList.add(Const.printLastWraper);
      }
    }
    const filterArr = Array.from(nodes.children).filter(node => !node.classList.contains(`${Const.NonePageNumber}`))
    const len = filterArr.length;
    console.log("filterArr", filterArr)
    const pageNumberHtml = this.pageInfo.pageNumberHtml; 
    //   const pageNumberHtml = 'return "第"+pageNo+"页, 共"+len+"页"'
    let pageNo = 1
 
    Array.from(nodes.children).forEach((node, index, arr) => {
      if(!node.classList.contains(`${Const.NonePageNumber}`)){
        const pageNoWrapper = createWrapper(`${Const.pageNumberWrapperFlag}`, 20);
        if(pageNumberHtml){
          const run = new Function('pageNo', 'len', pageNumberHtml);
          pageNoWrapper.innerHTML = run(pageNo, len)
        }else {
          pageNoWrapper.innerHTML = `第${pageNo}页, 共${len}页`
        }
       
        pageNo ++
        node.appendChild(pageNoWrapper);
      }
      this.rootWraperEle?.appendChild(node);
    });
  }
}
