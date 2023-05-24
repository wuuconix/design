<template>
  <div id="topology"></div>
</template>

<script setup lang="ts">
import go from "gojs/release/go-debug"
import modelJson from "../assets/topology2Model.json"
import { onMounted, watch } from "vue"

const emit = defineEmits(['updateCVSSInfo'])
// @ts-ignore
const props = defineProps<{
  isCVSS: boolean
  modelJson: any
}>()

const cvssFullNameMap = {
  AV: {
    self: "Attack Vector (AV)",
    N: "Network (N)",
    A: "Adjacent (A)",
    L: "Local (L)",
    P: "Physical (P)"
  },
  UI: {
    self: "User Interaction (UI)",
    N: "None (N)",
    R: "Required (R)"
  },
  C: {
    self: "Confidentiality (C)",
    N: "None (N)",
    L: "Low (L)",
    H: "High (H)"
  },
  I: {
    self: "Integrity (I)",
    N: "None (N)",
    L: "Low (L)",
    H: "High (H)"
  },
  A: {
    self: "Availability (A)",
    N: "None (N)",
    L: "Low (L)",
    H: "High (H)"
  },
  E: {
    self: "Exploit Way (E)",
    N: "None (N)",
    T: "Tool (T)",
    P: "POC (P)",
  }
}

const vulI18nMap = {
  "Print_Improper_Privilege_Management": "打印机不当权限管理",
  "DNS_Remote_Code_Execution": "DNS远程命令执行",
  "OPC_Improper_Authentication": "OPC不当鉴权",
  "OPC_Heap_Bufferflow": "OPC堆溢出",
  "Oracle_Out_of_bounds_Write": "Oracle越界写入",
  "HMI_Improper_Access_Control": "HMI不当访问控制",
  "Improper_File_Access": "不当文件访问",
  "Deserialization_of_Untrusted_Data": "不可信数据反序列化",
  "PLC_Weak_Password_Recovery": "PLC弱密码恢复",
  "Improper_Check": "不当检查",
  "Modbus_Lack_of_Authentication": "Modbus缺少鉴权",
  "Open_Close_Change": "开关状态改变",
  "Abnormal_Operation": "执行异常",
  "Deviation_Setpoint": "设定点偏差",
  "Abnormal_Show": "示数无效"
}

const hostNameI18Map = {
  "Attacker": "攻击者",
  "WS": "工作站",
  "DNS": "DNS服务器",
  "OPC": "OPC服务器",
  "Historian": "历史数据库",
  "HMI": "人机界面HMI",
  "EWS": "工程师站",
  "PLC1": "控制器PLC1",
  "PLC2": "控制器PLC2",
  "Valve": "阀门",
  "Reactor": "反应釜",
  "Sensor": "传感器"
}

function stringify(node) {
  if (props.isCVSS) {
    return `--------------
脆弱性名称/功能故障:

${vulsToString(node)}

--------------
指标:

${impactsToString(node)}

--------------`
  } else {
    return `--------------
主机:

${node.key}

--------------
服务:

${servicesToString(node)}

--------------
脆弱性:

${vulsToString(node)}

--------------`
  }
}

function vulsToString(node: typeof modelJson.nodeDataArray[0]) {
  let str = node.vuls.join("\n")
  return str == "" ? "无" : str
}

function servicesToString(node: typeof modelJson.nodeDataArray[0]) {
  let str = node.service.join("\n")
  return str == "" ? "无" : str
}

function impactsToString(node: typeof modelJson.nodeDataArray[0]) {
  let str = node.impacts?.join("\n") ?? ""
  return str == "" ? "无" : str
}

let topo: go.Diagram

onMounted(() => {
  const $ = go.GraphObject.make
  topo = new go.Diagram("topology")
  topo.undoManager.isEnabled = true
  topo.toolManager.hoverDelay = 100
  topo.toolManager.toolTipDuration = 100000
  topo.nodeTemplate = $(go.Node, "Vertical",
    { locationSpot: go.Spot.Center },
    new go.Binding("location", "loc", go.Point.parse),
    $(go.Picture, 
      {
        source: "https://upyun.wuuconix.link/image-attacker.png",
        width: 100,
        height: 100,
        imageStretch: go.GraphObject.Uniform 
      },
      new go.Binding("source", "img")
    ),
    $(go.TextBlock, 
      { margin: new go.Margin(10, 0, 0, 0) },
      new go.Binding("text", "key", (key) => hostNameI18Map[key])
    ),
    {
      toolTip: $("ToolTip", 
        $(go.TextBlock, { margin: 5, font: '16px Times New Roman 宋体' },
          new go.Binding("text", "", n => stringify(n))
        )
      )
    },
    { 
      click: (_, obj) => {
      const data = getCVSSInfo(obj.part!.data)
      emit("updateCVSSInfo", data)
      console.log("emit 成功")
     }
    }
  )
  topo.linkTemplate = $(go.Link,
    {
      curve: go.Link.Bezier,
      adjusting: go.Link.Scale,
      reshapable: true, relinkableFrom: true, relinkableTo: true
    },
    new go.Binding("points", "points"),
    $(go.Shape),
    $(go.Shape, { toArrow: "Standard" })
  )
  topo.model = go.Model.fromJson(modelJson)
  window.print = () => {
		console.log(JSON.stringify(JSON.parse(topo.model.toJson()), null, "\t"))
	}
})


function getCVSSInfo(data: typeof modelJson.nodeDataArray[1]) {
  const result = []
  if (!data.impacts) {
    return {
      vul: {},
      cvss: {}
    }
  }
  for (let i = 0; i < data.impacts!.length; i++) {
    const temp = {
      vul: {},
      cvss: {}
    }
    const impact = data.impacts![i]
    impact.split("/").forEach(kv => {
      const [k, v] = kv.split(":")
      //@ts-ignore
      temp.cvss[cvssFullNameMap[k].self] = cvssFullNameMap[k][v]
    })
    //@ts-ignore
    temp.vul.en = data.vuls[i]
    // temp.vul.cn = 
    result.push(temp)
  }
  return result
}

watch(
  () => props.modelJson,
  (newModelJson, _) => {
    console.log("newModelJson detected")
    topo.model = go.Model.fromJson(newModelJson)
  },
  {
    deep: true
  }
)
</script>
<style scoped>
</style>