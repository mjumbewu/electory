<?php

if($_SERVER['REQUEST_METHOD'] != 'POST')
{
	JSON::error('Request must use method POST');
}

if(empty($_REQUEST['email']) || !Validators::email($_REQUEST['email']))
{
	JSON::error('Required parameter "email" missing or invalid');
}


// email user
$to = $_REQUEST['email'];

if(!empty($_REQUEST['name']))
{
	$to = "\"$_REQUEST[name]\" <$to>";
}

$success = Mailer::sendFromTemplate($to, 'invitation', array(), array(
	'Tag' => 'Invitation'
));

JSON::respond(array(
	'success' => $success
	,'to' => $to
));