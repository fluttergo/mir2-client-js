class UIChrSel extends BaseScene {
	public g_chrsel: eui.Group;
	public i_chrsel: eui.Image;
	public t_game_name: eui.Label;
	public g_player_info: eui.Group;
	public et_player_name: eui.EditableText;
	public b_player_warrior: eui.Button;
	public b_player_wizard: eui.Button;
	public b_player_taoist: eui.Button;
	public b_player_woman: eui.Button;
	public b_player_man: eui.Button;
	public b_player_sumbit: eui.Button;
	public g_player_apparence: eui.Group;
	public t_player_name1: eui.Label;
	public t_player_job1: eui.Label;
	public t_player_level1: eui.Label;
	public t_player_name0: eui.Label;
	public t_player_job0: eui.Label;
	public t_player_level0: eui.Label;
	public b_start: eui.Button;


	public constructor() {
		super();
	}
	public onShow(): void {
		this.showPlayer(this.ApparenceMap[this.selecIndexSex][this.selecIndexJob]);
		Music.play("sellect-loop2_wav", true);
	}
	public onHide() {
		Music.stop("sellect-loop2_wav");
	}
	private ApparenceMap = [
		[
			["ChrSel_warrior_rise", "ChrSel_warrior", "ChrSel_rise"],
			["ChrSel_wizard_rise", "ChrSel_wizard", "ChrSel_rise"],
			["ChrSel_Taoist_rise", "ChrSel_Taoist", "ChrSel_rise"],
		],
		[
			["ChrSel_warrior_rise_women", "ChrSel_warrior_woman", "ChrSel_rise"],
			["ChrSel_wizard_rise_women", "ChrSel_wizard_women", "ChrSel_rise"],
			["ChrSel_Taoist_rise_women", "ChrSel_Taoist_women", "ChrSel_rise"],
		]
	]

	private showPlayer(animaArray) {
		this.g_player_apparence.removeChildren();
		var apparence = AnimaUtil.showMoive(animaArray[0], this.g_player_apparence, function () {
			AnimaUtil.showMoive(animaArray[1], this.g_player_apparence, function () {
			}.bind(this), false, true);
		}.bind(this), true, false);
		apparence.stop();
		AnimaUtil.showMoive(animaArray[2], this.g_player_apparence, function () {
			apparence.gotoAndPlay(0, 1);
		}.bind(this), true, false);
		Music.play("HeroLogin_wav");
	}
	private selecIndexJob: number = 0;
	private selecIndexSex: number = 0;
	public onClick(name: string, v: egret.DisplayObject) {
		super.onClick(name,v);
		switch (v) {
			case this.b_start:
				SceneManager.showScene(Game);
				return;
			case this.b_player_warrior:
				this.selecIndexJob = 0;
				break;
			case this.b_player_wizard:
				this.selecIndexJob = 1;
				break;
			case this.b_player_taoist:
				this.selecIndexJob = 2;
				break;
			case this.b_player_woman:
				this.selecIndexSex = 1;
				break;
			case this.b_player_man:
				this.selecIndexSex = 0;
				break;
			default:
				return;
		}
		this.showPlayer(this.ApparenceMap[this.selecIndexSex][this.selecIndexJob]);

	}
}