class Setting extends eui.Component implements eui.UIComponent {
	public constructor() {
		super();
	}

	protected partAdded(partName: string, instance: eui.Component): void {
		super.partAdded(partName, instance);
		if (partName == "clear") {
			instance.addEventListener("touchTap", function (o: egret.TouchEvent, e) {
				LocalStore_Clear();
				console.log('[INFO] clear UserInfo');
			}, this)
		} else if ("create" == partName) {
			instance.addEventListener("touchTap", function (o: egret.TouchEvent, e) {
				console.log(" create");
				o.target.dispatchEventWith("create",true,{ "fuck": 123 });
			}, this)
		} else if ("random" == partName) {
			instance.addEventListener("touchTap", function (o: egret.TouchEvent, e) {
				console.log('[INFO] random3123');
				o.target.dispatchEventWith("random",true,{ "fuck": 123 });
			}, this)
		}
	}


	protected childrenCreated(): void {
		super.childrenCreated();
	}

}