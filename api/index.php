<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");

require_once 'StudentControl.php';
require_once 'StudentModel.php';

$action = $_GET['action'] ?? '';

try {
    $controller = new StudentControl();

    switch ($action) {
        case 'checkAuth':
            $controller->checkAuth();
            break;
        case 'login':
            $controller->login();
            break;
        case 'logout':
            $controller->logout();
            break;
        case 'getStudents':
            $controller->getStudents();
            break;
        case 'addStudent':
            $controller->addStudent();
            break;
        case 'editStudent':
            $controller->editStudent();
            break;
        case 'deleteStudent':
            $controller->deleteStudent();
            break;
        default:
            http_response_code(400);
            echo json_encode(array("success" => false, "message" => "Unknown action: " . $action));
            break;
    }
} catch (Error $e) {
    http_response_code(500);
    echo json_encode(array("success" => false, "message" => "Server Error: " . $e->getMessage()));
}