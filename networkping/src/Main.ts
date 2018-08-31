
class Main extends eui.UILayer {

    private timer;
    private pings = [0];
    private speed = 1000;
    private isRandomJoinRoom = false;
    public static instance;
    // private speed = 1000;
    protected createChildren(): void {
        super.createChildren();
        Main.instance = this;

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        })

        egret.lifecycle.onPause = () => {
            // egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            // egret.ticker.resume();
        }

        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());


        this.runGame().catch(e => {
            console.log(e);
        })
    }

    private async runGame() {
        await this.loadResource()
        const result = await RES.getResAsync("description_json")
        await platform.login();
        const userInfo = await platform.getUserInfo();
        console.log(userInfo);
        this.addEventListener("random", function () {
            console.log('[INFO] random recv');
            this.isRandomJoinRoom = true;
            this.stopLoopSendEvent();
        }.bind(this), this);
        this.addEventListener("create", function () {
            console.log('[INFO] create recv');
            this.isRandomJoinRoom = false;
            this.stopLoopSendEvent();
        }.bind(this), this);
        this.createGameScene();

    }

    private async loadResource() {
        const loadingView = new LoadingUI();
        this.stage.addChild(loadingView);
        await RES.loadConfig("resource/default.res.json", "resource/");
        await this.loadTheme();
        await RES.loadGroup("preload", 0, loadingView);
        this.stage.removeChild(loadingView);
    }

    private loadTheme() {
        return new Promise((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);

        })
    }
    public static GetRequest(): any {
        var url = location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str: string = url.substr(1);
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    }

    /**
     * 创建场景界面
     * Create scene interface
     */
    protected createGameScene(): void {
        this.removeChildren();

        var Request = Main.GetRequest();

        console.log('[INFO] uri:' + JSON.stringify(Request));
        Const.setGameID(Request["gameID"], Request["appkey"], Request["secretkey"]);
        this.isRandomJoinRoom = Request["random"] ? true : false;

        this.pings = [0];
        var w: number = 760;
        var h: number = 460;

        var s = new eui.Scroller();
        s.x = 10;
        s.y = 10;

        var v = new eui.Group();
        v.width = w;
        v.height = h;
        v.setContentSize(800, 480);

        var shp: egret.Shape = new egret.Shape();
        shp.x = 40;
        shp.y = 40;
        v.addChild(shp);


        shp.graphics.lineStyle(4, 0xaa1111);
        shp.graphics.moveTo(0, 0)
        shp.graphics.lineTo(0, h);
        shp.graphics.moveTo(0, 0)
        shp.graphics.lineTo(w, 0);

        for (var i = 0; i * 20 < h; i++) {
            shp.graphics.lineStyle(1, 0xcccccc);
            shp.graphics.moveTo(0, i * 20);
            shp.graphics.lineTo(w, i * 20);

            var label: egret.TextField = new egret.TextField();
            label.text = (i == 0) ? "ms" : (i * 20 + "");
            label.size = 14;
            label.x = 10;
            label.y = 40 + i * 20;

            this.addChild(label);
        }

        s.viewport = v;
        this.addChild(s);
        new Date().getUTCMilliseconds();
        var table: egret.Shape = new egret.Shape();
        var startTime = new Date().getTime();
        table.graphics.lineStyle(2, 0x11aa11);
        table.graphics.moveTo(0, 0);
        table.x = 40;
        table.y = 40;
        v.addChild(table);
        setInterval(function () {
            var ping = this.pings[this.pings.length - 1];
            table.graphics.clear();
            table.graphics.lineStyle(2, 0x11aa11);
            table.graphics.moveTo(0, this.pings[0]);
            for (var i = 0; i < this.pings.length; i++) {
                var ping = this.pings[i];
                if (ping < 0) {
                    table.graphics.lineStyle(2, 0xaa1111);
                    table.graphics.lineTo(i * 5, ping);
                    table.graphics.lineStyle(2, 0x11aa11);
                } else {
                    table.graphics.lineTo(i * 5, ping);
                }
            }

            if (this.pings.length * 5 > w) {
                var discard = this.pings.pop();
                //    console.log('[INFO] discard'+discard+" len:"+this.pings);
            }
            v.setContentSize(w, h);
        }.bind(this), this.speed);

        this.addChild(new Setting());
        this.initMvs();

    }

    private onButtonClick(e: egret.TouchEvent) {
        LocalStore_Clear();
    }
    private initMvs() {
        this.mvsBind();
        MvsManager.getInstance().logout("");
        MvsManager.getInstance().uninit();
        MvsManager.getInstance().init();
    }

    private mvsRegisterUserResponse(data): void {
        GameData.userId = data.id;
        GameData.token = data.token;
        GameData.userName = data.id;
        GameData.avatarUrl = data.avatar;
        let result = MvsManager.getInstance().login();
        console.log("login," + new Date());

    }



    private mvsLoginResponse(data): void {
        if (NetWorkUtil.checkStatsEeception(data.status)) {
            return;
        }
        if (data.status === 200) {
            console.log('response login  ok' + data + new Date());
            if (this.isRandomJoinRoom == true) {
                MvsManager.getInstance().joinRandomRoom(2, "");
            } else {
                var s = new MsCreateRoomInfo("PingTest", 2, 0, 0, 1, "");
                MvsManager.getInstance().createRoom(s, "TS-Tester");
            }

        } else {
            console.warn('[WARN] login fail');
            return;
        }
    }
    private mvsInitResponse(status: number): void {
        console.log('response init ok', status);
        this.registerUser();
    }
    public mvsErrorResponse(code, errMsg) {
        console.info('[ERROR] mvsErrorResponse', arguments);
        this.stopLoopSendEvent();
    }

    public registerUser() {
        MvsManager.getInstance().registerUser();
    }

    private stopLoopSendEvent() {
        clearInterval(this.timer);
        setTimeout(function () {
            this.createGameScene();
        }.bind(this), 5000);
    }

    private loopSendEvent() {
        var date = new Date().getTime();
        MvsManager.response.sendEventResponse = function () {
            var n = new Date().getTime();
            var ping = (n - date);
            this.pings.unshift(ping);
        }.bind(this);
        this.timer = setInterval(function () {
            MvsManager.getInstance().sendEvent("s");
            date = new Date().getTime();
        }, this.speed);

    }
    public mvsJoinRoomResponse(status: number, roomUserInfoList: Array<MsRoomUserInfo>, roomInfo: MsRoomInfo): void {
        console.log('[INFO] mvsJoinRoomResponse ');
        if (NetWorkUtil.checkStatsEeception(status)) {
            return;
        }
        console.log('[room join rsp]: ' + JSON.stringify(roomInfo));
        this.loopSendEvent();

    }
    public mvsCreateRoomResponse(rsp: MsCreateRoomRsp): void {
        console.log('[INFO] createRoomResponse ');
        if (NetWorkUtil.checkStatsEeception(rsp.status)) {
            return;
        }
        console.log('[room create rsp]: ' + JSON.stringify(rsp));
        this.loopSendEvent();
    }
    public mvsBind() {

        MvsManager.response.initResponse = (<any>this.mvsInitResponse).setThis(this.mvsInitResponse, this);
        MvsManager.response.registerUserResponse = (<any>this.mvsRegisterUserResponse).setThis(this.mvsRegisterUserResponse, this);
        MvsManager.response.loginResponse = (<any>this.mvsLoginResponse).setThis(this.mvsLoginResponse, this);
        MvsManager.response.errorResponse = (<any>this.mvsErrorResponse).setThis(this.mvsErrorResponse, this);
        MvsManager.response.createRoomResponse = (<any>this.mvsCreateRoomResponse).setThis(this.mvsCreateRoomResponse, this);
        MvsManager.response.joinRoomResponse = (<any>this.mvsJoinRoomResponse).setThis(this.mvsJoinRoomResponse, this);
    }
}
