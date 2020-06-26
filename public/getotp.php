<?php


// $count = 1;
// $req = str_replace($_SERVER['SCRIPT_NAME'], "", $_SERVER['REQUEST_URI'], $count);
$api = '';
if (array_key_exists("api", $_GET)) {
	$api = $_GET['api'];
}



// tokenid yang dikirim client
$tokenid = '';
if (array_key_exists('tokenid', $_COOKIE)) {
	// via cookie
	$tokenid = $_COOKIE['tokenid'];
} else if (array_key_exists('HTTP_TOKENID', $_SERVER)) {
	// via header
	$tokenid = $_SERVER['HTTP_TOKENID'];
}


$otp = new stdClass;
$otp->success = false;
$otp->value = '';
$otp->password = '1234';
$otp->encrypt = false;

if ($tokenid!='') {
	// sudah login
	$otp->value = uniqid();
	$otp->success = true;
} else {
	// belum login

	// proses login
	if ($api == 'fgta/framework/login/dologin') { 
		$otp->value = uniqid();
		$otp->success = true;	
	}
}


if ($otp->success) {
	// simpan token di database

}


echo json_encode($otp);
