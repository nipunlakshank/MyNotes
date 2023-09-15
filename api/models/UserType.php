<?php

use function PHPSTORM_META\map;

/**
 * UserType Model
 */

class UserType extends Model
{
    protected string $table = "user_types";
    protected array $insert_columns = [
        'name',
    ];
    protected array $select_columns = [
        'id',
        'name',
    ];

    public function getName($id): string
    {
        $item = $this->selectOne(['id' => $id]);
        return $item->name;
    }

    public function getAll(): array
    {
        $items = $this->selectAll();
        array_map(function ($cat){
            $cat->name = ucfirst(strtolower($cat->name));
            return $cat;
        }, $items);
        return $items;
    }
}
