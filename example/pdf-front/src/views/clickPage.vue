<template>
  <div class="home">
    <!-- 页眉页脚 -->
    <pdf-tpl></pdf-tpl>
    <step :percentage="percentage" :active="active" :show="show" />
    <!-- 正文部分用自定义id包裹 用以分页 -->
    <div id="print-operate-report">
      <print />
      <!-- ※必须※ node中会根据查询isPDFVisible是否存在来判断页面是否加载完毕 然后继续向下执行 -->
      <div v-if="isVisible" id="isPDFVisible"></div>
    </div>

    <el-button style="position: fixed; top: 20px; right: 20px;" type="button"
      class="el-button el-button--default el-button--small el-button--primary" @click="onClickDownload">
      window.print 纯前端 点击下载
    </el-button>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import pdfTpl from './pdfTpl/index.vue'
import print from './print.vue'
// import { Print } from 'pdf-page-split'
import { Print } from '../../../../index'
import downloadMixins from './downloadMixins'
import step from './step/index.vue'

@Component({
  name: 'clickPage',
  components: {
    print,
    pdfTpl,
    step,
  },
})
export default class extends mixins(downloadMixins) {
  isVisible = false
  islocal = true
  isResponseSuccess = true
  show = 0
  active = 0
  percentage = 0

  serverDownload() {
    this.islocal = false
    try {
      // 渲染页面的相关请求
      // await 请求1 请求2....
    } catch (err) {
      // 有JS异常时将isResponseSuccess置为false
      this.isResponseSuccess = false
    } finally {
      if (this.isResponseSuccess) {
        // this.onDownload()
      }
    }
  }

  onClickDownload() {
    this.islocal = true
    this.onDownload()
  }

  onDownload() {
    setTimeout(() => {
      this.handleGeneratePDF()
      setTimeout(() => {
        this.isVisible = true
        if (this.islocal) {
          window.print()
        }
      }, 600)
    }, 500)
  }

  handleGeneratePDF() {
    // 生成PDF相关
    new Print({
      // @ts-ignore
      moduleId: '#print-operate-report', // 自定义页面id
      pageInfo: {
        defaultType: 'HEADER_TYPE', // 页眉页脚类型：HEADER_TYPE  有头无尾；NORMAL_TYPE 无头无尾；FOOTER_TYPE  无头有尾；HEADER_FOOTER_TYPE  有头有尾
        needTpl: true,
        waterMark: false, // 是否需要水印, 默认为false
        waterMarkConfig: {
          waterMarkContent: '前端大喜子-droden',
          waterMarkId: 'print-operate-report', //需要做水印的元素的id
        },
      },
    })
    setTimeout(() => {
      this.isVisible = true
    }, 3000)
  }
}
</script>
<style>
@import 'pdf-page-split/print.css';
</style>
