<?php namespace FGTA4\apis;

if (!defined('FGTA4')) {
	die('Forbiden');
}

require_once __ROOT_DIR.'/core/sqlutil.php';
require_once __ROOT_DIR.'/core/couchdbclient.php';


use \FGTA4\exceptions\WebException;
use \FGTA4\CouchDbClient;

$API = new class extends WebAPI {
	
	public function execute($data, $options, $files) {
		$userdata = $this->auth->session_get_user();
		try {
	
			$id = $data->id;
			$base64data = $files->file1;

			$cdb = new CouchDbClient((object)[
				'host' => 'localhost',
				'port' => '5984',
				'protocol' => 'http',
				'username' => null,
				'password' => null,
				'database' => 'fgtadb'		
			]);

			try {


				// Test Simpan Data
				// $doc = (object)[
				// 	'nama' => 'Agung',
				// 	'alamat' => 'Tangerang'
				// ];
				// $cdb->add($id, $doc);	
	
				// Test Ambil Data	
				// $result = $cdb->get($id);
				// print_r($result->asObject());


				// $cdb->update($id, (object)[
				// 	'nama' => 'Nugrroho',
				// 	'kota' => 'Jakarta'
				// ]);


				// // $cdb->remove($id);	
				// $doc = (object)[
				// 	'nama' => 'Agung',
				// 	'alamat' => 'Tangerang'
				// ];
				// $overwrite = true;
				// $res = $cdb->addAttachment('333', $doc, 'file', __DIR__.'/photo.jpg', $overwrite);	
				// $res = $cdb->addFile('123', $doc, __DIR__.'/photo.jpg', $overwrite);	

		
				$attachmentname = 'filedata';
				$id = '606182584cf65';
				$data = $cdb->getAttachment($id, $attachmentname);
	
				print_r($data);


				// if (count($attachments)) {
				// 	foreach ($attachments as $name => $info) {


				// 	}
				// 	$cdb->getAttachment($id, $attachmentname);
				// }
				


				// return $res->asObject();
			} catch (\Exception $ex) {
				throw $ex;
			}

			
		} catch (\Exception $ex) {
			throw $ex;
		}
	}
};