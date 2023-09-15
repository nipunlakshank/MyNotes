<?php

class Login extends Controller
{

    public function index()
    {
        $data = json_decode(file_get_contents('php://input'), true);
        if(empty($data)){
            exit(json_encode(["success" => false, "msg" => "Bad request"]));
        }
        $user = new User();
        $result = $user->login($data);
        exit(json_encode($result));
    }

}
