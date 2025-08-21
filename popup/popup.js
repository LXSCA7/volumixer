function setPageVolume(volume) {
   document.querySelectorAll('video, audio').forEach(e => {
      e.volume = volume;
      e.muted = false;
   });
}

function toggleMute() {
   document.querySelectorAll('video, audio').forEach(e => {
      e.muted = !e.muted;
   });
}
const volumeSlider = document.getElementById('volumeSlider');

volumeSlider.addEventListener('click', async () => {
   let [tab] = await browser.tabs.query({"active": true, "currentWindow": true})
   const newVolume = volumeSlider.value / 100.0;
   browser.scripting.executeScript({
      target: {tabId: tab.id},
      func: setPageVolume,
      args: [newVolume]
   });
});

document.getElementById('muteBtn').addEventListener('click', async () => {
   let [tab] = await browser.tabs.query({"active": true, "currentWindow": true})
   browser.scripting.executeScript({
      target: {tabId: tab.id},
      func: toggleMute,
   });
})