-- patch 2021 12 15
-- trn_medialogproofitem
ALTER TABLE `trn_medialogproofitem` ADD KEY if not exists `billoutpreprocess_id` (`billoutpreprocess_id`);
ALTER TABLE `trn_medialogproofitem` ADD CONSTRAINT `fk_trn_medialogproofitem_mst_billoutpreprocess` FOREIGN KEY  if not exists (`billoutpreprocess_id`) REFERENCES `mst_billoutpreprocess` (`billoutpreprocess_id`);

alter table `trn_medialogproofitem` add column if not exists `projbudget_id` varchar(30)   AFTER `brand_id`;
alter table `trn_medialogproofitem` add column if not exists `projbudgettask_id` varchar(14)   AFTER `projbudget_id`;
ALTER TABLE `trn_medialogproofitem` ADD KEY if not exists `projbudget_id` (`projbudget_id`);
ALTER TABLE `trn_medialogproofitem` ADD KEY if not exists `projbudgettask_id` (`projbudgettask_id`);
ALTER TABLE `trn_medialogproofitem` ADD CONSTRAINT `fk_trn_medialogproofitem_mst_projbudget` FOREIGN KEY  if not exists (`projbudget_id`) REFERENCES `mst_projbudget` (`projbudget_id`);
ALTER TABLE `trn_medialogproofitem` ADD CONSTRAINT `fk_trn_medialogproofitem_mst_projbudgettask` FOREIGN KEY  if not exists (`projbudgettask_id`) REFERENCES `mst_projbudgettask` (`projbudgettask_id`);


-- patch 2021 12 17

SET FOREIGN_KEY_CHECKS=0;

-- drop table if exists `trn_medialogproofbilling`;
-- drop table if exists `trn_medialogproofbillingdet`;


CREATE TABLE IF NOT EXISTS `trn_medialogproofbilling` (
	`medialogproofbilling_id` varchar(14) NOT NULL , 
	`medialogproofbilling_date` date NOT NULL , 
	`periodemo_id` varchar(6) NOT NULL , 
	`dept_id` varchar(30)  , 
	`medialogproofbilling_version` int(4) NOT NULL DEFAULT 0, 
	`medialogproofbilling_iscommit` tinyint(1) NOT NULL DEFAULT 0, 
	`medialogproofbilling_commitby` varchar(14)  , 
	`medialogproofbilling_commitdate` datetime  , 
	`medialogproofbilling_isgenerate` tinyint(1) NOT NULL DEFAULT 0, 
	`_createby` varchar(13) NOT NULL , 
	`_createdate` datetime NOT NULL DEFAULT current_timestamp(), 
	`_modifyby` varchar(13)  , 
	`_modifydate` datetime  , 
	UNIQUE KEY `periodemo_id` (`periodemo_id`),
	PRIMARY KEY (`medialogproofbilling_id`)
) 
ENGINE=InnoDB
COMMENT='Daftar Schedule harian';


ALTER TABLE `trn_medialogproofbilling` ADD COLUMN IF NOT EXISTS  `medialogproofbilling_date` date NOT NULL  AFTER `medialogproofbilling_id`;
ALTER TABLE `trn_medialogproofbilling` ADD COLUMN IF NOT EXISTS  `periodemo_id` varchar(6) NOT NULL  AFTER `medialogproofbilling_date`;
ALTER TABLE `trn_medialogproofbilling` ADD COLUMN IF NOT EXISTS  `dept_id` varchar(30)   AFTER `periodemo_id`;
ALTER TABLE `trn_medialogproofbilling` ADD COLUMN IF NOT EXISTS  `medialogproofbilling_version` int(4) NOT NULL DEFAULT 0 AFTER `dept_id`;
ALTER TABLE `trn_medialogproofbilling` ADD COLUMN IF NOT EXISTS  `medialogproofbilling_iscommit` tinyint(1) NOT NULL DEFAULT 0 AFTER `medialogproofbilling_version`;
ALTER TABLE `trn_medialogproofbilling` ADD COLUMN IF NOT EXISTS  `medialogproofbilling_commitby` varchar(14)   AFTER `medialogproofbilling_iscommit`;
ALTER TABLE `trn_medialogproofbilling` ADD COLUMN IF NOT EXISTS  `medialogproofbilling_commitdate` datetime   AFTER `medialogproofbilling_commitby`;
ALTER TABLE `trn_medialogproofbilling` ADD COLUMN IF NOT EXISTS  `medialogproofbilling_isgenerate` tinyint(1) NOT NULL DEFAULT 0 AFTER `medialogproofbilling_commitdate`;


ALTER TABLE `trn_medialogproofbilling` MODIFY COLUMN IF EXISTS  `medialogproofbilling_date` date NOT NULL  AFTER `medialogproofbilling_id`;
ALTER TABLE `trn_medialogproofbilling` MODIFY COLUMN IF EXISTS  `periodemo_id` varchar(6) NOT NULL  AFTER `medialogproofbilling_date`;
ALTER TABLE `trn_medialogproofbilling` MODIFY COLUMN IF EXISTS  `dept_id` varchar(30)   AFTER `periodemo_id`;
ALTER TABLE `trn_medialogproofbilling` MODIFY COLUMN IF EXISTS  `medialogproofbilling_version` int(4) NOT NULL DEFAULT 0 AFTER `dept_id`;
ALTER TABLE `trn_medialogproofbilling` MODIFY COLUMN IF EXISTS  `medialogproofbilling_iscommit` tinyint(1) NOT NULL DEFAULT 0 AFTER `medialogproofbilling_version`;
ALTER TABLE `trn_medialogproofbilling` MODIFY COLUMN IF EXISTS  `medialogproofbilling_commitby` varchar(14)   AFTER `medialogproofbilling_iscommit`;
ALTER TABLE `trn_medialogproofbilling` MODIFY COLUMN IF EXISTS  `medialogproofbilling_commitdate` datetime   AFTER `medialogproofbilling_commitby`;
ALTER TABLE `trn_medialogproofbilling` MODIFY COLUMN IF EXISTS  `medialogproofbilling_isgenerate` tinyint(1) NOT NULL DEFAULT 0 AFTER `medialogproofbilling_commitdate`;


ALTER TABLE `trn_medialogproofbilling` ADD CONSTRAINT `periodemo_id` UNIQUE IF NOT EXISTS  (`periodemo_id`);

ALTER TABLE `trn_medialogproofbilling` ADD KEY IF NOT EXISTS `periodemo_id` (`periodemo_id`);
ALTER TABLE `trn_medialogproofbilling` ADD KEY IF NOT EXISTS `dept_id` (`dept_id`);

ALTER TABLE `trn_medialogproofbilling` ADD CONSTRAINT `fk_trn_medialogproofbilling_mst_periodemo` FOREIGN KEY IF NOT EXISTS  (`periodemo_id`) REFERENCES `mst_periodemo` (`periodemo_id`);
ALTER TABLE `trn_medialogproofbilling` ADD CONSTRAINT `fk_trn_medialogproofbilling_mst_dept` FOREIGN KEY IF NOT EXISTS  (`dept_id`) REFERENCES `mst_dept` (`dept_id`);





CREATE TABLE IF NOT EXISTS `trn_medialogproofbillingdet` (
	`medialogproofbillingdet_id` varchar(14) NOT NULL , 
	`mediaorder_id` varchar(14)  , 
	`billout_id` varchar(14)  , 
	`medialogproofbilling_gendate` date NOT NULL , 
	`medialogproofbilling_id` varchar(14) NOT NULL , 
	`_createby` varchar(13) NOT NULL , 
	`_createdate` datetime NOT NULL DEFAULT current_timestamp(), 
	`_modifyby` varchar(13)  , 
	`_modifydate` datetime  , 
	PRIMARY KEY (`medialogproofbillingdet_id`)
) 
ENGINE=InnoDB
COMMENT='Daftar Schedule harian';


ALTER TABLE `trn_medialogproofbillingdet` ADD COLUMN IF NOT EXISTS  `mediaorder_id` varchar(14)   AFTER `medialogproofbillingdet_id`;
ALTER TABLE `trn_medialogproofbillingdet` ADD COLUMN IF NOT EXISTS  `billout_id` varchar(14)   AFTER `mediaorder_id`;
ALTER TABLE `trn_medialogproofbillingdet` ADD COLUMN IF NOT EXISTS  `medialogproofbilling_gendate` date NOT NULL  AFTER `billout_id`;
ALTER TABLE `trn_medialogproofbillingdet` ADD COLUMN IF NOT EXISTS  `medialogproofbilling_id` varchar(14) NOT NULL  AFTER `medialogproofbilling_gendate`;


