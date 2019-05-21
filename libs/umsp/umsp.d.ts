
/**
 * 
 * @constructor
 */
declare function LocalStore_Clear();

/**
 * 
 * @param {string} key
 * @param {string} value
 * @constructor
 */
declare function LocalStore_Save(key:string,value:string);


declare class User {
   constructor(userID:any, gameID:any, nickName:string);
   public userID :number;
   public gameID :number;
   public token:string;
   public nickName:string;
   public matchExtInfo:string;
   public accessFlag:number;
}

declare class Match {
	constructor(matchType:number);
    public matchType:number;
    public roomName:string;
    public roomPassword:string;
    public roomTag:string;
    public matchServiceIndex:number;
    public wantToMatchUser:User;
    public maxUserCount:number;
}

declare class UmspClient {


    constructor();

	/**
	* 
	* @param {string} cb , function
	* @param {string} envir , default is 'LocalConf'
	* @constructor
	*/
	login(userID:any, token:string, gameID:any, cb, gateWayNetWorkListener, envir?:string );

    match(matchResultListener, roomUserChangedListener, roomServiceNetWorkListener,match,broadcast);
    
    getVersion():string;
    disConnect();
    broadcast(data:string) ;
}
