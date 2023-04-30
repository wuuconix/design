<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
        >
          <el-sub-menu index="1">
            <template #title>系统拓扑</template>
            <el-menu-item index="1-1">流程工业拓扑图1</el-menu-item>
            <el-menu-item index="1-2">流程工业拓扑图2</el-menu-item>
            <el-menu-item index="1-3">Test-Net拓扑图</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="2">
            <template #title>攻击路径规划</template>
            <el-menu-item index="2-1">拓扑展示</el-menu-item>
            <el-menu-item index="2-2">攻击路径图</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="3">
            <template #title>攻击路径局部更新</template>
            <el-menu-item index="3-1">拓扑展示</el-menu-item>
            <el-menu-item index="3-2">属性攻击图</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="4">
            <template #title>关键攻击步骤识别</template>
            <el-menu-item index="4-1">拓扑展示</el-menu-item>
            <el-menu-item index="4-2">攻击步骤图</el-menu-item>
          </el-sub-menu>
          <el-menu-item index="5">算法性能</el-menu-item>
          <el-menu-item index="6">数据管理</el-menu-item>
        </el-menu>
      </el-header>
      <el-container class="body">
        <el-aside width="35vw" v-if="activeIndex == '3-1'">
          <p style="font-weight: bold">选择删除主机/脆弱性/可达性关系以更新拓扑图</p>
          <el-cascader-panel :options="cascaderOptions" v-model="cascaderValue" @change="handleCasCaderChange"/>
          <el-row class="btn">
            <el-button type="danger" round @click="changeModel">删除并更新拓扑图</el-button>
            <el-button type="primary" round @click="revertModel">还原拓扑图</el-button>
          </el-row>
        </el-aside>
        <el-aside width="10vw" v-if="activeIndex == '3-2'" style="justify-content: center;">
          <p style="font-weight: bold;">根据拓扑图更新属性攻击图</p>
          <el-row class="btn">
            <el-button type="success" round @click="isGraphUpdate = true">更新</el-button>
            <el-button type="primary" round @click="isGraphUpdate = false">还原</el-button>
          </el-row>
        </el-aside>
        <el-aside width="30vw" v-if="activeIndex == '4-2'"  style="justify-content: center;">
          <el-row>
            <el-select v-model="yName" class="m-2">
              <el-option
                v-for="item in centerYnameOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-select v-model="sort" class="m-2">
              <el-option
                v-for="item in centerSortOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-row>
          <el-row style="width: 100%;">
            <Chart2 style="height: 300px; width: 100%;" :sort="sort" :y-name="yName" @highlight="(key) => highlightKey = key" />
          </el-row>
          <el-row>
            <el-alert
              title="Tips"
              type="info"
              description="点击柱状图的柱子可以高亮显示攻击路径图对应节点"
              show-icon
              style="margin-bottom: 12px;"
              :closable="false"
            />
          </el-row>
          <el-row>
            <el-form-item label="突出显示所选节点&淡化其他节点">
              <el-switch
                v-model="focus"
                class="mt-2"
                style="margin-left: 24px"
                inline-prompt
                :active-icon="Check"
                :inactive-icon="Close"
              />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="非高亮节点透明度">
              <el-slider v-model="opacity" :format-tooltip="(num: number) => num / 100" />
            </el-form-item>
          </el-row>
          <el-row>
            <el-button type="primary" plain @click="highlightKey = ''">清除攻击步骤图中的高亮</el-button>
          </el-row>
        </el-aside>
        <el-main>
          <Topology1 class="display" v-if="activeIndex == '1-1'" />
          <Topology2 class="display" v-if="['1-2', '2-1', '4-1'].includes(activeIndex)" />
          <Topology3 class="display" v-if="['1-3', '3-1'].includes(activeIndex)" :model-json="topology3ModelJsonReactive"/>
          <AttackPath
            class="display" 
            v-if="['2-2', '4-2'].includes(activeIndex)" 
            :analyse="activeIndex == '4-2'" 
            :highlight-key="highlightKey"
            :focus="focus"
            :opacity="opacity / 100"
          />
          <AttackGraph class="display" v-if="activeIndex == '3-2'" :update="isGraphUpdate"/>
          <div class="charts" v-if="activeIndex == '5'">
            <Chart class="display" :chart-num="'chart1'" :y-name="'real_time'" />
            <Chart class="display" :chart-num="'chart1'" :y-name="'max_mem'" />
            <Chart class="display" :chart-num="'chart2'" :y-name="'real_time'" />
            <Chart class="display" :chart-num="'chart2'" :y-name="'max_mem'" />
          </div>
          <ModelJsonViewer class="display" v-if="activeIndex == '6'"/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import Topology1 from './components/Topology1.vue'
