<template>
  <el-container class="body">
    <el-aside width="35vw">
      <el-form-item label="数据">
        <el-select v-model="type" placeholder="Select" @change="handleSelectChange">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-button type="primary" plain @click="download">下载对应模型JSON数据</el-button>
    </el-aside>
    <el-main>
      <el-table :data="slicedTableData" style="width: 100%" stripe border>
        <el-table-column prop="id" label="编号" />
        <el-table-column v-if="type=='topology'" prop="name" label="主机名" />
        <el-table-column v-if="type=='topology'" prop="service" label="服务" />
        <el-table-column v-if="type=='topology'" prop="vul" label="漏洞" />
        <el-table-column v-if="type=='topology'" prop="conn" label="可达性连接节点" />
        <el-table-column v-if="type=='attackPath'" prop="atpName" label="攻击步骤名" />
        <el-table-column v-if="type=='attackPath'" prop="path" label="攻击路径图中邻接边" />
        <el-table-column v-if="type=='attackGraph'" prop="atgName" label="节点名称" />
        <el-table-column v-if="type=='attackGraph'" prop="type" label="节点类型" />
      </el-table>
      <el-pagination background layout="prev, pager, next" hide-on-single-page
        :page-size="11"
        :total="tableData.length"
        v-model:current-page="currentPage"
      />
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import topology2ModelJson from "../assets/topology2Model.json"
import attackPathModelJson from "../assets/attackPathModel.json"
import attackGraphModelJson from "../assets/attackGraphModel.json"
import options from "../assets/modelSelectOptions.json"
import { ref, onMounted, reactive, watch } from "vue"
import { ElMessage } from 'element-plus'

const type = ref("topology")
const tableData = reactive([])
const slicedTableData = reactive([])
const currentPage = ref(1)
//@ts-ignore
const jsonDataMap = new Map([
  ["topology", topology2ModelJson],
  ["attackPath", attackPathModelJson],
  ["ataackGraph", attackGraphModelJson]
])

function handleSelectChange(type: string) {
  if (type == "topology") {
    getTopologyTableData()
  } else if (type == "attackPath") {
    getAttackPathTableData()
  } else {
    getAttackGraphTableData()
  }
  slicedTableData.length = 0
  const index = 11 * (currentPage.value - 1)
  Object.assign(slicedTableData, tableData.slice(index, index + 11))
}

function getTopologyTableData() {
  tableData.length = 0
  let index = 0
  const map = new Map()
  for (const link of topology2ModelJson.linkDataArray) {
    if (!map.has((link.from))) {
      map.set(link.from, [link.to])
    } else {
      map.get(link.from).push(link.to)
    }
  }
  for (const node of topology2ModelJson.nodeDataArray) {
    // @ts-ignore
    tableData.push({
      id: index++,
      name: node.key,
      service: node.service.join("\n"),
      vul: node.vuls.join("\n"),
      conn: map.get(node.key)?.join("\n") ?? ""
    })
  }
}

function getAttackPathTableData() {
  tableData.length = 0
  const map = new Map()
  const indexMap = new Map()
  for (const link of attackPathModelJson.linkDataArray) {
    if (!map.has((link.from))) {
      map.set(link.from, [link.to])
    } else {
      map.get(link.from).push(link.to)
    }
  }
  for (const node of attackPathModelJson.nodeDataArray) {
    indexMap.set(node.key, node.index)
  }
  for (const node of attackPathModelJson.nodeDataArray) {
    // @ts-ignore
    tableData.push({
      id: node.index,
      atpName: node.key,
      path: map.get(node.key)?.reduce((prev, cur) => {
        return prev + `${node.index}->${indexMap.get(cur)}` + "\n"
      }, "") ?? ""
    })
  }
}

function getAttackGraphTableData() {
  tableData.length = 0
  let index = 0
  for (const node of attackGraphModelJson.nodeDataArray) {
    // @ts-ignore
    tableData.push({
      id: index++,
      atgName: node.key,
      type: node.type
    })
  }
}

function download() {
  // @ts-ignore 同上
  const json = JSON.stringify(jsonDataMap.get(type.value), null, "\t")
  const blob = new Blob([json], {
    type: "application/json"
  })
  const objectURL = URL.createObjectURL(blob)
  ElMessage({
    message: '模型数据准备完成 即将开始下载!',
    type: 'success',
  })
  const link = document.createElement("a")
  link.href = objectURL
  link.setAttribute("download", `${type.value}.json`)
  link.click()
  window.URL.revokeObjectURL(link.href)
}

onMounted(() => {
  getTopologyTableData()
  slicedTableData.length = 0
  Object.assign(slicedTableData, tableData.slice(0, 11))
})
watch(currentPage, (v) => {
  const index = 11 * (v - 1)
  slicedTableData.length = 0
  Object.assign(slicedTableData, tableData.slice(index, index + 11))
})
</script>

<style scoped>
.el-aside {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
::v-deep(.el-table .cell){
  white-space: pre-line;
}
::v-deep(.el-table__row) {
  height: 64px;
}
.el-pagination {
  position: absolute;
  bottom: 20px;
}
</style>