
 CREATE PROCEDURE [dbo].[Sazs_Pr_Subscribers]     
	(      
	  @Flag INT,  
	  @SubscriberId		VARCHAR(20), --WHAT Operation to be performed  
	  @SubscriberName	VARCHAR(30),  
	  @ShortName		VARCHAR(20),  
	  @SubscriberCode		VARCHAR(10),  
	  @Email			VARCHAR(30),  
	  @Roll				BIT,  
	  @CityId			VARCHAR(20),  
	  @MobileNo			VARCHAR(12),  
	  @LanLineNo		 VARCHAR(12),  
	  @Address1			 VARCHAR(100) ,  
	 @Address2			 VARCHAR(100) ,  
	 @LandMark			VARCHAR(50),  
	  @Logo				VARCHAR(50),  
	  @GstNo			 VARCHAR(30),  
	  @PointOfContact	VARCHAR(30),   
	  @EndDate			datetime,  
	  @CreatedBy		VARCHAR(20),  
	  @ModifiedBy		VARCHAR(20),  
	  @IsActive			 BIT,  
	  @UserName			VARCHAR(20),  
	  @Password			 NVARCHAR(100) ,
	  @StartDate		datetime
	)      
	AS      
	BEGIN      
      
	SET NOCOUNT ON      
      
	DECLARE @CurrentDateTime DATETIME = dbo.GetISTDateTime()      
    
	IF @Flag = 1 -- INSERT      
	 BEGIN      
        
	  DECLARE @TempSubscriberId VARCHAR(20) = [dbo].[GenerateNewCode]('dbo.Sazs_Subscribers ')      
      
  INSERT INTO dbo.Sazs_Subscribers (SubscriberId, SubscriberName, SubscriberCode,  Logo, GstNo, PointOfContact, StartDate, EndDate, CreatedBy, CreatedOn,IsActive)      
  VALUES (@TempSubscriberId, @SubscriberName, @SubscriberCode, @Logo, @GstNo, @PointOfContact, @StartDate, @EndDate, @CreatedBy,@CurrentDateTime, @IsActive)      
      
         
  DECLARE @TempUserId VARCHAR(20) = [dbo].[GenerateNewCode]('dbo.Sazs_AppLogin ')      
  
  INSERT INTO dbo.Sazs_AppLogin (UserId, SubscriberId, UserName, Roll, Password,  
  DisplayName, Email, CityId, MobileNo, Address1, Address2, LandMark, CreatedBy, CreatedOn, IsActive, LastLogin)      
  VALUES (@TempUserId, @TempSubscriberId, @UserName, @Roll, @Password, @ShortName, @Email, @CityId, @MobileNo, @Address1, @Address2, @LandMark, @CreatedBy, @CurrentDateTime, @IsActive, @CurrentDateTime)      
  
  
  DECLARE @TempBranchId VARCHAR(20) = [dbo].[GenerateNewCode]('dbo.Sazs_Branches ')      
  
  INSERT INTO dbo.Sazs_Branches (BranchId, SubscriberId, BranchName, Address1, Address2, LandMark, CityId, GstNo, MobileNo, LanLineNo, CreatedBy, CreatedOn, IsActive)      
  VALUES (@TempBranchId, @TempSubscriberId, @SubscriberName, @Address1, @Address2, @LandMark, @CityId, @GstNo, @MobileNo, @LanLineNo, @CreatedBy, @CurrentDateTime, @IsActive)      
  
 END     
 		ELSE IF (@Flag=2) -- UPDATE

	BEGIN
	UPDATE dbo.Sazs_Subscribers
SET
    Logo = CASE
	WHEN @Logo IS NULL THEN Logo  -- Keep the existing logo if new logo is null
		 ELSE @Logo
    END,
    SubscriberName = @SubscriberName,
    SubscriberCode = @SubscriberCode,
    GstNo =			 @GstNo,
    PointOfContact = @PointOfContact,
    StartDate =		 @StartDate,
    EndDate =		 @EndDate,
    IsActive =		 @IsActive,
    CreatedOn =		 @CurrentDateTime,
	ModifiedBy=		 @ModifiedBy,
	ModifiedOn=		 @CurrentDateTime	-- Assuming you want to update the CreatedOn field as well
WHERE 
    SubscriberId = @SubscriberId; -- Assuming you want to update the row with a specific SubscriberId
      END
	  ELSE IF @Flag = 3 --- DELETE Subscriber
	BEGIN
		UPDATE dbo.Sazs_Subscribers  
		SET ModifiedBy = @ModifiedBy
			,ModifiedOn = @CurrentDateTime    
			,IsActive = 0    
		WHERE SubscriberId = @SubscriberId  
			UPDATE dbo.Sazs_AppLogin  
		SET ModifiedBy = @ModifiedBy
			,ModifiedOn = @CurrentDateTime    
			,IsActive = 0    
		WHERE SubscriberId = @SubscriberId  
		UPDATE dbo.Sazs_Branches  
		SET ModifiedBy = @ModifiedBy
			,ModifiedOn = @CurrentDateTime    
			,IsActive = 0    
		WHERE SubscriberId = @SubscriberId   
	END
SET NOCOUNT OFF      
END   
GO



----------------------------------------

