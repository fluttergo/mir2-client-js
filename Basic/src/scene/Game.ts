class Game extends BaseScene implements eui.UIComponent {
	public player: egret.MovieClip;
	public constructor() {
		super();
	}
	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}

	protected onCreated(): void {
		super.onCreated();
		console.log("================onCreated==============");
		var data = RES.getRes("hum_boy_json");
		var txtr = RES.getRes("hum_boy_png");
		var mcFactory: egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data, txtr);
		var mc1: egret.MovieClip = new egret.MovieClip(mcFactory.generateMovieClipData("boy"));
		this.addChild(mc1);
		this.player = mc1;
	}

	private lastArrow = VirtualJoystick.Arrow.UP;
	
	public moveByArrow(arrow) {
		// console.log('[INFO] arrow to ' + arrow);
		if(this.lastArrow==arrow){
			return;
		}
		this.lastArrow = arrow
		try {
			this.player.gotoAndPlay("run_" + VirtualJoystick.Arrow[arrow], -1);
		} catch (e) {
			console.warn('[WARN] moveByArrow err:' + e.message);
		}
	}

	public onClick(name: string, v: egret.DisplayObject) {
		let stack: any;
		switch (name) {
			case "run":

				break;
			case "btnfight0":
			case "btnfight1":
			case "btnfight2":
			case "btnfight3":
			case "btnfight0bg":
			case "btnfight1bg":
			case "btnfight2bg":
			case "btnfight3bg":

		}
		return true;
	}

}