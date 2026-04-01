/* jshint esversion: 6 */
document.addEventListener('DOMContentLoaded', () => {

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/servicework.js')
                .then(reg => console.log('Service worker has been registered'))
                .catch(err => console.log('Service worker has not been registered'));
        });
    }


const table_body = document.getElementById("students-body-table");
const select_all= document.getElementById("select-all");
// const add_conf_btn = document.getElementById("create-student-btn");
    const save_student_btn = document.getElementById("save-student-btn");
const delete_ok_btn = document.querySelector(".ok-btn");
const add_trigger_btn = document.querySelector('.add-btn');
const student_id= document.getElementById("student-id");

let row_edit=null;
let row_delete = null;

checkAuthStatus();
async function checkAuthStatus(){
    try{
        const response=await fetch('api/index.php?action=checkAuth');
        const auth = await response.json();
        const loginBtn=document.getElementById('login-btn');
        const authElements=document.querySelector('.auth-only');
        if(auth.isLoggedIn){
            if(loginBtn) loginBtn.classList.add('hidden');
            authElements.forEach(el=> el.classList.remove('hidden'));
            loadStudentsFromServer();
        }
    }
    catch (e){
        console.error("Error during log in", e);
    }
}

async function loadStudentsFromServer(){
    try {
        const response = await fetch('api/index.php?action=getStudents');
        const students = await response.json();
        renderTable(students);
    }
    catch(e){
        console.error("Loading students failed",e);
    }
}

function renderTable(students){
    if (!table_body) return;
    table_body.innerHTML="";
    students.forEach(student=>{
        const full_name=`${student.first_name} ${student.last_name}`;
        const status =get_status(full_name);
        const row=`
         <tr data-id="$student.id">
           <td><input type="checkbox" class="row-checkbox" aria-label="Select all" > </td>
             <td>${student.group}</td>
            <td>${full_name}</td>
          <td>${student.gender}</td>
             <td>${student.birthday}</td>
 <td><span class="student-status ${status} "></span></td>
         <td><a href="#student-modal" class="btn edit-btn" aria-label="Select student" ><i class="fa-regular fa-pen-to-square"></i></a>
             <a href="#delete-warn-btn" class="delete-btn btn" aria-label="Delete student student"><i class="fa-solid fa-xmark"></i></a>
         </td>
         </tr>`;

     table_body.innerHTML +=row;
    });
}



function get_status (full_name){
    const profile_name = "Tetiana Melnyk";
    if (full_name === profile_name){
        return "online";
    }
    else{
        return "offline";
    }
}

function clear_form(){
    document.getElementById("student-id").value = "";
    document.getElementById("student-first-name").value = "";
    document.getElementById("student-last-name").value = "";
    document.getElementById("student-group").value = "";
    document.getElementById("student-gender").value = "";
    document.getElementById("student-birthday").value = "";
    document.getElementById("modal-title").textContent = "Add Student";
    save_student_btn.textContent="Save";
    const inputs = document.querySelectorAll(".modal-content input, .modal-content select");
    const labels = document.querySelectorAll(".error-label");

    inputs.forEach(input => input.classList.remove('invalid-input'));
    labels.forEach(label => label.textContent = '');
}

// add_conf_btn.addEventListener("click", () => {
//     let add_group = document.getElementById("add-group").value;
//     let add_first_name=document.getElementById("add-first-name").value;
//     let add_last_name=document.getElementById("add-last-name").value;
//     let add_gender=document.getElementById("add-gender").value;
//     let add_birthday=document.getElementById("add-birthday").value;
//
//     if (add_group === "" || add_first_name === "" || add_last_name === "" || add_gender === ""){
//         alert("Fill all info!");
//         return ;
//     }
//     let full_name = `${add_first_name} ${add_last_name}`;
//     let status_student = get_status(full_name);
//     let new_row = `
//         <tr>
//             <td><input type="checkbox" class="row-checkbox" aria-label="Select all" > </td>
//             <td>${add_group}</td>
//             <td>${add_first_name} ${add_last_name}</td>
//             <td>${add_gender}</td>
//             <td>${add_birthday}</td>
//  <td><span class="student-status ${status_student} "></span></td>
//         <td><a href="#edit-student-modal" class="btn edit-btn" aria-label="Select student" ><i class="fa-regular fa-pen-to-square"></i></a>
//             <a href="#delete-warn-btn" class="delete-btn btn" aria-label="Delete student student"><i class="fa-solid fa-xmark"></i></a>
//         </td>
//         </tr>`;
//
//     table_body.innerHTML +=new_row;
//     document.getElementById("add-first-name").value = "";
//     document.getElementById("add-last-name").value = "";
//     document.getElementById("add-group").value = "";
//     document.getElementById("add-gender").value = "";
//     document.getElementById("add-birthday").value = "";
//     // window.location.hash="#students";
//     });

    add_trigger_btn.addEventListener("click", ()=>{
        clear_form();
        // student_id.value = "";
        // e.target.closest('a').href="#student-modal";
    });

