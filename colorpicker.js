let BACKGROUND;
let FOREGROUND;

function refresh() {
    document.body.style.background = BACKGROUND;
    document.body.style.color = FOREGROUND;
    const colorCodes = document.getElementsByClassName("colorCode");
    for (let i = 0; i < colorCodes.length; i++) {
        colorCodes[i].style.background = BACKGROUND;
        colorCodes[i].style.color = FOREGROUND;
        const examples = document.getElementsByClassName(`example ${i.toString()}`);
        for (let j = 0; j < examples.length; j++) {
            if (examples[j].nodeName === "span") {
                examples[j].style.background = colorCodes[i].value;
            } else {
                examples[j].style.color = colorCodes[i].value;
            }
        }
    }
}

function decToHex(n) {
    const hex = n.toString(16);
    return (hex.length === 1 ? "0".concat(hex) : hex);
}

function hexToDec(h) {
    const index = "0123456789ABCDEF";
    const dec = index.indexOf(h[0].toUpperCase());
    const len = h.length;
    return (
        len === 1 ?
            dec
            :
            dec * 16 ** (len - 1) + hexToDec(h.substring(1)) * 16 ** (len - 2)
    );
}

function rgbToHex(r, g, b) {
    return "#".concat(decToHex(r), decToHex(g), decToHex(b));
}

function sliderRGB(colorBlock) {
    const hex = rgbToHex(Number(colorBlock.querySelector(".red").value)
        , Number(colorBlock.querySelector(".green").value)
        , Number(colorBlock.querySelector(".blue").value)
    );
    setRGB(colorBlock, hex);
    refresh();
}

function textRGB(colorBlock) {
    let hex = colorBlock.querySelector(".colorCode").value;
    hex = (
        hex[0] !== "#" ?
            "#".concat(hex)
            :
            hex
    );
    setRGB(colorBlock, hex);
    refresh();
}

function setCode(id, hex) {
    const searchField = `example${id.toString()}Xcode`.replace(/\s+/g, '');
    const code = document.getElementById(searchField);
    code.textContent = code.textContent.replace(/#....../, hex.toString());
}

function setRGB(colorBlock, hex) {
    colorBlock.style.background = hex;
    colorBlock.style.color = tinycolor(hex).isDark() ? "white" : "black";
    colorBlock.querySelector(".red").value = hexToDec(hex.substring(1, 3));
    colorBlock.querySelector(".green").value = hexToDec(hex.substring(3, 5));
    colorBlock.querySelector(".blue").value = hexToDec(hex.substring(5, 7));
    colorBlock.querySelector(".colorCode").value = hex.toUpperCase();
    if (colorBlock.id === "colorBBlock") {
        BACKGROUND = hex;
    }
    if (colorBlock.id === "colorFBlock") {
        FOREGROUND = hex;
        colorBlock.style.color = BACKGROUND;
    }
    setCode(
        colorBlock.id
            .replace("color", '')
            .replace("Block", "")
        , hex);
}

function generateHTMLSlider(id, focusColor) {
    String.prototype.capitalize = function () {
        return `${this.charAt(0).toUpperCase()}${this.slice(1)}`;
    };
    return (
        `<input id='color ${id.toString()} ${focusColor.capitalize()}' ` +
        `class='slider ${focusColor}' ` +
        `type='range' ` +
        `min=0 ` +
        `max=255 ` +
        `step=1 ` +
        `onchange='sliderRGB(this.parentElement)' ` +
        `oninput='sliderRGB(this.parentElement)'` +
        `/>`
    );
}

function makeBlock(id, name) {
    const newBlock = document.createElement("div");
    newBlock.id = `color ${id.toString()} Block`;
    newBlock.classList.add("colorBlock");
    newBlock.innerHTML = (
        `<input id='color ${id.toString()} Code' ` +
        `class='colorCode' ` +
        `type='text' ` +
        `oninput='textRGB(this.parentElement)' /> ` +
        `${generateHTMLSlider(id, 'red')} ` +
        `${generateHTMLSlider(id, 'green')} ` +
        `${generateHTMLSlider(id, 'blue')}`
    );
    const label = document.createElement("p");
    label.id = `color${id.toString()}Name`;
    label.classList.add("colorName");
    label.innerHTML = `color ${id.toString()} : ${name.toString()}`;
    newBlock.appendChild(label);
    return newBlock;
}

function makeSpan(id, hex) {
    const s = document.createElement("span");
    s.id = "example" + id.toString();
    s.classList.add("example", id.toString());
    s.innerHTML = "&emsp;&emsp;";
    s.style.background = hex;
    return s;
}

function makeCode(id, hex, name) {
    const c = document.createElement("p");
    c.id = `example${id.toString()}Xcode`;
    c.classList.add("example", id.toString(), "Xcode");
    c.innerHTML = `*.${name.toString()} : ${hex.toString()}`;
    return c;
}

function init() {
    const colorsArray = [
        ['black', '#000000'],
        ['red', '#800000'],
        ['green', '#008000'],
        ['yellow', '#808000'],
        ['blue', '#000080'],
        ['purple', '#800080'],
        ['cyan', '#008080'],
        ['white', '#C0C0C0'],
        ['black2', '#808080'],
        ['red2', '#FF0000'],
        ['green2', '#00FF00'],
        ['yellow2', '#FFFF00'],
        ['blue2', '#0000FF'],
        ['purple2', '#FF00FF'],
        ['cyan2', '#00FFFF'],
        ['white2', '#FFFFFF']
    ];
    const blockContainer = document.getElementById("blockContainer");
    const spanContainer = document.getElementById("spanContainer");
    const codeContainer = document.getElementById("xcodeContainer");
    for (let i = 0; i < colorsArray.length; i++) {
        let newBlock = makeBlock(i, colorsArray[i][0]);
        let s = makeSpan(i, colorsArray[i][1]);
        let c = makeCode(i, colorsArray[i][1], `color${i.toString()}`);
        blockContainer.appendChild(newBlock);
        spanContainer.appendChild(s);
        codeContainer.appendChild(c);
        setRGB(newBlock, colorsArray[i][1].toString());
    }
    //generate Background and Foreground
    const bg = makeBlock("B", "background");
    bg.lastChild.innerText = "background";
    blockContainer.appendChild(bg);
    codeContainer.appendChild(makeCode("B", "#000000", "background"));
    setRGB(bg, "#000000");
    const fg = makeBlock("F", "foreground");
    fg.lastChild.innerText = "foreground";
    blockContainer.appendChild(fg);
    codeContainer.appendChild(makeCode("F", "#FFFFFF", "foreground"));
    setRGB(fg, "#FFFFFF");
    refresh();
}
