/*
 * Copyright (c) 2019 ARTIC Network http://artic.network
 * https://github.com/artic-network/rampart
 *
 * This file is part of RAMPART. RAMPART is free software: you can redistribute it and/or modify it under the terms of the
 * GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your
 * option) any later version. RAMPART is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 *
 * See the GNU General Public License for more details. You should have received a copy of the GNU General Public License
 * along with RAMPART. If not, see <http://www.gnu.org/licenses/>.
 *
 */

import React from 'react';
import {mouse, select} from "d3-selection";
import {calcScales} from "../../utils/commonFunctions";
import {heatColourScale} from "../../utils/colours";
import {getRelativeReferenceMapping} from "../../utils/config";
import Container, {Title, HoverInfoBox} from "./styles";

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Dark from "@amcharts/amcharts5/themes/Dark";

const EMPTY_CELL_COLOUR = "rgba(256, 256, 256, 0.15)"




/*const drawHeatMap = ({names, referencePanel, data, svg, scales, cellDims, chartGeom, relativeReferenceMapping, infoRef}) => {
     convert the refMatchPerSample data from raw counts to percentages & change to a d3-friendly struct.
    Input format:
      refMatchPerSample[sampleIdx][reference_idx] = INT
    Output data format:
      flat list, with each value itself a list:
        [sampleIdx, refPanelMatchIdx, fracIdentity]
    

   
    function handleMouseMove(d, i) {
        const [mouseX, mouseY] = mouse(this); // [x, y] x starts from left, y starts from top
        const left  = mouseX > 0.5 * scales.x.range()[1] ? "" : `${mouseX + 16}px`;
        const right = mouseX > 0.5 * scales.x.range()[1] ? `${scales.x.range()[1] - mouseX}px` : "";
        // const mapString = referencePanel[d.refIdx].name !== "unmapped" ?
        //     `map to ${referencePanel[d.refIdx].name}` : `were not mapped to any reference`;
        const mapString = referencePanel[d.refIdx].name !== "unmapped" ?
            `Reference: ${referencePanel[d.refIdx].name}` : `Unmapped`;
        select(infoRef)
            .style("left", left)
            .style("right", right)
            .style("top", `${mouseY}px`)
            .style("visibility", "visible")
            .html(`
                Sample: ${names[d.sampleIdx]}
                <br/>
                ${mapString}
                <br/>
                ${d.count} reads
                <br/>
                ${d.percentOfSample.toFixed(2)}% of the sample
                <br/>
                ${d.percentOfTotal.toFixed(2)}% of the total
            `);
    }
    function handleMouseOut() {
        select(infoRef).style("visibility", "hidden");
    }

   
};*/

