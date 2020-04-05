DROP VIEW IF EXISTS object_exo_info;
DROP VIEW IF EXISTS list_full;
DROP VIEW IF EXISTS org_info;
DROP VIEW IF EXISTS object_child_list;
DROP VieW IF EXISTS list_elems;

CREATE VIEW object_exo_info AS
WITH hosts AS (
    SELECT Object_Id AS Id, Name AS Host FROM Hierarchy JOIN Object ON Object_Host_Id = Id
)
SELECT
    O.Id,
    O.Name,
    Type,
    Host,
    RAscention,
    Declination,
    Distance,
	Mass,
	Temperature,
	Year,
	Discovery_Method,
	Det.Name AS Organization
FROM (Object O LEFT JOIN (
    SELECT * FROM Description D LEFT JOIN Organization Org ON D.Discovering_Body = Org.Id
    ) Det ON O.Details = Det.Id)
    LEFT JOIN Hosts ON O.Id = Hosts.Id;

CREATE VIEW list_full AS
SELECT
    L.Id,
    L.Name,
    U.Name AS Author
FROM List L LEFT JOIN DB_User U ON L.Creator = U.Id;

CREATE VIEW org_info AS
SELECT Id, Name, Abreviation FROM Organization;

CREATE VIEW object_child_list AS
SELECT O.Name, H.Object_Host_Id AS Host FROM Object O JOIN Hierarchy H ON O.Id = H.Object_Id;

CREATE VIEW list_elems AS
SELECT Id, Place, Name, List_Id FROM Object JOIN List_Position ON Id = Object_Id;