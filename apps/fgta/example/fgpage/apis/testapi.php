<?php namespace FGTA4\apis;

if (!defined('FGTA4')) {
	die('Forbiden');
}

require_once __ROOT_DIR.'/core/sqlutil.php';

use \FGTA4\exceptions\WebException;


class TestAPI extends WebAPI {
	public function execute($param1) {
		return "return form API: $param1";
	}

}


$API = new TestAPI();