ALTER TABLE `trn_medialogproofbillingdet` MODIFY COLUMN IF EXISTS  `mediaorder_id` varchar(14)   AFTER `medialogproofbillingdet_id`;
ALTER TABLE `trn_medialogproofbillingdet` MODIFY COLUMN IF EXISTS  `billout_id` varchar(14)   AFTER `mediaorder_id`;
ALTER TABLE `trn_medialogproofbillingdet` MODIFY COLUMN IF EXISTS  `medialogproofbilling_gendate` date NOT NULL  AFTER `billout_id`;
ALTER TABLE `trn_medialogproofbillingdet` MODIFY COLUMN IF EXISTS  `medialogproofbilling_id` varchar(14) NOT NULL  AFTER `medialogproofbilling_gendate`;



ALTER TABLE `trn_medialogproofbillingdet` ADD KEY IF NOT EXISTS  `mediaorder_id` (`mediaorder_id`);
ALTER TABLE `trn_medialogproofbillingdet` ADD KEY IF NOT EXISTS  `billout_id` (`billout_id`);
ALTER TABLE `trn_medialogproofbillingdet` ADD KEY IF NOT EXISTS `medialogproofbilling_id` (`medialogproofbilling_id`);

ALTER TABLE `trn_medialogproofbillingdet` ADD CONSTRAINT `fk_trn_medialogproofbillingdet_trn_mediaorder` FOREIGN KEY IF NOT EXISTS (`mediaorder_id`) REFERENCES `trn_mediaorder` (`mediaorder_id`);
ALTER TABLE `trn_medialogproofbillingdet` ADD CONSTRAINT `fk_trn_medialogproofbillingdet_trn_billout` FOREIGN KEY IF NOT EXISTS (`billout_id`) REFERENCES `trn_billout` (`billout_id`);
ALTER TABLE `trn_medialogproofbillingdet` ADD CONSTRAINT `fk_trn_medialogproofbillingdet_trn_medialogproofbilling` FOREIGN KEY IF NOT EXISTS (`medialogproofbilling_id`) REFERENCES `trn_medialogproofbilling` (`medialogproofbilling_id`);




















-- patch 2021 12 19

SET FOREIGN_KEY_CHECKS=0;

drop table if exists `trn_orderin`;
CREATE TABLE IF NOT EXISTS `trn_orderin` (
	`orderin_id` varchar(30) NOT NULL , 
	`unit_id` varchar(10)  , 
	`orderintype_id` varchar(10)  , 
	`orderin_ref` varchar(90)  , 
	`orderin_descr` varchar(90)  , 
	`orderin_dtstart` date NOT NULL , 
	`orderin_dtend` date NOT NULL , 
	`partner_id` varchar(30)  , 
	`dept_id` varchar(30) NOT NULL , 
	`ae_empl_id` varchar(14)  , 
	`trxmodel_id` varchar(10) NOT NULL , 
	`project_id` varchar(30)  , 
	`ppn_taxtype_id` varchar(10)  , 
	`ppn_taxvalue` decimal(4, 2) NOT NULL DEFAULT 0, 
	`ppn_include` tinyint(1) NOT NULL DEFAULT 0, 
	`pph_taxtype_id` varchar(10)  , 
	`pph_taxvalue` decimal(4, 2) NOT NULL DEFAULT 0, 
	`sales_coa_id` varchar(10) NOT NULL , 
	`salesdisc_coa_id` varchar(10)  , 
	`ppn_coa_id` varchar(10)  , 
	`ppnsubsidi_coa_id` varchar(10)  , 
	`pph_coa_id` varchar(10)  , 
	`sales_dept_id` varchar(30) NOT NULL , 
	`orderin_totalitem` int(5) NOT NULL DEFAULT 0, 
	`orderin_totalqty` int(5) NOT NULL DEFAULT 0, 
	`orderin_salesgross` decimal(16, 0) NOT NULL DEFAULT 0, 
	`orderin_discount` decimal(16, 0) NOT NULL DEFAULT 0, 
	`orderin_subtotal` decimal(16, 0) NOT NULL DEFAULT 0, 
	`orderin_pph` decimal(16, 0) NOT NULL DEFAULT 0, 
	`orderin_nett` decimal(16, 0) NOT NULL DEFAULT 0, 
	`orderin_ppn` decimal(16, 0) NOT NULL DEFAULT 0, 
	`orderin_total` decimal(16, 0) NOT NULL DEFAULT 0, 
	`orderin_totaladdcost` decimal(16, 0) NOT NULL DEFAULT 0, 
	`orderin_payment` decimal(16, 0) NOT NULL DEFAULT 0, 
	`orderin_version` int(4) NOT NULL DEFAULT 0, 
	`orderin_isdateinterval` tinyint(1) NOT NULL DEFAULT 0, 
	`orderin_iscommit` tinyint(1) NOT NULL DEFAULT 0, 
	`orderin_commitby` varchar(14)  , 
	`orderin_commitdate` datetime  , 
	`orderin_isclose` tinyint(1) NOT NULL DEFAULT 0, 
	`orderin_closeby` varchar(14)  , 
	`orderin_closedate` datetime  , 
	`orderin_isautogenerated` tinyint(1) NOT NULL DEFAULT 0, 
	`_createby` varchar(13) NOT NULL , 
	`_createdate` datetime NOT NULL DEFAULT current_timestamp(), 
	`_modifyby` varchar(13)  , 
	`_modifydate` datetime  , 
	PRIMARY KEY (`orderin_id`)
) 
ENGINE=InnoDB
COMMENT='Daftar Order Pembelian, Sewa, Service, Talent, dll';


