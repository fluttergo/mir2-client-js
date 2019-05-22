class UILogin extends BaseScene {

	public g_account_password: eui.Group;
	public i_bg: eui.Image;
	public i_account_password: eui.Image;
	public b_sumbit: eui.Button;
	public b_reg: eui.Button;
	public b_reg0: eui.Button;
	public et_account: eui.EditableText;
	public et_password: eui.EditableText;
	public i_fg: eui.Image;
	public c_sound: eui.CheckBox;
	public g_door: eui.Group;
	public g_door_open: eui.Group;
	public g_password_modify: eui.Group;
	public i_password_modify: eui.Image;
	public g_protocol: eui.Group;
	public i_protocol: eui.Image;
	public g_reg_input: eui.Group;
	public i_reg_input: eui.Image;
	public b_reg_cancel: eui.Button;
	public b_reg_sumbit: eui.Button;

	public constructor() {
		super();
	}

	public onCreated(): void {
		Music.play("Field2_wav");
	}
	public onClick(name: string, v: egret.DisplayObject) {
		super.onClick(name,v);
		switch (v) {
			case this.b_sumbit:
				Toast.show(name);
				this.switchViewGroup(this.g_door);
				AnimaUtil.showMoive("ChrSel_door", this.g_door_open, function () {
					this.afterDoor();
				}.bind(this));
				Music.play("OpenDoor_wav");
				break;
			case this.c_sound:
				Music.isMute = this.c_sound.selected;
				if (Music.isMute) {
					Music.stop("Field2_wav");
				} else {
					Music.play("Field2_wav");
				}
				break;
			default:
				console.log("[BaseScene] No Handler for  click " + name);
				break;
		}
	}
	private afterDoor() {
		Music.stop("Field2_wav");
		SceneManager.showScene(UIChrSel, null, false);
	}

	public switchViewGroup(v: egret.DisplayObject) {
		for (var i = 0; i < this.numChildren; i++) {
			this.getChildAt(i).visible = false;
		}
		v && (v.visible = true);
	}
}