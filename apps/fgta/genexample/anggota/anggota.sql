-- SET FOREIGN_KEY_CHECKS=0;

-- drop table if exists `mst_anggota`;


CREATE TABLE IF NOT EXISTS `mst_anggota` (
	`anggota_id` varchar(14) NOT NULL , 
	`anggota_name` varchar(60) NOT NULL , 
	`kota_id` varchar(10) NOT NULL , 
	`_createby` varchar(13) NOT NULL , 
	`_createdate` datetime NOT NULL DEFAULT current_timestamp(), 
	`_modifyby` varchar(13)  , 
	`_modifydate` datetime  , 
	PRIMARY KEY (`anggota_id`)
) 
ENGINE=InnoDB
COMMENT='Daftar Anggota';


ALTER TABLE `mst_anggota` ADD COLUMN IF NOT EXISTS  `anggota_name` varchar(60) NOT NULL  AFTER `anggota_id`;
ALTER TABLE `mst_anggota` ADD COLUMN IF NOT EXISTS  `kota_id` varchar(10) NOT NULL  AFTER `anggota_name`;

ALTER TABLE `mst_anggota` ADD KEY IF NOT EXISTS `kota_id` (`kota_id`);

ALTER TABLE `mst_anggota` ADD CONSTRAINT `fk_mst_anggota_mst_kota` FOREIGN KEY IF NOT EXISTS  (`kota_id`) REFERENCES `mst_kota` (`kota_id`);





