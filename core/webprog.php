<?php namespace FGTA4;


class WebProg {

	function log($obj) {
		$max_rows = 10;
		$debug_path = __LOCALDB_DIR . '/debug/log.txt';
		
		try {
			if  (!is_file($debug_path)) {
				return;
			}

			$resetlog = false;
			if ($resetlog) {
				\unlink($debug_path);
				// file_put_contents($debug_path, "");
			}


			$fp = fopen($debug_path, 'a');
			if (is_array($obj) || is_object($obj)) {
				fputs($fp, print_r($obj, true) . "\r\n");
			} else {
				fputs($fp, $obj . "\r\n");
			}
			fclose($fp);
			
		} catch (\Exception $ex) {
			throw $ex;
		}
	}
}