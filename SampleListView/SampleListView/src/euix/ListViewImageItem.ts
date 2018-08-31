class ListViewImageItem extends eui.ItemRenderer {
	public constructor() {
		super();
	}
	private labelDisplay: eui.Label;
	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);


		instance.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
			console.log('[INFO] '+this.itemIndex);
		}, this);

	}


	protected childrenCreated(): void {
		super.childrenCreated();
	}
	protected dataChanged(): void {
		this.labelDisplay.text = this.data.label;
	}
}