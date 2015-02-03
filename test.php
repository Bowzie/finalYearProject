<?php

include_once 'mvc/MusicModel.php';
include_once 'mvc/UserModel.php';

echo 'hue hue hue';
$musicModel = new MusicModel;
$userModel = new UserModel;

$musicModel->getMusicInfo();
$userModel->getUserInfo();

?>