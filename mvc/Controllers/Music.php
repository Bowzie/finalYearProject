<?php
include_once 'Controller.php';
include_once '/../Models/MusicModel.php';

class Music extends Controller 
{
	function __construct() //Empty Constructor
	{

	}

	public function HandleRequest() {
		//TODO switch other request methods (will probably only be delete used) and do switch in controller.php instead
		switch($_SERVER['REQUEST_METHOD']) {
			case 'POST': 
				$this->POST( json_decode(file_get_contents('php://input'), true)); 
			break;
		}
	}

	public function POST($args)
	{
		switch($args['functionName'])
		{
			case 'getTrackList': $this->getTrackList($args);
			break;
			case 'getTrack': $this->checkUsername($args);
			break;
			case: 'addTrack': $this->addTrack($args);
			break;
			case 'deleteTrack': $this->deleteTrack($args);
			break;
		}

	}

	private function getTrackList($args)
	{
		$musicModel = new MusicModel();
		$music = $musicModel->getTrackList($args['id']);
		echo json_encode($music);		
	}

	private function getTrack($args) //args trackname
	{
		$musicModel = new MusicModel();
		$trackPath = $musicModel->getTrackPath($args);
		$file = file_get_contents('../../music/' + $args['username'] + '/' + $trackPath);
		$result['result'] = true;
		$result['track'] = $file;
		echo json_encode($result);
	}

	private function addTrack($args) //file
	{
		if($_FILES[0][$args['trackname']])
		{
			//add file to path 
			$uploadDir = '../../music/' + $args['username'] + '/';
			$uploadFilePath = $uploadDir .  $_FILES[0][$args['trackname']]
			$filename =  $_FILES[0][$args['trackname']];

			if(move_uploaded_file($filename, $uploadFilePath))
			{
				$result['result'] = true;
				$result['filepath'] = $uploadFilePath;
			}
			else {
				$result['result'] = false;	
				$result['error'] = 'Error uploading file';
			}
		}
		else {
			$result['result'] = false;
			$result['error'] = 'File does not exist';
		}
		echo json_encode($result);
	}

	private function deleteTrack($args) //args trackname username
	{
		//delete file
		$uploadDir = '../../music/' + $args['username'] + '/';
		$deleted = unlink($uploadDir + $args['trackname']);
		$result['result'] = $deleted;
		echo json_encode($result);
	}

	private function addDBEntry($args) //_userId title 
	{
		//add entry to db;
		$musicModel = new MusicModel();
		$args['path']
		$music = $musicModel->addTrackEntryToDb($args);

		if($music === true)
		{
			$result['result'] = true;
		}
		else {
			$result['result'] = false;
		}
		echo json_encode($result);
	}

	private function deleteDBEntry($args) //_userId title
	{
		$musicModel = new MusicModel();
		$music = $musicModel->removeTrackEntryFromDB($args)

		if($music === true)
		{
			$result['result'] = true;
		}
		else {
			$result['result'] = false;
		}

		echo json_encode($result);
	}
}

$music = new Music();
$music->HandleRequest();

?>