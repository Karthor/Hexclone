<?php

class database {
    public static $conn, $table;

    public static function connect(){
        self::$conn = mysqli_connect("127.0.0.1","root","PASSHERE","DATABASEHERE");
    }
    
    public static function query($data) {
        session::set("queries_num", session::get("queries_num")+1);
        $beginning = self::timer();
        $ret = mysqli_query(self::$conn,$data);
        session::set("queries_time", session::get("queries_time")+round(self::timer()-$beginning,6));
        return $ret;
    }
    
    public static function duplicate ($where_key, $where_val) {
        $esc_where_val = self::escapeString($where_val);
        
        // load the original record into an array
        $tab = self::$table;
        $original_record = self::ExecuteSQL("SELECT * FROM {$tab} WHERE {$where_key} = '{$esc_where_val}'");
        self::ExecuteSQL("INSERT INTO {$tab} (`{$where_key}`) VALUES (NULL)");
        $newid = mysqli_insert_id(self::$conn);
        $query = "UPDATE {$tab} SET ";
        foreach ($original_record as $key => $value) {
          if ($key != $where_key) {
              $query .= '`'.$key.'` = "'.str_replace('"','\"',$value).'", ';
          }
        }
        $query = substr($query,0,strlen($query)-2); # lop off the extra trailing comma
        $query .= " WHERE {$where_key}={$newid}";
        self::ExecuteSQL($query);
        return $newid;
    }

    public static function delete($where_key, $where_val) {
        $esc_where_val = self::escapeString($where_val);
        
        if(self::$table){
            $tab = self::$table;
            $sql = "DELETE FROM {$tab} WHERE {$where_key} = '{$esc_where_val}'";
            self::query($sql);
        } else {
            echo 'You need to specify an Table first!';
        }
    }

    public static function select($where_key, $where_val){
        $esc_where_val = self::escapeString($where_val);
        
        if(self::$table){
            $tab = self::$table;
            $sql = "SELECT * FROM {$tab} WHERE {$where_key} = '{$esc_where_val}'";
            $result = self::query($sql);
            return mysqli_fetch_array($result,MYSQLI_ASSOC);  
        } else {
            echo 'You need to specify an Table first!';
        }
    }
	
        public static function selectMultiArr($where_key, $where_val, $where2_key = null, $where2_val = null){
            $esc_where_val = self::escapeString($where_val);
            $esc_where2_val = self::escapeString($where2_val);
            
            
        if(self::$table){
            $tab = self::$table;
            $sql = "SELECT * FROM {$tab} WHERE {$where_key} = '{$esc_where_val}' and {$where2_key} = '{$esc_where2_val}'";
            if ($result = self::query($sql)) {
                    while ($row = $result->fetch_assoc()) 
                            {
                                $data[] = $row;
                            }
			}
			return $data;
                } else {
                echo 'You need to specify an Table first!';
            }
        }
    
	public static function selectMulti($where_key, $where_val, $id = null, $order = ''){
            $esc_where_val = self::escapeString($where_val);
            
        if(self::$table){
            $tab = self::$table;
            $sql = "SELECT * FROM {$tab} WHERE {$where_key} = '{$esc_where_val}'";
            
            if($order){
                $sql .= $order;
            }
            
            if ($result = self::query($sql)) {
				while ($row = $result->fetch_assoc()) 
				{
                                    if($id){
                                      $data[] = $row[$id];  
                                    } else {
                                      $data[] = $row;
                                    }
				}
			}
			return $data;
        } else {
            echo 'You need to specify an Table first!';
        }
    }
    
    	public static function deleteMulti($where_key, $where_val, $id = null, $order = ''){
            $esc_where_val = self::escapeString($where_val);
            
        if(self::$table){
            $tab = self::$table;
            $sql = "DELETE FROM {$tab} WHERE {$where_key} = '{$esc_where_val}'";
            
            if($order){
                $sql .= $order;
            }
                
            self::query($sql);
            
        } else {
            echo 'You need to specify an Table first!';
        }
    }
    
    public static function updateToNOW($where_key, $where_val, $update_key){
        $esc_where_val = self::escapeString($where_val);
        
        
        if(self::$table){
            $tab = self::$table;
            $sql = "UPDATE {$tab} SET {$update_key}=NOW() WHERE {$where_key}='{$esc_where_val}'";
            if(self::query($sql)){
                
            } else {
                echo "Error updating record: " . mysqli_error(self::$conn);
            }
        } else {
            echo 'You need to specify an Table first!';
        }
    }
    
    public static function update($where_key, $where_val, $update_key, $update_val){
        $esc_where_val = self::escapeString($where_val);
        $esc_update_val = self::escapeString($update_val);
        
        
        if(self::$table){
            $tab = self::$table;
            $sql = "UPDATE {$tab} SET {$update_key}='{$esc_update_val}' WHERE {$where_key}='{$esc_where_val}'";
            if(self::query($sql)){
                
            } else {
                echo "Error updating record: " . mysqli_error(self::$conn);
            }
        } else {
            echo 'You need to specify an Table first!';
        }
    }
    
    public static function timer()
    {
    $time = explode(' ', microtime());
    return $time[0]+$time[1];
    }
    
    public static function escapeString($string) {
        return mysqli_real_escape_string(self::$conn,$string);
    }
    
    public static function ExecuteSQL($sql) {
        $result = self::query($sql);
        return mysqli_fetch_array($result,MYSQLI_ASSOC);
    }
    
    public static function setTable($x){
        self::$table = $x;
    }
    
    public static function getTimeQueries() {
        return number_format(session::get("queries_time")*1000);
    }
    
    public static function getQueriesNum() {
        return session::get("queries_num");
    }
    
    public static function resetQueries() {
        session::set("queries_num", 0);
        session::set("queries_time", 0);
    }
    
}