class ReferenceHeatmap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {chartGeom: {}, relativeReferenceMapping: false, hoverWidth: 0, svg: undefined};
    }
    redraw() {
        /* currently redo everything, but we could make this much much smarter */
        /*const sampleNames = Object.keys(this.props.data).filter((name) => name!=="all");
        const referencePanel = this.props.referencePanel.filter((info) => info.display);
        const chartGeom = this.state.chartGeom;
        const cellDims = calcCellDims(chartGeom, sampleNames.length, referencePanel.length);
        const scales = calcScales(
            chartGeom,
            sampleNames.length,     // number of columns
            referencePanel.length   // number of rows
        );
        drawHeatMap({
            names: sampleNames,
            referencePanel,
            data: this.props.data,
            svg: this.state.svg,
            scales,
            cellDims,
            chartGeom,
            relativeReferenceMapping: getRelativeReferenceMapping(this.props.config),
            infoRef: this.infoRef
        });*/
    }
    componentDidMount() {
        //console.log("componentDidMount");
        /*const svg = select(this.DOMref);
        //console.log(this.props);
        const chartGeom = calcChartGeom(this.boundingDOMref.getBoundingClientRect());
        const hoverWidth = parseInt(chartGeom.width * 2/3, 10);
        this.setState({chartGeom, svg, hoverWidth})*/

        

        var rootChart = am5.Root.new("chartdivref");
        rootChart.setThemes([
            am5themes_Animated.new(rootChart)
          ]);
        var chart = rootChart.container.children.push(am5xy.XYChart.new(rootChart, {
            panX: false,
            panY: false,
            paddingLeft: 0,
            wheelX: "panX",
            wheelY: "zoomX",
            layout: rootChart.verticalLayout
        }));

        var legend = chart.children.push(
            am5.Legend.new(rootChart, {
              centerX: am5.p50,
              x: am5.p50
            })
        );
        var data = [{
            "year": "2021",
            "europe": 2.5,
            "namerica": 2.5,
            "asia": 2.1,
            "lamerica": 1,
            "meast": 0.8,
            "africa": 0.4,
            "type": "type1"
          }, {
            "year": "2022",
            "europe": 2.6,
            "namerica": 2.7,
            "asia": 2.2,
            "lamerica": 0.5,
            "meast": 0.4,
            "africa": 0.3,
            "type": "type2"
          }, {
            "year": "2023",
            "europe": 2.8,
            "namerica": 2.9,
            "asia": 2.4,
            "lamerica": 0.3,
            "meast": 0.9,
            "africa": 0.5,
            "type": "type3"
          }]
        // Create axes
        // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
        var xRenderer = am5xy.AxisRendererX.new(rootChart, {
            cellStartLocation: 0.1,
            cellEndLocation: 0.9,
            minorGridEnabled: true
        })
        
        var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(rootChart, {
            categoryField: "type",
            renderer: xRenderer,
            tooltip: am5.Tooltip.new(rootChart, {})
        }));
        
        xRenderer.grid.template.setAll({
            location: 1
        })
        
        xAxis.data.setAll(data);
        
        var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(rootChart, {
            renderer: am5xy.AxisRendererY.new(rootChart, {
            strokeOpacity: 0.1
            })
        }));
        
        
        // Add series
        // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
        function makeSeries(name, fieldName) {
            var series = chart.series.push(am5xy.ColumnSeries.new(rootChart, {
            name: name,
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: fieldName,
            categoryXField: "type"
            }));
        
            series.columns.template.setAll({
            tooltipText: "{name}, {categoryX}:{valueY}",
            width: am5.percent(90),
            tooltipY: 0,
            strokeOpacity: 0
            });
        
            series.data.setAll(data);
        
            // Make stuff animate on load
            // https://www.amcharts.com/docs/v5/concepts/animations/
            series.appear();
        
            series.bullets.push(function () {
            return am5.Bullet.new(rootChart, {
                locationY: 0,
                sprite: am5.Label.new(rootChart, {
                text: "{valueY}",
                fill: rootChart.interfaceColors.get("alternativeText"),
                centerY: 0,
                centerX: am5.p50,
                populateText: true
                })
            });
            });
            //console.log(series);
            legend.data.push(series);
        }
        
        makeSeries("Europe", "europe");
        makeSeries("North America", "namerica");
        makeSeries("Asia", "asia");
        makeSeries("Latin America", "lamerica");
        makeSeries("Middle East", "meast");
        makeSeries("Africa", "africa");
        
        /*let data =[];
        for (const [key, value] of Object.entries(this.props.data)) {
            //console.log(`${key}: ${value}`);
            let obj =value;
            //console.log(key);
            //console.log(obj);
            for (const [key2, value2] of Object.entries(obj)) {
                //console.log(`${key2}: ${value2}`);
                if(key2 === 'mappedCount'){
                    data.push({"name":key,'mappedcount':value2})
                }
            }   

        }*/
        
        // Make stuff animate on load
        // https://www.amcharts.com/docs/v5/concepts/animations/
        chart.appear(1000, 100);
    }
    componentDidUpdate() {
        this.redraw();
    }
    render() {
        return (
            <Container width={this.props.width} ref={(r) => {this.boundingDOMref = r}}>
                <Title>{this.props.title}</Title>
                <HoverInfoBox width={this.state.hoverWidth} ref={(r) => {this.infoRef = r}}/>
                {/* <svg
                    ref={(r) => {this.DOMref = r}}
                    height={this.state.chartGeom.height || 0}
                    width={this.state.chartGeom.width || 0}
                /> */}
               
                 <div id="chartdivref" style={{ width: "100%", height: "300px" }}></div>
                 {this.props.renderProp ? this.props.renderProp : null}
            </Container>
        )
    }
}

export default ReferenceHeatmap;
