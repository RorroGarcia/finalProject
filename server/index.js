const express = require("express");
const app = express();
app.use(express.json());
// const mysql = require("mysql");
const mysql = require("mysql2/promise");
const md5 = require("nodejs-md5");
const cors = require("cors");
app.use(cors());

//Crear conexión a la base de datos

async function conectar() {
  return await mysql.createConnection({
    host: "192.168.64.2",
    user: "releevant",
    password: "releevant2022",
    database: "Proyecto",
  });
}

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

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
  connection = await conectar();
  const [rows] = await connection.execute(
    "SELECT * FROM `users`  where `idUser`= ?",
    [request.params.idUser]
  );
  response.json(rows);
});
app.get("/users", async function (request, response) {
  // conectar();
  connection = await conectar();
  const [rows] = await connection.execute(
    "SELECT * FROM `users` ",
    
  );
  response.json(rows);
});

app.delete("/deleteUser/:id", async function (request, response) {
  connection = await conectar();
  const [rows] = await connection.execute(
    "Delete from `users` where `idUser`= ?",
    [request.params.id]
  );
  response.json("Usuario eliminado");
});

app.put("/putUser", async function (request, response) {
  connection = await conectar();
  await connection.execute("Update  `users` set `name`=? where `idUser`=?", [
    request.body.name,
    request.body.idUser,
  ]);
  response.json("Usuario editado");
});

app.post("/postUser", async function (request, response) {
  connection = await conectar();
  await connection.execute(
    "INSERT INTO `users` (name, surname, phone, email, birthDate) VALUES(?,?,?,?,?)",
    [
      request.body.name,
      request.body.surname,
      request.body.phone,
      request.body.email,
      request.body.birthDate,
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
          response.json("Inicio de sesión iniciado");
        } else {
          response.json("Contraseña incorrecta");
        }
      } else {
        response.json("Correo no registrado");
      }
    }
  });
});

app.get("/getInterview/:idUser", async function (request, response) {
  connection = await conectar();
  const [rows] = await connection.execute(
    "SELECT * FROM `initialInterview` where idUser=?;",
    [request.params.idUser]
  );
  response.json(rows);
});

app.post("/postInterview", async function (request, response) {
  console.log(request.body)
  console.log(request.body.age)
  connection = await conectar();
  const [rows] = await connection.execute(
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
  connection = await conectar();
  await connection.execute(
    "Update  initialInterview set idUser=? ,name=?, date=?, age=?, occupation=?, reason=?, sports=?, goals=?, antecedent=?, muscularPain=?, scars=?, scoliosis=?, illnesses=?, births=?, pelvicFloor=? ,dream=?, stress=?, atm=?,mood=?, digestions=?, notes=? where idInitialInterview=?;",
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
      request.body.idInitialInterview
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
      request.body.trunkRotation

    ]     
  );
  response.json("Global test  creado");
});

app.put("/putGlobalsTest", async function (request, response) {
  connection = await conectar();
  await connection.execute(
    "Update `globalsTest` set  dateTest=?, toeTouch=?,squat=?, trunkRotation=? where idGlobalTest=?;",
    [
      request.body.dateTest,
      request.body.toeTouch,
      request.body.squat,
      request.body.trunkRotation,
      request.body.idGlobalTest
    ]
  );
  response.json("Test global actualizado");
});

app.delete("/deleteGlobalsTest/:idGlobalTest", async function (request, response) {
  connection = await conectar();
  await connection.execute(
    "Delete from `globalsTest` where idGlobalTest=?;",
    [request.params.idGlobalTest]
  );
  response.json("Test global borrado");
});

app.get("/getGlobalsTest", async function (request, response) {
  connection = await conectar();
  const [rows] = await connection.execute(
    "SELECT * FROM `globalsTest`;",
   
  );
  response.json(rows);
});

app.get("/getGlobalTest/:idGlobalTest", async function (request, response) {
  connection = await conectar();
  const [rows] = await connection.execute(
    "Select * from `globalsTest` where idGlobalTest=?",
    [request.params.idGlobalTest]
  );
  response.json(rows);
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
      request.body.thomas

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
      request.body.idHiptest
    ]
  );
  response.json("Test cadera actualizado");
});

app.delete("/deleteHipTest/:idHipTest", async function (request, response) {
  connection = await conectar();
  await connection.execute(
    "Delete from `hipTest` where idHipTest=?;",
    [request.params.idHipTest]
  );
  response.json("Test cadera borrado");
});

app.get("/getHipsTest", async function (request, response) {
  connection = await conectar();
  const [rows] = await connection.execute(
    "SELECT * FROM `hipTest`;",
   
  );
  response.json(rows);
});

app.get("/getHipTest/:idHipTest", async function (request, response) {
  connection = await conectar();
  const [rows] = await connection.execute(
    "SELECT * FROM `hipTest` where idHipTest=?;",
    [request.params.idHipTest]
   
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
      request.body.apleyScratch

    ]     
  );
  response.json("Test de hombros creado");
});

app.put("/putShoulderTest", async function (request, response) {
  connection = await conectar();
  await connection.execute(
    "Update `shoulderTest` set idUser=?, dateTest=?, shoulderFlexion=?, HGRI=? ,HGRE=?, abduction=?, adduction=?	, apleyScratch=? where idShoulderTest=?;",
    [
      request.body.idUser,
      request.body.dateTest,
      request.body.shoulderFlexion,
      request.body.HGRI,
      request.body.HGRE,
      request.body.abduction,
      request.body.adduction,
      request.body.apleyScratch,
      request.body.idShoulderTest

    ]
  );
  response.json("Test hombro actualizado");
});

app.delete("/deleteShoulderTest/:idShoulderTest", async function (request, response) {
  connection = await conectar();
  await connection.execute(
    "Delete from `shoulderTest` where idShoulderTest=?;",
    [request.params.idShoulderTest]
  );
  response.json("Test hombros borrado");
});

app.get("/getShoulderTest", async function (request, response) {
  connection = await conectar();
  const [rows] = await connection.execute(
    "SELECT * FROM `shoulderTest`;",
   
  );
  response.json(rows);
});

app.get("/getShoulderTestid/:idShoulderTest", async function (request, response) {
  connection = await conectar();
  const [rows] = await connection.execute(
    "SELECT * FROM `shoulderTest` where idShoulderTest=?;",
    [request.params.idShoulderTest]
   
  );
  response.json(rows);
});