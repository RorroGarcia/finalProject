const express = require("express");
const app = express();
app.use(express.json());
// const mysql = require("mysql");
const mysql = require("mysql2/promise");
const md5 = require("nodejs-md5");
const cors = require("cors");
const fs = require("fs");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (require, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (request, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});
app.use("/uploads", express.static("uploads"));

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 10 },
});
const { json } = require("express");
app.use(cors());

//Crear conexión a la base de datos

let db=""

async function conectar() {
  return await mysql.createConnection({
    connectionLimit : 5000,
    host: "192.168.64.2",
    user: "releevant",
    password: "releevant2022",
    database: "Proyecto",
  });
}
const PORT = 3001;
app.listen(PORT, async  () => {
  db=await conectar()
  
  console.log(`Server running on port ${PORT}`);
});



/* function  *//*desconectar()*/ /* { */
  // Cerrar conexion
/*   connection.end(function (err) {
    if (err) {
      return console.error("error: " + err.message);
    }
    console.log("Desconectado!");
  });
} */

app.get("/name/:name", async function (request, response) {
  // conectar();
  connection = await conectar();
  const [rows] = await connection.execute(
    "SELECT * FROM `users` WHERE `name` like  ?",
    [request.params.name + "%"]
  );
  response.json(rows);
});
app.get("/user/:idUser", async function (request, response) {
  // conectar();
  /* connection = await conectar(); */
  const [rows] = await db.execute(
    "SELECT * FROM `users`  where `idUser`= ?",
    [request.params.idUser]
  );
  response.json(rows[0]);
  /*desconectar()*/
});
app.get("/users", async function (request, response) {
  // conectar();
  /* connection = await conectar(); */
  
  const [rows] = await db.execute("SELECT * FROM `users` ");
  response.json(rows);
  
  
});

app.delete("/deleteUser/:id", async function (request, response) {
  /* connection = await conectar(); */
  const [rows] = await db.execute(
    "Delete from `users` where `idUser`= ?",
    [request.params.id]
  );
  response.json("Usuario eliminado");
});

app.put("/putUser", async function (request, response) {
  console.log(request.body);
  connection = await conectar();
  await connection.execute(
    "Update  `users` set `name`=?,`surname`=?,`address`=? ,`phone`=?, `email`=?, `birthDate`=?, `injuries`=?, `pathology`=?, `notes`=? where `idUser`=?",
    [
      request.body.name,
      request.body.surname,
      request.body.address,
      request.body.phone,
      request.body.email,
      request.body.birthDate,
      request.body.injuries,
      request.body.pathology,
      request.body.notes,
      request.body.idUser,
    ]
  );
  response.json("Usuario editado");
});

app.post("/postUser", async function (request, response) {
  connection = await conectar();
  await connection.execute(
    "INSERT INTO `users` (name, surname, phone, email, birthDate, injuries, pathology, notes) VALUES(?,?,?,?,?,?,?,?)",
    [
      request.body.name,
      request.body.surname,
      request.body.phone,
      request.body.email,
      request.body.birthDate,
      request.body.injuries,
      request.body.pathology,
      request.body.notes,
    ]
  );
  response.json("Usuario creado");
});
app.get("/getExerciceCategory/:category", async function (request, response) {
  connection = await conectar();
  const [rows] = await connection.execute(
    "SELECT categories.idCategory, categories.nameCategory, exercices.nameExercice FROM `categories`, `exercices` where categories.idCategory=exercices.idCategory HAVING idCategory=?",
    [request.params.category]
  );
  response.json(rows);
});
app.post("/postExercice", async function (request, response) {
  connection = await conectar();
  await connection.execute(
    "INSERT INTO exercices (nameExercice, idCategory) VALUES (?,?);",
    [request.body.nameExercice, request.body.idCategory]
  );
  response.json("Ejercicio añadido");
});
app.delete("/deleteExercice/:idExercice", async function (request, response) {
  connection = await conectar();
  await connection.execute("Delete from exercices where idExercice=?;", [
    request.params.idExercice,
  ]);
  response.json("Ejercicio borrado");
});

