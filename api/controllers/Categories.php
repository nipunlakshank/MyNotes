<?php

class Categories extends Controller
{

    public function index(): void
    {
        exit;
    }

    public function get() : void {
        $category = new Category();
        $result = $category->getAll();
        exit(json_encode($result));
    }
}
