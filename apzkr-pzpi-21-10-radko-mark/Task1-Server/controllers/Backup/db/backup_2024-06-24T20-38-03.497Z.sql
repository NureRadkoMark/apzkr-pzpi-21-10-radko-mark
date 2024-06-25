--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: Appointments; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE public."Appointments" (
    "AppointmentId" integer NOT NULL,
    "DateAndTime" timestamp with time zone NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "EmployeeEmployeeId" integer,
    "PetPetId" integer
);


ALTER TABLE public."Appointments" OWNER TO postgres;

--
-- Name: Appointments_AppointmentId_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Appointments_AppointmentId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Appointments_AppointmentId_seq" OWNER TO postgres;

--
-- Name: Appointments_AppointmentId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Appointments_AppointmentId_seq" OWNED BY public."Appointments"."AppointmentId";


--
-- Name: Checks; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE public."Checks" (
    "CheckId" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "UserUserId" integer
);


ALTER TABLE public."Checks" OWNER TO postgres;

--
-- Name: Checks_CheckId_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Checks_CheckId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Checks_CheckId_seq" OWNER TO postgres;

--
-- Name: Checks_CheckId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Checks_CheckId_seq" OWNED BY public."Checks"."CheckId";


--
-- Name: Companies; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE public."Companies" (
    "CompanyId" integer NOT NULL,
    "Name" character varying(255) NOT NULL,
    "Description" character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "UserUserId" integer
);


ALTER TABLE public."Companies" OWNER TO postgres;

--
-- Name: Companies_CompanyId_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Companies_CompanyId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Companies_CompanyId_seq" OWNER TO postgres;

--
-- Name: Companies_CompanyId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Companies_CompanyId_seq" OWNED BY public."Companies"."CompanyId";


--
-- Name: Departments; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE public."Departments" (
    "DepartmentId" integer NOT NULL,
    "Address" character varying(255) NOT NULL,
    "StartWorkingTime" time without time zone NOT NULL,
    "EndWorkingTime" time without time zone NOT NULL,
    "Name" character varying(255) NOT NULL,
    "Info" character varying(255),
    "PhoneNumber" character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "CompanyCompanyId" integer
);


ALTER TABLE public."Departments" OWNER TO postgres;

--
-- Name: Departments_DepartmentId_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Departments_DepartmentId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Departments_DepartmentId_seq" OWNER TO postgres;

--
-- Name: Departments_DepartmentId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Departments_DepartmentId_seq" OWNED BY public."Departments"."DepartmentId";


--
-- Name: EmployeeWorkHours; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE public."EmployeeWorkHours" (
    "EmployeeWorkHoursId" integer NOT NULL,
    "WorkDate" timestamp with time zone NOT NULL,
    "StartTime" time without time zone NOT NULL,
    "EndTime" time without time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "EmployeeEmployeeId" integer
);


ALTER TABLE public."EmployeeWorkHours" OWNER TO postgres;

--
-- Name: EmployeeWorkHours_EmployeeWorkHoursId_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."EmployeeWorkHours_EmployeeWorkHoursId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."EmployeeWorkHours_EmployeeWorkHoursId_seq" OWNER TO postgres;

--
-- Name: EmployeeWorkHours_EmployeeWorkHoursId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."EmployeeWorkHours_EmployeeWorkHoursId_seq" OWNED BY public."EmployeeWorkHours"."EmployeeWorkHoursId";


--
-- Name: Employees; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE public."Employees" (
    "EmployeeId" integer NOT NULL,
    "Role" character varying(255) NOT NULL,
    "Description" character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "UserUserId" integer,
    "DepartmentDepartmentId" integer
);


ALTER TABLE public."Employees" OWNER TO postgres;

--
-- Name: Employees_EmployeeId_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Employees_EmployeeId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Employees_EmployeeId_seq" OWNER TO postgres;

--
-- Name: Employees_EmployeeId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Employees_EmployeeId_seq" OWNED BY public."Employees"."EmployeeId";


--
-- Name: Pets; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE public."Pets" (
    "PetId" integer NOT NULL,
    "Breed" character varying(255) NOT NULL,
    "AnimalType" character varying(255) NOT NULL,
    "Name" character varying(255),
    "DocCode" character varying(255) NOT NULL,
    "DateBirth" timestamp with time zone NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "UserUserId" integer
);


