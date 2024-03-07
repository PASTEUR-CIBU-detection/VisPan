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
import { select } from "d3-selection";


import * as d3 from "d3";
import {brushX} from 'd3-brush';


import Select from 'react-select';


import MultiRangeSlider from "multi-range-slider-react";

import {calcXScale,calcXScaleShift, calcYScale, drawAxes} from "../../utils/commonFunctions";
import { max } from "d3-array";
import { drawSteps } from "../../d3/drawSteps";
import { drawGenomeAnnotation } from "../../d3/genomeAnnotation";
import { drawStream } from "../../d3/stream";
import Toggle from "../reusable/toggle";
import { getLogYAxis } from "../../utils/config";
import Container, {Title, HoverInfoBox} from "./styles";
import CenterHorizontally from "../reusable/CenterHorizontally";

/* given the DOM dimensions of the chart container, calculate the chart geometry (used by the SVG & D3) */
const calcChartGeom = (DOMRect) => ({
    width: DOMRect.width,
    height: DOMRect.height - 20, // title line
    spaceLeft: 60,
    spaceRight: 0,
    spaceBottom: 70,
    spaceTop: 10
});

const getMaxCoverage = (data) => {
    const trueMax = max(Object.keys(data).map((name) => data[name].maxCoverage));
    return (parseInt(trueMax / 50, 10) + 1) * 50;
};

