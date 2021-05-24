create database meddata;
use meddata;
CREATE TABLE panel (
  LOINC varchar(255) NOT NULL,
  Long_Common_Name text,
  Short_Name text,
  CLASS text,
  PRIMARY KEY (LOINC)
);
CREATE TABLE part (
  LOINC varchar(255) NOT NULL,
  Long_Common_Name text,
  Short_Name text,
  CLASS text,
  Example_UCUM text,
  Comment text,
  MALE_OK_MIN double DEFAULT NULL,
  MALE_OK_MAX double DEFAULT NULL,
  MALE_MIN double DEFAULT NULL,
  MALE_MAX double DEFAULT NULL,
  FEMALE_OK_MIN double DEFAULT NULL,
  FEMALE_OK_MAX double DEFAULT NULL,
  FEMALE_MIN double DEFAULT NULL,
  FEMALE_MAX double DEFAULT NULL,
  PRIMARY KEY (LOINC)
);
CREATE TABLE pathologymarkers (
  PATOLOGY_ID varchar(255) DEFAULT NULL,
  MARKER_ID varchar(255) DEFAULT NULL,
  NOTE text
);
create table paneltopart (
	LOINC varchar(255) not null,
    PART varchar(255) not null,
    R_O_C text,
    primary key (LOINC, PART),
    foreign key (LOINC) references panel(LOINC)
    on update cascade
    on delete cascade,
    foreign key (PART) references part(LOINC)
    on update cascade
    on delete cascade

);
create table patient (
		PatientId int not null AUTO_INCREMENT,
        Name varchar(255) not null,
        Surname varchar(255) not null,
        Gender varchar(255) not null,
        BloodType varchar(255),
        Weight int,
        Height int,
        Age int not null,
        primary key(PatientId)
);
create table visitData (
	Patient int not null,
    Date date not null,
    Panel varchar(255),
    Part varchar(255) not null,
    Value double not null,
    Comment varchar(255),
    primary key(Patient, Date, Part),
    foreign key (Patient) references Patient(PatientId)
    on update cascade
    on delete cascade,
    foreign key (Part) references part(LOINC)
    on update cascade
    on delete cascade
);

