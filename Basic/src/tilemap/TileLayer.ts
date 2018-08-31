class TileLayer {

	public width: number;
	public height: number;
	public name: string;
	public data = { "encoding": "", "text": "", "dataArr": [] };
	public constructor() {
	}
	public static creatByXML(map: TileMap, node: any) {
		var layer: any = new TileLayer();
		layer["width"] = Number(node.$width);
		layer["height"] = Number(node.$height);
		layer["name"] = node.$name;
		layer["data"] = {};
		layer["data"]["encoding"] = node.children[0].$encoding;
		layer["data"]["text"] = node.children[0].children[0].text;
		if (layer.data.encoding == "csv"&&layer["data"]["text"]) {
			layer["data"]["dataArr"] = layer["data"]["text"].split(",");

		}
		console.log('[INFO] layer: ' + layer.name);
		return layer;
	}
}