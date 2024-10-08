PGDMP     &                    |         
   rideeasedb    15.4    15.4 P    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    92901 
   rideeasedb    DATABASE     �   CREATE DATABASE rideeasedb WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE rideeasedb;
                postgres    false                        2615    92902    dbo    SCHEMA        CREATE SCHEMA dbo;
    DROP SCHEMA dbo;
                postgres    false                        1255    92903    usp_reset() 	   PROCEDURE     P	  CREATE PROCEDURE dbo.usp_reset()
    LANGUAGE plpgsql
    AS $_$
begin

	DELETE FROM dbo."UserOneSignalSubscription";
	DELETE FROM dbo."BookingConversation";
	DELETE FROM dbo."WalletJournal";
	DELETE FROM dbo."Booking";
	DELETE FROM dbo."Driver";
	DELETE FROM dbo."Passenger";
	DELETE FROM dbo."Operator";
	DELETE FROM dbo."Notifications";
	DELETE FROM dbo."UserProfilePic";
	DELETE FROM dbo."Files";
	DELETE FROM dbo."Users";
	DELETE FROM dbo."Access";
	
	ALTER SEQUENCE dbo."Notifications_NotificationId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."BookingConversation_BookingConversationId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."WalletJournal_WalletJournalId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."Booking_BookingId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."Driver_DriverId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."Passenger_PassengerId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."Operator_OperatorId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."Notifications_NotificationId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."Users_UserId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."Access_AccessId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."Files_FileId_seq" RESTART WITH 1;
	
	
	INSERT INTO dbo."Access" (
		"AccessCode",
		"Name", 
		"Active",
		"AccessPages"
	)
	VALUES (
			'000001',
			'Admin',
			true,
			'[
      {
        "page": "Dashboard",
        "view": true,
        "modify": true,
        "rights": []
      },
      {
        "page": "Drivers",
        "view": true,
        "modify": true,
        "rights": ["Approval"]
      },
      {
        "page": "Operators",
        "view": true,
        "modify": true,
        "rights": ["Approval"]
      },
      {
        "page": "Passengers",
        "view": true,
        "modify": true,
        "rights": []
      },
      {
        "page": "Users",
        "view": true,
        "modify": true,
        "rights": []
      },
      {
        "page": "Access",
        "view": true,
        "modify": true,
        "rights": []
      },
      {
        "page": "System Config",
        "view": true,
        "modify": true,
        "rights": []
      }
    ]');
	
	INSERT INTO dbo."Users" (
		"UserCode",
		"UserName",
		"Password", 
		"AccessGranted",
		"AccessId",
		"UserType")
	VALUES (
			'000001',
			'admin',
			'$2b$10$LqN3kzfgaYnP5PfDZFfT4edUFqh5Lu7amIxeDDDmu/KEqQFze.p8a',  
			true,
			1,
			'ADMIN');
	
