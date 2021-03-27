CREATE TABLE `mst_pros01` (
	`pros01_id` varchar(16) NOT NULL , 
	`pros01_name` varchar(60) NOT NULL , 
	`pros01_iscommit` tinyint(1) NOT NULL DEFAULT 0, 
	`pros01_commitby` varchar(14)  , 
	`pros01_commitdate` datetime  , 
	`pros01_version` int(4) NOT NULL DEFAULT 0, 
	`_createby` varchar(13) NOT NULL , 
	`_createdate` datetime NOT NULL DEFAULT current_timestamp(), 
	`_modifyby` varchar(13)  , 
	`_modifydate` datetime  , 
	UNIQUE KEY `pros01_name` (`pros01_name`),
	PRIMARY KEY (`pros01_id`)
) 
ENGINE=InnoDB
COMMENT='Daftar Dokumen';







