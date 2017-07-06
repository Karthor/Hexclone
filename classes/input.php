<?php

class input {

    public static function post($key) {
        return database::escapeString($_POST[$key]);
    }
    
    public static function get($key) {
        return database::escapeString($_GET[$key]);
    }
    
}
