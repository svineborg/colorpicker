var BACKGROUND;
var FOREGROUND;

var refresh = function(){
	document.body.style.background = BACKGROUND;
	document.body.style.color = FOREGROUND;
	var colorCodes = document.getElementsByClassName("colorCode");
	for(var i = 0; i < colorCodes.length; i++){
		colorCodes[i].style.background = BACKGROUND;
		colorCodes[i].style.color = FOREGROUND;
		var examples = document.getElementsByClassName("example " + i.toString());
		for(var j = 0; j < examples.length; j++){
			if( examples[j].nodeName == "span" ){
				examples[j].style.background = colorCodes[i].value;
			} else {
				examples[j].style.color = colorCodes[i].value;
			}
		}
	}
};

var decToHex = function(n) {
	var hex = n.toString(16);
	return (hex.length == 1 ? "0".concat(hex) : hex);
};

var hexToDec = function(h) {
	var index = "0123456789ABCDEF";
	var dec = index.indexOf(h[0].toUpperCase());
	var len = h.length;
	return (len == 1 ? dec : dec * 16**(len-1) + hexToDec(h.substring(1)) * 16**(len-2));
};

var rgbToHex = function(r,g,b){
	var hex = "#".concat(decToHex(r),decToHex(g),decToHex(b));
	return hex;
};

var sliderRGB = function(colorBlock){
	var hex = rgbToHex(Number(colorBlock.querySelector(".red").value)
		,Number(colorBlock.querySelector(".green").value)
		,Number(colorBlock.querySelector(".blue").value)
	);
	setRGB(colorBlock,hex);
	refresh();
};

function textRGB(colorBlock){
	var hex = colorBlock.querySelector(".colorCode").value;
	hex = (hex[0] != "#" ? "#".concat(hex) : hex );
	setRGB(colorBlock,hex);
	refresh();
}

function setCode(id,hex){
	code = document.getElementById("example"+id.toString()+"Xcode");
	code.textContent = code.textContent.replace(/#....../,hex.toString());
}

function setRGB(colorBlock,hex){
	colorBlock.style.background = hex;
	colorBlock.querySelector(".red").value = hexToDec(hex.substring(1,3));
	colorBlock.querySelector(".green").value = hexToDec(hex.substring(3,5));
	colorBlock.querySelector(".blue").value = hexToDec(hex.substring(5,7));
	colorBlock.querySelector(".colorCode").value = hex.toUpperCase();
	if(colorBlock.id == "colorBBlock" ){ BACKGROUND = hex;}
	if(colorBlock.id == "colorFBlock" ){ 
		FOREGROUND = hex;
		colorBlock.style.color = BACKGROUND;
	}
	setCode(colorBlock.id.replace("color",'').replace("Block",""),hex);
}

function makeBlock(id,name){
	var newBlock = document.createElement("div");
	newBlock.id = "color" + id.toString() + "Block";
	newBlock.classList.add("colorBlock");
	newBlock.innerHTML = ("<input id='color" + id.toString() + "Code' class='colorCode' type='text' oninput='textRGB(this.parentElement)'></input><input id='color" + id.toString()  + "Red' class='slider red' type='range' min=0 max=255 step=1 onchange='sliderRGB(this.parentElement)' oninput='sliderRGB(this.parentElement)'/><input id='color" + id.toString()  + "Green' class='slider green' type='range' min=0 max=255 step=1 onchange='sliderRGB(this.parentElement)' oninput='sliderRGB(this.parentElement)'/><input id='color" + id.toString()  + "Blue' class='slider blue' type='range' min=0 max=255 step=1 onchange='sliderRGB(this.parentElement)' oninput='sliderRGB(this.parentElement)'/>");
	var label = document.createElement("p");
	label.id = "color" + id.toString() + "Name";
	label.classList.add("colorName");
	label.innerHTML = "color " + id.toString() + ": " + name.toString();
	newBlock.appendChild(label);
	return newBlock;
}

function makeSpan(id,hex){
	var s = document.createElement("span");
	s.id = "example" + id.toString();
	s.classList.add("example",id.toString());
	s.innerHTML = "&emsp;&emsp;";
	s.style.background = hex;
	return s;
}

function makeCode(id,hex,name){
	var c = document.createElement("p");
	c.id = "example" + id.toString() + "Xcode";
	c.classList.add("example",id.toString(),"Xcode");
	c.innerHTML = "*." + name.toString() + " : " + hex.toString();
return c;
}

function init(){
	colorsArray = [
		['black','#000000']
		,['red','#800000']
		,['green','#008000']
		,['yellow','#808000']
		,['blue','#000080']
		,['purple','#800080']
		,['cyan','#008080']
		,['white','#C0C0C0']
		,['black2','#808080']
		,['red2','#FF0000']
		,['green2','#00FF00']
		,['yellow2','#FFFF00']
		,['blue2','#0000FF']
		,['purple2','#FF00FF']
		,['cyan2','#00FFFF']
		,['white2','#FFFFFF']
	];
	var blockContainer = document.getElementById("blockContainer");
	var spanContainer = document.getElementById("spanContainer");
	var codeContainer = document.getElementById("xcodeContainer");
	for(var i = 0; i < colorsArray.length; i++){
		var newBlock = makeBlock(i,colorsArray[i][0]);
		var s = makeSpan(i,colorsArray[i][1]);
		var c = makeCode(i,colorsArray[i][1],"color" + i.toString());
		blockContainer.appendChild(newBlock);
		spanContainer.appendChild(s);
		codeContainer.appendChild(c);
		setRGB(newBlock,colorsArray[i][1].toString());
	}
	//generate Background and Foreground
	var bg = makeBlock("B","background");
	bg.lastChild.innerText = "background";
	blockContainer.appendChild(bg);
	codeContainer.appendChild(makeCode("B","#000000","background"));
	setRGB(bg,"#000000");
	var fg = makeBlock("F","foreground");
	fg.lastChild.innerText = "foreground";
	blockContainer.appendChild(fg);
	codeContainer.appendChild(makeCode("F","#FFFFFF","foreground"));
	setRGB(fg,"#FFFFFF");
	refresh();
}
