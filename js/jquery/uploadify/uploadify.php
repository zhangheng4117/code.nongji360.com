<?php
/*
Uploadify
Copyright (c) 2012 Reactive Apps, Ronnie Garcia
Released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/

// Define a destination
$targetFolder = '/upfile'; // Relative to the root

$verifyToken = md5('unique_salt' . $_POST['timestamp']);

if (!empty($_FILES) && $_POST['token'] == $verifyToken) {
	$tempFile = $_FILES['Filedata']['tmp_name'];
	$targetPath = $_SERVER['DOCUMENT_ROOT'] . $targetFolder;	
	// Validate the file type
	$fileTypes = array('jpg','jpeg','gif','png','JPG','JPEG','GIF','PNG'); // File extensions
	$fileParts = pathinfo($_FILES['Filedata']['name']);
	
	//相对路径的地址
	$pictimename=temp_file_name().'.'.$fileParts['extension'];
	$picpath=$targetFolder.'/'.$pictimename;
	$picname=$_FILES['Filedata']['name'];
	
	$targetFile = rtrim($targetPath,'/') . '/'.$pictimename;// . $_FILES['Filedata']['name'];
	
	
	
	if (in_array($fileParts['extension'],$fileTypes)) {
		move_uploaded_file($tempFile,$targetFile);
		echo $picpath;
	} else {
		echo '您上传的图片格式不正确';
	}
}

//按时间生成临时文件名
function temp_file_name(){
  $TheFileName	= microtime();
  list($f_TheFileName,$s_TheFileName)=explode("   ",$TheFileName);
  $TheFileName	= ((float)$f_TheFileName+(float)$s_TheFileName);
  $TheFileName	= substr($TheFileName,2,6);
  if(strlen($TheFileName)<6){
	  $TheFileName= str_repeat("0",6-strlen($TheFileName)).$TheFileName;
  }
  $TheFileName	= date("YmdHis").$TheFileName;
  return $TheFileName;
}
?>