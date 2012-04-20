<?php

// Include the WURFL Cloud Client 
require_once 'WurflCloudClient-PHP-1.0.2-Simple/Client/Client.php';
$api_key = ''; // ADD YOUR API KEY IF YOU HAVE ONE
$is_phone_like = NULL;
$is_touch = NULL;

// Create a configuration object  
$config = new WurflCloud_Client_Config();  
 
// Set your WURFL Cloud API Key  
$config->api_key = $api_key;   
 
if ($api_key) {
  // Create the WURFL Cloud Client  
  $client = new WurflCloud_Client_Client($config);  
  
  // Detect your device  
  $client->detectDevice();
  
  $is_phone_like = ($client->getDeviceCapability('has_cellular_radio')) ? "Has a cellular radio" : "Does NOT have a cellular radio";
  $is_touch = ($client->getDeviceCapability('is_touchscreen')) ? "Touchscreen" : "NOT touchscreen";
}

?>