table_body.addEventListener("click", (event) => {
    let edit_btn = event.target.closest(".edit-btn");
    let delete_btn = event.target.closest(".delete-btn");

    if (edit_btn) {
        row_edit = edit_btn.closest("tr");
        let rows_cells_edit = row_edit.getElementsByTagName("td");
document.getElementById("modal-title").textContent = "Edit Student";
student_id.value="editing";

        let group_text = rows_cells_edit[1].textContent;
        let name_surname_text = rows_cells_edit[2].textContent;
        let gender_text = rows_cells_edit[3].textContent;
        let birthday_text = rows_cells_edit[4].textContent;
        let name_surname_words = name_surname_text.split(" ");
        let first_name = name_surname_words[0];
        let last_name = name_surname_words[1];
        document.getElementById("student-group").value = group_text;
        document.getElementById("student-first-name").value = first_name;
        document.getElementById("student-last-name").value = last_name;

        if (gender_text === 'F') {
            document.getElementById("student-gender").value = "Female";
        } else if (gender_text === 'M') {
            document.getElementById("student-gender").value = "Male";
        }

        document.getElementById("student-birthday").value = birthday_text;
    }

    if (delete_btn) {
        const warning = document.querySelector(".warning-text");
        const selected_students = document.querySelectorAll(".row-checkbox:checked");
        if (selected_students.length > 1) {
            warning.textContent = `Are you sure you want to delete ${selected_students.length} students?`;
            row_delete = null;
        } else {
            row_delete = delete_btn.closest("tr");
            let student_name = row_delete.getElementsByTagName("td")[2].textContent;
            warning.textContent = `Are you sure you want to delete ${student_name}?`;
        }
    }
});

delete_ok_btn.addEventListener("click", async() => {
if(row_delete){
    const studentId = row_delete.getAttribute('data-id');
    const response = await fetch(`api/index.php?action=deleteStudent&id=${studentId}`, {method: 'DELETE'});
    const result = await response.json();
    if (result.success){
        row_delete.remove();
        row_delete= null;
        window.location.hash="#students";
    }
    else{
        alert("Server error" + result.meassage);
    }
}
});

// save_edit_btn.addEventListener("click", (event) => {
//     event.preventDefault();
//     if (row_edit===null) {
//         return;
//     }
//     let new_group=document.getElementById("edit-group").value;
//     let new_first_name=document.getElementById("edit-first-name").value;
//     let new_last_name=document.getElementById("edit-last-name").value;
//     let new_gender=document.getElementById("edit-gender").value;
//     let new_birthday=document.getElementById("edit-birthday").value;
//
//     if(new_group==="" || new_first_name==="" || new_last_name==="" || new_gender==="" || new_birthday==="" ){
//         alert("Fill all fields!");
//     }
//
//     let rows_cells_edited= row_edit.getElementsByTagName("td");
//     rows_cells_edited[1].textContent=new_group;
//     rows_cells_edited[2].textContent=new_first_name + " " + new_last_name;
//
//     if(new_gender==='Female'){
//        rows_cells_edited[3].textContent="F";
//     }
//     else  if (new_gender==='Male'){
//         rows_cells_edited[3].textContent="M";
//     }
//
//     rows_cells_edited[4].textContent=new_birthday;
//     row_edit=null;
//     document.getElementById("edit-student-modal").style.display="none";
//      location.hash="#students";
// });

