
export function fgta4report(report, opt) {
	let self = this

	self.iframe = report[0];
	self.OnReportLoaded = () => {}

	init(self)
	return {
		getIframe : () => { return self.iframe },
		load : (url) => { rpt_load(self, url) },
		print: () => { rpt_print(self)  },
		OnReportLoaded : () => {}
	}
};


function init(self) {
	self.iframe.onload = () => {
		console.log('test');
		self.iframe.contentWindow.document.body.style.backgroundColor = '#fff';
		if (typeof self.OnReportLoaded === 'function') {
			self.OnReportLoaded();
		}
	}

}


function rpt_load(self, url) {
	// console.log('ope page', url)
	self.iframe.src = url;
}


function rpt_print(self) {
	self.iframe.contentWindow.print();
}
