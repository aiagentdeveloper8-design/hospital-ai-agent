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