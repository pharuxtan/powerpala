const SettingsModal = powerpala.app.components.SettingsModal;

class LauncherSlider {
  constructor(id){
    this.startX = 0;
    this.x = 0;

    this.slider = document.getElementById(id);
    this.touchLeft = this.slider.querySelector('.slider-touch-left');
    this.touchRight = this.slider.querySelector('.slider-touch-right');
    this.lineSpan = this.slider.querySelector('.slider-line span');

    this.min = parseFloat(this.slider.getAttribute('se-min'));
    this.max = parseFloat(this.slider.getAttribute('se-max'));

    this.minValue = parseFloat(this.slider.getAttribute('se-min-value'));
    this.maxValue = parseFloat(this.slider.getAttribute('se-max-value'));

    this.step = 1;

    this.normalizeFact = 20;

    this.reset();

    this.maxX = this.slider.offsetWidth - this.touchRight.offsetWidth;
    this.selectedTouch = null;
    this.initialValue = this.lineSpan.offsetWidth - this.normalizeFact;

    this.setMinValue(this.minValue);
    this.setMaxValue(this.maxValue);

    this.touchLeft.addEventListener('mousedown', (event) => {this.onStart(event.path[1], event)});
    this.touchRight.addEventListener('mousedown', (event) => {this.onStart(event.path[1], event)});
    this.touchLeft.addEventListener('touchstart', (event) => {this.onStart(event.path[1], event)});
    this.touchRight.addEventListener('touchstart', (event) => {this.onStart(event.path[1], event)});
  }

  reset(){
    this.touchLeft.style.left = '0px';
    this.touchRight.style.left = (this.slider.offsetWidth - this.touchLeft.offsetWidth) + 'px';
    this.lineSpan.style.marginLeft = '0px';
    this.lineSpan.style.width = (this.slider.offsetWidth - this.touchLeft.offsetWidth) + 'px';
    this.startX = 0;
    this.x = 0;
  }

  setMinValue(minValue){
    let ratio = (minValue - this.min) / (this.max - this.min);
    this.touchLeft.style.left = Math.ceil(ratio * (this.slider.offsetWidth - (this.touchLeft.offsetWidth + this.normalizeFact))) + 'px';
    this.lineSpan.style.marginLeft = this.touchLeft.offsetLeft + 'px';
    this.lineSpan.style.width = (this.touchRight.offsetLeft - this.touchLeft.offsetLeft) + 'px';
  }

  setMaxValue(maxValue){
    var ratio = (maxValue - this.min) / (this.max - this.min);
    this.touchRight.style.left = Math.ceil(ratio * (this.slider.offsetWidth - (this.touchLeft.offsetWidth + this.normalizeFact)) + this.normalizeFact) + 'px';
    this.lineSpan.style.marginLeft = this.touchLeft.offsetLeft + 'px';
    this.lineSpan.style.width = (this.touchRight.offsetLeft - this.touchLeft.offsetLeft) + 'px';
  }

  onStart(elem, event){
    event.preventDefault();

    if(elem === this.touchLeft)
      this.x = this.touchLeft.offsetLeft;
    else
      this.x = this.touchRight.offsetLeft;

    this.startX = event.pageX - this.x;
    this.selectedTouch = elem;

    this.func1 = (event) => {this.onMove(event)};
    this.func2 = (event) => {this.onStop(event)};

    document.addEventListener('mousemove', this.func1);
    document.addEventListener('mouseup', this.func2);
    document.addEventListener('touchmove', this.func1);
    document.addEventListener('touchend', this.func2);
  }

  onMove(event){
    this.x = event.pageX - this.startX;

    if(this.selectedTouch === this.touchLeft){
      if(this.x > this.touchRight.offsetLeft - this.selectedTouch.offsetWidth - 24)
        this.x = this.touchRight.offsetLeft - this.selectedTouch.offsetWidth - 24;
      else if(this.x < 0)
        this.x = 0;

      this.selectedTouch.style.left = this.x + 'px';
    } else if(this.selectedTouch === this.touchRight){
      if(this.x < this.touchLeft.offsetLeft + this.touchLeft.offsetWidth + 24){
        this.x = this.touchLeft.offsetLeft + this.touchLeft.offsetWidth + 24;
      } else if(this.x > this.maxX)
        this.x = this.maxX;

      this.selectedTouch.style.left = this.x + 'px';
    }

    this.lineSpan.style.marginLeft = this.touchLeft.offsetLeft + 'px';
    this.lineSpan.style.width = this.touchRight.offsetLeft - this.touchLeft.offsetLeft + 'px';

    this.calculateValue();
  }

  onStop(event){
    document.removeEventListener('mousemove', this.func1);
    document.removeEventListener('mouseup', this.func2);
    document.removeEventListener('touchmove', this.func1);
    document.removeEventListener('touchend', this.func2);

    this.selectedTouch = null;

    this.calculateValue();
  }

  calculateValue(){
    let newValue = (this.lineSpan.offsetWidth - this.normalizeFact) / this.initialValue;
    let minValue = this.lineSpan.offsetLeft / this.initialValue;
    let maxValue = minValue + newValue;

    minValue = minValue * (this.max - this.min) + this.min;
    maxValue = maxValue * (this.max - this.min) + this.min;

    if(this.step != 0.0){
      let multi = Math.floor(minValue / this.step);
      minValue = this.step * multi;

      multi = Math.floor(maxValue / this.step);
      maxValue = this.step * multi;

      if(minValue !== maxValue){
        this.minValue = minValue;
        this.maxValue = maxValue;
      }
    }

    this.onChange && this.onChange(this.minValue, this.maxValue);
  }
}

let firstTime = true;

onWeakMapSet((key) => {
  if("name" in key && key.name === "DoubleSliderComponent" && firstTime){
    firstTime = false;
    key.mounted = function mounted(){
      this.instance = new LauncherSlider("double-slider-" + this.id);
      this.instance.onChange = (min, max) => this.updateValues(min, max);
    };
  }
});

let _beforeMount = SettingsModal.beforeMount;
SettingsModal.beforeMount = async function beforeMount(){
  await _beforeMount.call(this);
  this.totalMem = Math.ceil(await window.electron.getTotalMem() / 1073741824);
  this.freeMem = Math.round(await window.electron.getFreeMem() / 1073741824 * 10) / 10;
}