ALTER TABLE `trn_orderin` ADD COLUMN IF NOT EXISTS  `unit_id` varchar(10)   AFTER `orderin_id`;
ALTER TABLE `trn_orderin` ADD COLUMN IF NOT EXISTS  `orderintype_id` varchar(10)   AFTER `unit_id`;
ALTER TABLE `trn_orderin` ADD COLUMN IF NOT EXISTS  `orderin_ref` varchar(90)   AFTER `orderintype_id`;
ALTER TABLE `trn_orderin` ADD COLUMN IF NOT EXISTS  `orderin_descr` varchar(90)   AFTER `orderin_ref`;
ALTER TABLE `trn_orderin` ADD COLUMN IF NOT EXISTS  `orderin_dtstart` date NOT NULL  AFTER `orderin_descr`;
ALTER TABLE `trn_orderin` ADD COLUMN IF NOT EXISTS  `orderin_dtend` date NOT NULL  AFTER `orderin_dtstart`;
ALTER TABLE `trn_orderin` ADD COLUMN IF NOT EXISTS  `partner_id` varchar(30)   AFTER `orderin_dtend`;
ALTER TABLE `trn_orderin` ADD COLUMN IF NOT EXISTS  `dept_id` varchar(30) NOT NULL  AFTER `partner_id`;
ALTER TABLE `trn_orderin` ADD COLUMN IF NOT EXISTS  `ae_empl_id` varchar(14)   AFTER `dept_id`;
ALTER TABLE `trn_orderin` ADD COLUMN IF NOT EXISTS  `trxmodel_id` varchar(10) NOT NULL  AFTER `ae_empl_id`;
ALTER TABLE `trn_orderin` ADD COLUMN IF NOT EXISTS  `project_id` varchar(30)   AFTER `trxmodel_id`;
ALTER TABLE `trn_orderin` ADD COLUMN IF NOT EXISTS  `ppn_taxtype_id` varchar(10)   AFTER `project_id`;
ALTER TABLE `trn_orderin` ADD COLUMN IF NOT EXISTS  `ppn_taxvalue` decimal(4, 2) NOT NULL DEFAULT 0 AFTER `ppn_taxtype_id`;
ALTER TABLE `trn_orderin` ADD COLUMN IF NOT EXISTS  `ppn_include` tinyint(1) NOT NULL DEFAULT 0 AFTER `ppn_taxvalue`;
ALTER TABLE `trn_orderin` ADD COLUMN IF NOT EXISTS  `pph_taxtype_id` varchar(10)   AFTER `ppn_include`;
ALTER TABLE `trn_orderin` ADD COLUMN IF NOT EXISTS  `pph_taxvalue` decimal(4, 2) NOT NULL DEFAULT 0 AFTER `pph_taxtype_id`;
ALTER TABLE `trn_orderin` ADD COLUMN IF NOT EXISTS  `sales_coa_id` varchar(10) NOT NULL  AFTER `pph_taxvalue`;
ALTER TABLE `trn_orderin` ADD COLUMN IF NOT EXISTS  `salesdisc_coa_id` varchar(10)   AFTER `sales_coa_id`;
ALTER TABLE `trn_orderin` ADD COLUMN IF NOT EXISTS  `ppn_coa_id` varchar(10)   AFTER `salesdisc_coa_id`;
ALTER TABLE `trn_orderin` ADD COLUMN IF NOT EXISTS  `ppnsubsidi_coa_id` varchar(10)   AFTER `ppn_coa_id`;
ALTER TABLE `trn_orderin` ADD COLUMN IF NOT EXISTS  `pph_coa_id` varchar(10)   AFTER `ppnsubsidi_coa_id`;
ALTER TABLE `trn_orderin` ADD COLUMN IF NOT EXISTS  `sales_dept_id` varchar(30) NOT NULL  AFTER `pph_coa_id`;
ALTER TABLE `trn_orderin` ADD COLUMN IF NOT EXISTS  `orderin_totalitem` int(5) NOT NULL DEFAULT 0 AFTER `sales_dept_id`;
ALTER TABLE `trn_orderin` ADD COLUMN IF NOT EXISTS  `orderin_totalqty` int(5) NOT NULL DEFAULT 0 AFTER `orderin_totalitem`;
ALTER TABLE `trn_orderin` ADD COLUMN IF NOT EXISTS  `orderin_salesgross` decimal(16, 0) NOT NULL DEFAULT 0 AFTER `orderin_totalqty`;
ALTER TABLE `trn_orderin` ADD COLUMN IF NOT EXISTS  `orderin_discount` decimal(16, 0) NOT NULL DEFAULT 0 AFTER `orderin_salesgross`;
ALTER TABLE `trn_orderin` ADD COLUMN IF NOT EXISTS  `orderin_subtotal` decimal(16, 0) NOT NULL DEFAULT 0 AFTER `orderin_discount`;
ALTER TABLE `trn_orderin` ADD COLUMN IF NOT EXISTS  `orderin_pph` decimal(16, 0) NOT NULL DEFAULT 0 AFTER `orderin_subtotal`;
ALTER TABLE `trn_orderin` ADD COLUMN IF NOT EXISTS  `orderin_nett` decimal(16, 0) NOT NULL DEFAULT 0 AFTER `orderin_pph`;
ALTER TABLE `trn_orderin` ADD COLUMN IF NOT EXISTS  `orderin_ppn` decimal(16, 0) NOT NULL DEFAULT 0 AFTER `orderin_nett`;
ALTER TABLE `trn_orderin` ADD COLUMN IF NOT EXISTS  `orderin_total` decimal(16, 0) NOT NULL DEFAULT 0 AFTER `orderin_ppn`;
ALTER TABLE `trn_orderin` ADD COLUMN IF NOT EXISTS  `orderin_totaladdcost` decimal(16, 0) NOT NULL DEFAULT 0 AFTER `orderin_total`;
ALTER TABLE `trn_orderin` ADD COLUMN IF NOT EXISTS  `orderin_payment` decimal(16, 0) NOT NULL DEFAULT 0 AFTER `orderin_totaladdcost`;
ALTER TABLE `trn_orderin` ADD COLUMN IF NOT EXISTS  `orderin_version` int(4) NOT NULL DEFAULT 0 AFTER `orderin_payment`;
ALTER TABLE `trn_orderin` ADD COLUMN IF NOT EXISTS  `orderin_isdateinterval` tinyint(1) NOT NULL DEFAULT 0 AFTER `orderin_version`;
ALTER TABLE `trn_orderin` ADD COLUMN IF NOT EXISTS  `orderin_iscommit` tinyint(1) NOT NULL DEFAULT 0 AFTER `orderin_isdateinterval`;
ALTER TABLE `trn_orderin` ADD COLUMN IF NOT EXISTS  `orderin_commitby` varchar(14)   AFTER `orderin_iscommit`;
ALTER TABLE `trn_orderin` ADD COLUMN IF NOT EXISTS  `orderin_commitdate` datetime   AFTER `orderin_commitby`;
ALTER TABLE `trn_orderin` ADD COLUMN IF NOT EXISTS  `orderin_isclose` tinyint(1) NOT NULL DEFAULT 0 AFTER `orderin_commitdate`;
ALTER TABLE `trn_orderin` ADD COLUMN IF NOT EXISTS  `orderin_closeby` varchar(14)   AFTER `orderin_isclose`;
ALTER TABLE `trn_orderin` ADD COLUMN IF NOT EXISTS  `orderin_closedate` datetime   AFTER `orderin_closeby`;
ALTER TABLE `trn_orderin` ADD COLUMN IF NOT EXISTS  `orderin_isautogenerated` tinyint(1) NOT NULL DEFAULT 0 AFTER `orderin_closedate`;


