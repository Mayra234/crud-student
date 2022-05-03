let students = [];
const studentApi = useStudentApi();
const studentForm = document.getElementById('student-form');
const fields = document.querySelectorAll('#student-form .form-field');
const studentTbody = document.getElementById('student-table');
const contentButtons = document.getElementById('content-buttons');
const addButton = document.getElementById('add-student');
const loader = document.getElementById('loader');

addButton.addEventListener('click', studentFormAction);

let studentFormMode = 'create';
let studentId = undefined;

let currentStudent = {
  name: '',
  lastName: '',
  age: '',
  grade: '',
  livingRoom: '',
  birthDate: '',
};

function handlerLoader(status) {
  switch (status) {
    case 'show':
      loader.style.display = 'flex';
      break;
    case 'hide':
      loader.style.display = 'none';
      break;
    default:
      break;
  }
}

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
        studentFormMode = 'create';
        studentForm.reset();
        changeActionStudentButton();
      });
      contentButtons.appendChild(cancelButton);
      break;
    default:
      break;
  }
}

async function createStudent() {
  handlerLoader('show');
  const student = await studentApi.create(currentStudent);
  students.push({ ...student });
  listStudents();
  studentForm.reset();
  handlerLoader('hide');
}

async function updateStudent() {
  handlerLoader('show');
  const student = await studentApi.update(studentId, currentStudent);
  students = students.map((item) => {
    if (item.id === studentId) {
      return { ...student };
    } else {
      return item;
    }
  });

  listStudents();
  studentForm.reset();
  studentFormMode = 'create';
  changeActionStudentButton();
  cancelStudentActionButton();
  handlerLoader('hide');
}

async function deleteStudent(id) {
  handlerLoader('show');
  await studentApi.remove(id);
  const students = students.filter((student) => {
    return student.id !== id;
  });
  listStudents();
  handlerLoader('hide');
}

function loadStudentInForm(id) {
  studentFormMode = 'update';
  studentId = id;
  currentStudent = students.find((student) => student.id === id);

  fields.forEach((field) => {
    field.value = currentStudent[field.name];
  });
  changeActionStudentButton();
  cancelStudentActionButton();
}

const modalHtmlElement = document.getElementById('view-student');
const boostrapModal = new bootstrap.Modal(modalHtmlElement);

async function showStudent(id) {
  handlerLoader('show');
  const student = await studentApi.read(id);
  const modalTitle = document.querySelector('#view-student .modal-title');
  const modalBody = document.querySelector('#view-student .modal-body');
  boostrapModal.show();
  modalBody.innerHTML = `
      <ul>
        <li><b>Nombre:</b> ${student.name}</li>
        <li><b>Apellido:</b> ${student.lastName}</li>
        <li><b>Edad:</b> ${student.age}</li>
        <li><b>Grado:</b> ${student.grade}</li>
        <li><b>Curso:</b> ${student.livingRoom}</li>
        <li><b>Fecha de nacimiento:</b> ${student.birthDate}</li>
    </ul>
      `;
  modalTitle.innerText = student.name;
  handlerLoader('hide');
}

async function listStudents(firstLoad) {
  handlerLoader('show');
  studentTbody.innerHTML = '';
  if (firstLoad) students = await studentApi.list();

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
                    onclick="loadStudentInForm(${student.id})">
                    Editar
                    </button>
                <button
                    type="button"
                    class="btn btn-info text-white"
                    onclick="showStudent(${student.id})">
                    Ver registro
                    </button>
                <button
                    type="button"
                    class="btn btn-danger"
                    onclick="deleteStudent(${student.id})">
                    Eliminar
                    </button>
            </td>
        `;
    studentTbody.appendChild(row);
  });
  handlerLoader('hide');
}
listStudents(true);
