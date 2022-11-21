<template>
  <el-table :data="tableData" :span-method="objectSpanMethod" border style="width: 100%; margin-top: 20px">
    <el-table-column prop="name" width="100" label="姓名">
    </el-table-column>
    <el-table-column prop="address" width="200" label="数值 2（元）">
    </el-table-column>
    <el-table-column prop="age" label="数值 2（元）">
    </el-table-column>
  </el-table>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

const num = 120 + Math.ceil(Math.random() * 50)
const data: any = []

@Component({
  name: 'ts-table',
})
export default class extends Vue {
  tableData: any = []
  //@ts-ignore
  objectSpanMethod({ row, column, rowIndex, columnIndex }) {
    if (columnIndex === 0) {
      if (rowIndex % 5 === 0) {
        return {
          rowspan: 5,
          colspan: 1
        };
      } else {
        return {
          rowspan: 0,
          colspan: 0
        };
      }
    }
  }
  mounted() {
    let data = []
    for (let i = 0; i < num; i++) {
      data.push({
        name: '王小虎 - ' + (i + 1),
        address: `金沙江路${i + 1}弄`,
        age: '年龄:' + (i + 1)
      })
    }

    this.tableData = data
  }
}
</script>
<style lang="scss" scoped>

</style>
