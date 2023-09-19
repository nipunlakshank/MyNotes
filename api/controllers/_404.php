<?php

class _404 extends Controller{
    public function index() : void {
        http_response_code(404);
        exit('<h1>404 Not Found!</h1>');
    }
}