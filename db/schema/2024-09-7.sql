PGDMP  6                    |            philantrolinkdb    16.3    16.3 h    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16394    philantrolinkdb    DATABASE     �   CREATE DATABASE philantrolinkdb WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE philantrolinkdb;
                postgres    false                        2615    16395    dbo    SCHEMA        CREATE SCHEMA dbo;
    DROP SCHEMA dbo;
                postgres    false            2           1255    16396    usp_reset() 	   PROCEDURE     �	  CREATE PROCEDURE dbo.usp_reset()
    LANGUAGE plpgsql
    AS $_$
begin

	DELETE FROM dbo."UserConversation";
	DELETE FROM dbo."SupportTicketMessage";
	DELETE FROM dbo."SupportTicket";
	DELETE FROM dbo."Notifications";
	DELETE FROM dbo."UserOneSignalSubscription";
	DELETE FROM dbo."Responded";
	DELETE FROM dbo."Interested";
	DELETE FROM dbo."EventImage";
	DELETE FROM dbo."EventMessage";
	DELETE FROM dbo."Transactions";
	DELETE FROM dbo."Events";
	DELETE FROM dbo."UserProfilePic";
	DELETE FROM dbo."Files";
	DELETE FROM dbo."Users";
	DELETE FROM dbo."Access";
	
	ALTER SEQUENCE dbo."UserConversation_UserConversationId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."Notifications_NotificationId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."SupportTicketMessage_SupportTicketMessageId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."SupportTicket_SupportTicketId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."EventMessage_EventMessageId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."Transactions_TransactionId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."Events_EventId_seq" RESTART WITH 1;
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
        "page": "Events Manager",
        "view": true,
        "modify": true,
        "rights": ["Approval"]
      },
      {
        "page": "Transactions",
        "view": true,
        "modify": true,
        "rights": []
      },
      {
        "page": "Support Ticket",
        "view": true,
        "modify": true,
        "rights": ["Approval"]
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
      }
    ]');
	
	INSERT INTO dbo."Users" (
		"UserCode",
		"UserName",
		"Email",
		"Password", 
		"AccessGranted",
		"AccessId",
		"UserType",
		"Name",
		"CurrentOTP",
		"IsVerifiedUser"
		)
	VALUES (
			'000001',
			'admin',
			'admin@email.com',
			'$2b$10$LqN3kzfgaYnP5PfDZFfT4edUFqh5Lu7amIxeDDDmu/KEqQFze.p8a',  
			true,
			1,
			'ADMIN',
			'Admin Admin',
			0,
			true
		);
	
