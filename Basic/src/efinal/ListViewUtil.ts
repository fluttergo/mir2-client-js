class ListViewUtil {

	public static initListView(root: egret.DisplayObjectContainer, listview: eui.List, sourceArr: any[], itemClass: any) {
		//用ArrayCollection包装
		var myCollection: eui.ArrayCollection = new eui.ArrayCollection(sourceArr);

		listview.dataProvider = myCollection;
		listview.useVirtualLayout = true;
		listview.itemRenderer = itemClass;
		//设置listview容器本身不可点击
		listview.touchEnabled = false;
		// //创建一个 Scroller
		var scroller = new eui.Scroller();
		scroller.height = listview.height;
		scroller.width = listview.width;
		scroller.viewport = listview;
		// scroller.horizontalScrollBar.autoVisibility = false;
		// scroller.width = 200;
		// scroller.height = 200;
		scroller.x = listview.x;
		scroller.y = listview.y
		scroller.name = "scroller";
		// scroller.scrollPolicyV = eui.ScrollPolicy.AUTO;
		// scroller.scrollPolicyH = eui.ScrollPolicy.AUTO;
		root.addChild(scroller);
	}
	public static refreshData(listView: any,newDataList: Array<any>) {
		(<eui.ArrayCollection>listView.dataProvider).source = newDataList;
		(<eui.ArrayCollection>listView.dataProvider).refresh();
	}
}