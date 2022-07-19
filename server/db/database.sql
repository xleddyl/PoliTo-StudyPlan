BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS Courses (
   code TEXT NOT NULL,
   name TEXT NOT NULL,
   credits INTEGER NOT NULL,
   maxStudents INTEGER,
   preparatoryCourse TEXT,
   enrolledStudents INTEGER,
   PRIMARY KEY(code),
   FOREIGN KEY(preparatoryCourse) REFERENCES Courses(code) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Courses_Incompatible (
   ID INTEGER,
   course TEXT NOT NULL,
   incompatibleWith TEXTNOT NULL,
   PRIMARY KEY(ID),
   FOREIGN KEY(course) REFERENCES Courses(code) ON DELETE CASCADE,
   FOREIGN KEY(incompatibleWith) REFERENCES Courses(code) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Students (
   email TEXT NOT NULL,
   name TEXT NOT NULL,
   surname TEXT NOT NULL,
   partTime BIT(1) NOT NULL,
   hasStudyPlan BIT(1) NOT NULL,
   password TEXT NOT NULL,
   salt TEXT NOT NULL,
   PRIMARY KEY(email)
);

CREATE TABLE IF NOT EXISTS Students_Courses (
   ID INTEGER,
   student TEXT NOT NULL,
   course TEXT NOT NULL,
   PRIMARY KEY(ID),
   FOREIGN KEY(student) REFERENCES Students(email) ON DELETE CASCADE,
   FOREIGN KEY(course) REFERENCES Courses(code) ON DELETE CASCADE
);

INSERT INTO Courses (code, name, credits, maxStudents, preparatoryCourse, enrolledStudents) VALUES ("02GOLOV", "Architetture dei sistemi di elaborazione", 12, NULL, NULL, 1);
INSERT INTO Courses (code, name, credits, maxStudents, preparatoryCourse, enrolledStudents) VALUES ("02LSEOV", "Computer architectures", 12, NULL, NULL, 1);
INSERT INTO Courses (code, name, credits, maxStudents, preparatoryCourse, enrolledStudents) VALUES ("01SQJOV", "Data Science and Database Technology", 8, NULL, NULL, 1);
INSERT INTO Courses (code, name, credits, maxStudents, preparatoryCourse, enrolledStudents) VALUES ("01SQMOV", "Data Science e Tecnologie per le Basi di Dati", 8, NULL, NULL, 0);
INSERT INTO Courses (code, name, credits, maxStudents, preparatoryCourse, enrolledStudents) VALUES ("01SQLOV", "Database systems", 8, NULL, NULL, 1);
INSERT INTO Courses (code, name, credits, maxStudents, preparatoryCourse, enrolledStudents) VALUES ("01OTWOV", "Computer network technologies and services", 6, 3, NULL, 2);
INSERT INTO Courses (code, name, credits, maxStudents, preparatoryCourse, enrolledStudents) VALUES ("02KPNOV", "Tecnologie e servizi di rete", 6, 3, NULL, 0);
INSERT INTO Courses (code, name, credits, maxStudents, preparatoryCourse, enrolledStudents) VALUES ("01TYMOV", "Information systems security services", 12, NULL, NULL, 1);
INSERT INTO Courses (code, name, credits, maxStudents, preparatoryCourse, enrolledStudents) VALUES ("01UDUOV", "Sicurezza dei sistemi informativi", 12, NULL, NULL, 2);
INSERT INTO Courses (code, name, credits, maxStudents, preparatoryCourse, enrolledStudents) VALUES ("05BIDOV", "Ingegneria del software", 6, NULL, "02GOLOV", 1);
INSERT INTO Courses (code, name, credits, maxStudents, preparatoryCourse, enrolledStudents) VALUES ("04GSPOV", "Software engineering", 6, NULL, "02LSEOV", 0);
INSERT INTO Courses (code, name, credits, maxStudents, preparatoryCourse, enrolledStudents) VALUES ("01UDFOV", "Applicazioni Web I", 6, NULL, NULL, 0);
INSERT INTO Courses (code, name, credits, maxStudents, preparatoryCourse, enrolledStudents) VALUES ("01TXYOV", "Web Applications I", 6, 3, NULL, 3);
INSERT INTO Courses (code, name, credits, maxStudents, preparatoryCourse, enrolledStudents) VALUES ("01TXSOV", "Web Applications II", 6, NULL, "01TXYOV", 1);
INSERT INTO Courses (code, name, credits, maxStudents, preparatoryCourse, enrolledStudents) VALUES ("02GRSOV", "Programmazione di sistema", 6, NULL, NULL, 2);
INSERT INTO Courses (code, name, credits, maxStudents, preparatoryCourse, enrolledStudents) VALUES ("01NYHOV", "System and device programming", 6, 3, NULL, 2);
INSERT INTO Courses (code, name, credits, maxStudents, preparatoryCourse, enrolledStudents) VALUES ("01SQOOV", "Reti Locali e Data Center", 6, NULL, NULL, 3);
INSERT INTO Courses (code, name, credits, maxStudents, preparatoryCourse, enrolledStudents) VALUES ("01TYDOV", "Software networking", 7, NULL, NULL, 3);
INSERT INTO Courses (code, name, credits, maxStudents, preparatoryCourse, enrolledStudents) VALUES ("03UEWOV", "Challenge", 5, NULL, NULL, 2);
INSERT INTO Courses (code, name, credits, maxStudents, preparatoryCourse, enrolledStudents) VALUES ("01URROV", "Computational intelligence", 6, NULL, NULL, 1);
INSERT INTO Courses (code, name, credits, maxStudents, preparatoryCourse, enrolledStudents) VALUES ("01OUZPD", "Model based software design", 4, NULL, NULL, 2);
INSERT INTO Courses (code, name, credits, maxStudents, preparatoryCourse, enrolledStudents) VALUES ("01URSPD", "Internet Video Streaming", 6, 2, NULL, 2);

INSERT INTO Courses_Incompatible (course, incompatibleWith) VALUES ("02GOLOV", "02LSEOV");
INSERT INTO Courses_Incompatible (course, incompatibleWith) VALUES ("02LSEOV", "02GOLOV");
INSERT INTO Courses_Incompatible (course, incompatibleWith) VALUES ("01SQJOV", "01SQMOV");
INSERT INTO Courses_Incompatible (course, incompatibleWith) VALUES ("01SQJOV", "01SQLOV");
INSERT INTO Courses_Incompatible (course, incompatibleWith) VALUES ("01SQMOV", "01SQJOV");
INSERT INTO Courses_Incompatible (course, incompatibleWith) VALUES ("01SQMOV", "01SQLOV");
INSERT INTO Courses_Incompatible (course, incompatibleWith) VALUES ("01SQLOV", "01SQJOV");
INSERT INTO Courses_Incompatible (course, incompatibleWith) VALUES ("01SQLOV", "01SQMOV");
INSERT INTO Courses_Incompatible (course, incompatibleWith) VALUES ("01OTWOV", "02KPNOV");
INSERT INTO Courses_Incompatible (course, incompatibleWith) VALUES ("02KPNOV", "01OTWOV");
INSERT INTO Courses_Incompatible (course, incompatibleWith) VALUES ("01TYMOV", "01UDUOV");
INSERT INTO Courses_Incompatible (course, incompatibleWith) VALUES ("01UDUOV", "01TYMOV");
INSERT INTO Courses_Incompatible (course, incompatibleWith) VALUES ("05BIDOV", "04GSPOV");
INSERT INTO Courses_Incompatible (course, incompatibleWith) VALUES ("04GSPOV", "05BIDOV");
INSERT INTO Courses_Incompatible (course, incompatibleWith) VALUES ("01UDFOV", "01TXYOV");
INSERT INTO Courses_Incompatible (course, incompatibleWith) VALUES ("01TXYOV", "01UDFOV");
INSERT INTO Courses_Incompatible (course, incompatibleWith) VALUES ("02GRSOV", "01NYHOV");
INSERT INTO Courses_Incompatible (course, incompatibleWith) VALUES ("01NYHOV", "02GRSOV");

INSERT INTO Students (email, name, surname, partTime, hasStudyPlan, password, salt) VALUES ("mario.rossi@studenti.it", "Mario", "Rossi", 0, 1, "df01fbc3bc416038b14ffa04fc0fcb4051ea749802293ba3e9eb4b472a7e2944", "5870327335763879");
INSERT INTO Students (email, name, surname, partTime, hasStudyPlan, password, salt) VALUES ("federica.bianchi@studenti.it","Federica", "Bianchi", 0, 0, "92C6FFB5BC7CE4EF670DD2AB22158572569421C94558C4D1B0B823727FE75F96", "66556A586E327235");
INSERT INTO Students (email, name, surname, partTime, hasStudyPlan, password, salt) VALUES ("luigi.verdi@studenti.it","Luigi", "Verdi", 1, 1, "9ff9dce395a6188eb2c0d13c7052c654b5e9699e41b357e096279618d84b6cae", "4D635166546A576E");
INSERT INTO Students (email, name, surname, partTime, hasStudyPlan, password, salt) VALUES ("ferdinand.black@studenti.it","Ferdinand", "Black", 1, 1, "512d7c4bfc765ee33da3e655b36d0e20ada6a332bfd925af5b7da1aa0a830530", "28482B4D62516554");
INSERT INTO Students (email, name, surname, partTime, hasStudyPlan, password, salt) VALUES ("carlotta.gialli@studenti.it","Carlotta", "Gialli", 0, 1, "67543DCE8DD73C5E2DB3EE8B1C41B36B14263F81B9BA5E08D4CCE7765A50D68A", "413F4428472B4B62");

INSERT INTO Students_Courses (student, course) VALUES ("luigi.verdi@studenti.it", "01UDUOV");
INSERT INTO Students_Courses (student, course) VALUES ("luigi.verdi@studenti.it", "01SQOOV");
INSERT INTO Students_Courses (student, course) VALUES ("luigi.verdi@studenti.it", "02GRSOV");
INSERT INTO Students_Courses (student, course) VALUES ("luigi.verdi@studenti.it", "01OUZPD");
INSERT INTO Students_Courses (student, course) VALUES ("luigi.verdi@studenti.it", "01URSPD");
INSERT INTO Students_Courses (student, course) VALUES ("mario.rossi@studenti.it", "01TXYOV");
INSERT INTO Students_Courses (student, course) VALUES ("mario.rossi@studenti.it", "02GRSOV");
INSERT INTO Students_Courses (student, course) VALUES ("mario.rossi@studenti.it", "01TYMOV");
INSERT INTO Students_Courses (student, course) VALUES ("mario.rossi@studenti.it", "01SQJOV");
INSERT INTO Students_Courses (student, course) VALUES ("mario.rossi@studenti.it", "01OTWOV");
INSERT INTO Students_Courses (student, course) VALUES ("mario.rossi@studenti.it", "02LSEOV");
INSERT INTO Students_Courses (student, course) VALUES ("mario.rossi@studenti.it", "01URROV");
INSERT INTO Students_Courses (student, course) VALUES ("mario.rossi@studenti.it", "01URSPD");
INSERT INTO Students_Courses (student, course) VALUES ("mario.rossi@studenti.it", "01TXSOV");
INSERT INTO Students_Courses (student, course) VALUES ("mario.rossi@studenti.it", "01TYDOV");
INSERT INTO Students_Courses (student, course) VALUES ("mario.rossi@studenti.it", "03UEWOV");
INSERT INTO Students_Courses (student, course) VALUES ("ferdinand.black@studenti.it", "01SQOOV");
INSERT INTO Students_Courses (student, course) VALUES ("ferdinand.black@studenti.it", "01TYDOV");
INSERT INTO Students_Courses (student, course) VALUES ("ferdinand.black@studenti.it", "01NYHOV");
INSERT INTO Students_Courses (student, course) VALUES ("ferdinand.black@studenti.it", "01TXYOV");
INSERT INTO Students_Courses (student, course) VALUES ("carlotta.gialli@studenti.it", "02GOLOV");
INSERT INTO Students_Courses (student, course) VALUES ("carlotta.gialli@studenti.it", "01OTWOV");
INSERT INTO Students_Courses (student, course) VALUES ("carlotta.gialli@studenti.it", "01SQLOV");
INSERT INTO Students_Courses (student, course) VALUES ("carlotta.gialli@studenti.it", "05BIDOV");
INSERT INTO Students_Courses (student, course) VALUES ("carlotta.gialli@studenti.it", "01OUZPD");
INSERT INTO Students_Courses (student, course) VALUES ("carlotta.gialli@studenti.it", "01SQOOV");
INSERT INTO Students_Courses (student, course) VALUES ("carlotta.gialli@studenti.it", "01UDUOV");
INSERT INTO Students_Courses (student, course) VALUES ("carlotta.gialli@studenti.it", "01TYDOV");
INSERT INTO Students_Courses (student, course) VALUES ("carlotta.gialli@studenti.it", "01NYHOV");
INSERT INTO Students_Courses (student, course) VALUES ("carlotta.gialli@studenti.it", "01TXYOV");

COMMIT;
