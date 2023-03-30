document.addEventListener("DOMContentLoaded", function () {
  const tabItems = document.querySelectorAll(".user-tab .nav-link");

  // Add click event listener to each tab item
  tabItems.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Remove active class from previous tab
      tabItems.forEach((t) => t.classList.remove("active"));

      // Add active class to the clicked tab
      tab.classList.add("active");

      // Move the bottom border to the clicked tab
      const bottomBorder = document.querySelector(".bottom-border");
      bottomBorder.style.width = `${tab.clientWidth}px`;
      bottomBorder.style.left = `${tab.offsetLeft}px`;
    });
  });

  // Set initial position and width of the bottom border
  function initializeBottomBorder() {
    const activeTab = document.querySelector(".user-tab .nav-link.active");
    const bottomBorder = document.querySelector(".bottom-border");

    if (activeTab) {
      bottomBorder.style.width = `${activeTab.clientWidth}px`;
      bottomBorder.style.left = `${activeTab.offsetLeft}px`;
    }
  }

  // Initialize the bottom border on page load
  initializeBottomBorder();

  // Update the bottom border when the window is resized
  window.addEventListener("resize", () => {
    initializeBottomBorder();
  });
});


function load(button) {
    window.history.pushState({}, "", `/users/${button.id}/${button.name}`)
    fetch(`/api/users/${button.id}/${button.name}`)
      .then(response => response.text())
      .then(html => {
        document.querySelector('.content').innerHTML = html
      });
  }