import Topology2 from './components/Topology2.vue'
import Topology3 from './components/Topology3.vue'
import AttackPath from './components/AttackPath.vue'
import AttackGraph from './components/AttackGraph.vue'
import Chart from './components/Chart.vue'
import Chart2 from './components/Chart2.vue'
import topology3ModelJson from "./assets/topology3Model.json"
import cascaderOptions from "./assets/cascaderOptions.json"
import topology3ServiceVulMap from "./assets/topology3ServiceVulMap.json"
import ModelJsonViewer from './components/ModelJsonViewer.vue'
import { Check, Close } from '@element-plus/icons-vue'

let topology3ModelJsonReactive: typeof topology3ModelJson = reactive(JSON.parse(JSON.stringify(topology3ModelJson)))
const activeIndex = ref('3-1')
const cascaderValue = ref('')
const isGraphUpdate = ref(false)
const highlightKey = ref('')
const yName = ref("C")
const sort = ref("desc")
const focus = ref(false)
const opacity = ref(30)

const centerYnameOptions = [
	{
		value: "BC'",
		label: "BC' 介数中心性",
	},
	{
		value: "CC'",
		label: "CC' 接近中心性"
	},
	{
		value: "IEC",
		label: "IEC 边期望中心性"
	},
	{
		value: "deg",
		label: "deg 度中心性"
	},
  {
    value: "D+",
    label: "D+ 与理想点间的距离"
  },
  {
    value: "D-",
    label: "D- 与负理想点间的距离"
  },
  {
    value: "C",
    label: "C 最终量化数值"
  }
]

const centerSortOptions = [
  {
    value: "none",
    label: "不排序"
  },
  {
    value: "asc",
    label: "正序"
  },
  {
    value: "desc",
    label: "倒序"
  }
]
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
  activeIndex.value = key
}
const handleCasCaderChange = (value: string) => {
  console.log(value)
  cascaderValue.value = value
}

function changeModel() {
  console.log(cascaderValue.value)
  const select = cascaderValue.value
  if (select[0] == "host") {
    const targetHost = select[1]
    topology3ModelJsonReactive.nodeDataArray = topology3ModelJsonReactive.nodeDataArray.filter(v => v.host_name != targetHost)
    topology3ModelJsonReactive.linkDataArray = topology3ModelJsonReactive.linkDataArray.filter(v => v.from != targetHost && v.to != targetHost)
  } else if (select[0] == "vul") {
    const targetHost = select[1]
    const targetVul = select[2]
    const nodeData = topology3ModelJsonReactive.nodeDataArray.find(v => v.host_name == targetHost)
    nodeData!.vuls = nodeData!.vuls.filter(vul => vul != targetVul)
    topology3ModelJsonReactive.linkDataArray = topology3ModelJsonReactive.linkDataArray.filter(v => v.to != targetHost || !v.condition.includes(topology3ServiceVulMap[targetVul]))
  } else if (select[0] == "connection") {
    const fromHost = select[1]
    const toHost = select[2]
    topology3ModelJsonReactive.linkDataArray = topology3ModelJsonReactive.linkDataArray.filter(v => v.from != fromHost || v.to != toHost)
  }
  // topology3ModelJsonReactive.nodeDataArray.splice(1, 1)
  // console.log(topology3ModelJsonReactive.nodeDataArray)
}

function revertModel() {
  Object.assign(topology3ModelJsonReactive, topology3ModelJson)
}

</script>

<style scoped>
.display {
  height: 100%;
}
.el-aside, .el-main {
  height: calc(100vh - 60px);
}

.el-aside {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;
}

div.charts {
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: space-between;
  flex-wrap: wrap;
}

div.charts > div {
  width: 50%;
  height: 50%;
}

.el-slider {
  width: 250px;
}
</style>
