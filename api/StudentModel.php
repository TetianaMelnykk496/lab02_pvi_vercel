<?php
class StudentModel
{
    public function __construct()
    {
        if (!isset($_SESSION['students'])) {
            $_SESSION['students'] = [
                ["id" => "1", "first_name" => "Tetiana", "last_name" => "Melnyk", "birthday" => "2001-01-01", "group" => "PZ-22"],
                ["id" => "2", "first_name" => "Anna", "last_name" => "Kysliak", "birthday" => "2001-01-01", "group" => "PZ-22"]
            ];
        }
    }

    public function getAll($page=1, $limit=5){
        $students = $_SESSION['students'];
        $total = count($students);
        $offset = ($page-1) * $limit;
        $paginated = array_slice($students, $offset, $limit);
        return [
            'data' => $paginated,
            'total' => $total,
            'totalPages' => ceil($total/$limit),
            'currentPage' => (int)$page,
        ];
    }

    public function add($student){
        $student['id'] = uniqid();
        $_SESSION['students'][] = $student;
        return true;
    }

    public function update($id, $updatedData){
        foreach($_SESSION['students'] as $key => $student){
            if($student['id'] == $id){
                $updatedData['id'] = $id;
                $_SESSION['students'][$key] = $updatedData;
                return true;
            }
        }
        return false;
    }

    public function delete($id){
        foreach ($_SESSION['students'] as $key => $student){
            if($student['id'] === $id){
                unset($_SESSION['students'][$key]);
                $_SESSION['students'] = array_values($_SESSION['students']);
                return true;
            }
        }
        return false;
    }

    public function isDuplicate($firstName, $lastName, $excludeId = null){
        foreach ($_SESSION['students'] as $student){
            if($student['first_name'] == $firstName && $student['last_name'] == $lastName){
                if($excludeId !== null && $student['id'] == $excludeId){
                    continue;
                }
                return true;
            }
        }
        return false;
    }

    public function findByCredentials($fullName, $birthday){
        foreach ($_SESSION['students'] as $student){
            $name = $student['first_name']." ".$student['last_name'];
            if($name === $fullName && $student['birthday'] == $birthday){
                return $student;
            }
        }
        return null;
    }
}