<?php
define('__ROOT_DIR', realpath(dirname(__FILE__).'/..'));

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
$otp->errormessage = 'OTP Request error';

if ($tokenid!='') {
	// sudah login
	$otp->value = uniqid();
	$otp->success = true;
} else {
	// belum login
	$apiinfo = dirname(__FILE__)."/../apps/$api";
	$api_basename = basename($apiinfo);

	$programinfo = str_replace("/".$api_basename, "", $apiinfo);
	$program_basename = basename($programinfo);

	$jsonfile = $programinfo . "/" . $program_basename .".json";
	if (is_file($jsonfile)) {
		$fp = fopen($jsonfile, "r");
		$fdata = fread($fp, filesize($jsonfile));
		$jd = json_decode($fdata);
		if (json_last_error()==JSON_ERROR_NONE) {
			if (property_exists($jd->apis, $api_basename)) {
				$apidata = $jd->apis->$api_basename;
			} else {
				$otp->errormessage = "Anonymous akses ke $api tidak diperbolehkan.";
				$apidata = (object) [
					"allowanonymous" => false
				];
			}
			
			if ($apidata->allowanonymous) {
				$otp->value = uniqid();
				$otp->success = true;				
			}
		}
	}
}


if ($otp->success) {
	unset($otp->errormessage);

	// simpan token di database

	// Lokasi konfigurasi koneksi database
	$FGTA_DBCONF_PATH = __ROOT_DIR.'/public/dbconfig.php';
	$ENV_FGTA_DBCONF_PATH=getenv('FGTA_DBCONF_PATH');
	if ($ENV_FGTA_DBCONF_PATH != '') {
		if (!is_file(getenv('FGTA_DBCONF_PATH'))) {
			die("Config: '$ENV_FGTA_DBCONF_PATH' not found.");
		} else {
			$FGTA_DBCONF_PATH = $ENV_FGTA_DBCONF_PATH;
		}
	}

	require_once $FGTA_DBCONF_PATH;
	$DB_CONFIG = DB_CONFIG[$GLOBALS['MAINDB']];
	$DB_CONFIG['param'] = [
		\PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
		\PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_OBJ,
		\PDO::ATTR_PERSISTENT=>true			
	];


	try {
		$db = new \PDO(
			$DB_CONFIG['DSN'], 
			$DB_CONFIG['user'], 
			$DB_CONFIG['pass'], 
			$DB_CONFIG['param']
		);

		// 5f15cec4d228d
		// onohl2ookpnapgpvgo65dkg734
		try {
			$sql = "INSERT INTO fgt_otp (otp, tokenid, expired) VALUES ('$otp->value', '$tokenid', TIMESTAMPADD(minute, 1, NOW()))";
			$db->query($sql);
		} catch (Exception $ex) {
			$otp->success = false;	
			$otp->errormessage = $ex->getMessage();
			die(json_encode($otp));
		}

	} catch (Exception $ex) {
		$otp->success = false;
		$otp->errormessage = $ex->getMessage();
		die(json_encode($otp));
	}


}


echo json_encode($otp);
