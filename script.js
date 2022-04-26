const studentForm = document.getElementById('student-form');
const fields = document.querySelectorAll('#student-form .form-field');
const studentTbody = document.getElementById('student-table');
const contentButtons = document.getElementById('content-buttons');
const addButton = document.getElementById('add-student');
addButton.addEventListener('click', studentFormAction);

let studentFormMode = 'create';
let studentIndex = undefined;

let currentStudent = {
  name: '',
  lastName: '',
  age: '',
  grade: '',
  livingRoom: '',
  birthDate: '',
};

function validate(event) {
  const { name, value } = event.target;
  currentStudent[name] = value;
}

fields.forEach((field) => {
  field.addEventListener('input', validate);
});

function studentFormAction() {
  switch (studentFormMode) {
    case 'create':
      createStudent();
      break;
    case 'update':
      updateStudent();
      break;
    default:
      break;
  }
}

function changeActionStudentButton() {
  switch (studentFormMode) {
    case 'create':
      addButton.innerText = 'Agregar';
      addButton.className = 'btn btn-primary';
      break;
    case 'update':
      addButton.innerText = 'Actualizar';
      addButton.className = 'btn btn-info text-white';
      break;
    default:
      break;
  }
}

function cancelStudentActionButton() {
  switch (studentFormMode) {
    case 'create':
      document.getElementById('cancel-button').remove();
      break;
    case 'update':
      if (document.getElementById('cancel-button') !== null) {
        return;
      }
      const cancelButton = document.createElement('button');
      cancelButton.id = 'cancel-button';
      cancelButton.className = 'btn btn-secondary';
      cancelButton.innerText = 'Cancelar';
      cancelButton.addEventListener('click', () => {
        cancelButton.remove();
        studentForMode = 'create';
        studentForm.reset();
        changeActionStudentButton();
      });
      contentButtons.appendChild(cancelButton);
      break;
    default:
      break;
  }
}

function createStudent() {
  students.push(Object.assign({}, currentStudent));
  listStudents();
  studentForm.reset();
}

function updateStudent() {
  students[studentIndex] = Object.assign({}, currentStudent);
  listStudents();
  studentForm.reset();
  studentFormMode = 'create';
  changeActionStudentButton();
  cancelStudentActionButton();
}

function deleteStudent(index) {
  students = students.filter((_, i) => {
    return i !== index;
  });
  listStudents();
}

function loadStudentInForm(index) {
  studentFormMode = 'update';
  studentIndex = index;
  currentStudent = Object.assign({}, students[index]);
  fields.forEach((field) => {
    field.value = currentStudent[field.name];
  });
  changeActionStudentButton();
  cancelStudentActionButton();
}

const modalHtmlElement = document.getElementById('view-student');
const boostrapModal = new bootstrap.Modal(modalHtmlElement);

function showStudent(index) {
  const modalTitle = document.querySelector('#view-student .modal-title');
  const modalBody = document.querySelector('#view-student .modal-body');
  boostrapModal.show();
  modalBody.innerHTML = `
      <ul>
        <li><b>Nombre:</b> ${students[index].name}</li>
        <li><b>Apellido:</b> ${students[index].lastName}</li>
        <li><b>Edad:</b> ${students[index].age}</li>
        <li><b>Grado:</b> ${students[index].grade}</li>
        <li><b>Curso:</b> ${students[index].livingRoom}</li>
        <li><b>Fecha de nacimiento:</b> ${students[index].birthDate}</li>
    </ul>
      `;
  modalTitle.innerText = students[index].name;
}

function listStudents() {
  studentTbody.innerHTML = '';

  students.forEach((student, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <th scope="row">${index + 1}</th>
            <td>${student.name}</td>
            <td>${student.lastName}</td>
            <td>${student.age}</td>
            <td>${student.grade}</td>
            <td>${student.livingRoom}</td>
            <td>${student.birthDate}</td>
            <td>
                <button
                    type="button"
                    class="btn btn-primary"
                    onclick="loadStudentInForm(${index})">
                    Editar
                    </button>
                <button
                    type="button"
                    class="btn btn-info text-white"
                    onclick="showStudent(${index})">
                    Ver registro
                    </button>
                <button
                    type="button"
                    class="btn btn-danger"
                    onclick="deleteStudent(${index})">
                    Eliminar
                    </button>
            </td>
        `;
    studentTbody.appendChild(row);
  });
}
listStudents();
