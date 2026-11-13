/**
 * Diya Sarah James • Ultra-Clean Minimal Editorial Web App
 * Dynamic Red - Yellow Flame Theme
 * Passcode: diya123
 */

const PASSWORD_KEY = "diya123";

const DEFAULT_PHOTO = "diya.jpg";

const DEFAULT_DETAILS = {
  nameFirst: "Diya",
  nameLast: "Sarah James",
  eyebrow: "Bangalore, India",
  locationUrl: "https://maps.google.com/?q=Bangalore",
  role: "Exploring",
  desc: "Exploring creative tech, modern design, culture, and new horizons.",
  phone: "9995437675",
  email: "diyasjames@gmail.com"
};

const DEFAULT_LINKS = [
  {
    id: "1",
    title: "Connect on LinkedIn",
    subtitle: "linkedin.com/in/diya-sarah-james",
    url: "https://www.linkedin.com/in/diya-sarah-james/",
    isPrimary: true,
    icon: "linkedin"
  },
  {
    id: "2",
    title: "Contact Information",
    subtitle: "Direct contact card on LinkedIn",
    url: "https://www.linkedin.com/in/diya-sarah-james/overlay/contact-info/",
    isPrimary: false,
    icon: "contact"
  },
  {
    id: "3",
    title: "Send an Email",
    subtitle: "diyasjames@gmail.com",
    url: "mailto:diyasjames@gmail.com",
    isPrimary: false,
    icon: "email"
  },
  {
    id: "4",
    title: "Message on WhatsApp",
    subtitle: "+91 9995437675",
    url: "https://wa.me/919995437675",
    isPrimary: false,
    icon: "whatsapp"
  }
];

// Clean isolated keys for the new minimal theme
const STORAGE_PREFIX = "diya_minimal_v3";
const STORAGE_LINKS_KEY = `${STORAGE_PREFIX}_links`;
const STORAGE_DETAILS_KEY = `${STORAGE_PREFIX}_details`;
const STORAGE_PHOTO_KEY = `${STORAGE_PREFIX}_photo`;
const STORAGE_AUTH_KEY = `${STORAGE_PREFIX}_auth`;

let links = [];
let heroPhoto = "";
let profileDetails = {};
let isAuthenticated = false;

document.addEventListener("DOMContentLoaded", () => {
  // Purge any stale legacy localStorage entries from old tests/CCE projects
  cleanLegacyStorage();

  loadData();
  setupEvents();
  render();
});

// Purge any obsolete keys so they never contaminate the new minimal UI
function cleanLegacyStorage() {
  const staleKeys = [
    "diya_hero_links_v1", "diya_hero_links_v2",
    "diya_profile_details_v1", "diya_profile_details_v2",
    "diya_hero_photo_v1", "diya_hero_photo_v2",
    "suni_hero_links_v7", "suni_profile_details_v7", "suni_hero_photo_v7"
  ];
  staleKeys.forEach(k => {
    try { localStorage.removeItem(k); } catch (e) {}
  });
}

function loadData() {
  try {
    const savedPhoto = localStorage.getItem(STORAGE_PHOTO_KEY);
    heroPhoto = (savedPhoto && savedPhoto.length > 5) ? savedPhoto : DEFAULT_PHOTO;

    const savedLinks = localStorage.getItem(STORAGE_LINKS_KEY);
    links = savedLinks ? JSON.parse(savedLinks) : [...DEFAULT_LINKS];

    const savedDetails = localStorage.getItem(STORAGE_DETAILS_KEY);
    profileDetails = savedDetails ? JSON.parse(savedDetails) : { ...DEFAULT_DETAILS };

    isAuthenticated = localStorage.getItem(STORAGE_AUTH_KEY) === "true";
  } catch (e) {
    heroPhoto = DEFAULT_PHOTO;
    links = [...DEFAULT_LINKS];
    profileDetails = { ...DEFAULT_DETAILS };
    isAuthenticated = false;
  }
}

