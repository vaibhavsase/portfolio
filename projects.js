

document.addEventListener("DOMContentLoaded", () => {

  const container = document.getElementById("projects-container");
  const searchInput = document.getElementById("project-search");
  const filterToggle = document.querySelector(".filter-toggle");
  const filterOptions = document.querySelector(".filter-options");
  const filterButtons = filterOptions.querySelectorAll("button");

  let allProjects = [];
  let currentTech = "all";

  filterToggle.addEventListener("click", () => {
    filterOptions.classList.toggle("show");
  });

  fetch("projects.json")
    .then(res => res.json())
    .then(data => {
      allProjects = data;
      applyFilters();
    });

  searchInput.addEventListener("input", applyFilters);

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentTech = btn.dataset.tech;
      filterOptions.classList.remove("show");
      applyFilters();
    });
  });

  function applyFilters() {
    const query = searchInput.value.toLowerCase();

    const filtered = allProjects.filter(project => {
      const textMatch =
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.tech.join(" ").toLowerCase().includes(query);

      const techMatch =
        currentTech === "all" || project.tech.includes(currentTech);

      return textMatch && techMatch;
    });

    renderProjects(filtered);
    initScrollAnimation();
  }

  function renderProjects(projects) {
    container.innerHTML = "";

    projects.forEach(project => {
      const card = document.createElement("div");
      card.className = "project-card";

      card.innerHTML = `
        <img src="${project.image}" alt="${project.title}">
        <h3>${project.title}</h3>
        <p>${project.description}</p>

        <div class="tech-stack">
          ${project.tech.map(t => `<span>${t}</span>`).join("")}
        </div>

        <div class="project-buttons">
          <a href="${project.live}" target="_blank">🔗 Live</a>
          <a href="${project.github}" target="_blank">💻 GitHub</a>
        </div>
      `;

      container.appendChild(card);
    });
  }

  function initScrollAnimation() {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll(".project-card").forEach(card => {
      observer.observe(card);
    });
  }

});

