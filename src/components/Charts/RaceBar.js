    /*
 * Copyright (c) 2023 Pasteur http://www.pasteur.fr
 * https://gitlab.pasteur.fr/plechat/rampart
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

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Dark from "@amcharts/amcharts5/themes/Dark";



/*import { select, mouse } from "d3-selection";
import {drawAxes} from "../../utils/commonFunctions";
import {scaleLinear, scaleLog, scaleOrdinal} from "d3-scale";
import { getLogYAxis } from "../../utils/config";*/
import Container, {Title, HoverInfoBox} from "./styles";

import CenterHorizontally from "../reusable/CenterHorizontally";


class RacebarPlot extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {chartGeom: {}, logScale: false, hoverWidth: 0};
    //console.log(this.props);
    this.root =null;
    this.chart = null;
    this.xAxis =null;
    this.yAxis = null;
    this.series1 = null;


    /*this.sayHello = () => {
        
        console.log("sayHello");
        let data = [
            {
            name: "Research",
            mappedcount: 1000
            
            },
            {
            name: "Marketing",
            mappedcount: 1200
            
            },
            {
            name: "Sales",
            mappedcount: 850
            }
        ];
        console.log(data);

        console.log(this);
        console.log(this.xAxis);
        console.log(this.yAxis);

        console.log(this.series1);
        console.log(this);
        this.xAxis.data.setAll(data);
        this.series1.data.setAll(data);
    }*/

    let stepDuration =2000;
    // Get series item by category
    this.getSeriesItem = (category) =>{
      for (var i = 0; i < this.series1.dataItems.length; i++) {
        var dataItem = this.series1.dataItems[i];
        if (dataItem.get("categoryY") === category) {
          return dataItem;
        }
      }
    }
    // Axis sorting
    this.sortCategoryAxis = () => {
      // sort by value
      this.series1.dataItems.sort(function (x, y) {
        return y.get("valueX") - x.get("valueX"); // descending
        //return x.get("valueX") - y.get("valueX"); // ascending
      });
    
      // go through each axis item
      am5.array.each(this.yAxis.dataItems, function (dataItem) {
        // get corresponding series item
        var seriesDataItem = this.getSeriesItem(dataItem.get("category"));
    
        if (seriesDataItem) {
          // get index of series data item
          var index = this.series1.dataItems.indexOf(seriesDataItem);
          // calculate delta position
          var deltaPosition =
            (index - dataItem.get("index", 0)) / this.series1.dataItems.length;
          // set index to be the same as series data item index
          if (dataItem.get("index") !== index) {
            dataItem.set("index", index);
            // set deltaPosition instanlty
            dataItem.set("deltaPosition", -deltaPosition);
            // animate delta position to 0
            dataItem.animate({
              key: "deltaPosition",
              to: 0,
              duration: stepDuration / 2,
              easing: am5.ease.out(am5.ease.cubic)
            });
          }
        }
      });
      // sort axis items by index.
      // This changes the order instantly, but as deltaPosition is set, they keep in the same places and then animate to true positions.
      this.yAxis.dataItems.sort(function (x, y) {
        return x.get("index") - y.get("index");
      });
    }


  }
  
  componentDidMount() {
    let root = am5.Root.new("chartdiv");

    /*var myTheme = am5.Theme.new(root);
    myTheme.rule("Label").setAll({
      fill: am5.color(0xFF0000),
      fontSize: "1.5em"
    });*/
    
    

    root.setThemes([am5themes_Animated.new(root),am5themes_Dark.new(root)]);

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        
        layout: root.verticalLayout,
        panX: false,
        panY: false,
        wheelX: "panX",
        wheelY: "zoomX"
      }),
    );
    // set the charts color
    //var myTheme = am5.Theme.new(root);
    
    
    //console.log(this.props.theme.articWhite);
    /*myTheme.rule("Label").setAll({
      fill: am5.color(this.props.theme.articWhite),
      fontSize: "1.5em"
    });*/
    
    

    // Define data
    
    let data =[];
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

    }


    // Create Y-axis
    this.yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {})
      })
    );


    const xAxisRenderer = am5xy.AxisRendererX.new(root, {});
    xAxisRenderer.labels.template.setAll({
      rotation: -45,
      
      oversizedBehavior: "fit",
      minGridDistance: 1
    });
    // Create X-Axis
    this.xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        renderer: xAxisRenderer,
        categoryField: "name",
        tooltip: am5.Tooltip.new(root, {})
      })
    );
    console.log(this.xAxis.renderer);
    //this.xAxis.renderer.minGridDistance = 30;

    
    this.xAxis.data.setAll(data);

    // Create series
    let series1 = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Series",
        xAxis: this.xAxis,
        yAxis: this.yAxis,
        valueYField: "mappedcount",
        categoryXField: "name",
        maskBullets: false
      })
    );
    
    // --> hide amchart5 logo
    root._logo.dispose();

    this.series1 =series1;
    this.series1.data.setAll(data);

    // Add legend
    let legend = chart.children.push(am5.Legend.new(root, {}));
    legend.data.setAll(chart.series.values);

    this.series1.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5, strokeOpacity: 0 });

        // Add label bullet    //???
    this.series1.bullets.push(function () {
      return am5.Bullet.new(root, {
        locationX: 1,
        sprite: am5.Label.new(root, {
          text: "{mappedcount.formatNumber('#.# a')}",
          //fill: root.interfaceColors.get("alternativeText"),
          fill:"white",
          centerX: am5.p100,
          centerY: am5.p100,
          
          
          //fill: am5.Color.lighten(this.series1.get("fill"), 0.7)
          populateText: true
        })
      });
    });
    
    //console.log(this.props);
    let props = this.props;
    console.log(this.props);

    // click on a bar goes to corresponding color Panel
    this.series1.columns.template.events.once("click", function(ev) {
        console.log("Clicked on a column", ev.target);
        console.log(series1.columns.indexOf(ev.target));
        console.log(props);
        props.goToSamplePanel(samples[series1.columns.indexOf(ev.target)]);
    });

    // draw columns with data colors
    const samples = Object.keys(this.props.data)
        .filter((name) => name!=="all"); // TODO -- order appropriately!
    const counts = [];
    const colours = [];
    samples.forEach((name) => {
      counts.push(this.props.data[name].mappedCount || 0);
      colours.push(this.props.sampleColours[name]);
    });
    
    this.series1.columns.template.adapters.add("stroke", function(stroke, target) {
        //return chart.get("colors").getIndex(series1.columns.indexOf(target));
        
        if (data[series1.columns.indexOf(target)] !== undefined){
          return props.sampleColours[samples[series1.columns.indexOf(target)].name];
        }
    });
    this.series1.columns.template.adapters.add("fill", function(fill, target) {
        //return chart.get("colors").getIndex(series1.columns.indexOf(target));
        
        if (data[series1.columns.indexOf(target)] !== undefined){
          return  props.sampleColours[data[series1.columns.indexOf(target)].name];
        }
    });



    //this.series1.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5, strokeOpacity: 0 });

    // Add cursor
    //chart.set("cursor", am5xy.XYCursor.new(root, {}));

    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
        behavior: "zoomX"
    }));
    cursor.lineY.set("visible", false);

    this.root = root;
    
  }
  componentDidUpdate(){

    //console.log("RaceBar update");
    let data =[];
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

    }


    //this.xAxis.data.setAll(data);
    this.series1.data.setAll(data);
    
    //console.log(this.xAxis.dataItems);

    /*this.xAxis.dataItems.sort(function (x, y) {
      //return x.get("index") - y.get("index");
      return x.dataContext.mappedCount - y.dataContext.mappedCount;
    });*/
    //console.log(this.xAxis.dataItems);
    //console.log(this.series1);
    
    // Bar Race
    /*this.series1.dataItems.sort(function (x, y) {
        //console.log(y.get("valueY"));
        //return y.get("valueY") - x.get("valueY"); // descending
        return x.get("valueY") - y.get("valueY"); // ascending
    });*/
