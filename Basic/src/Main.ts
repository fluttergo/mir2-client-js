//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
class Main extends egret.DisplayObjectContainer {

    public root: egret.DisplayObjectContainer;
    public constructor() {
        super();

        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);

        // 扩展资源加载模块文件解析器
        // http://edn.egret.com/cn/article/index/id/551
        // RES.registerAnalyzer("starlingswf_sheet", starlingswf.StarlingSwfSheetAnalyzer);

        //https://github.com/egret-labs/resourcemanager/blob/master/docs/README.md#processor



    }
    private onAddToStage(event: egret.Event) {

        egret.lifecycle.addLifecycleListener((context) => {
            context.onUpdate = () => {
                // console.log("update");
            }
        })
        egret.lifecycle.onPause = () => {
            // egret.ticker.pause();
            // console.log('[INFO] [lifecycle] onPause');
        }

        egret.lifecycle.onResume = () => {
            // egret.ticker.resume();
            // console.log('[INFO] [lifecycle] onResume');
        }

        this.runGame();

    }

    private loadTheme() {
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        return new Promise((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);

        })
    }


    private loadingView: LoadingUI;
    private swfFrame: any;
    private _loadTimes: number = 0;



    private async runGame() {
        await this.loadResource();
    }

    private async loadResource() {
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        // 加载配置文件并解析
        await RES.loadConfig("resource/default.res.json", "resource/");
    }

    private onConfigComplete(event: RES.ResourceEvent): void {
        console.log("DownLoad Config is Complete");
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);

        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);

        // RES.createGroup("initLoad", ["preload", "bgPic", "animation", "sound"]);
        RES.loadGroup("preload");
        console.log("start Download Resource");
    }

    private onResourceLoadComplete(event: RES.ResourceEvent): void {
        console.log(" DownLoad Resource is Complete [" + event.groupName + "]");
        if (event.groupName == "preload") {
            console.log("DownLoad Resource is Complete !");
            this.loadingView.onLoadComplete(this.onStartGame, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            console.log("remove  loadingView");
            this.stage.removeChild(this.loadingView);
        }


    }

    private onResourceProgress(event: RES.ResourceEvent): void {
        if (event.groupName == "preload") {
            this.loadingView.onProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    private onResourceLoadError(e: RES.ResourceEvent): void {
        this._loadTimes++;

        if (this._loadTimes > 3) {
            Toast.show("网络异常，请重新进入游戏");
        }
        else {
            RES.loadGroup(e.groupName);
        }
    }


    private onStartGame(): void {
        // SoundUtils.instance().initSound();
        this.loadTheme();

        Toast.initRes(this, "resource/loading/toast-bg.png");

        var rootView = new egret.Sprite();
        rootView.width = this.stage.stageWidth;
        rootView.height = this.stage.stageHeight;
        rootView.x = 0;
        rootView.y = 0;
        this.addChild(rootView);

        SceneManager.init(rootView);

        NetWorkUtil.instance.addEventListener(this);

        this.createGameScene();
    }


    public onEvent(event: number) {
        while (SceneManager.back());
        this.createGameScene();
        Toast.show("Exception,code:" + event);
    }
    /**
     * 创建场景界面
     * Create scene interface
     */
    protected createGameScene(): void {

        // this.createBackGround();
        SceneManager.showScene(UILogin);

    }

    private urlloader: egret.URLLoader;
    public createBackGround() {
        var self: Main = this;
        var gameLayer = new Game();
        this.mapLayer = new egret.DisplayObjectContainer();

        gameLayer.width = this.stage.stageWidth;
        gameLayer.height = this.stage.stageHeight;
        gameLayer.scaleX = 2.4;
        gameLayer.scaleY = 2.4;
        this.mapLayer.width = Math.floor(this.stage.stageWidth / gameLayer.scaleX);
        this.mapLayer.height = Math.floor(this.stage.stageHeight / gameLayer.scaleY);
        // TileMap.createTileMap("3.tmx", "resource/map/", function (map: TileMap, progress: number, total: number) {
        //     // console.log('[INFO] load tilemap [' + map.name + '] is ' + progress + "/" + total);
        //     if (progress == total) {
        //         this.map = map;
        //         TileMap.render(map, this.mapLayer, 320, 321, this.mapLayer.width, this.mapLayer.height);
        //     }
        // }.bind(this));
        // ImageLoader.showAsyncByUrl(this, "", 100, 100, 256, 256);



        // var spriteSheet: egret.SpriteSheet = RES.getRes("ChrSel.wil_json#100");
        // var texture = spriteSheet.getTexture("100");

        gameLayer.addChild(this.mapLayer);
        this.addChild(gameLayer);
        this.gameLayer = gameLayer;
        this.addChild(new Login());


        // var img = RES.getRes("ChrSel.wil_json.100");
        //  function (data: any, key: string) {
        //     var texture = new egret.Texture();
        //     texture.bitmapData = data;
        //     var bitmap = new egret.Bitmap(texture);
        //     bitmap.width =  texture.textureWidth;
        //     bitmap.height =texture.textureWidth;
        //     this.addChild(bitmap);
        // }, this
    }
    public gameLayer: egret.DisplayObjectContainer;
    private map: TileMap;
    public mapLayer: egret.DisplayObjectContainer;

    public randomMove() {
        var x = Math.floor(Math.random() * this.map.width);
        var y = Math.floor(Math.random() * this.map.height);
        TileMap.render(this.map, this.mapLayer, x, y, this.mapLayer.width, this.mapLayer.height);
        return { x: x, y: y };
    }
    public goSafeArea() {
        TileMap.render(this.map, this.mapLayer, 333, 333, this.mapLayer.width, this.mapLayer.height);
        return { x: 333, y: 333 };
    }
}
//wxbbc70b17d96358cb wx APPID