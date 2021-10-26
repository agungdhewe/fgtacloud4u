-- SET FOREIGN_KEY_CHECKS=0;

-- drop table if exists `mst_paymtype`;


CREATE TABLE `mst_paymtype` (
	`paymtype_id` varchar(10) NOT NULL , 
	`paymtype_name` varchar(30) NOT NULL , 
	`paymtype_descr` varchar(30)  , 
	`paymtype_iscash` tinyint(1) NOT NULL DEFAULT 0, 
	`paymtype_isdisabled` tinyint(1) NOT NULL DEFAULT 0, 
	`_createby` varchar(13) NOT NULL , 
	`_createdate` datetime NOT NULL DEFAULT current_timestamp(), 
	`_modifyby` varchar(13)  , 
	`_modifydate` datetime  , 
	UNIQUE KEY `paymtype_name` (`paymtype_name`),
	PRIMARY KEY (`paymtype_id`)
) 
ENGINE=InnoDB
COMMENT='Daftar Tipe-tipe pembayaran';




INSERT INTO mst_paymtype (`paymtype_id`, `paymtype_name`, `_createby`, `_createdate`) VALUES ('CA', 'CASH', 'root', NOW());
INSERT INTO mst_paymtype (`paymtype_id`, `paymtype_name`, `_createby`, `_createdate`) VALUES ('GI', 'GIRO', 'root', NOW());



