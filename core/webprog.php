<?php namespace FGTA4;


class WebProg {

	function log($obj, $traceinfo=true) {
		$max_rows = 10;
		$debug_path = __LOCALDB_DIR . '/debug/log.txt';

		if ($traceinfo) {
			$bt = debug_backtrace();
			$caller = array_shift($bt);

			$trace  = "\r\n--------------------------------\r\n";
			$trace .= $caller['file'] . " line " . $caller['line'];
			$trace .= "\r\n--------------------------------\r\n";

		} else {
			$trace = "";
		}
		
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
				fputs($fp, $trace . print_r($obj, true) . "\r\n");
			} else {
				fputs($fp, $trace . $obj . "\r\n");
			}
			fclose($fp);
			
		} catch (\Exception $ex) {
			throw $ex;
		}
	}
}