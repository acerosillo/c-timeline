var isModernBrowser = false;

//list APIs here
//live
//const brandLibApiFilter = "https://veonintranet.comprend-test.com/umbraco/api/ContentApi/GetBrandLibraryItems"; 
//const newsApiFilter = "https://veonintranet.comprend-test.com/umbraco/api/ContentApi/GetNewsArticles";
//const searchApiFilter = "https://veonintranet.comprend-test.com/umbraco/api/ContentApi/GetApiSearch";//

//local
 const brandLibApiFilter = "/umbraco/api/ContentApi/GetBrandLibraryItems"; 
 const newsApiFilter = "/umbraco/api/ContentApi/GetNewsArticles";
 const searchApiFilter = "/umbraco/api/ContentApi/GetApiSearch";

document.addEventListener("DOMContentLoaded", function (event) {
  preCheck();
});

function preCheck() {
  isModernBrowser = "visibilityState" in document;
  init();
}

function callAjaxApi(dataString, itemType) {
    $('.loading-overlay').fadeIn(300);

    $.ajax({
    type: "GET",
        url: dataString,
        success: function () {
            var searchListing = $('.filtered-listing');
            searchListing.empty();
            $.getJSON(dataString, function (data) {
            var numofItems = data.length;
            if (numofItems === 0) {
              searchListing.append("<li class='news-item'><h3 class='heading-h4'>There are no results, try a different search</h3></li>").hide().fadeIn(300);
            }
            $.each(data, function (key, entry) {
                if(itemType !== 3 && itemType !== 7) {
                  searchListing.append("<li class='card'><div class='card-img'><img src=" + entry.TeaserImageUrl + " /></div><div class='card-detail'><h4 class='heading-h4'>" + entry.MainTitle + "</h4><p>" + entry.TeaserText + "</p><ul class='downloadables'><li><a href="+ entry.Url +" class='download-icon-cta'><span>ZIP</span></a></li></ul></div></li>").hide().fadeIn(300);
                } else {
                  searchListing.append("<li class='card'><div class='card-img'><img src=" + entry.TeaserImageUrl + " /></div><div class='card-detail'><h4 class='heading-h4'>" + entry.MainTitle + "</h4><p>" + entry.TeaserText + "</p><p>" + entry.VideoID + "</p><ul class='downloadables'><li><a href="+ entry.Url +" class='download-icon-cta'><span>JPG</span></a></li></ul></div></li>").hide().fadeIn(300); 
                }
            });
        });
        },
        complete: function () {
            $('.loading-overlay').fadeOut(1000);
        }
    });
    return false;
}

function init() {
  tabfunction.init();
  tabbedContent.init();
  accordionModule.init();
  burgermenu.init();
  newsPageLanding.init();
  searchNews.init();
  backToTop.init();
  searchSiteDropDown.init();
  loadMoreItems.init();
  filterSelectDropDowns.init();
}

var filterSelectDropDowns = {
    init: function () {

    var itemType;
    var dataString;
    var selectedDrop;

    if (itemType !== undefined) {
        itemType = itemType;
    } else {
        itemType = 1;
    }
    if (selectedDrop !== undefined) {
        selectedDrop = selectedDrop;
    } else {
        selectedDrop = 0;
    }


    //desktop tabs
    $(".tabs li").click(function () {
        itemType = $(this).data('type');
        
        dataString = "?datatype=" + itemType + "&categoryid=" + selectedDrop;
        $('.js-dropdown').val($(".js-dropdown option:first").val());
        var popp = brandLibApiFilter + dataString;
        callAjaxApi(popp, itemType);
    });
    //mobile tabs
    $(".tab_drawer_heading").click(function () {
        itemType = $(this).data('type');
        dataString = "?datatype=" + itemType + "&categoryid=" + selectedDrop;
        var popp = brandLibApiFilter + dataString;
        callAjaxApi(popp, itemType);
    });

    //used for logos tab dropdown
     $('.js-dropdown').change(function () {
         var selectedId = this.value;
         var selectName = this.name; 
         var dataString;

         if (selectName === "img-logos" || selectName === "img-category") {
             dataString = "?datatype=" + itemType + "&categoryid=" + selectedId;
             var popp = brandLibApiFilter + dataString;
             callAjaxApi(popp, itemType);
             return false;
         }
         if (selectName === "img-locations") {
             dataString = "?datatype=" + itemType + "&locationid=" + selectedId;
             var popp2 = brandLibApiFilter + dataString;
             callAjaxApi(popp2, itemType);
             return false;
         }
     });
        
    return false;
  }
};

