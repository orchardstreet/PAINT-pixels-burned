const { abi1, abi2, address1, address2, url, url2, abi3, abi4, address3, address4 } = require('./blockchaincredentials.js');
var Web3 = require('web3');
var web3 = new Web3(url);
var web3_matic = new Web3(url2);
var contract1 = new web3.eth.Contract(abi1, address1);
var contract2 = new web3.eth.Contract(abi2, address2);
var contract3 = new web3_matic.eth.Contract(abi3, address3);
var contract4 = new web3_matic.eth.Contract(abi4, address4);
//console.log(web3_matic)
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
    }).catch(function(err) {
        console.log("aaa", err);
        //  throw err;

    });
}

function failureCallback(error) {
    console.error("Error generating audio file: " + error);
}

function getRemoteTokenTransactionDataForId_matic(tokenId, fromm, tooo) {
    return new Promise(async function(resolve, reject) {
        contract4.getPastEvents('Painted', {
            filter: {
                tokenId: web3_matic.utils.toBN(tokenId)
            },
            fromBlock: fromm,
            toBlock: tooo
        }, function(err, events) {
            if (err) {
                console.log("new request");
                reject(err);
            } else {
                console.log("new request");
                if (events.length == 0) {
                    resolve('nonefound');
                } else {
                    resolve(events[0].returnValues);
                }
            }

        })
    })

}

async function mainn() {
    var latestBlockchainID = await contract1.methods.totalSupply().call();
    for (var i = 0; i <= latestBlockchainID - 1; i++) {
        var temp = await getRemoteTokenTransactionDataForId(i);
        console.log(i + "th Ethereum NFT");
        process(temp.transparentPixelGroups, temp.pixelGroups, temp.pixelData);
    }
    var ethpixels = pixels;
    console.log("NUMBER OF PIXELS on ETH: " + ethpixels);
    console.log("NUMBER OF NFTs PROCESSED FROM ETH: " + (latestBlockchainID - 1));
    var ethtotal = pixels / 2;
    console.log("AMOUNT OF $PAINT BURNED ON ETH: " + ethtotal);

    pixels = 0;
    var latestBlockchainID_matic = await contract3.methods.totalSupply().call().catch(function(err) {
        latestBlockchainID_matic--;
        console.log(err);
    });
    var firstBlock = 13114876;
    var i = 0;
    var x = 0;
    var blockstep = 4000;
    var lastblock = firstBlock + blockstep;
    console.log(latestBlockchainID_matic);
    while (i < latestBlockchainID_matic && firstBlock < 13885818) {
        x++;
        console.log("searching in same block range: " + x + " times");
        var temp2 = await getRemoteTokenTransactionDataForId_matic(i, firstBlock, lastblock).catch(function(err) {
            console.log(err)
        });
        if (temp2 == "nonefound") {
            console.log("\n\n\n\n\n\nNONE FOUND\n\n\n\n\n");
            firstBlock = firstBlock + blockstep;
            lastblock = firstBlock + blockstep;
            console.log("adjusting");
            console.log(firstBlock);
            console.log(lastblock);
        } else {
            //console.log(temp2);
            process(temp2.transparentPixelGroups, temp2.pixelGroups, temp2.pixelData);
            console.log("found and got data for NFT #: " + i);
            i = i + 1;
        }

    }
    var maticpixels = pixels;
    var matictotal = pixels / 2;

    console.log(temp2);
    //var temp2 = await test(i);
    //    var okk = await contract4.getPastEvents('Painted');
    //		process(temp2.transparentPixelGroups,temp2.pixelGroups,temp2.pixelData);
    console.log("NUMBER OF PIXELS on ETH: " + ethpixels);
    console.log("NUMBER OF PIXELS on MATIC: " + maticpixels);
    var pixeltotal = ethpixels + maticpixels;
    console.log("TOTAL NUMBER OF PIXELS: " + pixeltotal);
    console.log("NUMBER OF NFTs PROCESSED FROM ETH: " + (latestBlockchainID - 1));
    console.log("NUMBER OF NFTs PROCESSED FROM MATIC: " + (latestBlockchainID_matic - 1));
    console.log("\n\n\n");
    console.log("AMOUNT OF $PAINT BURNED ON ETH: " + ethtotal);
    console.log("AMOUNT OF $PAINT BURNED ON MATIC: " + matictotal);
    var completetotal = ethtotal + matictotal;
    console.log("\n\n\nTOTAL NUMBER OF PIXELS BURNED: " + completetotal);
}


mainn();


function process(decimalTransparentPixelGroups, decimalPixelGroups, decimalPixelData) {
    //declare variables
    var hexTransparentPixelGroups = [];
    var hexPixelData = [];

    //beginning of pixelData
    if (decimalPixelData.length != 0) {

        //convert decimalPixelData to hex, and leftpad them
        for (var x = 0; x < decimalPixelData.length; x++) {
            hexPixelData.push(decToHex(decimalPixelData[x]));
            hexPixelData[x] = hexPixelData[x].slice(2);
            pixels += Math.ceil(hexPixelData[x].length / 8);
        }
    }


    //beginning of pixel groups
    if (decimalPixelGroups.length != 0) {
        pixels += decimalPixelGroups.length * 32;
    }


    //beginning of hexTransparentPixelGroups
    if (decimalTransparentPixelGroups.length != 0) {

        for (var x = 0; x < decimalTransparentPixelGroups.length; x++) {
            hexTransparentPixelGroups.push(decToHex(decimalTransparentPixelGroups[x]));
            hexTransparentPixelGroups[x] = hexTransparentPixelGroups[x].slice(2);
            if (hexTransparentPixelGroups[x].length % 2 != 0) {
                hexTransparentPixelGroups[x] = "0" + hexTransparentPixelGroups[x];
            }
            for (var y = 0; y < hexTransparentPixelGroups[x].length; y = y + 2) {
                if (hexTransparentPixelGroups[x].slice(y, y + 2) == "00") {
                    //		console.log("hex value of transparenPixelGroups: it's 00");
                } else {
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

//END OF DECTOHEX
