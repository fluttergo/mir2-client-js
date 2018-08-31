class TileImage {
	public width: number;
	public height: number;
	public source: string;
	public x: number;
	public y: number;
	public constructor(a1, a2, a3) {
		this.width = a1;
		this.height = a2;
		this.source = a3;
	}

	public static creatByXML(map: Tile, node: any) {
		var o: any = new TileImage(Number(node.$width),Number(node.$height),node.$source);
		// console.log('[INFO] tileset: ' + o.source);
		return o
	}
}