app.put("/putExercice", async function (request, response) {
  connection = await conectar();
  await connection.execute(
    "Update  `exercices` set `nameExercice` = ?, `idCategory` = ? where `idExercice` = ?;",
    [
      request.body.nameExercice,
      request.body.idCategory,
      request.body.idExercice,
    ]
  );
  response.json("Ejercicio actualizado");
});

app.get("/getMeasurement/:id", async function (request, response) {
  connection = await conectar();
  const [rows] = await connection.execute(
    "Select * from measurements where idUser=?",
    [request.params.id]
  );
  response.json(rows);
});

app.post("/postMesurement", async function (request, response) {
  connection = await conectar();
  await connection.execute(
    "INSERT INTO `measurements` (BIM, weight, musculeMass, water, date, idUser, bodyFat, photo) VALUES(?,?,?,?,?,?,?,?) ",
    [
      request.body.BIM,
      request.body.weight,
      request.body.musculeMass,
      request.body.water,
      request.body.date,
      request.body.idUser,
      request.body.bodyFat,
      request.body.photo,
    ]
  );
  response.json("Medición creada");
});

app.delete(
  "/deleteMeasurement/:idMeasurement",
  async function (request, response) {
    connection = await conectar();
    await connection.execute(
      "Delete from `measurements` where idMeasurement=?;",
      [request.params.idMeasurement]
    );
    response.json("Medición borrada");
  }
);

app.put("/putMeasurement", async function (request, response) {
  connection = await conectar();
  await connection.execute(
    "Update  measurements set BIM=?, weight=?, musculeMass=?, water=?, date=?, idUser=?, bodyFat=?, photo=? where idMeasurement=?;",
    [
      request.body.BIM,
      request.body.weight,
      request.body.musculeMass,
      request.body.water,
      request.body.date,
      request.body.idUser,
      request.body.bodyFat,
      request.body.photo,
      request.body.idMeasurement,
    ]
  );
  response.json("Medida actualizado");
});
app.post("/postNewAdmi", async function (request, response) {
  connection = await conectar();
  const [email] = await connection.execute(
    "Select email from admi where email=?;",
    [request.body.email]
  );
  if (email[0] != null) {
    console.log("El email existe");
    response.json(email[0].email);
  } else {
    console.log("El email no existe");
    md5.string.quiet(request.body.password, async function (err, md5) {
      if (err) {
        console.log(err);
      } else {
        await connection.execute("INSERT admi (email, password) VALUES (?,?)", [
          request.body.email,
          md5,
        ]);
        response.json("Ha sido registrado");
      }
    });
  }
});

app.post("/postLoginAdmi", async function (request, response) {
  connection = await conectar();
  const [user] = await connection.execute(
    "Select email, password from admi where email=?;",
    [request.body.email]
  );

  md5.string.quiet(request.body.password, async function (err, md5) {
    if (err) {
      console.log(err);
    } else {
      if (user[0] != null) {
        if (user[0].email === request.body.email && user[0].password === md5) {
          response.status(200);
          response.json("Welcome");
        } else {
          response.status(400);
          response.json("Error");
        }
      } else {
        response.status(400);
        response.json("Error");
      }
    }
  });
});

app.get("/getInterview/:idUser", async function (request, response) {
  /* connection = await conectar(); */
  const [rows] = await db.execute(
    "SELECT * FROM `initialInterview` where idUser=?;",
    [request.params.idUser]
  );
  response.json(rows[0]);
  /*desconectar()*/
});

