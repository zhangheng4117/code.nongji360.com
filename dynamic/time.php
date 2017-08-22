<?php
$type = '';
if ( isset($_GET['type']) )
{
	$type = $_GET['type'];
}

$time = '';
switch ( $type )
{
	case 'date' :
		$time = date('Y-m-d');
		break;
	case 'time' :
		$time = date('H:i:s');
		break;
	case 'datetime' :
		$time = date('Y-m-d H:i:s');
		break;
	default :
		$time = time();
}

echo $time;