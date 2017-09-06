<?php
    if($_POST)
    {
        $to_email = 'robin.harpak@emory.edu';
		$user_name = 'Bobby Jones Website';
	    $user_email = 'DO-NOT-REPLY@emory.edu';
	    $subject = "Website form data";
        
		//check if its an ajax request, exit if not
	    if(!isset($_SERVER['HTTP_X_REQUESTED_WITH']) AND strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest') {
	        
	        $output = json_encode(array( //create JSON data
	            'type'=>'error', 
	            'text' => 'Sorry Request must be Ajax POST'
	        ));
	        die($output); //exit script outputting json data
	    } 
	    
	    //Sanitize input data using PHP filter_var().
	     $name      = filter_var($_POST["name"], FILTER_SANITIZE_STRING);
	     $email      = filter_var($_POST["email"], FILTER_SANITIZE_STRING);
	     $message      = filter_var($_POST["message"], FILTER_SANITIZE_STRING);
         
	    //email body
	    $message_body = "Name : " 
                         . $name
                         ."\r\n" 
                         . "Email : "
                         . $email
                         . "\r\n" 
                         . "Message : "
                         . $message;

        $body = htmlspecialchars_decode($message_body, ENT_NOQUOTES); //deal with quotes
	    
	    //proceed with PHP email.
	    $headers = "From: "
             . $user_name
             . "\r\n" 
             . "Reply-To: "
             . $user_email 
             . "\r\n" 
             . "X-Mailer: PHP/" . phpversion();
             
        //echo $headers;
        //echo $message_body;
	    
	    $send_mail = mail($to_email, $subject, $body, $headers);
	    
	    if(!$send_mail)
	    {
	        //If mail couldn't be sent output error. Check your PHP email configuration (if it ever happens)
	        $output = json_encode(array('type'=>'error', 'text' => 'Could not send mail! Please check your PHP mail configuration.'));
	    }else{
	        $output = json_encode(array('type'=>'message', 'text' => 'Hi '.$user_name .' Thank you for your email'));
	    }
        echo $output;
	}
?>