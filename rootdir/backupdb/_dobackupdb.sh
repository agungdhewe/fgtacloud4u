#!/bin/bash

mysqldump -u root --routines  fgtadb > fgtadb-backup-$(date +%F).sql




