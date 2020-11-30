<?php

require_once __ROOT_DIR . "/core/sequencer.php";

use FGTA4\utils\Sequencer;


console::class(new class($args) extends cli {
	function __construct($args) {

		$logfilepath = __LOCALDB_DIR . "/output/log-salesstat.txt";
		echo "using log: $logfilepath\r\n";
		debug::start($logfilepath, "w");

		// Connect to DB
		debug::log("connecting to DB ...", ['nonewline'=>true]);
		$DB_CONFIG = DB_CONFIG[$GLOBALS['MAINDB']];
		$DB_CONFIG['param'] = DB_CONFIG_PARAM[$GLOBALS['MAINDBTYPE']];
		$this->db = new \PDO(
					$DB_CONFIG['DSN'], 
					$DB_CONFIG['user'], 
					$DB_CONFIG['pass'], 
					$DB_CONFIG['param']
		);
		debug::log(color::green . "Connected" . color::reset);
		
	}

	function execute() {
		try {

			$this->db->setAttribute(\PDO::ATTR_AUTOCOMMIT,0);
			$this->db->beginTransaction();

			try {
				debug::log('create sequencer');
				$seq = new Sequencer($this->db, 'seq_generalmonthly', 'TF', ['ye', 'mo']);
				$id = $seq->get(['ye'=>'20', 'mo'=>'05']);
		
				echo $id;
				
				$this->db->commit();
			} catch (\Exception $ex) {
				$this->db->rollBack();
				throw $ex;
			} finally {
				$this->db->setAttribute(\PDO::ATTR_AUTOCOMMIT,1);
			}

		} catch (\Exception $ex) {
			throw $ex;
		}


		echo "\r\n";
	}

});

