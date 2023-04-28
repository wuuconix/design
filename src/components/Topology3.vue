<template>
  <div id="topology"></div>
</template>

<script setup lang="ts">
import go from "gojs/release/go-debug"
import { onMounted, watch } from "vue"

const props = defineProps(['modelJson'])

function stringify(node) {
  let res = ""
  for (const key in node) {
    if ([ "key", "loc", "__gohashid", "category", "points", "from", "to", "img" ].includes(key)) {
      continue
    }
    res += `${key}: ${JSON.stringify(node[key]).replace(/"/g, "")}\n`
  }
  res = res.replace(/\n$/, "")
  return res
}

let topo: go.Diagram

onMounted(() => {
  const $ = go.GraphObject.make
  topo = new go.Diagram("topology")
  topo.undoManager.isEnabled = true
  topo.toolManager.hoverDelay = 100
  topo.toolManager.toolTipDuration = 100000
  topo.nodeTemplate =$(go.Node, "Auto",
    { locationSpot: go.Spot.Center },
    new go.Binding("location", "loc", go.Point.parse),
		$(go.Picture, new go.Binding("source", "img")),
    {
      toolTip: $("ToolTip", 
        $(go.TextBlock, { margin: 5 },
          new go.Binding("text", "", n => stringify(n))
        )
      )
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
    $(go.Shape, { toArrow: "Standard" }),
		{
      toolTip: $("ToolTip", 
        $(go.TextBlock, { margin: 5 },
          new go.Binding("text", "", n => stringify(n))
        )
      )
    }
  )
  topo.model = go.Model.fromJson(props.modelJson)
  window.print = () => {
		console.log(JSON.stringify(JSON.parse(topo.model.toJson()), null, "\t"))
	}
})

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