END;
$_$;
     DROP PROCEDURE dbo.usp_reset();
       dbo          postgres    false    8            �            1259    92904    Access    TABLE     �   CREATE TABLE dbo."Access" (
    "AccessId" bigint NOT NULL,
    "Name" character varying NOT NULL,
    "AccessPages" json DEFAULT '[]'::json NOT NULL,
    "Active" boolean DEFAULT true NOT NULL,
    "AccessCode" character varying
);
    DROP TABLE dbo."Access";
       dbo         heap    postgres    false    8            �            1259    92911    Access_AccessId_seq    SEQUENCE     �   ALTER TABLE dbo."Access" ALTER COLUMN "AccessId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Access_AccessId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    217    8            �            1259    93397    Booking    TABLE     �  CREATE TABLE dbo."Booking" (
    "BookingId" bigint NOT NULL,
    "BookingCode" character varying,
    "PassengerId" bigint NOT NULL,
    "DriverId" bigint,
    "DestinationAddress" character varying NOT NULL,
    "DestinationMap" json NOT NULL,
    "PickupAddress" character varying NOT NULL,
    "PickupMap" json NOT NULL,
    "DateTimeBooked" timestamp with time zone NOT NULL,
    "DateTimePickUp" timestamp with time zone,
    "DateTimeArrivedPickup" timestamp with time zone,
    "BookingAmount" numeric DEFAULT 0 NOT NULL,
    "Status" character varying DEFAULT 'PENDING'::character varying NOT NULL,
    "VehicleType" character varying NOT NULL,
    "Rating" numeric,
    "FeedBack" character varying,
    "PaymentMethod" character varying,
    "PaymentAmount" numeric,
    "PaymentStatus" character varying DEFAULT 'PENDING'::character varying NOT NULL,
    "BookingCreditCharge" numeric DEFAULT 0 NOT NULL,
    "DateTimeArrivedDropOff" timestamp with time zone
);
    DROP TABLE dbo."Booking";
       dbo         heap    postgres    false    8            �            1259    93418    BookingConversation    TABLE     �  CREATE TABLE dbo."BookingConversation" (
    "BookingConversationId" bigint NOT NULL,
    "BookingId" bigint NOT NULL,
    "FromUserId" bigint NOT NULL,
    "ToUserId" bigint NOT NULL,
    "Message" character varying NOT NULL,
    "DateTime" timestamp with time zone NOT NULL,
    "Status" character varying DEFAULT 'ACTIVE'::character varying NOT NULL,
    "Active" boolean DEFAULT true NOT NULL
);
 &   DROP TABLE dbo."BookingConversation";
       dbo         heap    postgres    false    8            �            1259    93417 -   BookingConversation_BookingConversationId_seq    SEQUENCE       ALTER TABLE dbo."BookingConversation" ALTER COLUMN "BookingConversationId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."BookingConversation_BookingConversationId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    8    233            �            1259    93396    Booking_BookingId_seq    SEQUENCE     �   ALTER TABLE dbo."Booking" ALTER COLUMN "BookingId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Booking_BookingId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    8    231            �            1259    93650    Driver    TABLE     g  CREATE TABLE dbo."Driver" (
    "DriverId" bigint NOT NULL,
    "DriverCode" character varying,
    "Name" character varying NOT NULL,
    "MobileNumber" character varying NOT NULL,
    "Address" character varying NOT NULL,
    "CompanyId" character varying,
    "LicenseNumber" character varying NOT NULL,
    "UserId" bigint NOT NULL,
    "Requirements" json DEFAULT '[]'::json NOT NULL,
    "VehicleModel" character varying NOT NULL,
    "VehicleMake" character varying NOT NULL,
    "VehicleType" character varying NOT NULL,
    "VehicleColor" character varying NOT NULL,
    "Active" boolean DEFAULT true NOT NULL,
    "DriverStatus" character varying DEFAULT 'INACTIVE'::character varying NOT NULL,
    "VehicleStatus" character varying DEFAULT 'AVAILABLE'::character varying NOT NULL,
    "CurrentLocation" json,
    "CreditsBalance" numeric DEFAULT 0 NOT NULL
);
    DROP TABLE dbo."Driver";
       dbo         heap    postgres    false    8            �            1259    93649    Driver_DriverId_seq    SEQUENCE     �   ALTER TABLE dbo."Driver" ALTER COLUMN "DriverId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Driver_DriverId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    8    235            �            1259    92926    Files    TABLE     �   CREATE TABLE dbo."Files" (
    "FileId" bigint NOT NULL,
    "FileName" text NOT NULL,
    "Url" text,
    "GUID" text NOT NULL
);
    DROP TABLE dbo."Files";
       dbo         heap    postgres    false    8            �            1259    92931    Files_FileId_seq    SEQUENCE     �   ALTER TABLE dbo."Files" ALTER COLUMN "FileId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Files_FileId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    8    219            �            1259    92936    Notifications    TABLE     �  CREATE TABLE dbo."Notifications" (
    "NotificationId" bigint NOT NULL,
    "Title" character varying NOT NULL,
    "Description" character varying NOT NULL,
    "Type" character varying NOT NULL,
    "ReferenceId" character varying NOT NULL,
    "IsRead" boolean DEFAULT false NOT NULL,
    "UserId" bigint NOT NULL,
    "Date" timestamp with time zone DEFAULT (now() AT TIME ZONE 'Asia/Manila'::text) NOT NULL
);
     DROP TABLE dbo."Notifications";
       dbo         heap    postgres    false    8            �            1259    92943     Notifications_NotificationId_seq    SEQUENCE     �   ALTER TABLE dbo."Notifications" ALTER COLUMN "NotificationId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Notifications_NotificationId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    8    221            �            1259    93303 	   Passenger    TABLE       CREATE TABLE dbo."Passenger" (
    "PassengerId" bigint NOT NULL,
    "PassengerCode" character varying,
    "Name" character varying NOT NULL,
    "MobileNumber" character varying NOT NULL,
    "UserId" bigint NOT NULL,
    "Active" boolean DEFAULT true NOT NULL
);
    DROP TABLE dbo."Passenger";
       dbo         heap    postgres    false    8            �            1259    93302    Passenger_PassengerId_seq    SEQUENCE     �   ALTER TABLE dbo."Passenger" ALTER COLUMN "PassengerId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Passenger_PassengerId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    229    8            �            1259    92982    SystemConfig    TABLE     r   CREATE TABLE dbo."SystemConfig" (
    "Key" character varying NOT NULL,
    "Value" character varying NOT NULL
);
    DROP TABLE dbo."SystemConfig";
       dbo         heap    postgres    false    8            �            1259    93009    UserOneSignalSubscription    TABLE     �   CREATE TABLE dbo."UserOneSignalSubscription" (
    "UserId" bigint NOT NULL,
    "SubscriptionID" character varying NOT NULL
);
 ,   DROP TABLE dbo."UserOneSignalSubscription";
       dbo         heap    postgres    false    8            �            1259    93014    UserProfilePic    TABLE     b   CREATE TABLE dbo."UserProfilePic" (
    "UserId" bigint NOT NULL,
    "FileId" bigint NOT NULL
);
 !   DROP TABLE dbo."UserProfilePic";
       dbo         heap    postgres    false    8            �            1259    93017    Users    TABLE     G  CREATE TABLE dbo."Users" (
    "UserId" bigint NOT NULL,
    "UserName" character varying NOT NULL,
    "Password" character varying NOT NULL,
    "AccessGranted" boolean NOT NULL,
    "AccessId" bigint,
    "Active" boolean DEFAULT true NOT NULL,
    "UserCode" character varying,
    "UserType" character varying NOT NULL
);
    DROP TABLE dbo."Users";
       dbo         heap    postgres    false    8            �            1259    93025    Users_UserId_seq    SEQUENCE     �   ALTER TABLE dbo."Users" ALTER COLUMN "UserId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Users_UserId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    8    226            �            1259    94752    WalletJournal    TABLE     b  CREATE TABLE dbo."WalletJournal" (
    "WalletJournalId" bigint NOT NULL,
    "UserId" bigint NOT NULL,
    "Type" character varying NOT NULL,
    "Debit" numeric NOT NULL,
    "Credit" numeric NOT NULL,
    "DateTime" timestamp with time zone NOT NULL,
    "IsCompleted" boolean DEFAULT false NOT NULL,
    "ReferenceCode" character varying NOT NULL
);
     DROP TABLE dbo."WalletJournal";
       dbo         heap    postgres    false    8            �            1259    94751 !   WalletJournal_WalletJournalId_seq    SEQUENCE     �   ALTER TABLE dbo."WalletJournal" ALTER COLUMN "WalletJournalId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."WalletJournal_WalletJournalId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    8    237            �          0    92904    Access 
   TABLE DATA           Z   COPY dbo."Access" ("AccessId", "Name", "AccessPages", "Active", "AccessCode") FROM stdin;
    dbo          postgres    false    217   Qw       �          0    93397    Booking 
   TABLE DATA           ~  COPY dbo."Booking" ("BookingId", "BookingCode", "PassengerId", "DriverId", "DestinationAddress", "DestinationMap", "PickupAddress", "PickupMap", "DateTimeBooked", "DateTimePickUp", "DateTimeArrivedPickup", "BookingAmount", "Status", "VehicleType", "Rating", "FeedBack", "PaymentMethod", "PaymentAmount", "PaymentStatus", "BookingCreditCharge", "DateTimeArrivedDropOff") FROM stdin;
    dbo          postgres    false    231   �w       �          0    93418    BookingConversation 
   TABLE DATA           �   COPY dbo."BookingConversation" ("BookingConversationId", "BookingId", "FromUserId", "ToUserId", "Message", "DateTime", "Status", "Active") FROM stdin;
    dbo          postgres    false    233   �       �          0    93650    Driver 
   TABLE DATA           "  COPY dbo."Driver" ("DriverId", "DriverCode", "Name", "MobileNumber", "Address", "CompanyId", "LicenseNumber", "UserId", "Requirements", "VehicleModel", "VehicleMake", "VehicleType", "VehicleColor", "Active", "DriverStatus", "VehicleStatus", "CurrentLocation", "CreditsBalance") FROM stdin;
    dbo          postgres    false    235   ^�       �          0    92926    Files 
   TABLE DATA           C   COPY dbo."Files" ("FileId", "FileName", "Url", "GUID") FROM stdin;
    dbo          postgres    false    219   r�       �          0    92936    Notifications 
   TABLE DATA           �   COPY dbo."Notifications" ("NotificationId", "Title", "Description", "Type", "ReferenceId", "IsRead", "UserId", "Date") FROM stdin;
    dbo          postgres    false    221   ��       �          0    93303 	   Passenger 
   TABLE DATA           n   COPY dbo."Passenger" ("PassengerId", "PassengerCode", "Name", "MobileNumber", "UserId", "Active") FROM stdin;
    dbo          postgres    false    229   ��       �          0    92982    SystemConfig 
   TABLE DATA           5   COPY dbo."SystemConfig" ("Key", "Value") FROM stdin;
    dbo          postgres    false    223   �       �          0    93009    UserOneSignalSubscription 
   TABLE DATA           N   COPY dbo."UserOneSignalSubscription" ("UserId", "SubscriptionID") FROM stdin;
    dbo          postgres    false    224   9�       �          0    93014    UserProfilePic 
   TABLE DATA           ;   COPY dbo."UserProfilePic" ("UserId", "FileId") FROM stdin;
    dbo          postgres    false    225   V�       �          0    93017    Users 
   TABLE DATA              COPY dbo."Users" ("UserId", "UserName", "Password", "AccessGranted", "AccessId", "Active", "UserCode", "UserType") FROM stdin;
    dbo          postgres    false    226   s�       �          0    94752    WalletJournal 
   TABLE DATA           �   COPY dbo."WalletJournal" ("WalletJournalId", "UserId", "Type", "Debit", "Credit", "DateTime", "IsCompleted", "ReferenceCode") FROM stdin;
    dbo          postgres    false    237   ?�       �           0    0    Access_AccessId_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('dbo."Access_AccessId_seq"', 1, true);
          dbo          postgres    false    218            �           0    0 -   BookingConversation_BookingConversationId_seq    SEQUENCE SET     Z   SELECT pg_catalog.setval('dbo."BookingConversation_BookingConversationId_seq"', 1, true);
          dbo          postgres    false    232            �           0    0    Booking_BookingId_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('dbo."Booking_BookingId_seq"', 64, true);
          dbo          postgres    false    230            �           0    0    Driver_DriverId_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('dbo."Driver_DriverId_seq"', 3, true);
          dbo          postgres    false    234            �           0    0    Files_FileId_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('dbo."Files_FileId_seq"', 11, true);
          dbo          postgres    false    220            �           0    0     Notifications_NotificationId_seq    SEQUENCE SET     N   SELECT pg_catalog.setval('dbo."Notifications_NotificationId_seq"', 22, true);
          dbo          postgres    false    222            �           0    0    Passenger_PassengerId_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('dbo."Passenger_PassengerId_seq"', 4, true);
          dbo          postgres    false    228            �           0    0    Users_UserId_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('dbo."Users_UserId_seq"', 21, true);
          dbo          postgres    false    227            �           0    0 !   WalletJournal_WalletJournalId_seq    SEQUENCE SET     O   SELECT pg_catalog.setval('dbo."WalletJournal_WalletJournalId_seq"', 45, true);
          dbo          postgres    false    236            �           2606    93027    Access Access_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY dbo."Access"
    ADD CONSTRAINT "Access_pkey" PRIMARY KEY ("AccessId");
 =   ALTER TABLE ONLY dbo."Access" DROP CONSTRAINT "Access_pkey";
       dbo            postgres    false    217                       2606    93426 ,   BookingConversation BookingConversation_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY dbo."BookingConversation"
    ADD CONSTRAINT "BookingConversation_pkey" PRIMARY KEY ("BookingConversationId");
 W   ALTER TABLE ONLY dbo."BookingConversation" DROP CONSTRAINT "BookingConversation_pkey";
       dbo            postgres    false    233                       2606    93406    Booking Booking_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY dbo."Booking"
    ADD CONSTRAINT "Booking_pkey" PRIMARY KEY ("BookingId");
 ?   ALTER TABLE ONLY dbo."Booking" DROP CONSTRAINT "Booking_pkey";
       dbo            postgres    false    231                       2606    93659    Driver Driver_pkey 
   CONSTRAINT     c   ALTER TABLE ONLY dbo."Driver"
    ADD CONSTRAINT "Driver_pkey" PRIMARY KEY ("DriverId", "UserId");
 =   ALTER TABLE ONLY dbo."Driver" DROP CONSTRAINT "Driver_pkey";
       dbo            postgres    false    235    235            �           2606    93031     Notifications Notifications_pkey 
   CONSTRAINT     m   ALTER TABLE ONLY dbo."Notifications"
    ADD CONSTRAINT "Notifications_pkey" PRIMARY KEY ("NotificationId");
 K   ALTER TABLE ONLY dbo."Notifications" DROP CONSTRAINT "Notifications_pkey";
       dbo            postgres    false    221                       2606    93310    Passenger Passenger_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY dbo."Passenger"
    ADD CONSTRAINT "Passenger_pkey" PRIMARY KEY ("PassengerId", "UserId");
 C   ALTER TABLE ONLY dbo."Passenger" DROP CONSTRAINT "Passenger_pkey";
       dbo            postgres    false    229    229            �           2606    93041    SystemConfig SystemConfig_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY dbo."SystemConfig"
    ADD CONSTRAINT "SystemConfig_pkey" PRIMARY KEY ("Key");
 I   ALTER TABLE ONLY dbo."SystemConfig" DROP CONSTRAINT "SystemConfig_pkey";
       dbo            postgres    false    223                        2606    93045 8   UserOneSignalSubscription UserOneSignalSubscription_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY dbo."UserOneSignalSubscription"
    ADD CONSTRAINT "UserOneSignalSubscription_pkey" PRIMARY KEY ("UserId", "SubscriptionID");
 c   ALTER TABLE ONLY dbo."UserOneSignalSubscription" DROP CONSTRAINT "UserOneSignalSubscription_pkey";
       dbo            postgres    false    224    224                       2606    94758     WalletJournal WalletJournal_pkey 
   CONSTRAINT     n   ALTER TABLE ONLY dbo."WalletJournal"
    ADD CONSTRAINT "WalletJournal_pkey" PRIMARY KEY ("WalletJournalId");
 K   ALTER TABLE ONLY dbo."WalletJournal" DROP CONSTRAINT "WalletJournal_pkey";
       dbo            postgres    false    237            �           2606    93047    Files pk_files_901578250 
   CONSTRAINT     [   ALTER TABLE ONLY dbo."Files"
    ADD CONSTRAINT pk_files_901578250 PRIMARY KEY ("FileId");
 A   ALTER TABLE ONLY dbo."Files" DROP CONSTRAINT pk_files_901578250;
       dbo            postgres    false    219                       2606    93051 -   UserProfilePic pk_userprofilepic_1_1525580473 
   CONSTRAINT     p   ALTER TABLE ONLY dbo."UserProfilePic"
    ADD CONSTRAINT pk_userprofilepic_1_1525580473 PRIMARY KEY ("UserId");
 V   ALTER TABLE ONLY dbo."UserProfilePic" DROP CONSTRAINT pk_userprofilepic_1_1525580473;
       dbo            postgres    false    225                       2606    93053    Users pk_users_1557580587 
   CONSTRAINT     \   ALTER TABLE ONLY dbo."Users"
    ADD CONSTRAINT pk_users_1557580587 PRIMARY KEY ("UserId");
 B   ALTER TABLE ONLY dbo."Users" DROP CONSTRAINT pk_users_1557580587;
       dbo            postgres    false    226                       2606    93661    Driver u_Driver 
   CONSTRAINT     d   ALTER TABLE ONLY dbo."Driver"
    ADD CONSTRAINT "u_Driver" UNIQUE ("DriverId") INCLUDE ("Active");
 :   ALTER TABLE ONLY dbo."Driver" DROP CONSTRAINT "u_Driver";
       dbo            postgres    false    235    235                       2606    93663    Driver u_Driver_UserId 
   CONSTRAINT     u   ALTER TABLE ONLY dbo."Driver"
    ADD CONSTRAINT "u_Driver_UserId" UNIQUE ("DriverId", "UserId") INCLUDE ("Active");
 A   ALTER TABLE ONLY dbo."Driver" DROP CONSTRAINT "u_Driver_UserId";
       dbo            postgres    false    235    235    235            	           2606    94634    Passenger u_passenger 
   CONSTRAINT     X   ALTER TABLE ONLY dbo."Passenger"
    ADD CONSTRAINT u_passenger UNIQUE ("PassengerId");
 >   ALTER TABLE ONLY dbo."Passenger" DROP CONSTRAINT u_passenger;
       dbo            postgres    false    229                       1259    93674    u_driver_user    INDEX     �   CREATE INDEX u_driver_user ON dbo."Driver" USING btree ("DriverId", "UserId") WITH (deduplicate_items='true') WHERE ("Active" = true);
    DROP INDEX dbo.u_driver_user;
       dbo            postgres    false    235    235    235            
           1259    93378    u_passenger_user    INDEX     w   CREATE UNIQUE INDEX u_passenger_user ON dbo."Passenger" USING btree ("PassengerId", "UserId") WHERE ("Active" = true);
 !   DROP INDEX dbo.u_passenger_user;
       dbo            postgres    false    229    229    229                       1259    94766    u_referenceCode    INDEX     �   CREATE UNIQUE INDEX "u_referenceCode" ON dbo."WalletJournal" USING btree ("ReferenceCode", "IsCompleted") WITH (deduplicate_items='false') WHERE ("IsCompleted" = true);
 "   DROP INDEX dbo."u_referenceCode";
       dbo            postgres    false    237    237    237                       1259    93589 
   u_username    INDEX     �   CREATE UNIQUE INDEX u_username ON dbo."Users" USING btree ("Active", "UserName", "UserType") WITH (deduplicate_items='false') WHERE ("Active" = true);
    DROP INDEX dbo.u_username;
       dbo            postgres    false    226    226    226    226            !           2606    93427 2   BookingConversation fk_BookingConversation_Booking    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."BookingConversation"
    ADD CONSTRAINT "fk_BookingConversation_Booking" FOREIGN KEY ("BookingId") REFERENCES dbo."Booking"("BookingId");
 ]   ALTER TABLE ONLY dbo."BookingConversation" DROP CONSTRAINT "fk_BookingConversation_Booking";
       dbo          postgres    false    3340    231    233            "           2606    93432 3   BookingConversation fk_BookingConversation_FromUser    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."BookingConversation"
    ADD CONSTRAINT "fk_BookingConversation_FromUser" FOREIGN KEY ("FromUserId") REFERENCES dbo."Users"("UserId");
 ^   ALTER TABLE ONLY dbo."BookingConversation" DROP CONSTRAINT "fk_BookingConversation_FromUser";
       dbo          postgres    false    3332    226    233            #           2606    93437 1   BookingConversation fk_BookingConversation_ToUser    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."BookingConversation"
    ADD CONSTRAINT "fk_BookingConversation_ToUser" FOREIGN KEY ("ToUserId") REFERENCES dbo."Users"("UserId");
 \   ALTER TABLE ONLY dbo."BookingConversation" DROP CONSTRAINT "fk_BookingConversation_ToUser";
       dbo          postgres    false    226    3332    233                       2606    94635    Booking fk_Booking_Driver    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Booking"
    ADD CONSTRAINT "fk_Booking_Driver" FOREIGN KEY ("DriverId") REFERENCES dbo."Driver"("DriverId") NOT VALID;
 D   ALTER TABLE ONLY dbo."Booking" DROP CONSTRAINT "fk_Booking_Driver";
       dbo          postgres    false    231    3346    235                        2606    94640    Booking fk_Booking_Passenger    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Booking"
    ADD CONSTRAINT "fk_Booking_Passenger" FOREIGN KEY ("PassengerId") REFERENCES dbo."Passenger"("PassengerId") NOT VALID;
 G   ALTER TABLE ONLY dbo."Booking" DROP CONSTRAINT "fk_Booking_Passenger";
       dbo          postgres    false    229    231    3337                       2606    93311    Passenger fk_Passenger_User    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Passenger"
    ADD CONSTRAINT "fk_Passenger_User" FOREIGN KEY ("UserId") REFERENCES dbo."Users"("UserId");
 F   ALTER TABLE ONLY dbo."Passenger" DROP CONSTRAINT "fk_Passenger_User";
       dbo          postgres    false    226    3332    229                       2606    93064 ;   UserOneSignalSubscription fk_UserOneSignalSubscription_User    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."UserOneSignalSubscription"
    ADD CONSTRAINT "fk_UserOneSignalSubscription_User" FOREIGN KEY ("UserId") REFERENCES dbo."Users"("UserId");
 f   ALTER TABLE ONLY dbo."UserOneSignalSubscription" DROP CONSTRAINT "fk_UserOneSignalSubscription_User";
       dbo          postgres    false    226    224    3332                       2606    93145    Users fk_User_Access    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Users"
    ADD CONSTRAINT "fk_User_Access" FOREIGN KEY ("AccessId") REFERENCES dbo."Access"("AccessId") NOT VALID;
 ?   ALTER TABLE ONLY dbo."Users" DROP CONSTRAINT "fk_User_Access";
       dbo          postgres    false    3320    217    226            %           2606    94759 $   WalletJournal fk_WalletJournal_Users    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."WalletJournal"
    ADD CONSTRAINT "fk_WalletJournal_Users" FOREIGN KEY ("UserId") REFERENCES dbo."Users"("UserId");
 O   ALTER TABLE ONLY dbo."WalletJournal" DROP CONSTRAINT "fk_WalletJournal_Users";
       dbo          postgres    false    226    3332    237            $           2606    93669    Driver fk_driver_user    FK CONSTRAINT     y   ALTER TABLE ONLY dbo."Driver"
    ADD CONSTRAINT fk_driver_user FOREIGN KEY ("UserId") REFERENCES dbo."Users"("UserId");
 >   ALTER TABLE ONLY dbo."Driver" DROP CONSTRAINT fk_driver_user;
       dbo          postgres    false    226    3332    235                       2606    93084 #   Notifications fk_notifications_user    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Notifications"
    ADD CONSTRAINT fk_notifications_user FOREIGN KEY ("UserId") REFERENCES dbo."Users"("UserId") NOT VALID;
 L   ALTER TABLE ONLY dbo."Notifications" DROP CONSTRAINT fk_notifications_user;
       dbo          postgres    false    226    221    3332                       2606    93134 0   UserProfilePic fk_userprofilepic_files_354100302    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."UserProfilePic"
    ADD CONSTRAINT fk_userprofilepic_files_354100302 FOREIGN KEY ("FileId") REFERENCES dbo."Files"("FileId");
 Y   ALTER TABLE ONLY dbo."UserProfilePic" DROP CONSTRAINT fk_userprofilepic_files_354100302;
       dbo          postgres    false    225    3322    219                       2606    93139 &   UserProfilePic fk_userprofilepic_users    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."UserProfilePic"
    ADD CONSTRAINT fk_userprofilepic_users FOREIGN KEY ("UserId") REFERENCES dbo."Users"("UserId");
 O   ALTER TABLE ONLY dbo."UserProfilePic" DROP CONSTRAINT fk_userprofilepic_users;
       dbo          postgres    false    225    3332    226            �   �   x��α�0��}
