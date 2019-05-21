class UmspManager {
	public constructor() {
	}

	public clearUser() {
		LocalStore_Clear();
	}
	public static engine: UmspClient;
	public static init() {
		UmspManager.engine = new UmspClient();
		UI.printLog("=============================================================");
		UI.printLog("=========== " + UmspManager.engine.getVersion() + " =====================");
		UI.printLog("================ Envir: " + GameData.env + " =======================");
		UI.printLog("=============================================================");
	}
	public static login(rsp: Function, networkListener: any) {
		UmspManager.init();
		UmspManager.engine.login(GameData.userID, GameData.token, GameData.gameID, rsp, networkListener, GameData.env);
		UI.printLog("userID: " + GameData.userID + ",token:" + GameData.token + ",gameID:" + GameData.gameID);
	}


	public static match(rsp: Function, roomUserChangedListener: Function, networkListener: any, roomMsgListener: Function) {
		var matchOption = new Match(2);
		matchOption.maxUserCount = GameData.MAX_ROOM_USER_COUNT;
		matchOption.roomName = "开房";
		matchOption.roomTag = "";
		UI.printLog("matchOption: " + JSON.stringify(matchOption));
		UmspManager.engine.match(rsp, roomUserChangedListener,networkListener ,roomMsgListener, matchOption );
	}


	public static send(cmd:string,content: string) {
		if (!content) return;
		UmspManager.engine&&UmspManager.engine.broadcast("#"+cmd+"#"+ content);
	}
	public static logout() {
		UmspManager.engine&&UmspManager.engine.disConnect();
	}
}