const SVG_OBJECT_ID = "worldSvg";
const SVG_OBJECT_TO_ELEMENT = (svgObject) => svgObject.contentDocument.children[0];
const SVG_ELEMENT_TO_AREAS = (svgElement) => svgElement.children[1].children;
const SVG_PROP_AREA_NAME = "title";
const style = {
    areaSelectedColor: 'green',
    zoomPadding: 50,
};

let svgElement;
let areas;

const svgObject = document.getElementById(SVG_OBJECT_ID);
svgObject.addEventListener("load",function() {
    init(svgObject);
}, false);

function init(svgObject) {
    svgElement = SVG_OBJECT_TO_ELEMENT(svgObject);
    areas = SVG_ELEMENT_TO_AREAS(svgElement);
    Array.from(areas).map(initArea);
}

function initArea(area) {
    area.style.cursor = "pointer";
    area.onclick = function() {
        const areaName = area.getAttribute(SVG_PROP_AREA_NAME);
        area.style.fill = style.areaSelectedColor;
        console.log('You clicked:', areaName);
        zoomToBBox(area.getBBox(), style.zoomPadding);
    };
}

function zoomToBBox(bb, pad) {
    const viewBox = [bb.x-pad, bb.y-pad, bb.width+pad*2, bb.height+pad*2].join(' ')
    svgElement.setAttribute("viewBox", viewBox);
}