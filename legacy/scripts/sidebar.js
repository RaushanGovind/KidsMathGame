function setupSidebarToggle() {

    const sidebar = document.querySelector(".sidebar");
    const content = document.querySelector(".content");
    const toggleBtn = document.getElementById("toggleSidebarBtn");

    let isHidden = false;

    toggleBtn.addEventListener("click", () => {

        isHidden = !isHidden;

        if (isHidden) {

            // hide sidebar
            sidebar.classList.add("sidebar-collapsed");

            // expand content
            content.classList.add("content-expanded");

            toggleBtn.textContent = "☰ Open Menu";
        }
        else {

            // show sidebar
            sidebar.classList.remove("sidebar-collapsed");

            // restore normal width
            content.classList.remove("content-expanded");

            toggleBtn.textContent = "☰ Menu";
        }
    });
}

