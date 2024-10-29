test@sub.com
Testsub@1

# Todo
mobile no --> allow number only --> 10 to 12 digits only

# Create Querry

CREATE TABLE [dbo].[Sazs_Subscribers](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[SubscriberId] [varchar](20) NOT NULL PRIMARY KEY,
	[SubscriberName] [varchar](30) NOT NULL,
	[SubscriberCode] [varchar](10) NOT NULL UNIQUE,
	[Logo] [varchar](50) NULL,
	[GstNo] [varchar](30) NOT NULL,
	[PointOfContact] [varchar](30) NOT NULL,
	[StartDate] [datetime] NULL,
	[EndDate] [datetime] NULL,
	[CreatedBy] [varchar](20) NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[ModifiedBy] [varchar](20) NULL,
	[ModifiedOn] [datetime] NULL,
	[IsActive] [bit] NOT NULL,
)

CREATE TABLE [dbo].[Sazs_AppLogin](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [varchar](40) NOT NULL PRIMARY KEY,
	[SubscriberId] [varchar](20) NOT NULL FOREIGN KEY REFERENCES dbo.Sazs_Subscribers(SubscriberId),
	[UserName] [varchar](30) NOT NULL UNIQUE,
	[Roll] [bit] NOT NULL,
	[Password] [nvarchar](100) NULL,
	[DisplayName] [varchar](30) NOT NULL,
  [MobileNo] [varchar](12) NOT NULL UNIQUE,
	[Email] [varchar](30) NOT NULL UNIQUE,
	[Address1] [varchar](100) NULL,
	[Address2] [varchar](100) NULL,
	[LandMark] [varchar](50) NULL,
	[CityId] [varchar](20) NOT NULL  FOREIGN KEY REFERENCES dbo.Sazs_Adm_U_CityMaster(CityId),
	[ImageUrl] [varchar](30) NULL,
	[CreatedBy] [varchar](20) NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[ModifiedBy] [varchar](20) NULL,
	[ModifiedOn] [datetime] NULL,
	[IsActive] [bit] NOT NULL,
	[LastLogin] [datetime] NULL,
)

CREATE TABLE [dbo].[Sazs_Branches](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[BranchId] [varchar](30) NOT NULL PRIMARY KEY,
	[SubscriberId] [varchar](20) NOT NULL FOREIGN KEY REFERENCES dbo.Sazs_Subscribers(SubscriberId),
	[BranchName] [varchar](30) NOT NULL,
	[Address1] [varchar](100) NULL,
	[Address2] [varchar](100) NULL,
	[LandMark] [varchar](50) NULL,
	[CityId] [varchar](20) NOT NULL  FOREIGN KEY REFERENCES dbo.Sazs_Adm_U_CityMaster(CityId),
	[GstNo] [varchar](30) NOT NULL,
	[MobileNo] [varchar](12) NOT NULL UNIQUE,
	[LanLineNo] [varchar](12) NULL,
	[CreatedBy] [varchar](20) NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[ModifiedBy] [varchar](20) NULL,
	[ModifiedOn] [datetime] NULL,
	[IsActive] [bit] NOT NULL,
)

# menu

CREATE TABLE [dbo].[Sazs_Menus](
[Id] [int] IDENTITY(1,1) NOT NULL,
MenuId [VARCHAR](30) NOT NULL PRIMARY KEY,
MenuName [VARCHAR](30) NOT NULL UNIQUE,
Path [VARCHAR](20) NOT NULL,
Icon [VARCHAR](20) NOT NULL,
[CreatedBy] [VARCHAR](20) NOT NULL,
[CreatedOn] [datetime] NOT NULL,
[ModifiedBy] [VARCHAR](20) NULL,
[ModifiedOn] [datetime] NULL,
[IsActive] [bit] NOT NULL,
)

# submenu

--> add the query to restrict same menuId and subMenuName

CREATE TABLE [dbo].[Sazs_SubMenus](
[Id] [int] IDENTITY(1,1) NOT NULL,
SubMenuId [VARCHAR](30) NOT NULL PRIMARY KEY,
MenuId [VARCHAR](30) NOT NULL FOREIGN KEY REFERENCES dbo.Sazs_SubMenus(MenuId),
SubMenuName [VARCHAR](30) NOT NULL UNIQUE,
Path [VARCHAR](20) NOT NULL,
Icon [VARCHAR](20) NOT NULL,
[CreatedBy] [VARCHAR](20) NOT NULL,
[CreatedOn] [datetime] NOT NULL,
[ModifiedBy] [VARCHAR](20) NULL,
[ModifiedOn] [datetime] NULL,
[IsActive] [bit] NOT NULL,
)

# Usermapping (for menus)

--> add the query to restrict same userId, menuId and subMenuName or same menuId, userId if submenu empty for both

CREATE TABLE [dbo].[Sazs_UserMenuMapping](
  [Id] [int] IDENTITY(1,1) NOT NULL,
  UserMenuMapId [VARCHAR](30) NOT NULL PRIMARY KEY,
  UserId [VARCHAR](40) NOT NULL FOREIGN KEY REFERENCES dbo.Sazs_AppLogin(UserId),
  MenuId [VARCHAR](30) NOT NULL FOREIGN KEY REFERENCES dbo.Sazs_Menus(MenuId),
  SubMenuId [VARCHAR](30) NULL FOREIGN KEY REFERENCES dbo.Sazs_SubMenus(SubMenuId),
  [ORDER] [INT] NOT NULL, 
  [CreatedBy] [VARCHAR](20) NOT NULL,
  [CreatedOn] [datetime] NOT NULL,
  [ModifiedBy] [VARCHAR](20) NULL,
  [ModifiedOn] [datetime] NULL,
  [IsActive] [bit] NOT NULL,
)


DROP INDEX Con_SubMenu_Uniq_MenuId_CityName ON [dbo].[Sazs_SubMenus];

-- Recreate the unique index with the desired name
CREATE UNIQUE INDEX Con_SubMenu_Uniq_MenuId_SubMenuName
  ON [dbo].[Sazs_SubMenus]([SubMenuName], [MenuId]);

  CREATE UNIQUE INDEX Con_UserMenuMap_Uniq_SubMenuId_UserId
  ON [dbo].[Sazs_UserMenuMapping]([SubMenuId], [UserId]);