app.post("/postInterview", async function (request, response) {
  console.log(request.body);
  console.log(request.body.age);
 /*  connection = await conectar(); */
  const [rows] = await db.execute(
    "INSERT INTO `initialInterview` ( idUser, name, date, age, occupation, reason, sports, goals, antecedent, muscularPain, scars, scoliosis, illnesses, births, pelvicFloor, dream, stress, atm, mood, digestions, notes) VALUES ( ?, ?, ?, ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);",

    [
      request.body.idUser,
      request.body.name,
      request.body.date,
      request.body.age,
      request.body.occupation,
      request.body.reason,
      request.body.sports,
      request.body.goals,
      request.body.antecedent,
      request.body.muscularPain,
      request.body.scars,
      request.body.scoliosis,
      request.body.illnesses,
      request.body.births,
      request.body.pelvicFloor,
      request.body.dream,
      request.body.stress,
      request.body.atm,
      request.body.mood,
      request.body.digestions,
      request.body.notes,
    ]
  );

  response.json(rows);
});

app.delete("/deleteInterview/:idInterview", async function (request, response) {
  connection = await conectar();
  await connection.execute(
    "Delete from `initialInterview` where idInitialInterview=?;",
    [request.params.idInterview]
  );
  response.json(" Borrado ");
});
app.put("/putInterview", async function (request, response) {
  /* connection = await conectar(); */
  await db.execute(
    "Update  initialInterview set  name=?, date=?, age=?, occupation=?, reason=?, sports=?, goals=?, antecedent=?, muscularPain=?, scars=?, scoliosis=?, illnesses=?, births=?, pelvicFloor=? ,dream=?, stress=?, atm=?,mood=?, digestions=?, notes=? where idUser=?;",
    [
      request.body.name,
      request.body.date,
      request.body.age,
      request.body.occupation,
      request.body.reason,
      request.body.sports,
      request.body.goals,
      request.body.antecedent,
      request.body.muscularPain,
      request.body.scars,
      request.body.scoliosis,
      request.body.illnesses,
      request.body.births,
      request.body.pelvicFloor,
      request.body.dream,
      request.body.stress,
      request.body.atm,
      request.body.mood,
      request.body.digestions,
      request.body.notes,
      request.body.idUser,
    ]
  );
  response.json("Entrevista actualizada");
});

app.post("/postGlobalsTest", async function (request, response) {
  connection = await conectar();
  await connection.execute(
    "INSERT INTO `globalsTest` (idUser, dateTest, toeTouch,squat, trunkRotation) VALUES(?,?,?,?,?) ",
    [
      request.body.idUser,
      request.body.dateTest,
      request.body.toeTouch,
      request.body.squat,
      request.body.trunkRotation,
    ]
  );
  response.json("Global test  creado");
});

app.put("/putGlobalsTest", async function (request, response) {
  connection = await conectar();
  await connection.execute(
    "Update `globalsTest` set  dateTest=?, toeTouch=?,squat=?, trunkRotation=? where id=?;",
    [
      request.body.dateTest,
      request.body.toeTouch,
      request.body.squat,
      request.body.trunkRotation,
      request.body.id,
    ]
  );
  response.json("Test global actualizado");
});

app.delete("/deleteGlobalsTest/:id", async function (request, response) {
  connection = await conectar();
  await connection.execute("Delete from `globalsTest` where id=?;", [
    request.params.id,
  ]);
  response.json("Test global borrado");
});

app.get("/getGlobalsTest/:idUser", async function (request, response) {
  connection = await conectar();
  const [rows] = await connection.execute(
    "SELECT * FROM `globalsTest` where idUser=?;",
    [request.params.idUser]
  );
  response.json(rows);
});

app.get("/getGlobalTest/:idUser", async function (request, response) {
  connection = await conectar();
  const [rows] = await connection.execute(
    "Select * from `globalsTest` where idUser=?",
    [request.params.idUser]
  );
  response.json(rows);
  /*desconectar()*/
});

app.get("/getGlobalidTest/:id", async function (request, response) {
  connection = await conectar();
  const [rows] = await connection.execute(
    "Select * from `globalsTest` where id=?",
    [request.params.id]
  );
  response.json(rows[0]);
});

