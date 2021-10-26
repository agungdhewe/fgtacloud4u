
export function fgta4report(report, opt) {
	let self = this

	self.iframe = report[0];
	self.OnReportLoaded = opt.OnReportLoaded

	init(self)
	return {
		getIframe : () => { return self.iframe },
		load : (module, args) => { rpt_load(self, module, args) },
		print: () => { rpt_print(self)  },
		export: (tablename, filename, sheetname, params) => { rpt_export(self, tablename, filename, sheetname, params) },
	}
};


function init(self) {
	self.iframe.onload = () => {
		console.log('test');
		self.iframe.contentWindow.document.body.style.backgroundColor = '#fff';
		if (typeof self.OnReportLoaded === 'function') {
			self.OnReportLoaded(self.iframe);
		}
	}

}


async function rpt_load(self, module, args) {
	try {
		console.log(module);
		var content = await openpage(self, module, args);

		var binaryData = [];
		binaryData.push(content);

		var data_url = URL.createObjectURL(new Blob(binaryData, {type: "text/html"}));
		self.iframe.src = data_url;


		
	} catch (err) {
		$ui.ShowMessage('[ERROR]'.err.message);
	}
}


function rpt_print(self) {
	self.iframe.contentWindow.print();
}


async function openpage(self, api, args) {

	let postparams = {}
	for (let paramname in args) {
		// console.log(paramname, typeof args[paramname])
		if (typeof args[paramname] === 'object') {
			postparams[paramname] = JSON.stringify(args[paramname])
		} else {
			postparams[paramname] = args[paramname]
		}
		
	}



	let apiurl = `index.php/printout/${api}`

	console.log(apiurl);
	console.log(postparams);

	
	let ajax = async (apiurl, postparams, otp) => {
		let urlEncodedDataPairs = [];
		for (let postparamname in postparams) {
			urlEncodedDataPairs.push(encodeURIComponent(postparamname) + '=' + encodeURIComponent(postparams[postparamname]));
		}
		let urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');
		

		return new Promise(function(resolve, reject) {
			let xhr = new XMLHttpRequest();
			xhr.onreadystatechange= function () {
				if (xhr.readyState==4) {

					try {
						var xhr_response = xhr.response;	
						if (otp.encrypt) {
							if ($ui.Crypto===undefined) {
								$ui.Crypto = new Encryption();
							}
							xhr_response = $ui.Crypto.decrypt(xhr_response, otp.password);							
						}



						if (xhr.status==200) {
							resolve(xhr_response)
						} else {
							if (xhr.status==401) {
								// user sessionn ya habis, diredirek ke halaman login
								$ui.ShowMessage(xhr_response);								
							}
							throw new Error('Session telah habis, silakan login ulang');
						}
						
					} catch (err) {
						reject(err)
					}
				}
			}			



			xhr.open("POST", apiurl, true);
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.setRequestHeader('cache-control', 'no-cache, must-revalidate, post-check=0, pre-check=0');
			xhr.setRequestHeader('cache-control', 'max-age=0');
			xhr.setRequestHeader('expires', '0');
			xhr.setRequestHeader('expires', 'Tue, 01 Jan 1980 1:00:00 GMT');
			xhr.setRequestHeader('pragma', 'no-cache');
			xhr.setRequestHeader('otp', otp.value);


			if (otp.encrypt) {
				xhr.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8');
				if ($ui.Crypto===undefined) {
					$ui.Crypto = new Encryption();
				}
				urlEncodedData = $ui.Crypto.encrypt(urlEncodedData, otp.password);
			} else {
				xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');	
			}


			if (Cookies.get('tokenid')!==undefined) {
				xhr.setRequestHeader("tokenid", Cookies.get('tokenid'));
			}
			
			xhr.send(urlEncodedData);			
		})
	}


	try {
		var otp = await getOtp(api);
		var content =  await ajax(apiurl, postparams, otp);
		return content;
	} catch (err) {
		throw err
	}


}




async function getOtp(apipath) {
	var otp_skel = {
		success: false,
		value: '',
		encrypt: false,
		password: ''
	}

	var apiurl = `getotp.php?api=${apipath}`
	var ajax_otp = async (apiurl) => {
		return new Promise(function(resolve, reject) {
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange= function () {
				if (xhr.readyState==4) {
					var otp = Object.assign({}, otp_skel);
					try {
						if (xhr.response!==null) {
							if (xhr.response.trim()!='') {
								Object.assign(otp, JSON.parse(xhr.response))
							}
						}
						resolve(otp)
					} catch (err) {
						reject(err)
					}
				}	
			};

			xhr.open("GET", apiurl, true);
			if (Cookies.get('tokenid')!==undefined) {
				xhr.setRequestHeader("tokenid", Cookies.get('tokenid'));
			}
			xhr.send();
		});
	}

	try {
		var useotp = window.global.useotp;
		var otp = {};

		if (useotp) {
			otp = await ajax_otp(apiurl);
		} else {
			otp = Object.assign({}, otp_skel);
			otp.success = true;
		}
		
		if (otp.success!==true) {
			throw new Error('request OTP error\r\n ' + otp.errormessage);
		}
		return otp;

	} catch (err) {
		throw err;
	}
}



function rpt_export(self, tablename, filename, sheetname, params) {
	var iframe = self.iframe;
	var obj = iframe.contentWindow.document.getElementById(tablename);

	let table = obj.cloneNode(true);;
	var tds = table.querySelectorAll('td[data-t="n"]');
	for (var td of tds) {
		td.innerHTML = td.innerHTML.replace(/,/g,''); //replaces , globally
		td.innerHTML = td.innerHTML.replace(/>-</g,'><'); //replaces cells only containing - globally
	}
	TableToExcel.convert(table, {
		name: filename,
		sheet: {
		  name: sheetname==null ? 'Sheet1' : sheetname
		}
	});
}