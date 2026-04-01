<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, DELETE");
require_once 'StudentControl.php';
require_once 'StudentModel.php';
$action =$_GET['action'];
$controller=new StudentConrol();
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
                    break;
                    case 'editStudent':
                        break;
                        case 'deleteStudent':
                            $controller->deleteStudent();break;
                            default:
                                http_response_code(400);
                                echo json_encode(array("message" => "Unknown action"));
                                break;
}