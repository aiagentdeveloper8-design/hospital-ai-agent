if (localStorage.getItem("adminLoggedIn") !== "true") {
    window.location.href = "/login.html";
}


const API = "https://hospital-ai-agent-3tfx.onrender.com";

// ===========================
// LOAD DASHBOARD
// ===========================

async function loadDashboard(){

    try{

        const res = await fetch(`${API}/dashboard-stats`);
        const data = await res.json();

        document.getElementById("totalAppointments").innerText =
        data.totalAppointments || 0;

        document.getElementById("totalDoctors").innerText =
        data.totalDoctors || 0;


    }catch(err){

        console.log("Dashboard Error:",err);

    }

}



// ===========================
// LOAD APPOINTMENTS
// ===========================

async function loadAppointments(){

try{

const res = await fetch(`${API}/appointments`);

const data = await res.json();


const table = document.getElementById("appointmentsTable");

if(!table) return;


table.innerHTML="";


data.appointments.forEach(app=>{


table.innerHTML += `

<tr>

<td>${app.id}</td>

<td>${app.name}</td>

<td>${app.phone}</td>

<td>${app.doctor}</td>

<td>${app.date}</td>

<td>${app.time}</td>


<td>


<button 
class="btn btn-warning btn-sm me-2"
onclick="editAppointment(${app.id})">

<i class="fa-solid fa-pen"></i>
Edit

</button>



<button
class="btn btn-danger btn-sm"
onclick="deleteAppointment('${app.phone}')">

<i class="fa-solid fa-trash"></i>
Cancel

</button>


</td>


</tr>

`;


});


}catch(err){

console.log("Appointment Error:",err);

}


}





// ===========================
// EDIT APPOINTMENT
// ===========================


let editModal = null;


function editAppointment(id){


const row = [...document.querySelectorAll("#appointmentsTable tr")]
.find(r => r.children[0].innerText == id);



if(!row){

alert("Appointment not found");

return;

}



document.getElementById("editId").value=id;

document.getElementById("editName").value=row.children[1].innerText;

document.getElementById("editPhone").value=row.children[2].innerText;

document.getElementById("editDoctor").value=row.children[3].innerText;

document.getElementById("editDate").value=row.children[4].innerText;

document.getElementById("editTime").value=row.children[5].innerText;



const modalElement =
document.getElementById("editModal");



if(!modalElement){

alert("Edit Modal Missing");

return;

}



if(!editModal){

editModal = new bootstrap.Modal(modalElement);

}


editModal.show();


}





// ===========================
// SAVE APPOINTMENT
// ===========================


async function saveAppointment(){


try{


const res = await fetch(`${API}/update-appointment`,{


method:"POST",

headers:{
"Content-Type":"application/json"
},


body:JSON.stringify({

id:document.getElementById("editId").value,

name:document.getElementById("editName").value,

phone:document.getElementById("editPhone").value,

doctor:document.getElementById("editDoctor").value,

date:document.getElementById("editDate").value,

time:document.getElementById("editTime").value


})


});


const data = await res.json();



if(data.success){


editModal.hide();


loadAppointments();

loadDashboard();


alert("Appointment Updated Successfully");


}



}catch(err){

console.log("Update Error:",err);

}


}
// ===========================
// CANCEL APPOINTMENT
// ===========================

async function deleteAppointment(phone){


if(!confirm("Cancel Appointment?"))
return;


try{


await fetch(`${API}/cancel-appointment`,{

method:"POST",

headers:{
"Content-Type":"application/json"
},


body:JSON.stringify({
phone
})


});


loadAppointments();

loadDashboard();


}catch(err){

console.log("Delete Error:",err);

}


}





// ===========================
// SEARCH
// ===========================


const searchBox = document.getElementById("search");


if(searchBox){


searchBox.addEventListener("keyup",function(){


let value=this.value.toLowerCase();


document.querySelectorAll("#appointmentsTable tr")
.forEach(row=>{


row.style.display =
row.innerText.toLowerCase()
.includes(value)
?
""
:
"none";


});


});


}







// ===========================
// LOAD DOCTORS
// ===========================


async function loadDoctors(){


try{


const res = await fetch(`${API}/doctors`);

const data = await res.json();


const table =
document.getElementById("doctorTable");


if(!table) return;



table.innerHTML="";



data.doctors.forEach(doc=>{


table.innerHTML += `


<tr>


<td>${doc.id}</td>

<td>${doc.name}</td>

<td>${doc.specialization}</td>

<td>${doc.available}</td>



<td>


<button
class="btn btn-danger btn-sm"
onclick="deleteDoctor(${doc.id})">


<i class="fa-solid fa-trash"></i>

Delete


</button>


</td>


</tr>


`;


});



}catch(err){


console.log("Doctor Load Error:",err);


}


}





// ===========================
// ADD DOCTOR
// ===========================


async function addDoctor(){


try{


const name =
document.getElementById("doctorName").value;


const specialization =
document.getElementById("doctorSpecialization").value;


const available =
document.getElementById("doctorAvailable").value;



const res = await fetch(`${API}/add-doctor`,{


method:"POST",


headers:{
"Content-Type":"application/json"
},


body:JSON.stringify({

name,
specialization,
available

})


});


const data = await res.json();



if(data.success){


alert("Doctor Added Successfully");


document.getElementById("doctorName").value="";

document.getElementById("doctorSpecialization").value="";


loadDoctors();

loadDashboard();


}



}catch(err){

console.log("Add Doctor Error:",err);

}


}





// ===========================
// DELETE DOCTOR
// ===========================


async function deleteDoctor(id){


if(!confirm("Delete Doctor?"))
return;



try{


const res = await fetch(`${API}/delete-doctor`,{


method:"POST",


headers:{
"Content-Type":"application/json"
},


body:JSON.stringify({

id

})


});


const data = await res.json();



if(data.success){


alert("Doctor Deleted");


loadDoctors();

loadDashboard();


}



}catch(err){

console.log("Doctor Delete Error:",err);

}


}







// ===========================
// LOGOUT
// ===========================


function logout(){


localStorage.removeItem("adminLoggedIn");

localStorage.removeItem("token");


window.location.href="/login.html";


}






// ===========================
// START
// ===========================


loadDashboard();

loadAppointments();

loadDoctors();