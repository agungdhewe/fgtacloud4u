CREATE TABLE `fgt_permission` (
	`permission_id` varchar(20) NOT NULL , 
	`permission_name` varchar(90) NOT NULL , 
	`permission_descr` varchar(255)  , 
	`_createby` varchar(13) NOT NULL , 
	`_createdate` datetime NOT NULL DEFAULT current_timestamp(), 
	`_modifyby` varchar(13)  , 
	`_modifydate` datetime  , 
	UNIQUE KEY `permission_name` (`permission_name`),
	PRIMARY KEY (`permission_id`)
) 
ENGINE=InnoDB
COMMENT='Daftar Permission';




INSERT INTO fgt_permission (`permission_id`, `permission_name`, `_createby`, `_createdate`) VALUES ('ASSET_BOOK_ALLOW', 'ASSET_BOOK_ALLOW', 'root', NOW());



