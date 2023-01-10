# 目前将 html 页面转成 pdf 文件的主流方式

- 完整 demo，见 example 目录

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c1abbf0aa9f046c3bf84e18bcd82e6dc~tplv-k3u1fbpfcp-watermark.image?)

# 1.不论是哪种方式，只要是将 h5/vue/react/原生 js 页面生成 pdf，都会遇到的问题

1. 各个浏览器、手机兼容性问题；
2. 内容截断问题； 包括不限于 echart 图表截断、动态 table 行截断问题
3. 业务关系紧密的内容和描述需要尽可能放在一起打印
4. 生成动态内容 pdf 等问题
5. 批量下载 pdf 稳定性问题
6. 如果是大文件 前端等待时间较长，如果关闭页面生成失败

# 2.针对以上问题的解决方案

<img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/994310822e8c4959b80847e4ccc72cfe~tplv-k3u1fbpfcp-watermark.image?" alt="image.png" width="70%" />

## 方案 1.前端生成 页面转 pdf 工具 + nb-fe-pdf 算法

页面转 pdf 工具，比如：htmlToCavas/window.print/jspdf

- 这个方案可以解决内容截断和生成动态内容，但是有以下问题
  - 各个浏览器、手机兼容性问题；
  - 批量下载 pdf 稳定性问题
  - 如果是大文件 前端等待时间较长，如果关闭页面生成失败

## 方案 2.node 端 node + Puppeteer + nb-fe-pdf 算法（推荐）

- 这个方案可以解决以 1 到 6 所有问题，并且经过多个项目的验证，不管是用 vue/react 还是别的框架，pc 端还是 H5 端，ui 框架用的 elementui/vant/antd 等，只要最终渲染结果是 DOM 结构都可以理想的实现分页下载；
- 同步方案：
  - 适用于并发比较小（10 左右），要下载的内容比较少（1M 左右）时以内的场景
- 异步方案（墙裂推荐）
  - 适用于各种场景，高并发、大文件的情况也适用；
  - 需要处理队列中的任务状态，成功要做什么、失败了要做什么等等

# 3.nb-fe-pdf 算法

## 3.1 nb-fe-pdf 算法思想

### 分页效果图

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f5f1566030794c35a462c7bf46adf3d0~tplv-k3u1fbpfcp-watermark.image?)

### nb-fe-pdf 算法思想图

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2a76cb164e004e428304543cb639e171~tplv-k3u1fbpfcp-watermark.image?)

- nb-fe-pdf 算法是在页面 dom 结构生成完成之后，根据标记，将页面分成一个个模块，计算这些模块的高度，将一个个模块合理的放到 A4 纸中；
- 类似于拼图游戏，这个拼图游戏是要将一个个模块合理的放到 A4 纸中；
- 上图例子中，模块 1 可能处于 pdf 页面的尾部，标题 1 和文本 1 可能在上一页，说明 1 可能被分到下一页了， 说明 1 是描述文本 1，我们希望他们放在一起，给模块 1 所在的外层 div 加一个 flag 标记；
- 最终分页问题转化为将一个个 flag，合理的放到 A4 纸中

### view 层约定-普通模块(高度是固定的）

- 给业务关系比较紧密的模块的外层元素，加上 class="page-splite-flag"

```
   <div>
    <div class="page-splite-flag">
        模块1
        <title>标题1</title>
        <div>
            <p>文本1</p>
            <p>文本2</p>
            <p>文本3</p>
        </div>
        <p>说明1</p>
    </div>

    <div class="page-splite-flag">
        模块2
        动态table2
       <xx-tabel>
        我有多少行，取决于数据库有多少条数据
       </xx-table>
    </div>

     <div class="page-splite-flag">
        模块3
        <title>标题2</title>
        <div id="echarts1">饼状图、柱状图</div>
    </div>
  </div>
```

### view 层约定 - 带有 table 的模块（高度未知，根据数据多少来展示）

- - 默认 ui 组件是基于 elementui
  - 如果 table 内容的长度是动态的 引入 cardTable 组件，用 slot 的方式在对应的信息放进去；
  - 如果 table 长度不是动态的就可以不用
- 其实在算法层，最终用到的是"card-table"、“card-table-top-wraper”、“card-table-wraper”、“card-table-bom-wraper” 这些 class 类名，意味着不论什么 ui 框架的 table 组件，或者是原生 table，只要按照这种结构，给对应的位置加上这些 class 名，就可以正确的完成动态 table 分页；

```
// cardTable.vue
<template>
  <div class="card-table page-splite-flag">
    <div class="card-table-top-wraper">
      <slot name="card-table-header" />
    </div>
    <div class="card-table-wraper">
      <slot name="card-table" />
    </div>
    <div class="card-table-bom-wraper">
      <slot name="card-table-footer" />
    </div>
  </div>
</template>
```