var searchSiteDropDown = {
  init: function () {
    //used for onchange dropdown
    $('#search-site-dropdown').change(function () {
      var count = 0;
      var category = this.value;
      var queryString = $(".home-input").val();
      if (category == "") {
        $("#search-site-dropdown").focus();
        return false;
      }

      var dataString = '?q=' + queryString + '&filetype=' + category;

      $('.loading-overlay').fadeIn(300);
      $.ajax({
        type: "GET",
        url: searchApiFilter,
        data: dataString,
        success: function () {
          var url = searchApiFilter;
          var searchListing = $('.search-list');
          var resultsReturned = $('.js-total-count');
          var newUrl = url + dataString;
          searchListing.empty();
          resultsReturned.empty();

          $.getJSON(newUrl, function (data) {

            $.each(data, function (key, entry) {
              if (category == 5) {
                searchListing.append("<li class='sl-item'><a data-fancybox='' href='https://www.youtube.com/" + entry.Url + "'><h3 class='heading-h4'>" + entry.Title + "</h3><p>" + entry.Summary + "</p> </a></li>");
              } else if (category == 4) {
                searchListing.append("<li class='sl-item'><a href='" + entry.Url + "' target='_blank'><h3 class='heading-h4'>" + entry.Title + "</h3><p>" + entry.Summary + "</p> </a></li>");
              } else {
                searchListing.append("<li class='sl-item'><a href='" + entry.Url + "'><h3 class='heading-h4'>" + entry.Title + "</h3><p>" + entry.Summary + "</p> </a></li>");
              }
              count++;
            });

            resultsReturned.append("A total of " + count + " results were found matching your search for: <strong class='heading-h4'>" + queryString + "</strong>");

            //call pagination function
            SetUpPagination();
            DoPagination(1);
          });

          },
          complete: function () {
              $('.loading-overlay').fadeOut(1000);
          }
      });
      return false;

    });
  }
};

var accordionModule = {
  init: function () {
    //Accordion
    var acc = document.getElementsByClassName("accordion");
    var i;

    for (i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", function (ev) {
        closeAll(ev.target);
        this.parentNode.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    }

    function closeAll(tar) {
      var accs = document.querySelectorAll(".accordion");
      for (var i = 0; i < accs.length; i++) {
        if (accs[i] == tar) {
          continue;
        }
        accs[i].parentNode.classList.remove("active");
        var panel = accs[i].nextElementSibling;
        panel.style.maxHeight = null;
      }
    }
  }
};

var backToTop = {
  init: function () {

    lastScroll = 0;
    $(window).on('scroll', function () {
      var scroll = $(window).scrollTop();

      if ($(this).scrollTop() > 20 && !$(".hamburger").hasClass("is-active")) {
        $('.main-header-wrapper').addClass("hidden"); // Fading in the button on scroll after 150px
      }

      if (lastScroll - scroll > 0) {
        $(".main-header-wrapper").addClass("visible").removeClass("hidden");
      } else {
        $(".main-header-wrapper").removeClass("visible");
      }
      lastScroll = scroll;
    });


    $(window).scroll(function (e) {
      if ($(this).scrollTop() > 1000) {
        $('.back-to-top').addClass("visible"); // Fading in the button on scroll after 150px
      } else {
        $('.back-to-top').removeClass("visible"); // Fading out the button on scroll if less than 150px
      }
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 90) {
        $('.back-to-top').addClass("static");
      } else {
        $('.back-to-top').removeClass("static");
      }
    });

      $('.back-to-top').click(function (e) {
          e.preventDefault();
      $('body, html').animate({
        scrollTop: 0
      }, 800);
    });

  }
};

