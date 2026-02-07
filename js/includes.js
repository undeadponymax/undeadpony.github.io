async function loadIncludes() {
  const headerHost = document.getElementById("site-header");
  if (headerHost) {
    const res = await fetch("header.html");
    headerHost.innerHTML = await res.text();

    const current = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    document.querySelectorAll('.nav-links a[data-nav]').forEach(a => {
      a.classList.toggle("active", a.getAttribute("data-nav").toLowerCase() === current);
    });
  }
}

loadIncludes().catch(console.error);