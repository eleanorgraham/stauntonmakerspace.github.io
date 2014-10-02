/*!
 * Meetup Badge Java Script
 * taken from http://www.meetup.com/meetup_api/foundry/#meetup-group-stats
 */

  var $parameters = {
    _name: "Meetup Group Stats",
    width: "225",
    urlname: "Staunton-Makerspace",
    height: "570"
  };
  var $queries = {
    events: function() { return "http://api.meetup.com/2/events?group_urlname=Staunton-Makerspace&page=1&sig_id=12706655&sig=0e587e1c278f48e31076e865ec89bbf13f231cd3&callback=?" },
    groups: function() { return "http://api.meetup.com/2/groups?group_urlname=Staunton-Makerspace&sig_id=12706655&sig=8c29e154099c1a562d6fea7649e4f9d95ff900ae&callback=?" }
  };
  var mup_widget = {
     with_jquery: function(block) {
        block(jQuery, document.body);
     }
  };

mup_widget.with_jquery(function($, ctx) {
		var	group = '',
				months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
				addLink = function(content, link) {
						return '<a target="_top" href="' + link + '">' + content + '</a>';
	      },
        addImage = function(src, alt) {
           return src == "" ? '' : '<div class="mup-img-wrap"><img src="'+src+'" width="'+($parameters.width - 50)+'" alt="'+alt+'" class="mup-img"></div>';
        },
                addStarRating = function(rating) {
                        var base_url = 'http://img1.meetupstatic.com/9260736631256287675/img/star_';
                        var starlink = '';
                        if (rating == 0) {
                            return 'Not Yet Rated';
                        }else if (rating < 1.25) {
                            starlink = "100.png";
                        }else if (rating < 1.75) {
                            starlink = "150.png";
                        }else if (rating < 2.25) {
                            starlink = "200.png";
                        }else if (rating < 2.75) {
                            starlink = "250.png";
                        }else if (rating < 3.25) {
                            starlink = "300.png";
                        }else if (rating < 3.75) {
                            starlink = "350.png";
                        }else if (rating < 4.25) {
                            starlink = "400.png";
                        }else if (rating < 4.75) {
                            starlink = "450.png";
                        }else {
                            starlink = "500.png";
                        }
                        return '<img src="'+base_url+starlink+'" alt="'+rating+'">';
                    },
				addLeadingZero = function( num ) {
						return (num < 10) ? ('0' + num) : num;
					},
				getFormattedDate = function( millis ) {
						var date = new Date( millis );
						return  months[date.getMonth()] + ' ' + addLeadingZero( date.getDate() ) + ', ' + date.getFullYear().toString();
					},
				getFormattedTime = function( millis ) {
						var	time = new Date( millis ),
								hours = time.getHours(),
								min = time.getMinutes(),
								ampm = (hours > 11) ? 'PM' : 'AM';
						min = (min < 10) ? ('0' + min) : min;
						hours = (hours == 0) ? 1 : hours;
						hours = (hours > 12) ? hours-12 : hours;
						return hours + ':' + min + ' ' + ampm;
					},
				numberFormat = function(nStr){
					  nStr += '';
					  x = nStr.split('.');
					  x1 = x[0];
					  x2 = x.length > 1 ? '.' + x[1] : '';
					  var rgx = /(\d+)(\d{3})/;
					  while (rgx.test(x1))
					    x1 = x1.replace(rgx, '$1' + ',' + '$2');
					  return x1 + x2;
					};
					
		$.getJSON($queries.groups(), function(data) {
	    if (data.results.length == 0) {
		  	$('.mug-badge', ctx).width($parameters.width);
				$('.mug-badge', ctx).append(
					'<div class="mup-widget error">\
							<div class="errorMsg">Oops. No results for "' + $parameters.urlname + '"</div>\
					</div>');
	    }
			else {
			group = data.results[0];
			$('.mug-badge', ctx).width($parameters.width);
			$('.mug-badge', ctx).append(
				'<div class="mup-widget">\
					<div class="mup-bd">\
						<h3>' + addLink(group.name, group.link) + '</h3>\
            <h4> <div style="padding-top:5px;"><span class="mup-tlabel">EST. '+ getFormattedDate(group.created)+'</span></div></h4>\
						<span class="mup-stats">' + addImage(group["group_photo"] ? group.group_photo.photo_link : "", group.name) + numberFormat(group.members) + '<span class="mup-tlabel"> '+ group.who+'</span></span>\
            <span class="mup-stats"><div class="next-event"></div></span>\
            <h4><span class="mup-button">'+ addLink('JOIN',group.link)+'</span></h4>\
					</div>\
					<div class="mup-ft">\
						<div class="mup-logo"><div style="float:left;">'+addLink('<img src="http://img1.meetupstatic.com/84869143793177372874/img/birddog/everywhere_widget.png">','http://www.meetup.com')+'</div><div style="float:right;"><div style="float:right;">'+addStarRating(group.rating)+'</div><br><div style="float:right;"><span class="mup-tlabel">Group Rating</span></div></div></div>\
						<div class="mup-getwdgt">' + addLink('ADD THIS TO YOUR SITE', 'http://www.meetup.com/meetup_api/foundry/#'+$parameters._name.toLowerCase().replace(/ /g,"-")) + '</div>\
					</div>\
				</div>'
				);

	      $.getJSON($queries.events(), function(data) {
	        if (data.status && data.status.match(/^200/) == null) {
	          alert(data.status + ": " + data.details);
	        } else {
	            if (data.results.length == 0) {
		             $('.next-event', ctx).append('<span class="mup-tlabel">'+addLink('Suggest new ideas for Meetups!',group.link)+'</span>');
	            } else {
                    var event = data.results[0];
     console.log(event)
                    var venue = event.venue;
     console.log(venue)
                    var city;
                    if (!venue || !venue.city) {
                        city = group.city;
                    } else {
                        city = venue.city;
                    }
                    var state_country;
                    if (!venue || !venue.state) {
                        if (group.state == "") {
                            state_country = group.country.toUpperCase();
                        } else {
                            state_country = group.state;
                        }
                    } else {
                        state_country = venue.state;
                    }
                    var venue_addr;
                    if (venue) {
                        if (venue.name !== undefined) {
                            venue_addr = venue.name  + " - ";
                        } else if (venue.address_1 !== undefined) {
                            venue_addr = venue.address_1 + " - ";
                        } else {
                            venue_addr = "";
                        }
                    } else {
                       venue_addr = "";
                    }
                    var location = venue_addr + city + ", " + state_country;
                    $('.next-event', ctx).append('<h4><div class="mup-tlabel">'+getFormattedDate(event.time) + ' &nbsp; | &nbsp; ' + getFormattedTime(event.time) + "</div>" + addLink(event.name, event.event_url)+'<div class="mup-tlabel">' + location + "</div></h4>");
                }
            }
            });
	    }
	  });
	});
