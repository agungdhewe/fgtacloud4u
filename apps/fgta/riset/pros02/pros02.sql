CREATE TABLE `mst_pros` (
	`pros_id` varchar(16) NOT NULL , 
	`pros_name` varchar(60) NOT NULL , 
	`pros_iscommit` tinyint(1) NOT NULL DEFAULT 0, 
	`pros_commitby` varchar(14)  , 
	`pros_commitdate` datetime  , 
	`pros_version` int(4) NOT NULL DEFAULT 0, 
	`pros_isapprovalprogress` tinyint(1) NOT NULL DEFAULT 0, 
	`pros_isapproved` tinyint(1) NOT NULL DEFAULT 0, 
	`pros_approveby` varchar(14)  , 
	`pros_approvedate` datetime  , 
	`pros_isdeclined` tinyint(1) NOT NULL DEFAULT 0, 
	`pros_declineby` varchar(14)  , 
	`pros_declinedate` datetime  , 
	`doc_id` varchar(30) NOT NULL , 
	`dept_id` varchar(30) NOT NULL , 
	`_createby` varchar(13) NOT NULL , 
	`_createdate` datetime NOT NULL DEFAULT current_timestamp(), 
	`_modifyby` varchar(13)  , 
	`_modifydate` datetime  , 
	UNIQUE KEY `pros_name` (`pros_name`),
	PRIMARY KEY (`pros_id`)
) 
ENGINE=InnoDB
COMMENT='Daftar Dokumen';

ALTER TABLE `mst_pros` ADD KEY `doc_id` (`doc_id`);
ALTER TABLE `mst_pros` ADD KEY `dept_id` (`dept_id`);

ALTER TABLE `mst_pros` ADD CONSTRAINT `fk_mst_pros_mst_doc` FOREIGN KEY (`doc_id`) REFERENCES `mst_doc` (`doc_id`);
ALTER TABLE `mst_pros` ADD CONSTRAINT `fk_mst_pros_mst_dept` FOREIGN KEY (`dept_id`) REFERENCES `mst_dept` (`dept_id`);





CREATE TABLE `mst_prosappr` (
	`prosappr_id` varchar(14) NOT NULL , 
	`prosappr_isapproved` tinyint(1) NOT NULL DEFAULT 0, 
	`prosappr_by` varchar(14)  , 
	`prosappr_date` datetime  , 
	`pros_version` int(4) NOT NULL DEFAULT 0, 
	`prosappr_isdeclined` tinyint(1) NOT NULL DEFAULT 0, 
	`prosappr_declinedby` varchar(14)  , 
	`prosappr_declineddate` datetime  , 
	`prosappr_notes` varchar(255)  , 
	`pros_id` varchar(30) NOT NULL , 
	`docauth_descr` varchar(90)  , 
	`docauth_order` int(4) NOT NULL DEFAULT 0, 
	`docauth_value` int(4) NOT NULL DEFAULT 100, 
	`docauth_min` int(4) NOT NULL DEFAULT 0, 
	`authlevel_id` varchar(10) NOT NULL , 
	`authlevel_name` varchar(60) NOT NULL , 
	`auth_id` varchar(10)  , 
	`auth_name` varchar(60) NOT NULL , 
	`_createby` varchar(13) NOT NULL , 
	`_createdate` datetime NOT NULL DEFAULT current_timestamp(), 
	`_modifyby` varchar(13)  , 
	`_modifydate` datetime  , 
	UNIQUE KEY `pros_auth_id` (`pros_id`, `auth_id`),
	PRIMARY KEY (`prosappr_id`)
) 
ENGINE=InnoDB
COMMENT='Approval Proses 02';

ALTER TABLE `mst_prosappr` ADD KEY `pros_id` (`pros_id`);

ALTER TABLE `mst_prosappr` ADD CONSTRAINT `fk_mst_prosappr_mst_pros` FOREIGN KEY (`pros_id`) REFERENCES `mst_pros` (`pros_id`);





