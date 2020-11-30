<?php namespace FGTA4\utils;

if (!defined('FGTA4')) {
	die('Forbiden');
}

class Sequencer {
	function __construct($db, $sequencer_table, $sequencer_name, $uniquefields) {
		$this->db = $db;
		$this->tablename = $sequencer_table;
		$this->seqname = $sequencer_name;
		$this->uniquefields = $uniquefields;
	}


	function getraw($data) {
		try {

			$ret = ['seqname' => $this->seqname];
			$params = [':seqname' => $this->seqname]; 
			$fis = [];
			$fieldnames = ['`seqname`'];
			$fieldparams = [':seqname'];
			foreach ($this->uniquefields as $fi) {
				$fieldnames[] = "`$fi`";
				$fieldparams[] = ":$fi";
				$fis[] = " `$fi` = :$fi ";
				$params[":$fi"] = !array_key_exists($fi, $data) ? '0' :  $data[$fi];
				$ret[$fi] = $params[":$fi"];
			}
			$wherecriteria = \implode(' AND ', $fis);


			$sql = "
				SELECT * FROM `$this->tablename` 
				WHERE
				`seqname` = :seqname
				AND ($wherecriteria)  
				FOR UPDATE;
			";


			$lastnum = 0;


			$stmt = $this->db->prepare($sql);
			$stmt->execute($params);
			$rows  = $stmt->fetchall(\PDO::FETCH_ASSOC);

			if (count($rows)==0) {
				$sfields = implode(', ', $fieldnames);
				$sparams = implode(', ', $fieldparams); 
				$sql_create_new = "
					INSERT INTO `$this->tablename` 
					($sfields)
					VALUES
					($sparams);
				";
				$stmt = $this->db->prepare($sql_create_new);
				$stmt->execute($params);

				$ret['lastnum'] = 0;
			} else {
				$ret['lastnum'] = $rows[0]['lastnum'];
			}

			$ret['lastnum']++;
			
			$sql_update = "
				UPDATE `$this->tablename`
				SET lastnum = :lastnum, lastdate = current_timestamp()
				WHERE
				`seqname` = :seqname
				AND ($wherecriteria)  				
			";

			$params[':lastnum'] = $ret['lastnum'];
			$stmt = $this->db->prepare($sql_update);
			$stmt->execute($params);			

			return $ret;
		} catch (\Exception $ex) {
			throw $ex;
		}
	}


	function get($data) {
		$raw = $this->getraw($data);
		$seq = $this->seqname;
		foreach ($this->uniquefields as $fi) {
			$seq .= $raw[$fi]; 
		}
		$seq .= \str_pad($raw['lastnum'], 8, '0', STR_PAD_LEFT);
		return $seq;
	}	

}


/*
General Sequencer, reset monthly
================================

CREATE TABLE `seq_generalmonthly` (
	`seqname` varchar(2) NOT NULL, 
	`ye` varchar(2) NOT NULL, 
	`mo` varchar(2) NOT NULL, 
	`lastdate` datetime NOT NULL DEFAULT current_timestamp(), 
	`lastnum` int NOT NULL DEFAULT 0,
	PRIMARY KEY (`seqname`, `ye`, `mo`)	
)
ENGINE=InnoDB
COMMENT='Sequencer General';

*/