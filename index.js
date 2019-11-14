/*
    DOM Navigation
*/

const SVG_OBJECT_ID = "worldSvg";
const AREA_SELECT_ID = "areaSelect";
const APPLY_BUTTON_ID = "applyButton";
const SVG_OBJECT_TO_ELEMENT = (svgObjectElement) => svgObjectElement.contentDocument.children[0];
const SVG_ELEMENT_TO_AREAS = (svgElement) => svgElement.children[1].children;
const SVG_PROP_AREA_NAME = "title";

const style = {
    areaFocusColor: 'gray',
    areaRightColor: 'green',
    areaWrongColor: 'red',
    zoomPadding: 200,
};

const AREA_GUESS_NONE = null;
const AREA_GUESS_RIGHT = true;
const AREA_GUESS_WRONG = false;
const AREA_NULL = '-- Guess --';

/*
    State
*/

let svgElement;
let areas;
let selectedArea;
let selectedGuess;

const svgObjectElement = document.getElementById(SVG_OBJECT_ID);
const areaSelectElement = document.getElementById(AREA_SELECT_ID);
const applyButtonElement = document.getElementById(APPLY_BUTTON_ID);

const areaGuesses = {};

/*
    Init
*/

svgObjectElement.addEventListener("load",function() {
    init(svgObjectElement);
}, false);

function init(svgObjectElement) {
    svgElement = SVG_OBJECT_TO_ELEMENT(svgObjectElement);
    initApplyButton();
    areas = Array.from(SVG_ELEMENT_TO_AREAS(svgElement));
    areas.map(initArea);
    areaNames = areas.map((area) => area.getAttribute(SVG_PROP_AREA_NAME))
    setAreaOptions(areaNames);
    areaSelectElement.onchange = (ev) => {
        selectedGuess = ev.currentTarget.value;
    }
}

function setAreaOptions(values) {
    areaSelectElement.innerHTML = [`<option>${AREA_NULL}</option>`].concat(values.map((value) => `<option>${value}</option>`).join(''));
}

function initApplyButton() {
    applyButtonElement.onclick = function() {
        const guess = selectedGuess;
        const answer = selectedArea.getAttribute(SVG_PROP_AREA_NAME);

        const areaStatus = getAreaStatus(answer);
        console.log(areaStatus);

        if (areaStatus !== AREA_GUESS_NONE) {
            console.log('Already guessed! No redos!');
            return;
        }

        const correct = guess === answer;
        const areaGuessStatus = correct ? AREA_GUESS_RIGHT : AREA_GUESS_WRONG;
        setAreaGuessStatus(selectedArea, areaGuessStatus);
        console.log(areaGuesses);
        console.log(selectedGuess);
        console.log(answer);
        // console.log(selectedArea);
        // getAreaStatus
    }
}

function initArea(area) {
    area.style.cursor = "pointer";
    area.onclick = function() {
        const areaName = area.getAttribute(SVG_PROP_AREA_NAME);
        if (getAreaStatus(areaName) === AREA_GUESS_NONE) {
            area.style.fill = style.areaFocusColor;
        }

        console.log('You clicked:', areaName);
        zoomToBBox(area.getBBox(), style.zoomPadding);
        selectedArea = area;
    };
}

function setAreaGuessStatus(area, guessStatus) {
    const areaName = area.getAttribute(SVG_PROP_AREA_NAME);
    areaGuesses[areaName] = guessStatus;
    switch (guessStatus) {
        case AREA_GUESS_RIGHT: area.style.fill = style.areaRightColor; break;
        case AREA_GUESS_WRONG: area.style.fill = style.areaWrongColor; break;
        case AREA_GUESS_NONE: area.style.fill = style.areaFocusColor; break;
    }
}

function getAreaStatus(areaName) {
    const areaGuess = areaGuesses[areaName];
    if (areaGuess === undefined) { return AREA_GUESS_NONE; }
    return areaName === areaGuess ? AREA_GUESS_RIGHT : AREA_GUESS_WRONG;
}

function zoomToBBox(bb, pad) {
    const viewBox = [bb.x-pad, bb.y-pad, bb.width+pad*2, bb.height+pad*2].join(' ')
    svgElement.setAttribute("viewBox", viewBox);
}
