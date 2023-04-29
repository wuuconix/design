<template>
  <div id="topology"></div>
</template>

<script setup lang="ts">
import go from "gojs/release/go-debug"
import modelJson from "../assets/topology2Model.json"
import { onMounted } from "vue"

function stringify(node) {
  const sep = "--------------\n"
  let res = sep
  if (node.vuls.length == 0) {
    return ""
  } else if (node.vuls.length == 1) {
    res += `脆弱性名称/功能故障: ${node.vuls[0]}\n指标: ${node.impacts[0]}\n${sep}`
  } else {
    for (let i = 0; i < node.vuls.length; i++) {
      res += `脆弱性名称/功能故障${i + 1}: ${node.vuls[i]}\n指标: ${node.impacts[i]}\n${sep}`
    }
  }
  res = res.replace(/\n$/g, "")
  return res
}

onMounted(() => {
  const $ = go.GraphObject.make
  const topo = new go.Diagram("topology")
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
      new go.Binding("text", "name")
    ),
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
    $(go.Shape, { toArrow: "Standard" })
  )
  topo.model = go.Model.fromJson(modelJson)
  window.print = () => {
		console.log(JSON.stringify(JSON.parse(topo.model.toJson()), null, "\t"))
	}
})

</script>
<style scoped>
</style>