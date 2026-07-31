const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("./database");
require("dotenv").config();

const app = express();

const SECRET = process.env.JWT_SECRET || "hospital-secret-key";


app.use(cors());
app.use(express.json());
app.use(express.static("public"));



/* ===========================
   API STATUS
=========================== */

app.get("/api",(req,res)=>{

    res.json({
        success:true,
        message:"Hospital AI Agent Backend is Running 🚀",
        version:"1.0.0"
    });

});



/* ===========================
   HEALTH CHECK
=========================== */

app.get("/health",(req,res)=>{

    res.json({
        success:true,
        status:"Server Online",
        database:"SQLite Connected"
    });

});



/* ===========================
 CHECK DOCTOR AVAILABILITY
=========================== */

app.get("/check-doctor-availability",(req,res)=>{

    const {date}=req.query;

    res.json({

        success:true,
        doctor:"Dr. Ahmed",
        date,

        availableSlots:[
            "10:00 AM",
            "11:00 AM",
            "2:00 PM",
            "4:00 PM"
        ]

    });

});



/* ===========================
 SCHEDULE APPOINTMENT (VAPI)
=========================== */

app.post("/schedule-appointment",(req,res)=>{


    console.log("VAPI DATA RECEIVED:",req.body);


    const {
        name,
        phone,
        doctor,
        date,
        time
    } = req.body;



    if(!name || !phone || !doctor || !date || !time){

        return res.status(400).json({

            success:false,
            message:"All fields are required"

        });

    }



    db.run(

        `
        INSERT INTO appointments
        (name,phone,doctor,date,time)
        VALUES (?,?,?,?,?)
        `,

        [
            name,
            phone,
            doctor,
            date,
            time
        ],


        function(err){


            if(err){

                return res.status(500).json({

                    success:false,
                    error:err.message

                });

            }



            res.json({

                success:true,
                message:"Appointment Scheduled Successfully",
                appointmentId:this.lastID

            });


        }


    );


});



/* ===========================
 GET APPOINTMENTS
=========================== */


app.get("/appointments",(req,res)=>{


    db.all(

        "SELECT * FROM appointments ORDER BY id DESC",

        (err,rows)=>{


            if(err){

                return res.status(500).json({

                    success:false,
                    error:err.message

                });

            }



            res.json({

                success:true,
                total:rows.length,
                appointments:rows

            });


        }


    );


});



/* ===========================
 GET DOCTORS
=========================== */


app.get("/doctors",(req,res)=>{


    db.all(

        "SELECT * FROM doctors ORDER BY id ASC",

        (err,rows)=>{


            if(err){

                return res.status(500).json({

                    success:false,
                    error:err.message

                });

            }



            res.json({

                success:true,
                total:rows.length,
                doctors:rows

            });


        }


    );


});



/* ===========================
 VAPI DOCTORS TOOL (DYNAMIC)
=========================== */


app.get("/vapi-doctors",(req,res)=>{


    db.all(

        "SELECT name, specialization, available FROM doctors",

        (err,rows)=>{


            if(err){

                return res.json({

                    success:false,
                    error:err.message

                });

            }



            res.json(rows);


        }


    );


});
/* ===========================
 ADD DOCTOR
=========================== */


app.post("/add-doctor",(req,res)=>{


    const {
        name,
        specialization,
        available
    } = req.body;



    if(!name || !specialization){

        return res.json({

            success:false,
            message:"All fields are required"

        });

    }



    db.run(

        `
        INSERT INTO doctors
        (name,specialization,available)
        VALUES (?,?,?)
        `,

        [
            name,
            specialization,
            available || "Yes"
        ],


        function(err){


            if(err){

                return res.json({

                    success:false,
                    error:err.message

                });

            }



            res.json({

                success:true,
                message:"Doctor Added Successfully"

            });


        }


    );


});




/* ===========================
 UPDATE DOCTOR
=========================== */


app.post("/update-doctor",(req,res)=>{


    const {
        id,
        name,
        specialization,
        available
    } = req.body;



    db.run(

        `
        UPDATE doctors
        SET
        name=?,
        specialization=?,
        available=?
        WHERE id=?
        `,

        [
            name,
            specialization,
            available,
            id
        ],


        function(err){


            if(err){

                return res.json({

                    success:false,
                    error:err.message

                });

            }



            res.json({

                success:true,
                message:"Doctor Updated Successfully"

            });


        }


    );


});




/* ===========================
 DELETE DOCTOR
=========================== */


app.post("/delete-doctor",(req,res)=>{


    const {id}=req.body;



    db.run(

        "DELETE FROM doctors WHERE id=?",

        [id],


        function(err){


            if(err){

                return res.json({

                    success:false,
                    error:err.message

                });

            }



            res.json({

                success:true,
                message:"Doctor Deleted Successfully"

            });


        }


    );


});




