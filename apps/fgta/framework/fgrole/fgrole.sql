CREATE TABLE `fgt_role` (
	`role_id` varchar(10) NOT NULL , 
	`role_name` varchar(90) NOT NULL , 
	`role_descr` varchar(255)  , 
	`_createby` varchar(13) NOT NULL , 
	`_createdate` datetime NOT NULL DEFAULT current_timestamp(), 
	`_modifyby` varchar(13)  , 
	`_modifydate` datetime  , 
	UNIQUE KEY `role_name` (`role_name`),
	PRIMARY KEY (`role_id`)
) 
ENGINE=InnoDB
COMMENT='Daftar Role';




INSERT INTO fgt_role (`role_id`, `role_name`, `_createby`, `_createdate`) VALUES ('UPM', 'UPM', 'root', NOW());
INSERT INTO fgt_role (`role_id`, `role_name`, `_createby`, `_createdate`) VALUES ('EDI', 'EDITOR', 'root', NOW());
INSERT INTO fgt_role (`role_id`, `role_name`, `_createby`, `_createdate`) VALUES ('REP', 'REPORTER', 'root', NOW());
INSERT INTO fgt_role (`role_id`, `role_name`, `_createby`, `_createdate`) VALUES ('CAM', 'CAMERA PERSON', 'root', NOW());
INSERT INTO fgt_role (`role_id`, `role_name`, `_createby`, `_createdate`) VALUES ('PRO', 'PRODUCER', 'root', NOW());



CREATE TABLE `fgt_rolepermission` (
	`rolepermission_id` varchar(14) NOT NULL , 
	`permission_id` varchar(20) NOT NULL , 
	`role_id` varchar(10) NOT NULL , 
	`_createby` varchar(13) NOT NULL , 
	`_createdate` datetime NOT NULL DEFAULT current_timestamp(), 
	`_modifyby` varchar(13)  , 
	`_modifydate` datetime  , 
	UNIQUE KEY `rolepermission_pair` (`role_id`, `permission_id`),
	PRIMARY KEY (`rolepermission_id`)
) 
ENGINE=InnoDB
COMMENT='Daftar Permission Role';

ALTER TABLE `fgt_rolepermission` ADD KEY `permission_id` (`permission_id`);
ALTER TABLE `fgt_rolepermission` ADD KEY `role_id` (`role_id`);

ALTER TABLE `fgt_rolepermission` ADD CONSTRAINT `fk_fgt_rolepermission_fgt_permission` FOREIGN KEY (`permission_id`) REFERENCES `fgt_permission` (`permission_id`);
ALTER TABLE `fgt_rolepermission` ADD CONSTRAINT `fk_fgt_rolepermission_fgt_role` FOREIGN KEY (`role_id`) REFERENCES `fgt_role` (`role_id`);





