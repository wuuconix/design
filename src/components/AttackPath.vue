<template>
  <div id="attackPath"></div>
</template>

<script setup lang="ts">
import go from "gojs/release/go-debug"
import { onMounted, watch } from "vue"
import modelJson from "../assets/attackPathModel.json"

const props = defineProps<{
  analyse: boolean,
  highlightKey: string,
  focus: boolean,
  opacity: number
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

let atp: go.Diagram
const $ = go.GraphObject.make

function init() {
  atp.undoManager.isEnabled = true
  atp.toolManager.hoverDelay = 100
  atp.toolManager.toolTipDuration = 100000
  atp.nodeTemplate = $(go.Node, "Auto",
    { locationSpot: go.Spot.Center },
    new go.Binding("location", "loc", go.Point.parse),
    props.focus ? new go.Binding("opacity", "isHighlighted", h => h ? 1 : props.opacity).ofObject() : {},
    $(go.Shape, "Rectangle", 
      new go.Binding("fill", "sorts", s => props.analyse && s[3] == 1 ? "#F9BCE0" : "#e3f0f5" ),
      new go.Binding("stroke", "isHighlighted", h => h ? "#409EFF" : "black").ofObject(),
      new go.Binding("strokeWidth", "isHighlighted", h => h ? 2 : 1).ofObject()
    ),
    $(go.TextBlock, 
      { margin: 5, textAlign: "center" },
      new go.Binding("text", "", n => `${n.index}: ${n.key}`)
    ),
    props.analyse ? {
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
    new go.Binding("points", "points"),
    new go.Binding("opacity", "", () => props.focus ? props.opacity : 1),
		$(go.Shape),
    $(go.Shape, { toArrow: "Standard" }),
  )
  atp.model = go.Model.fromJson(modelJson)
}

onMounted(() => {
  atp = new go.Diagram("attackPath")
  init()
  window.print = () => {
		console.log(JSON.stringify(JSON.parse(atp.model.toJson()), null, "\t"))
	}
})

function highlight(key: string) {
  atp.startTransaction("highlight")
  atp.clearHighlighteds()
  const node = atp.findNodeForKey(key)
  atp.highlight(node)
  atp.commitTransaction("highlight")
}

watch(
  () => props.highlightKey,
  (key) => highlight(key)
)

watch(
  () => props.focus,
  () => {
    atp.clear()
    init()
  }
)

watch(
  () => props.opacity,
  () => {
    if (props.focus) {
      atp.clear()
      init()
    }
  }
)

</script>
<style scoped>
</style>