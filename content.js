const script = document.createElement('script');
script.textContent = `
const params = new URLSearchParams(window.location.search);
const placeID = params.get('placeID');
const gameID = params.get('gameID');

if (placeID && gameID) Roblox.GameLauncher.joinGameInstance(placeID, gameID);
`;
window.document.body.appendChild(script);
script.remove();
