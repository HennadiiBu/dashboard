(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity)
      fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy)
      fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const style = "";
const sidebarNavItems = document.querySelectorAll(".sidebar__nav-item");
const paginationNavItems = document.querySelectorAll(".customers__pagination-btn");
const sidebar = document.querySelector(".sidebar");
const burgerBtn = document.querySelector(".burger-btn");
let sidebarStatus = false;
const clearSelectedSidebarStatus = () => {
  sidebarNavItems.forEach((item) => {
    item.classList.remove("sidebar__nav-item--selected");
  });
};
const clearSelectedPaginationStatus = () => {
  paginationNavItems.forEach((item) => {
    item.classList.remove("customers__pagination-btn--selected");
  });
};
const openSideBar = () => {
  sidebarStatus = true;
  burgerBtn.classList.add("burger-btn--open");
  sidebar.classList.add("sidebar--open");
};
const closeSidebar = () => {
  sidebarStatus = false;
  burgerBtn.classList.remove("burger-btn--open");
  sidebar.classList.remove("sidebar--open");
};
sidebarNavItems.forEach((item) => {
  item.addEventListener("click", () => {
    clearSelectedSidebarStatus();
    closeSidebar();
    item.classList.add("sidebar__nav-item--selected");
  });
});
paginationNavItems.forEach((item) => {
  item.addEventListener("click", () => {
    clearSelectedPaginationStatus();
    item.classList.add("customers__pagination-btn--selected");
  });
});
burgerBtn.addEventListener("click", () => {
  sidebarStatus ? closeSidebar() : openSideBar();
});