```
// usage.vue
 <card-table >
      <template #card-table-header>
        <div>
          <h3>投资产品选择</h3>
        </div>
        <h4 style="padding-left: 20px">定投产品总览</h4>
      </template>
      <template #card-table>
        <ts-table
          :table-data="regularList"
          :table-head="regularHead"
          :table-title-obj="{ hide: true }"
          :paginationHide="true"
        />
      </template>

       <template #card-table-footer>
           <p>表格说明信息1</p>
           <p>表格说明信息2</p>
           <p>...</p>
      </template>
    </card-table>
```

## 3.2 nb-fe-pdf 使用方式

### 安装

```js
nbnpm i nb-fe-pdf -S // nbnpm 下载(内部下载)
or
npm install nb-fe-pdf -S // 无法使用nbnpm，可以用npm或yarn

源码地址：
https://gitlab.newbanker.cn/nbnpm/nb-fe-pdf (内部访问)
or
https://www.npmjs.com/package/nb-fe-pdf
```

### 参数说明

```
export interface PrintParmas {
  moduleMap: ModuleMap | ModuleInfo; // moduleMap是由多个ModuleInfo 组成的
  selectModule?: string[]; // 要下载的模块名["analy", "pension"]
  injectClass?: BaseClass; // injectClass不传默认是elementui的el-table
  callback?: Function; // 分页执行完毕的回调函数
}

const moduleInfo: ModuleInfo = {
        moduleId: "#print-analy-wraper", // 模块id，给每个要下载的组合所有页面的根元素加上id
        pageInfo: {
            title?: string; // 模块标题
            needTpl?: boolean; // 是否需要头尾模板,默认为false
            defaultType?: PrintType; // 模板类型，需要needTpl为true,
            waterMark?: boolean // 是否需要水印, 默认为false
            waterMarkConfig: { // 需要waterMark为true
                waterMarkId: string; // 要做水印的根元素id
                waterMarkContent: string; // 水印内容
            };
        };
      }

// 模板类型
export enum PrintType {
  NORMAL_TYPE = "NORMAL_TYPE", // 无头无尾
  HEADER_TYPE = "HEADER_TYPE", // 有头无尾
  FOOTER_TYPE = "FOOTER_TYPE", // 无头有尾
  HEADER_FOOTER_TYPE = "HEADER_FOOTER_TYPE", // 有头有尾
}
```

### 适配不同的 UI 框架

- 在 pageInfo 传入对应 ui 框架的 table 的 injectClass 类名即可

```
 // defaut use elementui table component classnames
  static cardTableTBHeaderWraper = "el-table__header-wrapper"; // table header wraper classname
  static cardElRowClass = "el-table__row"; // table body row  classname
  static elTableBodyWraper = "el-table__body-wrapper"; // table body wraper classname


const injectClass = {
  cardTableTBHeaderWraper: 've-table-header'
  cardElRowClass: 've-table-body-tr',
  elTableBodyWraper: 've-table-body'
}
```

### 快速开始-下载单个模块语法

```
// javascript 引用方式
import { Print } from 'nb-fe-pdf/lib/src'

// typescript 引用方式
import { Print } from 'nb-fe-pdf'

语法 new Print(moduleInfo) // 下载单个模块
也就是
new Print({moduleId: "#print-operate-report-wrapper",
           pageInfo: {
              defaultType: 'HEADER_TYPE',
              needTpl: true,
            },
          })
```

### 下载单个模块 - demo