ALTER TABLE `trn_orderin` MODIFY COLUMN IF EXISTS  `unit_id` varchar(10)   AFTER `orderin_id`;
ALTER TABLE `trn_orderin` MODIFY COLUMN IF EXISTS  `orderintype_id` varchar(10)   AFTER `unit_id`;
ALTER TABLE `trn_orderin` MODIFY COLUMN IF EXISTS  `orderin_ref` varchar(90)   AFTER `orderintype_id`;
ALTER TABLE `trn_orderin` MODIFY COLUMN IF EXISTS  `orderin_descr` varchar(90)   AFTER `orderin_ref`;
ALTER TABLE `trn_orderin` MODIFY COLUMN IF EXISTS  `orderin_dtstart` date NOT NULL  AFTER `orderin_descr`;
ALTER TABLE `trn_orderin` MODIFY COLUMN IF EXISTS  `orderin_dtend` date NOT NULL  AFTER `orderin_dtstart`;
ALTER TABLE `trn_orderin` MODIFY COLUMN IF EXISTS  `partner_id` varchar(30)   AFTER `orderin_dtend`;
ALTER TABLE `trn_orderin` MODIFY COLUMN IF EXISTS  `dept_id` varchar(30) NOT NULL  AFTER `partner_id`;
ALTER TABLE `trn_orderin` MODIFY COLUMN IF EXISTS  `ae_empl_id` varchar(14)   AFTER `dept_id`;
ALTER TABLE `trn_orderin` MODIFY COLUMN IF EXISTS  `trxmodel_id` varchar(10) NOT NULL  AFTER `ae_empl_id`;
ALTER TABLE `trn_orderin` MODIFY COLUMN IF EXISTS  `project_id` varchar(30)   AFTER `trxmodel_id`;
ALTER TABLE `trn_orderin` MODIFY COLUMN IF EXISTS  `ppn_taxtype_id` varchar(10)   AFTER `project_id`;
ALTER TABLE `trn_orderin` MODIFY COLUMN IF EXISTS  `ppn_taxvalue` decimal(4, 2) NOT NULL DEFAULT 0 AFTER `ppn_taxtype_id`;
ALTER TABLE `trn_orderin` MODIFY COLUMN IF EXISTS  `ppn_include` tinyint(1) NOT NULL DEFAULT 0 AFTER `ppn_taxvalue`;
ALTER TABLE `trn_orderin` MODIFY COLUMN IF EXISTS  `pph_taxtype_id` varchar(10)   AFTER `ppn_include`;
ALTER TABLE `trn_orderin` MODIFY COLUMN IF EXISTS  `pph_taxvalue` decimal(4, 2) NOT NULL DEFAULT 0 AFTER `pph_taxtype_id`;
ALTER TABLE `trn_orderin` MODIFY COLUMN IF EXISTS  `sales_coa_id` varchar(10) NOT NULL  AFTER `pph_taxvalue`;
ALTER TABLE `trn_orderin` MODIFY COLUMN IF EXISTS  `salesdisc_coa_id` varchar(10)   AFTER `sales_coa_id`;
ALTER TABLE `trn_orderin` MODIFY COLUMN IF EXISTS  `ppn_coa_id` varchar(10)   AFTER `salesdisc_coa_id`;
ALTER TABLE `trn_orderin` MODIFY COLUMN IF EXISTS  `ppnsubsidi_coa_id` varchar(10)   AFTER `ppn_coa_id`;
ALTER TABLE `trn_orderin` MODIFY COLUMN IF EXISTS  `pph_coa_id` varchar(10)   AFTER `ppnsubsidi_coa_id`;
ALTER TABLE `trn_orderin` MODIFY COLUMN IF EXISTS  `sales_dept_id` varchar(30) NOT NULL  AFTER `pph_coa_id`;
ALTER TABLE `trn_orderin` MODIFY COLUMN IF EXISTS  `orderin_totalitem` int(5) NOT NULL DEFAULT 0 AFTER `sales_dept_id`;
ALTER TABLE `trn_orderin` MODIFY COLUMN IF EXISTS  `orderin_totalqty` int(5) NOT NULL DEFAULT 0 AFTER `orderin_totalitem`;
ALTER TABLE `trn_orderin` MODIFY COLUMN IF EXISTS  `orderin_salesgross` decimal(16, 0) NOT NULL DEFAULT 0 AFTER `orderin_totalqty`;
ALTER TABLE `trn_orderin` MODIFY COLUMN IF EXISTS  `orderin_discount` decimal(16, 0) NOT NULL DEFAULT 0 AFTER `orderin_salesgross`;
ALTER TABLE `trn_orderin` MODIFY COLUMN IF EXISTS  `orderin_subtotal` decimal(16, 0) NOT NULL DEFAULT 0 AFTER `orderin_discount`;
ALTER TABLE `trn_orderin` MODIFY COLUMN IF EXISTS  `orderin_pph` decimal(16, 0) NOT NULL DEFAULT 0 AFTER `orderin_subtotal`;
ALTER TABLE `trn_orderin` MODIFY COLUMN IF EXISTS  `orderin_nett` decimal(16, 0) NOT NULL DEFAULT 0 AFTER `orderin_pph`;
ALTER TABLE `trn_orderin` MODIFY COLUMN IF EXISTS  `orderin_ppn` decimal(16, 0) NOT NULL DEFAULT 0 AFTER `orderin_nett`;
ALTER TABLE `trn_orderin` MODIFY COLUMN IF EXISTS  `orderin_total` decimal(16, 0) NOT NULL DEFAULT 0 AFTER `orderin_ppn`;
ALTER TABLE `trn_orderin` MODIFY COLUMN IF EXISTS  `orderin_totaladdcost` decimal(16, 0) NOT NULL DEFAULT 0 AFTER `orderin_total`;
ALTER TABLE `trn_orderin` MODIFY COLUMN IF EXISTS  `orderin_payment` decimal(16, 0) NOT NULL DEFAULT 0 AFTER `orderin_totaladdcost`;
ALTER TABLE `trn_orderin` MODIFY COLUMN IF EXISTS  `orderin_version` int(4) NOT NULL DEFAULT 0 AFTER `orderin_payment`;
ALTER TABLE `trn_orderin` MODIFY COLUMN IF EXISTS  `orderin_isdateinterval` tinyint(1) NOT NULL DEFAULT 0 AFTER `orderin_version`;
ALTER TABLE `trn_orderin` MODIFY COLUMN IF EXISTS  `orderin_iscommit` tinyint(1) NOT NULL DEFAULT 0 AFTER `orderin_isdateinterval`;
ALTER TABLE `trn_orderin` MODIFY COLUMN IF EXISTS  `orderin_commitby` varchar(14)   AFTER `orderin_iscommit`;
ALTER TABLE `trn_orderin` MODIFY COLUMN IF EXISTS  `orderin_commitdate` datetime   AFTER `orderin_commitby`;
ALTER TABLE `trn_orderin` MODIFY COLUMN IF EXISTS  `orderin_isclose` tinyint(1) NOT NULL DEFAULT 0 AFTER `orderin_commitdate`;
ALTER TABLE `trn_orderin` MODIFY COLUMN IF EXISTS  `orderin_closeby` varchar(14)   AFTER `orderin_isclose`;
ALTER TABLE `trn_orderin` MODIFY COLUMN IF EXISTS  `orderin_closedate` datetime   AFTER `orderin_closeby`;
ALTER TABLE `trn_orderin` MODIFY COLUMN IF EXISTS  `orderin_isautogenerated` tinyint(1) NOT NULL DEFAULT 0 AFTER `orderin_closedate`;



ALTER TABLE `trn_orderin` ADD KEY IF NOT EXISTS `unit_id` (`unit_id`);
ALTER TABLE `trn_orderin` ADD KEY IF NOT EXISTS `orderintype_id` (`orderintype_id`);
ALTER TABLE `trn_orderin` ADD KEY IF NOT EXISTS `partner_id` (`partner_id`);
ALTER TABLE `trn_orderin` ADD KEY IF NOT EXISTS `dept_id` (`dept_id`);
ALTER TABLE `trn_orderin` ADD KEY IF NOT EXISTS `ae_empl_id` (`ae_empl_id`);
ALTER TABLE `trn_orderin` ADD KEY IF NOT EXISTS `trxmodel_id` (`trxmodel_id`);
ALTER TABLE `trn_orderin` ADD KEY IF NOT EXISTS `project_id` (`project_id`);
ALTER TABLE `trn_orderin` ADD KEY IF NOT EXISTS `ppn_taxtype_id` (`ppn_taxtype_id`);
ALTER TABLE `trn_orderin` ADD KEY IF NOT EXISTS `pph_taxtype_id` (`pph_taxtype_id`);
ALTER TABLE `trn_orderin` ADD KEY IF NOT EXISTS `sales_coa_id` (`sales_coa_id`);
ALTER TABLE `trn_orderin` ADD KEY IF NOT EXISTS `salesdisc_coa_id` (`salesdisc_coa_id`);
ALTER TABLE `trn_orderin` ADD KEY IF NOT EXISTS `ppn_coa_id` (`ppn_coa_id`);
ALTER TABLE `trn_orderin` ADD KEY IF NOT EXISTS `ppnsubsidi_coa_id` (`ppnsubsidi_coa_id`);
ALTER TABLE `trn_orderin` ADD KEY IF NOT EXISTS `pph_coa_id` (`pph_coa_id`);
ALTER TABLE `trn_orderin` ADD KEY IF NOT EXISTS `sales_dept_id` (`sales_dept_id`);

ALTER TABLE `trn_orderin` ADD CONSTRAINT `fk_trn_orderin_mst_unit` FOREIGN KEY IF NOT EXISTS  (`unit_id`) REFERENCES `mst_unit` (`unit_id`);
ALTER TABLE `trn_orderin` ADD CONSTRAINT `fk_trn_orderin_mst_orderintype` FOREIGN KEY IF NOT EXISTS  (`orderintype_id`) REFERENCES `mst_orderintype` (`orderintype_id`);
ALTER TABLE `trn_orderin` ADD CONSTRAINT `fk_trn_orderin_mst_partner` FOREIGN KEY IF NOT EXISTS  (`partner_id`) REFERENCES `mst_partner` (`partner_id`);
ALTER TABLE `trn_orderin` ADD CONSTRAINT `fk_trn_orderin_mst_dept` FOREIGN KEY IF NOT EXISTS  (`dept_id`) REFERENCES `mst_dept` (`dept_id`);
ALTER TABLE `trn_orderin` ADD CONSTRAINT `fk_trn_orderin_mst_empl` FOREIGN KEY IF NOT EXISTS  (`ae_empl_id`) REFERENCES `mst_empl` (`empl_id`);
ALTER TABLE `trn_orderin` ADD CONSTRAINT `fk_trn_orderin_mst_trxmodel` FOREIGN KEY IF NOT EXISTS  (`trxmodel_id`) REFERENCES `mst_trxmodel` (`trxmodel_id`);
ALTER TABLE `trn_orderin` ADD CONSTRAINT `fk_trn_orderin_mst_project` FOREIGN KEY IF NOT EXISTS  (`project_id`) REFERENCES `mst_project` (`project_id`);
ALTER TABLE `trn_orderin` ADD CONSTRAINT `fk_trn_orderin_mst_taxtype` FOREIGN KEY IF NOT EXISTS  (`ppn_taxtype_id`) REFERENCES `mst_taxtype` (`taxtype_id`);
ALTER TABLE `trn_orderin` ADD CONSTRAINT `fk_trn_orderin_mst_taxtype_2` FOREIGN KEY IF NOT EXISTS  (`pph_taxtype_id`) REFERENCES `mst_taxtype` (`taxtype_id`);
ALTER TABLE `trn_orderin` ADD CONSTRAINT `fk_trn_orderin_mst_coa` FOREIGN KEY IF NOT EXISTS  (`sales_coa_id`) REFERENCES `mst_coa` (`coa_id`);
ALTER TABLE `trn_orderin` ADD CONSTRAINT `fk_trn_orderin_mst_coa_2` FOREIGN KEY IF NOT EXISTS  (`salesdisc_coa_id`) REFERENCES `mst_coa` (`coa_id`);
ALTER TABLE `trn_orderin` ADD CONSTRAINT `fk_trn_orderin_mst_coa_3` FOREIGN KEY IF NOT EXISTS  (`ppn_coa_id`) REFERENCES `mst_coa` (`coa_id`);
ALTER TABLE `trn_orderin` ADD CONSTRAINT `fk_trn_orderin_mst_coa_4` FOREIGN KEY IF NOT EXISTS  (`ppnsubsidi_coa_id`) REFERENCES `mst_coa` (`coa_id`);
ALTER TABLE `trn_orderin` ADD CONSTRAINT `fk_trn_orderin_mst_coa_5` FOREIGN KEY IF NOT EXISTS  (`pph_coa_id`) REFERENCES `mst_coa` (`coa_id`);
ALTER TABLE `trn_orderin` ADD CONSTRAINT `fk_trn_orderin_mst_dept_2` FOREIGN KEY IF NOT EXISTS  (`sales_dept_id`) REFERENCES `mst_dept` (`dept_id`);