select_all.addEventListener("change", (event) => {
    const checkbox = document.querySelectorAll(".row-checkbox");
    for (let i = 0; i < checkbox.length; i++) {
        checkbox[i].checked = select_all.checked;
    }
});

const loginFormBtn=document.getElementById('submit-login-btn');
if (loginFormBtn){
    loginFormBtn.addEventListener('click', async (e)=>{
        e.preventDefault();
        const username=document.getElementById('login-username').value;
        const password=document.getElementById('login-password').value;
        const response = await fetch ('api/index.php?action=login',{
            method: 'POST',
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify({username,password})
        });
        const result =await response.json();
        if (result.success){
            window.location.hash="#students";
            checkAuthStatus();
        }
        else{
            alert(result.message);
        }
    });
}

const logoutBtn = document.getElementById('logout-btn');
if(logoutBtn){
    logoutBtn.addEventListener('click', async()=>{
        await fetch('api/index.php?action=logout');
        checkAuthStatus();
    });
}

save_student_btn.addEventListener("click", async(event) => {
    event.preventDefault();
    const inputs = document.querySelectorAll(".modal-content input, .modal-content select");
    const labels = document.querySelectorAll(".error-label");
    inputs.forEach(i => i.classList.remove('invalid-input'));
    labels.forEach(l => l.textContent = '');

    const studentData = {
        group: document.getElementById("student-group").value,
        first_name: document.getElementById("student-first-name").value,
        last_name: document.getElementById("student-last-name").value,
        gender: document.getElementById("student-gender").value,
        birthday: document.getElementById("student-birthday").value
    };

    let isValid = true;

    const nameRegex = /^[A-ZА-ЯІЇЄ][a-zа-яіїє']+$/;
    const groupRegex = /^[A-Z]{2}-\d{2}$/;

    if (!nameRegex.test(studentData.first_name)) {
        document.getElementById("student-first-name").classList.add('invalid-input');
        document.getElementById("error-first-name").textContent = "Тільки літери, починаючи з великої";
        isValid = false;
    }

    if (!groupRegex.test(studentData.group)) {
        document.getElementById("student-group").classList.add('invalid-input');
        document.getElementById("error-group").textContent = "Format: AA-11";
        isValid = false;
    }

    if (!nameRegex.test(studentData.first_name)) {
        document.getElementById("student-first-name").classList.add('invalid-input');
        document.getElementById("error-first-name").textContent = "Invalid name (example: Ivan)";
        isValid = false;
    }

    if (!nameRegex.test(studentData.last_name)) {
        document.getElementById("student-last-name").classList.add('invalid-input');
        document.getElementById("error-last-name").textContent = "Invalid last name";
        isValid = false;
    }

    if (!studentData.birthday) {
        document.getElementById("student-birthday").classList.add('invalid-input');
        document.getElementById("error-birthday").textContent = "Enter birthday";
        isValid = false;
    } else {
        const birthDate = new Date(studentData.birthday);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 16 || age > 90) {
            document.getElementById("student-birthday").classList.add('invalid-input');
            document.getElementById("error-birthday").textContent = "Age must be 16-90";
            isValid = false;
        }
    }

    if (!isValid) return;

    try{
        const action=(student_id.value === "editing" ? 'editStudent' : 'addStudent');
        const response = await fetch(`api/index.php?action=${action}`,{
        method:'POST',
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify(studentData)
        });
        const result= await response.json();


    if (result.success) {
        loadStudentsFromServer();
        clear_form();
        window.location.hash = "#students";
    } else {
        alert("Error on server side" + result.errors.join(", "));
        if (result.field_errors) {
            Object.keys(result.field_errors).forEach(field => {
                const input = document.getElementById(`student-${field}`);
                const errorLabel = document.getElementById(`error-${fiels}`);
                if (input) input.classList.add('invalid-input');
                if (errorLabel) errorLabel.textContent = result.field_errors[field];
            });
        }
    }}
catch (error) {
    console.error("Server mistake");
    alert("Could not connect with server");
}
});
    const closeButtons = document.querySelectorAll('.close-btn, .modal-btn a[href="#students"]');

    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            clear_form();
        });
    });
});

