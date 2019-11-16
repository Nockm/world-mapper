/*
    DOM Navigation
*/

const elements = {
    svgObject: document.getElementById("worldSvg"),
    guessSelect: document.getElementById("guessSelect"),
    makeGuessButton: document.getElementById("makeGuessButton"),
};

const SVG_OBJECT_TO_ELEMENT = (x) => x.contentDocument.children[0];
const SVG_ELEMENT_TO_AREAS = (x) => x.children[1].children;
const SVG_PROP_AREA_NAME = "title";

const AREA_GUESS_STATUS_NONE = null;
const AREA_GUESS_STATUS_RIGHT = true;
const AREA_GUESS_STATUS_WRONG = false;
const AREA_NULL = '-- Guess --';

const styles = {
    areaFocusColor: 'gray',
    areaRightColor: 'green',
    areaWrongColor: 'red',
    zoomPadding: 200,
};

/*
    State
*/

let svgElement;
let areas;
let currentArea;
let currentGuess;
const guesses = {};

/*
    Init
*/

elements.svgObject.addEventListener("load",function() {
    init();
}, false);

function init() {
    // Get the <svg> element inside the .svg file.
    svgElement = SVG_OBJECT_TO_ELEMENT(elements.svgObject);

    // Get the <path> elements that represent the areas.
    areas = Array.from(SVG_ELEMENT_TO_AREAS(svgElement));
    areas.map((area) => {
        area.style.cursor = "pointer";
        area.onclick = () => setCurrentArea(area);
    });

    // Fill the guess combobox with area names.
    const areaNames = areas.map((area) => area.getAttribute(SVG_PROP_AREA_NAME))
    elements.guessSelect.innerHTML = [`<option>${AREA_NULL}</option>`].concat(areaNames.map((areaName) => `<option>${areaName}</option>`).join(''));
    elements.guessSelect.onchange = (ev) => {
        currentGuess = ev.currentTarget.value;
    }

    elements.makeGuessButton.onclick = () => { makeGuess(); }
}

/*
    Behaviour
*/

function setCurrentArea(area) {
    currentArea = area;

    const areaName = area.getAttribute(SVG_PROP_AREA_NAME);
    if (getAreaAttemptStatus(areaName) === AREA_GUESS_STATUS_NONE) {
        area.style.fill = styles.areaFocusColor;
    }

    console.log('You clicked:', areaName);
    zoomToBBox(area.getBBox(), styles.zoomPadding);
}

function makeGuess() {
    const currentAreaName = currentArea.getAttribute(SVG_PROP_AREA_NAME);
    if (areaAlreadyAttempted(currentAreaName)) {
        console.log('Already guessed! No redos!');
        return;
    }

    const areaName = currentArea.getAttribute(SVG_PROP_AREA_NAME);
    const status = currentGuess === currentAreaName ? AREA_GUESS_STATUS_RIGHT : AREA_GUESS_STATUS_WRONG;
    guesses[areaName] = status;

    switch (status) {
        case AREA_GUESS_STATUS_RIGHT: currentArea.style.fill = styles.areaRightColor; break;
        case AREA_GUESS_STATUS_WRONG: currentArea.style.fill = styles.areaWrongColor; break;
        case AREA_GUESS_STATUS_NONE: currentArea.style.fill = styles.areaFocusColor; break;
    }
}

function areaAlreadyAttempted(areaName) {
    return getAreaAttemptStatus(areaName) !== AREA_GUESS_STATUS_NONE;
}

function getAreaAttemptStatus(areaName) {
    const attempt = guesses[areaName];
    if (attempt === undefined) { return AREA_GUESS_STATUS_NONE; }
    return areaName === attempt ? AREA_GUESS_STATUS_RIGHT : AREA_GUESS_STATUS_WRONG;
}

function zoomToBBox(bb, pad) {
    const viewBox = [bb.x-pad, bb.y-pad, bb.width+pad*2, bb.height+pad*2].join(' ')
    svgElement.setAttribute("viewBox", viewBox);
}
