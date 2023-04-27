<template>
  <div id="topology"></div>
</template>

<script setup lang="ts">
import go from "gojs/release/go-debug"
import topology from "../assets/originalTopologyWithLoc.json"
import { onMounted } from "vue"

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

onMounted(() => {
  const $ = go.GraphObject.make
  const topo = new go.Diagram("topology")
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
  const nodeDataArray = []
  const linkDataArray = []
  for (let host of topology.hosts) {
    nodeDataArray.push({ key: host.host_name, category: "host", ...host })
  }
  for (let edge of topology.edges) {
    linkDataArray.push({ from: edge.source, to: edge.target, ...edge })
  }
  topo.model = new go.GraphLinksModel(nodeDataArray, linkDataArray)
})

</script>
<style scoped>
</style>