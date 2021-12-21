-- SET FOREIGN_KEY_CHECKS=0;

-- drop table if exists `mst_kota`;


CREATE TABLE IF NOT EXISTS `mst_kota` (
	`kota_id` varchar(10) NOT NULL , 
	`kota_name` varchar(60) NOT NULL , 
	`_createby` varchar(13) NOT NULL , 
	`_createdate` datetime NOT NULL DEFAULT current_timestamp(), 
	`_modifyby` varchar(13)  , 
	`_modifydate` datetime  , 
	UNIQUE KEY `kota_name` (`kota_name`),
	PRIMARY KEY (`kota_id`)
) 
ENGINE=InnoDB
COMMENT='Daftar Tipe Brand';


ALTER TABLE `mst_kota` ADD COLUMN IF NOT EXISTS  `kota_name` varchar(60) NOT NULL  AFTER `kota_id`;


ALTER TABLE `mst_kota` ADD CONSTRAINT `kota_name` UNIQUE IF NOT EXISTS  (`kota_name`);




INSERT INTO mst_kota (`kota_id`, `kota_name`, `_createby`, `_createdate`) VALUES ('MGL', 'MAGELANG', 'root', NOW());
INSERT INTO mst_kota (`kota_id`, `kota_name`, `_createby`, `_createdate`) VALUES ('JKT', 'JAKARTA', 'root', NOW());



