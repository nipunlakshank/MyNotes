<?php

class Notes extends Controller
{

    public function index(): void
    {
        exit;
    }

    public function add(): void
    {
        if($_SERVER['REQUEST_METHOD'] !== 'POST'){
            exit;
        }
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data)) {
            exit(json_encode(["success" => false, "msg" => "Bad request"]));
        }
        $note = new Note();
        $result = $note->addNote($data);
        exit(json_encode($result));
    }

    public function get(): void
    {
        if($_SERVER['REQUEST_METHOD'] !== 'POST'){
            exit;
        }
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data)) {
            exit(json_encode(["success" => false, "msg" => "Bad request"]));
        }
        $note = new Note();
        $result = $note->getNotes($data);
        exit(json_encode($result));
    }

    public function delete(): void
    {
        if($_SERVER['REQUEST_METHOD'] !== 'DELETE'){
            exit;
        }
        $data = json_decode(file_get_contents('php://input'), true);

        $note = new Note();
        $result = $note->deleteNotes($data);
        exit(json_encode($result));
    }
}
