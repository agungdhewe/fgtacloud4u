export async function doAction(args, fn_callback) {

	if (args.act_msg_quest!='') {
		// ditanya konfirmasi dulu sebelum mulai action
		$ui.ShowMessage("[QUESTION]"+args.act_msg_quest, {
			"OK": () => {
				action_apicall(args, fn_callback);
			},
			"Cancel": () => {}
		});
	} else {
		// langsung jalankan action tanpa di-konfirmasi
		action_apicall(args, fn_callback);
	}

}

async function action_start(args) {
	try {
		var result = await $ui.apicall(args.act_url, {
			id: args.id,
			param: args.param
		});

		if (result.errormessage!=null) {
			throw new Error(result.errormessage);
		}
		return result;
	} catch (err) {
		throw err;
	}
}

async function action_apicall(args, fn_callback) {
	var result;
	try {
		result = await action_start(args); 
		if (result.success) {
			fn_callback(null, result)
		} else {
			if (result.errormessage!=null) {
				throw new Error(result.errormessage);
			} else {
				console.log(result);
				throw new Error('error pada saat eksekusi action api');
			}
		}
	} catch (err) {
		if (err.errormessage!=null) {
			fn_callback(new Error(err.errormessage), result)
		} else {
			console.error(err);
			fn_callback(new Error('error pada saat eksekusi action api'), result)
		}
		
	}
}


