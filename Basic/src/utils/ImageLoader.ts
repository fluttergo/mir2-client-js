class ImageLoader {
	public constructor() {
	}
	/**
	 * 从缓存中加载图片,如果缓存中没有,则下载图片并放入缓存,再显示
	 */
	public static showAsync(image: egret.Bitmap, name: string) {
		RES.getResAsync(name, function (result: egret.Texture) {
			image.texture = result;
		}, image);
	}
	/**
	 * 从缓存中加载图片,如果缓存中没有,加载失败
	 */
	public static show(image: egret.Bitmap, name: string) {
		image.texture = RES.getRes(name);
	}
	/**
	 * 加载远程服务器上的资源
	 */
	public static showAsyncByUrl(image: egret.DisplayObjectContainer, url: string, x?: number, y?: number, w?: number, h?: number) {
		// RES.getResByUrl(url:string,compFunc:Function,thisObject:any,type:string=””):void
		var loader: egret.ImageLoader = new egret.ImageLoader()
		loader.crossOrigin = "anonymous";
		var callback = function (e: egret.Event) {
			var bitmapData: egret.BitmapData = (<egret.ImageLoader>e.target).data;
			var texture = new egret.Texture();
			texture.bitmapData = bitmapData;
			var bitmap = new egret.Bitmap(texture);
			bitmap.x = x || 0;
			bitmap.y = y || 0;
			bitmap.width = w || texture.textureWidth;
			bitmap.height = h || texture.textureWidth;
			image.addChild(bitmap);
		};
		loader.once(egret.Event.COMPLETE, callback, this);
		loader.load(url);
	}


}