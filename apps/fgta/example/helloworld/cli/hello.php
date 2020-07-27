<?php

console::class(new class($args) extends cli {
	function __construct($args) {
		$this->args = $args;

		$DB_CONFIG = DB_CONFIG['DSR'];
		$DB_CONFIG['param'] = DB_CONFIG_PARAM['mariadb'];
		$this->db = new \PDO(
					$DB_CONFIG['DSN'], 
					$DB_CONFIG['user'], 
					$DB_CONFIG['pass'], 
					$DB_CONFIG['param']
		);		
	}

	function execute() {
		hello_execute($this);
	}
});



function hello_execute($obj) {
	print_r($obj->args);
}

