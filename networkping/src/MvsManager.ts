class MvsManager {

    public static MAT_EVENT_ENGINE = 'step';
    public static engine: MatchvsEngine = new MatchvsEngine();
    private responseProxy: MatchvsResponse = new MatchvsResponse();
    private static _instance = new MvsManager();
    public static response: any = {};
    public static date: number = new Date().getTime();
    public static checkResponse(name, rsps) {
        // console.log('[INFO] name :'+name+" ->"+JSON.stringify(rsps));
        try {
            if ((rsps.status && 200 == rsps.status) || (200 == rsps[0].status)||(name=="registerUserResponse"&&0 == rsps[0].status)) {
                window["MtaH5"].clickStat(MvsManager.MAT_EVENT_ENGINE, { "step": name + "" });
            } else {
                window["MtaH5"].clickStat(MvsManager.MAT_EVENT_ENGINE, { 'step': "[" + name + '] status:' + (rsps[0].status||rsps[0])+" rsp:"+JSON.stringify(rsps) })
            }
        } catch (e) {
            console.error("checkResponse exp:" + JSON.stringify(e));
            window["MtaH5"].clickStat(MvsManager.MAT_EVENT_ENGINE, { 'step': "[" + name + '] readstatus :' + JSON.stringify(e) })
        }

    }
    public static reportPing(ping: number) {
        try {
            if (ping > 999) {
                window["MtaH5"].clickStat("pingrange", { "pingrange": "ping999" });
            } else if (ping > 200) {
                window["MtaH5"].clickStat("pingrange", { "pingrange": "ping200" });
            } else if (ping > 80) {
                window["MtaH5"].clickStat("pingrange", { "pingrange": "ping80" });
            } else {
                window["MtaH5"].clickStat("pingrange", { "pingrange": "ping40" });
            }
        } catch (e) {
            console.warn("reportPing exp:" + JSON.stringify(e));
        }

    }
    private constructor() {
        // MatchvsLog.closeLog();
        (<any>Function.prototype).setThis = function (func, that) {
            func["that"] = that;
            return func;
        };
        this.responseProxy.errorResponse = function () {
            var args = [];
            for (var i = 0; i < arguments.length; i++) {
                args.push(arguments[i]);
            }
            var func = MvsManager.response.errorResponse;
            func && func.apply(func.that, args);
            window["MtaH5"].clickStat("disconnect", {
                "err": "Err:" + args[0] + "," + Const.gameId + "," + GameData.userId + ", " + args[1]
            });
        }.bind(this);
        this.responseProxy.registerUserResponse = function () {
            MvsManager.checkResponse("registerUserResponse", arguments);
            for (var args = [], i = 0; i < arguments.length; i++) {
                args.push(arguments[i]);
            }
            var func = MvsManager.response.registerUserResponse;
            func && func.apply(func.that, args);
        }.bind(this);
        this.responseProxy.loginResponse = function () {
            MvsManager.checkResponse("loginResponse", arguments);
            for (var args = [], i = 0; i < arguments.length; i++) {
                args.push(arguments[i]);
            }
            var func = MvsManager.response.loginResponse;
            func && func.apply(func.that, args);
        }.bind(this);
        this.responseProxy.createRoomResponse = function () {
            MvsManager.checkResponse("createRoomResponse", arguments);
            for (var args = [], i = 0; i < arguments.length; i++) {
                args.push(arguments[i]);
            }
            var func = MvsManager.response.createRoomResponse;
            func && func.apply(func.that, args);
        }.bind(this);
        this.responseProxy.joinRoomResponse = function () {
            MvsManager.checkResponse("joinRoomResponse", arguments);
            for (var args = [], i = 0; i < arguments.length; i++) {
                args.push(arguments[i]);
            }
            var func = MvsManager.response.joinRoomResponse;
            func && func.apply(func.that, args);
        }.bind(this);
        this.responseProxy.sendEventResponse = function () {
            MvsManager.checkResponse("sendEventResponse", arguments);
            var n = new Date().getTime();
            var ping = (n - MvsManager.date);
            MvsManager.reportPing(ping);

            for (var args = [], i = 0; i < arguments.length; i++) {
                args.push(arguments[i]);
            }
            var func = MvsManager.response.sendEventResponse;
            func && func.apply(func.that, args);
        }.bind(this);
        this.responseProxy.initResponse = function () {
            MvsManager.checkResponse("initResponse", { "status": arguments[0] });
            for (var args = [], i = 0; i < arguments.length; i++) {
                args.push(arguments[i]);
            }
            var func = MvsManager.response.initResponse;
            func && func.apply(func.that, args);
        }.bind(this);
    }

    public static getInstance(): MvsManager {
        if (MvsManager._instance == null) {

        }
        return MvsManager._instance;
    }

    public init(): any {
        window["MtaH5"].clickStat(MvsManager.MAT_EVENT_ENGINE, { "step": 'init' });
        return MvsManager.engine.init(this.responseProxy, Const.channel, Const.platform, Const.gameId);
    }

    public uninit(): any {
        window["MtaH5"].clickStat(MvsManager.MAT_EVENT_ENGINE, { "step": 'uninit' });
        return MvsManager.engine.uninit();
    }

    public registerUser(): any {
        window["MtaH5"].clickStat(MvsManager.MAT_EVENT_ENGINE, { "step": 'regist' });
        return MvsManager.engine.registerUser();
    }

    public login(): any {
        window["MtaH5"].clickStat(MvsManager.MAT_EVENT_ENGINE, { "step": 'login' });
        return MvsManager.engine.login(GameData.userId, GameData.token, Const.gameId, Const.gameVersion,
            Const.appKey, Const.secretKey, Const.deviceId, Const.gatewayId)
    }

    public logout(cpProto): any {
        window["MtaH5"].clickStat(MvsManager.MAT_EVENT_ENGINE, { "step": 'logout' });
        return MvsManager.engine.logout(cpProto);
    }

    public joinRandomRoom(maxPlayer: number, userProfile: string) {
        window["MtaH5"].clickStat(MvsManager.MAT_EVENT_ENGINE, { "step": 'joinrr' });
        return MvsManager.engine.joinRandomRoom(maxPlayer, userProfile);
    }

    public joinRoom(roomId: string, userProfile: string) {
        window["MtaH5"].clickStat(MvsManager.MAT_EVENT_ENGINE, { "step": 'joinr' });
        return MvsManager.engine.joinRoom(roomId, userProfile);
    }

    public joinOver(cpProto: string) {
        window["MtaH5"].clickStat(MvsManager.MAT_EVENT_ENGINE, { "step": 'joino' });
        return MvsManager.engine.joinOver(cpProto);
    }

    public createRoom(createRoom, userProfile) {
        window["MtaH5"].clickStat(MvsManager.MAT_EVENT_ENGINE, { "step": 'create' });
        return MvsManager.engine.createRoom(createRoom, userProfile)
    }

    public leaveRoom(cpProto: string): number {
        window["MtaH5"].clickStat(MvsManager.MAT_EVENT_ENGINE, { "step": 'leaver' });
        return MvsManager.engine.leaveRoom(cpProto)
    }

    public setFrameSync(rate: number) {
        window["MtaH5"].clickStat(MvsManager.MAT_EVENT_ENGINE, { "step": 'setfs' });
        return MvsManager.engine.setFrameSync(rate);
    }

    public sendFrameEvent(cpProto: string) {
        window["MtaH5"].clickStat(MvsManager.MAT_EVENT_ENGINE, { "step": 'sendfe' });
        return MvsManager.engine.sendFrameEvent(cpProto);
    }

    public sendEvent(cpProto: string) {
        MvsManager.date = new Date().getTime();
        window["MtaH5"].clickStat(MvsManager.MAT_EVENT_ENGINE, { "step": 'sende' });
        return MvsManager.engine.sendEvent(cpProto);
    }

    public kickPlayer(srcUserid, cpProto) {
        window["MtaH5"].clickStat(MvsManager.MAT_EVENT_ENGINE, { "step": 'kick' });
        return MvsManager.engine.kickPlayer(srcUserid, cpProto);
    }

    public getRoomList(filter) {
        window["MtaH5"].clickStat(MvsManager.MAT_EVENT_ENGINE, { "step": 'getroomlist' });
        return MvsManager.engine.getRoomListEx(filter);
    }
}