-- SET FOREIGN_KEY_CHECKS=0;

drop table if exists `trn_billout`;
drop table if exists `trn_billoutdetil`;


CREATE TABLE IF NOT EXISTS `trn_billout` (
	`billout_id` varchar(14) NOT NULL , 
	`dept_id` varchar(30)  , 
	`orderin_id` varchar(30)  , 
	`billout_descr` varchar(255) NOT NULL , 
	`billout_date` date NOT NULL , 
	`billout_datedue` date NOT NULL , 
	`partner_id` varchar(30) NOT NULL , 
	`ppn_taxtype_id` varchar(10)  , 
	`ppn_taxvalue` decimal(4, 2) NOT NULL DEFAULT 0, 
	`ppn_include` tinyint(1) NOT NULL DEFAULT 0, 
	`pph_taxtype_id` varchar(10)  , 
	`pph_taxvalue` decimal(4, 2) NOT NULL DEFAULT 0, 
	`sales_coa_id` varchar(10) NOT NULL , 
	`salesdisc_coa_id` varchar(10)  , 
	`ppn_coa_id` varchar(10)  , 
	`ppnsubsidi_coa_id` varchar(10)  , 
	`pph_coa_id` varchar(10)  , 
	`sales_dept_id` varchar(30) NOT NULL , 
	`billout_totalitem` int(5) NOT NULL DEFAULT 0, 
	`billout_totalqty` int(5) NOT NULL DEFAULT 0, 
	`billout_salesgross` decimal(16, 0) NOT NULL DEFAULT 0, 
	`billout_discount` decimal(16, 0) NOT NULL DEFAULT 0, 
	`billout_subtotal` decimal(16, 0) NOT NULL DEFAULT 0, 
	`billout_pph` decimal(16, 0) NOT NULL DEFAULT 0, 
	`billout_nett` decimal(16, 0) NOT NULL DEFAULT 0, 
	`billout_ppn` decimal(16, 0) NOT NULL DEFAULT 0, 
	`billout_total` decimal(16, 0) NOT NULL DEFAULT 0, 
	`billout_totaladdcost` decimal(16, 0) NOT NULL DEFAULT 0, 
	`billout_payment` decimal(16, 0) NOT NULL DEFAULT 0, 
	`billtype_id` varchar(3) NOT NULL , 
	`trxmodel_id` varchar(10) NOT NULL , 
	`doc_id` varchar(30) NOT NULL , 
	`billout_version` int(4) NOT NULL DEFAULT 0, 
	`billout_iscommit` tinyint(1) NOT NULL DEFAULT 0, 
	`billout_commitby` varchar(14)  , 
	`billout_commitdate` datetime  , 
	`billout_ispost` tinyint(1) NOT NULL DEFAULT 0, 
	`billout_postby` varchar(14)  , 
	`billout_postdate` datetime  , 
	`_createby` varchar(13) NOT NULL , 
	`_createdate` datetime NOT NULL DEFAULT current_timestamp(), 
	`_modifyby` varchar(13)  , 
	`_modifydate` datetime  , 
	PRIMARY KEY (`billout_id`)
) 
ENGINE=InnoDB
COMMENT='Daftar Tagihan Keluar';


ALTER TABLE `trn_billout` ADD COLUMN IF NOT EXISTS  `dept_id` varchar(30)   AFTER `billout_id`;
ALTER TABLE `trn_billout` ADD COLUMN IF NOT EXISTS  `orderin_id` varchar(30)   AFTER `dept_id`;
ALTER TABLE `trn_billout` ADD COLUMN IF NOT EXISTS  `billout_descr` varchar(255) NOT NULL  AFTER `orderin_id`;
ALTER TABLE `trn_billout` ADD COLUMN IF NOT EXISTS  `billout_date` date NOT NULL  AFTER `billout_descr`;
ALTER TABLE `trn_billout` ADD COLUMN IF NOT EXISTS  `billout_datedue` date NOT NULL  AFTER `billout_date`;
ALTER TABLE `trn_billout` ADD COLUMN IF NOT EXISTS  `partner_id` varchar(30) NOT NULL  AFTER `billout_datedue`;
ALTER TABLE `trn_billout` ADD COLUMN IF NOT EXISTS  `ppn_taxtype_id` varchar(10)   AFTER `partner_id`;
ALTER TABLE `trn_billout` ADD COLUMN IF NOT EXISTS  `ppn_taxvalue` decimal(4, 2) NOT NULL DEFAULT 0 AFTER `ppn_taxtype_id`;
ALTER TABLE `trn_billout` ADD COLUMN IF NOT EXISTS  `ppn_include` tinyint(1) NOT NULL DEFAULT 0 AFTER `ppn_taxvalue`;
ALTER TABLE `trn_billout` ADD COLUMN IF NOT EXISTS  `pph_taxtype_id` varchar(10)   AFTER `ppn_include`;
ALTER TABLE `trn_billout` ADD COLUMN IF NOT EXISTS  `pph_taxvalue` decimal(4, 2) NOT NULL DEFAULT 0 AFTER `pph_taxtype_id`;
ALTER TABLE `trn_billout` ADD COLUMN IF NOT EXISTS  `sales_coa_id` varchar(10) NOT NULL  AFTER `pph_taxvalue`;
ALTER TABLE `trn_billout` ADD COLUMN IF NOT EXISTS  `salesdisc_coa_id` varchar(10)   AFTER `sales_coa_id`;
ALTER TABLE `trn_billout` ADD COLUMN IF NOT EXISTS  `ppn_coa_id` varchar(10)   AFTER `salesdisc_coa_id`;
ALTER TABLE `trn_billout` ADD COLUMN IF NOT EXISTS  `ppnsubsidi_coa_id` varchar(10)   AFTER `ppn_coa_id`;
ALTER TABLE `trn_billout` ADD COLUMN IF NOT EXISTS  `pph_coa_id` varchar(10)   AFTER `ppnsubsidi_coa_id`;
ALTER TABLE `trn_billout` ADD COLUMN IF NOT EXISTS  `sales_dept_id` varchar(30) NOT NULL  AFTER `pph_coa_id`;
ALTER TABLE `trn_billout` ADD COLUMN IF NOT EXISTS  `billout_totalitem` int(5) NOT NULL DEFAULT 0 AFTER `sales_dept_id`;
ALTER TABLE `trn_billout` ADD COLUMN IF NOT EXISTS  `billout_totalqty` int(5) NOT NULL DEFAULT 0 AFTER `billout_totalitem`;
ALTER TABLE `trn_billout` ADD COLUMN IF NOT EXISTS  `billout_salesgross` decimal(16, 0) NOT NULL DEFAULT 0 AFTER `billout_totalqty`;
ALTER TABLE `trn_billout` ADD COLUMN IF NOT EXISTS  `billout_discount` decimal(16, 0) NOT NULL DEFAULT 0 AFTER `billout_salesgross`;
ALTER TABLE `trn_billout` ADD COLUMN IF NOT EXISTS  `billout_subtotal` decimal(16, 0) NOT NULL DEFAULT 0 AFTER `billout_discount`;
ALTER TABLE `trn_billout` ADD COLUMN IF NOT EXISTS  `billout_pph` decimal(16, 0) NOT NULL DEFAULT 0 AFTER `billout_subtotal`;
ALTER TABLE `trn_billout` ADD COLUMN IF NOT EXISTS  `billout_nett` decimal(16, 0) NOT NULL DEFAULT 0 AFTER `billout_pph`;
ALTER TABLE `trn_billout` ADD COLUMN IF NOT EXISTS  `billout_ppn` decimal(16, 0) NOT NULL DEFAULT 0 AFTER `billout_nett`;
ALTER TABLE `trn_billout` ADD COLUMN IF NOT EXISTS  `billout_total` decimal(16, 0) NOT NULL DEFAULT 0 AFTER `billout_ppn`;
ALTER TABLE `trn_billout` ADD COLUMN IF NOT EXISTS  `billout_totaladdcost` decimal(16, 0) NOT NULL DEFAULT 0 AFTER `billout_total`;
ALTER TABLE `trn_billout` ADD COLUMN IF NOT EXISTS  `billout_payment` decimal(16, 0) NOT NULL DEFAULT 0 AFTER `billout_totaladdcost`;
ALTER TABLE `trn_billout` ADD COLUMN IF NOT EXISTS  `billtype_id` varchar(3) NOT NULL  AFTER `billout_payment`;
ALTER TABLE `trn_billout` ADD COLUMN IF NOT EXISTS  `trxmodel_id` varchar(10) NOT NULL  AFTER `billtype_id`;
ALTER TABLE `trn_billout` ADD COLUMN IF NOT EXISTS  `doc_id` varchar(30) NOT NULL  AFTER `trxmodel_id`;
ALTER TABLE `trn_billout` ADD COLUMN IF NOT EXISTS  `billout_version` int(4) NOT NULL DEFAULT 0 AFTER `doc_id`;
ALTER TABLE `trn_billout` ADD COLUMN IF NOT EXISTS  `billout_iscommit` tinyint(1) NOT NULL DEFAULT 0 AFTER `billout_version`;
ALTER TABLE `trn_billout` ADD COLUMN IF NOT EXISTS  `billout_commitby` varchar(14)   AFTER `billout_iscommit`;
ALTER TABLE `trn_billout` ADD COLUMN IF NOT EXISTS  `billout_commitdate` datetime   AFTER `billout_commitby`;
ALTER TABLE `trn_billout` ADD COLUMN IF NOT EXISTS  `billout_ispost` tinyint(1) NOT NULL DEFAULT 0 AFTER `billout_commitdate`;
ALTER TABLE `trn_billout` ADD COLUMN IF NOT EXISTS  `billout_postby` varchar(14)   AFTER `billout_ispost`;
ALTER TABLE `trn_billout` ADD COLUMN IF NOT EXISTS  `billout_postdate` datetime   AFTER `billout_postby`;


