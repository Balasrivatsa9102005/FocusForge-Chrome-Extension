const FOCUS_KEY = "focusData";

function initFocusData() {
  const defaultData = {
    startTime: Date.now(),
    goal: "",
    sessions: []
  };
  chrome.storage.local.set({ [FOCUS_KEY]: defaultData });
}

function setFocusGoal(goalText) {
  chrome.storage.local.get(FOCUS_KEY, (data) => {
    const current = data[FOCUS_KEY] || {};
    current.goal = goalText;
    current.startTime = Date.now();
    chrome.storage.local.set({ [FOCUS_KEY]: current });
  });
}

function endFocusSession() {
  chrome.storage.local.get(FOCUS_KEY, (data) => {
    const current = data[FOCUS_KEY] || {};
    const endTime = Date.now();
    const sessionDuration = endTime - (current.startTime || endTime);

    const session = {
      goal: current.goal || "Unnamed Task",
      duration: sessionDuration,
      endedAt: endTime
    };

    const updatedSessions = current.sessions || [];
    updatedSessions.push(session);

    chrome.storage.local.set({
      [FOCUS_KEY]: {
        ...current,
        goal: "",
        startTime: null,
        sessions: updatedSessions
      }
    });
  });
}

function getFocusGoal(callback) {
  chrome.storage.local.get(FOCUS_KEY, (data) => {
    callback((data && data[FOCUS_KEY]?.goal) || "");
  });
}

function getFocusDuration(callback) {
  chrome.storage.local.get(FOCUS_KEY, (data) => {
    const start = data[FOCUS_KEY]?.startTime;
    if (!start) return callback(0);
    callback(Date.now() - start);
  });
}

// Export for module usage (optional)
if (typeof module !== "undefined") {
  module.exports = {
    initFocusData,
    setFocusGoal,
    endFocusSession,
    getFocusGoal,
    getFocusDuration
  };
}
