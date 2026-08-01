async function loadSettings(){

    const response = await fetch("/settings");

    const data = await response.json();


    if(data.success){

        document.getElementById("hospitalName").value =
        data.settings.hospital_name;


        document.getElementById("hospitalEmail").value =
        data.settings.email;


        document.getElementById("hospitalPhone").value =
        data.settings.phone;

    }

}



async function saveSettings(){

    let name = document.getElementById("hospitalName").value;
    let email = document.getElementById("hospitalEmail").value;
    let phone = document.getElementById("hospitalPhone").value;


    const response = await fetch("/update-settings",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            hospital_name:name,
            email:email,
            phone:phone

        })

    });


    const data = await response.json();


    if(data.success){

        alert("Settings Saved Successfully ✅");

        loadSettings();

    }else{

        alert("Save Failed ❌");

    }

}


window.onload = loadSettings;