export async function doAction(args, fn_callback) {

	if (args.act_msg_quest!='') {
		// ditanya konfirmasi dulu sebelum mulai action
		$ui.ShowMessage("[QUESTION]"+args.act_msg_quest, {
			"OK": async () => {
				action_apiexecute(args, fn_callback);
			},
			"Cancel": () => {}
		});
	} else {
		// langsung jalankan action tanpa di-konfirmasi
		// action_apicall(args, fn_callback);
		action_apiexecute(args, fn_callback);
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


async function action_apiexecute(args, fn_callback) {
	if (args.use_otp) {
		var otpdata =  await $ui.apicall('fgta/framework/fgta4libs/otprequest', {
			param: {
				message: args.otp_message
			}
		});

		args.param.use_otp = args.use_otp;
		args.param.otp = otpdata.value;

		var otptest = otpdata.testingotp ? `<span style="margin-left: 20px">otp: ${otpdata.code}</span>` : ''

		var el_otp_id = 'otp_'+ otpdata.value;
		$ui.ShowMessage(`
			<div style="display: block">
				<div style="font-weight: bold">${args.otp_title}</div>
				<div>masukkan kode yang dikirimkan ke email <b>${otpdata.email}</b></div>
				<div>
					<input id="${el_otp_id}" class="easyui-textbox" style="width: 300px">
				</div>
				<div style="font-style: italic"><span>session: ${otpdata.value}</span>${otptest}</div>
			</div>
		`, {
			'Ok': () => {
				// action_apicall(args, fn_callback);
				var otpcode = $(`#${el_otp_id}`).textbox('getValue');
				args.param.otpcode = otpcode;
				action_apicall(args, fn_callback);
			}
		}, ()=>{
			console.log('view');
			var txt = $(`#${el_otp_id}`).textbox('textbox');
			txt[0].maxLength = 4;
			txt[0].addEventListener('keyup', (ev)=>{
				if (ev.key=='Enter') {
					ev.stopPropagation();
				}
			});
			txt.css('text-align', 'center');
			txt.focus();
		});
	} else {
		action_apicall(args, fn_callback);
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


