/* Shared, user-controlled galleries. Photo arrays remain in their existing pages. */
(function () {
  'use strict';
  const descriptions = {
    'ph-littleelm': [
      'Student presenters stand behind robots and game pieces at Little Elm Public Library.',
      'Team members introduce their robotics program to a seated library audience.',
      'Families watch a robotics presentation with demonstration robots on the table.',
      'Four student presenters explain their team beside a projected introduction slide.',
      'Library visitors listen to the student presenters; audience faces are blurred for privacy.',
      'A student demonstrates a robot on a small practice field; audience faces are blurred for privacy.',
      'Children try robot driving while students assist around the field; audience faces are blurred for privacy.',
      'Four team members pose between Ninjas STEM Foundation and Robotex Ninjas banners.',
      'Children and student mentors build with VEX parts at a workshop table; audience faces are blurred for privacy.',
      'A student assists children using laptops at the workshop; audience faces are blurred for privacy.'
    ],
    'ph-vbs': [
      'Children and student mentors gather around robot parts in a classroom.',
      'A student explains H-drive, tank-drive and X-drive chassis designs on a presentation screen.',
      'Children listen to a student-led robotics lesson in the classroom.',
      'Students and participants build a robot structure together on the floor.',
      'Children practice driving a robot on a VEX field with student mentors nearby.'
    ],
    'ph-scrimmage': [
      'Students examine a demonstration robot and discuss its mechanisms with a guest presenter.',
      'Guest presenters address the scrimmage audience beside the robot practice field.',
      'Three guest presenters explain their robotics program to the audience.',
      'A guest presenter discusses engineering beside a robot and the Robotex Ninjas table banner.',
      'Guest presenters describe engineering roles using slides and a demonstration robot.',
      'The audience watches a presentation about robotics competition opportunities.',
      'Participants prepare a robot for a driving run on the Mix & Match field.',
      'Students gather around the field as a driver controls a robot among colored pins.',
      'A robot approaches stacked game pieces while participants watch from the field perimeter.',
      'Participants reset game pieces and position robots for another practice run.',
      'A student holds a controller while teammates watch the robot on the field.',
      'Teams and families gather around the field during the scrimmage.'
    ],
    'ph-church': ['Children gather around a robotics demonstration at the church workshop.'],
    'moments': [
      'Four team members hold an award beneath the VEX Robotics World Championship entrance sign.',
      'Students pose with robots and awards in the competition venue.',
      'Students display robots and awards beside an event official at the championship.',
      'Students hold 2026 Mix & Match regional championship banners in a gym.',
      'Team members and supporters pose with 2026 Robot Skills and Teamwork Challenge championship banners.',
      'Three team members hold an award and a 2026 Robot Skills Challenge championship banner.',
      'Teams celebrate with 2025 Rapid Relay Teamwork Challenge championship banners.',
      'Students prepare their robots and controllers beside a Rapid Relay competition field.',
      'A competition robot is displayed beside awards and a 2025 championship banner.',
      'Robots and game pieces are arranged on a home practice field beneath award banners.',
      'Team members pose with robots on a Rapid Relay field beneath championship banners.',
      'Three team members visit the Gateway Arch National Park sign.'
    ]
  };
  const names = {
    'ph-littleelm': 'Little Elm workshop', 'ph-vbs': 'Vacation Bible School robotics',
    'ph-scrimmage': 'Mix & Match scrimmage', 'ph-church': 'Church robotics workshop',
    'moments': 'Team moments'
  };
  for (const [id, photos] of Object.entries(window.galPhotos || {})) {
    const gallery = document.getElementById('gallery-' + id);
    const track = document.getElementById('track-' + id);
    const dots = document.getElementById('dots-' + id);
    const count = document.getElementById('count-' + id);
    if (!gallery || !track || !dots || !photos.length) continue;
    let current = 0;
    const name = names[id] || 'Event photos';
    gallery.setAttribute('role', 'region');
    gallery.setAttribute('aria-label', name + ' photo gallery');
    gallery.setAttribute('aria-roledescription', 'carousel');
    dots.setAttribute('role', 'group');
    dots.setAttribute('aria-label', 'Choose a photo: ' + name);
    // Keep keyboard navigation in the same region as the slide and arrow controls.
    gallery.append(dots);
    const caption = document.createElement('p');
    caption.className = 'gal-caption';
    caption.id = 'caption-' + id;
    caption.setAttribute('aria-live', 'polite');
    caption.setAttribute('aria-atomic', 'true');
    gallery.append(caption);
    count?.setAttribute('aria-hidden', 'true');
    const slides = [], buttons = [];
    photos.forEach((src, i) => {
      const slide = document.createElement('div');
      slide.className = 'gal-slide';
      slide.id = 'slide-' + id + '-' + (i + 1);
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-roledescription', 'slide');
      slide.setAttribute('aria-label', (i + 1) + ' of ' + photos.length);
      const img = document.createElement('img');
      img.src = src;
      img.alt = descriptions[id]?.[i] || name + ' event photograph ' + (i + 1);
      img.loading = i === 0 ? 'eager' : 'lazy';
      img.decoding = 'async';
      slide.append(img);
      track.append(slide);
      slides.push(slide);
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'gdot';
      dot.setAttribute('aria-label', 'Show photo ' + (i + 1) + ' of ' + photos.length + ': ' + name);
      dot.setAttribute('aria-controls', slide.id);
      dot.addEventListener('click', () => show(i));
      dots.append(dot);
      buttons.push(dot);
    });
    function show(index) {
      current = (index + photos.length) % photos.length;
      slides.forEach((slide, i) => { slide.hidden = i !== current; });
      buttons.forEach((button, i) => {
        button.classList.toggle('active', i === current);
        if (i === current) button.setAttribute('aria-current', 'true');
        else button.removeAttribute('aria-current');
      });
      if (count) count.textContent = (current + 1) + ' / ' + photos.length;
      caption.textContent = 'Photo ' + (current + 1) + ' of ' + photos.length + ' — ' + slides[current].querySelector('img').alt;
    }
    for (const [selector, label, direction] of [['.gal-prev', 'Previous photo', -1], ['.gal-next', 'Next photo', 1]]) {
      const button = gallery.querySelector(selector);
      if (!button) continue;
      button.type = 'button';
      button.removeAttribute('onclick');
      button.setAttribute('aria-label', label + ': ' + name);
      button.setAttribute('aria-controls', track.id);
      button.hidden = photos.length < 2;
      button.addEventListener('click', () => show(current + direction));
    }
    dots.hidden = photos.length < 2;
    gallery.addEventListener('keydown', event => {
      const target = {ArrowLeft: current - 1, ArrowRight: current + 1, Home: 0, End: photos.length - 1}[event.key];
      if (target === undefined || event.altKey || event.ctrlKey || event.metaKey) return;
      event.preventDefault();
      show(target);
      if (event.target.classList.contains('gdot')) buttons[current].focus();
    });
    let touch;
    track.addEventListener('touchstart', event => {
      touch = event.touches.length === 1 ? {x: event.touches[0].clientX, y: event.touches[0].clientY} : null;
    }, {passive: true});
    track.addEventListener('touchend', event => {
      if (!touch) return;
      const dx = event.changedTouches[0].clientX - touch.x, dy = event.changedTouches[0].clientY - touch.y;
      touch = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) show(current + (dx < 0 ? 1 : -1));
    }, {passive: true});
    track.addEventListener('touchcancel', () => { touch = null; }, {passive: true});
    show(0);
  }
})();
