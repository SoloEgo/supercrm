<template>
    <div class="chart" ref="chartdiv">
    </div>
</template>

<script>
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
//import am4themes_animated from "@amcharts/amcharts4/themes/animated";
//am4core.useTheme(am4themes_animated);


export default {
    name: 'HelloWorld',
    mounted() {
        let chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart);

        chart.paddingRight = 20;

        let data = [];
        let visits = 10;
        for (let i = 1; i < 366; i++) {
            visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
            data.push({ date: new Date(2018, 0, i), name: "name" + i, value: visits });
        }

        chart.data = data;

        let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.grid.template.location = 0;
        dateAxis.renderer.grid.template.disabled = true;
        dateAxis.renderer.labels.template.disabled = true

        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.tooltip.disabled = true;
        valueAxis.renderer.labels.template.disabled = true
        valueAxis.renderer.grid.template.disabled = true;

        let series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.dateX = "date";
        series.dataFields.valueY = "value";

        series.tooltipText = "{valueY.value}";
        chart.cursor = new am4charts.XYCursor();

        // let scrollbarX = new am4charts.XYChartScrollbar();
        // scrollbarX.series.push(series);
        // chart.scrollbarX = scrollbarX;

        this.chart = chart;
    },

    beforeDestroy() {
        if (this.chart) {
            this.chart.dispose();
        }
    }
}
</script>

<style>
.chart {
    width: 100%;
    height: 100%;
}
</style>