s31���51L�P�Q�m�j1��:�Q����s�(�`GQ?!Z|@��N�nJ;Y���n2����rP�_�"s�3��{rQ��+D6"񿙣GR�-%~R�8���$_�jZ�-�J{�8�ٻ���F��L./[)�^��W      �     x��\kOY��E+V��nխ���F���!�+���+xl�d����{��׌��	B�H�~�>Uu�� nH�����o̮&�o����v��菦߶����Vqp::]\��ë��=9LG����I	R(DB�[O�&�����J8��:�s���M�w�U��'��p�#+��3GfЀ���Hے��+�+ɕJ	-qS�pC�Qo�w���ww�?�8|������}�|�������O=�	��|����:�����r�n2�;�ˋ���{���T1�6N'm�Ť�y�Fk���v�y��ؚP��sbf�jh�@�B᤹Eh���aM��&'4�c~����9�8MO����8�����ltv2.Hy�Mf��`4.>��_�Iw
G2��4�"'�ʜP�Tu���\�VH��İ�J*��:�Bc7_�V��s �@KEB���P�C����'�.��˅KD>t�C�JQ���k�u��U!mITJ�l�m�:n�b�16^�+��;��t��3�8)3H���?!l�l�P���J�@��0Y0��7��I
m⧔��/{���-b��9z�`'�<��6����;��&��v(�q��-�\
A	��{�xP��>�Jt%S������d(]�DF�`
��A������9�0*��g�&b۟\�L�V�c$�! � �L���h�%��`#�Y�'\Lh�$�M�M»��	�Ǣ��X���B��%M!9��pA�}�a/Rsi��pJ.����d��%���<kB�@���nΜ���D,������^�%q��{!|�L���YgM��Ur[���9��a��IYF{\�]Q���;�ץī��ӯ�o���3��$�=�g[�|����B	����1���ϊ����'I>�[�}ՙ#���dj�BU Qk$�TH����m��!#�fB�&U�D*o
�o����o���<���:q����&4:�+5F̠���0z\�| ���X]+�v6<�f%���AC�$�\�zF�,2�i��b��	a��T�;�P��F��UF�<�?b;�Вb�-�~��ض�)�����c�/�z�<�*��;i\la�^}Q��J,[�]��$b1�Xr��*g��F���f���@ή�O��V�_����Yp\Ad!�DC����p5�\D-E'���� ��e8���"*��m��ц����*���g#�lŌ�.��r�-�͔ &�9��:|K�+͒:ˊ�O���YvLg�M���X�87���Z��."�*�uA�[�Ԋ�J��j�;��E~�A�A���-E>����zޏǃ��ɜ�G�o>��>�|�\�.WPK�@\h��-3�JA��]�,iC*U��d�u���tnL��W!YhA۶#����$9�i���[U��C����!��jZq�[���ȏ�kK�3�����
���^�Cu����wŻ������|6}����4�翜/B�h�1��`j��� `�DםW��8����d����&���s�'���0�<�"���K�P�#�T]�:j��i��Mڅى�@�DV��H��dd͜;�SS�Ŏ3�� V�n��ҍ��ks�P��q�4��?��N�5�n�|���?��,���@�j���\��/���NՓ�G��K�b� �g^#�趱/EJ=��w櫓Dc9°_Ɣ��a�l���Io>E,��Sw������@��{�fu���?�6�P��f�����	��M p��������3��R�SL�9�?E� ��'���2O��J���
� �}�/�Uk<(I�O���W���\�!C�U�,�I���d|d��b2ޞ/�n���l���S�,��?UH.U�	K����+n�ȝ��O�ؔ$�7�nL^��7y�u��iP@�	{*e��@�^�sx;�I�+͈ٙ:�(����
��3-㦾 u�ý7���|R|��`:8�?��>o.�| �iِ�S>���^Qɥ@��X��s�EN���0sJ��?<���\�͎O�C�ݣ@O]f�[�zű����F����g��½�&��F�6�=�����q	�u</$���'�%���1���(;��V���!9��KSݘZq���TXr�;̝w0�~�RIa�5�Xrbڬ]+DqjG����C��'7vB�n-=9�&������/h�����K'n�y������(�\��d$`ͪ~���l�7��Q����ٷ��lzZM�X����������c�	K%����⬚S[�;�U�k����(GP���ՄWp��0�+"�|%�i�:�����|����Bf�e�č���}���V*�	i�Cb�[">����`2)�fMR]�f����|���V�MK�)}�y_�I�k���d����H(�t����xE������w�v��|s�����֜�PfC���7R��+o�|Lz��׋��H'D�P�v�Ʃ�`��P�y|�ʥ����{�,�&��Lh�]tP�b�3^蓿��b�����X��D��0N�9����}�۵�v�Y}c㕃j0�B/@�jZ�+��Ԁ��`��/;��c�Y����
�&�B��}��>�>���\�7�$<��'$��/�N'�C_���g_֎�J;�+�����!t����h4�:Ltu\�ֲ%��;o���u��S���^�7�)r�kY��d�@E'q��}d�>�S\�ђ49�X�Ǹ��e)�^=�R�i�H�lC���B)��p��C�4��m�[��V�k�����נ�	��V��ȫ�l݃��8���
���ss�ͯ�������U      �   =   x�3�4�44�4����4202�50�54W00�26�26�3���6��tt�s�,����� "	�      �     x�ŗ{��������+m�J˻3��#E�o�����n��/cc��;�~�������R�	y8gΜ�����x���R�=��R �dU:�~4gpF��?~z��������-��?|hڢ���Er�~�6oa�}��ϱ��y��_�MY��]��͇W]Z��m�, ��g�
��C0i��ȏ"?߮%N����HC�4Z�CL��y�(K�&���O�w��R?{K\�i��0,���v�Sǒ,�� 9�b9 ���$�ۮ�?%�6N��MOj���,�]�xɴd�ko,�:��Q��\����7�)_4fC�%A�=�[h�����̄��$$?������0Ի�Y�D9��-	U�i��[�!�A�O���+f�Q*�6����U�{�r�a;�da�8�G~�T�����;Բr���!�%+1�T���m�,��A��Mb���x�a�ں&O�FT��33�]~����w2y'TE���ȡ��� ��1d1�"�[�*a��Ǉ��[�*v������gF���U�Z�`j�`��&���~}��tiD`�:��8�c��0��?��i�����b�}b����?	�+�T��^�(�{�Pf�L3E��9�LtD�%C���z�۴�"�����ͽ�y�y)� Z��O3��_�E��,��~�,�͔ ��α �9�C~�c
�F�qd3�g(+�U�:B%L,�e�#��f�^�zt=lH�쟸 9�������]�UjT^S^��\.���0�c4b����B׶Gu��w��Ln��m�R�)�C�e6El��$�O����:������o�'���k;{�uwn���[������v�h�-=�z�L6�m�UJQXkj���3��&���:�}u"�=�z�k�9�E|�/!v�%�ׂp,�:�����x��8�>��JrH�a)
�sd��\�:�>�o٠@R$�0�D��@�޵����w��j�"�5A��w�Ĳ<�i^�5�߹�������o&�F����0aH���>���� �oQ���� 6Ӑ���R^9Z,��`����ޑJ�M��\b'v��yب�
�L��5Z�ـj[j�=�s"���e�BE#��Z]L� �^�2�������tY�W��:Ia��S_ST��Y�w4d���R`�y�����D�t<�eTy2�s�S3Un�哚w�y�*cc�	~W2uD��Év�7��[�I���>��ԋU\�$�Z��P+�nsZ��f�S�Ev/%�C���?�����s��d~�,�(�܁)�$cU��v4{�)8������_�*�u��i�_py���[�W �qȢ9E�?gbV��	�|,(&�����;�ZBK:ƙ=�W㊜�=��v�&˺G馺����_Es^p����r��$u�˼�PI.�I9M����ڶYj���xCL���
��)��]̨ [}�����.qO����ɵ�Jͮ�v��u��Q�E&us�;��,�T�{�#|����n�V$�[d��6�kpM�r�dy�й�!r�s�&�����^]P�n}�N�%�JI��[h^��b�i��U�������"Q]����nl}�v�qe�[ڗ��	KX�^�p[qM�:�:<&U++��+-Xh����_¯!5�$ͩ'��0f��&�1�F�Fb�9��"���~+�?O��S�S��E~��;?�h��՘�<7ʻSZkݳ�P!u�w}��n���;�;��>s��������N�Z;49����׃�w(�&�oͳO"֌	�"��_3����u��
V{Y��Y��u�E���&��l��~�4�ט5`��L6�x���9�wʵǚ΋��!��kYT����a��e�B�!���z ��nV��մ=����V�M�38.�U�l�ڋK���zs�R��*�jbc���F:��8�w�S��O`� ��?NN�A�l�*~��į1��A����ax(0��?�,�������>��+�ۓ��ڰ���
����Ƿ���0G�      �   ?  x�Ŗ[ϣ�������Ur�o�96�VG�iš���|��o{�Q��d.6��-����-OUC}I�0#mh�����&�&�X������g_�}_w����6��gVU��u�}�U����a�7}8�a]wu��J�|�m���͐���e�}KE�����0��Mc��i��(L�0���c�]H�c�uz�sJBDo�0)�K��������B�Y��1�q��P~O�'u�I��g��4��ge�-�����y�D~~]P�1=���A��d˖���!�:8]�R��6N��<"18�kv-�&�٘�JI��ϓ���x\5�ʈ�E\��M!?�0�"[��ưt[�)7f�J3=��`J]P�2��G�j 1J�������U~u=G���'�U����R�Ӛu�vje�V��*�$;3#"*'�i��V8�s��gp��y����E�^{D5E~�
�?��$q~X���T�l���G)����E��D�k#!�����x] ��4�Ǽ���ݾE��wcoS�ʴF�(�S�J+���G����<h#�� �aB�oBL��(�8�����&��;R܁<p�ٌϨ4�ݩ���z�l
H��	^�y'�
��r��.7���d��j�Ig	G�9�1�C��sQ�L� ��)��᮹��3�Z=�C�R�v�+]bǜ�|�kK��9���zC�p��~tO���'��8�U^�`�c���:F���k�MNQX�Z�I��á�u�tCu!�V�=�:|/�DK���,�����QVD� /�N���=�7Ź$���z֢�{v9�����"�YL
$�&���fB��㥟�=�x�L���# |_b��y��a�?�*�oc��!�S��1I#7����� ����c�Vs��G���߃��'팁L�h�BL�{��?���j��:{9{�*|��)�,��{O�L����)��U'��Y�CJ�6���z����i�n�s}V�դ},R�f�26��F��z��cM9t����ݔ"k�cEu�]!Z�˅l�)�)�y/����P.j9�'����'���fڄ���ˉn:v�1��UL��!���ݮ�T2I��6��t<\���9#uӊ;x)KW݆ϵ\�
G���$�'�[$�3�y�՝��?1����qˑf�Og�1�#0|@�Ŭ���>�����A�E�4ǆIYa!&�@���t�[���QC[���;�w������[�e���T}V�Y��i\��\��a�H��2�uTV�uV/�w|������m���`J����x+?��L��J*��a�]qOGr�j&'��/u�~R���9�JKD��,��/;YH�2��B�������h�G O�^\W�\�؁7�3%~s��ԏ�1�Շ��=���ueX����~��ï�fIY����r9G���c��궄�h��s����S睝;�u�U�L����qO�:�:����o��h:gs�&�G���_h�s�� ��x�X�0<�ҿ�,�������~)��W��Ϻ�?��lĒ^�SL#2�a��4��婈�ߺ0�ƕ��ɠ&�H�*�a<i�d{�͜<7��k�����UL_ um���U���=�����G�ڿ��)_��,��t{��sW���v?��
�5�ha�޺��c�X��!:�I���n��C�������W�ܑM�%�����u+4[��5a��,6��t���-���cĺ��y���⣮�E?��=�y���P����@���Ζ��vg�6TЋSt� }�m���/��'��tۃb?��ro_`S-�1[�G#]�t9��{�5;W�P�c-L��p�mw����|������W{	PQ      �   �  x�՗�O�0ǟӿ�x�Ä�߱�mhR�*�	irS%���~g�L�Fb�4A�X���s��݅eS��j�a��}��Ի0�dGP�Ҽi���܃��n����l�u�r��;X6�몦&pr��;�n=���n��US�W/`�����\Y�U��@���O��麟��������������sF�'m�e"��C�� �a
!��Ҩ�#51E��Sp]0Fr�K�x�x�0��	2Dqau�#��C<���\S�X�'�.��/��~�]F��u��ҭka�}�Ӂ������7>��7�p�&;'�n_U����bYPN3<%!Q� �����*I��<fD<C������Q#�J�1C�i��<|D<t���BY���<�ȑ�l[���T�؈��˞)��G Ee?0�%�x>���l�^~�Щ�X����H�k�Yw��F��	��߈{�0�:)
���F)��w�0�C�c�(�%�h�{����r��q1J�m[��I�I�<�&19���1ݫI�����]lEnED��_ ��Œ���w��{���}ܕҁ�n0�x�OF�I7Q�Q,�F6��B�D�Z/��ȼ�O�`��3´�2�
̾�O^��l!ъ��@ߕ-^ �p�|��&�����=1{ьj,�\p�<���@�@�4��*~���G����$���7��^      �   X   x�3�4 C΀���Լ��"CNKKScC#sN#�.c�cNע��<$iNC��	D�Cޒ��(o�7B�a�b��PQ� ���      �   ;   x�s	�s�	��wsr�v
�tv�w�prw�prv�qtw�44������ �m�      �      x������ � �      �      x������ � �      �   �  x�m�ɒ�JE��5�!J#($�Hw��H�_��WE�FTF�t�<��d��X5�}Q� ���2�ȌSF�!q)�c��1�.�۲Ql��3�n��X���K~D]5�P4��r�S�rzr���U�_�؎e:��@n�VuH5?cE^�n��������U��&�ƕi�ug4��DB喃Mu��Y$��4uwT9��W����g�`
3ǑE���H�gHH�\Ύv�y�����K�aEn �d�u�%��2��} �{�#���I^�����A�9�ّ�{yB�=�7W�����.:3�+<�EԀ�SW)+�,�B ����9�������f��4񋚄�4��hc��U� gڸ^<j���o�~8����+��AMy�xR{�!�������ސ�I?¢��t]^�r>�Ac���g�\��5�򙝢�63C9�����m���eT�S*�b�[���g�7\�^ 0��3��F㮾g����Vz���c�9
���M����k�"k�SQ}���}8�
��s1h�����Y*#<;�<k�����f�M�%h�y���RY;��Y ��Ű3�*UUj'��uLDʆ~�RF���>{�h�d�A�\W�� �x�ݏ~��7�3�fr�D���|��u�Y�o��y�ԝE9>,i+��>����g?`��_,��<�      �   �  x���ٮ�H��w=ž�J��(�qh��Iq6N8�O߅�����>�x���_k�������[�|�G�"~ �$���D}?��?^ɓB��dv*��/j���!9�3�2�Q��i
��l!��ӪS�K~4R���_��^C�'a5t0�0�����vʝ��ҷ��4�׈jN�]t��*v�\�,�&�%$6������PY�0�P9!E�7�:�9!C����D�1W*K9�� �bi7f��R����7G$����%�ߚ�@ �m�117ͫ��M<����m�^�u{�2�1-�0�G�&�c��ɹVͮc��j��|΄�/8A,�1�'b ���D����)�Y����3jM��Q�nIP�?B�S�]��&yt��(���.�۸7���34��>�N�O<â+%s�(/��$e`��) �n���$�@���!��ٟJ�YHU�B�����0 ���f�K�K�1ƳR}U�� �Xn�G��M�O������<�^��I�v��2�(��	�����w����V �����Y@14��y�X�u�"���WխO��e!J3�xiW��:��	Z59=샞_߯Z��;�pyn ��q��ð���wCw�N��5����������A��[ �����7\�� �����]F[�tDT�q�l��5�Q�>v�ݔ'P��#.`�zD��/�R:<�XHv�.��vU9��Z�JgI2�.�:��ې�8pLL#-[�NO�Jn+,r;�-�ߓW����[��F��@�V[����l���l���h����oA`1���@�rN����lۻƬ:�Ni]h!��Gf��@a<�v���V�n�v�^N�{��9�D썑�t�1*2�1���Μۗ�W8���(c� ��H���g����[�v�p�3w�F쭏���Ē>�oL�Bm5�t�A���V��^�F.b2�W$!���rׂCܜ�dB+��L|�^;nm��>z����J��������_/�9]N{�>KGL���&1�SW]�J��g�A���JQpm�M��N�����X���=��BE� ���<{�d���>,� ��>%Y��.�1����4�籀өЭ�mY��^��Nҗ�*lp�H�o�^y�h��rƥ���{@�;{��#�䏁��m^o�[ނt�qi8��Z#B��1�-}��Yz��%�!w�t���[|Wj�~1���B ��U2r�P�����B��[��     