<?php namespace FGTA4\apis;

if (!defined('FGTA4')) {
	die('Forbiden');
}

require_once __ROOT_DIR.'/core/sqlutil.php';

use \FGTA4\exceptions\WebException;


class TestAPI extends WebAPI {
	public function execute($nama, $alamat) {
		return (object) [
			'result' => 'berhasil',
			'yangdikirim' => "client mengirimkan data '$nama' dan '$alamat'"
		];
	}

}


$API = new TestAPI();