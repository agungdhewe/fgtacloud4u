<?php

date_default_timezone_set('Asia/Jakarta');
define('__ROOT_DIR', dirname(__FILE__));
define('DB_CONFIG_PARAM', [
	'firebird' => [
		\PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
		\PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_OBJ,
		\PDO::ATTR_PERSISTENT=>true		
	],

	'mariadb' => [
		\PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
		\PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_OBJ,
		\PDO::ATTR_PERSISTENT=>true			
	],

	'mssql' => [
		\PDO::ATTR_CASE => \PDO::CASE_NATURAL,
		\PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
		\PDO::ATTR_ORACLE_NULLS => \PDO::NULL_NATURAL,
		\PDO::ATTR_STRINGIFY_FETCHES => false,	
	]
]);



htaccess::ReadEnvirontment();


require_once __DBCONF_PATH;
console::execute($argv);















class color {
	public const reset = "\x1b[0m";
	public const red = "\x1b[31m";
	public const green = "\x1b[32m";
	public const yellow = "\x1b[33m";
	public const bright = "\x1b[1m";

}

class cli {
	public function execute() {
	}	

	function SendMail($recipients, $subject, $message, $attachments) {
		
		try {
			$server = $this->getServer();

			$mailer = new PHPMailer();
			$mailer->Host = $server->host;
			$mailer->Port = $server->port;
			$mailer->Username = $server->username;
			$mailer->Password = $server->password;
			$mailer->FromName = $server->fromname;
			$mailer->From = $server->from;

			$mailer->isHTML(true);

			$mailer->SMTPKeepAlive = true;
			$mailer->Mailer = "smtp";
			$mailer->IsSMTP();
			$mailer->SMTPAuth = true;
			$mailer->SMTPSecure = "tls";
			$mailer->CharSet ='utf-8';
			$mailer->SMTPDebug = 0;
			$mailer->AuthType = "PLAIN";
			$mailer->SMTPOptions = array(
					'ssl' => array(
					'verify_peer' => false,
					'verify_peer_name' => false,
					'allow_self_signed' => true
				)
			);

			$mailer->Subject = $subject;
			$mailer->Body = $message;
			foreach ($recipients as $recp) {
				if (is_object($recp)) {
					$address = $recp->address;
					$name = property_exists($recp, 'name') ? $recp->name : $recp->address;
					if (property_exists($recp, 'type')) {
						if ($recp->type!='cc' || $recp->type!='bcc') {
							if ($recp->type=='cc') {
								$mailer->AddCC($address, $name);
							} else {
								$mailer->AddBCC($address, $name);
							}
						} else {
							throw new Exception ("type recipient harus 'CC' atau BCC");
						}
					} else {
						$mailer->AddAddress($address, $name);
					}

				} else {
					$mailer->AddAddress($recp, $recp);
				}
			}

			if(!$mailer->Send()) {
				throw new Exception("Message was not sent\r\n" . $mailer->ErrorInfo);
			}

		} catch (Exception $ex) {
			throw $ex;
		}
	}

	function getLastMonthMTD($date) {
		$currentmonth_firstdate = date("Y-m-01", strtotime($date->format('Y-m-d') ));
		$lastmonth_firstdate = date("Y-m-d", strtotime($currentmonth_firstdate." -1 month"));

		$currentmonth_lastdate = date("t", strtotime($currentmonth_firstdate));
		$lastmonth_lastdate = date("t", strtotime($lastmonth_firstdate));

		$currentdate = date('d', strtotime($date->format('Y-m-d')));
		$lastdate = ($currentdate > $lastmonth_lastdate) ? $lastmonth_lastdate : $currentdate;


		$lastmonth = date('Y-m', strtotime($lastmonth_firstdate));
		// echo $lastmonth;
		
		$dt = date('Y-m-d', strtotime($lastmonth."-".$lastdate));
		return (object) [
			'start' => new DateTime($lastmonth_firstdate),
			'end' => new DateTime($dt)
		];
	}
}