```
<section>
  <!-- 页眉页脚模板 -->
  <pdf-tpl><pdf-tpl/>
  <!-- 正文部分用自定义id包裹 用以分页 -->
  <div id="print-operate-report" class="页面样式">
     <!-- ※必须※ node中会根据查询isPDFVisible是否存在来判断页面是否加载完毕 然后继续向下执行 -->
     <div v-if="isVisible" id="isPDFVisible"></div>
     <!-- 使用时，只要是待分页的模块都需要用page-splite-flag包裹起来 (table类型除外，参考下方) -->
     <div class="page-splite-flag 页面样式">XXXXX</div>
     <!-- 表格的包裹方式区别于其它 -->
     <card-table>
     		<template #card-table-header>
     			<!-- 若有表格标题部分 用#card-table-header包裹-->
     		</template>
     		<template #card-table>
     			<!-- table部分 用#card-table包裹-->
     			<ve-table XXXX  />
     		</template>
     </card-table>
  </div>
</section>
<script>
    import PDFTpl from '@/components/PDFTpl/index.vue'
    import CardTable from '@/components/CardTable'
    import { Print } from '@/modules/nb-fe-pdf/lib/index'

    data () {
      return {
        isResponseSuccess: true,
        isVisible: false,
      }
    },
    async mounted () {
      try {
        // 渲染页面的相关请求
        await 请求1 请求2....
      } catch (err) {
        // 有JS异常时将isResponseSuccess置为false
        this.isResponseSuccess = false
      } finally {
        if (this.isResponseSuccess) {
          this.handleGeneratePDF()
          setTimeout(() => {
            this.isVisible = true
          }, 600)
        }
      }
    }
    methods:  {
      handleGeneratePDF () {
        // 生成PDF相关
        new Print({
          moduleId: '#print-operate-report', // 自定义页面id
          pageInfo: {
            defaultType: 'HEADER_TYPE',  // 页眉页脚类型：HEADER_TYPE  有头无尾；NORMAL_TYPE 无头无尾；FOOTER_TYPE  无头有尾；HEADER_FOOTER_TYPE  有头有尾
            needTpl: true,
            waterMark: true, // 是否需要水印, 默认为false
            waterMarkConfig: {
              waterMarkContent: this.pra,
              waterMarkId: 'print-operate-report', //需要做水印的元素的id
            },
          },
        })
      }
    }
 </script>
 <style lang="css">
 @import 'nb-fe-pdf/print.css';
 </style>
```

```
// 写在公用方法中
export const  downloadPdf = (blobData, downloadFileName) => {
  const link = document.createElement('a')
  const url = window.URL.createObjectURL(
    new Blob([blobData], { type: "application/pdf,charset=utf-8" })
  )
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', downloadFileName)
  document.body.appendChild(link)
  link.click()
}

export const downLoadPdf = (
  params: object,
  onDownloadProgress: OnDownloadProgress // 可选
) => {
  return request.get(`/pdfUploadUrl?${qs.stringify(params)}`, {
    baseURL: "/amc-pdf-server/api/pdf/v1",
    timeout: 300000,
    responseType: "blob", // 一定要加
    onDownloadProgress,
  });
};
```

### 下载多个模块语法

```
new Print(PrintParmas)
也就是
new Print({ // 下载多个模块
  [selectModule],
  moduleMap,
  [injectClass],
  [callback: () =>{ console.log('分页算法执行完毕')}]
})
```

### 下载多个模块 demo

```
/**
 * string1: 组合名称1
 * string2: 组合名称1的页面的根元素id
*/
const moduleMap:Map<string1, string2> = new Map([
  [
    'analy'
    {
      moduleId: "#print-analy-wraper",
      pageInfo: {
        defaultType: PrintType.HEADER_TYPE,
        needTpl: true,
      },
    },
  ],
  [
    "pension",
    {
      moduleId: "#print-pension-wraper",
      pageInfo: {
        defaultType: PrintType.HEADER_TYPE,
        needTpl: true,
      },
    },
  ],
  [
    "base",
    {
      moduleId: "#print-base-wraper",
      pageInfo: {
        needTpl: true,
        defaultType: PrintType.HEADER_TYPE,
      },
    },
  ]);

const selectModule = ["family", "invest"]

const injectClass = {
  cardTableTBHeaderWraper: 've-table-header'
  cardElRowClass: 've-table-body-tr',
  elTableBodyWraper: 've-table-body'
}

/**
 * selectModule 当前要下载的页面组合名称
 * moduleMap 所有要下载的页面组合
 * injectClass
*/

new Print({ // 下载多个模块
  selectModule,
  moduleMap,
  injectClass,
  [callback: () =>{ console.log('分页算法执行完毕')}]
})
```

### 添加页眉、页脚、A4 大小图片

引入 css print css 样式 @import 'nb-fe-pdf/print.css';

```
pageInfo中的defaultType,有以下四种类型
export enum PrintType {
    NORMAL_TYPE = "NORMAL_TYPE", // 默认无头无尾
    HEADER_TYPE = "HEADER_TYPE", // 有头无尾
    FOOTER_TYPE = "FOOTER_TYPE", // 无头有尾
    HEADER_FOOTER_TYPE = "HEADER_FOOTER_TYPE", // 有头有尾
}

设置页面页脚优先级
元素class设置 PrintType > this.pageInfo.defaultType > PrintType.NORMAL_TYPE;

- 封面页设置
<planCover class="page-splite-flag FOOTER_TYPE"/>

- 根据PrintType，打印A4纸大小的图片
<img src="xx.png" class="print-img-wraper"/>
```

## 3.3 源码说明

- Print class
  - 根据传入的要打印的模块启动 dfs 搜索
- DfsChild class
  - 负责根据标识获取分页所需要的信息