END;
$_$;
     DROP PROCEDURE dbo.usp_reset();
       dbo          postgres    false    8            �            1259    16397    Access    TABLE     �   CREATE TABLE dbo."Access" (
    "AccessId" bigint NOT NULL,
    "Name" character varying NOT NULL,
    "AccessPages" jsonb DEFAULT '[]'::json NOT NULL,
    "Active" boolean DEFAULT true NOT NULL,
    "AccessCode" character varying
);
    DROP TABLE dbo."Access";
       dbo         heap    postgres    false    8            �            1259    16404    Access_AccessId_seq    SEQUENCE     �   ALTER TABLE dbo."Access" ALTER COLUMN "AccessId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Access_AccessId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    8    218            �            1259    16405 
   EventImage    TABLE     �   CREATE TABLE dbo."EventImage" (
    "EventId" bigint NOT NULL,
    "FileId" bigint NOT NULL,
    "UserId" bigint NOT NULL,
    "Active" boolean DEFAULT true NOT NULL
);
    DROP TABLE dbo."EventImage";
       dbo         heap    postgres    false    8            �            1259    16409    EventMessage    TABLE       CREATE TABLE dbo."EventMessage" (
    "EventMessageId" bigint NOT NULL,
    "EventId" bigint NOT NULL,
    "FromUserId" bigint NOT NULL,
    "ToUserId" bigint NOT NULL,
    "Message" character varying NOT NULL,
    "DateTimeSent" timestamp with time zone DEFAULT (now() AT TIME ZONE 'Asia/Manila'::text) NOT NULL,
    "Status" character varying DEFAULT 'SENT'::character varying NOT NULL,
    "LastUpdated" timestamp with time zone DEFAULT (now() AT TIME ZONE 'Asia/Manila'::text) NOT NULL,
    "Active" boolean DEFAULT true NOT NULL
);
    DROP TABLE dbo."EventMessage";
       dbo         heap    postgres    false    8            �            1259    16418    EventMessage_EventMessageId_seq    SEQUENCE     �   ALTER TABLE dbo."EventMessage" ALTER COLUMN "EventMessageId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."EventMessage_EventMessageId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    8    221            �            1259    16419    Events    TABLE     |  CREATE TABLE dbo."Events" (
    "EventId" bigint NOT NULL,
    "EventCode" character varying,
    "UserId" bigint NOT NULL,
    "DateTime" timestamp with time zone NOT NULL,
    "EventType" character varying NOT NULL,
    "EventName" character varying NOT NULL,
    "EventDesc" character varying,
    "EventLocName" character varying NOT NULL,
    "EventLocMap" jsonb DEFAULT '{}'::json NOT NULL,
    "EventAssistanceItems" character varying[] DEFAULT '{}'::character varying[],
    "EventStatus" character varying DEFAULT 'PENDING'::character varying,
    "Active" boolean DEFAULT true NOT NULL,
    "ThumbnailFileId" bigint,
    "TransferType" character varying,
    "TransferAccountNumber" character varying,
    "TransferAccountName" character varying,
    "DonationTargetAmount" numeric DEFAULT 0,
    "InProgress" boolean DEFAULT false,
    "DateTimeUpdate" timestamp with time zone
);
    DROP TABLE dbo."Events";
       dbo         heap    postgres    false    8            �            1259    16430    Events_EventId_seq    SEQUENCE     �   ALTER TABLE dbo."Events" ALTER COLUMN "EventId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Events_EventId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    223    8            �            1259    16431    Files    TABLE     �   CREATE TABLE dbo."Files" (
    "FileId" bigint NOT NULL,
    "FileName" text NOT NULL,
    "Url" text,
    "GUID" text NOT NULL
);
    DROP TABLE dbo."Files";
       dbo         heap    postgres    false    8            �            1259    16436    Files_FileId_seq    SEQUENCE     �   ALTER TABLE dbo."Files" ALTER COLUMN "FileId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Files_FileId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    8    225            �            1259    16437 
   Interested    TABLE     y   CREATE TABLE dbo."Interested" (
    "UserId" bigint NOT NULL,
    "EventId" bigint NOT NULL,
    "Id" bigint NOT NULL
);
    DROP TABLE dbo."Interested";
       dbo         heap    postgres    false    8            �            1259    17659    Interested_Id_seq    SEQUENCE     �   ALTER TABLE dbo."Interested" ALTER COLUMN "Id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Interested_Id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    227    8            �            1259    16440    Notifications    TABLE     �  CREATE TABLE dbo."Notifications" (
    "NotificationId" bigint NOT NULL,
    "Title" character varying NOT NULL,
    "Description" character varying NOT NULL,
    "Type" character varying NOT NULL,
    "ReferenceId" character varying NOT NULL,
    "IsRead" boolean DEFAULT false NOT NULL,
    "UserId" bigint,
    "Date" timestamp with time zone DEFAULT (now() AT TIME ZONE 'Asia/Manila'::text) NOT NULL,
    "Tags" character varying DEFAULT ''::character varying NOT NULL
);
     DROP TABLE dbo."Notifications";
       dbo         heap    postgres    false    8            �            1259    16448     Notifications_NotificationId_seq    SEQUENCE     �   ALTER TABLE dbo."Notifications" ALTER COLUMN "NotificationId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Notifications_NotificationId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    8    228            �            1259    16449 	   Responded    TABLE     x   CREATE TABLE dbo."Responded" (
    "UserId" bigint NOT NULL,
    "EventId" bigint NOT NULL,
    "Id" bigint NOT NULL
);
    DROP TABLE dbo."Responded";
       dbo         heap    postgres    false    8            �            1259    17665    Responded_Id_seq    SEQUENCE     �   ALTER TABLE dbo."Responded" ALTER COLUMN "Id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Responded_Id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    8    230            �            1259    16452    SupportTicket    TABLE       CREATE TABLE dbo."SupportTicket" (
    "SupportTicketId" bigint NOT NULL,
    "SupportTicketCode" character varying,
    "UserId" bigint NOT NULL,
    "Title" character varying NOT NULL,
    "Description" character varying NOT NULL,
    "DateTimeSent" timestamp with time zone,
    "Status" character varying DEFAULT 'PENDING'::character varying NOT NULL,
    "LastUpdated" timestamp with time zone,
    "Type" character varying NOT NULL,
    "Active" boolean DEFAULT true NOT NULL,
    "AssignedAdminUserId" bigint
);
     DROP TABLE dbo."SupportTicket";
       dbo         heap    postgres    false    8            �            1259    16459    SupportTicketMessage    TABLE     �  CREATE TABLE dbo."SupportTicketMessage" (
    "SupportTicketMessageId" bigint NOT NULL,
    "SupportTicketId" bigint NOT NULL,
    "FromUserId" bigint NOT NULL,
    "Message" character varying NOT NULL,
    "DateTimeSent" timestamp with time zone DEFAULT (now() AT TIME ZONE 'Asia/Manila'::text) NOT NULL,
    "Active" boolean DEFAULT true NOT NULL,
    "Status" character varying DEFAULT 'SENT'::character varying NOT NULL
);
 '   DROP TABLE dbo."SupportTicketMessage";
       dbo         heap    postgres    false    8            �            1259    16466 /   SupportTicketMessage_SupportTicketMessageId_seq    SEQUENCE       ALTER TABLE dbo."SupportTicketMessage" ALTER COLUMN "SupportTicketMessageId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."SupportTicketMessage_SupportTicketMessageId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    232    8            �            1259    16467 !   SupportTicket_SupportTicketId_seq    SEQUENCE     �   ALTER TABLE dbo."SupportTicket" ALTER COLUMN "SupportTicketId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."SupportTicket_SupportTicketId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    8    231            �            1259    16468    SystemConfig    TABLE     r   CREATE TABLE dbo."SystemConfig" (
    "Key" character varying NOT NULL,
    "Value" character varying NOT NULL
);
    DROP TABLE dbo."SystemConfig";
       dbo         heap    postgres    false    8            �            1259    16473    Transactions    TABLE     �  CREATE TABLE dbo."Transactions" (
    "TransactionId" bigint NOT NULL,
    "TransactionCode" character varying,
    "UserId" bigint NOT NULL,
    "EventId" bigint NOT NULL,
    "DateTime" timestamp with time zone DEFAULT (now() AT TIME ZONE 'Asia/Manila'::text) NOT NULL,
    "Amount" numeric DEFAULT 0 NOT NULL,
    "ReferenceCode" character varying DEFAULT ''::character varying NOT NULL,
    "PaymentType" character varying DEFAULT 'CASH'::character varying NOT NULL,
    "FromAccountNumber" character varying DEFAULT 'NA'::character varying NOT NULL,
    "FromAccountName" character varying DEFAULT 'NA'::character varying NOT NULL,
    "ToAccountNumber" character varying DEFAULT 'NA'::character varying NOT NULL,
    "ToAccountName" character varying DEFAULT 'NA'::character varying NOT NULL,
    "IsCompleted" boolean DEFAULT false NOT NULL,
    "Bank" character varying DEFAULT 'ONLINE'::character varying NOT NULL,
    "Status" character varying DEFAULT 'PENDING'::character varying NOT NULL
);
    DROP TABLE dbo."Transactions";
       dbo         heap    postgres    false    8            �            1259    16489    Transactions_TransactionId_seq    SEQUENCE     �   ALTER TABLE dbo."Transactions" ALTER COLUMN "TransactionId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Transactions_TransactionId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    8    236            �            1259    17406    UserConversation    TABLE       CREATE TABLE dbo."UserConversation" (
    "UserConversationId" bigint NOT NULL,
    "Title" character varying NOT NULL,
    "Description" character varying NOT NULL,
    "Active" boolean DEFAULT true NOT NULL,
    "Type" character varying NOT NULL,
    "ReferenceId" character varying NOT NULL,
    "Status" character varying DEFAULT 'SENT'::character varying NOT NULL,
    "FromUserId" bigint NOT NULL,
    "ToUserId" bigint NOT NULL,
    "DateTime" timestamp with time zone DEFAULT (now() AT TIME ZONE 'Asia/Manila'::text) NOT NULL
);
 #   DROP TABLE dbo."UserConversation";
       dbo         heap    postgres    false    8            �            1259    17419 '   UserConversation_UserConversationId_seq    SEQUENCE     �   ALTER TABLE dbo."UserConversation" ALTER COLUMN "UserConversationId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."UserConversation_UserConversationId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    8    242            �            1259    16490    UserOneSignalSubscription    TABLE     �   CREATE TABLE dbo."UserOneSignalSubscription" (
    "UserId" bigint NOT NULL,
    "SubscriptionID" character varying NOT NULL
);
 ,   DROP TABLE dbo."UserOneSignalSubscription";
       dbo         heap    postgres    false    8            �            1259    16495    UserProfilePic    TABLE     b   CREATE TABLE dbo."UserProfilePic" (
    "UserId" bigint NOT NULL,
    "FileId" bigint NOT NULL
);
 !   DROP TABLE dbo."UserProfilePic";
       dbo         heap    postgres    false    8            �            1259    16498    Users    TABLE     l  CREATE TABLE dbo."Users" (
    "UserId" bigint NOT NULL,
    "UserName" character varying NOT NULL,
    "Password" character varying NOT NULL,
    "AccessGranted" boolean NOT NULL,
    "AccessId" bigint,
    "Active" boolean DEFAULT true NOT NULL,
    "UserCode" character varying,
    "UserType" character varying NOT NULL,
    "Name" character varying DEFAULT ''::character varying NOT NULL,
    "Email" character varying NOT NULL,
    "CurrentLocation" json,
    "HelpNotifPreferences" character varying[],
    "CurrentOTP" character varying DEFAULT 0 NOT NULL,
    "IsVerifiedUser" boolean DEFAULT false NOT NULL
);
    DROP TABLE dbo."Users";
       dbo         heap    postgres    false    8            �            1259    16505    Users_UserId_seq    SEQUENCE     �   ALTER TABLE dbo."Users" ALTER COLUMN "UserId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Users_UserId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    240    8            �          0    16397    Access 
   TABLE DATA           Z   COPY dbo."Access" ("AccessId", "Name", "AccessPages", "Active", "AccessCode") FROM stdin;
    dbo          postgres    false    218   �       �          0    16405 
   EventImage 
   TABLE DATA           L   COPY dbo."EventImage" ("EventId", "FileId", "UserId", "Active") FROM stdin;
    dbo          postgres    false    220   ��       �          0    16409    EventMessage 
   TABLE DATA           �   COPY dbo."EventMessage" ("EventMessageId", "EventId", "FromUserId", "ToUserId", "Message", "DateTimeSent", "Status", "LastUpdated", "Active") FROM stdin;
    dbo          postgres    false    221   ��       �          0    16419    Events 
   TABLE DATA           O  COPY dbo."Events" ("EventId", "EventCode", "UserId", "DateTime", "EventType", "EventName", "EventDesc", "EventLocName", "EventLocMap", "EventAssistanceItems", "EventStatus", "Active", "ThumbnailFileId", "TransferType", "TransferAccountNumber", "TransferAccountName", "DonationTargetAmount", "InProgress", "DateTimeUpdate") FROM stdin;
    dbo          postgres    false    223   Ξ       �          0    16431    Files 
   TABLE DATA           C   COPY dbo."Files" ("FileId", "FileName", "Url", "GUID") FROM stdin;
    dbo          postgres    false    225   �       �          0    16437 
   Interested 
   TABLE DATA           >   COPY dbo."Interested" ("UserId", "EventId", "Id") FROM stdin;
    dbo          postgres    false    227   �       �          0    16440    Notifications 
   TABLE DATA           �   COPY dbo."Notifications" ("NotificationId", "Title", "Description", "Type", "ReferenceId", "IsRead", "UserId", "Date", "Tags") FROM stdin;
    dbo          postgres    false    228   %�       �          0    16449 	   Responded 
   TABLE DATA           =   COPY dbo."Responded" ("UserId", "EventId", "Id") FROM stdin;
    dbo          postgres    false    230   B�       �          0    16452    SupportTicket 
   TABLE DATA           �   COPY dbo."SupportTicket" ("SupportTicketId", "SupportTicketCode", "UserId", "Title", "Description", "DateTimeSent", "Status", "LastUpdated", "Type", "Active", "AssignedAdminUserId") FROM stdin;
    dbo          postgres    false    231   _�       �          0    16459    SupportTicketMessage 
   TABLE DATA           �   COPY dbo."SupportTicketMessage" ("SupportTicketMessageId", "SupportTicketId", "FromUserId", "Message", "DateTimeSent", "Active", "Status") FROM stdin;
    dbo          postgres    false    232   |�       �          0    16468    SystemConfig 
   TABLE DATA           5   COPY dbo."SystemConfig" ("Key", "Value") FROM stdin;
    dbo          postgres    false    235   ��       �          0    16473    Transactions 
   TABLE DATA             COPY dbo."Transactions" ("TransactionId", "TransactionCode", "UserId", "EventId", "DateTime", "Amount", "ReferenceCode", "PaymentType", "FromAccountNumber", "FromAccountName", "ToAccountNumber", "ToAccountName", "IsCompleted", "Bank", "Status") FROM stdin;
    dbo          postgres    false    236   �       �          0    17406    UserConversation 
   TABLE DATA           �   COPY dbo."UserConversation" ("UserConversationId", "Title", "Description", "Active", "Type", "ReferenceId", "Status", "FromUserId", "ToUserId", "DateTime") FROM stdin;
    dbo          postgres    false    242   �       �          0    16490    UserOneSignalSubscription 
   TABLE DATA           N   COPY dbo."UserOneSignalSubscription" ("UserId", "SubscriptionID") FROM stdin;
    dbo          postgres    false    238   �       �          0    16495    UserProfilePic 
   TABLE DATA           ;   COPY dbo."UserProfilePic" ("UserId", "FileId") FROM stdin;
    dbo          postgres    false    239   ;�       �          0    16498    Users 
   TABLE DATA           �   COPY dbo."Users" ("UserId", "UserName", "Password", "AccessGranted", "AccessId", "Active", "UserCode", "UserType", "Name", "Email", "CurrentLocation", "HelpNotifPreferences", "CurrentOTP", "IsVerifiedUser") FROM stdin;
    dbo          postgres    false    240   X�       �           0    0    Access_AccessId_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('dbo."Access_AccessId_seq"', 1, true);
          dbo          postgres    false    219            �           0    0    EventMessage_EventMessageId_seq    SEQUENCE SET     M   SELECT pg_catalog.setval('dbo."EventMessage_EventMessageId_seq"', 1, false);
          dbo          postgres    false    222            �           0    0    Events_EventId_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('dbo."Events_EventId_seq"', 1, false);
          dbo          postgres    false    224            �           0    0    Files_FileId_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('dbo."Files_FileId_seq"', 1, false);
          dbo          postgres    false    226            �           0    0    Interested_Id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('dbo."Interested_Id_seq"', 19, true);
          dbo          postgres    false    244            �           0    0     Notifications_NotificationId_seq    SEQUENCE SET     N   SELECT pg_catalog.setval('dbo."Notifications_NotificationId_seq"', 1, false);
          dbo          postgres    false    229            �           0    0    Responded_Id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('dbo."Responded_Id_seq"', 15, true);
          dbo          postgres    false    245            �           0    0 /   SupportTicketMessage_SupportTicketMessageId_seq    SEQUENCE SET     ]   SELECT pg_catalog.setval('dbo."SupportTicketMessage_SupportTicketMessageId_seq"', 1, false);
          dbo          postgres    false    233            �           0    0 !   SupportTicket_SupportTicketId_seq    SEQUENCE SET     O   SELECT pg_catalog.setval('dbo."SupportTicket_SupportTicketId_seq"', 1, false);
          dbo          postgres    false    234            �           0    0    Transactions_TransactionId_seq    SEQUENCE SET     L   SELECT pg_catalog.setval('dbo."Transactions_TransactionId_seq"', 1, false);
          dbo          postgres    false    237            �           0    0 '   UserConversation_UserConversationId_seq    SEQUENCE SET     U   SELECT pg_catalog.setval('dbo."UserConversation_UserConversationId_seq"', 1, false);
          dbo          postgres    false    243                        0    0    Users_UserId_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('dbo."Users_UserId_seq"', 1, true);
          dbo          postgres    false    241                       2606    16507    Access Access_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY dbo."Access"
    ADD CONSTRAINT "Access_pkey" PRIMARY KEY ("AccessId");
 =   ALTER TABLE ONLY dbo."Access" DROP CONSTRAINT "Access_pkey";
       dbo            postgres    false    218                       2606    16509    EventImage EventImage_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY dbo."EventImage"
    ADD CONSTRAINT "EventImage_pkey" PRIMARY KEY ("EventId", "FileId");
 E   ALTER TABLE ONLY dbo."EventImage" DROP CONSTRAINT "EventImage_pkey";
       dbo            postgres    false    220    220                       2606    16511    EventMessage EventMessage_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY dbo."EventMessage"
    ADD CONSTRAINT "EventMessage_pkey" PRIMARY KEY ("EventMessageId");
 I   ALTER TABLE ONLY dbo."EventMessage" DROP CONSTRAINT "EventMessage_pkey";
       dbo            postgres    false    221                       2606    16513    Events Event_pkey 
   CONSTRAINT     W   ALTER TABLE ONLY dbo."Events"
    ADD CONSTRAINT "Event_pkey" PRIMARY KEY ("EventId");
 <   ALTER TABLE ONLY dbo."Events" DROP CONSTRAINT "Event_pkey";
       dbo            postgres    false    223                       2606    17664    Interested Interested_pkey 
   CONSTRAINT     [   ALTER TABLE ONLY dbo."Interested"
    ADD CONSTRAINT "Interested_pkey" PRIMARY KEY ("Id");
 E   ALTER TABLE ONLY dbo."Interested" DROP CONSTRAINT "Interested_pkey";
       dbo            postgres    false    227                       2606    16515     Notifications Notifications_pkey 
   CONSTRAINT     m   ALTER TABLE ONLY dbo."Notifications"
    ADD CONSTRAINT "Notifications_pkey" PRIMARY KEY ("NotificationId");
 K   ALTER TABLE ONLY dbo."Notifications" DROP CONSTRAINT "Notifications_pkey";
       dbo            postgres    false    228                       2606    17670    Responded Responded_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY dbo."Responded"
    ADD CONSTRAINT "Responded_pkey" PRIMARY KEY ("Id");
 C   ALTER TABLE ONLY dbo."Responded" DROP CONSTRAINT "Responded_pkey";
       dbo            postgres    false    230                       2606    16521 .   SupportTicketMessage SupportTicketMessage_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY dbo."SupportTicketMessage"
    ADD CONSTRAINT "SupportTicketMessage_pkey" PRIMARY KEY ("SupportTicketMessageId");
 Y   ALTER TABLE ONLY dbo."SupportTicketMessage" DROP CONSTRAINT "SupportTicketMessage_pkey";
       dbo            postgres    false    232                       2606    16523     SupportTicket SupportTicket_pkey 
   CONSTRAINT     n   ALTER TABLE ONLY dbo."SupportTicket"
    ADD CONSTRAINT "SupportTicket_pkey" PRIMARY KEY ("SupportTicketId");
 K   ALTER TABLE ONLY dbo."SupportTicket" DROP CONSTRAINT "SupportTicket_pkey";
       dbo            postgres    false    231                       2606    16525    SystemConfig SystemConfig_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY dbo."SystemConfig"
    ADD CONSTRAINT "SystemConfig_pkey" PRIMARY KEY ("Key");
 I   ALTER TABLE ONLY dbo."SystemConfig" DROP CONSTRAINT "SystemConfig_pkey";
       dbo            postgres    false    235            !           2606    16527    Transactions Transactions_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY dbo."Transactions"
    ADD CONSTRAINT "Transactions_pkey" PRIMARY KEY ("TransactionId");
 I   ALTER TABLE ONLY dbo."Transactions" DROP CONSTRAINT "Transactions_pkey";
       dbo            postgres    false    236            *           2606    17413 &   UserConversation UserConversation_pkey 
   CONSTRAINT     w   ALTER TABLE ONLY dbo."UserConversation"
    ADD CONSTRAINT "UserConversation_pkey" PRIMARY KEY ("UserConversationId");
 Q   ALTER TABLE ONLY dbo."UserConversation" DROP CONSTRAINT "UserConversation_pkey";
       dbo            postgres    false    242            #           2606    16529 8   UserOneSignalSubscription UserOneSignalSubscription_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY dbo."UserOneSignalSubscription"
    ADD CONSTRAINT "UserOneSignalSubscription_pkey" PRIMARY KEY ("UserId", "SubscriptionID");
 c   ALTER TABLE ONLY dbo."UserOneSignalSubscription" DROP CONSTRAINT "UserOneSignalSubscription_pkey";
       dbo            postgres    false    238    238                       2606    16531    Files pk_files_901578250 
   CONSTRAINT     [   ALTER TABLE ONLY dbo."Files"
    ADD CONSTRAINT pk_files_901578250 PRIMARY KEY ("FileId");
 A   ALTER TABLE ONLY dbo."Files" DROP CONSTRAINT pk_files_901578250;
       dbo            postgres    false    225            %           2606    16533 -   UserProfilePic pk_userprofilepic_1_1525580473 
   CONSTRAINT     p   ALTER TABLE ONLY dbo."UserProfilePic"
    ADD CONSTRAINT pk_userprofilepic_1_1525580473 PRIMARY KEY ("UserId");
 V   ALTER TABLE ONLY dbo."UserProfilePic" DROP CONSTRAINT pk_userprofilepic_1_1525580473;
       dbo            postgres    false    239            '           2606    16535    Users pk_users_1557580587 
   CONSTRAINT     \   ALTER TABLE ONLY dbo."Users"
    ADD CONSTRAINT pk_users_1557580587 PRIMARY KEY ("UserId");
 B   ALTER TABLE ONLY dbo."Users" DROP CONSTRAINT pk_users_1557580587;
       dbo            postgres    false    240            (           1259    16536 
   u_username    INDEX     �   CREATE UNIQUE INDEX u_username ON dbo."Users" USING btree ("Active", "UserName", "UserType") WITH (deduplicate_items='false') WHERE ("Active" = true);
    DROP INDEX dbo.u_username;
       dbo            postgres    false    240    240    240    240            B           2606    17455 /   UserConversation UserConversation_FromUser_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."UserConversation"
    ADD CONSTRAINT "UserConversation_FromUser_fkey" FOREIGN KEY ("FromUserId") REFERENCES dbo."Users"("UserId") NOT VALID;
 Z   ALTER TABLE ONLY dbo."UserConversation" DROP CONSTRAINT "UserConversation_FromUser_fkey";
       dbo          postgres    false    4903    240    242            C           2606    17460 -   UserConversation UserConversation_ToUser_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."UserConversation"
    ADD CONSTRAINT "UserConversation_ToUser_fkey" FOREIGN KEY ("ToUserId") REFERENCES dbo."Users"("UserId") NOT VALID;
 X   ALTER TABLE ONLY dbo."UserConversation" DROP CONSTRAINT "UserConversation_ToUser_fkey";
       dbo          postgres    false    4903    242    240            +           2606    16537     EventImage fk_EventMessage_Event    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."EventImage"
    ADD CONSTRAINT "fk_EventMessage_Event" FOREIGN KEY ("EventId") REFERENCES dbo."Events"("EventId");
 K   ALTER TABLE ONLY dbo."EventImage" DROP CONSTRAINT "fk_EventMessage_Event";
       dbo          postgres    false    4881    223    220            .           2606    16542 "   EventMessage fk_EventMessage_Event    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."EventMessage"
    ADD CONSTRAINT "fk_EventMessage_Event" FOREIGN KEY ("EventId") REFERENCES dbo."Events"("EventId");
 M   ALTER TABLE ONLY dbo."EventMessage" DROP CONSTRAINT "fk_EventMessage_Event";
       dbo          postgres    false    223    221    4881            ,           2606    16547    EventImage fk_EventMessage_File    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."EventImage"
    ADD CONSTRAINT "fk_EventMessage_File" FOREIGN KEY ("FileId") REFERENCES dbo."Files"("FileId");
 J   ALTER TABLE ONLY dbo."EventImage" DROP CONSTRAINT "fk_EventMessage_File";
       dbo          postgres    false    4883    220    225            /           2606    16552 %   EventMessage fk_EventMessage_FromUser    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."EventMessage"
    ADD CONSTRAINT "fk_EventMessage_FromUser" FOREIGN KEY ("FromUserId") REFERENCES dbo."Users"("UserId");
 P   ALTER TABLE ONLY dbo."EventMessage" DROP CONSTRAINT "fk_EventMessage_FromUser";
       dbo          postgres    false    240    221    4903            0           2606    16557 #   EventMessage fk_EventMessage_ToUser    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."EventMessage"
    ADD CONSTRAINT "fk_EventMessage_ToUser" FOREIGN KEY ("ToUserId") REFERENCES dbo."Users"("UserId");
 N   ALTER TABLE ONLY dbo."EventMessage" DROP CONSTRAINT "fk_EventMessage_ToUser";
       dbo          postgres    false    221    4903    240            -           2606    16562    EventImage fk_EventMessage_User    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."EventImage"
    ADD CONSTRAINT "fk_EventMessage_User" FOREIGN KEY ("UserId") REFERENCES dbo."Users"("UserId");
 J   ALTER TABLE ONLY dbo."EventImage" DROP CONSTRAINT "fk_EventMessage_User";
       dbo          postgres    false    240    220    4903            1           2606    16567    Events fk_Event_ThumbnailFile    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Events"
    ADD CONSTRAINT "fk_Event_ThumbnailFile" FOREIGN KEY ("ThumbnailFileId") REFERENCES dbo."Files"("FileId") NOT VALID;
 H   ALTER TABLE ONLY dbo."Events" DROP CONSTRAINT "fk_Event_ThumbnailFile";
       dbo          postgres    false    4883    223    225            2           2606    16572    Events fk_Event_UserId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Events"
    ADD CONSTRAINT "fk_Event_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES dbo."Users"("UserId");
 F   ALTER TABLE ONLY dbo."Events" DROP CONSTRAINT "fk_Event_UserId_fkey";
       dbo          postgres    false    4903    223    240            3           2606    16577    Interested fk_Interested_Event    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Interested"
    ADD CONSTRAINT "fk_Interested_Event" FOREIGN KEY ("EventId") REFERENCES dbo."Events"("EventId");
 I   ALTER TABLE ONLY dbo."Interested" DROP CONSTRAINT "fk_Interested_Event";
       dbo          postgres    false    223    4881    227            4           2606    16582    Interested fk_Interested_User    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Interested"
    ADD CONSTRAINT "fk_Interested_User" FOREIGN KEY ("UserId") REFERENCES dbo."Users"("UserId");
 H   ALTER TABLE ONLY dbo."Interested" DROP CONSTRAINT "fk_Interested_User";
       dbo          postgres    false    4903    227    240            6           2606    16587    Responded fk_Responded_Event    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Responded"
    ADD CONSTRAINT "fk_Responded_Event" FOREIGN KEY ("EventId") REFERENCES dbo."Events"("EventId");
 G   ALTER TABLE ONLY dbo."Responded" DROP CONSTRAINT "fk_Responded_Event";
       dbo          postgres    false    230    4881    223            7           2606    16592    Responded fk_Responded_User    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Responded"
    ADD CONSTRAINT "fk_Responded_User" FOREIGN KEY ("UserId") REFERENCES dbo."Users"("UserId");
 F   ALTER TABLE ONLY dbo."Responded" DROP CONSTRAINT "fk_Responded_User";
       dbo          postgres    false    230    4903    240            :           2606    16597 2   SupportTicketMessage fk_SupportTicketMessage_Event    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."SupportTicketMessage"
    ADD CONSTRAINT "fk_SupportTicketMessage_Event" FOREIGN KEY ("SupportTicketId") REFERENCES dbo."SupportTicket"("SupportTicketId");
 ]   ALTER TABLE ONLY dbo."SupportTicketMessage" DROP CONSTRAINT "fk_SupportTicketMessage_Event";
       dbo          postgres    false    231    4891    232            ;           2606    16602 5   SupportTicketMessage fk_SupportTicketMessage_FromUser    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."SupportTicketMessage"
    ADD CONSTRAINT "fk_SupportTicketMessage_FromUser" FOREIGN KEY ("FromUserId") REFERENCES dbo."Users"("UserId");
 `   ALTER TABLE ONLY dbo."SupportTicketMessage" DROP CONSTRAINT "fk_SupportTicketMessage_FromUser";
       dbo          postgres    false    240    4903    232            8           2606    16607 2   SupportTicket fk_SupportTicket_AssignedAdminUserId    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."SupportTicket"
    ADD CONSTRAINT "fk_SupportTicket_AssignedAdminUserId" FOREIGN KEY ("AssignedAdminUserId") REFERENCES dbo."Users"("UserId") NOT VALID;
 ]   ALTER TABLE ONLY dbo."SupportTicket" DROP CONSTRAINT "fk_SupportTicket_AssignedAdminUserId";
       dbo          postgres    false    231    4903    240            9           2606    16612 #   SupportTicket fk_SupportTicket_User    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."SupportTicket"
    ADD CONSTRAINT "fk_SupportTicket_User" FOREIGN KEY ("UserId") REFERENCES dbo."Users"("UserId");
 N   ALTER TABLE ONLY dbo."SupportTicket" DROP CONSTRAINT "fk_SupportTicket_User";
       dbo          postgres    false    231    240    4903            <           2606    16617 !   Transactions fk_Transaction_Event    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Transactions"
    ADD CONSTRAINT "fk_Transaction_Event" FOREIGN KEY ("EventId") REFERENCES dbo."Events"("EventId");
 L   ALTER TABLE ONLY dbo."Transactions" DROP CONSTRAINT "fk_Transaction_Event";
       dbo          postgres    false    236    4881    223            =           2606    16622     Transactions fk_Transaction_User    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Transactions"
    ADD CONSTRAINT "fk_Transaction_User" FOREIGN KEY ("UserId") REFERENCES dbo."Users"("UserId");
 K   ALTER TABLE ONLY dbo."Transactions" DROP CONSTRAINT "fk_Transaction_User";
       dbo          postgres    false    236    240    4903            >           2606    16627 ;   UserOneSignalSubscription fk_UserOneSignalSubscription_User    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."UserOneSignalSubscription"
    ADD CONSTRAINT "fk_UserOneSignalSubscription_User" FOREIGN KEY ("UserId") REFERENCES dbo."Users"("UserId");
 f   ALTER TABLE ONLY dbo."UserOneSignalSubscription" DROP CONSTRAINT "fk_UserOneSignalSubscription_User";
       dbo          postgres    false    4903    238    240            A           2606    16632    Users fk_User_Access    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Users"
    ADD CONSTRAINT "fk_User_Access" FOREIGN KEY ("AccessId") REFERENCES dbo."Access"("AccessId") NOT VALID;
 ?   ALTER TABLE ONLY dbo."Users" DROP CONSTRAINT "fk_User_Access";
       dbo          postgres    false    4875    240    218            5           2606    16637 #   Notifications fk_notifications_user    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Notifications"
    ADD CONSTRAINT fk_notifications_user FOREIGN KEY ("UserId") REFERENCES dbo."Users"("UserId") NOT VALID;
 L   ALTER TABLE ONLY dbo."Notifications" DROP CONSTRAINT fk_notifications_user;
       dbo          postgres    false    4903    228    240            ?           2606    16642 0   UserProfilePic fk_userprofilepic_files_354100302    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."UserProfilePic"
    ADD CONSTRAINT fk_userprofilepic_files_354100302 FOREIGN KEY ("FileId") REFERENCES dbo."Files"("FileId");
 Y   ALTER TABLE ONLY dbo."UserProfilePic" DROP CONSTRAINT fk_userprofilepic_files_354100302;
       dbo          postgres    false    239    225    4883            @           2606    16647 &   UserProfilePic fk_userprofilepic_users    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."UserProfilePic"
    ADD CONSTRAINT fk_userprofilepic_users FOREIGN KEY ("UserId") REFERENCES dbo."Users"("UserId");
 O   ALTER TABLE ONLY dbo."UserProfilePic" DROP CONSTRAINT fk_userprofilepic_users;
       dbo          postgres    false    240    4903    239            �   �   x���1�0F��W47#���Ng��(msW0��߭qD��}ɽ�\�`���3�Q�E�O��L�d�-��F�h�=�g&�����3S�b7Y�ѥ��x����W�4���QG��uC�Ui���tUl臠Bk����}�<���/���      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �   ;   x�s	�s�	��wsr�v
�tv�w�prw�prv�qtw�44������ �m�      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �   {   x�3�LL����T1JR14P�)�3ήJKO��0Hs�rK1IM	u+�0�)5O���Huqq�-��v-t�J�+�H�,�4b0�tt����t�� &!68��&f��%��r����g	W� 0m&     