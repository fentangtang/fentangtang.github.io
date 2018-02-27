window.onload = function () {
	var bar = document.createElement('div');
	bar.className = 'c-top-bar';
	bar.innerHTML = '<h1>'+document.title+'</h1><a href="../../"><i class="fas fa-sign-out-alt"></i> 返回</a> <a onclick="javascript:location.reload(true);"><i class="fas fa-undo"></i> 重新开始</a>';
	var app = document.getElementById('app');
	document.body.insertBefore(bar, app);
};

var V_MIXIN = {
	data () {
		return {
			c_enabledStep : true,
			currentStep : 1,
			maxSteps : 2
		}
	},
	computed : {
		showPrev () {
			if (this.currentStep <= 1 || !this.c_enabledStep)
				return false;
			return true;
		},
		showNext () {
			if (this.currentStep >= this.maxSteps || !this.c_enabledStep)
				return false;
			return true;
		}
	},
	methods : {
		cDisableStep () {
			this.c_enabledStep = false;
		},
		cEnableStep () {
			this.c_enabledStep = true;
		},
		cFreezeStep (isNext) {
			var ms = 500;
			this.c_enabledStep = false;

			if (typeof(this.stepFreezeTime) === 'object') {
				if (typeof(this.stepFreezeTime['step'+this.currentStep]) === 'object') {
					var f = this.stepFreezeTime['step'+this.currentStep];
					if (typeof(f) === 'number')
						ms = parseInt(f);
					else if (typeof(f) === 'object') {
						if (isNext && typeof(f.next) === 'number')
							ms = parseInt(f.next);
						else if (!isNext && typeof(f.prev) === 'number')
							ms = parseInt(f.prev);
					}
				}
			}
			setTimeout(()=>{this.c_enabledStep = true;}, ms);
		},
		prev () {
			if (!this.c_enabledStep)
				return;
			if (this.currentStep > 1) {
				this.currentStep --;
				this.cFreezeStep(false);
			}
			else
				return false;
			if (typeof (this['onStep'+this.currentStep]) == 'function') {
				var rt = this['onStep'+this.currentStep](false);
				if (rt == undefined)
					return true;
				return rt;
			}
			return true;
		},
		next () {
			if (!this.c_enabledStep)
				return;
			if (this.currentStep < this.maxSteps) {
				this.currentStep ++;
				this.cFreezeStep(true);
			}
			else
				return false;
			if (typeof (this['onStep'+this.currentStep]) == 'function') {
				var rt = this['onStep'+this.currentStep](true);
				if (rt == undefined)
					return true;
				return rt;
			}
			return true;
		}
	}
};
