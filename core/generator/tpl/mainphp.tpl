<?php namespace FGTA4\module; if (!defined('FGTA4')) { die('Forbiden'); } 


/**
 * {__MODULEPROG__}
 *
 * ===================================================================
 * Entry point Program Module {__BASENAME__}
 * ===================================================================
 * Program yang akan pertama kali diakses 
 * oleh semua request untuk menampilkan modul 
 *
 * Agung Nugroho <agung@fgta.net> http://www.fgta.net
 * Tangerang, 26 Maret 2021
 *
 * digenerate dengan FGTA4 generator
 * tanggal {__GENDATE__}
 */
$MODULE = new class extends WebModule {

	public function LoadPage() {
		$userdata = $this->auth->session_get_user();


		try {

			


			// parameter=parameter yang bisa diakses langsung dari javascript module
			// dengan memanggil variable global.setup.<namavariable>
			$this->setup = (object)array(
				'print_to_new_window' => false,
				'username' => $userdata->username,/*--__DEFDOCID__--*/
			);

			$variancename = $_GET['variancename'];
			switch ($variancename) {
				default:
					break;
			} 

		} catch (\Exception $ex) {
			$this->error($ex->getMessage());
		}			
	
	}


};
