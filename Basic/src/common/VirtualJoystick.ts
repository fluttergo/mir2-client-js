class VirtualJoystick extends eui.Component {

	public static Arrow = {
		UP: "UP", RIGHT_UP: "RIGHT_UP",
		RIGHT: "RIGHT", RIGHT_DOWN: "RIGHT_DOWN",
		DOWN: "DOWN", LEFT_DOWN: "LEFT_DOWN",
		LEFT: "LEFT", LEFT_UP: "LEFT_UP"
	};
	public static AngleRange = [45, 90, 135, 180, 225, 270, 315, 360];
	
	public static AngleRangeArrow = [
		VirtualJoystick.Arrow.UP, VirtualJoystick.Arrow.RIGHT_UP,
		VirtualJoystick.Arrow.RIGHT, VirtualJoystick.Arrow.RIGHT_DOWN,
		VirtualJoystick.Arrow.DOWN, VirtualJoystick.Arrow.LEFT_DOWN,
		VirtualJoystick.Arrow.LEFT, VirtualJoystick.Arrow.LEFT_UP
	];

	private ball: eui.Image = new eui.Image("joystick4_png");          //圆环
	private circle: eui.Image = new eui.Image("joystick2_png");        //小球
	private circleRadius: number = 0; //圆环半径
	private ballRadius: number = 0;   //小球半径
	private centerX: number = 0;      //中心点坐标
	private centerY: number = 0;
	private touchID: number;          //触摸ID
	private root: egret.DisplayObject;
	public constructor() {
		super();
		this.skinName = "VirtualJoystickSkin";
		this.addChild(this.circle);
		this.addChild(this.ball);
	}

	public childrenCreated() {
		this.root = this.parent;
		//获取圆环和小球半径
		this.circleRadius = this.circle.height / 2;
		this.ballRadius = this.circle.height / 2 / 2;

		this.centerX = this.x + 50;
		this.centerY = this.parent.height - this.circle.height - 50;


		this.ball.width = this.ballRadius * 2;
		this.ball.height = this.ballRadius * 2;

		this.ball.x = this.circleRadius - this.ballRadius;
		this.ball.y = this.circleRadius - this.ballRadius;

		this.anchorOffsetX = this.circleRadius;
		this.anchorOffsetY = this.circleRadius;

		this.root.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
		this.root.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
		this.root.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
	}

	//停止虚拟摇杆
	public destory() {
		this.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
		this.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
		this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
	}

	//触摸开始，显示虚拟摇杆
	private onTouchBegin(e: egret.TouchEvent) {
		// if (this.parent) {
		// 	return;
		// }
		this.show();
		this.touchID = e.touchPointID;
		this.x = e.stageX;
		this.y = e.stageY;
		this.ball.x = this.circleRadius - this.ballRadius;
		this.ball.y = this.circleRadius - this.ballRadius;
		this.dispatchEvent(new egret.Event("vj_start"));
	}

	//触摸结束，隐藏虚拟摇杆
	private onTouchEnd(e: egret.TouchEvent) {
		if (this.touchID != e.touchPointID) {
			return;
		}
		this.hide();
		this.dispatchEvent(new egret.Event("vj_end"));
	}

	//触摸移动，设置小球的位置
	private p1: egret.Point = new egret.Point();
	private p2: egret.Point = new egret.Point();
	private onTouchMove(e: egret.TouchEvent) {
		if (this.touchID != e.touchPointID) {
			return;
		}
		//获取手指和虚拟摇杆的距离
		this.p1.x = this.x;
		this.p1.y = this.y;
		this.p2.x = e.stageX;
		this.p2.y = e.stageY;
		var dist = egret.Point.distance(this.p1, this.p2);
		var angle: number = this.angle(this.p1, this.p2);



		// if (dist <= this.circleRadius) {//手指距离在圆环范围内
		this.ball.x = (this.circleRadius - this.ballRadius) + this.p2.x - this.x;
		this.ball.y = (this.circleRadius - this.ballRadius) + this.p2.y - this.y;
		// } 
		var arrow;

		// console.log('[INFO] angle:' + angle);
		for (var i = 0; i < VirtualJoystick.AngleRange.length; i++) {
			if (angle <= VirtualJoystick.AngleRange[i]) {
				arrow = VirtualJoystick.AngleRangeArrow[i];
				break;
			}
		}
		//派发事件
		this.dispatchEventWith("vj_move", false, { angle: angle, arrow: arrow });
	}
	//亮点正Y轴之间的角度
	private angle(start, end) {
		var px = start.x, py = start.y, mx = end.x, my = end.y;
		var x = Math.abs(px - mx);
		var y = Math.abs(py - my);
		var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
		var cos = y / z;
		var radina = Math.acos(cos);//用反三角函数求弧度
		var angle = Math.floor(180 / (Math.PI / radina));//将弧度转换成角度
		if (mx > px && my > py) {//鼠标在第四象限
			angle = 180 - angle;
		}
		if (mx == px && my > py) {//鼠标在y轴负方向上
			angle = 180;
		}
		if (mx > px && my == py) {//鼠标在x轴正方向上
			angle = 90;
		}
		if (mx < px && my > py) {//鼠标在第三象限
			angle = 180 + angle;
		}
		if (mx < px && my == py) {//鼠标在x轴负方向
			angle = 270;
		}
		if (mx < px && my < py) {//鼠标在第二象限
			angle = 360 - angle;
		}
		return angle;
	}
	private hide() {
		this.visible = false;
	}
	private show() {
		this.visible = true;
	}

}