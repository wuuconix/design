<template>
  <div id="attackPath"></div>
</template>

<script setup lang="ts">
import go from "gojs/release/go-debug"
import { onMounted } from "vue"
import modelJson from "../assets/attackPathModel.json"

const { analyse } = defineProps<{
  analyse: boolean
}>()

function stringify(node) {
  let res = `--------------
攻击期望
exp: ${node.expectation}
--------------
节点加权中心性指标值
BC': ${node.centers[0]}
CC': ${node.centers[1]}
IEC: ${node.centers[2]}
--------------
节点排序结果
D+: ${node.sorts[0]}
D-: ${node.sorts[1]}
C:  ${node.sorts[2]}
排序: ${node.sorts[3]}
--------------`
  if (node.sorts[3] == 1) {
    res = "**关键节点**\n" + res
  }
  return res
}

onMounted(() => {
  const $ = go.GraphObject.make
  const atp = new go.Diagram("attackPath")
  atp.undoManager.isEnabled = true
  atp.toolManager.hoverDelay = 100
  atp.toolManager.toolTipDuration = 100000
  atp.nodeTemplate = $(go.Node, "Auto",
    { locationSpot: go.Spot.Center },
    new go.Binding("location", "loc", go.Point.parse),
    $(go.Shape, "Rectangle", new go.Binding("fill", "sorts", s => analyse && s[3] == 1 ? "#F9BCE0" : "#e3f0f5" )),
    $(go.TextBlock, 
      { margin: 5, textAlign: "center" },
      new go.Binding("text", "", n => `${n.index}: ${n.key}`)
    ),
    analyse ? {
      toolTip: $("ToolTip", 
        $(go.TextBlock, { margin: 5 },
          new go.Binding("text", "", n => stringify(n))
        )
      )
    } : {}
  )
  atp.linkTemplate = $(go.Link,
    {
      curve: go.Link.Bezier,
      adjusting: go.Link.Scale,
      reshapable: true, relinkableFrom: true, relinkableTo: true,
    },
		$(go.Shape),
    $(go.Shape, { toArrow: "Standard" }),
    new go.Binding("points", "points")
  )
  atp.model = go.Model.fromJson(modelJson)
  window.print = () => {
		console.log(JSON.stringify(JSON.parse(atp.model.toJson()), null, "\t"))
	}
})

</script>
<style scoped>
</style>