class htaccess {
	public static function ReadEnvirontment() {
		$htaccess_path = getenv('PWD') . "/.htaccess";
		if (!is_file($htaccess_path)) return;
		

		$content = file_get_contents($htaccess_path);
		$pattern = '@SetEnv (?P<env>[^ ]*) (?P<value>[^ \n]*)@';
		$matches = array();
		preg_match_all($pattern, $content, $matches, PREG_SET_ORDER);

		foreach ($matches as $match) {
			$_SERVER[$match['env']] =  trim(str_replace("\"","", $match['value'])) ;
		}


		$FGTA_DBCONF_PATH = "";
		if (array_key_exists('FGTA_DBCONF_PATH', $_SERVER)) {
			define('__DBCONF_PATH', $_SERVER['FGTA_DBCONF_PATH']);
		} else {
			define('__DBCONF_PATH', $FGTA_DBCONF_PATH);
		}

		$FGTA_LOCALDB_DIR = __ROOT_DIR.'/core/database';
		if (array_key_exists('FGTA_LOCALDB_DIR', $_SERVER)) {
			define('__LOCALDB_DIR', $_SERVER['FGTA_LOCALDB_DIR']);	
		} else {
			define('__LOCALDB_DIR', $FGTA_LOCALDB_DIR);	
		}

	}
}


class console {

	public const format = "\r\n\r\n" . color::bright . "Format:". color::reset ."\r\n\r\n\tphp cli.php <module_dir>/<command> [parameters]\r\n\r\n";

	public static function execute($argv) {
		try {
			$args = self::getcommandparameter($argv);
			$cmd = self::loadcommand($args->command, $args);


			

		} catch (Exception $ex) {
			echo "\r\n";
			echo color::red . "ERROR\r\n=====" . color::reset , "\r\n";
			echo $ex->getMessage();
			echo "\r\n\r\n";
		}
		
	}

	public static function getcommandparameter($argv) {
		try {
			if (count($argv)<2) {
				throw new Exception("perintah belum didefinisikan" . self::format);
			}

			$params = new stdClass;
			$i=0; $current_param_name = '';
			foreach ($argv as $arg) {
				$i++; if ($i<3) continue;
				// echo "$i $arg\r\n";
				if (substr($arg, 0, 2 ) === "--") {
					$current_param_name = $arg;
					$value_candidate = (count($argv)>$i) ? $argv[$i] : true;
					if (substr($value_candidate, 0, 2 ) === "--") {
						$value_candidate = true;
					}
					$params->{$current_param_name} = $value_candidate;
				}
			}

			return (object) array(
				'command' => $argv[1],
				'params' => $params
			);
		} catch (Exception $ex) {
			throw $ex;
		}
	}

	public static function loadcommand($command, $args) {
		try {
			$command_basename = basename($command);
			$command_dir = str_replace("/".$command_basename ."$$", "", $command . "$$");
			$command_dir = $command_dir . "/cli/" . $command_basename . ".php";
			$command_path = __ROOT_DIR . "/apps/" . $command_dir;
			
			if (!is_file($command_path)) {
				throw new Exception(color::yellow . $command_dir . color::reset . " tidak ditemukan.");
			}

			if (!defined('DB_CONFIG')) {
				throw new Exception('Konfigurasi database belum di-set');
			}

			if (!is_array(DB_CONFIG) || !is_array(DB_CONFIG_PARAM)) {
				throw new Exception('Konfigurasi database belum di-set');
			}

			require_once $command_path;


		} catch (Exception $ex) {
			throw $ex;
		}
	}

	public static function require($filename) {

	}


	public static function class($obj) {
		$obj->execute();

	}

}


class debug {

	static private $fp = null; 

	static function start($logfile) {
		self::$fp = fopen($logfile, "a");
		flock(self::$fp, LOCK_EX);
	}

	static function log($val) {
		if (is_array($val) || is_object($val)) {
			fputs(self::$fp, print_r($val, true) . "\r\n\r\n");
		} else {
			fputs(self::$fp, $val . "\r\n");
		}
		
	}

	static function close($reset=false) {
		$meta_data = stream_get_meta_data(self::$fp);
		$logfile = $meta_data["uri"];
		flock($f, LOCK_UN);
		fclose(self::$fp);
		if ($reset) {
			fclose(fopen($logfile, "w"));
		}
	}
}



