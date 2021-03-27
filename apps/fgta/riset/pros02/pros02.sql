CREATE TABLE `mst_pros02` (
	`pros02_id` varchar(16) NOT NULL , 
	`pros02_name` varchar(60) NOT NULL , 
	`pros02_iscommit` tinyint(1) NOT NULL DEFAULT 0, 
	`pros02_commitby` varchar(14)  , 
	`pros02_commitdate` datetime  , 
	`pros02_version` int(4) NOT NULL DEFAULT 0, 
	`pros02_isapprovalprogress` tinyint(1) NOT NULL DEFAULT 0, 
	`pros02_isapproved` tinyint(1) NOT NULL DEFAULT 0, 
	`pros02_approveby` varchar(14)  , 
	`pros02_approvedate` datetime  , 
	`pros02_isdeclined` tinyint(1) NOT NULL DEFAULT 0, 
	`pros02_declineby` varchar(14)  , 
	`pros02_declinedate` datetime  , 
	`doc_id` varchar(30) NOT NULL , 
	`dept_id` varchar(30) NOT NULL , 
	`_createby` varchar(13) NOT NULL , 
	`_createdate` datetime NOT NULL DEFAULT current_timestamp(), 
	`_modifyby` varchar(13)  , 
	`_modifydate` datetime  , 
	UNIQUE KEY `pros02_name` (`pros02_name`),
	PRIMARY KEY (`pros02_id`)
) 
ENGINE=InnoDB
COMMENT='Daftar Dokumen';

ALTER TABLE `mst_pros02` ADD KEY `doc_id` (`doc_id`);
ALTER TABLE `mst_pros02` ADD KEY `dept_id` (`dept_id`);

ALTER TABLE `mst_pros02` ADD CONSTRAINT `fk_mst_pros02_mst_doc` FOREIGN KEY (`doc_id`) REFERENCES `mst_doc` (`doc_id`);
ALTER TABLE `mst_pros02` ADD CONSTRAINT `fk_mst_pros02_mst_dept` FOREIGN KEY (`dept_id`) REFERENCES `mst_dept` (`dept_id`);





CREATE TABLE `mst_pros02appr` (
	`pros02appr_id` varchar(14) NOT NULL , 
	`pros02appr_isapproved` tinyint(1) NOT NULL DEFAULT 0, 
	`pros02appr_by` varchar(14)  , 
	`pros02appr_date` datetime  , 
	`pros02_version` int(4) NOT NULL DEFAULT 0, 
	`pros02appr_isdeclined` tinyint(1) NOT NULL DEFAULT 0, 
	`pros02appr_declinedby` varchar(14)  , 
	`pros02appr_declineddate` datetime  , 
	`pros02appr_notes` varchar(255)  , 
	`pros02_id` varchar(30) NOT NULL , 
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
	UNIQUE KEY `pros02_auth_id` (`pros02_id`, `auth_id`),
	PRIMARY KEY (`pros02appr_id`)
) 
ENGINE=InnoDB
COMMENT='Approval Proses 02';

ALTER TABLE `mst_pros02appr` ADD KEY `pros02_id` (`pros02_id`);

ALTER TABLE `mst_pros02appr` ADD CONSTRAINT `fk_mst_pros02appr_mst_pros02` FOREIGN KEY (`pros02_id`) REFERENCES `mst_pros02` (`pros02_id`);





