const API_URL = "/appointments";

async function loadAppointments() {
    try {

        const res = await fetch(API_URL);
        const data = await res.json();

        const table = document.getElementById("appointmentsTable");
        table.innerHTML = "";

        document.getElementById("totalAppointments").innerText = data.total;

        data.appointments.forEach(app => {

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
                        onclick="editAppointment(
                            ${app.id},
                            '${app.name}',
                            '${app.phone}',
                            '${app.doctor}',
                            '${app.date}',
                            '${app.time}'
                        )">
                        ✏️ Edit
                    </button>

                    <button
                        class="btn btn-danger btn-sm"
                        onclick="deleteAppointment('${app.phone}')">
                        🗑 Delete
                    </button>

                </td>

            </tr>
            `;

        });

    } catch (err) {

        console.log(err);

    }
}

function editAppointment(id, name, phone, doctor, date, time) {

    const newName = prompt("Patient Name", name);
    if (!newName) return;

    const newPhone = prompt("Phone", phone);
    if (!newPhone) return;

    const newDoctor = prompt("Doctor", doctor);
    if (!newDoctor) return;

    const newDate = prompt("Date", date);
    if (!newDate) return;

    const newTime = prompt("Time", time);
    if (!newTime) return;

    fetch("/edit-appointment", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id,
            name: newName,
            phone: newPhone,
            doctor: newDoctor,
            date: newDate,
            time: newTime
        })
    })
    .then(res => res.json())
    .then(() => {
        alert("Appointment Updated ✅");
        loadAppointments();
    });

}

function deleteAppointment(phone) {

    if (!confirm("Delete this appointment?")) return;

    fetch("/cancel-appointment", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            phone
        })
    })
    .then(res => res.json())
    .then(() => {
        alert("Appointment Deleted ✅");
        loadAppointments();
    });

}

document.getElementById("search").addEventListener("keyup", function () {

    const value = this.value.toLowerCase();

    const rows = document.querySelectorAll("#appointmentsTable tr");

    rows.forEach(row => {

        row.style.display =
            row.innerText.toLowerCase().includes(value)
                ? ""
                : "none";

    });

});

loadAppointments();