/*
    let why = this;
    // go through each axis item
    am5.array.each(this.yAxis.dataItems, function (dataItem) {
    // get corresponding series item
    console.log(dataItem);
    //var seriesDataItem = this.getSeriesItem(dataItem.get("mappedcount"));

    //if (seriesDataItem) {
      // get index of series data item
      //var index = this.series1.dataItems.indexOf(seriesDataItem);
      var index = why.series1.dataItems.indexOf(dataItem);
      
      // calculate delta position
      var deltaPosition =
        (index - dataItem.get("index", 0)) / why.series1.dataItems.length;
      // set index to be the same as series data item index
      if (dataItem.get("index") != index) {
        dataItem.set("index", index);
        // set deltaPosition instanlty
        dataItem.set("deltaPosition", -deltaPosition);
        // animate delta position to 0
        dataItem.animate({
          key: "deltaPosition",
          to: 0,
          duration: 10 / 2,
          easing: am5.ease.out(am5.ease.cubic)
        });
      }
    //}
  });
  // sort axis items by index.
  // This changes the order instantly, but as deltaPosition is set, they keep in the same places and then animate to true positions.
  this.yAxis.dataItems.sort(function (x, y) {
    return x.get("index") - y.get("index");
  });
  }

  getSeriesItem(category) {
    for (var i = 0; i < this.series1.dataItems.length; i++) {
      var dataItem = this.series1.dataItems[i];
      if (dataItem.get("categoryY") == category) {
        return dataItem;
      }
    }
  }*/
  
  }
  render() {
    return (
        <Container width={this.props.width} ref={(r) => {this.boundingDOMref = r}}>
          <Title>
            {this.props.title}
          </Title> 
          <HoverInfoBox width={this.state.hoverWidth} ref={(r) => {this.infoRef = r}}/>
          <CenterHorizontally>
            <div id="chartdiv" style={{ width: "100%", height: "300px" }}></div>
          </CenterHorizontally>
          {this.props.renderProp ? this.props.renderProp : null}
          
        </Container>
        
    ) 
  }   


}

export default RacebarPlot;