function saveData() {
  try {
    localStorage.setItem(STORAGE_LINKS_KEY, JSON.stringify(links));
    localStorage.setItem(STORAGE_DETAILS_KEY, JSON.stringify(profileDetails));
    localStorage.setItem(STORAGE_PHOTO_KEY, heroPhoto);
    showToast("Changes saved successfully!");
  } catch (e) {
    showToast("Saved locally in your browser.");
  }
}

function savePhoto(url) {
  heroPhoto = url;
  const avatarImg = document.getElementById("avatarImg");
  if (avatarImg) avatarImg.src = url;
  saveData();
}

// =============================================================================
// Rendering
// =============================================================================

function render() {
  // Avatar
  const avatarImg = document.getElementById("avatarImg");
  if (avatarImg) {
    avatarImg.src = heroPhoto;
  }

  // Name
  document.getElementById("nameFirst").textContent = profileDetails.nameFirst || DEFAULT_DETAILS.nameFirst;
  document.getElementById("nameLast").textContent = profileDetails.nameLast || DEFAULT_DETAILS.nameLast;

  // Tagline & Location
  document.getElementById("heroRole").textContent = profileDetails.role || DEFAULT_DETAILS.role;
  document.getElementById("eyebrowText").textContent = profileDetails.eyebrow || DEFAULT_DETAILS.eyebrow;

  const locEl = document.getElementById("locationLink");
  if (locEl) {
    locEl.href = profileDetails.locationUrl || DEFAULT_DETAILS.locationUrl;
  }

  // Bio
  document.getElementById("heroDesc").textContent = profileDetails.desc || DEFAULT_DETAILS.desc;

  // Phone
  const phoneEl = document.getElementById("contactPhone");
  if (profileDetails.phone && profileDetails.phone.trim().length > 0) {
    const cleanPhone = profileDetails.phone.replace(/[^0-9+]/g, "");
    phoneEl.href = `tel:${cleanPhone}`;
    phoneEl.querySelector("span").textContent = `${profileDetails.phone} (Mobile)`;
    phoneEl.style.display = "inline-flex";
  } else {
    phoneEl.style.display = "none";
  }

  // Email
  const emailEl = document.getElementById("contactEmail");
  if (profileDetails.email && profileDetails.email.trim().length > 0) {
    emailEl.href = `mailto:${profileDetails.email}`;
    emailEl.querySelector("span").textContent = profileDetails.email;
    emailEl.style.display = "inline-flex";
  } else {
    emailEl.style.display = "none";
  }

  // Auth UI controls
  const loginBtn = document.getElementById("loginBtn");
  const loggedInControls = document.getElementById("loggedInControls");
  const addLinkBtn = document.getElementById("addLinkBtn");
  const uploadPhotoBtn = document.getElementById("uploadPhotoBtn");

  if (isAuthenticated) {
    loginBtn.style.display = "none";
    loggedInControls.style.display = "inline-flex";
    addLinkBtn.style.display = "flex";
    uploadPhotoBtn.style.display = "flex";
  } else {
    loginBtn.style.display = "inline-flex";
    loggedInControls.style.display = "none";
    addLinkBtn.style.display = "none";
    uploadPhotoBtn.style.display = "none";
  }

  // Render Links
  renderLinks();
}

function renderLinks() {
  const container = document.getElementById("linksGrid");
  container.innerHTML = "";

  links.forEach((item, index) => {
    const wrap = document.createElement("div");
    wrap.className = "link-wrapper";

    const primaryClass = item.isPrimary ? "card-primary" : "";
    const fullUrl = ensureUrl(item.url);
    const iconSvg = getIconSvg(item);

    wrap.innerHTML = `
      <a href="${fullUrl}" target="_blank" rel="noopener noreferrer" class="action-card ${primaryClass}">
        <div class="action-card-left">
          <div class="card-icon-box">
            ${iconSvg}
          </div>
          <div class="card-text-group">
            <span class="card-title">${escapeHtml(item.title)}</span>
            ${item.subtitle ? `<span class="card-subtitle">${escapeHtml(item.subtitle)}</span>` : ""}
          </div>
        </div>
        <svg class="card-arrow" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.2" fill="none"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
      </a>
      ${isAuthenticated ? `
        <button class="delete-btn-badge" title="Remove Link" data-index="${index}">&times;</button>
      ` : ""}
    `;

    if (isAuthenticated) {
      wrap.querySelector(".delete-btn-badge").addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (confirm(`Remove link: "${item.title}"?`)) {
          links.splice(index, 1);
          renderLinks();
          saveData();
        }
      });
    }

    container.appendChild(wrap);
  });
}

