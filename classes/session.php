<?php

class session {
    public static function start(){
        session_start();
    }
    
    public static function set($key, $value){
            $_SESSION[$key] = $value;
    }
    
    public static function setArray($first_key, $second_key, $value){
            $_SESSION[$first_key][$second_key] = $value;
    }
    
    public static function getArray($first_key, $second_key){
        if($_SESSION){
            return $_SESSION[$first_key][$second_key];
        }
    }
    
    public static function getID() {
        return session_id();
    }
    
    public static function get($key){
        if($_SESSION){
            return $_SESSION[$key];
        }
    }
    
    public static function display(){
        print_r($_SESSION);
    }
    
    public static function isLoaded(){
        return $_SESSION ? true : false;
    }
    
    public static function destroy(){
        
        
        if($_SESSION){
            session_destroy();
        }
    }
    
    public static function setAlert($msg, $type){
        self::setArray("alert", "type", $type);
        self::setArray("alert", "message", $msg);
    }

    public static function getAlert(){
            $msg = self::getArray("alert","message");

                switch (self::getArray("alert","type")) {
                    case "success":
                        $data = '<div class="alert alert-success"><button class="close" data-dismiss="alert">×</button><strong>Success!</strong> '.$msg.' </div>';
                    break;

                    case "warning":
                        $data = '<div class="alert"><button class="close" data-dismiss="alert">×</button><strong>Warning! </strong> '.$msg.' </div>';
                    break;

                    case "error":
                        $data = '<div class="alert alert-error"><button class="close" data-dismiss="alert">×</button><strong>Error!</strong> '.$msg.' </div>';
                    break;
					
					case "danger":
						$data = '<div class="alert alert-danger ">'. $msg .' </div>';
					break;
                }

            self::setArray("alert", "type", "");
            return $data;
    }  
}