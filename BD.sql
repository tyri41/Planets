
-- Grzegorz Kwiatkowski projkt z Baz Danych etap 2 

--whenever sqlerror continue;

DROP TABLE IF EXISTS DB_User;
DROP TABLE IF EXISTS List;
DROP TABLE IF EXISTS List_Position;
DROP TABLE IF EXISTS Object;
DROP TABLE IF EXISTS Description;
DROP TABLE IF EXISTS Organization;
DROP TABLE IF EXISTS Hierarchy;

--whenever sqlerror exit 1;

CREATE TABLE Organization (
	Id INTEGER NOT NULL,
	Name TEXT NOT NULL,
	Abreviation TEXT,
	PRIMARY KEY (Id)
);

INSERT INTO Organization(Name) VALUES("ABC");
INSERT INTO Organization(Name) VALUES("DP");
INSERT INTO Organization(Name) VALUES("BD");

CREATE TABLE Description (
	Id INTEGER NOT NULL,
	Year float,
	Mass float,
	Temperature float,
	Discovery_Method varchar(30),
	Discovering_Body int,
	PRIMARY KEY (Id),
	FOREIGN KEY (Discovering_Body) REFERENCES Organization(Id)
);

CREATE TABLE Object (
	Id INTEGER NOT NULL,
	Type varchar(14) check(Type IN('Exoplanet', 'Star', 'Constellation')),
	Name varchar(20),
	RAscention float,
	Declination float,
	Distance float,
	Details int,
	PRIMARY KEY (Id),
	FOREIGN KEY (Details) REFERENCES Description(Id)
);

CREATE TABLE DB_User (
	Id INTEGER NOT NULL,
	Name varchar(20) NOT NULL,
--	Favourite_List int,
	Organization int,
	PRIMARY KEY (Id),
	FOREIGN KEY (Organization) REFERENCES Organization(Id)
);

CREATE TABLE List (
	Id INTEGER NOT NULL,
	Name varchar(30) NOT NULL,
	Creator int NOT NULL,
	PRIMARY KEY (Id),
	FOREIGN KEY (Creator) REFERENCES DB_User(Id)
);

ALTER TABLE DB_User ADD COLUMN Favourite_List INTEGER REFERENCES List(Id);

CREATE TABLE List_Position (
	Object_Id int NOT NULL,
	List_Id int NOT NULL,
	Place int NOT NULL,
	PRIMARY KEY (Object_Id, List_Id),
	FOREIGN KEY (Object_Id) REFERENCES Object(Id),
	FOREIGN KEY (List_Id) REFERENCES List(Id)
);

CREATE TABLE Hierarchy (
	Object_Id int NOT NULL,
	Object_Host_Id int NOT NULL,
	PRIMARY KEY (Object_Id, Object_Host_Id),
	FOREIGN KEY (Object_Id) REFERENCES Object(Id),
	FOREIGN KEY (Object_Host_Id) REFERENCES Object(Id)
);

INSERT INTO DB_User(Name) VALUES ('Janusz');
INSERT INTO DB_User(Name) VALUES ('Marcel');
INSERT INTO DB_User(Name) VALUES ('Stefan');

INSERT INTO List(Name, Creator) Values ('Favs', 1);
INSERT INTO List(Name, Creator) Values ('Planets', 2);

INSERT INTO Object(Type, Name) VALUES ('Star', 'Sun');
INSERT INTO Object(Type, Name, distance) VALUES ('Star', 'Bellatrix', 243);
INSERT INTO Object(Type, Name, distance) VALUES ('Star', 'Betelgeuse', 643);
INSERT INTO Object(Type, Name) VALUES ('Constellation', 'Orion');
INSERT INTO Object(Type, Name) VALUES ('Constellation', 'Andromeda');
INSERT INTO Object(Type, Name) VALUES ('Constellation', 'Cancer');
INSERT INTO Object(Type, Name, distance) VALUES ('Star', 'Veritate', 247);
INSERT INTO Object(Type, Name, distance) VALUES ('Exoplanet', 'Spe', 247);

INSERT INTO Hierarchy(Object_Id, Object_Host_Id) VALUES (2, 4);
INSERT INTO Hierarchy(Object_Id, Object_Host_Id) VALUES (3, 4);
INSERT INTO Hierarchy(Object_Id, Object_Host_Id) VALUES (7, 5);
INSERT INTO Hierarchy(Object_Id, Object_Host_Id) VALUES (8, 7);
