<?php namespace FGTA4\apis;

if (!defined('FGTA4')) {
	die('Forbiden');
}

require_once __ROOT_DIR.'/core/sqlutil.php';

use \FGTA4\exceptions\WebException;



$API = new class extends WebAPI {
	function __construct() {
		$this->debugoutput = true;
		$DB_CONFIG = DB_CONFIG[$GLOBALS['MAINDB']];
		$DB_CONFIG['param'] = DB_CONFIG_PARAM[$GLOBALS['MAINDBTYPE']];
		$this->db = new \PDO(
					$DB_CONFIG['DSN'], 
					$DB_CONFIG['user'], 
					$DB_CONFIG['pass'], 
					$DB_CONFIG['param']
		);	

	}
	
	public function execute($param) {
		// tokenid yang dikirim client
		$tokenid = '';
		if (array_key_exists('tokenid', $_COOKIE)) {
			// via cookie
			$tokenid = $_COOKIE['tokenid'];
		} else if (array_key_exists('HTTP_TOKENID', $_SERVER)) {
			// via header
			$tokenid = $_SERVER['HTTP_TOKENID'];
			
		}

		$testingotp = true;

		// kirimkan email dengan message
		// $param.message

		try {
			$otp = (object) [
				'value' => uniqid(),
				'code' => rand(1000,9999)
			];

			$sql = "INSERT INTO fgt_otp (otp, tokenid, code, expired) VALUES ('$otp->value', '$tokenid', '$otp->code', TIMESTAMPADD(minute, 10, NOW()))";
			$this->db->query($sql);

			return (object) [
				'testingotp' => $testingotp,
				'code' => $testingotp ? $otp->code : '',
				'value' => $otp->value,
				'email' => 'email@domain.com'
			];	
		} catch (\Exception $ex) {
			throw $ex;
		}
	}
};