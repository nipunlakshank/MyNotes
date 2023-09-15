<?php

use function PHPSTORM_META\map;

/**
 * Category Model
 */

class Category extends Model
{
    protected string $table = "categories";
    protected array $insert_columns = [
        'name',
        'img',
    ];
    protected array $select_columns = [
        'id',
        'name',
        'img',
    ];

    public function getAll(): array
    {
        $categories = $this->selectAll();
        array_map(function ($cat){
            $cat->name = ucfirst(strtolower($cat->name));
            return $cat;
        }, $categories);
        return $categories;
    }
}
