// experiments http://bit.ly/2QCjk6a

WebFontConfig = {
    google:{ families: ['Righteous'] },
    active: function(){FiveOhFiveFont();},
  };
  (function(){
    let wf = document.createElement("script");
    wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.5.10/webfont.js';
    wf.async = 'true';
    document.head.appendChild(wf);
  })();
  
  
  let FiveOhFive = document.getElementById("five");
  let FiveOhFiveContext = FiveOhFive.getContext("2d");
  FiveOhFiveFont(FiveOhFiveContext, FiveOhFive); FiveOhFiveContext.globalCompositeOperation = 'destination-out';
  
  function FiveOhFiveFont(ctx, canvas) {
    FiveOhFiveContext.fillText("500", 275, 100);
    let grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#000');
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.fillStyle = "red";
    ctx.font = "15em Righteous";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
  }
  
  
  let WrapperW = $('.Wrapper').width();
  let WrapperH = $('.Wrapper').height();
  
  $('.left').click(function() {    
    for (let j = 1; j <= 500; j++){        
      let X = (Math.random()*WrapperW)%(WrapperW>>0);
      let Y = (Math.random()*WrapperH)%(WrapperH>>0);
      let nTop = Math.floor((Math.random()*WrapperW));
      let nLeft = Math.floor(((Math.random()*WrapperH)));
      let $child = $(this).clone();       
  
    $('.Wrapper').append($child);
      $child.css({ top:X, left: -200+Y })
        .animate({ top: nTop+'px', left:50+nLeft+'px' }, 8000)}
  });
  
  $('.right').click(function() {    
    for (let j = 1; j <= 500; j++){        
      let X = (Math.random()*WrapperW)%(WrapperW>>0);
      let Y = (Math.random()*WrapperH)%(WrapperH>>0);
      let nTop = Math.floor((Math.random()*WrapperW));
      let nLeft = Math.floor(((Math.random()*WrapperH)));
      let $child = $(this).clone();       
  
      $('.Wrapper').append($child);
      $child.css({ top:X, left: 500+Y })
        .animate({ top: nTop+'px', left:270+nLeft+'px' }, 8000)}                   
  });
  
  
  $("document").ready(function() {
    $(".Wrapper,h1,p").fadeIn(100);
    setTimeout(function() {
      $(".right, .left").trigger('click');
    },0);
  });