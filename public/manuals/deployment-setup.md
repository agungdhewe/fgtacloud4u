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


##Installasi FGTA##
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
	
```
$ mkdir fgtacloud4u

$ mkdir fgtacloud4u/server
$ mkdir fgtacloud4u/server_apps
$ mkdir fgtacloud4u/server_data

$ mkdir fgtacloud4u/server_apps/ent
$ mkdir fgtacloud4u/server_apps/hrms
$ mkdir fgtacloud4u/server_apps/crm
$ mkdir fgtacloud4u/server_apps/retail
$ mkdir fgtacloud4u/server_apps/finact

$ mkdir fgtacloud4u/server_data/ferrine
$ mkdir fgtacloud4u/server_data/ferrine/grouppriv
$ mkdir fgtacloud4u/server_data/ferrine/menu
$ mkdir fgtacloud4u/server_data/ferrine/progaccess

```	