ALTER TABLE `trn_billout` MODIFY COLUMN IF EXISTS  `dept_id` varchar(30)   AFTER `billout_id`;
ALTER TABLE `trn_billout` MODIFY COLUMN IF EXISTS  `orderin_id` varchar(30)   AFTER `dept_id`;
ALTER TABLE `trn_billout` MODIFY COLUMN IF EXISTS  `billout_descr` varchar(255) NOT NULL  AFTER `orderin_id`;
ALTER TABLE `trn_billout` MODIFY COLUMN IF EXISTS  `billout_date` date NOT NULL  AFTER `billout_descr`;
ALTER TABLE `trn_billout` MODIFY COLUMN IF EXISTS  `billout_datedue` date NOT NULL  AFTER `billout_date`;
ALTER TABLE `trn_billout` MODIFY COLUMN IF EXISTS  `partner_id` varchar(30) NOT NULL  AFTER `billout_datedue`;
ALTER TABLE `trn_billout` MODIFY COLUMN IF EXISTS  `ppn_taxtype_id` varchar(10)   AFTER `partner_id`;
ALTER TABLE `trn_billout` MODIFY COLUMN IF EXISTS  `ppn_taxvalue` decimal(4, 2) NOT NULL DEFAULT 0 AFTER `ppn_taxtype_id`;
ALTER TABLE `trn_billout` MODIFY COLUMN IF EXISTS  `ppn_include` tinyint(1) NOT NULL DEFAULT 0 AFTER `ppn_taxvalue`;
ALTER TABLE `trn_billout` MODIFY COLUMN IF EXISTS  `pph_taxtype_id` varchar(10)   AFTER `ppn_include`;
ALTER TABLE `trn_billout` MODIFY COLUMN IF EXISTS  `pph_taxvalue` decimal(4, 2) NOT NULL DEFAULT 0 AFTER `pph_taxtype_id`;
ALTER TABLE `trn_billout` MODIFY COLUMN IF EXISTS  `sales_coa_id` varchar(10) NOT NULL  AFTER `pph_taxvalue`;
ALTER TABLE `trn_billout` MODIFY COLUMN IF EXISTS  `salesdisc_coa_id` varchar(10)   AFTER `sales_coa_id`;
ALTER TABLE `trn_billout` MODIFY COLUMN IF EXISTS  `ppn_coa_id` varchar(10)   AFTER `salesdisc_coa_id`;
ALTER TABLE `trn_billout` MODIFY COLUMN IF EXISTS  `ppnsubsidi_coa_id` varchar(10)   AFTER `ppn_coa_id`;
ALTER TABLE `trn_billout` MODIFY COLUMN IF EXISTS  `pph_coa_id` varchar(10)   AFTER `ppnsubsidi_coa_id`;
ALTER TABLE `trn_billout` MODIFY COLUMN IF EXISTS  `sales_dept_id` varchar(30) NOT NULL  AFTER `pph_coa_id`;
ALTER TABLE `trn_billout` MODIFY COLUMN IF EXISTS  `billout_totalitem` int(5) NOT NULL DEFAULT 0 AFTER `sales_dept_id`;
ALTER TABLE `trn_billout` MODIFY COLUMN IF EXISTS  `billout_totalqty` int(5) NOT NULL DEFAULT 0 AFTER `billout_totalitem`;
ALTER TABLE `trn_billout` MODIFY COLUMN IF EXISTS  `billout_salesgross` decimal(16, 0) NOT NULL DEFAULT 0 AFTER `billout_totalqty`;
ALTER TABLE `trn_billout` MODIFY COLUMN IF EXISTS  `billout_discount` decimal(16, 0) NOT NULL DEFAULT 0 AFTER `billout_salesgross`;
ALTER TABLE `trn_billout` MODIFY COLUMN IF EXISTS  `billout_subtotal` decimal(16, 0) NOT NULL DEFAULT 0 AFTER `billout_discount`;
ALTER TABLE `trn_billout` MODIFY COLUMN IF EXISTS  `billout_pph` decimal(16, 0) NOT NULL DEFAULT 0 AFTER `billout_subtotal`;
ALTER TABLE `trn_billout` MODIFY COLUMN IF EXISTS  `billout_nett` decimal(16, 0) NOT NULL DEFAULT 0 AFTER `billout_pph`;
ALTER TABLE `trn_billout` MODIFY COLUMN IF EXISTS  `billout_ppn` decimal(16, 0) NOT NULL DEFAULT 0 AFTER `billout_nett`;
ALTER TABLE `trn_billout` MODIFY COLUMN IF EXISTS  `billout_total` decimal(16, 0) NOT NULL DEFAULT 0 AFTER `billout_ppn`;
ALTER TABLE `trn_billout` MODIFY COLUMN IF EXISTS  `billout_totaladdcost` decimal(16, 0) NOT NULL DEFAULT 0 AFTER `billout_total`;
ALTER TABLE `trn_billout` MODIFY COLUMN IF EXISTS  `billout_payment` decimal(16, 0) NOT NULL DEFAULT 0 AFTER `billout_totaladdcost`;
ALTER TABLE `trn_billout` MODIFY COLUMN IF EXISTS  `billtype_id` varchar(3) NOT NULL  AFTER `billout_payment`;
ALTER TABLE `trn_billout` MODIFY COLUMN IF EXISTS  `trxmodel_id` varchar(10) NOT NULL  AFTER `billtype_id`;
ALTER TABLE `trn_billout` MODIFY COLUMN IF EXISTS  `doc_id` varchar(30) NOT NULL  AFTER `trxmodel_id`;
ALTER TABLE `trn_billout` MODIFY COLUMN IF EXISTS  `billout_version` int(4) NOT NULL DEFAULT 0 AFTER `doc_id`;
ALTER TABLE `trn_billout` MODIFY COLUMN IF EXISTS  `billout_iscommit` tinyint(1) NOT NULL DEFAULT 0 AFTER `billout_version`;
ALTER TABLE `trn_billout` MODIFY COLUMN IF EXISTS  `billout_commitby` varchar(14)   AFTER `billout_iscommit`;
ALTER TABLE `trn_billout` MODIFY COLUMN IF EXISTS  `billout_commitdate` datetime   AFTER `billout_commitby`;
ALTER TABLE `trn_billout` MODIFY COLUMN IF EXISTS  `billout_ispost` tinyint(1) NOT NULL DEFAULT 0 AFTER `billout_commitdate`;
ALTER TABLE `trn_billout` MODIFY COLUMN IF EXISTS  `billout_postby` varchar(14)   AFTER `billout_ispost`;
ALTER TABLE `trn_billout` MODIFY COLUMN IF EXISTS  `billout_postdate` datetime   AFTER `billout_postby`;



