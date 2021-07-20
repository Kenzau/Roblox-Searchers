const REQUEST_LIMIT = 40;
const RETRY_LIMIT = 3;
const COLORS = {
  GREEN: '#58BD7E',
  BLUE: '#0077FF',
  YELLOW: '#FFD074',
  RED: '#FF3E3E',
  BLACK: '#2C2D2D',
  WHITE: '#F2F4F7',
};
const SEARCH = {
  SUCCESS: 'images/search-success.png',
  NEUTRAL: 'images/search.png',
  ERROR: 'images/search-error.png',
};
const PLACE = {
  SUCCESS: 'images/place-success.png',
  NEUTRAL: 'images/place.png',
  ERROR: 'images/place-error.png',
};
const USER = {
  SUCCESS: 'images/user-success.png',
  NEUTRAL: 'images/user.png',
  ERROR: 'images/user-error.png',
};

const search = document.getElementById('search');
const status = document.getElementById('status');
const placeInput = document.getElementById('pid');
const userInput = document.getElementById('user');
const userIcon = document.getElementById('user-icon');
const placeIcon = document.getElementById('place-icon');
const bar = document.getElementById('bar');
const media = document.getElementById('media');

const valid = {
  user: false,
  place: false,
};

chrome.tabs.query({ active: true }, ([tab]) => {
  const match = tab.url.match(/\.roblox\.com\/(users|games)\/(\d+)/);
  if (!match) return;
  const [, type, id] = match;
  if (type === 'users') {
    valid.user = true;
    userIcon.src = USER.SUCCESS;
    userInput.value = id;
  } else if (type === 'games') {
    valid.place = true;
    placeIcon.src = PLACE.SUCCESS;
    placeInput.value = id;
  }
});

const request = async (url, options = {}) => {
  const { retry } = options;
  try {
    return await fetch(`https://${url}`, options).then(r => r.json());
  } catch (e) {
    if (!retry || retry === 1) throw e;
    return request(url, { ...options, retry: retry - 1 });
  }
};

const notify = msg => {
  status.style.color = COLORS.BLACK;
  return status.innerHTML = msg;
};

const error = (msg, disable) => {
  bar.style.width = '0%';
  bar.style.backgroundColor = COLORS.RED;
  status.style.color = COLORS.RED;
  search.disabled = disable;
  search.src = SEARCH.ERROR;
  return status.innerHTML = msg;
};

userInput.oninput = () => {
  const test = /(^(?=^[^_]+_?[^_]+$)\w{3,20}$|^\d+$)/.test(userInput.value);
  if (!userInput.value) userIcon.src = USER.NEUTRAL;
  else userIcon.src = test ? USER.SUCCESS : USER.ERROR;
  valid.user = test;
  return search.disabled = !(valid.user && valid.place);
};

placeInput.oninput = () => {
  const test = /^\d+$/.test(placeInput.value);
  if (!placeInput.value) placeIcon.src = PLACE.NEUTRAL;
  else placeIcon.src = test ? PLACE.SUCCESS : PLACE.ERROR;
  valid.place = test;
  return search.disabled = !(valid.user && valid.place);
};

const join = (placeID, gameID) => {
  search.disabled = false;
  search.src = SEARCH.SUCCESS;
  bar.style.width = '100%';
  bar.style.backgroundColor = COLORS.GREEN;

  notify('Joining...');
  const url = `https://www.roblox.com/home?placeID=${placeID}&gameID=${gameID}`;
  return chrome.tabs.update({ url });
};

const getServer = async (user, avatar, placeID, total, offset) => {
  const percentage = Math.round((offset / total) * 100);
  bar.style.width = `${percentage}%`;

  if (total <= offset) return { error: true, api: false, percentage };
  const urls = Array.from({ length: REQUEST_LIMIT }, (_, i) => `www.roblox.com/games/getgameinstancesjson?placeId=${placeID}&startIndex=${i * 10 + offset}`);
  const data = await Promise.all(urls.map(url => request(url, { retry: RETRY_LIMIT })));
  if (!data[0].Collection.length) return { error: true, api: true, percentage };

  const found = data
    .flatMap(group => group.Collection)
    .find(server => server.CurrentPlayers
      .find(player => player.Id === user.Id || player.Thumbnail.Url === avatar));
  if (!found) return getServer(user, avatar, placeID, data[0].TotalCollectionSize, offset + REQUEST_LIMIT * 10);
  return found;
};

const main = async () => {
  media.style.opacity = 0;
  bar.style.width = '0%';
  bar.style.backgroundColor = COLORS.BLUE;
  search.src = SEARCH.NEUTRAL;
  search.disabled = true;

  const user = await request(`api.roblox.com/users/${/^\d+$/.test(userInput.value) ? userInput.value : `get-by-username?username=${userInput.value}`}`);
  if (user.errors || user.errorMessage) {
    userIcon.src = USER.ERROR;
    return error('User not found!', true);
  }

  const { userPresences: [presence] } = await request('presence.roblox.com/v1/presence/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userIds: [user.Id] }),
  });

  if (!presence.userPresenceType || presence.userPresenceType !== 2) {
    userIcon.src = USER.ERROR;
    return error(`User is ${!presence.userPresenceType ? 'offline' : 'not playing a game'}!`);
  }

  if (presence.placeId && presence.gameId) return join(presence.placeId, presence.gameId);

  const [place] = await request(`games.roblox.com/v1/games/multiget-place-details?placeIds=${placeInput.value}`);
  if (!place) {
    placeIcon.src = PLACE.ERROR;
    return error('Place not found!', true);
  }

  const req = await request(`thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${place.universeId}&size=768x432&format=Png&isCircular=false`);
  const thumbnail = req.data[0].thumbnails[0].imageUrl;

  const { Url: avatar } = await request(`www.roblox.com/headshot-thumbnail/json?userId=${user.Id}&width=48&height=48`);

  media.style.backgroundImage = `linear-gradient(to top right, ${COLORS.WHITE}, transparent), linear-gradient(to bottom left, transparent, ${COLORS.WHITE}), url(${thumbnail})`;
  media.style.opacity = 1;

  const { TotalCollectionSize: total } = await request(`www.roblox.com/games/getgameinstancesjson?placeId=${place.placeId}&startIndex=999999`);

  notify('Searching...');

  const found = await getServer(user, avatar, place.placeId, total, 0);

  if (found.error) return error(found.api ? `API error! ${found.percentage}% server coverage` : 'Server not found!');

  return join(found.PlaceId, found.Guid);
};

search.onclick = () => main().catch(e => {
  console.log(e);
  return error('Error! Please try again');
});

const enter = ({ keyCode }) => keyCode === 13 && search.click();
userInput.addEventListener('keydown', enter);
placeInput.addEventListener('keydown', enter);
