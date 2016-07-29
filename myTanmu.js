;
(function(win, doc) {
	"use strict";

	//数据容器
	var timeOut;
	var topArray = [
		'20px',
		'50px',
		'80px',
		'110px'
	];

	var target;

	/**
	 * 
	 * @param {Object} options
	 * options.data     		------数据容器/必须
	 * options.containerId      ------屏幕区域/必须
	 * options.isLoop     		------弹幕是否支持循环/可选
	 * options.style     		------弹幕样式/必须
	 * options.topArray     	------自定义高度/可选
	 * options.appearSpeed     	------出现速度/可选
	 */
	function tanmu(options) {
		this.msgArray = options.data || [];
		this.msgTarget = 0;
		this.container = doc.getElementById(options.containerId);
		this.container.style.overflow = 'hidden';
		this.isLoop = options.isLoop || false;
		this.style = options.style;
		this.tanmuElements = [];
		this.currentTarget = 0;
		this.appearSpeed = options.appearSpeed / 40 || 60;

		topArray = options.topArray || topArray;

		this.start();
	}

	var proto = tanmu.prototype;

	proto.start = function() {
		this.createTanmuElements();
		this.goon();
	}

	proto.run = function(self) {
		if (!self.tanmuElements.length) {
			return;
		}

		target = self.msgTarget;
		//		console.log(target);

		for (var i = 0; i < self.tanmuElements.length; i++) {

			var current = self.tanmuElements[i];

			//轮询词汇
			var words = self.msgArray[self.msgTarget];

			if (self.msgTarget < self.msgArray.length) {
				self.msgTarget++;
			}

			//是否循环
			if (self.isLoop && !words && self.msgTarget >= self.msgArray.length) {
				var extra = self.msgTarget % (self.msgArray.length);
				words = self.msgArray[extra];
				self.msgTarget++;
			}

			current.innerText = words || '';

			if (!current.innerText) {
				continue;
			}

			var isShift = true;

			if (pxToNumber(current) >= self.container.offsetWidth) {

				isShift = false;

				var first = self.tanmuElements.shift();
				first.style.right = '-100%';
				first.style.top = topArray[getRandom()];
				self.tanmuElements.push(first);
				self.currentTarget--;

				//				var firsrWords=self.msgArray.shift();
				//				self.msgArray.push(firsrWords);
				//				self.msgTarget--;

				target++;
				i--;

				continue;
			}

			if (pxToNumber(self.tanmuElements[self.currentTarget]) > self.appearSpeed && self.currentTarget < self.tanmuElements.length) {
				self.currentTarget++;
			}

			if (self.currentTarget == self.tanmuElements.length) {
				self.currentTarget = 0;
			}

			if (self.currentTarget < i) {
				break;
			}

			//			if (isShift) {
			current.style.right = pxToNumber(current) + 1 + 'px';
			//			}

		}

		self.msgTarget = target;
	}

	proto.createTanmuElements = function() {
		var len = this.msgArray.length > 6 ? 6 : this.msgArray.length;
		for (var i = 0; i < len; i++) { //for (var i = 0; i < this.msgArray.length; i++) {
			//			var words = this.msgArray[this.msgTarget];
			//			this.msgTarget++;
			this.create();
		}

		return this;
	}

	proto.create = function(words) {
		var top = topArray[getRandom()];
		var element = doc.createElement('span');
		element.className += ' ' + this.style;
		//element.classList.add(this.style);//not support on ie8
		element.style.top = top;
		element.style.right = '-100%';
		//element.innerText = words;
		this.container.appendChild(element);
		//this.tanmuElements.splice(this.currentTarget + 1, 0, element);
		this.tanmuElements.push(element);

		return this;
	}

	proto.stop = function() {
		if (timeOut) {
			clearInterval(timeOut)
		}
	}

	proto.goon = function() {
		var self = this;
		if (!timeOut) {
			timeOut = setInterval(function() {
				self.run(self);
			}, 10);
		}
	}

	proto.push = function(words) {
		//this.msgArray.push(words);
		if (this.isLoop) {
			var extra = target % (this.msgArray.length);
			this.msgArray.splice(extra, 0, words);
			this.create(words);
			this.msgTarget = extra + 1; //this.msgArray.length + extra + 1;
		} else {
			this.msgArray.push(words);
		}
	}

	function getRandom() {
		return Math.floor((topArray.length - 1) * Math.random());
	}

	function pxToNumber(ele) {
		var str = ele.style.right;
		if (str == '-100%') {
			var width = ele.offsetWidth;
			return -width;
		}
		return parseInt(str.replace('px', ''));
	}

	win.myTanmu = window.myTanmu || tanmu;
})(window, document)