ALTER TABLE `trn_billout` ADD KEY IF NOT EXISTS `dept_id` (`dept_id`);
ALTER TABLE `trn_billout` ADD KEY IF NOT EXISTS `orderin_id` (`orderin_id`);
ALTER TABLE `trn_billout` ADD KEY IF NOT EXISTS `partner_id` (`partner_id`);
ALTER TABLE `trn_billout` ADD KEY IF NOT EXISTS `ppn_taxtype_id` (`ppn_taxtype_id`);
ALTER TABLE `trn_billout` ADD KEY IF NOT EXISTS `pph_taxtype_id` (`pph_taxtype_id`);
ALTER TABLE `trn_billout` ADD KEY IF NOT EXISTS `sales_coa_id` (`sales_coa_id`);
ALTER TABLE `trn_billout` ADD KEY IF NOT EXISTS `salesdisc_coa_id` (`salesdisc_coa_id`);
ALTER TABLE `trn_billout` ADD KEY IF NOT EXISTS `ppn_coa_id` (`ppn_coa_id`);
ALTER TABLE `trn_billout` ADD KEY IF NOT EXISTS `ppnsubsidi_coa_id` (`ppnsubsidi_coa_id`);
ALTER TABLE `trn_billout` ADD KEY IF NOT EXISTS `pph_coa_id` (`pph_coa_id`);
ALTER TABLE `trn_billout` ADD KEY IF NOT EXISTS `sales_dept_id` (`sales_dept_id`);
ALTER TABLE `trn_billout` ADD KEY IF NOT EXISTS `billtype_id` (`billtype_id`);
ALTER TABLE `trn_billout` ADD KEY IF NOT EXISTS `trxmodel_id` (`trxmodel_id`);
ALTER TABLE `trn_billout` ADD KEY IF NOT EXISTS `doc_id` (`doc_id`);

ALTER TABLE `trn_billout` ADD CONSTRAINT `fk_trn_billout_mst_dept` FOREIGN KEY IF NOT EXISTS  (`dept_id`) REFERENCES `mst_dept` (`dept_id`);
ALTER TABLE `trn_billout` ADD CONSTRAINT `fk_trn_billout_trn_orderin` FOREIGN KEY IF NOT EXISTS  (`orderin_id`) REFERENCES `trn_orderin` (`orderin_id`);
ALTER TABLE `trn_billout` ADD CONSTRAINT `fk_trn_billout_mst_partner` FOREIGN KEY IF NOT EXISTS  (`partner_id`) REFERENCES `mst_partner` (`partner_id`);
ALTER TABLE `trn_billout` ADD CONSTRAINT `fk_trn_billout_mst_taxtype` FOREIGN KEY IF NOT EXISTS  (`ppn_taxtype_id`) REFERENCES `mst_taxtype` (`taxtype_id`);
ALTER TABLE `trn_billout` ADD CONSTRAINT `fk_trn_billout_mst_taxtype_2` FOREIGN KEY IF NOT EXISTS  (`pph_taxtype_id`) REFERENCES `mst_taxtype` (`taxtype_id`);
ALTER TABLE `trn_billout` ADD CONSTRAINT `fk_trn_billout_mst_coa` FOREIGN KEY IF NOT EXISTS  (`sales_coa_id`) REFERENCES `mst_coa` (`coa_id`);
ALTER TABLE `trn_billout` ADD CONSTRAINT `fk_trn_billout_mst_coa_2` FOREIGN KEY IF NOT EXISTS  (`salesdisc_coa_id`) REFERENCES `mst_coa` (`coa_id`);
ALTER TABLE `trn_billout` ADD CONSTRAINT `fk_trn_billout_mst_coa_3` FOREIGN KEY IF NOT EXISTS  (`ppn_coa_id`) REFERENCES `mst_coa` (`coa_id`);
ALTER TABLE `trn_billout` ADD CONSTRAINT `fk_trn_billout_mst_coa_4` FOREIGN KEY IF NOT EXISTS  (`ppnsubsidi_coa_id`) REFERENCES `mst_coa` (`coa_id`);
ALTER TABLE `trn_billout` ADD CONSTRAINT `fk_trn_billout_mst_coa_5` FOREIGN KEY IF NOT EXISTS  (`pph_coa_id`) REFERENCES `mst_coa` (`coa_id`);
ALTER TABLE `trn_billout` ADD CONSTRAINT `fk_trn_billout_mst_dept_2` FOREIGN KEY IF NOT EXISTS  (`sales_dept_id`) REFERENCES `mst_dept` (`dept_id`);
ALTER TABLE `trn_billout` ADD CONSTRAINT `fk_trn_billout_mst_billtype` FOREIGN KEY IF NOT EXISTS  (`billtype_id`) REFERENCES `mst_billtype` (`billtype_id`);
ALTER TABLE `trn_billout` ADD CONSTRAINT `fk_trn_billout_mst_trxmodel` FOREIGN KEY IF NOT EXISTS  (`trxmodel_id`) REFERENCES `mst_trxmodel` (`trxmodel_id`);
ALTER TABLE `trn_billout` ADD CONSTRAINT `fk_trn_billout_mst_doc` FOREIGN KEY IF NOT EXISTS  (`doc_id`) REFERENCES `mst_doc` (`doc_id`);





CREATE TABLE IF NOT EXISTS `trn_billoutdetil` (
	`billoutdetil_id` varchar(14) NOT NULL , 
	`billrowtype_id` varchar(1) NOT NULL , 
	`taxtype_id` varchar(10)  , 
	`billoutdetil_descr` varchar(255) NOT NULL , 
	`curr_id` varchar(10) NOT NULL , 
	`billoutdetil_valfrg` decimal(14, 2) NOT NULL DEFAULT 0, 
	`billoutdetil_valfrgrate` decimal(14, 0) NOT NULL DEFAULT 0, 
	`billoutdetil_validr` decimal(14, 2) NOT NULL DEFAULT 0, 
	`itemclass_id` varchar(14) NOT NULL , 
	`coa_id` varchar(17)  , 
	`billout_id` varchar(14) NOT NULL , 
	`_createby` varchar(13) NOT NULL , 
	`_createdate` datetime NOT NULL DEFAULT current_timestamp(), 
	`_modifyby` varchar(13)  , 
	`_modifydate` datetime  , 
	PRIMARY KEY (`billoutdetil_id`)
) 
ENGINE=InnoDB
COMMENT='Bill out Detil';


ALTER TABLE `trn_billoutdetil` ADD COLUMN IF NOT EXISTS  `billrowtype_id` varchar(1) NOT NULL  AFTER `billoutdetil_id`;
ALTER TABLE `trn_billoutdetil` ADD COLUMN IF NOT EXISTS  `taxtype_id` varchar(10)   AFTER `billrowtype_id`;
ALTER TABLE `trn_billoutdetil` ADD COLUMN IF NOT EXISTS  `billoutdetil_descr` varchar(255) NOT NULL  AFTER `taxtype_id`;
ALTER TABLE `trn_billoutdetil` ADD COLUMN IF NOT EXISTS  `curr_id` varchar(10) NOT NULL  AFTER `billoutdetil_descr`;
ALTER TABLE `trn_billoutdetil` ADD COLUMN IF NOT EXISTS  `billoutdetil_valfrg` decimal(14, 2) NOT NULL DEFAULT 0 AFTER `curr_id`;
ALTER TABLE `trn_billoutdetil` ADD COLUMN IF NOT EXISTS  `billoutdetil_valfrgrate` decimal(14, 0) NOT NULL DEFAULT 0 AFTER `billoutdetil_valfrg`;
ALTER TABLE `trn_billoutdetil` ADD COLUMN IF NOT EXISTS  `billoutdetil_validr` decimal(14, 2) NOT NULL DEFAULT 0 AFTER `billoutdetil_valfrgrate`;
ALTER TABLE `trn_billoutdetil` ADD COLUMN IF NOT EXISTS  `itemclass_id` varchar(14) NOT NULL  AFTER `billoutdetil_validr`;
ALTER TABLE `trn_billoutdetil` ADD COLUMN IF NOT EXISTS  `coa_id` varchar(17)   AFTER `itemclass_id`;
ALTER TABLE `trn_billoutdetil` ADD COLUMN IF NOT EXISTS  `billout_id` varchar(14) NOT NULL  AFTER `coa_id`;


