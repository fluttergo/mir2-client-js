class TileMap {
	public name: string;
	public tilewidth: number;
	public tileheight: number;
	public width: number;
	public height: number;
	public orientation: string;
	public version: string;
	public renderorder: string;
	public nextobjectid: number;

	public layers: TileLayer[] = [];
	public tilesets: TileSet[] = [];

	public baseURL: string;

	private xml: egret.XML;

	public constructor(tmxFileName, baseURL) {
		this.name = tmxFileName;
		this.baseURL = baseURL;

	}
	private render() {

	}
	public getImageByID(dataID: number): TileImage {
		for (var i = 0; i < this.tilesets.length; i++) {
			if (dataID >= this.tilesets[i].firstgid && dataID <= this.tilesets[i].lastgid) {
				var tileArray = this.tilesets[i].tileArr;
				var firstgid = this.tilesets[i].firstgid;
				return tileArray[Math.max(dataID - firstgid, 0)].image;//-1 for that the firstgid is increase base on 1
			}
		}
		return null;
	}
	private loadTiles(callback?: Function) {
		var tileParseTask = [];
		var total = 0;
		var taskReporter = function () {
			total = total > tileParseTask.length ? total : tileParseTask.length
			tileParseTask.pop();
			if (tileParseTask.length <= 0) {
				callback(this, total - tileParseTask.length, total);
			} else {
				callback(this, total - tileParseTask.length, total);
			}
		}.bind(this);
		for (var i = 0; i < this.xml.children.length; i++) {
			var node: any = this.xml.children[i];
			if (node.name == "layer") {
				this.layers.push(TileLayer.creatByXML(this, node));
			} else if (node.name == "tileset") {
				this.tilesets.push(TileSet.creatByXML(this, node, taskReporter));
				tileParseTask.push(0);
			}


		}
	}

	public static createTileMap(tmxFileName, baseURL, callback?: Function): void {
		FileLoader.loadXML(baseURL + tmxFileName, function (xml: egret.XML) {
			var tilemap: TileMap = new TileMap(tmxFileName, baseURL);
			tilemap.xml = xml;
			tilemap.tilewidth = (<any>xml).$tilewidth;
			tilemap.tileheight = (<any>xml).$tileheight;
			tilemap.width = (<any>xml).$width;
			tilemap.height = (<any>xml).$height;
			tilemap.loadTiles(function (a1, a2, a3) {
				callback(tilemap, a2, a3);
			});
		}.bind(this));
	}

	public static getRenderImageArr(map: TileMap, renderRect, dataArr): Array<any> {
		var renderImageArr = [];

		for (var i = 0; i < renderRect.renderRow; i++) {
			renderImageArr[i] = [];
			for (var j = 0; j < renderRect.renderColumn; j++) {
				var index = (renderRect.renderOffsetY + j) * map.width + renderRect.renderOffsetX + i;
				var id = Number(dataArr[index]);
				var image: TileImage = map.getImageByID(id);
				if (image) {
					image.x = i;
					image.y = j;
					console.log('[INFO] renderImageArr  index:' + index + " id:" + id + ":" + JSON.stringify(image));
					renderImageArr[i][j] = image;
				} else {
					console.log('[WARN] renderImageArr : index:' + index + " id:" + id + ":" + JSON.stringify(image));
				}

			}
		}
		return renderImageArr;
	}
	public static renderImageArray(renderImageArr, mapLayer: egret.DisplayObjectContainer) {
		mapLayer.removeChildren();
		for (var i = 0; i < renderImageArr.length; i++) {
			for (var j = 0; j < renderImageArr[i].length; j++) {
				var image: TileImage = renderImageArr[i][j];
				if (image) {
					ImageLoader.showAsyncByCrossUrl(mapLayer, "http://118.24.53.22:11111/" + image.source, (i * 48) - image.width + 48, (j * 32) - image.height + 32, image.width, image.height);
				}
			}
		}
	}
	public static render(map: TileMap, mapLayer: egret.DisplayObjectContainer, x, y, renderW, renderH) {

		for (var i = 0; i < map.layers.length; i++) {
			var layer: TileLayer = map.layers[i];
			// if (layer.name != "base") {
			//     continue;
			// }
			var renderRect = {
				renderRow: Math.ceil(renderW / map.tilewidth),
				renderColumn: Math.ceil(renderH / map.tileheight),
				renderOffsetX: Math.floor(x),
				renderOffsetY: Math.floor(y),
			}
			// console.log('[INFO] renderRect :' + JSON.stringify(renderRect));

			if (layer.data.dataArr) {
				var dataArr = layer.data.dataArr;
				console.log('[INFO] layer: ' + layer.name + ' data length:' + dataArr.length);
				var renderImageArr = TileMap.getRenderImageArr(map, renderRect, dataArr);//一维数组转二纬数组
				TileMap.renderImageArray(renderImageArr, mapLayer);
			} else {
				console.warn('[WARN] Not Supper DataFormat: ' + layer.data.encoding);
			}
		}
	}

}