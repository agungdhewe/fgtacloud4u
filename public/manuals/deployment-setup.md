#DEPLOYMENT FGTA 4 di UBUNTU LINUX 18.04#

Disini diasumsikan kita akan mendeploy platform FGTA 4 ke sebagai suatu solusi yang akan kita beri nama **ferrine** 


Untuk memudahkan administrasi, disarankan untuk membuat user tersendiri untuk fgta *environtment*.  Untuk keperluan ini, kita akan membuat linux user dengan nama ``fgta``.

Buat linux user: ``fgta``
 

```
$ sudo adduser fgta
```

Set password untuk user ``fgta``

```
$ sudo passwd fgta
```


Buat user ``fgta`` sebagai *sudoers*

```
$ sudo usermod -aG sudo fgta
```

Agar dapat menyimpan file program-program yang dapat diakses oleh web server (apache) di *home directory* ``fgta``, masukkan user ``www-data`` sebagai group ``fgta``.

```
$ sudo usermod -aG fgta www-data
``` 


Selanjutnya, silakan **logout**.

Kemudian **relogin** ke system dengan username ``fgta``.


Setelah masuk ke system sebagai ``fgta`` kita bisa melakukan test apakah user www dapat membaca dan menulis ke satu direktori di *home*.

Simuasi login sebagai user ``www-data``

```
$ sudo -u www-data /bin/bash
``` 

##Install Nodejs 12.x##

Download file installasi nodejs 12

```
$ sudo apt -y install curl dirmngr apt-transport-https lsb-release ca-certificates

$ curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
```


##Install git##

Git ini adalah salah satu tools yang kita perlukan untuk mempermudah installasi dan update langsung dari repository fgta. Namun hal ini adalah optional, apabila anda tidak ingin menhubungkan fgta anda langsung ke repository. Anda dapat melakukan download dan update secara manual.

```
$ sudo apt install git
```


##Deploy FGTA (Manual Install)##
Pada direktori *home*, buat direktori dengan nama ``fgtacloud4u``

Untuk keperluan pembuatan file2 di environtment fgta, anda tidak perlu menggunakan *sudo*. Karena semua file dan direktori di sini akan kita set kepemilikannya sebgai ``fgta``.

Kemudian di direktori tersebut, kita buat lagi direktori-direktori sbb:

* **server**
* **server_apps**
	* **ent**
	* _[modul-modul yang akan kita pasang, misalnya hrms, crm, retail, dll]_
* **server_data**
	* **ferrine** _(ini sesuai dengan nama solusi yang telah kita sebutkan di atas)_
		* **grouppriv**
		* **menus**
		* **progaccess**


Buat direktori dimana anda akan menyimpan platform ini
	
```
$ mkdir fgtacloud4u
```

Buat direktori-direktori utama

```
$ mkdir fgtacloud4u/server
$ mkdir fgtacloud4u/server_apps
$ mkdir fgtacloud4u/server_data
```

Siapkan direktori untuk menyimpan data-data custom. Sesuaikan nama solution dengan keperluan anda. Pada contoh ini digunakan nama **ferrine** sesuai solusi yang dijelaskan di atas

```
$ mkdir fgtacloud4u/server_data/ferrine
$ mkdir fgtacloud4u/server_data/ferrine/grouppriv
$ mkdir fgtacloud4u/server_data/ferrine/menu
$ mkdir fgtacloud4u/server_data/ferrine/progaccess
```	

Siapkan direktori untuk modul-modul yang akan diinstall, misalnya modul ``ent`` 

```
$ mkdir fgtacloud4u/server_apps/ent
```

Ulangi langkan ini sampai semuai direktri untuk modul terbuat.





##Deploy FGTA (Menggunakan Script)##
Untuk memudahkan anda melakukan setup awal, copy script berikut. Diasumsikan module yang akan disetup adalah ent, hrms, retail dan crm.