ALTER TABLE `trn_billoutdetil` MODIFY COLUMN IF EXISTS  `billrowtype_id` varchar(1) NOT NULL  AFTER `billoutdetil_id`;
ALTER TABLE `trn_billoutdetil` MODIFY COLUMN IF EXISTS  `taxtype_id` varchar(10)   AFTER `billrowtype_id`;
ALTER TABLE `trn_billoutdetil` MODIFY COLUMN IF EXISTS  `billoutdetil_descr` varchar(255) NOT NULL  AFTER `taxtype_id`;
ALTER TABLE `trn_billoutdetil` MODIFY COLUMN IF EXISTS  `curr_id` varchar(10) NOT NULL  AFTER `billoutdetil_descr`;
ALTER TABLE `trn_billoutdetil` MODIFY COLUMN IF EXISTS  `billoutdetil_valfrg` decimal(14, 2) NOT NULL DEFAULT 0 AFTER `curr_id`;
ALTER TABLE `trn_billoutdetil` MODIFY COLUMN IF EXISTS  `billoutdetil_valfrgrate` decimal(14, 0) NOT NULL DEFAULT 0 AFTER `billoutdetil_valfrg`;
ALTER TABLE `trn_billoutdetil` MODIFY COLUMN IF EXISTS  `billoutdetil_validr` decimal(14, 2) NOT NULL DEFAULT 0 AFTER `billoutdetil_valfrgrate`;
ALTER TABLE `trn_billoutdetil` MODIFY COLUMN IF EXISTS  `itemclass_id` varchar(14) NOT NULL  AFTER `billoutdetil_validr`;
ALTER TABLE `trn_billoutdetil` MODIFY COLUMN IF EXISTS  `coa_id` varchar(17)   AFTER `itemclass_id`;
ALTER TABLE `trn_billoutdetil` MODIFY COLUMN IF EXISTS  `billout_id` varchar(14) NOT NULL  AFTER `coa_id`;



ALTER TABLE `trn_billoutdetil` ADD KEY IF NOT EXISTS `billrowtype_id` (`billrowtype_id`);
ALTER TABLE `trn_billoutdetil` ADD KEY IF NOT EXISTS `taxtype_id` (`taxtype_id`);
ALTER TABLE `trn_billoutdetil` ADD KEY IF NOT EXISTS `curr_id` (`curr_id`);
ALTER TABLE `trn_billoutdetil` ADD KEY IF NOT EXISTS `itemclass_id` (`itemclass_id`);
ALTER TABLE `trn_billoutdetil` ADD KEY IF NOT EXISTS `coa_id` (`coa_id`);
ALTER TABLE `trn_billoutdetil` ADD KEY IF NOT EXISTS `billout_id` (`billout_id`);

ALTER TABLE `trn_billoutdetil` ADD CONSTRAINT `fk_trn_billoutdetil_mst_billrowtype` FOREIGN KEY IF NOT EXISTS  (`billrowtype_id`) REFERENCES `mst_billrowtype` (`billrowtype_id`);
ALTER TABLE `trn_billoutdetil` ADD CONSTRAINT `fk_trn_billoutdetil_mst_taxtype` FOREIGN KEY IF NOT EXISTS  (`taxtype_id`) REFERENCES `mst_taxtype` (`taxtype_id`);
ALTER TABLE `trn_billoutdetil` ADD CONSTRAINT `fk_trn_billoutdetil_mst_curr` FOREIGN KEY IF NOT EXISTS  (`curr_id`) REFERENCES `mst_curr` (`curr_id`);
ALTER TABLE `trn_billoutdetil` ADD CONSTRAINT `fk_trn_billoutdetil_mst_itemclass` FOREIGN KEY IF NOT EXISTS  (`itemclass_id`) REFERENCES `mst_itemclass` (`itemclass_id`);
ALTER TABLE `trn_billoutdetil` ADD CONSTRAINT `fk_trn_billoutdetil_mst_coa` FOREIGN KEY IF NOT EXISTS  (`coa_id`) REFERENCES `mst_coa` (`coa_id`);
ALTER TABLE `trn_billoutdetil` ADD CONSTRAINT `fk_trn_billoutdetil_trn_billout` FOREIGN KEY IF NOT EXISTS (`billout_id`) REFERENCES `trn_billout` (`billout_id`);






DROP TRIGGER IF EXISTS mst_coagroup_before_insert;

DELIMITER $$
$$


CREATE DEFINER=`root`@`localhost` TRIGGER `mst_coagroup_before_insert` BEFORE INSERT ON `mst_coagroup` FOR EACH ROW BEGIN

	DECLARE PATHID VARCHAR(17);
	DECLARE PARENT_PATHID VARCHAR(17);
	DECLARE PARENT_PATH VARCHAR(390);

	IF NEW.coagroup_parent=NEW.coagroup_id THEN
		SIGNAL SQLSTATE '45000' SET 
		MESSAGE_TEXT = 'Kode parent tidak boleh sama dengan kode group';
	END IF;


	if (@coagroup_skip_trigger is null or @coagroup_skip_trigger<=0) then
	
		SET NEW.coagroup_pathid = NEW.coagroup_id;
	
		SET PATHID = RPAD(NEW.coagroup_pathid, 17, '-');
		SET NEW.coagroup_pathid = PATHID;
	
		IF NEW.coagroup_parent IS NULL THEN
			SET NEW.coagroup_path = PATHID;
			SET NEW.coagroup_level = 0;
		ELSE
			SELECT coagroup_pathid, coagroup_path 
			INTO PARENT_PATHID, PARENT_PATH
			FROM mst_coagroup WHERE coagroup_id = NEW.coagroup_parent;	
				
			SET NEW.coagroup_path = CONCAT(PARENT_PATH, PATHID);
			SET NEW.coagroup_level = (LENGTH(NEW.coagroup_path) / 17) ;
		
		END IF;

	end if;

END


$$
DELIMITER ;




DROP TRIGGER IF EXISTS mst_dept_before_update;

DELIMITER $$
$$

CREATE DEFINER=`root`@`localhost` TRIGGER `mst_dept_before_update` BEFORE UPDATE ON `mst_dept` FOR EACH ROW BEGIN

	
	DECLARE PATHID VARCHAR(30);
	DECLARE CHILDCOUNT INT;
	DECLARE PARENT_PATHID VARCHAR(30);
	DECLARE PARENT_PATH VARCHAR(390);


	SET PATHID = OLD.dept_pathid;
	SET NEW.dept_id = OLD.dept_id;
	SET NEW.dept_pathid = OLD.dept_pathid;

	IF NEW.dept_parent=NEW.dept_id THEN
		SIGNAL SQLSTATE '45000' SET 
		MESSAGE_TEXT = 'Kode parent tidak boleh sama dengan kode group';
	END IF;
	

	if (@dept_skip_trigger is null or @dept_skip_trigger<=0) then

		IF NEW.dept_parent='--NULL--' THEN
	    	SET NEW.dept_parent = NULL;
	    END IF;
	
	
		SELECT COUNT(*) 
		INTO CHILDCOUNT
		FROM mst_dept WHERE dept_parent = NEW.dept_id;
		IF NEW.dept_parent<>OLD.dept_parent AND CHILDCOUNT>0 THEN
			SIGNAL SQLSTATE '45000' SET 
			MESSAGE_TEXT = 'Group yang punya anggota tidak bisa diubah parentnya';	
		END IF;
	
	
		IF NEW.dept_parent IS NULL THEN
			SET NEW.dept_path = NEW.dept_pathid;
			SET NEW.dept_level = 0;
		ELSE
			SELECT dept_pathid, dept_path 
			INTO PARENT_PATHID, PARENT_PATH
			FROM mst_dept WHERE dept_id = NEW.dept_parent;	
				
			SET NEW.dept_path = CONCAT(PARENT_PATH, PATHID);
			SET NEW.dept_level = (LENGTH(NEW.dept_path) / 30);
		
		END IF;

	end if;

END

$$
DELIMITER ;