# For Users create 
# Need to discuss for users (email, city Id, mobile, address )no in APP login Table

CREATE PROCEDURE [dbo].[Sazs_Pr_Users]   
(    
  @Flag INT,
  @UserId VARCHAR(40), --WHAT Operation to be performed
  @SubscriberId VARCHAR(20), --WHAT Operation to be performed
  @ShortName VARCHAR(20), 
  @Roll BIT,
  @CreatedBy VARCHAR(20),
  @ModifiedBy VARCHAR(20),
  @IsActive BIT,
  @UserName VARCHAR(20),
  @Password NVARCHAR,
  @LastLogin DATETIME
)    
AS    
BEGIN    
    
SET NOCOUNT ON    
    
DECLARE @CurrentDateTime DATETIME = dbo.GetISTDateTime()    
  
IF @Flag = 1 -- INSERT    
 BEGIN    
             
  DECLARE @TempUserId VARCHAR(20) = [dbo].[GenerateNewCode]('dbo.Sazs_AppLogin ')    

  INSERT INTO dbo.Sazs_AppLogin (UserId, SubscriberId, UserName, Roll, Password,
  DisplayName, CreatedBy, CreatedOn, IsActive, LastLogin)    
  VALUES (@TempUserId, @TempSubscriberId, @UserName, @Roll, @Password, @ShortName, @CreatedBy, @CurrentDateTime, @IsActive, @LastLogin)    

 END   

    
SET NOCOUNT OFF    


END 

------------------------------------

# menu

CREATE PROCEDURE [dbo].[Sazs_Pr_Menus]   
(    
  @Flag INT,
  @MenuId VARCHAR(20), --WHAT Operation to be performed
  @MenuName VARCHAR(30),
  @Path VARCHAR(20),
  @Icon VARCHAR(10),

  @CreatedBy VARCHAR(20),
  @ModifiedBy VARCHAR(20),
  @IsActive BIT,
)    
AS    
BEGIN    
    
SET NOCOUNT ON    
    
DECLARE @CurrentDateTime DATETIME = dbo.GetISTDateTime()    
  
IF @Flag = 1 -- INSERT    
 BEGIN    
      
  DECLARE @TempMenuId VARCHAR(20) = [dbo].[GenerateNewCode]('dbo.Sazs_Menus')    
    
  INSERT INTO dbo.Sazs_Menus (MenuId, MenuName, Path, Icon, CreatedBy, CreatedOn,IsActive)    
  VALUES (@TempMenuId, @MenuName, @Path, @Icon, @SubMenu, @CreatedBy,@CurrentDateTime, @IsActive)    
    
       
 END   

    
SET NOCOUNT OFF    

END 


------------------------------------

# submenu

CREATE PROCEDURE [dbo].[Sazs_Pr_SubMenus]   
(    
  @Flag INT,
  @SubMenuId VARCHAR(20), --WHAT Operation to be performed
  @SubMenuName VARCHAR(30),
  @MenuId VARCHAR(30),
  @Path VARCHAR(20),
  @Icon VARCHAR(10),
  @SubMenu VARCHAR(30),

  @CreatedBy VARCHAR(20),
  @ModifiedBy VARCHAR(20),
  @IsActive BIT,
)    
AS    
BEGIN    
    
SET NOCOUNT ON    
    
DECLARE @CurrentDateTime DATETIME = dbo.GetISTDateTime()    
  
IF @Flag = 1 -- INSERT    
 BEGIN    
      
  DECLARE @TempSubMenuId VARCHAR(20) = [dbo].[GenerateNewCode]('dbo.Sazs_Menus')    
    
  INSERT INTO dbo.Sazs_Menus (SubMenuId, MenuId, MenuName, Path, Icon, SubMenu, CreatedBy, CreatedOn,IsActive)    
  VALUES (@TempSubMenuId, @MenuId, @MenuName, @Path, @Icon, @SubMenu, @CreatedBy, @CurrentDateTime, @IsActive)    
    
       
 END   

    
SET NOCOUNT OFF    

END 


------------------------------------

# UserMenumapping

CREATE PROCEDURE [dbo].[Sazs_Pr_Sazs_UserMenuMapping]   
(    
  @Flag INT,
  @UserMenuMapId VARCHAR(30),
  @UserId VARCHAR(20),
  @MenuId VARCHAR(20),
  @SubMenuId VARCHAR(20),
  @Order INT,
  @CreatedBy VARCHAR(20),
  @ModifiedBy VARCHAR(20),
  @IsActive BIT,
)    
AS    
BEGIN    
    
SET NOCOUNT ON    
    
DECLARE @CurrentDateTime DATETIME = dbo.GetISTDateTime()    
  
IF @Flag = 1 -- INSERT    
 BEGIN    
      
  DECLARE @TempUserMenuMapId VARCHAR(20) = [dbo].[GenerateNewCode]('dbo.Sazs_Menus')    
    
  INSERT INTO dbo.Sazs_Menus (UserMenuMapId, MenuId, SubMenuId, Order, CreatedBy, CreatedOn, IsActive)    
  VALUES (@TempUserMenuMapId, @MenuId, @SubMenuId, @Order, @CreatedBy, @CurrentDateTime, @IsActive)    
    
       
 END   

    
SET NOCOUNT OFF    

END 