- SplitePage class
  - 负责计算 pdf 分页和 table 分页
- PdfPage class
  - 负责生成每个 pdf 页面
- Compose class
  - 负责将每个 pdf 页面放到原来根元素的位置

## 3.4 使用 nb-fe-pdf 注意点

① 需要分页的原页面自定义样式要保证和 page-splite-flag 同级或在包裹内，table 类型同上，否则样式不生效
②page-splite-flag 之间不能嵌套
③ 如果分页出现切分异常的问题 ，可以检查原页面的自定义样式，不建议使用 margin 来设置竖向样式，例如 margin-top、margin-bottom 建议替换成 paddingXX。当然也可以使用 margin，但要保证用 BFC 解决外边距重叠问题

## 3.5 关于 nb-fe-pdf 常问的问题

### 为什么要在 dom 层做分页？

- 可选择的做分页的地方有：vdom 层、ast 层、真实 dom 层
- 如果在 vue/react 的 vdom 层做，由于不同的框架对 vdom 的处理方式不同，vue 用 tamplate 语法，是对组件做了依赖收集，经过 vdom diff,vdom patch，最终 vdom 和 dom 有对应关系;react 是 jsx 语法，fiber 结构的 vdom，分片渲染,最终 vdom 和 dom 有对应关系，但是结构不一样，无法复用算法，所以 pass；
- 在 ast 层做，不同框架用的 ast 解析器不一样，需要根据不同的解析器做计算，所以 pass；
- 真实 dom 层，不管是什么框架，最终渲染结果都是 dom，可以统一计算；

### 如此大量的操作 DOM 会有性能问题吗？比如频繁导致回流影响页面渲染？

- 只要操作 dom 元素的位置，肯定会产生回流的，主要是要将回流的次数控制在不影响页面加载的范围内；
- 在 nb-fe-pdf 对元素的操作是批量的，批量读取元素属性，批量 append 元素，并且这些元素在读取阶段，并没有放到浏览器渲染队列里面，只存储在内存中，在批量 append 元素完会统一放到渲染队列中，统一渲染，尽可能避免刷新渲染队列，以免频繁引起回流；
-

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b860b648afc849b4aafec02dc92fe6d3~tplv-k3u1fbpfcp-watermark.image?)

### 为什么要加类似 class="page-split-pdf" flag 标记，为什么标记不能嵌套？

- 利用 html 双标签的闭合关系可以确定一个区域，这个区域我们叫模块，可以将业务关系紧密的放在这个区域内
- 一个 flag 标记描述的是一个模块，会根据这个标记计算这个区域的高度（offsetHeight + marginTop + marginBottom）,如果 flag 标记存在嵌套关系，在计算的时候会重复计算，没有意义，会导致产生分页问题；

### 为什么上下相邻的模块，不建议上模块使用 marginBottom,下模块使用 marginTop 来控制模块之间的间距?

- 在标准文档流中，两个上下相邻的模块，如果上模块 marginBttom: 50px; 下模块 marginTop:50px,渲染结果这两个模块之间的上下距离是 50px，这就是 css 的 margin 塌陷问题，而根据 dfs 计算结果，他两个模块之间是 100px;
- margin-top、margin-bottom 建议替换成 paddingXX。当然也可以使用 margin，但要保证用 BFC 解决外边距重叠问题

### 下载 pdf 空白

1. 页面有权限，在 puppteer 访问路由的时候被拦截了
2. 请求是否添加 responseType: 'Blob'
3. 走内网的时候 需要配置 nginx 内网协议、内网 ip、内网端口
   - x-forwarded-proto （http、https、\$scheme）
   - x-forwarded-host (domain、ip:port、\$http_host)，如果配置成域名需要在 docker 容器中配置 hosts 解析到内网 IP。

### 分页不对

1.  margin 塌陷影响的
1.  table 分页有问题
    - 图 1 ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6808f0413d6c460989c732c5f84a4138~tplv-k3u1fbpfcp-zoom-1.image)
    - 图 2![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b6a4e08253e84be7b8e8cb2c184fb9c0~tplv-k3u1fbpfcp-watermark.image?)
    - 图 2 里面有红色标记的空白属于不正常的，原因是 ”vue-easytable“这个 ui 框架是通过行内样式来控制 table 高度的，正常应该是通过 table 中的内容来撑起来，写在行内的问题是会导致 deepClone 的时候会把这个行内样式也克隆一份，原 table 是 440，克隆 table 高度本来只有 200 多，由于行内样式设置了 height: 440px,导致克隆 table 高度也是 440px，就会有图 2 中的空白；
    - 处理方式：nb-fe-pdf 做了处理，会将行内 height 重置为：auto；
