<?php

include_once 'database.php';  

class UserModel extends Model
{
	private static $table = 'user';
	private static $userSelectQueryParam = 'id, userName';

	//TODO pass in user name into function params, need to implement log in first and check if session is current
	public static function getUserInfo() 
	{
        return Model::executeSelectQuery(UserModel::$table, UserModel::$userSelectQueryParam);
	}
}

?>