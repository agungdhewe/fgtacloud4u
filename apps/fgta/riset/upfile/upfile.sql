CREATE TABLE `mst_upfile` (
	`upfile_id` varchar(14) NOT NULL , 
	`upfile_name` varchar(60) NOT NULL , 
	`upfile_data01` varchar(60)  , 
	`upfile_data02` varchar(60)  , 
	`_createby` varchar(13) NOT NULL , 
	`_createdate` datetime NOT NULL DEFAULT current_timestamp(), 
	`_modifyby` varchar(13)  , 
	`_modifydate` datetime  , 
	UNIQUE KEY `upfile_name` (`upfile_name`),
	PRIMARY KEY (`upfile_id`)
) 
ENGINE=InnoDB
COMMENT='Daftar File';







CREATE TABLE `mst_upfiledetil` (
	`upfiledetil_id` varchar(14) NOT NULL , 
	`upfiledetil_name` varchar(60) NOT NULL , 
	`upfiledetil_data01` varchar(60)  , 
	`upfiledetil_data02` varchar(60)  , 
	`upfile_id` varchar(14) NOT NULL , 
	`_createby` varchar(13) NOT NULL , 
	`_createdate` datetime NOT NULL DEFAULT current_timestamp(), 
	`_modifyby` varchar(13)  , 
	`_modifydate` datetime  , 
	UNIQUE KEY `upfiledetil_name` (`upfiledetil_name`),
	PRIMARY KEY (`upfiledetil_id`)
) 
ENGINE=InnoDB
COMMENT='Daftar Detil File';

ALTER TABLE `mst_upfiledetil` ADD KEY `upfile_id` (`upfile_id`);

ALTER TABLE `mst_upfiledetil` ADD CONSTRAINT `fk_mst_upfiledetil_mst_upfile` FOREIGN KEY (`upfile_id`) REFERENCES `mst_upfile` (`upfile_id`);





