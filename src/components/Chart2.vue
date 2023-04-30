<template>
  <div :id="`chart2`"></div>
</template>

<script setup lang="ts">
import { onMounted, watch } from "vue"
import * as echarts from "echarts"
import chartData from "../assets/chart2.json"

function sortChartData(): typeof chartData {
	const data: typeof chartData = JSON.parse(JSON.stringify(chartData))
	if (props.sort == "asc") {
		return data.sort((a, b) => a[props.yName] - b[props.yName])
	} else if (props.sort == "desc") {
		return data.sort((a, b) => b[props.yName] - a[props.yName])
	} else {
		return data
	}
}

const props = defineProps<{
	yName: "BC'" | "CC'" | "IEC" | "deg" | "D+" | "D-" | "C",
	sort: "none" | "asc" | "desc",
}>()

let chart: echarts.ECharts

const colorMap = new Map([
	["BC'", "#5470c6"],
	["CC'", "#91cc75"],
	["IEC", "#fac858"],
	["deg", "#ee6666"],
	["D+", "#73c0de"],
	["D-", "#3ba272"],
	["C", "#fc8452"]
])

function fresh() {
	const data = sortChartData()
	const option =  {
		tooltip: {
			trigger: 'axis',
			axisPointer: { type: 'cross' }
		},
		xAxis: {
			name: "节点序号",
			nameLocation: "center",
			nameTextStyle: {
				fontSize: "16",
				padding: [20, 0, 0, 0]
			},
			data: data.map(v => `${v.index}: ${v.name}`),
			axisLabel: {  
				interval: 0,
				formatter(value: string) {
					return value.split(":")[0]
				}
			},
		},
		yAxis: {
			type: 'value',
			name: props.yName,
			nameLocation: "middle",
			nameTextStyle: {
				fontSize: "16",
				padding: [0, 0, 20, 0]
			},
		},
		series: [
			{
				type: 'bar',
				data: data.map(v => v[props.yName]),
				itemStyle: {
					color: colorMap.get(props.yName)
      	}
			}
		]
	}
	chart.setOption(option)
}

onMounted(() => {
	chart = echarts.init(document.querySelector("#chart2")!)
	fresh()
})

watch(
	() => props.sort,
	() => fresh()
)

watch(
	() => props.yName,
	() => fresh()
)
</script>
<style scoped>
</style>