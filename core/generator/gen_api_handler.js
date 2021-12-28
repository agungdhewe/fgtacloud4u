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
		// console.log(fsd);

		fsd.script = `<?php namespace FGTA4\\apis;

if (!defined('FGTA4')) {
	die('Forbiden');
}



class ${genconfig.basename}_${fsd.identity}Handler extends WebAPI  {

	public function DataSavedSuccess($result) {
		// $this->caller->log('save success');
	}	
}		
		
		
		`
	} catch (err) {
		throw err
	}

}