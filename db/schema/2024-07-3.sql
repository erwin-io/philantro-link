PGDMP     :    /                |            philantrolinkdb    15.4    15.4 ]    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    103038    philantrolinkdb    DATABASE     �   CREATE DATABASE philantrolinkdb WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE philantrolinkdb;
                postgres    false                        2615    103224    dbo    SCHEMA        CREATE SCHEMA dbo;
    DROP SCHEMA dbo;
                postgres    false            -           1255    103225    usp_reset() 	   PROCEDURE     w  CREATE PROCEDURE dbo.usp_reset()
    LANGUAGE plpgsql
    AS $_$
begin

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
		"MobileNumber",
		"Password", 
		"AccessGranted",
		"AccessId",
		"UserType",
		"Name")
	VALUES (
			'000001',
			'admin',
			'123456',
			'$2b$10$LqN3kzfgaYnP5PfDZFfT4edUFqh5Lu7amIxeDDDmu/KEqQFze.p8a',  
			true,
			1,
			'ADMIN',
			'Admin Admin');
	
END;
$_$;
     DROP PROCEDURE dbo.usp_reset();
       dbo          postgres    false    8            �            1259    103226    Access    TABLE     �   CREATE TABLE dbo."Access" (
    "AccessId" bigint NOT NULL,
    "Name" character varying NOT NULL,
    "AccessPages" jsonb DEFAULT '[]'::json NOT NULL,
    "Active" boolean DEFAULT true NOT NULL,
    "AccessCode" character varying
);
    DROP TABLE dbo."Access";
       dbo         heap    postgres    false    8            �            1259    103233    Access_AccessId_seq    SEQUENCE     �   ALTER TABLE dbo."Access" ALTER COLUMN "AccessId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Access_AccessId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    217    8            �            1259    103434 
   EventImage    TABLE     �   CREATE TABLE dbo."EventImage" (
    "EventId" bigint NOT NULL,
    "FileId" bigint NOT NULL,
    "UserId" bigint NOT NULL,
    "Active" boolean DEFAULT true NOT NULL
);
    DROP TABLE dbo."EventImage";
       dbo         heap    postgres    false    8            �            1259    103456    EventMessage    TABLE       CREATE TABLE dbo."EventMessage" (
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
       dbo         heap    postgres    false    8            �            1259    103455    EventMessage_EventMessageId_seq    SEQUENCE     �   ALTER TABLE dbo."EventMessage" ALTER COLUMN "EventMessageId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."EventMessage_EventMessageId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    232    8            �            1259    103418    Events    TABLE     M  CREATE TABLE dbo."Events" (
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
    "InProgress" boolean DEFAULT false
);
    DROP TABLE dbo."Events";
       dbo         heap    postgres    false    8            �            1259    103417    Events_EventId_seq    SEQUENCE     �   ALTER TABLE dbo."Events" ALTER COLUMN "EventId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Events_EventId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    8    229            �            1259    103263    Files    TABLE     �   CREATE TABLE dbo."Files" (
    "FileId" bigint NOT NULL,
    "FileName" text NOT NULL,
    "Url" text,
    "GUID" text NOT NULL
);
    DROP TABLE dbo."Files";
       dbo         heap    postgres    false    8            �            1259    103268    Files_FileId_seq    SEQUENCE     �   ALTER TABLE dbo."Files" ALTER COLUMN "FileId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Files_FileId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    219    8            �            1259    103633 
   Interested    TABLE     _   CREATE TABLE dbo."Interested" (
    "UserId" bigint NOT NULL,
    "EventId" bigint NOT NULL
);
    DROP TABLE dbo."Interested";
       dbo         heap    postgres    false    8            �            1259    103269    Notifications    TABLE     �  CREATE TABLE dbo."Notifications" (
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
       dbo         heap    postgres    false    8            �            1259    103276     Notifications_NotificationId_seq    SEQUENCE     �   ALTER TABLE dbo."Notifications" ALTER COLUMN "NotificationId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Notifications_NotificationId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    221    8            �            1259    103648 	   Responded    TABLE     ^   CREATE TABLE dbo."Responded" (
    "UserId" bigint NOT NULL,
    "EventId" bigint NOT NULL
);
    DROP TABLE dbo."Responded";
       dbo         heap    postgres    false    8            �            1259    111885    SupportTicket    TABLE       CREATE TABLE dbo."SupportTicket" (
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
       dbo         heap    postgres    false    8            �            1259    111911    SupportTicketMessage    TABLE     `  CREATE TABLE dbo."SupportTicketMessage" (
    "SupportTicketMessageId" bigint NOT NULL,
    "SupportTicketId" bigint NOT NULL,
    "FromUserId" bigint NOT NULL,
    "Message" character varying NOT NULL,
    "DateTimeSent" timestamp with time zone DEFAULT (now() AT TIME ZONE 'Asia/Manila'::text) NOT NULL,
    "Active" boolean DEFAULT true NOT NULL
);
 '   DROP TABLE dbo."SupportTicketMessage";
       dbo         heap    postgres    false    8            �            1259    111910 /   SupportTicketMessage_SupportTicketMessageId_seq    SEQUENCE       ALTER TABLE dbo."SupportTicketMessage" ALTER COLUMN "SupportTicketMessageId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."SupportTicketMessage_SupportTicketMessageId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    8    240            �            1259    111884 !   SupportTicket_SupportTicketId_seq    SEQUENCE     �   ALTER TABLE dbo."SupportTicket" ALTER COLUMN "SupportTicketId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."SupportTicket_SupportTicketId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    238    8            �            1259    103284    SystemConfig    TABLE     r   CREATE TABLE dbo."SystemConfig" (
    "Key" character varying NOT NULL,
    "Value" character varying NOT NULL
);
    DROP TABLE dbo."SystemConfig";
       dbo         heap    postgres    false    8            �            1259    103483    Transactions    TABLE     �  CREATE TABLE dbo."Transactions" (
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
       dbo         heap    postgres    false    8            �            1259    103482    Transactions_TransactionId_seq    SEQUENCE     �   ALTER TABLE dbo."Transactions" ALTER COLUMN "TransactionId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Transactions_TransactionId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    234    8            �            1259    103289    UserOneSignalSubscription    TABLE     �   CREATE TABLE dbo."UserOneSignalSubscription" (
    "UserId" bigint NOT NULL,
    "SubscriptionID" character varying NOT NULL
);
 ,   DROP TABLE dbo."UserOneSignalSubscription";
       dbo         heap    postgres    false    8            �            1259    103294    UserProfilePic    TABLE     b   CREATE TABLE dbo."UserProfilePic" (
    "UserId" bigint NOT NULL,
    "FileId" bigint NOT NULL
);
 !   DROP TABLE dbo."UserProfilePic";
       dbo         heap    postgres    false    8            �            1259    103297    Users    TABLE       CREATE TABLE dbo."Users" (
    "UserId" bigint NOT NULL,
    "UserName" character varying NOT NULL,
    "Password" character varying NOT NULL,
    "AccessGranted" boolean NOT NULL,
    "AccessId" bigint,
    "Active" boolean DEFAULT true NOT NULL,
    "UserCode" character varying,
    "UserType" character varying NOT NULL,
    "Name" character varying DEFAULT ''::character varying NOT NULL,
    "MobileNumber" character varying NOT NULL,
    "CurrentLocation" json,
    "AssistanceType" character varying[]
);
    DROP TABLE dbo."Users";
       dbo         heap    postgres    false    8            �            1259    103303    Users_UserId_seq    SEQUENCE     �   ALTER TABLE dbo."Users" ALTER COLUMN "UserId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Users_UserId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    226    8            �          0    103226    Access 
   TABLE DATA           Z   COPY dbo."Access" ("AccessId", "Name", "AccessPages", "Active", "AccessCode") FROM stdin;
    dbo          postgres    false    217   ��       �          0    103434 
   EventImage 
   TABLE DATA           L   COPY dbo."EventImage" ("EventId", "FileId", "UserId", "Active") FROM stdin;
    dbo          postgres    false    230   G�       �          0    103456    EventMessage 
   TABLE DATA           �   COPY dbo."EventMessage" ("EventMessageId", "EventId", "FromUserId", "ToUserId", "Message", "DateTimeSent", "Status", "LastUpdated", "Active") FROM stdin;
    dbo          postgres    false    232   d�       �          0    103418    Events 
   TABLE DATA           =  COPY dbo."Events" ("EventId", "EventCode", "UserId", "DateTime", "EventType", "EventName", "EventDesc", "EventLocName", "EventLocMap", "EventAssistanceItems", "EventStatus", "Active", "ThumbnailFileId", "TransferType", "TransferAccountNumber", "TransferAccountName", "DonationTargetAmount", "InProgress") FROM stdin;
    dbo          postgres    false    229   ��       �          0    103263    Files 
   TABLE DATA           C   COPY dbo."Files" ("FileId", "FileName", "Url", "GUID") FROM stdin;
    dbo          postgres    false    219   ��       �          0    103633 
   Interested 
   TABLE DATA           8   COPY dbo."Interested" ("UserId", "EventId") FROM stdin;
    dbo          postgres    false    235   ��       �          0    103269    Notifications 
   TABLE DATA           �   COPY dbo."Notifications" ("NotificationId", "Title", "Description", "Type", "ReferenceId", "IsRead", "UserId", "Date", "Tags") FROM stdin;
    dbo          postgres    false    221   ،       �          0    103648 	   Responded 
   TABLE DATA           7   COPY dbo."Responded" ("UserId", "EventId") FROM stdin;
    dbo          postgres    false    236   ��       �          0    111885    SupportTicket 
   TABLE DATA           �   COPY dbo."SupportTicket" ("SupportTicketId", "SupportTicketCode", "UserId", "Title", "Description", "DateTimeSent", "Status", "LastUpdated", "Type", "Active", "AssignedAdminUserId") FROM stdin;
    dbo          postgres    false    238   �       �          0    111911    SupportTicketMessage 
   TABLE DATA           �   COPY dbo."SupportTicketMessage" ("SupportTicketMessageId", "SupportTicketId", "FromUserId", "Message", "DateTimeSent", "Active") FROM stdin;
    dbo          postgres    false    240   /�       �          0    103284    SystemConfig 
   TABLE DATA           5   COPY dbo."SystemConfig" ("Key", "Value") FROM stdin;
    dbo          postgres    false    223   L�       �          0    103483    Transactions 
   TABLE DATA             COPY dbo."Transactions" ("TransactionId", "TransactionCode", "UserId", "EventId", "DateTime", "Amount", "ReferenceCode", "PaymentType", "FromAccountNumber", "FromAccountName", "ToAccountNumber", "ToAccountName", "IsCompleted", "Bank", "Status") FROM stdin;
    dbo          postgres    false    234   ��       �          0    103289    UserOneSignalSubscription 
   TABLE DATA           N   COPY dbo."UserOneSignalSubscription" ("UserId", "SubscriptionID") FROM stdin;
    dbo          postgres    false    224   ��       �          0    103294    UserProfilePic 
   TABLE DATA           ;   COPY dbo."UserProfilePic" ("UserId", "FileId") FROM stdin;
    dbo          postgres    false    225   э       �          0    103297    Users 
   TABLE DATA           �   COPY dbo."Users" ("UserId", "UserName", "Password", "AccessGranted", "AccessId", "Active", "UserCode", "UserType", "Name", "MobileNumber", "CurrentLocation", "AssistanceType") FROM stdin;
    dbo          postgres    false    226   �       �           0    0    Access_AccessId_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('dbo."Access_AccessId_seq"', 1, true);
          dbo          postgres    false    218            �           0    0    EventMessage_EventMessageId_seq    SEQUENCE SET     M   SELECT pg_catalog.setval('dbo."EventMessage_EventMessageId_seq"', 1, false);
          dbo          postgres    false    231            �           0    0    Events_EventId_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('dbo."Events_EventId_seq"', 1, false);
          dbo          postgres    false    228            �           0    0    Files_FileId_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('dbo."Files_FileId_seq"', 1, false);
          dbo          postgres    false    220            �           0    0     Notifications_NotificationId_seq    SEQUENCE SET     N   SELECT pg_catalog.setval('dbo."Notifications_NotificationId_seq"', 1, false);
          dbo          postgres    false    222            �           0    0 /   SupportTicketMessage_SupportTicketMessageId_seq    SEQUENCE SET     ]   SELECT pg_catalog.setval('dbo."SupportTicketMessage_SupportTicketMessageId_seq"', 1, false);
          dbo          postgres    false    239            �           0    0 !   SupportTicket_SupportTicketId_seq    SEQUENCE SET     O   SELECT pg_catalog.setval('dbo."SupportTicket_SupportTicketId_seq"', 1, false);
          dbo          postgres    false    237            �           0    0    Transactions_TransactionId_seq    SEQUENCE SET     L   SELECT pg_catalog.setval('dbo."Transactions_TransactionId_seq"', 1, false);
          dbo          postgres    false    233            �           0    0    Users_UserId_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('dbo."Users_UserId_seq"', 1, true);
          dbo          postgres    false    227                       2606    103313    Access Access_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY dbo."Access"
    ADD CONSTRAINT "Access_pkey" PRIMARY KEY ("AccessId");
 =   ALTER TABLE ONLY dbo."Access" DROP CONSTRAINT "Access_pkey";
       dbo            postgres    false    217            $           2606    103439    EventImage EventImage_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY dbo."EventImage"
    ADD CONSTRAINT "EventImage_pkey" PRIMARY KEY ("EventId", "FileId");
 E   ALTER TABLE ONLY dbo."EventImage" DROP CONSTRAINT "EventImage_pkey";
       dbo            postgres    false    230    230            &           2606    103466    EventMessage EventMessage_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY dbo."EventMessage"
    ADD CONSTRAINT "EventMessage_pkey" PRIMARY KEY ("EventMessageId");
 I   ALTER TABLE ONLY dbo."EventMessage" DROP CONSTRAINT "EventMessage_pkey";
       dbo            postgres    false    232            "           2606    103428    Events Event_pkey 
   CONSTRAINT     W   ALTER TABLE ONLY dbo."Events"
    ADD CONSTRAINT "Event_pkey" PRIMARY KEY ("EventId");
 <   ALTER TABLE ONLY dbo."Events" DROP CONSTRAINT "Event_pkey";
       dbo            postgres    false    229                       2606    103321     Notifications Notifications_pkey 
   CONSTRAINT     m   ALTER TABLE ONLY dbo."Notifications"
    ADD CONSTRAINT "Notifications_pkey" PRIMARY KEY ("NotificationId");
 K   ALTER TABLE ONLY dbo."Notifications" DROP CONSTRAINT "Notifications_pkey";
       dbo            postgres    false    221            *           2606    103637    Interested Ratings_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY dbo."Interested"
    ADD CONSTRAINT "Ratings_pkey" PRIMARY KEY ("UserId");
 B   ALTER TABLE ONLY dbo."Interested" DROP CONSTRAINT "Ratings_pkey";
       dbo            postgres    false    235            ,           2606    103652    Responded Responded_pkey 
   CONSTRAINT     ]   ALTER TABLE ONLY dbo."Responded"
    ADD CONSTRAINT "Responded_pkey" PRIMARY KEY ("UserId");
 C   ALTER TABLE ONLY dbo."Responded" DROP CONSTRAINT "Responded_pkey";
       dbo            postgres    false    236            0           2606    111919 .   SupportTicketMessage SupportTicketMessage_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY dbo."SupportTicketMessage"
    ADD CONSTRAINT "SupportTicketMessage_pkey" PRIMARY KEY ("SupportTicketMessageId");
 Y   ALTER TABLE ONLY dbo."SupportTicketMessage" DROP CONSTRAINT "SupportTicketMessage_pkey";
       dbo            postgres    false    240            .           2606    111893     SupportTicket SupportTicket_pkey 
   CONSTRAINT     n   ALTER TABLE ONLY dbo."SupportTicket"
    ADD CONSTRAINT "SupportTicket_pkey" PRIMARY KEY ("SupportTicketId");
 K   ALTER TABLE ONLY dbo."SupportTicket" DROP CONSTRAINT "SupportTicket_pkey";
       dbo            postgres    false    238                       2606    103325    SystemConfig SystemConfig_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY dbo."SystemConfig"
    ADD CONSTRAINT "SystemConfig_pkey" PRIMARY KEY ("Key");
 I   ALTER TABLE ONLY dbo."SystemConfig" DROP CONSTRAINT "SystemConfig_pkey";
       dbo            postgres    false    223            (           2606    103498    Transactions Transactions_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY dbo."Transactions"
    ADD CONSTRAINT "Transactions_pkey" PRIMARY KEY ("TransactionId");
 I   ALTER TABLE ONLY dbo."Transactions" DROP CONSTRAINT "Transactions_pkey";
       dbo            postgres    false    234                       2606    103327 8   UserOneSignalSubscription UserOneSignalSubscription_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY dbo."UserOneSignalSubscription"
    ADD CONSTRAINT "UserOneSignalSubscription_pkey" PRIMARY KEY ("UserId", "SubscriptionID");
 c   ALTER TABLE ONLY dbo."UserOneSignalSubscription" DROP CONSTRAINT "UserOneSignalSubscription_pkey";
       dbo            postgres    false    224    224                       2606    103331    Files pk_files_901578250 
   CONSTRAINT     [   ALTER TABLE ONLY dbo."Files"
    ADD CONSTRAINT pk_files_901578250 PRIMARY KEY ("FileId");
 A   ALTER TABLE ONLY dbo."Files" DROP CONSTRAINT pk_files_901578250;
       dbo            postgres    false    219                       2606    103333 -   UserProfilePic pk_userprofilepic_1_1525580473 
   CONSTRAINT     p   ALTER TABLE ONLY dbo."UserProfilePic"
    ADD CONSTRAINT pk_userprofilepic_1_1525580473 PRIMARY KEY ("UserId");
 V   ALTER TABLE ONLY dbo."UserProfilePic" DROP CONSTRAINT pk_userprofilepic_1_1525580473;
       dbo            postgres    false    225                       2606    103335    Users pk_users_1557580587 
   CONSTRAINT     \   ALTER TABLE ONLY dbo."Users"
    ADD CONSTRAINT pk_users_1557580587 PRIMARY KEY ("UserId");
 B   ALTER TABLE ONLY dbo."Users" DROP CONSTRAINT pk_users_1557580587;
       dbo            postgres    false    226                        1259    103345 
   u_username    INDEX     �   CREATE UNIQUE INDEX u_username ON dbo."Users" USING btree ("Active", "UserName", "UserType") WITH (deduplicate_items='false') WHERE ("Active" = true);
    DROP INDEX dbo.u_username;
       dbo            postgres    false    226    226    226    226            8           2606    103440     EventImage fk_EventMessage_Event    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."EventImage"
    ADD CONSTRAINT "fk_EventMessage_Event" FOREIGN KEY ("EventId") REFERENCES dbo."Events"("EventId");
 K   ALTER TABLE ONLY dbo."EventImage" DROP CONSTRAINT "fk_EventMessage_Event";
       dbo          postgres    false    230    3362    229            ;           2606    103467 "   EventMessage fk_EventMessage_Event    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."EventMessage"
    ADD CONSTRAINT "fk_EventMessage_Event" FOREIGN KEY ("EventId") REFERENCES dbo."Events"("EventId");
 M   ALTER TABLE ONLY dbo."EventMessage" DROP CONSTRAINT "fk_EventMessage_Event";
       dbo          postgres    false    229    3362    232            9           2606    103445    EventImage fk_EventMessage_File    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."EventImage"
    ADD CONSTRAINT "fk_EventMessage_File" FOREIGN KEY ("FileId") REFERENCES dbo."Files"("FileId");
 J   ALTER TABLE ONLY dbo."EventImage" DROP CONSTRAINT "fk_EventMessage_File";
       dbo          postgres    false    219    3349    230            <           2606    103472 %   EventMessage fk_EventMessage_FromUser    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."EventMessage"
    ADD CONSTRAINT "fk_EventMessage_FromUser" FOREIGN KEY ("FromUserId") REFERENCES dbo."Users"("UserId");
 P   ALTER TABLE ONLY dbo."EventMessage" DROP CONSTRAINT "fk_EventMessage_FromUser";
       dbo          postgres    false    3359    232    226            =           2606    103477 #   EventMessage fk_EventMessage_ToUser    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."EventMessage"
    ADD CONSTRAINT "fk_EventMessage_ToUser" FOREIGN KEY ("ToUserId") REFERENCES dbo."Users"("UserId");
 N   ALTER TABLE ONLY dbo."EventMessage" DROP CONSTRAINT "fk_EventMessage_ToUser";
       dbo          postgres    false    232    226    3359            :           2606    103450    EventImage fk_EventMessage_User    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."EventImage"
    ADD CONSTRAINT "fk_EventMessage_User" FOREIGN KEY ("UserId") REFERENCES dbo."Users"("UserId");
 J   ALTER TABLE ONLY dbo."EventImage" DROP CONSTRAINT "fk_EventMessage_User";
       dbo          postgres    false    3359    230    226            6           2606    103663    Events fk_Event_ThumbnailFile    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Events"
    ADD CONSTRAINT "fk_Event_ThumbnailFile" FOREIGN KEY ("ThumbnailFileId") REFERENCES dbo."Files"("FileId") NOT VALID;
 H   ALTER TABLE ONLY dbo."Events" DROP CONSTRAINT "fk_Event_ThumbnailFile";
       dbo          postgres    false    219    3349    229            7           2606    103429    Events fk_Event_UserId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Events"
    ADD CONSTRAINT "fk_Event_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES dbo."Users"("UserId");
 F   ALTER TABLE ONLY dbo."Events" DROP CONSTRAINT "fk_Event_UserId_fkey";
       dbo          postgres    false    226    229    3359            @           2606    103643    Interested fk_Interested_Event    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Interested"
    ADD CONSTRAINT "fk_Interested_Event" FOREIGN KEY ("EventId") REFERENCES dbo."Events"("EventId");
 I   ALTER TABLE ONLY dbo."Interested" DROP CONSTRAINT "fk_Interested_Event";
       dbo          postgres    false    3362    229    235            A           2606    103638    Interested fk_Interested_User    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Interested"
    ADD CONSTRAINT "fk_Interested_User" FOREIGN KEY ("UserId") REFERENCES dbo."Users"("UserId");
 H   ALTER TABLE ONLY dbo."Interested" DROP CONSTRAINT "fk_Interested_User";
       dbo          postgres    false    3359    226    235            B           2606    103658    Responded fk_Responded_Event    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Responded"
    ADD CONSTRAINT "fk_Responded_Event" FOREIGN KEY ("EventId") REFERENCES dbo."Events"("EventId");
 G   ALTER TABLE ONLY dbo."Responded" DROP CONSTRAINT "fk_Responded_Event";
       dbo          postgres    false    3362    229    236            C           2606    103653    Responded fk_Responded_User    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Responded"
    ADD CONSTRAINT "fk_Responded_User" FOREIGN KEY ("UserId") REFERENCES dbo."Users"("UserId");
 F   ALTER TABLE ONLY dbo."Responded" DROP CONSTRAINT "fk_Responded_User";
       dbo          postgres    false    226    3359    236            F           2606    111920 2   SupportTicketMessage fk_SupportTicketMessage_Event    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."SupportTicketMessage"
    ADD CONSTRAINT "fk_SupportTicketMessage_Event" FOREIGN KEY ("SupportTicketId") REFERENCES dbo."SupportTicket"("SupportTicketId");
 ]   ALTER TABLE ONLY dbo."SupportTicketMessage" DROP CONSTRAINT "fk_SupportTicketMessage_Event";
       dbo          postgres    false    3374    240    238            G           2606    111925 5   SupportTicketMessage fk_SupportTicketMessage_FromUser    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."SupportTicketMessage"
    ADD CONSTRAINT "fk_SupportTicketMessage_FromUser" FOREIGN KEY ("FromUserId") REFERENCES dbo."Users"("UserId");
 `   ALTER TABLE ONLY dbo."SupportTicketMessage" DROP CONSTRAINT "fk_SupportTicketMessage_FromUser";
       dbo          postgres    false    3359    240    226            D           2606    112057 2   SupportTicket fk_SupportTicket_AssignedAdminUserId    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."SupportTicket"
    ADD CONSTRAINT "fk_SupportTicket_AssignedAdminUserId" FOREIGN KEY ("AssignedAdminUserId") REFERENCES dbo."Users"("UserId") NOT VALID;
 ]   ALTER TABLE ONLY dbo."SupportTicket" DROP CONSTRAINT "fk_SupportTicket_AssignedAdminUserId";
       dbo          postgres    false    226    238    3359            E           2606    111894 #   SupportTicket fk_SupportTicket_User    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."SupportTicket"
    ADD CONSTRAINT "fk_SupportTicket_User" FOREIGN KEY ("UserId") REFERENCES dbo."Users"("UserId");
 N   ALTER TABLE ONLY dbo."SupportTicket" DROP CONSTRAINT "fk_SupportTicket_User";
       dbo          postgres    false    3359    226    238            >           2606    103504 !   Transactions fk_Transaction_Event    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Transactions"
    ADD CONSTRAINT "fk_Transaction_Event" FOREIGN KEY ("EventId") REFERENCES dbo."Events"("EventId");
 L   ALTER TABLE ONLY dbo."Transactions" DROP CONSTRAINT "fk_Transaction_Event";
       dbo          postgres    false    234    229    3362            ?           2606    103499     Transactions fk_Transaction_User    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Transactions"
    ADD CONSTRAINT "fk_Transaction_User" FOREIGN KEY ("UserId") REFERENCES dbo."Users"("UserId");
 K   ALTER TABLE ONLY dbo."Transactions" DROP CONSTRAINT "fk_Transaction_User";
       dbo          postgres    false    3359    234    226            2           2606    103376 ;   UserOneSignalSubscription fk_UserOneSignalSubscription_User    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."UserOneSignalSubscription"
    ADD CONSTRAINT "fk_UserOneSignalSubscription_User" FOREIGN KEY ("UserId") REFERENCES dbo."Users"("UserId");
 f   ALTER TABLE ONLY dbo."UserOneSignalSubscription" DROP CONSTRAINT "fk_UserOneSignalSubscription_User";
       dbo          postgres    false    224    3359    226            5           2606    103381    Users fk_User_Access    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Users"
    ADD CONSTRAINT "fk_User_Access" FOREIGN KEY ("AccessId") REFERENCES dbo."Access"("AccessId") NOT VALID;
 ?   ALTER TABLE ONLY dbo."Users" DROP CONSTRAINT "fk_User_Access";
       dbo          postgres    false    217    3347    226            1           2606    103396 #   Notifications fk_notifications_user    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Notifications"
    ADD CONSTRAINT fk_notifications_user FOREIGN KEY ("UserId") REFERENCES dbo."Users"("UserId") NOT VALID;
 L   ALTER TABLE ONLY dbo."Notifications" DROP CONSTRAINT fk_notifications_user;
       dbo          postgres    false    226    221    3359            3           2606    103401 0   UserProfilePic fk_userprofilepic_files_354100302    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."UserProfilePic"
    ADD CONSTRAINT fk_userprofilepic_files_354100302 FOREIGN KEY ("FileId") REFERENCES dbo."Files"("FileId");
 Y   ALTER TABLE ONLY dbo."UserProfilePic" DROP CONSTRAINT fk_userprofilepic_files_354100302;
       dbo          postgres    false    3349    219    225            4           2606    103406 &   UserProfilePic fk_userprofilepic_users    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."UserProfilePic"
    ADD CONSTRAINT fk_userprofilepic_users FOREIGN KEY ("UserId") REFERENCES dbo."Users"("UserId");
 O   ALTER TABLE ONLY dbo."UserProfilePic" DROP CONSTRAINT fk_userprofilepic_users;
       dbo          postgres    false    225    3359    226            �   �   x����
�0E��+���-���N��3�m�&��ߍSq���\���
m'D�������-�x�HŻ{-3�\�)Zy�L~3W��W�fŮ��Y�1Ԃ�x@�D������h����udG̵1��{����V�VR�7OUrq      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �   ;   x�s	�s�	��wsr�v
�tv�w�prw�prv�qtw�44������ �m�      �      x������ � �      �      x������ � �      �      x������ � �      �   s   x�3�LL����T1JR14P�)�3ήJKO��0Hs�rK1IM	u+�0�)5O���Huqq�-��v-t�J�+�H�,�4b0�tt����t�� &9��ML�8c���+F��� -} �     