function getIconSvg(item) {
  const url = (item.url || "").toLowerCase();
  const title = (item.title || "").toLowerCase();

  if (url.includes("linkedin") || title.includes("linkedin")) {
    return `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z"></path></svg>`;
  }
  if (url.includes("overlay/contact-info") || title.includes("contact")) {
    return `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
  }
  if (url.startsWith("mailto:") || title.includes("mail")) {
    return `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`;
  }
  if (url.includes("wa.me") || url.includes("whatsapp") || title.includes("whatsapp")) {
    return `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>`;
  }
  // Generic link icon
  return `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`;
}

// =============================================================================
// Event Handlers
// =============================================================================

function setupEvents() {
  // Login Modal
  const loginModal = document.getElementById("loginModal");
  const loginBtn = document.getElementById("loginBtn");
  const closeLoginModal = document.getElementById("closeLoginModal");
  const cancelLogin = document.getElementById("cancelLogin");
  const loginForm = document.getElementById("loginForm");
  const loginPassword = document.getElementById("loginPassword");
  const loginError = document.getElementById("loginError");
  const togglePasswordBtn = document.getElementById("togglePasswordBtn");
  const eyeIcon = document.getElementById("eyeIcon");

  loginBtn.addEventListener("click", () => {
    loginPassword.value = "";
    loginError.style.display = "none";
    loginModal.classList.add("open");
    setTimeout(() => loginPassword.focus(), 80);
  });

  closeLoginModal.addEventListener("click", () => loginModal.classList.remove("open"));
  cancelLogin.addEventListener("click", () => loginModal.classList.remove("open"));

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const entered = loginPassword.value.trim();
    if (entered === PASSWORD_KEY) {
      isAuthenticated = true;
      localStorage.setItem(STORAGE_AUTH_KEY, "true");
      loginModal.classList.remove("open");
      render();
      showToast("Editor mode unlocked!");
    } else {
      loginError.style.display = "block";
      loginPassword.focus();
      loginPassword.select();
    }
  });

  togglePasswordBtn.addEventListener("click", () => {
    if (loginPassword.type === "password") {
      loginPassword.type = "text";
      eyeIcon.innerHTML = `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>`;
    } else {
      loginPassword.type = "password";
      eyeIcon.innerHTML = `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>`;
    }
  });

  // Logout
  document.getElementById("logoutBtn").addEventListener("click", () => {
    isAuthenticated = false;
    localStorage.setItem(STORAGE_AUTH_KEY, "false");
    render();
    showToast("Logged out to public view.");
  });

  // Edit Details Modal
  const editDetailsModal = document.getElementById("editDetailsModal");
  const editDetailsBtn = document.getElementById("editDetailsBtn");
  const closeEditDetails = document.getElementById("closeEditDetails");
  const cancelEditDetails = document.getElementById("cancelEditDetails");
  const editDetailsForm = document.getElementById("editDetailsForm");

  editDetailsBtn.addEventListener("click", () => {
    document.getElementById("inputFirstName").value = profileDetails.nameFirst || DEFAULT_DETAILS.nameFirst;
    document.getElementById("inputLastName").value = profileDetails.nameLast || DEFAULT_DETAILS.nameLast;
    document.getElementById("inputRole").value = profileDetails.role || DEFAULT_DETAILS.role;
    document.getElementById("inputEyebrow").value = profileDetails.eyebrow || DEFAULT_DETAILS.eyebrow;
    document.getElementById("inputLocationUrl").value = profileDetails.locationUrl || DEFAULT_DETAILS.locationUrl;
    document.getElementById("inputDesc").value = profileDetails.desc || DEFAULT_DETAILS.desc;
    document.getElementById("inputPhone").value = profileDetails.phone || DEFAULT_DETAILS.phone;
    document.getElementById("inputEmail").value = profileDetails.email || DEFAULT_DETAILS.email;
    editDetailsModal.classList.add("open");
  });

  closeEditDetails.addEventListener("click", () => editDetailsModal.classList.remove("open"));
  cancelEditDetails.addEventListener("click", () => editDetailsModal.classList.remove("open"));

  editDetailsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    profileDetails = {
      nameFirst: document.getElementById("inputFirstName").value.trim() || DEFAULT_DETAILS.nameFirst,
      nameLast: document.getElementById("inputLastName").value.trim() || DEFAULT_DETAILS.nameLast,
      role: document.getElementById("inputRole").value.trim() || DEFAULT_DETAILS.role,
      eyebrow: document.getElementById("inputEyebrow").value.trim() || DEFAULT_DETAILS.eyebrow,
      locationUrl: document.getElementById("inputLocationUrl").value.trim() || DEFAULT_DETAILS.locationUrl,
      desc: document.getElementById("inputDesc").value.trim() || DEFAULT_DETAILS.desc,
      phone: document.getElementById("inputPhone").value.trim() || DEFAULT_DETAILS.phone,
      email: document.getElementById("inputEmail").value.trim() || DEFAULT_DETAILS.email
    };
    render();
    editDetailsModal.classList.remove("open");
    saveData();
  });

  // Photo Upload
  const uploadPhotoBtn = document.getElementById("uploadPhotoBtn");
  const photoFileInput = document.getElementById("photoFileInput");

  uploadPhotoBtn.addEventListener("click", () => {
    photoFileInput.click();
  });

  photoFileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        showToast("Please choose a valid image file");
        return;
      }

      showToast("Optimizing photo...");
      compressImage(file, (optimizedDataUrl) => {
        savePhoto(optimizedDataUrl);
      });
      e.target.value = "";
    }
  });

  // Add Link Modal
  const addLinkModal = document.getElementById("addLinkModal");
  const addLinkBtn = document.getElementById("addLinkBtn");
  const closeAddLink = document.getElementById("closeAddLink");
  const cancelAddLink = document.getElementById("cancelAddLink");
  const addLinkForm = document.getElementById("addLinkForm");

  addLinkBtn.addEventListener("click", () => {
    document.getElementById("linkTitleInput").value = "";
    document.getElementById("linkSubtitleInput").value = "";
    document.getElementById("linkUrlInput").value = "";
    document.getElementById("linkIsPrimary").checked = false;
    addLinkModal.classList.add("open");
    setTimeout(() => document.getElementById("linkTitleInput").focus(), 80);
  });

  closeAddLink.addEventListener("click", () => addLinkModal.classList.remove("open"));
  cancelAddLink.addEventListener("click", () => addLinkModal.classList.remove("open"));

  addLinkForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("linkTitleInput").value.trim();
    const subtitle = document.getElementById("linkSubtitleInput").value.trim();
    const url = document.getElementById("linkUrlInput").value.trim();
    const isPrimary = document.getElementById("linkIsPrimary").checked;

    if (title && url) {
      links.push({
        id: Date.now().toString(),
        title,
        subtitle,
        url,
        isPrimary
      });
      renderLinks();
      addLinkModal.classList.remove("open");
      saveData();
    }
  });

  // Backdrop click to close modals
  document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) backdrop.classList.remove("open");
    });
  });

  // Escape to close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal-backdrop").forEach(b => b.classList.remove("open"));
    }
  });
}

function compressImage(file, callback) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const maxDim = 800;
      let w = img.width;
      let h = img.height;
      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, w, h);
      const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.82);
      callback(compressedDataUrl);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.style.display = "block";
  setTimeout(() => {
    t.style.display = "none";
  }, 2600);
}

function ensureUrl(url) {
  if (!url) return "#";
  if (!/^https?:\/\//i.test(url) && !url.startsWith("mailto:") && !url.startsWith("tel:")) {
    return "https://" + url;
  }
  return url;
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
