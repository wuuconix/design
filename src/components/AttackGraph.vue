<template>
  <div id="attackGraph"></div>
</template>

<script setup lang="ts">
import go from "gojs/release/go-debug"
import { onMounted, watch } from "vue"
import modelJson from "../assets/attackGraphModel.json"
import updateModelJson from "../assets/attackGraphUpdateModel.json"

const props = defineProps<{
  update: boolean
}>()

function stringify(node) {
  return `--------------
类型:

${node.type}

--------------`
}

onMounted(() => {
  const $ = go.GraphObject.make
  const atg = new go.Diagram("attackGraph", {
    initialAutoScale: go.Diagram.Uniform
  })
  atg.undoManager.isEnabled = true
  atg.toolManager.hoverDelay = 100
  atg.toolManager.toolTipDuration = 100000
  atg.nodeTemplate = $(go.Node, "Auto",
    { locationSpot: go.Spot.Center },
    new go.Binding("location", "loc", go.Point.parse),
    $(go.Shape, "Rectangle",
      new go.Binding("strokeDashArray", "dotted", d => d ? [5, 5] : null),
      new go.Binding("stroke", "dotted", d => d ? "red" : null),
      new go.Binding("fill", "type", t => t == "vulnerability" ? "#e3f0f5" : "white")
    ),
    $(go.TextBlock, 
      { margin: 5, textAlign: "center" },
      new go.Binding("text", "key")
    ),
    {
      toolTip: $("ToolTip", 
      $(go.TextBlock, { margin: 5, font: '16px Times New Roman 宋体' },
        new go.Binding("text", "", n => stringify(n))
      )
      )
    }
  )
  atg.linkTemplate = $(go.Link,
    {
      curve: go.Link.Bezier,
      adjusting: go.Link.Scale,
      reshapable: true, relinkableFrom: true, relinkableTo: true,
    },
    new go.Binding("points", "points"),
    $(go.Shape,
      new go.Binding("strokeDashArray", "dotted", d => d ? [5, 5] : null),
      new go.Binding("stroke", "dotted", d => d ? "red" : null)
    ),
    $(go.Shape, { toArrow: "Standard" },
      new go.Binding("fill", "dotted", d => d ? "red" : null),
      new go.Binding("stroke", "dotted", d => d ? "red" : null)
    )
  )
  atg.model = go.Model.fromJson(modelJson)
  window.print = () => {
		console.log(JSON.stringify(JSON.parse(atg.model.toJson()), null, "\t"))
	}
  watch(
    () => props.update,
    (update => {
      atg.model = go.Model.fromJson(update ?  updateModelJson : modelJson)
    })
  )
})

</script>
<style scoped>
</style>