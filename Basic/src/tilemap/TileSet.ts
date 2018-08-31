class TileSet {
	public firstgid: number;
	public lastgid: number;
	public source: string;
	public tileArr: Tile[] = [];
	public constructor() {
	}

	public static creatByXML(map: TileMap, node: any, callback?: Function) {
		var tileset: any = new TileSet();
		tileset["firstgid"] = Number(node.$firstgid);
		tileset["source"] = node.$source;
		console.log('[INFO] tileset: ' + tileset.source);

		var source: string = tileset["source"];
		if (source.indexOf(".tsx") > 0) {
			FileLoader.loadXML(map.baseURL + source, function (xml: egret.XML) {
				for (var i = 0; i < xml.children.length; i++) {
					if ((<any>xml.children[i]).name == "tile") {
						tileset.tileArr.push(Tile.creatByXML(tileset, <any>xml.children[i]));
					}
				}
				tileset.lastgid = tileset.firstgid + tileset.tileArr.length;
				console.log("[INFO] parse " + source + ", the Tile count:" + tileset.tileArr.length);
				callback(tileset);
			}.bind(this));
		}
		return tileset;
	}
}