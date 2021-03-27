
export function fgta4ParallelProcess (opt) {
	var self = {
		waitfor: {},
		onFinished: () => {}
	}
	Object.assign(self, opt);

	return {
		setFinished: (processid) => {
			self.waitfor[processid] = 0;
			var wait = 0;
			for (var pid in self.waitfor) {
				wait += self.waitfor[pid];
			}
			if (wait==0) {
				if (typeof self.onFinished === 'function') {
					self.onFinished();
				}
			}
		}
	}
}
