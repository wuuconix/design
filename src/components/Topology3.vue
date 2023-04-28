<template>
  <div id="topology"></div>
</template>

<script setup lang="ts">
import go from "gojs/release/go-debug"
import { onMounted, watch } from "vue"

const props = defineProps(['modelJson'])

function stringify(node) {
  let res = `--------------
服务:

${node.service.length != 0 ? node.service.join("\n") : "无"}

--------------
脆弱性:

${node.vuls.length != 0 ? node.vuls.join("\n") : "无"}

--------------`
  // for (const key in node) {
  //   if ([ "key", "loc", "__gohashid", "category", "points", "from", "to", "img" ].includes(key)) {
  //     continue
  //   }
  //   res += `${key}: ${JSON.stringify(node[key]).replace(/"/g, "")}\n`
  // }

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
  topo.nodeTemplate = $(go.Node, "Vertical",
    { locationSpot: go.Spot.Center },
    new go.Binding("location", "loc", go.Point.parse),
    $(go.Picture, 
      {
        width: 150,
        height: 150,
        imageStretch: go.GraphObject.Uniform 
      },
      new go.Binding("source", "img")
    ),
    $(go.TextBlock, 
      { margin: new go.Margin(10, 0, 0, 0), font: '16px	Times New Roman 宋体' },
      new go.Binding("text", "host_name")
    ),
    {
      toolTip: $("ToolTip", 
        $(go.TextBlock, { margin: 5, font: '16px Times New Roman 宋体' },
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