<template>
  <div id="attackPath"></div>
</template>

<script setup lang="ts">
import go from "gojs/release/go-debug"
import { onMounted } from "vue"
import attackPath from "../assets/attackPath2WithLoc.json"

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
      new go.Binding("text", "key")
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
  const nodeDataArray = []
  const linkDataArray = []
	for (let i = 0; i < attackPath.nodes.length; i++) {
    nodeDataArray.push({ key: attackPath.nodes[i], loc: attackPath.locs[i], centers: attackPath.centers[i], sorts: attackPath.sorts[i], expectation: attackPath.expectations[i] })
	}
  for (let edge of attackPath.edges) {
    linkDataArray.push({ from: edge.source, to: edge.target, ...edge })
  }
  atp.model = new go.GraphLinksModel(nodeDataArray, linkDataArray)
})

</script>
<style scoped>
</style>