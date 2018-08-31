class Const {
    // game
    public static SCENT_WIDTH: number = 480;
    public static SCENT_HEIGHT: number = 800;

    public static GamePoxY: number = 0;
    public static setSwfArr: Array<any> = ["s", "t", "a", "t", "i", "c", ".", "e", "g", "r", "e", "t", "-", "l", "a", "b", "s", ".", "o", "r", "g"];


    // matchvs
    public static gameVersion: number = 1;

    public static setGameID(gameID: any, appkey?: string, sercetkey?: string) {
        if (gameID) {
            Const.gameId = gameID;//视频游戏1
            Const.appKey = appkey;
            Const.secretKey = sercetkey;
        }
    }
    public static gameId: number = 201170;//视频游戏1
    public static appKey: string = "5884e824f85a4f80aea78d04c30f90b8";
    public static secretKey: string = "34a98e66d5c84171a14e21ff153e4f95";

    // public static gameId: number = 201150;//视频游戏2
    // public static appKey: string = "0db8550d9bd345da82b852564f59d2e6";
    // public static secretKey: string = "15bf7e1bc2454d21b071d67f568e257c";

    // public static gameId: number = 201126;//ranger
    // public static appKey: string = "f38ef43d2c024590afd295cc311440dd";
    // public static secretKey: string = "9ae1acc200bd4a178d0be24bf3b1f5a3";
    public static channel: string = "Matchvs";
    // public static platform: string = "alpha";
    public static platform: string = "release";
    public static deviceId: string = "";
    public static gatewayId: any = 0;


    // event
    public static WILL_INIT_ENEMY_EVENT: string = "will_init_enemy_event";
    public static MISS_FUN_EVENT: string = "miss_fun_event";
    public static ACC_HIT_FUN_EVENT: string = "acc_hit_fun_event";
    public static HIT_FUN_EVENT: string = "hit_fun_event";
    public static GAME_WILL_PLAY_EVENT: string = "game_will_play_event";
    public static RELIVE_EVENT: string = "relive_event";

    public static MOVE_EVENT: string = "move_event";
    public static GAME_OVER_EVENT: string = "move_game_over";

    public static ADD_ACTION: string = "add_action";
    public static DROP_ACTION: string = "drop_action";
    public static RELIVE_ACTION: string = "relive_action";

    public static IN_START_VIEW: string = "in_start_view";
    public static IN_PLAY_VIEW: string = "in_play_view";
}