var searchNews = {
  init: function () {

    //reset form
    $(".cta-search-reset").click(function () {
 
      var catDropdown = $('#cat-dropdown');
      var yearDropdown = $('#year-dropdown');
      catDropdown.prop('selectedIndex', 0);
      yearDropdown.prop('selectedIndex', 0);

      $('.loading-overlay').fadeIn(300);
      $.ajax({
        type: "GET",
        url: newsApiFilter,
        success: function () {
          var url = newsApiFilter;
          var newsListing = $('#news-listing');
          newsListing.empty();
          $.getJSON(url, function (data) {
            var numofItems = data.length;
            if (numofItems === 0) {
              newsListing.append("<li class='news-item'><h3 class='heading-h4'>There are no results, try a different search</h3></li>");
            }
              $.each(data, function (key, entry) {
                  var date = new Date(entry.PubDate);
                  var day = date.getDate();
                  var year = date.getFullYear();

                  var month = new Array();
                  month[0] = "January";
                  month[1] = "February";
                  month[2] = "March";
                  month[3] = "April";
                  month[4] = "May";
                  month[5] = "June";
                  month[6] = "July";
                  month[7] = "August";
                  month[8] = "September";
                  month[9] = "October";
                  month[10] = "November";
                  month[11] = "December";
                  var n = month[date.getMonth()];

                  newsListing.append("<li class='news-item'><div class='news-img'><img src='" + entry.TeaserImageUrl + "?anchor=center&mode=crop&width=500&height=500'></div><div class='news-blurb'><date class='date'>" +
                      day + " " + n + " " + year + "</date> <h3 class='heading-h3'>" + entry.MainTitle + "</h3><a href='" + entry.Url + "' class='veon-cta-readmore dark cta-overlay'>Read More</a></div></li>").hide().fadeIn(500);
              });
            });
            
          },
          complete: function () {
              $('.loading-overlay').fadeOut(1000);
          }
        });

        setTimeout(function () {
            loadMoreItems.init();
        }, 1000);
        
      return false;
    });

    //search news
    $(".cta-search-news-submit").click(function () {

      var numItems = $('.news-listing li').length;
      var counted = $('.news-listing li.active').length;

      if (counted <= numItems) {
        $(".load-more").hide();
      }

      var category = $("#cat-dropdown").val();
      if (category === "") {
        $("#cat-dropdown").focus();
        return false;
      }
      var year = $("#year-dropdown").val();
      if (year === "") {
        $("#year-dropdown").focus();
        return false;
      }

      var dataString = '?year=' + year + '&categoryid=' + category;

      $('.loading-overlay').fadeIn(300);
      $.ajax({
        type: "GET",
        url: newsApiFilter,
        data: dataString,
        success: function () {
          var newsListing = $('#news-listing');
          var newUrl = newsApiFilter + dataString;
            newsListing.empty();

          $.getJSON(newUrl, function (data) {
            var numofItems = data.length;
            if (numofItems == 0) {
              newsListing.append("<li class='news-item'><h3 class='heading-h4'>There are no results, try a different search</h3></li>");
            }
            $.each(data, function (key, entry) {


              var date = new Date(entry.PubDate);
              var day = date.getDate();
              var year = date.getFullYear();

              var month = new Array();
              month[0] = "January";
              month[1] = "February";
              month[2] = "March";
              month[3] = "April";
              month[4] = "May";
              month[5] = "June";
              month[6] = "July";
              month[7] = "August";
              month[8] = "September";
              month[9] = "October";
              month[10] = "November";
              month[11] = "December";
              var n = month[date.getMonth()];

              newsListing.append("<li class='news-item active'><div class='news-img'><img src='" + entry.TeaserImageUrl + "?anchor=center&mode=crop&width=500&height=500'></div><div class='news-blurb'><date class='date'>" +
                day + " " + n + " " + year + "</date> <h3 class='heading-h3'>" + entry.MainTitle + "</h3><a href='" + entry.Url + "' class='veon-cta-readmore dark cta-overlay'>Read More</a></div></li>").hide().fadeIn(500);
            })
          });

          },
          complete: function () {
              $('.loading-overlay').fadeOut(1000);
          }
      });
      return false;
    });

  }
};

