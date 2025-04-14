// Get the join button
const joinBtn = document.getElementById("join-btn");

// Only proceed if we're on the join page (where the join button exists)
if (joinBtn) {
  async function updateButtonState() {
    try {
      const hasInternet = navigator.onLine;

      // Update button appearance
      joinBtn.style.cursor = hasInternet ? "pointer" : "not-allowed";
      joinBtn.style.color = "white";
      joinBtn.style.backgroundColor = hasInternet
        ? "var(--success-color)"
        : "var(--error-color)";
      joinBtn.textContent = hasInternet
        ? "Join Chat"
        : "Offline - Check Connection";

      // Disable button when offline
      joinBtn.disabled = !hasInternet;
    } catch (error) {
      console.error("Error updating button state:", error);
    }
  }

  // Initial check
  updateButtonState();

  // Event listeners for browser-level connection change
  window.addEventListener("online", updateButtonState);
  window.addEventListener("offline", updateButtonState);
}
