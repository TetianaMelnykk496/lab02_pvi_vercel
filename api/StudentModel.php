<?php
class StudentModel {
    public function __construct() {

   if (!isset($_SESSION['students'])) {
    $_SESSION['students']=[
        ["id"=>1,"first_name"=>"Tetiana","last_name"=>"Melnyk", "birthday"=>"2001-01-01", "group"=> "PZ-22"],
        ["id"=>2,"first_name"=>"Anna","last_name"=>"Kysliak", "birthday"=>"2001-01-01", "group"=> "PZ-22"],
        ["id"=>3,"first_name"=>"Tetiana","last_name"=>"Melnyk", "birthday"=>"2001-01-01", "group"=> "PZ-22"],
    ];
   }
}