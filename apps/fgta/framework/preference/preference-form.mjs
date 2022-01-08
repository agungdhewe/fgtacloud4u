var this_page_id;
var this_page_options;



const btn_password_change = $('#pnl_form-btn_password_change')
const btn_picture_change = $('#pnl_form-btn_picture_change')
const btn_password_update = $('#pnl_form-btn_password_update')
const btn_picture_update = $('#pnl_form-btn_picture_update');

const pnl_form = $('#pnl_form-form');
const obj = {
	txt_user_id : $('#pnl_form-txt_user_id'),
	txt_user_name: $('#pnl_form-txt_user_name'),
	txt_user_fullname: $('#pnl_form-txt_user_fullname'),
	txt_user_email: $('#pnl_form-txt_user_email'),
	txt_password_previous: $('#pnl_form-txt_password_previous'),
	txt_password_new: $('#pnl_form-txt_password_new'),
	txt_password_confirm: $('#pnl_form-txt_password_confirm'),
	fl_profile_picture: $('#pnl_form-fl_profile_picture')
}


let form;
let rowdata;

export async function init(opt) {
	this_page_id = opt.id;
	this_page_options = opt;


	form = new global.fgta4form(pnl_form, {
		primary: obj.txt_merchitem_id,
		autoid: true,
		logview: 'mst_merchitem',
		btn_edit: $('<a>edit</a>'),
		btn_save: $('<a>save</a>'),
		btn_delete: $('<a>delete</a>'),		
		objects : obj
	});

	setTimeout(async ()=>{
		await getCurrentProfileData();
		
		form.setViewMode(false);
	}, 500);
	

	btn_password_change.linkbutton({
		onClick: () => { btn_password_change_click() }
	});

	btn_picture_change.linkbutton({
		onClick: () => { btn_picture_change_click() }
	})

	btn_password_update.linkbutton({
		onClick: () => { btn_password_update_click() }
	})

	btn_picture_update.linkbutton({
		onClick: () => { btn_picture_update_click() }
	})
}



function btn_password_change_click() {
	var opt = btn_password_change.linkbutton('options');
	$('.updater-container').hide();
	if (opt.selected) {
		btn_picture_change.linkbutton('unselect');
		$('#pnl_form-passwordupdate').show();
	}
}

function btn_picture_change_click() {
	var opt = btn_picture_change.linkbutton('options');
	$('.updater-container').hide();
	if (opt.selected) {
		btn_password_change.linkbutton('unselect');
		$('#pnl_form-pictureupdate').show();
	}
}

async function getCurrentProfileData() {
	var apiurl = `${global.modulefullname}/get_current_profile`
	var args = {param:{}}

	try {
		var result = await $ui.apicall(apiurl, args);

		if (result.success===true) {
			form.setValue(obj.txt_user_id, result.userinfo.user_id);
			form.setValue(obj.txt_user_name, result.userinfo.user_name);
			form.setValue(obj.txt_user_fullname, result.userinfo.user_fullname);
			form.setValue(obj.txt_user_email, result.userinfo.user_email);
		
			var groupinfo = "<ul>";
			for (var group of result.groupinfo) {
				groupinfo += `<li>${group.group_name}</li>`;
			}
			groupinfo += "</ul>";
			$('#pnl_form-groupinfo').html(groupinfo);

			$("#pnl_form-profilepicture").attr("src", "index.php/profilepicture/" + result.userinfo.user_id);

		
		}
	} catch (err) {
		console.error(err);
		$ui.ShowMessage('[ERROR] Cannot load profile');
	}
}


async function btn_password_update_click() {

	try {


		

		try {
			var pasword_new = form.getValue(obj.txt_password_new);
			var password_confirm = form.getValue(obj.txt_password_confirm);
			var password_previous =  form.getValue(obj.txt_password_previous);
			
			if (pasword_new!=password_confirm) {
				throw new Error('Konfirmasi Password tidak sama dengan password baru');
			}

		}  catch (err) {
			$ui.ShowMessage('[ERROR] ' + err.message);
			return;
		}

		var apiurl = `${global.modulefullname}/change_password`
		var args = {param:{
			newpassword: pasword_new,
			prevpassword: password_previous
		}}
	

		var result = await $ui.apicall(apiurl, args);
		if (result.success===true) {
			$ui.ShowMessage('[INFO] Password Changed.', {
				'Ok': () => {
					btn_password_change.linkbutton('unselect');
					$('.updater-container').hide();
					form.setValue(obj.txt_password_new, "");
					form.setValue(obj.txt_password_confirm, "")
					form.setValue(obj.txt_password_previous, "")
				}
			});
		}
	} catch (err) {
		console.error(err);
		$ui.ShowMessage('[ERROR] Cannot change password<br>' + err.errormessage);
	}
}

async function btn_picture_update_click() {
	try {
		var data = form.getData();
		var files = data.FILES;

		var apiurl = `${global.modulefullname}/update_picture`
		var args = {param:{
		}}
	
		var result = await $ui.apicall(apiurl, args, files);
		if (result.success===true) {
			

			var files = obj.fl_profile_picture.filebox('files');
			var f = files[0];
			var reader = new FileReader();
			reader.onload = (function(loaded) {
				return function(e) {
					var image = new Image();
					image.src = e.target.result;
					image.onload = function() {
						var elimg = $("#pnl_form-profilepicture");
						elimg.attr('src', e.target.result);
					}
				}
			})(f);
			if (f!==undefined) { reader.readAsDataURL(f) }


		}

	} catch (err) {
		console.error(err);
		$ui.ShowMessage('[ERROR] Cannot change password<br>' + err.errormessage);
	}
}

