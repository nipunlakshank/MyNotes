<?php

class UserTypes extends Controller
{

    public function index(): void
    {
        exit;
    }

    public function get() : void {
        if($_SERVER['REQUEST_METHOD'] !== 'GET'){
            exit;
        }
        $usertype = new UserType();
        $result = $usertype->getAll();
        exit(json_encode($result));
    }
}
