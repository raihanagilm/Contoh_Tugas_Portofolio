// =========================================
// PROJECTS PAGE LOGIC - CRUD Operations
// =========================================

const projectForm = document.getElementById("projectForm");
const projectListEl = document.getElementById("projectList");
const cancelBtn = document.getElementById("cancelBtn");

let isEditing = false;
let currentImage = "";

// =========================================
// IMAGE PREVIEW
// =========================================

document
  .getElementById("projImage")
  .addEventListener("change", function () {
    const file = this.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
      currentImage = e.target.result;

      const preview = document.getElementById("imagePreview");
      preview.src = currentImage;
      preview.style.display = "block";
    };

    reader.readAsDataURL(file);
  });

// =========================================
// LOAD PROJECTS
// =========================================

function loadProjects() {
  const projects = JSON.parse(localStorage.getItem("projects") || "[]");

  if (projects.length === 0) {
    projectListEl.innerHTML =
      '<p style="color: var(--text-gray);">Belum ada data proyek</p>';
    return;
  }

  projectListEl.innerHTML = projects
    .map(
      (proj, index) => `
      <div class="data-card" data-index="${index}">

        ${
          proj.image
            ? `
          <img
            src="${proj.image}"
            alt="${proj.title}"
            class="project-image"
          >
        `
            : ""
        }

        <div class="data-card-header">
          <h4>${proj.title}</h4>
        </div>

        <div class="data-card-body">
          ${proj.description}
        </div>

        <div class="data-card-tags">
          ${proj.tags
            .map((tag) => `<span class="tag">${tag}</span>`)
            .join("")}
        </div>

        <div class="data-card-actions">
          <button
            class="btn btn-sm btn-edit"
            onclick="editProject(${index})"
          >
            <i class="fas fa-edit"></i> Edit
          </button>

          <button
            class="btn btn-sm btn-delete"
            onclick="deleteProject(${index})"
          >
            <i class="fas fa-trash"></i> Hapus
          </button>
        </div>

      </div>
    `
    )
    .join("");
}

// =========================================
// SAVE PROJECT
// =========================================

projectForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const id = document.getElementById("projId").value;
  const title = document.getElementById("projTitle").value;
  const description = document.getElementById("projDescription").value;

  const tagsInput = document.getElementById("projTags").value;

  const tags = tagsInput
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag);

  const projects = JSON.parse(localStorage.getItem("projects") || "[]");

  if (isEditing && id !== "") {
    const index = parseInt(id);

    projects[index] = {
      ...projects[index],
      title,
      description,
      tags,
      image: currentImage || projects[index].image,
    };
  } else {
    const newProject = {
      id: Date.now(),
      title,
      description,
      tags,
      image: currentImage,
    };

    projects.push(newProject);
  }

  localStorage.setItem("projects", JSON.stringify(projects));

  loadProjects();
  resetForm();

  alert(
    isEditing
      ? "Proyek berhasil diperbarui!"
      : "Proyek berhasil ditambahkan!"
  );
});

// =========================================
// EDIT PROJECT
// =========================================

window.editProject = function (index) {
  const projects = JSON.parse(localStorage.getItem("projects") || "[]");

  const proj = projects[index];

  document.getElementById("projId").value = index;
  document.getElementById("projTitle").value = proj.title;
  document.getElementById("projDescription").value = proj.description;
  document.getElementById("projTags").value = proj.tags.join(", ");

  currentImage = proj.image || "";

  const preview = document.getElementById("imagePreview");

  if (currentImage) {
    preview.src = currentImage;
    preview.style.display = "block";
  } else {
    preview.src = "";
    preview.style.display = "none";
  }

  isEditing = true;

  document.getElementById("saveBtn").innerHTML =
    '<i class="fas fa-sync"></i> Update';

  cancelBtn.style.display = "inline-flex";

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

// =========================================
// DELETE PROJECT
// =========================================

window.deleteProject = function (index) {
  if (!confirm("Apakah Anda yakin ingin menghapus proyek ini?")) {
    return;
  }

  const projects = JSON.parse(localStorage.getItem("projects") || "[]");

  projects.splice(index, 1);

  localStorage.setItem("projects", JSON.stringify(projects));

  loadProjects();
};

// =========================================
// RESET FORM
// =========================================

function resetForm() {
  projectForm.reset();

  document.getElementById("projId").value = "";

  currentImage = "";

  document.getElementById("projImage").value = "";

  const preview = document.getElementById("imagePreview");

  preview.src = "";
  preview.style.display = "none";

  isEditing = false;

  document.getElementById("saveBtn").innerHTML =
    '<i class="fas fa-save"></i> Simpan';

  cancelBtn.style.display = "none";
}

// =========================================
// INITIALIZE
// =========================================

document.addEventListener("DOMContentLoaded", function () {
  loadProjects();
});
