<?php

require_once __ROOT_DIR.'/core/webapi.php';	
require_once __ROOT_DIR.'/core/webauth.php';	

class SCENARIO {
	
	public static $username;
	public static $data;
	public static $options;
	public static $files;


	public static function Prepare() {

		// siapkan data
		$file = file_get_contents(__DIR__.'/photo.jpg');
		$file1base64data = base64_encode($file);

		SCENARIO::$username = '5effbb0a0f7d1';  // MANAGER
		SCENARIO::$data = (object)[
			'id' => '11111'
		];
		SCENARIO::$options = (object)[
		];
		SCENARIO::$files = (object)[
			'file1' => $file1base64data
		];
	}

	public static function Run() {
		require __DIR__ . '/../apis/save.php';

		self::Prepare();
		$API->auth = new class {
			public function session_get_user() {
				return (object) [
					'username' => SCENARIO::$username
				];
			}			
		};
		$API->useotp = false;
		$result = $API->execute(SCENARIO::$data, SCENARIO::$options, SCENARIO::$files);
		
		// echo "\r\n==============\r\n";
		// echo " Result               ";
		// echo "\r\n--------------\r\n";
		// print_r($result);
		// echo "\r\n==============\r\n";
		// print_r($result);
		echo "\r\n\r\n";
		
	}
}


console::class(new class($args) extends clibase {
	public function execute() {
		SCENARIO::Run();
	}
});
