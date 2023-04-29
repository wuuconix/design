<template>
  <div :id="`${props.chartNum}-${props.yName}`"></div>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import * as echarts from "echarts"
import chartData from "../assets/chart.json"

const props = defineProps<{
  chartNum: "chart1" | "chart2",
  yName: "real_time" | "max_mem"
}>()

const i18nMap = new Map(
	[
		["hostsNum", "主机数"],
		["hostvulNum", "主机漏洞数"],
		["serviceNum", "服务数"],
		["conNum", "可达性数"],
		["real_time", "时间（s）"],
		["max_mem", "内存（MB）"],
		["plan_counter", "规划器调用数"],
		["path_num", "攻击路径数"],
		["ag_nnum", "攻击节点数"],
		["ag_enum", "攻击边数"]
	]
)

function genSeries(chartNum: "chart1" | "chart2", yName: "real_time" | "max_mem") {
	const result = []
	for (let key of Object.keys(chartData[chartNum])) {
		result.push({
			name: key,
			data: chartData[chartNum][key][yName],
			type: "line"
		})
	}
	return result
}

onMounted(() => {
	const chart = echarts.init(document.querySelector(`#${props.chartNum}-${props.yName}`)!)
  const xName = "hostsNum"
	chart.setOption({
		tooltip: {
			trigger: 'axis',
			axisPointer: { type: 'cross' }
		},
		legend: {
			orient: "vertical",
			top: "center",
			right: 30
		},
		xAxis: {
			name: i18nMap.get(xName),
			nameLocation: "center",
			nameTextStyle: {
				fontSize: "24",
				padding: [20, 0, 0, 0]
			},
			data: chartData[xName]
		},
		yAxis: {
      type: 'value',
      name: i18nMap.get(props.yName),
			nameLocation: "middle",
			nameTextStyle: {
				fontSize: "24",
				padding: [0, 0, 40, 0]
			},
      min: 0
    },
		series: genSeries(props.chartNum, props.yName)
	})
})

</script>
<style scoped>
</style>