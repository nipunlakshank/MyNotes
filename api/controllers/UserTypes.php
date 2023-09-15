<?php

class UserTypes extends Controller
{

    public function index(): void
    {
        exit;
    }

    public function get() : void {
        $usertype = new UserType();
        $result = $usertype->getAll();
        exit(json_encode($result));
    }
}