app.post("/postHipTest", async function (request, response) {
  connection = await conectar();
  await connection.execute(
    "INSERT INTO `hipTest` (idUser, dateTest, supineKneeToChest, SLR , ober , RE, RI, Thomas) VALUES(?,?,?,?,?,?,?,?) ",
    [
      request.body.idUser,
      request.body.dateTest,
      request.body.supineKneeToChest,
      request.body.SLR,
      request.body.ober,
      request.body.RE,
      request.body.RI,
      request.body.thomas,
    ]
  );
  response.json("Hip test  creado");
});

app.put("/putHipTest", async function (request, response) {
  connection = await conectar();
  await connection.execute(
    "Update `hipTest` set  idUser=?, dateTest=?, supineKneeToChest=?, SLR=? , ober=? , RE=?, RI=?, Thomas=? where idHipTest=?;",
    [
      request.body.idUser,
      request.body.dateTest,
      request.body.supineKneeToChest,
      request.body.SLR,
      request.body.ober,
      request.body.RE,
      request.body.RI,
      request.body.thomas,
      request.body.idHiptest,
    ]
  );
  response.json("Test cadera actualizado");
});

app.delete("/deleteHipTest/:id", async function (request, response) {
  connection = await conectar();
  await connection.execute("Delete from `hipTest` where id=?;", [
    request.params.id,
  ]);
  response.json("Test cadera borrado");
});

app.get("/getHipsTestid/:id", async function (request, response) {
  connection = await conectar();
  const [rows] = await connection.execute(
    "SELECT * FROM `hipTest` where id=?;",
    [request.params.id]
  );
  response.json(rows[0]);
});

app.get("/getHipTest/:idUser", async function (request, response) {
  connection = await conectar();
  const [rows] = await connection.execute(
    "SELECT * FROM `hipTest` where idUser=?;",
    [request.params.idUser]
  );
  response.json(rows);
});

app.post("/postShoulderTest", async function (request, response) {
  connection = await conectar();
  await connection.execute(
    "INSERT INTO `shoulderTest` (idUser, dateTest, shoulderFlexion, HGRI ,HGRE, abduction, adduction, apleyScratch) VALUES(?,?,?,?,?,?,?,?) ",
    [
      request.body.idUser,
      request.body.dateTest,
      request.body.shoulderFlexion,
      request.body.HGRI,
      request.body.HGRE,
      request.body.abduction,
      request.body.adduction,
      request.body.apleyScratch,
    ]
  );
  response.json("Test de hombros creado");
});

app.put("/putShoulderTest", async function (request, response) {
  connection = await conectar();
  await connection.execute(
    "Update `shoulderTest` set idUser=?, dateTest=?, shoulderFlexion=?, HGRI=? ,HGRE=?, abduction=?, adduction=?	, apleyScratch=? where id=?;",
    [
      request.body.idUser,
      request.body.dateTest,
      request.body.shoulderFlexion,
      request.body.HGRI,
      request.body.HGRE,
      request.body.abduction,
      request.body.adduction,
      request.body.apleyScratch,
      request.body.id,
    ]
  );
  response.json("Test hombro actualizado");
});

app.delete(
  "/deleteShoulderTest/:idShoulderTest",
  async function (request, response) {
    connection = await conectar();
    await connection.execute("Delete from `shoulderTest` where id=?;", [
      request.params.id,
    ]);
    response.json("Test hombros borrado");
  }
);

app.get("/getShoulderTest/:idUser", async function (request, response) {
  connection = await conectar();
  const [rows] = await connection.execute(
    "SELECT * FROM `shoulderTest` where idUser=?;",
    [request.params.idUser]
  );
  response.json(rows);
});

app.get("/getShoulderidTest/:id", async function (request, response) {
  connection = await conectar();
  const [rows] = await connection.execute(
    "SELECT * FROM `shoulderTest` where id=?;",
    [request.params.id]
  );
  response.json(rows[0]);
});

