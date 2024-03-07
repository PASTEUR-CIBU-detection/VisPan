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

import { mouse } from "d3-selection";
import * as d3 from "d3";


import {zoom} from "d3-zoom";

export const getLeftRightTop = (that, scales) => {
  const [mouseX, mouseY] = mouse(that); // [x, y] x starts from left, y starts from top
  const left  = mouseX > 0.5 * scales.x.range()[1] ? "" : `${mouseX + 16}px`;
  const right = mouseX > 0.5 * scales.x.range()[1] ? `${scales.x.range()[1] - mouseX}px` : "";
  const top = mouseY+"px";
  return [left, right, top];
}

/* draw the genes (annotations) */
export const drawGenomeAnnotation = (svg, chartGeom, scales, genes, amplicons, hoverSelection) => {
  // svg.selectAll(".gene").remove(); /* only added once, don't need to remove what's not there */

  function handleAmpliconMove(d, i) {
    const [left, right, top] = getLeftRightTop(this, scales);
    hoverSelection
      .style("left", left)
      .style("right", right)
      .style("top", top)
      .style("visibility", "visible")
      .html(`Amplicon ${i + 1} – ${d[0]}-${d[1]}bp`);
    }
  function handleGeneMove(d, i) {
    const [left, right, top] = getLeftRightTop(this, scales);
    hoverSelection
      .style("left", left)
      .style("right", right)
      .style("top", top)
      .style("visibility", "visible")
      .html(`Gene ${d}<br/> ${genes[d].start} - ${genes[d].end}`);
  }

  function handleGeneClick(d,i){
    //alert(d +" "+i);
    //alert(scales.x(genes[d].end));
    let x = scales.x(genes[d].start);
    let y = scales.x(genes[d].end);
    //console.log(svg._groups[0][0].viewBox);
    console.log("click");
    console.log(genes[d]);

    


    alert("gene "+d+" " +x +" "+y);

    console.log(svg);
    /*let view = svg.getAttribute("viewBox");
    console.log(view);

    let viewBox = {x:x,y:0,w:y-x,h:svg[0].viewBox.w};
    svg[0].viewBox = viewBox;*/
    //svg.selectAll(".coverageLine").remove();
    
    // remove svg
    //let tt = d3.select(".coverageLine").remove();

    let tt = d3.select(".coverageLine");
    //d3.zoom().scaleBy( tt , 2);

    //tt.call(d3.zoom().on("zoom", zoomed));
    var zoom = d3.zoom().on('zoom', zoomed);
    tt.call(zoom);
    //const zoomd3 = zoom();

    //zoomd3.scaleBy(tt, 1.5, [0.0]);

    //tt.setAttribute("currentScale", 1.5);
    //let transi =tt.transition().duration(100);
    //console.log(transi);

    //let line = svg.selectAll(".coverageLine");
    
    //zoomd3.translateBy(tt, x, y);
    //console.log(zoomd3);
    //zoomd3.scaleBy( tt.transition().duration(100) ,2);
    //zoomd3.scaleBy(line, 1.3);
    //console.log(svg);
    //console.log(line);
    //line.attr("viewBox", "0 0 20 40");
    //console.log(svg.attr('viewBox'));
    //svg.attr('viewBox',  "0 0 200 300");
    
    //svg = svg.selectAll(".coverageLine").attr("viewBox", "0 0 20 300");
    
    /*svg.transition().duration(750).call(
      zoom.transform
      d3.zoomIdentity.translate(200, 200).scale(40).translate(-x,-y),
      //d3.pointer(event)
    );*/
    
    
  }

  function zoomed(event) {
      let tt =d3.select(".coverageLine");
      //console.log("ICI");
      //console.log(event);
      //console.log(tt);

      //console.log(event.transform.x);

      tt.attr("transform", event.transform);
      //console.log(tt);
      
      
      //tt.scale(0.5);

  }

  function handleMouseOut() {
    hoverSelection.style("visibility", "hidden");
  }

  const ampliconRoof = chartGeom.height - chartGeom.spaceBottom + 24; /* all primers & genes below this */
  const ampliconHeight = 8;
  if (amplicons) {
    svg.append("g")
      .attr("id", "amplicons")
      .selectAll(".amplicon")
      .data(amplicons)
      .enter()
      .append("rect")
      .attr("class", "amplicon")
      .attr("x", (d) => scales.x(d[0]))
      .attr("y", (d, i) => i%2 ? ampliconRoof : ampliconRoof+ampliconHeight)
      .attr("width", (d) => scales.x(d[1])-scales.x(d[0]))
      .attr("height", ampliconHeight)
      .on("mouseout", handleMouseOut)
      .on("mousemove", handleAmpliconMove);
  }

  const geneHeight = 15;
  const geneRoof = ampliconRoof + 2*ampliconHeight + 5;
  const calcYOfGene = (name) => genes[name].strand === 1 ? geneRoof : geneRoof+geneHeight;

  const geneNames = Object.keys(genes);

  const genesSel = svg.selectAll(".gene")
    .data(geneNames)
    .enter()
    .append("g");

  genesSel.append("rect")
    .attr("class", "gene")
    .attr("x", (name) => scales.x(genes[name].start))
    .attr("y", calcYOfGene)
    .attr("width", (name) => scales.x(genes[name].end) - scales.x(genes[name].start))
    .attr("height", geneHeight)
    .on("mouseout", handleMouseOut)
    .on("mousemove", handleGeneMove)
    .on("click", handleGeneClick);

  genesSel.append("text")
      .attr("class", "gene-text")
      .attr("x", (name) => scales.x(genes[name].start) + (scales.x(genes[name].end) - scales.x(genes[name].start))/2)
    .attr("y", calcYOfGene)
    .attr("dy", "12px") /* positive values bump down text */
    .attr("text-anchor", "middle") /* centered horizontally */
    .attr("font-size", "12px")
    .attr("font-weight", "600")
    .attr("alignment-baseline", "bottom") /* i.e. y value specifies top of text */
    .attr("pointer-events", "none") /* don't capture mouse over */
    .text((name) => name.length > 10 ? "" : name);
};