<?php

/**
 * User model
 */

class User extends Model
{
    protected array $errors;
    protected string $table = "users";
    protected array $insert_columns = [
        'fname',
        'lname',
        'mobile',
        'password',
        'token',
        'user_types_id',
    ];
    protected array $select_columns = [
        'id',
        'fname',
        'lname',
        'mobile',
        'password',
        'token',
        'user_types_id',
    ];

    public function register(array $data, bool $test = false): array
    {

        if($test) {
            return $data;
        }

        $this->validateRegister($data);

        if(!empty($this->errors)){
            return ["success" => false, "errors" => $this->errors];
        }

        $id = $this->insert($data);

        if($id < 1){
            return ["success" => false, "errors" => $this->errors, "msg" => "Data insert error"];
        }

        $user = $this->selectOne(["id" => $id]);

        if(empty($user)){
            return ["success" => false, "errors" => $this->errors, "msg" => "Data retrieve error"];
        }

        $categoryModel = new Category();
        $userTypeModel = new UserType();
        $user->user_type = $userTypeModel->getName($user->user_types_id);
        $result = [];
        $result['user'] = $user;
        $result['categories'] = $categoryModel->getAll();
        $result['success'] = true;
        return $result;
    }


    public function login(array $data, bool $test = false): array
    {

        if($test){
            return $data;
        }

        if(!empty($data['token']) && !empty($data['id'])){
            return $this->getData($data);
        }

        $this->validateLogin($data);
        if(!empty($this->errors)) return ["success" => false, 'errors' => $this->errors];

        $user = $this->selectOne(["mobile" => $data['mobile']]);
        if(empty($user) || !password_verify($data['password'], $user->password)){
            $this->errors['mobile'] = "Wrong mobile or password";
            $this->errors['password'] = "Wrong mobile or password";
            return ["success" => false, "errors" => $this->errors];
        }

        $categoryModel = new Category();
        $userTypeModel = new UserType();
        $user->user_type = $userTypeModel->getName($user->user_types_id);
        $result = [];
        $result['user'] = $user;
        $result['categories'] = $categoryModel->getAll();
        $result['success'] = !empty($result);
        return $result;
    }


    private function getData(array $data): array
    {
        $user = $this->selectOne($data);

        if(empty($user)){
            return ["success" => false, "msg" => "No user found."];
        }

        $categoryModel = new Category();
        $userTypeModel = new UserType();
        $user->user_type = $userTypeModel->getName($user->user_types_id);
        $result = [];
        $result['user'] = $user;
        $result['categories'] = $categoryModel->getAll();

        $result['success'] = !empty($result);

        return $result;
    }

    private function validateRegister(array $data): void
    {
        $this->errors = [];

        if (empty($data['fname'])) {
            $this->errors['fname'] = "First Name is required";
        } else if (!preg_match("/^[a-zA-Z]+$/", $data['fname'])) {
            $this->errors['fname'] = "Invalid first name";
        }

        if (empty($data['lname'])) {
            $this->errors['lname'] = "Last Name is required";
        } else if (!preg_match("/^[a-zA-Z]+$/", $data['lname'])) {
            $this->errors['lname'] = "Invalid last name";
        }

        // Validate mobile
        if (empty($data['mobile'])) {
            $this->errors['mobile'] = "Mobile is not valid";
        } else if (!preg_match('/^(0|\+94)[7][01245678][0-9]{7}$/', $data["mobile"])) {
            $this->errors['mobile'] = "Invalid mobile";
        }else if(!empty($this->select(['mobile' => $data['mobile']]))){
            $this->errors['mobile'] = "Mobile number already exists.";
        }

        // Validate password
        if (empty($data['password'])) {
            $this->errors['password'] = "Password is required.";
        } else if ($data['password']) {
            // Other validations for password
        }
    }


    private function validateLogin(array $data): void
    {
        $this->errors = [];

        if (empty($data['mobile'])) {
            $this->errors['mobile'] = "Invalid mobile";
        } else if (!preg_match('/^(0|\+94)[7][01245678][0-9]{7}$/', $data["mobile"])) {
            $this->errors['mobile'] = "Invalid mobile";
        }else if(empty($this->selectOne(['mobile' => $data['mobile']]))){
            $this->errors['mobile'] = "Wrong mobile or password";
            $this->errors['password'] = "Wrong mobile or password";
        }
        if (empty($data['password'])) {
            $this->errors['password'] = "Password is invalid";
        }
    }

    protected function insert_hook(array $data): array
    {

        if (!empty($data['new_password']))
            $data['password'] = $data['new_password'];

        if (!empty($data['mobile']))
            $data['mobile'] = str_replace('+94', "0", $data['mobile']);

        $data["token"] = getToken();

        // Sanitizing data
        $data['fname'] = ucfirst(strtolower($data['fname']));
        $data['lname'] = ucfirst(strtolower($data['lname']));

        // Password Hashing
        $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);

        return $data;
    }
}