app.post(
  "/postPhoto",
  upload.array("image"),
  async function (request, response) {
    connection = await conectar();
    console.log(request.files);
    const image = `http://localhost:3001/uploads/${request.files[0].filename}`;

    await connection.execute("INSERT INTO `photos` (photo) VALUES(?) ", [
      image,
    ]);
    response.json("Foto añadida");
  }
);

app.get("/getPhotos", async function (request, response) {
  connection = await conectar();
  const [rows] = await connection.execute("SELECT * FROM `photos` ;");

  response.json(rows[0].photo);
});

function base64_encode(file) {
  // read binary data
  var bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return new Buffer(bitmap).toString("base64");
}

app.get("/getShoulderidTest/:id", async function (request, response) {
  connection = await conectar();
  const [rows] = await connection.execute(
    "SELECT * FROM `shoulderTest` where id=?;",
    [request.params.id]
  );
  response.json(rows[0]);
});

app.get("/getInhibition", async function (request, response) {
  /* connection = await conectar(); */
  const [rows] = await db.execute("SELECT * FROM `inhibition` ;");

  response.json(rows);
  /*desconectar()*/
});
app.post("/postInhibition", async function (request, response) {
  connection = await conectar();
  await connection.execute("INSERT INTO inhibition (name) VALUES (?);", [
    request.body.name,
  ]);
  response.json("Ejercicio añadido");
});

app.delete("/deleteInhibition", async function (request, response) {
  connection = await conectar();
  await connection.execute("Delete from `inhibition` where id=?;", [
    request.body.id,
  ]);
  response.json("Ejercicio eliminado");
});

app.get("/getMovement", async function (request, response) {
  /* connection = await conectar() */;
  const [rows] = await db.execute("SELECT * FROM `movement` ;");

  response.json(rows);
  /*desconectar()*/
});
app.delete("/deleteMovement", async function (request, response) {
  connection = await conectar();
  await connection.execute("Delete from `movement` where id=?;", [
    request.body.id,
  ]);
  response.json("Ejercicio eliminado");
});
app.post("/postMovement", async function (request, response) {
  connection = await conectar();
  await connection.execute("INSERT INTO movement (name) VALUES (?);", [
    request.body.name,
  ]);
  response.json("Ejercicio añadido");
});

app.get("/getStrength", async function (request, response) {
  /* connection = await conectar(); */
  const [rows] = await db.execute("SELECT * FROM `strength` ;");

  response.json(rows);
  
});
app.delete("/deleteStrength", async function (request, response) {
  connection = await conectar();
  await connection.execute("Delete from `strength` where id=?;", [
    request.body.id,
  ]);
  response.json("Ejercicio eliminado");
});
app.post("/postStrength", async function (request, response) {
  connection = await conectar();
  await connection.execute("INSERT INTO strength (name) VALUES (?);", [
    request.body.name,
  ]);
  response.json("Ejercicio añadido");
});

app.get("/getCoolDown", async function (request, response) {
 /*  connection = await conectar(); */
  const [rows] = await db.execute("SELECT * FROM `coolDown` ;");

  response.json(rows);
  
});

app.delete("/deleteCoolDown", async function (request, response) {
  connection = await conectar();
  await connection.execute("Delete from `coolDown` where id=?;", [
    request.body.id,
  ]);
  response.json("Ejercicio eliminado");
});
app.post("/postCoolDown", async function (request, response) {
  connection = await conectar();
  await connection.execute("INSERT INTO coolDown (name) VALUES (?);", [
    request.body.name,
  ]);
  response.json("Ejercicio añadido");
});
app.get("/getSessionInhibition", async function (request, response) {
  /* connection = await conectar(); */
  const [rows] = await db.execute(
    "SELECT * FROM `sessionInhibition` where idUser=? and date=? ;",
    [request.body.idUser, request.body.date]
  );

  response.json(rows[0]);
 
});

