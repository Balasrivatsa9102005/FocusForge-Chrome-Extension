document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggleFocus');
  const status = document.getElementById('status');
  const goalInput = document.getElementById('goalInput');
  const setGoalBtn = document.getElementById('setGoal');

  chrome.storage.local.get(['focusMode', 'focusData'], data => {
    const isFocus = data.focusMode || false;
    updateToggleUI(isFocus);
    if (data.focusData?.goal) {
      goalInput.placeholder = `Last: ${data.focusData.goal}`;
    }
  });

  toggleBtn.addEventListener('click', () => {
    chrome.storage.local.get('focusMode', data => {
      const isEnabled = !data.focusMode;
      chrome.storage.local.set({ focusMode: isEnabled }, () => {
        updateToggleUI(isEnabled);
      });
    });
  });

  setGoalBtn.addEventListener('click', () => {
    const goal = goalInput.value.trim();
    if (goal) {
      const newData = {
        goal: goal,
        startTime: Date.now()
      };
      chrome.storage.local.set({ focusData: newData }, () => {
        status.textContent = `Goal set: "${goal}"`;
        goalInput.value = '';
      });
    } else {
      alert("Please enter a focus goal first.");
    }
  });

  function updateToggleUI(isEnabled) {
    toggleBtn.textContent = isEnabled ? 'Disable Focus Mode' : 'Enable Focus Mode';
    toggleBtn.classList.toggle('active', isEnabled);
    status.textContent = isEnabled ? 'Focus Mode is ON' : 'Focus Mode is OFF';
  }
});
