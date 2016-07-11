soundCloudSongs = {
  242394750: {
    title: 'Andrew Applepie - Good Mood',
    link: 'https://soundcloud.com/andrewapplepie/good-mood'
  }
};

soundCloudSong = function(song) {
  var embed = '<iframe width="100%" height="300" scrolling="no" frameborder="no" src="';
      embed += 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/';
      embed += song;
      embed += '&amp;auto_play=true&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true';
      embed += '"></iframe>';

  return {
    t: soundCloudSongs[song].title,
    l: soundCloudSongs[song].link,
    h: embed
  }
}