app.get("/getSessionMovement", async function (request, response) {
  c/* onnection = await conectar(); */
  const [rows] = await db.execute(
    "SELECT * FROM `sessionMovement` where idUser=? and date=? ;",
    [request.body.idUser, request.body.date]
  );

  response.json(rows[0]);
  
});
app.get("/getSessionCoolDown", async function (request, response) {
  connection = await conectar();
  const [rows] = await connection.execute(
    "SELECT * FROM `sessionCoolDown` where idUser=? and date=? ;",
    [request.body.idUser, request.body.date]
  );

  response.json(rows[0]);
  
});
app.get("/getSessionStrength", async function (request, response) {
  connection = await conectar();
  const [rows] = await connection.execute(
    "SELECT * FROM `sessionStrength` where idUser=? and date=? ;",
    [request.body.idUser, request.body.date]
  );

  response.json(rows[0]);
  
});

app.post("/postSession", async function (request, response) {
  connection = await conectar();
  await connection.execute(
    "INSERT INTO `sessionInhibition` (idUser, date, nameExerciceI,repetitionI ,notesI, nameExercice1I, repetition1I, notes1I) VALUES(?,?,?,?,?,?,?,?) ",
    [
      request.body.idUser,
      request.body.date,
      request.body.nameExerciceI,
      request.body.repetitionI,
      request.body.notesI,
      request.body.nameExercice1I,
      request.body.repetition1I,
      request.body.notes1I,
    ]
  );
  await connection.execute(
    "INSERT INTO `sessionMovement` (idUser, date, nameExerciceM,repetitionM ,notesM, nameExercice1M, repetition1M, notes1M) VALUES(?,?,?,?,?,?,?,?) ",
    [
      request.body.idUser,
      request.body.date,
      request.body.nameExerciceM,
      request.body.repetitionM,
      request.body.notesM,
      request.body.nameExercice1M,
      request.body.repetition1M,
      request.body.notes1M,
    ]
  );
  await connection.execute(
    "INSERT INTO `sessionStrength` (idUser, date, nameExerciceS, SeriesS, repetitionS, loadS, restS ,notesS,nameExercice1S, Series1S, repetition1S, load1S, rest1S ,notes1S, nameExercice2S, Series2S, repetition2S, load2S, rest2S ,notes2S, nameExercice3S, Series3S, repetition3S, load3S, rest3S ,notes3S) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ",
    [
      request.body.idUser,
      request.body.date,
      request.body.nameExerciceS,
      request.body.SeriesS,
      request.body.repetitionS,
      request.body.loadS,
      request.body.restS,
      request.body.notesS,
      request.body.nameExercice1S,
      request.body.Series1S,
      request.body.repetition1S,
      request.body.load1S,
      request.body.rest1S,
      request.body.notes1S,
      request.body.nameExercice2S,
      request.body.Series2S,
      request.body.repetition2S,
      request.body.load2S,
      request.body.rest2S,
      request.body.notes2S,
      request.body.nameExercice3S,
      request.body.Series3S,
      request.body.repetition3S,
      request.body.load3S,
      request.body.rest3S,
      request.body.notes3S,
    ]
  );
  connection = await conectar();
  await connection.execute(
    "INSERT INTO `sessionCoolDown` (idUser, date, nameExerciceC, notesC, nameExercice1C, notes1C) VALUES(?,?,?,?,?,?) ",
    [
      request.body.idUser,
      request.body.date,
      request.body.nameExerciceC,
      request.body.notesC,
      request.body.nameExercice1C,
      request.body.notes1C,
    ]
  );
  response.json("Sesión Cat 1 creada");
});

app.post("/postInhibitionExercises", async function (request, response) {
  connection = await conectar();
  await connection.execute(
    "INSERT INTO inhibitionExercises (idUser, date, inhibitionExerciseName, inhibitionExerciseRepetitions, inhibitionExerciseNotes ) VALUES (?,?,?,?,?);",
    [
      request.body.idUser,
      request.body.date,
      request.body.inhibitionExerciseName,
      request.body.inhibitionExerciseRepetitions,
      request.body.inhibitionExerciseNotes,
    ]
  );
  response.json("Ejercicio añadido");
});

