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
        <el-aside :width="asideWidth" v-if="['3-1', '3-2'].includes(activeIndex)">
          <p style="font-weight: bold">选择删除主机/脆弱性/可达性关系以更新拓扑图</p>
          <el-cascader-panel :options="cascaderOptions" v-model="cascaderValue" @change="handleCasCaderChange"/>
          <el-row class="btn">
            <el-button type="danger" round @click="changeModel">删除并更新拓扑图</el-button>
            <el-button type="primary" round @click="revertModel">还原拓扑图</el-button>
          </el-row>
        </el-aside>
        <el-main>
          <Topology1 class="display" v-if="activeIndex == '1-1'" />
          <Topology2 class="display" v-if="['1-2', '2-1', '4-1'].includes(activeIndex)" />
          <Topology3 class="display" v-if="['1-3', '3-1'].includes(activeIndex)" :model-json="topology3ModelJsonReactive"/>
          <AttackPath class="display" v-if="['2-2', '4-2'].includes(activeIndex)" :analyse="activeIndex == '4-2'" />
          <AttackGraph class="display" v-if="activeIndex == '3-2'" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, reactive } from 'vue'
import Topology1 from './components/Topology1.vue'
import Topology2 from './components/Topology2.vue'
import Topology3 from './components/Topology3.vue'
import AttackPath from './components/AttackPath.vue'
import AttackGraph from './components/AttackGraph.vue'
import topology3ModelJson from "./assets/topology3Model.json"

let topology3ModelJsonReactive: typeof topology3ModelJson = reactive(JSON.parse(JSON.stringify(topology3ModelJson)))
const activeIndex = ref('3-1')
const cascaderValue = ref('')
const asideWidth = computed(() => {
  return activeIndex.value == '3-1' ? "30vw" : "10vw"
})

const cascaderOptions = [
  {
    value: "host",
    label: "选择删除一个主机",
    children: [
      {
        value: "host0",
        label: "主机0"
      },
      {
        value: "host1",
        label: "主机1"
      },
      {
        value: "host2",
        label: "主机2"
      },
      {
        value: "host3",
        label: "主机3"
      }
    ],
  },
  {
    value: "vul",
    label: "选择删除一个脆弱性",
    children: [
      {
        value: "host0",
        label: "主机0的脆弱性",
        children: [
          {
            value: "iis_bufferflow",
            label: "iis_bufferflow"
          }
        ]
      },
      {
        value: "host1",
        label: "主机1的脆弱性",
        children: [
          {
            value: "ftp_rhost",
            label: "ftp_rhost"
          },          {
            value: "ssh_bufferflow",
            label: "ssh_bufferflow"
          },
          {
            value: "rsh_login",
            label: "rsh_login"
          }
        ]
      },
      {
        value: "host2",
        label: "主机2的脆弱性",
        children: [
          {
            value: "netbios_nullsession",
            label: "netbios_nullsession"
          },          {
            value: "rsh_login",
            label: "rsh_login"
          }
        ]
      },
      {
        value: "host3",
        label: "主机3的脆弱性",
        children: [
          {
            value: "squid_port_scan",
            label: "squid_port_scan"
          },          {
            value: "licq_remote_to_user",
            label: "licq_remote_to_user"
          },
          {
            value: "local_setuid_bufferflow",
            label: "local_setuid_bufferflow"
          }
        ]
      }
    ]
  },
  {
    value: "connection",
    label: "选择删除一个可达性关系信息",
    children: [
      {
        value: "host0",
        label: "主机0的可达性关系",
        children: [
          {
            value: "01",
            label: "host0 -> host1"
          },
          {
            value: "02",
            label: "host0 -> host2"
          },
          {
            value: "03",
            label: "host0 -> host3"
          }
        ]
      },
      {
        value: "host1",
        label: "主机1的可达性关系",
        children: [
          {
            value: "12",
            label: "host1 -> host2"
          },
          {
            value: "13",
            label: "host1 -> host3"
          }
        ]
      },
      {
        value: "host2",
        label: "主机2的可达性关系",
        children: [
          {
            value: "21",
            label: "host2 -> host1"
          },
          {
            value: "23",
            label: "host2 -> host3"
          }
        ]
      },
      {
        value: "host3",
        label: "主机3的可达性关系",
        children: [
          {
            value: "33",
            label: "host3 -> host3"
          }
        ]
      },
    ]
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
  }
  // topology3ModelJsonReactive.nodeDataArray.splice(1, 1)
  // console.log(topology3ModelJsonReactive.nodeDataArray)
}

async function revertModel() {
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
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
}
</style>
