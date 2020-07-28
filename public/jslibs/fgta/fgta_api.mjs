import { ajax } from './fgta_ajax.mjs';



var api = {
	call : api_call
}

api.useMessager = function(obj) {
	api.Messager = obj;
}


export { api }




async function api_call(apiname, data) {
	var apiurl = `index.php/api/${apiname}`;
	var postparams = getFlatArrayPostData(data);
	var postheader = [];

	try {
 		if (Cookies.get('tokenid')!==undefined) {
			postheader.push(ajax.postheader('tokenid', Cookies.get('tokenid')));
		}

		var otp = await getOtp(apiname, postheader);
		postheader.push(ajax.postheader('otp', otp.value));

		var ajaxresult = await ajax.post(apiurl, postparams, postheader);
		var result = getApiResult(ajaxresult, apiname);
		return result;
	} catch (err) {
		throw(getActualError(err));
	}
}



async function getOtp(apiname, postheader) {
	var getotpurl = `getotp.php?api=${apiname}`;
	var otp_skel = {
		success: false,
		value: '',
		encrypt: false,
		password: ''
	}
	
	try {
		var ajaxresult = await ajax.post(getotpurl, {}, postheader);
		var otp = Object.assign(otp_skel, JSON.parse(ajaxresult));
		if (!otp.success) {
			if (otp.errormessage!='') {
				throw new Error(otp.errormessage);
			} else {
				throw new Error('OTP request Error');
			}
		}
		return otp;
	} catch (err) {
		throw err;
	}
}



function getFlatArrayPostData(data) {
	var postparams = {}
	for (var paramname in data) {
		if (typeof data[paramname] === 'object') {
			postparams[paramname] = JSON.stringify(data[paramname])
		} else {
			postparams[paramname] = data[paramname]
		}
	}
	return postparams;
}


function getApiResult(ajaxresult, apiname) {
	try {
		var r = JSON.parse(ajaxresult);
		if (r.output!="") {
			console.warn(r.output);
			if (r.debugoutput===true) {
				showDebugOutput(r.output, apiname);
				var err = new Error();
				err.debuging = true;
				throw err;
			}
		}
		return r.result;		
	} catch (err) {
		if (err.debuging!==true) {
			console.log(ajaxresult);
			console.error(err);
		}
		throw err;
	}
}


function getActualError(err) {
	if (err.xhr_loaded===true) {
		if (err.xhr_responsetext!==undefined) {
			try {
				var e = JSON.parse(err.xhr_responsetext);
				err.message = e.errormessage;
			} catch (err) {
				// showDebugOutput(err.xhr_responsetext, 'Result');
				console.log(err.xhr_responsetext);
				console.error(err);
			}
		}
	}
	return err;
}

function showDebugOutput(text, apiname) {
	if (api.Messager!==undefined) {
		api.Messager.Debug(text, apiname);
	}
}