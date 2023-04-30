<template>
  <el-container class="body">
    <el-aside width="35vw">
      <el-form-item label="模型">
        <el-select v-model="modelJsonSelectValue" placeholder="Select">
          <el-option-group
            v-for="group in modelSelectOptions"
            :key="group.label"
            :label="group.label"
          >
            <el-option
              v-for="item in group.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item label="展开的深度">
        <el-input-number v-model="expandDepth" />
      </el-form-item>
      <el-form-item label="显示折叠图标">
        <el-switch
          v-model="showIcon"
          class="mb-2"
          :active-icon="Check"
          :inactive-icon="Close"
          inline-prompt
        />
      </el-form-item>
      <el-form-item label="显示行号">
        <el-switch
          v-model="showLineNumber"
          class="mb-2"
          :active-icon="Check"
          :inactive-icon="Close"
          inline-prompt
        />
      </el-form-item>
      <el-button type="primary" plain @click="download">下载模型JSON数据</el-button>
    </el-aside>
    <el-main>
      <vue-json-pretty :data="jsonViewerValue" :deep="expandDepth" copyable :showLineNumber="showLineNumber" :showIcon="showIcon"/>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import topology1ModelJson from "../assets/topology1Model.json"
import topology2ModelJson from "../assets/topology2Model.json"
import topology3ModelJson from "../assets/topology3Model.json"
import modelSelectOptions from "../assets/modelSelectOptions.json"
import attackPathModelJson from "../assets/attackPathModel.json"
import attackGraphModelJson from "../assets/attackGraphModel.json"
import attackGraphUpdateModelJson from "../assets/attackGraphUpdateModel.json"
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'
import { Check, Close } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const modelJsonSelectValue = ref("topology1Model")
const expandDepth = ref(3)
const showLineNumber = ref(true)
const showIcon = ref(true)

const jsonViewerValueMap = {
  "topology1Model": topology1ModelJson,
  "topology2Model": topology2ModelJson,
  "topology3Model": topology3ModelJson,
  "attackPathModel": attackPathModelJson,
  "attackGraphModel": attackGraphModelJson,
  "attackGraphUpdateModel": attackGraphUpdateModelJson
}

const jsonViewerValue = computed(() => {
  // @ts-ignore 没有写modelJsonSelectValue的类型
  return jsonViewerValueMap[modelJsonSelectValue.value]
})

function download() {
  // @ts-ignore 同上
  const json = JSON.stringify(jsonViewerValueMap[modelJsonSelectValue.value], null, "\t")
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
  link.setAttribute("download", `${modelJsonSelectValue.value}.json`)
  link.click()
  window.URL.revokeObjectURL(link.href)
}
</script>

<style scoped>
.el-aside {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>