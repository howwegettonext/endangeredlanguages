jQuery(document).ready(function(){
  console.log('hi2');

    jQuery('.has-submenu').mouseenter(function(){
      console.log('hi');
      jQuery(this).addClass('open');
      jQuery(this).find('.submenu').fadeIn();

    });

    jQuery('.has-submenu').mouseleave(function(){
      var child_elem = jQuery(this).find('.submenu');
      jQuery(this).removeClass('open');
      setTimeout(function(){
        if (!jQuery(this).hasClass('open')) {
          child_elem.fadeOut();
        }
      },1000);

  });


  jQuery('.submenu').mouseenter(function(){
  jQuery(this).parents('.has-submenu').addClass('open');
  });

  jQuery('.submenu').mouseleave(function(){
    var child_elem = $(this);
    jQuery(this).parents('.has-submenu').removeClass('open');

    setTimeout(function(){
      if (!jQuery(this).parents('.has-submenu').hasClass('open')) {
        child_elem.fadeOut();
      }
    },1000);

  });
});
