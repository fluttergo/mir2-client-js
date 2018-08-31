class Login extends eui.Component implements eui.UIComponent {
	private sourceArr = [];
	public constructor() {
		super();
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}

	private listview: eui.List;
	private scroller: eui.Scroller;
	protected childrenCreated(): void {
		super.childrenCreated();

		var i: number = 0;
		for (; i < 5; i++) {
			this.sourceArr.push({ label: "item" + i });
		}


		var myCollection: eui.ArrayCollection = new eui.ArrayCollection(this.sourceArr);

		this.listview.dataProvider = myCollection;
		this.listview.useVirtualLayout = true;
		this.listview.itemRenderer = ListViewImageItem;

		// ListViewUtil.initListView(this, this.listview, sourceArr, ListViewImageItem);
		// // this.scroller = scroller;
		// // //创建一个按钮，点击后改变 Scroller 滚动的位置
		// var btn = new eui.Button();
		// btn.x = 200;
		// this.addChild(btn);
		// btn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
		// 	sourceArr.push({ label: "item add" });
		// }, this);
		var ss = 0;
		setInterval(function () {
			while (this.sourceArr.pop()) {
			}
			ss++;
			this.sourceArr.push({ label: ("item" + ss) });
			// this.listview.dataProvider.
				// var myCollection: eui.ArrayCollection = new eui.ArrayCollection(this.sourceArr);
			this.listview.dataProvider.refresh();

			// this.listview.dataProvider = myCollection;
			console.log('[INFO] ++' + ss);
		}.bind(this), 1000);
	}

}