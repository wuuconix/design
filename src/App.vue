<template>
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
  <Topology1 class="display" v-if="activeIndex == '1-1'" />
  <Topology2 class="display" v-if="['1-2', '2-1', '4-1'].includes(activeIndex)" />
  <Topology3 class="display" v-if="['1-3', '3-1'].includes(activeIndex)" />
  <AttackPath class="display" v-if="['2-2', '4-2'].includes(activeIndex)" :analyse="activeIndex == '4-2'" />
  <AttackGraph class="display" v-if="activeIndex == '3-2'" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Topology1 from './components/Topology1.vue'
import Topology2 from './components/Topology2.vue'
import Topology3 from './components/Topology3.vue'
import AttackPath from './components/AttackPath.vue'
import AttackGraph from './components/AttackGraph.vue'

const activeIndex = ref('1-1')
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
  activeIndex.value = key
}
</script>

<style scoped>
.display {
  height: calc(100vh - 59px)
}
</style>
