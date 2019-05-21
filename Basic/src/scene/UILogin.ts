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
	public b_reg_sumbit: eui.Button;
	public b_reg_cancel: eui.Button;
	public g_chrsel: eui.Group;
	public i_chrsel: eui.Image;
	public t_game_name: eui.Label;
	public g_player_info2: eui.Group;
	public et_player_name2: eui.EditableText;
	public g_player_info1: eui.Group;
	public et_player_name1: eui.EditableText;
	public b_login: eui.Image;
	public t_player_name1: eui.Label;
	public t_player_job1: eui.Label;
	public t_player_level1: eui.Label;
	public t_player_name0: eui.Label;
	public t_player_job0: eui.Label;
	public t_player_level0: eui.Label;




	public constructor() {
		super();
	}

	public onCreated(): void {
		Music.play("Field2_wav");
	}
	public onClick(name: string, v: egret.DisplayObject) {
		switch (v) {
			case this.b_sumbit:
				Toast.show(name);
				this.switchViewGroup(this.g_door);
				AnimaUtil.showMoive("ChrSel_door", this.g_door_open, function () {

				}.bind(this));
				Music.play("OpenDoor_wav");
				setTimeout(this.afterDoor.bind(this), 3000);
				break;
			case this.c_sound:
				GameData.isSound = !this.c_sound.selected;
				if (!GameData.isSound) {
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
		this.switchViewGroup(this.g_chrsel);
		Music.play("sellect-loop2_wav");
		this.showPlayer(0);
	}
	private showPlayer(index) {
		switch (index) {
			case 0:
				AnimaUtil.showMoive("ChrSel_warrior_rise", this.g_player_info1, function () {

				}.bind(this));
				AnimaUtil.showMoive("ChrSel_warrior", this.g_player_info1, function () {

				}.bind(this));
				AnimaUtil.showMoive("ChrSel_rise", this.g_player_info1, function () {

				}.bind(this));
				break;
			case 1:
				break;
			case 2:
				break;
		}
	}
	public switchViewGroup(v: egret.DisplayObject) {
		for (var i = 0; i < this.numChildren; i++) {
			this.getChildAt(i).visible = false;
		}
		v && (v.visible = true);
	}
}