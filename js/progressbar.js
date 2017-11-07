var index = 0, bars_html = '', select = '', btn_html = '', num_bars = 0, barLimit = 0, num_btn = 0;

function loadDoc() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      progressBars = JSON.parse(this.responseText);
      console.log(this.responseText);
      num_bars = progressBars.bars.length;
      barLimit = progressBars.limit; 
      num_btn = progressBars.buttons.length;
      createBar();
    }
  };
  xhttp.open("GET", "http://pb-api.herokuapp.com/bars", true);
  xhttp.send();
}

loadDoc();

function createBar() 
{
  select = '<select onchange="setIndex(this.value)" class="selectpicker">';

  for(var i = 0; i < num_bars; i++) {
    var j = i + 1;
    bars_html += '<div class="myProgress" id="myProgress_'+i+'"><div class="myBar" id="bar_'+i+'"><div class="label" id="label_'+i+'">0%</div></div></div>';  
    select += '<option value="'+i+'">Progress Bar #'+j+'</option>';
  }

  select += '</select>';

  byId('allBars').innerHTML = bars_html;


  for(var i = 0; i < num_btn; i++) {
    var val = progressBars.buttons[i];
    btn_html += '<span><input type="button" class="btn btn-primary p-button" value="'+val+'" onclick="control(this)"></span>'; 
  }

  byId('controls').innerHTML = select + btn_html;

  for(var i = 0; i < num_bars; i++) {
    index = i;
    var val = progressBars.bars[i];
    move(calculatePercent(val, barLimit)); 
  }

  setIndex(0);
}

function setIndex(val)
{
  index = val;
  for(var i = 0; i < num_bars; i++) {
    byId('myProgress_'+i).classList.remove("mystyle");
  }
  byId('myProgress_'+index).classList.add("mystyle");
}

function control(obj){  
  move(parseInt(obj.value));
}

function move(value) 
{
  var elem = byId('bar_'+index), max, type = 'inc'; 
  var lab = byId('label_'+index);  
  var width = parseInt(lab.innerHTML);  
  var timer = setInterval(frame, 10);
  
  if(isNaN(width))
    width = 0;
  max = width + value;  
  
  if(max < width)
    type = 'dec';  

  function frame() {
    
      if(type == 'inc')
        width++; 
      else
        width--;

      if(width == max || max == 0)
        clearInterval(timer);

      if (width >= 0 && width <= 100) {        
        lab.innerHTML = width + '%';
        elem.style.width = width + '%';  
        elem.style.backgroundColor = '#5cb85c';      
      }
      else if (width > 100) {      
        lab.innerHTML = width + '%';
        elem.style.backgroundColor = '#d9534f';        
      }                 
  }

}

function byId(id)
{
  return document.getElementById(id);
}

function calculatePercent(val, limit)
{
  if(limit > 0) {
    return Math.round((parseFloat(val) / parseFloat(limit)) * 100);
  }
  return 0;
}