```
#!/bin/bash  

# beri nama nama solusi
SOLUTION=ferrine
TITLE=Ferrine
ROOTDIR=$(pwd)
PUBLICSOL=$ROOTDIR/fgtacloud4u/server/public_$SOLUTION
APPSDIR=$ROOTDIR/fgtacloud4u/server_apps



# siapkan direktori
mkdir ./fgtacloud4u
mkdir ./fgtacloud4u/server
mkdir ./fgtacloud4u/server_apps
mkdir ./fgtacloud4u/server_data
mkdir ./fgtacloud4u/server_apps/ent
mkdir ./fgtacloud4u/server_apps/hrms
mkdir ./fgtacloud4u/server_apps/crm
mkdir ./fgtacloud4u/server_apps/retail
mkdir ./fgtacloud4u/server_apps/finact
mkdir ./fgtacloud4u/server_data/$SOLUTION
mkdir ./fgtacloud4u/server_data/$SOLUTION/grouppriv
mkdir ./fgtacloud4u/server_data/$SOLUTION/menus
mkdir ./fgtacloud4u/server_data/$SOLUTION/progaccess


# siapkan git
cd fgtacloud4u/server
git init
git remote add origin https://github.com/agungdhewe/fgtacloud4u.git
git pull origin master
mkdir public_$SOLUTION   # buat direktori untuk nampung konfigurasi .htaccess
cd public_$SOLUTION
mkdir assets
ln -s $ROOTDIR/fgtacloud4u/server/public/images images
ln -s $ROOTDIR/fgtacloud4u/server/public/jslibs jslibs
ln -s $ROOTDIR/fgtacloud4u/server/public/templates templates
ln -s $ROOTDIR/fgtacloud4u/server/public/getotp.php getotp.php
ln -s $ROOTDIR/fgtacloud4u/server/public/index.php index.php
ln -s $ROOTDIR/fgtacloud4u/server/public/info.php info.php
cp $ROOTDIR/fgtacloud4u/server/public/dbconfig.php dbconfig.php
cp $ROOTDIR/fgtacloud4u/server/public/manifest.json manifest.json
cp $ROOTDIR/fgtacloud4u/server/public/favicon.ico favicon.ico

# masuk ke direktori public solution untuk setup htaccess
cd $PUBLICSOL


# buat file htaccess
touch .htaccess
echo "SetEnv FGTA_APP_NAME \"$SOLUTION\"" >> .htaccess
echo "SetEnv FGTA_APP_TITLE \"$TITLE\"" >> .htaccess
echo "SetEnv FGTA_DBCONF_PATH \"$ROOTDIR/fgtacloud4u/server/public_$SOLUTION/dbconfig.php\"" >> .htaccess
echo "SetEnv FGTA_LOCALDB_DIR \"$ROOTDIR/fgtacloud4u/server_data/$SOLUTION\"" >> .htaccess



# kembali ke fgtacloud4u/server
cd $ROOTDIR/fgtacloud4u/server

# buat file untuk proses update
SOURCE_DIR=$ROOTDIR/fgtacloud4u/server/core/database
TARGET_DIR=$ROOTDIR/fgtacloud4u/server_data/$SOLUTION
touch update
echo "# update dari repository" >> update
echo "git pull origin master" >> update
echo "" >> update
echo "echo \"copying modules fgta menu...\"" >> update
echo "cp $SOURCE_DIR/menus/modules-fgta.json $TARGET_DIR/menus/"  >> update
echo "cp $SOURCE_DIR/menus/modules-fgta-retail.json $TARGET_DIR/menus/"  >> update
echo "cp $SOURCE_DIR/menus/modules-fgta-hrms.json $TARGET_DIR/menus/"  >> update
echo "cp $SOURCE_DIR/menus/modules-fgta-crm.json $TARGET_DIR/menus/"  >> update
echo "" >>  update
echo "echo \"copying program access...\"" >> update
echo "php copyprogaccess.php $TARGET_DIR/progaccess" >> update
echo "" >> update
echo "echo done." >> update
echo "echo" >> update

chmod 755 update



# buat symlink dari server_apps
cd $ROOTDIR/fgtacloud4u/server/apps
ln -s $APPSDIR/ent ent
ln -s $APPSDIR/hrms hrms
ln -s $APPSDIR/crm crm
ln -s $APPSDIR/retail retail
ln -s $APPSDIR/finact finact



# setup ent
cd $ROOTDIR/fgtacloud4u/server_apps/ent
git init
git remote add origin https://github.com/agungdhewe/fgtacloud4u_ent.git
#git pull origin master
touch update
echo "# update dari repository" >> update
echo "git pull origin master" >> update
chmod 755 update

# setup hrms
cd $ROOTDIR/fgtacloud4u/server_apps/hrms
git init
git remote add origin https://github.com/agungdhewe/fgtacloud4u_hrms.git
#git pull origin master
touch update
echo "# update dari repository" >> update
echo "git pull origin master" >> update
chmod 755 update

# setup retail
cd $ROOTDIR/fgtacloud4u/server_apps/retail
git init
git remote add origin https://github.com/agungdhewe/fgtacloud4u_retail.git
#git pull origin master
touch update
echo "# update dari repository" >> update
echo "git pull origin master" >> update
chmod 755 update

# setup crm
cd $ROOTDIR/fgtacloud4u/server_apps/crm
git init
git remote add origin https://github.com/agungdhewe/fgtacloud4u_crm.git
#git pull origin master
touch update
echo "# update dari repository" >> update
echo "git pull origin master" >> update
chmod 755 update




# buat script untuk updateall
cd $ROOTDIR/fgtacloud4u
touch updateall
echo "echo \"Updating Enterprise modules\"" >> updateall
echo "cd $APPSDIR/ent" >> updateall
echo "./update" >> updateall
echo "" >> updateall

echo "echo \"Updating CRM modules\"" >> updateall
echo "cd $APPSDIR/crm" >> updateall
echo "./update" >> updateall
echo "" >> updateall

echo "echo \"Updating Retail modules\"" >> updateall
echo "cd $APPSDIR/retail" >> updateall
echo "./update" >> updateall
echo "" >> updateall

echo "echo \"Updating HRMS modules\"" >> updateall
echo "cd $APPSDIR/hrms" >> updateall
echo "./update" >> updateall
echo "" >> updateall

echo "echo \"Updating CORE platform\"" >> updateall
echo "cd $ROOTDIR/fgtacloud4u/server" >> updateall
echo "./update" >> updateall
echo "" >> updateall

chmod 755 updateall


./updateall

cd $ROOTDIR



```