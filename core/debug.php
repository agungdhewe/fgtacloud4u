<?php
namespace FGTA4;


class debug {

	static private $fp = null; 

	static function start($logfile, $mode="a+") {
		self::$fp = fopen($logfile, $mode);
		flock(self::$fp, LOCK_EX);
	}

	static function log($val, $option=[]) {
		if (is_array($val) || is_object($val)) {
			fputs(self::$fp, print_r($val, true) . "\r\n\r\n");
		} else {
			$nonewline = false;
			if (is_array($option)) {
				$nonewline = array_key_exists('nonewline', $option) ? $option['nonewline'] : false;
			}

			if ($nonewline) {
				fputs(self::$fp, $val);
			} else {
				fputs(self::$fp, $val . "\r\n");
			}
			
		}
		
	}

	static function close($reset=false) {
		if (self::$fp==null) {
			return;
		}

		$meta_data = stream_get_meta_data(self::$fp);
		$logfile = $meta_data["uri"];
		flock(self::$fp, LOCK_UN);
		fclose(self::$fp);
		if ($reset) {
			fclose(fopen($logfile, "w"));
		}
	}
}