app.post("/postMovementExercises", async function (request, response) {
  connection = await conectar();
  await connection.execute(
    "INSERT INTO movementExercises (idUser, date, movementExerciseName, movementExerciseRepetitions, movementExerciseNotes ) VALUES (?,?,?,?,?);",
    [
      request.body.idUser,
      request.body.date,
      request.body.movementExerciseName,
      request.body.movementExerciseRepetitions,
      request.body.movementExerciseNotes,
    ]
  );
  response.json("Ejercicio añadido");
});
app.post("/postStrengthExercises", async function (request, response) {
  connection = await conectar();
  await connection.execute(
    "INSERT INTO strengthExercices (idUser, date, strengthExerciseName, series, strengthExerciseRepetitions,loadStrength , rest , strengthExerciseNotes) VALUES (?,?,?,?,?,?,?,?);",
    [
      request.body.idUser,
      request.body.date,
      request.body.strengthExerciseName,
      request.body.series,
      request.body.strengthExerciseRepetitions,
      request.body.loadStrength,
      request.body.rest,
      request.body.strengthExerciseNotes,
    ]
  );
  response.json("Ejercicio fuerza añadido");
});

app.post("/postCoolDownExercises", async function (request, response) {
  connection = await conectar();
  await connection.execute(
    "INSERT INTO coolDownExercices (idUser, date,coolDownExerciseName, coolDownExerciseNotes) VALUES (?,?,?,?);",
    [
      request.body.idUser,
      request.body.date,
      request.body.coolDownExerciseName,
      request.body.coolDownExerciseNotes,
    ]
  );
  response.json("Ejercicio añadido");
});

app.delete(
  "/deleteInhibition/:inhibitionExerciseName/:date",
  async function (request, response) {
    connection = await conectar();
    const [rows] = await connection.execute(
      "Delete from `inhibitionExercises` where (`inhibitionExerciseName`= ? and date=?)",
      [request.params.inhibitionExerciseName, request.params.date]
    );
    response.json("Ejercicio eliminado");
  }
);
app.get("/getDateSession/:idUser", async function (request, response) {
  /* connection = await conectar(); */
  const [rows] = await db.execute(
    "SELECT date, idUser FROM `inhibitionExercises` where idUser=? GROUP BY date ;",
    [request.params.idUser]
  );

  response.json(rows);
  /*desconectar()*/
});
app.get(
  "/getDateSessionInhibition/:idUser/:date",
  async function (request, response) {
    /* connection = await conectar(); */
    const [rows] = await db.execute(
      "SELECT * FROM `inhibitionExercises` where (idUser=? and date=?) ;",
      [request.params.idUser, request.params.date]
    );

    response.json(rows);
    /*desconectar()*/
  }
);

app.get(
  "/getDateSessionMovement/:idUser/:date",
  async function (request, response) {
    /* connection = await conectar(); */
    const [rows] = await db.execute(
      "SELECT * FROM `movementExercises` where (idUser=? and date=?) ;",
      [request.params.idUser, request.params.date]
    );

    response.json(rows);
    
  }
);

app.get(
  "/getDateSessionStrength/:idUser/:date",
  async function (request, response) {
    /* connection = await conectar(); */
    const [rows] = await db.execute(
      "SELECT * FROM `strengthExercices` where (idUser=? and date=?) ;",
      [request.params.idUser, request.params.date]
    );

    response.json(rows);
    
  }
);

app.get(
  "/getDateSessionCoolDown/:idUser/:date",
  async function (request, response) {
    /* connection = await conectar(); */
    const [rows] = await db.execute(
      "SELECT * FROM `coolDownExercices` where (idUser=? and date=?) ;",
      [request.params.idUser, request.params.date]
    );

    response.json(rows);
    
    
  }
);