/* ===========================
 ADMIN LOGIN
=========================== */


app.post("/admin-login",(req,res)=>{


    const {
        username,
        password
    } = req.body;



    if(!username || !password){

        return res.json({

            success:false,
            message:"Username and Password Required"

        });

    }



    db.get(

        "SELECT * FROM admins WHERE username=?",

        [username],


        async(err,admin)=>{


            if(err){

                return res.json({

                    success:false,
                    error:err.message

                });

            }



            if(!admin){

                return res.json({

                    success:false,
                    message:"Invalid Username"

                });

            }



            const match = await bcrypt.compare(
                password,
                admin.password
            );



            if(!match){

                return res.json({

                    success:false,
                    message:"Invalid Password"

                });

            }



            const token = jwt.sign(

                {
                    id:admin.id,
                    username:admin.username
                },

                SECRET,

                {
                    expiresIn:"24h"
                }

            );



            res.json({

                success:true,
                message:"Login Successful",
                token,

                admin:{
                    id:admin.id,
                    username:admin.username
                }

            });


        }


    );


});
/* ===========================
 DASHBOARD STATS
=========================== */


app.get("/dashboard-stats",(req,res)=>{


    db.get(

        "SELECT COUNT(*) AS totalAppointments FROM appointments",

        (err,appointments)=>{


            if(err){

                return res.json({

                    success:false,
                    error:err.message

                });

            }



            db.get(

                "SELECT COUNT(*) AS totalDoctors FROM doctors",

                (err,doctors)=>{


                    if(err){

                        return res.json({

                            success:false,
                            error:err.message

                        });

                    }



                    res.json({

                        success:true,

                        totalAppointments:
                        appointments.totalAppointments,

                        totalDoctors:
                        doctors.totalDoctors,

                        aiStatus:"Online"

                    });


                }

            );


        }

    );


});




/* ===========================
 UPDATE APPOINTMENT
=========================== */


app.post("/update-appointment",(req,res)=>{


    const {
        id,
        name,
        phone,
        doctor,
        date,
        time
    } = req.body;



    if(!id || !name || !phone || !doctor || !date || !time){

        return res.status(400).json({

            success:false,
            message:"All fields are required"

        });

    }



    db.run(

        `
        UPDATE appointments
        SET
        name=?,
        phone=?,
        doctor=?,
        date=?,
        time=?
        WHERE id=?
        `,

        [
            name,
            phone,
            doctor,
            date,
            time,
            id
        ],


        function(err){


            if(err){

                return res.status(500).json({

                    success:false,
                    error:err.message

                });

            }



            res.json({

                success:true,
                message:"Appointment Updated Successfully"

            });


        }


    );


});




/* ===========================
 CANCEL APPOINTMENT
=========================== */


app.post("/cancel-appointment",(req,res)=>{


    const {phone}=req.body;



    if(!phone){

        return res.status(400).json({

            success:false,
            message:"Phone number is required"

        });

    }



    db.run(

        "DELETE FROM appointments WHERE phone=?",

        [phone],


        function(err){


            if(err){

                return res.status(500).json({

                    success:false,
                    error:err.message

                });

            }



            if(this.changes===0){

                return res.json({

                    success:false,
                    message:"Appointment not found"

                });

            }



            res.json({

                success:true,
                message:"Appointment Cancelled Successfully",
                deleted:this.changes

            });


        }


    );


});




/* ===========================
 GET SETTINGS
=========================== */


app.get("/settings",(req,res)=>{


    db.get(

        "SELECT * FROM settings WHERE id=1",

        (err,row)=>{


            if(err){

                return res.json({

                    success:false,
                    error:err.message

                });

            }



            res.json({

                success:true,
                settings:row

            });


        }


    );


});




/* ===========================
 UPDATE SETTINGS
=========================== */


app.post("/update-settings",(req,res)=>{


    const {
        hospital_name,
        email,
        phone
    } = req.body;



    db.run(

        `
        UPDATE settings
        SET
        hospital_name=?,
        email=?,
        phone=?
        WHERE id=1
        `,

        [
            hospital_name,
            email,
            phone
        ],


        function(err){


            if(err){

                return res.json({

                    success:false,
                    error:err.message

                });

            }



            res.json({

                success:true,
                message:"Settings Updated Successfully"

            });


        }


    );


});




/* ===========================
 SERVER START
=========================== */


const PORT = process.env.PORT || 3000;


app.listen(PORT,()=>{

    console.log(`🚀 Server running on port ${PORT}`);

});