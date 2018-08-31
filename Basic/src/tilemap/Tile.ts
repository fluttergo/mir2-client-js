class Tile {
	public id: number;
	public image: TileImage;
	public constructor() {
	}

	public static creatByXML(tileSet: TileSet, node: any) {
		var o: any = new Tile();
		o["id"] = Number(tileSet.firstgid) + Number(node.$id) ;
		o["image"] = TileImage.creatByXML(o, node.children[0]);
		// console.log('[INFO] tileset: ' + o.id);
		return o;
	}
}