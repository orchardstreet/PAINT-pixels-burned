const { abi1, abi2, address1, address2, url } = require('./blockchaincredentials.js');
const dotenv = require('dotenv').config();
var Web3 = require('web3');
var web3 = new Web3(url);
var contract1 = new web3.eth.Contract(abi1, address1);
var contract2 = new web3.eth.Contract(abi2, address2);

var pixels = 0;

function getRemoteTokenTransactionDataForId(tokenId) {
    return new Promise(function(resolve, reject) {
        contract2
            .getPastEvents('Painted', {
                filter: {
                    tokenId: web3.utils.toBN(tokenId)
                },
                fromBlock: 'earliest',
                toBlock: 'latest'
            })
            .then(async function(events) {
                if (events.length == 0) {
                    reject('No events found')
                } else {
                    resolve(events[0].returnValues)
                }
            })
    })
}

async function mainn() {
    var latestBlockchainID = await contract1.methods.totalSupply().call();
        for (var i = 0; i <= latestBlockchainID - 1;  i++) {
                var temp = await getRemoteTokenTransactionDataForId(i);
		//console.log(temp.transparentPixelGroups);
		process(temp.transparentPixelGroups,temp.pixelGroups,temp.pixelData);
		//console.log("Processed NFT id #: " + i + "out of " + latestBlockchainID);
		console.log(i + "th NFT");
        }
	console.log("NUMBER OF PIXELS: " + pixels/2);
}


mainn();



function leftpadwithzeros(num, str) {
	  var pad = Array(num + 1).join('0');
		      return (pad + str);
			        return (str + pad).substring(0, pad.length);
}


function process(decimalTransparentPixelGroups,decimalPixelGroups,decimalPixelData) {
//	    document.getElementById("response").innerHTML = "";
//declare variables
var hexTransparentPixelGroups = [];
var hexPixelData = [];

//beginning of pixelData
if (decimalPixelData.length != 0) {

    //convert decimalPixelData to hex, and leftpad them
    for (var x = 0; x < decimalPixelData.length; x++) {
        hexPixelData.push(decToHex(decimalPixelData[x]));
        hexPixelData[x] = hexPixelData[x].slice(2);
	var remainder2 = hexPixelData[x].length % 8;
	if (remainder2) {
            hexPixelData[x] = leftpadwithzeros(8-remainder2,hexPixelData[x]);
	}
	    pixels += hexPixelData[x].length / 8;
    }
}


//beginning of pixel groups
if (decimalPixelGroups.length != 0) {
    for (var x = 0; x < decimalPixelGroups.length; x++) {
	    pixels += 32;
    }
}


//beginning of hexTransparentPixelGroups
if (decimalTransparentPixelGroups.length != 0 ) {
    //convert decimaltransparentpixelgroups to hex, and leftpad them
    for (var x = 0; x < decimalTransparentPixelGroups.length; x++) {
        hexTransparentPixelGroups.push(decToHex(decimalTransparentPixelGroups[x]));
        hexTransparentPixelGroups[x] = hexTransparentPixelGroups[x].slice(2);
	var length4 = hexTransparentPixelGroups[x].length;
        if (length4 < 64) {
	    var difference = 64 - length4;
	    hexTransparentPixelGroups[x] = leftpadwithzeros(difference,hexTransparentPixelGroups[x]);
	    }
    }


    for (var x = 0; x < decimalTransparentPixelGroups.length; x++) {
        for (var y = 0; y < hexTransparentPixelGroups[x].length; y = y + 2) {
		if (hexTransparentPixelGroups[x].slice(y,y+2) == "00")
		{
	//		console.log("hex value of transparenPixelGroups: it's 00");
		} else {
	//	console.log("hex value of transparentPixelGroups: " + hexToDec(hexTransparentPixelGroups[x].slice(y,y+2)));
		pixels++;
		}
        }
    }
    //closing tag forr transparentpixelgroups
}
console.log("finished processing");
}


//decToHex function
//From http://www.danvk.org/hex2dec.html
/**
 * A function for converting hex <-> dec w/o loss of precision.
 *
 * The problem is that parseInt("0x12345...") isn't precise enough to convert
 * 64-bit integers correctly.
 *
 * Internally, this uses arrays to encode decimal digits starting with the least
 * significant:
 * 8 = [8]
 * 16 = [6, 1]
 * 1024 = [4, 2, 0, 1]
 */
// Adds two arrays for the given base (10 or 16), returning the result.
// This turns out to be the only "primitive" operation we need.

function add(x, y, base) {
    var z = [];
    var n = Math.max(x.length, y.length);
    var carry = 0;
    var i = 0;
    while (i < n || carry) {
        var xi = i < x.length ? x[i] : 0;
        var yi = i < y.length ? y[i] : 0;
        var zi = carry + xi + yi;
        z.push(zi % base);
        carry = Math.floor(zi / base);
        i++;
    }
    return z;
}
// Returns a*x, where x is an array of decimal digits and a is an ordinary
// JavaScript number. base is the number base of the array x.
function multiplyByNumber(num, x, base) {
    if (num < 0) return null;
    if (num == 0) return [];

    var result = [];
    var power = x;
    while (true) {
        if (num & 1) {
            result = add(result, power, base);
        }
        num = num >> 1;
        if (num === 0) break;
        power = add(power, power, base);
    }

    return result;
}

function parseToDigitsArray(str, base) {
    var digits = str.split('');
    var ary = [];
    for (var i = digits.length - 1; i >= 0; i--) {
        var n = parseInt(digits[i], base);
        if (isNaN(n)) return null;
        ary.push(n);
    }
    return ary;
}

function convertBase(str, fromBase, toBase) {
    var digits = parseToDigitsArray(str, fromBase);
    if (digits === null) return null;

    var outArray = [];
    var power = [1];
    for (var i = 0; i < digits.length; i++) {
        // invariant: at this point, fromBase^i = power
        if (digits[i]) {
            outArray = add(outArray, multiplyByNumber(digits[i], power, toBase), toBase);
        }
        power = multiplyByNumber(fromBase, power, toBase);
    }
    var out = '';
    for (var i = outArray.length - 1; i >= 0; i--) {
        out += outArray[i].toString(toBase);
    }
    return out;
}

function decToHex(decStr) {
    var hex = convertBase(decStr, 10, 16);
    return hex ? '0x' + hex : null;
}

function hexToDec(hexStr) {
    if (hexStr.substring(0, 2) === '0x') hexStr = hexStr.substring(2);
    hexStr = hexStr.toLowerCase();
    return convertBase(hexStr, 16, 10);
}
//END OF DECTOHEX
