**介绍**

生成一个完整的pdf需要用到pdf-page-split分页算法包，和pdf-server node服务。具体文档在`./docs里面`

 * pdf-page-split包主要负责对页面内容进行分页，添加页眉页脚，添加页码等。 详见=>  [快速上手]
 * pdf-server服务主要负责pdf的下载功能，详见 => [结合node服务下载pdf]

步骤1：安装pdf分页算法包
`npm install pdf-page-split`

步骤2：使用分页算法包
```javascript
import { Print } from 'pdf-page-split'
const keyList = ['fundProduct']
const printMap = new Map([
        [
          'fundProduct',
          {
            moduleId: '#fund-product-pdf', //这个要和上面的id对应上
            pageInfo: { needTpl: false, defaultType: 'HEADER_FOOTER_TYPE' }
          }
        ]
 ])
//方式1：此写法支持单模块下载和多模块下载
new Print({ selectModule: keyList, moduleMap: printMap })
//方式2：此写法仅支持单模块下载
new Print({
            moduleId: "#fund-product-pdf",
            pageInfo: {
              defaultType: 'HEADER_TYPE',
              needTpl: true,
            }
})


```
步骤3：启node服务下载pdf, 详见 => [结合node服务下载pdf]

详细使用 => [快速上手]