export var ajax = {
	post : ajax_post,
	postheader: postheader
}



async function ajax_post(url, postparams, postheaders) {
	var EncodedPostData = encodePostData(postparams);

	try {
		var PostHeaderData = [
			postheader('Content-Type', 'application/x-www-form-urlencoded'),
			postheader('cache-control', 'no-cache, must-revalidate, post-check=0, pre-check=0'),
			postheader('cache-control', 'max-age=0'),
			postheader('expires', '0'),
			postheader('expires', 'Tue, 01 Jan 1980 1:00:00 GMT'),
			postheader('pragma', 'no-cache')
		];
		
		if (Array.isArray(postheaders)) {
			PostHeaderData = PostHeaderData.concat(postheaders);
		}

		var req = await createHttpRequest(url, EncodedPostData, PostHeaderData);
		return req;
	} catch (err) {
		throw err;
	}

}

function postheader(name, value) {
	return {
		name: name,
		value: value
	}
}


function encodePostData(postparams) {
		var urlEncodedDataPairs = [];
		for (var postparamname in postparams) {
			urlEncodedDataPairs.push(encodeURIComponent(postparamname) + '=' + encodeURIComponent(postparams[postparamname]));
		}
		var urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');
		return urlEncodedData;
}

function createHttpRequest(url, urlEncodedData, PostHeaders) {
	var xhr = new XMLHttpRequest();
	return new Promise(function(resolve, reject) {
		xhr.onload = function(ev) {
			if (xhr.status == 200) {
				resolve(xhr.responseText);	
			} else {
				reject(AjaxError('Error on http request', {
					xhr_loaded: true,
					xhr_status: xhr.status,
					xhr_statustext: xhr.statusText,
					xhr_responsetext: xhr.responseText
				}));
			}
		}

		xhr.onprogress = function(ev) {
		}


		xhr.ontimeout = function(ev) {
			reject(AjaxError('timeout on ajax request', {}));
		}

		xhr.onerror = function(ev) {
			reject(AjaxError('error on ajax request', {}));
		}

		// eksekusi
		xhr.open("POST", url, true);
		for (var header of PostHeaders) {
			xhr.setRequestHeader(header.name, header.value);
		}
		xhr.send(urlEncodedData);
	})
}


function AjaxError(message, info) {
	var err = new Error(message);
	err.xhr_loaded = false;
	if (typeof info === 'object') {
		Object.assign(err, info);
	}
	return err;
}