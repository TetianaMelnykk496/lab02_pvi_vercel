<?php
class StudentControl {
    private $model;

    public function __construct(){
        $this->model = new StudentModel();
    }

    private function requireAuth() {
        if (!isset($_SESSION['user'])) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Доступ заборонено. Авторизуйтесь.']);
            exit;
        }
    }

    public function checkAuth(){
        $isLoggedIn = isset($_SESSION['user']);
        echo json_encode(['isLoggedIn' => $isLoggedIn, 'user' => $_SESSION['user'] ?? null]);
    }

    public function login() {
        $data = json_decode(file_get_contents('php://input'), true);
        $username = $data['username'] ?? '';
        $password = $data['password'] ?? '';
        $user = $this->model->findByCredentials($username, $password);

        if ($user) {
            $_SESSION['user'] = $user['first_name'];
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Невірне ім\'я або дата народження']);
        }
    }

    public function logout() {
        unset($_SESSION['user']);
        echo json_encode(['success' => true]);
        session_unset();
        session_destroy();
    }

    public function getStudents() {
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 5;
        echo json_encode($this->model->getAll($page, $limit));
    }

    public function addStudent() {
        $this->requireAuth();
        $data = json_decode(file_get_contents('php://input'), true);
        $errors = $this->validate($data);

        if (!empty($errors)) {
            echo json_encode(['success' => false, 'errors' => $errors]);
            return;
        }

        $this->model->add($data);
        echo json_encode(['success' => true]);
    }

    public function editStudent() {
        $this->requireAuth();
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $_GET['id'] ?? null;

        if (!$id) {
            echo json_encode(['success' => false, 'message' => 'ID не передано']);
            return;
        }

        $errors = $this->validate($data, $id);
        if (!empty($errors)) {
            echo json_encode(['success' => false, 'errors' => $errors]);
            return;
        }

        if ($this->model->update($id, $data)) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'errors' => ['Студента не знайдено']]);
        }
    }

    public function deleteStudent() {
        $this->requireAuth();
        $id = $_GET['id'] ?? null;
        if ($this->model->delete($id)) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Не вдалося знайти студента']);
        }
    }

    private function validate($data, $excludeId = null) {
        $errors = [];

        if (!preg_match('/^[A-ZА-ЯІЇЄ][a-zа-яіїє\']+$/u', $data['first_name'] ?? '')) {
            $errors[] = "Некоректне ім'я";
        }

        if (!preg_match('/^[A-ZА-ЯІЇЄ]{2}-\d{2}$/u', $data['group'] ?? '')) {
            $errors[] = "Некоректна група (Формат: AA-11)";
        }

        if ($this->model->isDuplicate($data['first_name'], $data['last_name'], $excludeId)) {
            $errors[] = "Студент з таким ім'ям та прізвищем вже існує!";
        }
        return $errors;
    }
}