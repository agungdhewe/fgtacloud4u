<?php


$LoginAddonExecute = function($userdata, $db) {
	try {
		$sql = "select empl_id from mst_empluser where user_id = :user_id";
		$stmt = $db->prepare($sql);
		$stmt->execute([
			':user_id' => $userdata->username
		]);
		$row  = $stmt->fetch(\PDO::FETCH_ASSOC);

		if ($row!=null) {
			$userdata->employee_id = $row['empl_id'];
		}

	} catch (\Exception $ex) {
		throw $ex;
	}	


};