<template>
    <Page>
        <ActionBar :title="title">
            <NavigationButton text="Back" android.systemIcon="ic_menu_back" @tap="onNavigationButtonTap" />
            <StackLayout orientation="horizontal">
                <Button style="padding-right: 10; height: 60" text="add" @tap="addManualEntry" />
                <Button style="padding-right: 10; height: 60" text="start" @tap="start" />
                <Button style="padding-right: 10; height: 60" text="stop" @tap="stop" />
            </StackLayout>
        </ActionBar>
        <GridLayout rows="*, *, *">
          <GridLayout row="0">
            <LineChart ref="chart0" @loaded="onChartLoaded(0)" @tap="onChartTap(0)" />
          </GridLayout>
          <GridLayout row="1">
            <LineChart ref="chart1" @loaded="onChartLoaded(1)" @tap="onChartTap(1)" />
          </GridLayout>
          <GridLayout row="2">
            <LineChart ref="chart2" @loaded="onChartLoaded(2)" @tap="onChartTap(2)" />
          </GridLayout>
        </GridLayout>
    </Page>
</template>

<script lang="ts">
import { Color, Frame, ImageSource, Font } from '@nativescript/core';
import Vue from 'vue';
import { LineChart } from '@nativescript-community/ui-chart/charts/LineChart';
import { LimitLine, LimitLabelPosition } from '@nativescript-community/ui-chart/components/LimitLine';
import { LegendForm } from '@nativescript-community/ui-chart/components/Legend';
import { knownFolders, path } from '@nativescript/core/file-system';
import { LineDataSet, Mode } from '@nativescript-community/ui-chart/data/LineDataSet';
import { LineData } from '@nativescript-community/ui-chart/data/LineData';
import { ColorTemplate } from '@nativescript-community/ui-chart/utils/ColorTemplate';
import { YAxisLabelPosition, AxisDependency } from '@nativescript-community/ui-chart/components/YAxis';
import { XAxisPosition } from '@nativescript-community/ui-chart/components/XAxis';
import { DashPathEffect } from '@nativescript-community/ui-canvas';

export default Vue.extend({
    props: ['title'],
    data() {
        return {
        };
    },
    created() {},

    methods: {
        onChartLoaded(i: number) {
            const chart = this.$refs['chart' + i]['nativeView'] as LineChart;
            chart.drawFameRate = true;

            chart.backgroundColor = 'white';

            // disable description text
            // chart.getDescription().setEnabled(false);

            // enable touch gestures
            chart.setTouchEnabled(true);

            // enable touch gestures
            chart.setTouchEnabled(true);

            // enable scaling and dragging
            chart.setDragEnabled(true);
            chart.setScaleEnabled(true);
            chart.setDrawGridBackground(false);

            // if disabled, scaling can be done on x- and y-axis separately
            chart.setPinchZoom(true);

            // set an alternative background color
            chart.backgroundColor = 'lightgray';

            const data = new LineData();
            data.setValueTextColor('white');

            // add empty data
            chart.setData(data);

            // get the legend (only possible after setting data)
            const l = chart.getLegend();

            // modify the legend ...
            l.setEnabled(false);

            const xl = chart.getXAxis();
            xl.setTypeface(Font.default.withFontFamily('OpenSans-Light'));
            xl.setTextColor('white');
            xl.setDrawGridLines(false);
            xl.setAvoidFirstLastClipping(true);
            xl.setEnabled(true);

            const leftAxis = chart.getAxisLeft();
            leftAxis.setTypeface(Font.default.withFontFamily('OpenSans-Light'));
            leftAxis.setTextColor('white');
            // leftAxis.setAxisMaximum(100);
            // leftAxis.setAxisMinimum(0);
            leftAxis.setDrawGridLines(true);

            const rightAxis = chart.getAxisRight();
            rightAxis.setEnabled(false);


            // draw points over time
        },
        start() {
            if (!this.timer) {
                this.timer = setInterval(this.addEntries, 10);
            }
        },
        stop() {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
        },
        addManualEntry() {
          for (let i = 0; i < 3; i++) {
            this.addEntry(90, i);
          }
        },
        addEntries() {
          for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 3; j++) {
              this.addEntry(Math.random() * 40 + 30, j);
            }
          }
        },
        addEntry(y: number, i: number) {
            // In case user leaves this page
            if (!this.$refs['chart' + i])
            {
                this.stop();
                return;
            }

            const chart = this.$refs['chart' + i]['nativeView'] as LineChart;
            const data = chart.getData();

            if (data != null) {
                let set = data.getDataSetByIndex(0);
                // set.addEntry(...); // can be called as well

                if (set == null) {
                    set = this.createSet(chart);
                    data.addDataSet(set);
                }

                data.addEntry({ y }, 0);
                // data.addEntry(new Entry(set.getEntryCount(), (float) (Math.random() * 40) + 30), 0);
                data.notifyDataChanged();

                // let the chart know it's data has changed
                chart.notifyDataSetChanged();

                // limit the number of visible entries
                chart.setVisibleXRangeMaximum(1000);
                // chart.setVisibleYRange(30, AxisDependency.LEFT);

                // move to the latest entry
                chart.moveViewToX(data.getEntryCount());

                // this automatically refreshes the chart (calls invalidate())
                // chart.moveViewTo(data.getXValCount()-7, 55f,
                // AxisDependency.LEFT);
            }
        },

        createSet(chart: LineChart) {
            const set = new LineDataSet(null, 'Dynamic Data');
            set.setAxisDependency(AxisDependency.LEFT);
            set.setColor(ColorTemplate.getHoloBlue());
            set.setCircleColor('white');
            set.setLineWidth(2);
            set.setCircleRadius(4);
            set.setFillAlpha(65);
            set.setFillColor(ColorTemplate.getHoloBlue());
            set.setHighLightColor(new Color(255, 244, 117, 117));
            set.setValueTextColor('white');
            set.setValueTextSize(9);
            set.setDrawValues(false);
            return set;
        },
        onChartTap(e) {
            console.log('onChartTap', e.data.extraData, e.highlight);
        },
        onNavigationButtonTap() {
            Frame.topmost().goBack();
        },
        
    },
    mounted() {}
});
</script>
