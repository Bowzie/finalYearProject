<?php

include_once 'Model.php';  

class UserModel extends Model
{
	private static $table = 'user';
	private static $userSelectQueryParam = 'id, userName';

	//TODO pass in user name into function params, need to implement log in and check if session is current
	public static function getUserInfo($id) 
	{
        return Model::executeSelectQuery($id, UserModel::$table, UserModel::$userSelectQueryParam);
	}
}

?>