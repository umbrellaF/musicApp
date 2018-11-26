window.onload = function () {

	function getId(id) {
		return document.getElementById(id);
	}

	var isLoadAudio = false;

	var layer = getId('layer');

	var mask = getId('mask');

	var maskWidth = mask.clientWidth;

	var progressParent = getId('progressParent');
	var progressParentWidth = progressParent.clientWidth;

	var offsetLeft = getId('controls').offsetLeft;

	var progress = getId('progress');

	function moveMask(e) {

		var pageX = e.touches[0].pageX;

		var x = pageX - offsetLeft - maskWidth / 2;

		var maxX = progressParentWidth - maskWidth / 2;

		var minX = -maskWidth / 2;

		x = x >= maxX ? maxX : x <= minX ? minX : x;

		mask.style.left = x + 'px';

		progress.style.width = x + maskWidth / 2 + 'px';

		audio.currentTime = (x + maskWidth / 2) / progressParentWidth * audio.duration;

	}


	layer.ontouchstart = function (e) {

		if (!isLoadAudio) {return;};
		moveMask(e);

	}

	layer.ontouchmove = function (e) {

		if (!isLoadAudio) {return;};
		moveMask(e);

	}

	var isPlay = false;
	$('#play').on('click', function () {

		var mode = $('#playMode').data('mode');
		if (mode == 'exchange') {

			played();

		} else if(mode == 'loop') {

			simpleLoopPlay();

		} else if (mode == 'random') {

			randomPlay();
		}

		var $i = $(this).find('.playing-i');
		if (isPlay) {

			$i.removeClass('fa-pause').addClass('fa-play');
			isPlay = false;

			audio.pause();

			$('#list').find('li.audio-active').find('i').removeClass('fa-pause').addClass('fa-play').end().data('play', false);

			$('#photo').css({'animation-play-state': 'paused'});
		} else {

			$i.removeClass('fa-play').addClass('fa-pause');
			isPlay = true;

			audio.play();

			$('#list').find('li.audio-active').find('i').removeClass('fa-play').addClass('fa-pause').end().data('play', true);

			$('#photo').css({'animation-play-state': 'running'});

			var imgSrc = $('#list').find('li.audio-active').find('.auto-img').attr('src');
			$('#singerImg').find('.auto-img').attr('src', imgSrc);

			console.log($('#photo'));

			$('#photo').css({'background-image': 'url(' + imgSrc + ')'});
		}

	})

	$('#playMode').on('click', function () {
		$('#playModeMore').slideToggle(300);
		$('#modifyVolume').slideUp(300);
	})

	$('#volume').on('click', function (e) {

		$('#playModeMore').slideUp(300);

		if ($(e.target).attr('id') == 'volumeLayer') {
			return;
		}

		$('#modifyVolume').slideToggle(300);
		
	})

	$('#singerImg').on('click', function () {
		$('#photography').toggle(300);
	})

	$('#close').on('click', function () {
		$('#photography').toggle(300);
	})

	var volumeMask = getId('volumeMask');
	var volumeMaskHeight = parseInt(window.getComputedStyle(volumeMask).height);

	var $modifyVolume = $('#modifyVolume');
	var height = $modifyVolume.innerHeight();

	var $volumeLayer = $('#volumeLayer');
	var volumeLayerHeight = $volumeLayer.height();

	var musicControl = getId('musicControl');
	var offsetTop = musicControl.offsetTop - height + (height - volumeLayerHeight) / 2 + 30;

	var volumeNotActiveHeight = $('#volumeNotActive').height();

	var volumeActive = getId('volumeActive');

	var volumeLayer = getId('volumeLayer');
	volumeLayer.ontouchstart = function (e) {
		moveVolumeMask(e);
	}

	volumeLayer.ontouchmove = function (e) {
		moveVolumeMask(e);
	}

	function moveVolumeMask(e) {
		e.preventDefault();

		var pageY = e.touches[0].pageY;

		var y = pageY - offsetTop - volumeMaskHeight / 2;

		var maxY = volumeNotActiveHeight + volumeMaskHeight / 2 +　3;

		var minY = 9;

		y = y >= maxY ? maxY : y <= minY ? minY : y;

		volumeMask.style.top = volumeNotActiveHeight - y + 2 * minY + 'px';

		volumeActive.style.height = volumeNotActiveHeight - y - minY + 2 * minY + 'px';

		var percent = (volumeNotActiveHeight - y - minY + 2 * minY) / volumeNotActiveHeight;

		audio.volume = percent;

	}


	var audio = $('#audio')[0];
	var volume = audio.volume;
	volumeMask.style.top = (volumeNotActiveHeight - volumeMaskHeight / 2 + 18) * volume + 'px';
	volumeActive.style.height = volumeNotActiveHeight * volume + 'px';


	var $play = $('#play');

	var $lis = $('#list>li');
	$lis.on('click', function () {

		isLoadAudio = true;

		if (!$(this).hasClass('audio-active')) {

			$(this).addClass('audio-active').siblings().removeClass('audio-active');

			var url = $(this).data('url');

			audio.src = url;

			audio.play();

			$(this).find('i').removeClass('fa-play').addClass('fa-pause').end().siblings().find('i').removeClass('fa-pause').addClass('fa-play');

			$(this).data('play', true).siblings().data('play', false);

			$play.find('i').removeClass('fa-play').addClass('fa-pause');

			$('#photo').css({'animation-play-state': 'running'});

			isPlay = true;

			var imgSrc = $(this).find('.auto-img').attr('src');
			$('#singerImg').find('.auto-img').attr('src', imgSrc);

			$('#photo').css({'background-image': 'url(' + imgSrc + ')'});

		} else {

			var isPlaying = $(this).data('play');


			if (isPlaying) {

				audio.pause();

				$(this).find('i').removeClass('fa-pause').addClass('fa-play');
				$play.find('i').removeClass('fa-pause').addClass('fa-play');

				$('#photo').css({'animation-play-state': 'paused'});

				isPlay = false;

			} else {
				audio.play();

				$(this).find('i').removeClass('fa-play').addClass('fa-pause');

				$play.find('i').removeClass('fa-play').addClass('fa-pause');

				$('#photo').css({'animation-play-state': 'running'});

				isPlay = true;

			}

			$(this).data('play', !isPlaying);

		}
	

	})

	function formatTime(selector, time) {
		var hours = Math.floor(time / 60 / 60 % 60);
		hours = hours >= 10 ? hours : '0' + hours;

		var minutes = Math.floor(time / 60 % 60);
		minutes = minutes >= 10 ? minutes : '0' + minutes;

		var seconds = Math.floor(time % 60);
		seconds = seconds >= 10 ? seconds : '0' + seconds;

		$(selector).text(hours + ':' + minutes + ':' + seconds);
	}

	audio.ontimeupdate = function () {

		var duration = this.duration;
		if (!isNaN(duration)) {

			var currentTime = this.currentTime;
		
			var percent = currentTime / duration;

			var activeWidth = progressParentWidth * percent;

			progress.style.width = activeWidth + 'px';

			mask.style.left = activeWidth - maskWidth / 2 + 'px';

			formatTime('#duration', duration);

			formatTime('#currentTime', currentTime);

		}

	}

	audio.onpause = function () {

		var currentTime = $('#currentTime').text();

		var duration = $('#duration').text();

		console.log('currentTime ==> ', currentTime);
		console.log('duration ==> ', duration);

		if (currentTime != duration) {
			return;
		}

		var mode = $('#playMode').data('mode');

		if (mode == 'exchange') {

			played('next');
		} else if (mode == 'loop') {

			simpleLoopPlay('next');
		} else if (mode == 'random') {

			randomPlay('next');
		}

		var imgSrc = $('#list').find('li.audio-active').find('.auto-img').attr('src');

		$('#singerImg').find('.auto-img').attr('src', imgSrc);

		$('#photo').css({
			'background-image': 'url(' + imgSrc + ')',
			'animation-play-state': 'running'
		});

	}


	$('#playModeMore>div').on('click', function () {

		var currentIcon = $('#playMode').data('icon');

		var mode = $(this).data('mode');

		var icon = $(this).data('icon');

		$('#playMode').data('mode', mode).data('icon', icon).find('.play-mode-icon>i').removeClass(currentIcon).addClass(icon);

		console.log($('#playMode').data('mode'));
		console.log($('#playMode').data('icon'));

	})


	function randomPlay(toggle) {

		var $lis = $('#list>li');

		var $activeLi = $('#list>li.audio-active')[0];

		var randomIndex = Math.floor(Math.random() * $lis.length);

		audio.src = $lis.eq(randomIndex).data('url');
		
		if ($activeLi) {

			if (toggle) {
				$lis.eq(randomIndex).addClass('audio-active').siblings().removeClass('audio-active');

				$lis.eq(randomIndex).data('play', true).find('i').addClass('fa-pause').removeClass('fa-play');

				if (!($lis.eq(randomIndex)[0] == $activeLi)) {

					$($activeLi).data('play', false).find('i').addClass('fa-play').removeClass('fa-pause');
		
				}

				audio.play();

				$('#play').find('i').addClass('fa-pause').removeClass('fa-play');

				isPlay = true;

			}

		} else {

			isLoadAudio = true;

			$lis.eq(randomIndex).addClass('audio-active');

		}

		
	}

	function simpleLoopPlay(toggle) {

		var $lis = $('#list>li');

		var $activeLi = $('#list>li.audio-active')[0];

		if ($activeLi) {

			if (toggle) {
				audio.load();
				audio.play();

				$($activeLi).find('i').addClass('fa-pause').removeClass('fa-play');

			}

		} else {

			isLoadAudio = true;

			var $firstLi = $lis.eq(0);

			$firstLi.addClass('audio-active');

			audio.src = $firstLi.data('url');

		}

	}


	function togglePlay($lis, $activeLi, index) {

		var $lastLi = $lis.eq(index);

		$lastLi.addClass('audio-active').siblings().removeClass('audio-active');

		$($activeLi).data('play', false);
		$($activeLi).find('i').addClass('fa-play').removeClass('fa-pause');

		$lastLi.data('play', true);
		$lastLi.find('i').addClass('fa-pause').removeClass('fa-play');

		audio.src = $lastLi.data('url');

		audio.play();

		$('#play').find('i').addClass('fa-pause').removeClass('fa-play');

		isPlay = true;
	}

	function played(toggle) {

		var $lis = $('#list>li');

		var $activeLi = $('#list>li.audio-active')[0];

		if ($activeLi) {

			var index = $($activeLi).index();

			if (toggle == 'prev') {

				index = index == 0 ? $lis.length - 1 : --index;

				togglePlay($lis, $activeLi, index);

			} else if (toggle == 'next') {

				index = index == $lis.length - 1 ? 0 : ++index;

				togglePlay($lis, $activeLi, index);

			}


		} else {

			isLoadAudio = true;

			var $firstLi = $lis.eq(0);

			$firstLi.addClass('audio-active');

			audio.src = $firstLi.data('url');

		}

	}

	$('#prev').on('click', function () {

		var $activeLi = $('#list>li.audio-active');
		if (!$activeLi[0]) {

			return;
		}


		var mode = $('#playMode').data('mode');

		if (mode == 'exchange') {

			played('prev');
		} else if (mode == 'loop') {

			simpleLoopPlay('prev');
		} else if (mode == 'random') {

			randomPlay('prev');
		}

		var imgSrc = $('#list').find('li.audio-active').find('.auto-img').attr('src');
		$('#singerImg').find('.auto-img').attr('src', imgSrc);

		$('#photo').css({
			'background-image': 'url(' + imgSrc + ')',
			'animation-play-state': 'running'
		});

		

	})

	$('#next').on('click', function () {

		var $activeLi = $('#list>li.audio-active');
		if (!$activeLi[0]) {

			return;
		}

		var mode = $('#playMode').data('mode');

		if (mode == 'exchange') {

			played('next');
		} else if (mode == 'loop') {

			simpleLoopPlay('next');
		} else if (mode == 'random') {

			randomPlay('next');
		}

		var imgSrc = $('#list').find('li.audio-active').find('.auto-img').attr('src');

		$('#singerImg').find('.auto-img').attr('src', imgSrc);

		$('#photo').css({
			'background-image': 'url(' + imgSrc + ')',
			'animation-play-state': 'running'
		});

	})


}