class CoveragePlot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {chartGeom: {}, showReferenceMatches: false, logScale: false};
        this.toggleReadDepthVsReferenceMatches = () => {
            this.setState({showReferenceMatches: !this.state.showReferenceMatches})
        }

        this.selectGene = (event) => {
            console.log(event);
            //console.log(this);
            if(event.value == "all"){
                this.redraw();
            }else{
                console.log(this.props.config.genome.genes);
                //console.log(this.props.config.genome.genes["Phlebo"]);

                console.log(event.value);
                //console.log(this.props.config.primers.amplicons);
                let nameGene = event.value;
                //let genes = this.props.config.genome.genes;
                //this.props.config.genome.genes
                //console.log(genes);
                let gene = {};
                let g = this.props.config.genome.genes[nameGene];
                gene.start = g.start;
                gene.end = g.end;
                gene.strand = g.strand;
                console.log(gene);



                //let name= "Phlebo";

                //this.setGene(name,this.props.config.genome.genes[name]);
                this.setGene(nameGene,gene);
            }
            
        }

        this.options =[];
        let i= 0;
        for (const property in this.props.config.genome.genes) {
           /// this.options = [
            this.options[i] = {value: property, label:property }
            //console.log(property);
            i++
        }
        this.options[i+1] = {value: "all", label:"all" }
        /*for (let i = 0; i < this.props.config.genome.genes.length; i++) {
            console.log();
            this.options[i] = {value: , label: }
        }*/
        /*this.options = [
            { value: 'chocolate', label: 'Chocolate' },
            { value: 'strawberry', label: 'Strawberry' },
            { value: 'vanilla', label: 'Vanilla' }
          ]*/
        //console.log(this.options);
        
        
        
        this.styles = {
            control: base => ({
                ...base,
                //height: 18,
                //minHeight: 18,
                height:10,
                width: 50,
                backgroundColor: "#005c68",

            }),
            option: (provided, state) => ({
              ...provided,
              fontWeight: state.isSelected ? "bold" : "normal",
              color: "white",
              //backgroundColor: state.data.color,
              backgroundColor: "#005c68",
              fontSize: "10"
            }),
            singleValue: (provided, state) => ({
              ...provided,
              color: state.data.color,
              fontSize: "10"
            }),
        };
        this.stylesmultiSlider = {
            
            width:"300px",
            
        };

    }
    redraw () {
        this.state.svg.selectAll("*").remove();


        /*const brush = d3.brushX()
            .on("start", brushstart)
            .on("brush", brushed)
            .on("end", brushended);

        console.log(brush);
        
        function brushstart({selection}) {
            console.log(selection);
        }
        function brushed({selection}) {
            console.log(selection);
        }
        function brushended({selection}) {
            console.log(selection);
        }
        this.state.svg.append("g")
            .attr("class", "brush")
            .call(brush);
        //this.state.svg.call(brush);*/
        
        const xScale = calcXScale(this.state.chartGeom, this.props.config.genome.length);
        const yScale = this.state.showReferenceMatches ?
            calcYScale(this.state.chartGeom, 100) :
            calcYScale(this.state.chartGeom, getMaxCoverage(this.props.coverage), {log: getLogYAxis(this.props.config)});
        
        const scales = {x: xScale, y: yScale};
        //console.log(scales);
        /* draw the axes & genome annotation*/
        const ySuffix = this.state.showReferenceMatches ? "%" : "x";
        drawAxes(this.state.svg, this.state.chartGeom, scales, {xSuffix: "bp", ySuffix});
        console.log(this.props.config.genome.genes);
        //console.log(this.props.config.primers.amplicons);
        drawGenomeAnnotation(this.state.svg, this.state.chartGeom, scales, this.props.config.genome.genes, this.props.config.primers.amplicons, this.state.hoverSelection);
        const basesPerBin = this.props.config.genome.length / this.props.config.display.numCoverageBins;
        if (this.state.showReferenceMatches) {
          drawStream({
            svg: this.state.svg,
            scales,  
            stream: this.props.referenceStream,
            referencePanel: this.props.config.genome.referencePanel,
            hoverSelection: this.state.hoverSelection,
            basesPerBin
          }); 
        } else {
            
            const data = Object.keys(this.props.coverage)
                .filter((name) => name!=="all")
                .map((name) => ({
                    name,
                    xyValues: this.props.coverage[name].coverage.map((cov, idx) => [parseInt(idx*basesPerBin, 10), cov]),
                    colour: this.props.sampleColours[name] || "#FFFFFF"
                }));
            //console.log(data);
            //console.log(data[0].xyValues);
            /*let data2 = data.filter(function(d) {
                    //console.log(d.name);
                    console.log(d.xyValues);
                    //console.log(d.xyValues[0]);
                    
                    return d.xyValues[0]> 150000
            });*/
            function filterRange(arr, a, b) {
                // added brackets around the expression for better readability
                return arr.filter(item => (a <= item && item <= b));
            };
            function filterRange2(tab, a, b) {
                // added brackets around the expression for better readability
                //return arr.filter(item => (a <= item && item <= b));
                return tab.filter(item => {return (item[0]>a )&&(item[0]<b)} )
                
                //return tab.filter(k => k.every(item => (a <= item[0] && item[0] <= b)));
                // return tab.filter(k => k.filter(item => (a <= item[0] && item[0] <= b)));
                
            };
            //let arr = data[0].xyValues;
            //console.log(arr);
            //let arr2 = filterRange2(arr,100000,150000);
            //console.log(arr2);
            

            const hoverDisplayFunc = ({name, xValue, yValue}) => (`Sample: ${name}<br/>Pos: ${xValue}<br/>Depth: ${Math.round(yValue)}x`);
            drawSteps({
                svg: this.state.svg,
                chartGeom: this.state.chartGeom,
                scales,
                data,
                fillBelowLine: !!this.props.fillIn,
                hoverSelection: this.state.hoverSelection,
                hoverDisplayFunc
            });
        }
    }
    componentDidMount() {
        const svg = select(this.DOMref);
        const chartGeom = calcChartGeom(this.boundingDOMref.getBoundingClientRect());
        const hoverWidth = parseInt(chartGeom.width * 3/4, 10);
        const hoverSelection = select(this.infoRef);
        this.setState({svg, chartGeom, hoverWidth, hoverSelection});
    }
    componentDidUpdate() {
      this.redraw();
    }
    render() {
        return (
            <Container width={this.props.width} ref={(r) => {this.boundingDOMref = r}}>
                { !this.props.canShowReferenceMatches ? (
                    <Title>Read Depth</Title>
                ) : (
                    
                    <CenterHorizontally>
                        {/* <CenterHorizontally>
                        <MultiRangeSlider
                            baseClassName="multi-range-slider-black"
                            styles={this.stylesmultiSlider}
                            min={0}
                            max={100}
                            step={5}
                            minValue={0}
                            maxValue={100}
                            onInput={(e) => {
                                console.log(e);
                                //handleInput(e);
                            }}
                            onChange={(e) => {
                                console.log(e);
                                //handleInput(e);
                            }}
                        />
                        </CenterHorizontally> */}
                        {/* <button onClick={this.sayHello}>ChangeData</button> */}
                        <Select styles={this.styles}  options={this.options} onChange={this.selectGene}  />
                        
                        <Toggle
                            labelLeft="depth"
                            labelRight="references"
                            handleToggle={this.toggleReadDepthVsReferenceMatches}
                            toggleOn={false}
                        />
                       
                    </CenterHorizontally>
                )}
                <HoverInfoBox width={this.state.hoverWidth || 0} ref={(r) => {this.infoRef = r}}/>
                <svg
                    ref={(r) => {this.DOMref = r}}
                    height={this.state.chartGeom.height || 0}
                    width={this.state.chartGeom.width || 0}
                />
                {this.props.renderProp ? this.props.renderProp : null}
            </Container>
        )
    }
    
    setGene(name,gene){
        //this.props.amplicons
        console.log("##############################");
        //tab.filter(item => {return (item[0]>a )&&(item[0]<b)} )
        // get amplicons that belong to a gene
        console.log(name);
        console.log(gene);
        //console.log(gene.start+" "+gene.end);
        let amplis = filterampli(this.props.config.primers.amplicons,gene.start,gene.end);
        //console.log(this.props.config.primers.amplicons);
        console.log(amplis);
        function filterampli(tab, a, b) {
            return tab.filter(item => {return (item[0]>a )&&(item[0]<b)})
            //tab.filter(item => {return (item[0]>a )&&(item[0]<b)} )
        }
        
        
        this.state.svg.selectAll("*").remove();

        //const xScale = calcXScale(this.state.chartGeom, gene.end -gene.start);
        

        

        let shift = amplis[0][0];
        let amplisNew = [];
        for (let i = 0; i < amplis.length; i++) {
            //console.log(amplis[i]);
            amplisNew[i] = [amplis[i][0]-shift,amplis[i][1]-shift];
        }
        console.log("amplis");
        console.log(amplisNew);
        const ySuffix = this.state.showReferenceMatches ? "%" : "x";
        //drawAxes(this.state.svg, this.state.chartGeom, scales, {xSuffix: "bp", ySuffix});
        let g ={};
        shift =gene.start;
        //gene.end = gene.end -gene.start;
        //gene.start = 0 
        
        console.log(gene);
        g[name]= gene;
        //drawGenomeAnnotation(this.state.svg, this.state.chartGeom, scales, g, amplisNew, this.state.hoverSelection);
        //drawGenomeAnnotation(this.state.svg, this.state.chartGeom, scales, g, amplis, this.state.hoverSelection);
        
        const basesPerBin = this.props.config.genome.length / this.props.config.display.numCoverageBins;
        const data = Object.keys(this.props.coverage)
                .filter((name) => name!=="all")
                .map((name) => ({
                    name,
                    xyValues: this.props.coverage[name].coverage.map((cov, idx) => [parseInt(idx*basesPerBin, 10), cov]),
                    colour: this.props.sampleColours[name] || "#FFFFFF"
                }));
            /*.data(data.map((dataObj) => dataObj.xyValues))
            data.filter(function(d) {
                console.log(d.name);
                console.log(d.xyValues);
                console.log(d.xyValues[0]);
                return d.xyValues[0]> 150000
              });*/
        console.log(data);
        //let xYValNew = [];
        
        console.log(data[0]);
        console.log(data[0].xyValues);

        let xYValNew = filterampli(data[0].xyValues,gene.start,gene.end);

        /*for (let i = 0; i < data[0].xyValues.length; i++) {
            //console.log(amplis[i]);
            xYValNew[i] = [data[0].xyValues[i][0]-shift,data[0].xyValues[i][1]];
            //xYValNew[i] = [data[0].xyValues[i][0],data[0].xyValues[i][1]];
        }*/

        console.log(xYValNew);
        
        console.log(data);

        let maxval = -1;
        for (let i = 0; i < xYValNew.length; i++) {
            let tab = xYValNew[i];
            if(maxval <tab[1]){
                maxval = tab[1];
            }
        }
        data[0].xyValues = xYValNew;

        const xScale = calcXScaleShift(this.state.chartGeom, gene.start,gene.end);
        
        //console.log(this.props.coverage["Lassa_01"].coverage);

    
        
        console.log(maxval);
        /*const yScale = this.state.showReferenceMatches ?
            calcYScale(this.state.chartGeom, 100) :
            calcYScale(this.state.chartGeom, getMaxCoverage(this.props.coverage), {log: getLogYAxis(this.props.config)});*/

        const yScale = this.state.showReferenceMatches ?
            calcYScale(this.state.chartGeom, 100) :
            calcYScale(this.state.chartGeom, maxval, {log: getLogYAxis(this.props.config)});
        
        const scales = {x: xScale, y: yScale};

        const hoverDisplayFunc = ({name, xValue, yValue}) => (`Sample: ${name}<br/>Pos: ${xValue}<br/>Depth: ${Math.round(yValue)}x`);
        drawSteps({
            svg: this.state.svg,
            chartGeom: this.state.chartGeom,
            scales,
            data,
            fillBelowLine: !!this.props.fillIn,
            hoverSelection: this.state.hoverSelection,
            hoverDisplayFunc
        });
        drawAxes(this.state.svg, this.state.chartGeom, scales, {xSuffix: "bp", ySuffix});
        drawGenomeAnnotation(this.state.svg, this.state.chartGeom, scales, g, amplis, this.state.hoverSelection);


    }
}

export default CoveragePlot;
