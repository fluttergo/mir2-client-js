class AnimaUtil {
	public static showMoive(frameName: string, container: egret.DisplayObjectContainer, playerCompleteCallback?: Function, isRemoveAfterComplete?: boolean, isLoop?: boolean, x?, y?, width?, high?):egret.MovieClip {
		var BombData = RES.getRes(frameName + "_mc_json");
		var BombTxtr = RES.getRes(frameName + "_tex_png");
		var mcFactory: egret.MovieClipDataFactory = new egret.MovieClipDataFactory(BombData, BombTxtr);
		var behavior2 = new egret.MovieClip(mcFactory.generateMovieClipData(frameName));
		behavior2.x = x ? x : 0;
		behavior2.y = y ? y : 0;
		behavior2.width = width ? width : container.width;
		behavior2.height = high ? high : container.height;
		behavior2.anchorOffsetX = -1 * behavior2.width / 2;
		behavior2.anchorOffsetY = -1 * behavior2.height / 2;
		behavior2.name = container ? container.name : frameName;
		container && container.addChild(behavior2);
		behavior2.addEventListener(isLoop ? egret.Event.LOOP_COMPLETE : egret.Event.COMPLETE, function (e: egret.Event): void {
			console.log('[INFO] loop con');
			if (isRemoveAfterComplete && isLoop == false) {
				container && container.removeChild(behavior2);
			}
			playerCompleteCallback && playerCompleteCallback(frameName);
		}, behavior2);
		behavior2.gotoAndPlay(0, isLoop ? -1 : 1);
		return behavior2;
	}
}