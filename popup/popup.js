async function openPopUp() {
   const tabsContainer = document.getElementById('tabs');
   tabsContainer.innerHTML = '';

   const audibleTabs = await browser.tabs.query({ audible: true });

   if (audibleTabs.length === 0) {
      tabsContainer.innerHTML = '<span style="padding: 6px;">0 tabs with sound</span>';
      return;
   }

   for (const tab of audibleTabs) {
      createTabItem(tab, tabsContainer);
   };
}

async function createTabItem(tab, tabsContainer) {
   const tabId = tab.id;

   const results = await browser.scripting.executeScript({
      target: {tabId: tab.id},
      func: getActualVolume,
   });

   const volume = (results && results[0] && results[0].result != null) ? results[0].result : 1.0;
   const tabItem = document.createElement('div');
   tabItem.className = 'tab-item';

   const icon = document.createElement('img');
   icon.className = 'tab-icon';
   icon.src = tab.favIconUrl || 'icon.png';

   const info = document.createElement('div');
   info.className = 'tab-info';
   info.title = tab.title;
   info.textContent = tab.title;

   const slider = document.createElement('input');
   slider.className = 'volume-slider';
   slider.type = 'range';
   slider.min = '0';
   slider.max = '1';
   slider.step = '0.01';
   slider.value = volume;

   slider.addEventListener('input', (event) => {
      const newVolume = parseFloat(event.target.value);
      
      browser.scripting.executeScript({
      target: { tabId: tabId },
      func: setPageVolume,
      args: [newVolume]
      });
   });

   tabItem.appendChild(icon);
   tabItem.appendChild(info);
   tabItem.appendChild(slider);
   tabsContainer.appendChild(tabItem);
}

document.addEventListener('DOMContentLoaded', openPopUp);

function getActualVolume() {
   const mediaElement = document.querySelector('video, audio');
   if (mediaElement) {
      return mediaElement.volume;
   }
   return 1.0;
}

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
