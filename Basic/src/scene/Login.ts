class Login extends BaseScene implements eui.UIComponent {
	private that: any = this;
	private loading: Loading;
	private xy: eui.Label;

	private vj: VirtualJoystick = new VirtualJoystick();  //虚拟摇杆


	private player: egret.DisplayObject;    //人物
	private speedX = 0;         //人物移动速度
	private speedY = 0;
	private speed = 10;


	public constructor() {
		super();
	}
	public menuAnimation: egret.tween.TweenGroup;

	protected onCreated() {
		super.onCreated();
		this.loading = Loading.create(this);
		this.addChild(this.vj);
		this.vj.addEventListener("vj_start", this.onStart, this);
		this.vj.addEventListener("vj_move", this.onChange, this);
		this.vj.addEventListener("vj_end", this.onEnd, this);
	}


	public onClick(name: string, v: egret.DisplayObject) {
		if (name == "n1") {
			var xy = (<Main>this.parent).randomMove();

			Toast.show("随机传送到(" + xy.x + "," + xy.y + ")");
			this.xy.text = xy.x + "," + xy.y;
		} else if (name == "n2") {
			var xy = (<Main>this.parent).goSafeArea();
			this.xy.text = xy.x + "," + xy.y;
			Toast.show("回程(" + xy.x + "," + xy.y + ")");
		}
		return true;
	}	//摇杆启动，人物开始根据摇杆移动
	private onStart() {
		this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
	}

	//触摸摇杆的角度改变，人物的移动速度方向也随之改变
	private onChange(e: egret.Event) {
		var angle = e.data;
		// this.speedX = Math.cos(angle) * this.speed;
		// this.speedY = Math.sin(angle) * this.speed;
		(<Game>(<Main>this.parent).gameLayer).moveByArrow(e.data.arrow);
	}

	//停止摇杆，人物停止移动
	private onEnd() {
		this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
	}

	//每帧更新，人物移动
	private onEnterFrame() {
		// this.player.x += this.speedX;
		// this.player.y += this.speedY;
	}
}