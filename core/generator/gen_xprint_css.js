const path = require('path')
const fs = require('fs')

const colReset = "\x1b[0m"
const colFgRed = "\x1b[31m"
const colFgGreen = "\x1b[32m"
const colFgYellow = "\x1b[33m"
const colFgBlack = "\x1b[30m"
const colBright = "\x1b[1m"
const BgYellow = "\x1b[43m"

module.exports = async (fsd, genconfig) => {
	try {
		console.log(`-----------------------------------------------`)
		console.log(`Generate XPRINT CSS...`)


		var script = `/* CSS For printing purpose*/

.rptdata-col-no {
	width: 10mm
}

.rptdata-col-descr {
	font-style: italic;
}

.rowfoot {
	font-weight: bold;
}				
		
`;
	
		fsd.script = script
	} catch (err) {
		throw err
	}
}