ALTER TABLE public."Pets" OWNER TO postgres;

--
-- Name: Pets_PetId_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Pets_PetId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Pets_PetId_seq" OWNER TO postgres;

--
-- Name: Pets_PetId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Pets_PetId_seq" OWNED BY public."Pets"."PetId";


--
-- Name: Prescriptions; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE public."Prescriptions" (
    "PrescriptionId" integer NOT NULL,
    "Body" character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "EmployeeEmployeeId" integer,
    "PetPetId" integer
);


ALTER TABLE public."Prescriptions" OWNER TO postgres;

--
-- Name: Prescriptions_PrescriptionId_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Prescriptions_PrescriptionId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Prescriptions_PrescriptionId_seq" OWNER TO postgres;

--
-- Name: Prescriptions_PrescriptionId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Prescriptions_PrescriptionId_seq" OWNED BY public."Prescriptions"."PrescriptionId";


--
-- Name: Roles; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE public."Roles" (
    "RoleId" integer NOT NULL,
    "RoleName" character varying(255) NOT NULL,
    "RoleDescription" character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Roles" OWNER TO postgres;

--
-- Name: Roles_RoleId_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Roles_RoleId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Roles_RoleId_seq" OWNER TO postgres;

--
-- Name: Roles_RoleId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Roles_RoleId_seq" OWNED BY public."Roles"."RoleId";


--
-- Name: ServiceInChecks; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE public."ServiceInChecks" (
    "ServiceInCheckId" integer NOT NULL,
    "Count" integer DEFAULT 1,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "ServiceServiceId" integer,
    "CheckCheckId" integer
);


ALTER TABLE public."ServiceInChecks" OWNER TO postgres;

--
-- Name: ServiceInChecks_ServiceInCheckId_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ServiceInChecks_ServiceInCheckId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."ServiceInChecks_ServiceInCheckId_seq" OWNER TO postgres;

--
-- Name: ServiceInChecks_ServiceInCheckId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ServiceInChecks_ServiceInCheckId_seq" OWNED BY public."ServiceInChecks"."ServiceInCheckId";


--
-- Name: Services; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE public."Services" (
    "ServiceId" integer NOT NULL,
    "Name" character varying(255) NOT NULL,
    "Info" character varying(255) NOT NULL,
    "Price" numeric(10,2) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "DepartmentDepartmentId" integer
);


ALTER TABLE public."Services" OWNER TO postgres;

--
-- Name: Services_ServiceId_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Services_ServiceId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Services_ServiceId_seq" OWNER TO postgres;

--
-- Name: Services_ServiceId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Services_ServiceId_seq" OWNED BY public."Services"."ServiceId";


--
-- Name: Subscriptions; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE public."Subscriptions" (
    "SubscriptionId" integer NOT NULL,
    "ValidUntil" timestamp with time zone NOT NULL,
    "IsValid" boolean NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "UserUserId" integer
);


ALTER TABLE public."Subscriptions" OWNER TO postgres;

--
-- Name: Subscriptions_SubscriptionId_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Subscriptions_SubscriptionId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Subscriptions_SubscriptionId_seq" OWNER TO postgres;

--
-- Name: Subscriptions_SubscriptionId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Subscriptions_SubscriptionId_seq" OWNED BY public."Subscriptions"."SubscriptionId";


--
-- Name: UserRoles; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE public."UserRoles" (
    "UserRoleId" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "RoleRoleId" integer,
    "UserUserId" integer
);


ALTER TABLE public."UserRoles" OWNER TO postgres;

--
-- Name: UserRoles_UserRoleId_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."UserRoles_UserRoleId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."UserRoles_UserRoleId_seq" OWNER TO postgres;

--
-- Name: UserRoles_UserRoleId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."UserRoles_UserRoleId_seq" OWNED BY public."UserRoles"."UserRoleId";


--
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE public."Users" (
    "UserId" integer NOT NULL,
    "FirstName" character varying(255) NOT NULL,
    "SecondName" character varying(255) NOT NULL,
    "PhoneNumber" character varying(255) NOT NULL,
    "BirthDay" timestamp with time zone,
    "PassportCode" character varying(255) NOT NULL,
    "Email" character varying(255) NOT NULL,
    "Password" character varying(255) NOT NULL,
    "IsBanned" boolean DEFAULT false,
    "IOTCode" character varying(7) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Users" OWNER TO postgres;

--
-- Name: Users_UserId_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Users_UserId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Users_UserId_seq" OWNER TO postgres;

--
-- Name: Users_UserId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Users_UserId_seq" OWNED BY public."Users"."UserId";


--
-- Name: AppointmentId; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Appointments" ALTER COLUMN "AppointmentId" SET DEFAULT nextval('public."Appointments_AppointmentId_seq"'::regclass);


--
-- Name: CheckId; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Checks" ALTER COLUMN "CheckId" SET DEFAULT nextval('public."Checks_CheckId_seq"'::regclass);


--
-- Name: CompanyId; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Companies" ALTER COLUMN "CompanyId" SET DEFAULT nextval('public."Companies_CompanyId_seq"'::regclass);


--
-- Name: DepartmentId; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Departments" ALTER COLUMN "DepartmentId" SET DEFAULT nextval('public."Departments_DepartmentId_seq"'::regclass);


--
-- Name: EmployeeWorkHoursId; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EmployeeWorkHours" ALTER COLUMN "EmployeeWorkHoursId" SET DEFAULT nextval('public."EmployeeWorkHours_EmployeeWorkHoursId_seq"'::regclass);


--
-- Name: EmployeeId; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Employees" ALTER COLUMN "EmployeeId" SET DEFAULT nextval('public."Employees_EmployeeId_seq"'::regclass);


--
-- Name: PetId; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Pets" ALTER COLUMN "PetId" SET DEFAULT nextval('public."Pets_PetId_seq"'::regclass);


--
-- Name: PrescriptionId; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Prescriptions" ALTER COLUMN "PrescriptionId" SET DEFAULT nextval('public."Prescriptions_PrescriptionId_seq"'::regclass);


--
-- Name: RoleId; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Roles" ALTER COLUMN "RoleId" SET DEFAULT nextval('public."Roles_RoleId_seq"'::regclass);


--
-- Name: ServiceInCheckId; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceInChecks" ALTER COLUMN "ServiceInCheckId" SET DEFAULT nextval('public."ServiceInChecks_ServiceInCheckId_seq"'::regclass);


--
-- Name: ServiceId; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Services" ALTER COLUMN "ServiceId" SET DEFAULT nextval('public."Services_ServiceId_seq"'::regclass);


--
-- Name: SubscriptionId; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Subscriptions" ALTER COLUMN "SubscriptionId" SET DEFAULT nextval('public."Subscriptions_SubscriptionId_seq"'::regclass);


--
-- Name: UserRoleId; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserRoles" ALTER COLUMN "UserRoleId" SET DEFAULT nextval('public."UserRoles_UserRoleId_seq"'::regclass);


--
-- Name: UserId; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users" ALTER COLUMN "UserId" SET DEFAULT nextval('public."Users_UserId_seq"'::regclass);


--
-- Data for Name: Appointments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Appointments" ("AppointmentId", "DateAndTime", "createdAt", "updatedAt", "EmployeeEmployeeId", "PetPetId") FROM stdin;
91	2024-06-19 13:00:00+03	2024-06-19 01:13:49.982+03	2024-06-19 01:13:49.982+03	19	7
92	2024-06-19 13:00:00+03	2024-06-19 01:13:51.351+03	2024-06-19 01:13:51.351+03	20	7
93	2024-06-28 16:00:00+03	2024-06-19 01:15:04.378+03	2024-06-19 01:15:04.378+03	19	7
94	2024-06-27 12:00:00+03	2024-06-24 15:15:21.044+03	2024-06-24 15:15:21.044+03	19	7
95	2024-06-27 12:00:00+03	2024-06-24 15:15:26.389+03	2024-06-24 15:15:26.389+03	20	7
96	2024-06-29 14:31:00+03	2024-06-24 15:32:03.589+03	2024-06-24 15:32:03.589+03	19	7
97	2024-06-29 14:31:00+03	2024-06-24 15:32:06.413+03	2024-06-24 15:32:06.413+03	20	7
98	2024-08-09 14:30:00+03	2024-06-24 23:36:16.279+03	2024-06-24 23:36:16.279+03	19	8
99	2024-08-09 14:30:00+03	2024-06-24 23:36:18.092+03	2024-06-24 23:36:18.092+03	20	8
\.


--
-- Name: Appointments_AppointmentId_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Appointments_AppointmentId_seq"', 99, true);


--
-- Data for Name: Checks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Checks" ("CheckId", "createdAt", "updatedAt", "UserUserId") FROM stdin;
8	2024-06-17 14:05:35.637+03	2024-06-17 14:05:35.637+03	8
10	2024-06-19 00:41:05.392+03	2024-06-19 00:41:05.392+03	10
11	2024-06-19 00:42:08.899+03	2024-06-19 00:42:08.899+03	11
12	2024-06-19 01:00:43.677+03	2024-06-19 01:00:43.677+03	12
13	2024-06-19 01:05:50.203+03	2024-06-19 01:05:50.203+03	13
14	2024-06-19 01:20:19.375+03	2024-06-19 01:20:19.375+03	\N
15	2024-06-24 23:33:11.698+03	2024-06-24 23:33:11.698+03	15
\.


--
-- Name: Checks_CheckId_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Checks_CheckId_seq"', 15, true);


--
-- Data for Name: Companies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Companies" ("CompanyId", "Name", "Description", "createdAt", "updatedAt", "UserUserId") FROM stdin;
10	VetLab	my description	2024-06-19 01:08:12.049+03	2024-06-19 01:08:12.049+03	12
11	My Company	My comp Description	2024-06-24 23:33:54.95+03	2024-06-24 23:33:54.95+03	15
\.


--
-- Name: Companies_CompanyId_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Companies_CompanyId_seq"', 11, true);


--
-- Data for Name: Departments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Departments" ("DepartmentId", "Address", "StartWorkingTime", "EndWorkingTime", "Name", "Info", "PhoneNumber", "createdAt", "updatedAt", "CompanyCompanyId") FROM stdin;
8	Краматорськ, Лікарська 31/19	08:00:00	17:00:00	Краматорський філіал мережі VetLab	my info	09924950968978	2024-06-19 01:09:25.764+03	2024-06-24 23:34:32.135+03	10
\.


--
-- Name: Departments_DepartmentId_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Departments_DepartmentId_seq"', 8, true);


--
-- Data for Name: EmployeeWorkHours; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."EmployeeWorkHours" ("EmployeeWorkHoursId", "WorkDate", "StartTime", "EndTime", "createdAt", "updatedAt", "EmployeeEmployeeId") FROM stdin;
5	2024-06-24 03:00:00+03	20:45:06	\N	2024-06-24 20:45:06.431+03	2024-06-24 20:45:06.433+03	20
6	2024-06-24 03:00:00+03	21:40:09	\N	2024-06-24 21:40:09.309+03	2024-06-24 21:40:09.311+03	19
7	2024-06-24 03:00:00+03	21:47:50	\N	2024-06-24 21:47:50.899+03	2024-06-24 21:47:50.9+03	21
8	2024-06-24 03:00:00+03	21:49:27	\N	2024-06-24 21:49:27.38+03	2024-06-24 21:49:27.382+03	22
\.


--
-- Name: EmployeeWorkHours_EmployeeWorkHoursId_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."EmployeeWorkHours_EmployeeWorkHoursId_seq"', 8, true);


--
-- Data for Name: Employees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Employees" ("EmployeeId", "Role", "Description", "createdAt", "updatedAt", "UserUserId", "DepartmentDepartmentId") FROM stdin;
19	Doctor	Хірург ветеринар 123	2024-06-19 01:10:31.735+03	2024-06-19 01:10:54.633+03	11	8
20	Doctor	фщьу	2024-06-19 01:12:28.761+03	2024-06-19 01:12:28.761+03	10	8
21	Employee	jasksjahbc	2024-06-19 01:19:27.916+03	2024-06-19 01:19:27.916+03	13	8
22	Employee	dfssd	2024-06-19 01:21:37.201+03	2024-06-19 01:21:37.201+03	\N	8
\.


--
-- Name: Employees_EmployeeId_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Employees_EmployeeId_seq"', 22, true);


--
-- Data for Name: Pets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Pets" ("PetId", "Breed", "AnimalType", "Name", "DocCode", "DateBirth", "createdAt", "updatedAt", "UserUserId") FROM stdin;
7	Хвиляста папуга	папуга	Сашко	89373282	2023-08-10 03:00:00+03	2024-06-19 01:11:45.321+03	2024-06-19 01:11:45.321+03	12
8	Хвиляста папуга Ара	Папуга	Alex	11111111111111111111111111	2023-03-10 02:00:00+02	2024-06-24 23:35:12.102+03	2024-06-24 23:35:12.102+03	15
\.


--
-- Name: Pets_PetId_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Pets_PetId_seq"', 8, true);


--
-- Data for Name: Prescriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Prescriptions" ("PrescriptionId", "Body", "createdAt", "updatedAt", "EmployeeEmployeeId", "PetPetId") FROM stdin;
4	Наприклад - рецепт	2024-06-19 01:16:16.839+03	2024-06-19 01:16:16.839+03	19	7
5	prescription	2024-06-24 23:37:41.871+03	2024-06-24 23:37:41.871+03	19	8
\.


--
-- Name: Prescriptions_PrescriptionId_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Prescriptions_PrescriptionId_seq"', 5, true);


--
-- Data for Name: Roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Roles" ("RoleId", "RoleName", "RoleDescription", "createdAt", "updatedAt") FROM stdin;
2	Client	This user can only be a client	2024-06-05 18:50:57.498+03	2024-06-05 18:50:57.498+03
3	Admin	Admin for company	2024-06-07 17:30:20.836+03	2024-06-07 17:30:20.836+03
4	SuperAdmin	Main admin in program system	2024-06-17 14:07:25.289+03	2024-06-17 14:07:25.289+03
5	Employee	Clinic employee	2024-06-17 15:39:42.904+03	2024-06-17 15:39:42.904+03
6	Doctor	Clinic Doctor	2024-06-17 15:39:56.647+03	2024-06-17 15:39:56.647+03
\.


--
-- Name: Roles_RoleId_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Roles_RoleId_seq"', 6, true);


--
-- Data for Name: ServiceInChecks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ServiceInChecks" ("ServiceInCheckId", "Count", "createdAt", "updatedAt", "ServiceServiceId", "CheckCheckId") FROM stdin;
12	1	2024-06-19 01:22:34.595+03	2024-06-19 01:22:34.595+03	9	12
13	1	2024-06-19 01:22:36.275+03	2024-06-19 01:22:36.275+03	8	12
\.


--
-- Name: ServiceInChecks_ServiceInCheckId_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ServiceInChecks_ServiceInCheckId_seq"', 16, true);


--
-- Data for Name: Services; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Services" ("ServiceId", "Name", "Info", "Price", "createdAt", "updatedAt", "DepartmentDepartmentId") FROM stdin;
8	Вакцинування	Для собак	35.00	2024-06-19 01:22:02.115+03	2024-06-19 01:22:02.115+03	8
9	Вакцинування	Вакцинування для собак	58.00	2024-06-19 01:22:13.742+03	2024-06-19 01:22:13.742+03	8
\.


--
-- Name: Services_ServiceId_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Services_ServiceId_seq"', 9, true);


--
-- Data for Name: Subscriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Subscriptions" ("SubscriptionId", "ValidUntil", "IsValid", "createdAt", "updatedAt", "UserUserId") FROM stdin;
\.


--
-- Name: Subscriptions_SubscriptionId_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Subscriptions_SubscriptionId_seq"', 1, false);


--
-- Data for Name: UserRoles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UserRoles" ("UserRoleId", "createdAt", "updatedAt", "RoleRoleId", "UserUserId") FROM stdin;
13	2024-06-17 14:05:35.605+03	2024-06-17 14:05:35.605+03	4	8
17	2024-06-19 01:00:43.667+03	2024-06-19 01:00:43.667+03	2	12
16	2024-06-19 00:42:08.889+03	2024-06-19 01:10:31.756+03	6	11
18	2024-06-19 01:05:50.192+03	2024-06-19 01:19:27.941+03	5	13
15	2024-06-19 00:41:05.362+03	2024-06-19 01:12:28.785+03	3	10
20	2024-06-24 23:33:11.66+03	2024-06-24 23:33:11.66+03	2	15
\.


--
-- Name: UserRoles_UserRoleId_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."UserRoles_UserRoleId_seq"', 20, true);


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Users" ("UserId", "FirstName", "SecondName", "PhoneNumber", "BirthDay", "PassportCode", "Email", "Password", "IsBanned", "IOTCode", "createdAt", "updatedAt") FROM stdin;
11	Софія	Кобченко	0994758002	2003-11-19 02:00:00+02	9898772382	sofiak77777@gmail.com	$2b$05$4splapgE5Eeqd5RPiHdwsuKiR2bPvDwb9dEWkNOUWGkgMxLjMfv4S	f	3377279	2024-06-19 00:42:08.873+03	2024-06-19 00:42:08.873+03
13	mark	radko	0-876332332	2024-06-22 03:00:00+03	376287632	markradko0009@gmail.com	$2b$05$yp83.Urxt7ds5tiB4mMMNuY8dOkKDvBIqZ9psiqwlGRVqSVdN5F86	f	7151289	2024-06-19 01:05:50.176+03	2024-06-19 01:05:50.176+03
10	Павло	Іванов	0995463883	2003-06-13 03:00:00+03	97189714	markradko06@gmail.com	$2b$05$T8EmolPJy62CV4ooP6yEceM/r3O7WuS0KErZmAdoK4gm4TN/n53H2	f	4307271	2024-06-19 00:41:05.317+03	2024-06-19 01:17:19.764+03
8	Марк	Радько	+380992495096	2003-08-05 03:00:00+03	3783702635657	markradko09@gmail.com	$2b$05$7aht6Cq3siO.p04.iq.fC.CdX2M3x5Ob20vZBdptsBx1X1XqBrzDy	f	2435157	2024-06-17 14:05:35.548+03	2024-06-24 11:04:35.12+03
12	Марк	Радько	+380992495096	2003-08-05 03:00:00+03	11111111111111111	mark.radko@nure.ua	$2b$05$OS59ESkOM1PYNMlY2eiPou49ZkVhHaxgbW6LKAmfR54PG0bF/md8i	f	2602159	2024-06-19 01:00:43.654+03	2024-06-24 14:38:14.927+03
15	Сергій	Єфремов	0994757687	1998-02-25 02:00:00+02	000000000000	example@gmail.com	$2b$05$W0.SQCW2ns3H6b9ro2RTReaxR7T1KUnAuYPljFGRq8EhPecysDate	f	9964718	2024-06-24 23:33:11.617+03	2024-06-24 23:33:34.495+03
\.


--
-- Name: Users_UserId_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Users_UserId_seq"', 15, true);


--
-- Name: Appointments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY public."Appointments"
    ADD CONSTRAINT "Appointments_pkey" PRIMARY KEY ("AppointmentId");


--
-- Name: Checks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY public."Checks"
    ADD CONSTRAINT "Checks_pkey" PRIMARY KEY ("CheckId");


--
-- Name: Companies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY public."Companies"
    ADD CONSTRAINT "Companies_pkey" PRIMARY KEY ("CompanyId");


--
-- Name: Departments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY public."Departments"
    ADD CONSTRAINT "Departments_pkey" PRIMARY KEY ("DepartmentId");


--
-- Name: EmployeeWorkHours_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY public."EmployeeWorkHours"
    ADD CONSTRAINT "EmployeeWorkHours_pkey" PRIMARY KEY ("EmployeeWorkHoursId");


--
-- Name: Employees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY public."Employees"
    ADD CONSTRAINT "Employees_pkey" PRIMARY KEY ("EmployeeId");


--
-- Name: Pets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY public."Pets"
    ADD CONSTRAINT "Pets_pkey" PRIMARY KEY ("PetId");


--
-- Name: Prescriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY public."Prescriptions"
    ADD CONSTRAINT "Prescriptions_pkey" PRIMARY KEY ("PrescriptionId");


--
-- Name: Roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_pkey" PRIMARY KEY ("RoleId");


--
-- Name: ServiceInChecks_ServiceServiceId_CheckCheckId_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY public."ServiceInChecks"
    ADD CONSTRAINT "ServiceInChecks_ServiceServiceId_CheckCheckId_key" UNIQUE ("ServiceServiceId", "CheckCheckId");


--
-- Name: ServiceInChecks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY public."ServiceInChecks"
    ADD CONSTRAINT "ServiceInChecks_pkey" PRIMARY KEY ("ServiceInCheckId");


--
-- Name: Services_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY public."Services"
    ADD CONSTRAINT "Services_pkey" PRIMARY KEY ("ServiceId");


--
-- Name: Subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY public."Subscriptions"
    ADD CONSTRAINT "Subscriptions_pkey" PRIMARY KEY ("SubscriptionId");


--
-- Name: UserRoles_RoleRoleId_UserUserId_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY public."UserRoles"
    ADD CONSTRAINT "UserRoles_RoleRoleId_UserUserId_key" UNIQUE ("RoleRoleId", "UserUserId");


--
-- Name: UserRoles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY public."UserRoles"
    ADD CONSTRAINT "UserRoles_pkey" PRIMARY KEY ("UserRoleId");


--
-- Name: Users_IOTCode_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_IOTCode_key" UNIQUE ("IOTCode");


--
-- Name: Users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY ("UserId");


--
-- Name: Appointments_EmployeeEmployeeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Appointments"
    ADD CONSTRAINT "Appointments_EmployeeEmployeeId_fkey" FOREIGN KEY ("EmployeeEmployeeId") REFERENCES public."Employees"("EmployeeId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Appointments_PetPetId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Appointments"
    ADD CONSTRAINT "Appointments_PetPetId_fkey" FOREIGN KEY ("PetPetId") REFERENCES public."Pets"("PetId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Checks_UserUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Checks"
    ADD CONSTRAINT "Checks_UserUserId_fkey" FOREIGN KEY ("UserUserId") REFERENCES public."Users"("UserId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Companies_UserUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Companies"
    ADD CONSTRAINT "Companies_UserUserId_fkey" FOREIGN KEY ("UserUserId") REFERENCES public."Users"("UserId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Departments_CompanyCompanyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Departments"
    ADD CONSTRAINT "Departments_CompanyCompanyId_fkey" FOREIGN KEY ("CompanyCompanyId") REFERENCES public."Companies"("CompanyId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: EmployeeWorkHours_EmployeeEmployeeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EmployeeWorkHours"
    ADD CONSTRAINT "EmployeeWorkHours_EmployeeEmployeeId_fkey" FOREIGN KEY ("EmployeeEmployeeId") REFERENCES public."Employees"("EmployeeId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Employees_DepartmentDepartmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Employees"
    ADD CONSTRAINT "Employees_DepartmentDepartmentId_fkey" FOREIGN KEY ("DepartmentDepartmentId") REFERENCES public."Departments"("DepartmentId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Employees_UserUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Employees"
    ADD CONSTRAINT "Employees_UserUserId_fkey" FOREIGN KEY ("UserUserId") REFERENCES public."Users"("UserId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Pets_UserUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Pets"
    ADD CONSTRAINT "Pets_UserUserId_fkey" FOREIGN KEY ("UserUserId") REFERENCES public."Users"("UserId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Prescriptions_EmployeeEmployeeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Prescriptions"
    ADD CONSTRAINT "Prescriptions_EmployeeEmployeeId_fkey" FOREIGN KEY ("EmployeeEmployeeId") REFERENCES public."Employees"("EmployeeId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Prescriptions_PetPetId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Prescriptions"
    ADD CONSTRAINT "Prescriptions_PetPetId_fkey" FOREIGN KEY ("PetPetId") REFERENCES public."Pets"("PetId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ServiceInChecks_CheckCheckId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceInChecks"
    ADD CONSTRAINT "ServiceInChecks_CheckCheckId_fkey" FOREIGN KEY ("CheckCheckId") REFERENCES public."Checks"("CheckId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ServiceInChecks_ServiceServiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceInChecks"
    ADD CONSTRAINT "ServiceInChecks_ServiceServiceId_fkey" FOREIGN KEY ("ServiceServiceId") REFERENCES public."Services"("ServiceId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Services_DepartmentDepartmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Services"
    ADD CONSTRAINT "Services_DepartmentDepartmentId_fkey" FOREIGN KEY ("DepartmentDepartmentId") REFERENCES public."Departments"("DepartmentId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Subscriptions_UserUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Subscriptions"
    ADD CONSTRAINT "Subscriptions_UserUserId_fkey" FOREIGN KEY ("UserUserId") REFERENCES public."Users"("UserId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: UserRoles_RoleRoleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserRoles"
    ADD CONSTRAINT "UserRoles_RoleRoleId_fkey" FOREIGN KEY ("RoleRoleId") REFERENCES public."Roles"("RoleId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserRoles_UserUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserRoles"
    ADD CONSTRAINT "UserRoles_UserUserId_fkey" FOREIGN KEY ("UserUserId") REFERENCES public."Users"("UserId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

