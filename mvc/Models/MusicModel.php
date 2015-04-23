<?php


include_once 'Model.php'; 

class MusicModel extends Model
{
	private $musicId;
	private $_userId;
	private $title;
	private $pathToTrack;

	private static $table = 'music';
	// private static $musicSelectQueryParam = 'title, path'; //TODO add more params when needed

	//TODO pass in user name into function params, need to implement log in first and check if session is current
	public static function getTrackList($args) 
	{
		$queryParams = 'title';
		$whereClause = '_userid = ' . "'" . $args . "'"; 
        return Model::executeSelectQuery(MusicModel::$table, $queryParams, $whereClause);
	}

	public static function getTrackPath($args)
	{
		$queryParams = 'path';
		$whereClause = 'title = ' . "'" . $args['trackname'] . "'" . ' AND ' . '_userid = ' . "'" . $args['id'] . "'";
		return Model::executeSelectQuery(MusicModel::$table, $queryParams, $whereClause);
 	}

 	public static function addTrackEntryToDb($args)
 	{
 		return Model::executeInsertStatement(MusicModel::$table, $args);
 	}

 	public static function deleteTrackEntryFromDb($args)
 	{
 		$whereClause = 'title = ' . "'" . $args['title'] . "'" . ' AND ' . '_userid = ' . "'" . $args['_userId'] . "'";
 		return Model::executeDeleteStatement(MusicModel::$table, $whereClause);
 	}
}
?>