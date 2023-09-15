<?php

class Register extends Controller
{

    public function index()
    {
        $data = json_decode(file_get_contents('php://input'), true);
        if(empty($data)){
            exit(json_encode(["success" => false, "msg" => "Bad request"]));
        }
        $user = new User();
        $result = $user->register($data);
        exit(json_encode($result));
    }

    public function show() : void {
        $data = json_decode(file_get_contents('php://input'), true);
        if(empty($data)){
            exit(json_encode(["success" => false, "msg" => "Bad request"]));
        }
        $user = new User();
        $result = $user->register($data, true);
        exit(json_encode($result));
    }

}