var newsPageLanding = {
  init: function () {

    var catDropdown = $('#cat-dropdown');
    var yearDropdown = $('#year-dropdown');
    catDropdown.empty();
    yearDropdown.empty();

    var catUrl = 'https://veonintranet.comprend-test.com/umbraco/api/ContentApi/GetNewsCategories';
    $.getJSON(catUrl, function (data) {
      $.each(data, function (key, entry) {
        catDropdown.append($('<option></option>').attr('value', entry.Id).text(entry.Name));
      })
    });

    var yearsUrl = 'https://veonintranet.comprend-test.com/umbraco/api/ContentApi/GetNewsYears';
    $.getJSON(yearsUrl, function (data) {
      $.each(data, function (key, entry) {
        yearDropdown.append($('<option></option>').attr('value', entry).text(entry));
      })
    });

    catDropdown.append('<option selected="true" disabled>Choose Category</option>');
    yearDropdown.append('<option selected="true" disabled>Choose Year</option>');
    catDropdown.prop('selectedIndex', 0);
    yearDropdown.prop('selectedIndex', 0);

  }
};

var tabfunction = {
  init: function () {
    //Tabs
    var tabLinks = document.querySelectorAll(
      ".services-tab__link-item, .timeline-tab__link-item"
    );
    var tabContents = document.querySelectorAll(
      ".services-tab__tab-item, .timeline-tab__tab-item"
    );

    // Loop through the tab link
    for (var i = 0; i < tabLinks.length; i++) {
      tabLinks[i].addEventListener("click", function (e) {
        e.preventDefault();
        var id = this.hash.replace("#", "");

        // Loop through the tab content
        for (var j = 0; j < tabContents.length; j++) {
          var tabContent = tabContents[j];
          tabContent.classList.remove("is-visible");
          tabLinks[j].classList.remove("is-active");
          if (tabContent.id === id) {
            tabContent.classList.add("is-visible");
          }
        }

        this.classList.add("is-active");
      });
    }
  }
};

var tabbedContent = {
  init: function () {

    $(".tab_content").hide();
    if ($(window).width() > 720) {
      $(".tab_content:first").show();
    } else {
      $(".tab_content:first").hide();
    }

    //desktop interactions
    $("ul.tabs li").on("click", function () {
      $(".tab_content").hide();
      var activeTab = $(this).attr("rel");
      $("#" + activeTab).fadeIn();
      $("ul.tabs li").removeClass("active");
      $(this).addClass("active");
    });

    //tablet/iphone interactions
    $(".qa").on("click", function () {
      $(".tab_content").hide();
      var d_activeTab = $(this).attr("rel");

      //used to rotate plus sign
      $(this).find(".qa-toggle").toggleClass("toggled");


      $("#" + d_activeTab).slideToggle();
      $(".tab_content").removeClass("active");
      $(this).toggleClass("active");
      $("#" + d_activeTab).toggleClass("active");

      if (!$(".tab_content").hasClass("active")) {
        $(".tab_content").hide();
      }

    });

  }
};

var burgermenu = {
  init: function () {

    var hamburger = document.querySelector(".hamburger");

    if (hamburger) {
      // Look for .hamburger
      document.querySelector(".hamburger");

      // On click
      hamburger.addEventListener("click", function () {
        hamburger.classList.toggle("is-active");
        document.querySelector(".primary-nav").classList.toggle("is-active");
      });
      $(".expand-menu").click(function () {
        $(this)
          .parent()
          .toggleClass("active")
          .siblings()
          .removeClass("active");
      });
    }

  }
};

var loadMoreItems = {
    init: function () {

        var checkForm = 0;

    //show button to begin with.
    $(".load-more").show();
    var numItems = $('.js-listing li').length;
    $(".js-listing li").hide();

    //click load more
    $(".load-more").on("click", function () {
      event.preventDefault();
      $(".js-listing li:lt(3)").show();
      $(".js-listing").find("li:hidden:lt(9)").fadeIn(500).addClass("active");
      var counted = $('.js-listing li.active').length;
      if (counted >= numItems) {
        $(".load-more").hide();
      }
    });
    $(".js-listing li:lt(9)").show().addClass("active");

        //Form submission overlay
        $(".form-submit-cta").on("click", function () {
            if (checkForm) {
                $('.loading-overlay').fadeIn(300);
            } else {
                $('.loading-overlay').fadeOut(300);
            }
        });

        $(".form-control > label > input").on("click", function () {
            checkForm = 1;
        });
  }
};