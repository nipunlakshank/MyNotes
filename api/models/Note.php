<?php

/**
 * Note Model
 */

class Note extends Model
{
    protected string $table = "`notes`";
    protected array $insert_columns = [
        'title',
        'description',
        'categories_id',
        'users_id'
    ];
    protected array $select_columns = [
        'id',
        'title',
        'description',
        'categories_id',
        'users_id',
        'created_at',
        'updated_at',
    ];

    public function addNote(array $data): array
    {
        $token = $data['user']['token'];
        $user_id = $data['user']['id'];
        $note = $data['note'];
        if (empty($token) || empty($user_id) || empty($note)) return ["success" => false, "msg" => "Bad request"];

        $userModel = new User();
        $user = $userModel->selectOne(["id" => $user_id, "token" => $token]);

        if (empty($user)) {
            return ["success" => false, "msg" => "No user found"];
        }

        $title = $note['title'] ?? 'Untitled';
        $description = $note['description'] ?? '';
        $cat_id = $note['categories_id'] ?? 1;

        $id = $this->insert(["title" => $title, "description" => $description, "categories_id" => $cat_id, "users_id" => $user_id]);
        if ($id < 1) {
            return ["success" => false, "msg" => "Insert error"];
        }

        return ["success" => true, 'id' => $id];
    }

    public function getNotes(array $data): array
    {
        $user_id = $data['users_id'];
        $token = $data['token'];
        $userModel = new User();
        $user = $userModel->selectOne(['id' => $user_id, 'token' => $token]);

        if (empty($user_id) || empty($token)) {
            return [];
        }

        if (empty($user)) {
            return [];
        }

        $notes = $this->select(data: ['users_id' => $user_id], reversed_order: true);

        $category = new Category();
        $categories = $category->getAll();

        $result = [];

        if (!empty($notes)) {
            foreach ($notes as $note) {
                foreach ($categories as $cat) {
                    if ($cat->id == $note->categories_id) {
                        $note->img = $cat->img;
                        $note->category = $cat->name;
                        array_push($result, $note);
                    }
                }
            }
        }

        return $result;
    }

    public function deleteNotes($data): array
    {
        if(empty($data['users_id']) || empty($data['token'])){
            return ['success' => false, 'msg' => 'Bad request'];
        }
        $userModel = new User();
        $user = $userModel->select(['id' => $data['users_id'], 'token' => $data['token']]);

        if(empty($user)){
            return ['success' => false, 'msg' => 'Bad request'];
        }

        $ids = $data['ids'] ?? [];

        foreach($ids as $id){
            $this->delete(['id' => $id]);
        }

        unset($data['ids']);

        $notes = $this->getNotes([...$data]);
        return ['success' => true, 'notes' => $notes];
    }
}
