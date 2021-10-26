<?php namespace FGTA4\apis;

if (!defined('FGTA4')) {
	die('Forbiden');
}

require_once __ROOT_DIR.'/core/sqlutil.php';

use \FGTA4\exceptions\WebException;


class LimitedAPI extends WebAPI {
	
	public function execute($param1) {

		$userdata = $this->auth->session_get_user();

			
		try {
			// if (!$this->ActionIsAllowedFor($this->reqinfo->moduleconfig->apis->linitedapi, $userdata->groups)) {
			// 	throw new \Exception('[ERROR] Your group authority is not aloowed to do this action.');
			// }
			
			return "hasil dari API: $param1";
		} catch (\Exception $ex) {
			throw $ex;
		}

		
	}

}


$API = new LimitedAPI();