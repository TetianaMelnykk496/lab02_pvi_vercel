/* jshint esversion: 6 */
document.addEventListener('DOMContentLoaded', () => {

    if('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/servicework.js')
                .then(reg => console.log('Service worker has been registered'))
                .catch(err=>console.log('Service worker has not been registered'));
        })
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
    save_student_btn.taxtContent="Save";
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

delete_ok_btn.addEventListener("click", () => {
let count =0;
const selected_checkbox = document.querySelectorAll(".row-checkbox");
for ( let i=0; i<selected_checkbox.length; i++){
    if(selected_checkbox[i].checked){
        count++;
    }
}

    if(row_delete){
        count++;
    }
    if(count===0){
        document.querySelector(".warning-text").textContent=`Please select students for removal`;
   return;
    }
   for (let i=0; i<selected_checkbox.length; i++){
       if(selected_checkbox[i].checked){
           selected_checkbox[i].closest("tr").remove();
       }
   }

   if(row_delete){
       row_delete.remove();
       row_delete=null;
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

save_student_btn.addEventListener("click", (event) => {
    const studentData={
        group: document.getElementById("student-group").value,
        first_name: document.getElementById("student-first-name").value,
        last_name: document.getElementById("student-last-name").value,
        gender: document.getElementById("student-gender").value,
        birthday: document.getElementById("student-birthday").value
    };

    if(studentData.first_name === "" || studentData.last_name === "" || studentData.group === "" || studentData.gender === "" || studentData.birthday === ""){
        alert("Fill all info");
        event.preventDefault();
        return;
    }

    console.log("Student json: ", JSON.stringify(studentData));
    const full_name = `${studentData.first_name} ${studentData.last_name}`;
    const gender= studentData.gender;
    const status=get_status(full_name);
    if (student_id.value===""){
        let new_row = `
        <tr>
           <td><input type="checkbox" class="row-checkbox" aria-label="Select all" > </td>
             <td>${studentData.group}</td>
            <td>${studentData.first_name} ${studentData.last_name}</td>
          <td>${studentData.gender}</td>
             <td>${studentData.birthday}</td>
 <td><span class="student-status ${status} "></span></td>
         <td><a href="#student-modal" class="btn edit-btn" aria-label="Select student" ><i class="fa-regular fa-pen-to-square"></i></a>
             <a href="#delete-warn-btn" class="delete-btn btn" aria-label="Delete student student"><i class="fa-solid fa-xmark"></i></a>
         </td>
         </tr>`;

     table_body.innerHTML +=new_row;
    }
    else if(row_edit){
        let cells = row_edit.getElementsByTagName("td");
        cells[1].textContent=studentData.group;
        cells[2].textContent=full_name;
        cells[3].textContent=gender;
        cells[4].textContent=studentData.birthday;
        cells[5].innerHTML=`<span class="student-status ${status}"></span>`
    }
    window.location.hash="#students";

});

});

