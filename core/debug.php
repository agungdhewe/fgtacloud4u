<?php
namespace FGTA4;


class debug {

	static private $fp = null; 
	static private $disabled = false;
	static private $toscreen = false;

	static function disable() {
		self::$disabled = true;
	}

	static function isDisabled() {
		return self::$disabled;
	}


	static function printtoscreen() {
		if (self::isDisabled()) return;
		echo "DEBUG TO SCREEEN\r\n";
		echo "================\r\n\r\n";
		self::$toscreen = true;
	}

	static function start($logfile, $mode="a+") {
		if (self::isDisabled()) return;
		self::$fp = fopen($logfile, $mode);
		flock(self::$fp, LOCK_EX);
	}

	static function log($val, $option=[]) {
		if (self::isDisabled()) return;
		if (is_array($val) || is_object($val)) {
			self::record(print_r($val, true)  . "\r\n\r\n" );
		} else {
			$nonewline = false;
			if (is_array($option)) {
				$nonewline = array_key_exists('nonewline', $option) ? $option['nonewline'] : false;
			}
			self::record($val, $nonewline);
		}
		
	}

	static function record($val, $nonewline = false) {
		$newline = $nonewline ? "" : "\r\n";
		if (self::$toscreen) {
			echo $val . $newline;
		} else {
			fputs(self::$fp, $val . $newline);
		}
	}


	static function close($reset=false) {
		if (self::isDisabled()) return;
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

