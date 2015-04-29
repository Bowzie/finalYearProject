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
				$this->POST(); 
			break;
		}
	}

	public function POST()
	{
		$args =  json_decode(file_get_contents('php://input'), true);
		if(isset($args))
		{	
			//Call selected function from client
			switch($args['functionName'])
			{
				case 'checkTrackName': $this->checkTrackName($args);
				break;
				case 'getTrackList': $this->getTrackList($args);
				break;
				case 'getTrackPath': $this->getTrackPath($args);
				break;
				case 'addTrack': $this->addTrack($args);
				break;
				case 'addDbEntry': $this->addDbEntry($args);
				break;
				case 'deleteTrack': $this->deleteTrack($args);
				break;
				case 'deleteDbEntry': $this->deleteDbEntry($args);
				break;
			}
		}
		else if(isset($_FILES)) //File added
		{
			$this->addTrack();
		}
		else {
			$result['result'] = false;
			$result['error'] = 'Error, no function or file found';
			echo json_encode($result);
		}
	}

	private function checkTrackName($args)
	{
		$musicModel = new MusicModel();
		$music = $musicModel->getTrackName($args);

		if($music === null) //Username not found
		{
			$result['result'] = false;
			echo json_encode($result);
		}
		else //Username on server
		{
			$result['result'] = true;
			echo json_encode($result);
		}		
	}

	private function getTrackList($args)
	{
		$musicModel = new MusicModel();
		$music = $musicModel->getTrackList($args['_userId']);

		echo json_encode($music); //Music info returned to client		
	}

	private function getTrackPath($args)
	{
		$musicModel = new MusicModel();
		$trackPath = $musicModel->getTrackPath($args);

		//Fetch path name
		$title =  $trackPath[0]['path'];

		//Create full path name
		$trackPath = '/../finalYearProject/music/' . $args['username'] . '/' . $title;
		$result['result'] = true;
		$result['trackPath'] = $trackPath;

		echo json_encode($result);
	}

	private function addTrack() //file
	{
		// print_r($_FILES);

		//add file to path 
		$uploadDir = '../../music/' . $_FILES['file']['name'][1] . '/';
		$tmp_name =  $_FILES['file']['tmp_name'][0]; //File
		$filename = $_FILES['file']['name'][0]; //Filename
		$uploadPath = $uploadDir . $filename;

		//Move file to folder
		if(move_uploaded_file($tmp_name, $uploadPath))
		{
			$result['result'] = true;
			// $result['filename'] = $filename;
		}
		else {
			$result['result'] = false;	
			$result['error'] = 'Error uploading file';
		}

		echo json_encode($result);
	}

	private function deleteTrack($args) //args trackname username
	{
		//delete file
		$uploadDir = '../../music/' . $args['username'] . '/';
		$deleted = unlink($uploadDir . $args['path']);

		$result['result'] = $deleted;
		echo json_encode($result);
	}

	private function addDbEntry($args) //_userId title path
	{
		//add entry to db;
		$musicModel = new MusicModel();
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

	private function deleteDbEntry($args) //_userId title
	{		
		$musicModel = new MusicModel();
		$music = $musicModel->deleteTrackEntryFromDb($args);

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