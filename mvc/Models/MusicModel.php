<?php


include_once 'Model.php'; 

class MusicModel extends Model
{
	private $musicId;
	private $_userId;
	private $title;
	private $pathToTrack;

	private static $table = 'music';
	private static $musicSelectQueryParam = 'title, path'; //TODO add more params when needed

	//TODO pass in user name into function params, need to implement log in first and check if session is current
	public static function getMusicInfo($args) 
	{
		$whereClause = '_userid = ' . "'" . $args . "'"; 
        return Model::executeSelectQuery(MusicModel::$table, MusicModel::$musicSelectQueryParam, $whereClause);
	}
}
?>