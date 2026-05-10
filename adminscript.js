const adminList = document.getElementById("adminList");
const searchInput = document.getElementById("searchInput");
const sortBtn = document.getElementById("sortBtn");
const sortMenu = document.getElementById("sortMenu");

const detailPopup = document.getElementById("detailPopup");
const closeDetail = document.getElementById("closeDetail");
const detailImg = document.getElementById("detailImg");
const detailStatus = document.getElementById("detailStatus");
const detailDate = document.getElementById("detailDate");
const detailLocation = document.getElementById("detailLocation");
const detailFacility = document.getElementById("detailFacility");
const detailDesc = document.getElementById("detailDesc");

let currentReports = JSON.parse(localStorage.getItem("reports")) || [];

function saveReports() {
  localStorage.setItem("reports", JSON.stringify(currentReports));
}

function normalizeStatus(status) {
  if (status === "Issued") return "Reported";
  return status || "Reported";
}

function renderReports(reportsToShow = currentReports) {
  adminList.innerHTML = "";

  if (reportsToShow.length === 0) {
    adminList.innerHTML = `<p class="no-data">No reports found.</p>`;
    return;
  }

  reportsToShow.forEach((report) => {
    const realIndex = currentReports.indexOf(report);
    const row = document.createElement("div");
    row.className = "report-row";

    row.innerHTML = `
      <span>${report.area || "-"}</span>
      <span>${report.facility || "-"}</span>

      <div class="status-wrapper">
        <button class="status-btn" data-index="${realIndex}">
          ${normalizeStatus(report.status)}
        </button>

        <div class="status-menu">
          <div class="status-option" data-status="Reported" data-index="${realIndex}">Reported</div>
          <div class="status-option" data-status="In-Progress" data-index="${realIndex}">In-Progress</div>
          <div class="status-option" data-status="Fixed" data-index="${realIndex}">Fixed</div>
        </div>
      </div>

      <button class="view-detail" data-index="${realIndex}">
        View details
      </button>
    `;

    adminList.appendChild(row);
  });
}

adminList.addEventListener("click", (e) => {
    if (e.target.classList.contains("status-btn")) {
        const wrapper = e.target.closest(".status-wrapper");
        const menu = wrapper.querySelector(".status-menu");
        const rect = e.target.getBoundingClientRect();

        document.querySelectorAll(".status-menu").forEach(m => {
            if (m !== menu) m.style.display = "none";
        });

        menu.style.left = `${rect.left - 12}px`;
        menu.style.top = `${rect.bottom + 4}px`;

        menu.style.display = menu.style.display === "block" ? "none" : "block";
    }

  if (e.target.classList.contains("status-option")) {
    const index = e.target.dataset.index;
    const newStatus = e.target.dataset.status;

    currentReports[index].status = newStatus;
    saveReports();
    renderReports();
  }

  if (e.target.classList.contains("view-detail")) {
    const index = e.target.dataset.index;
    const report = currentReports[index];

    detailImg.src = report.image || "";
    detailStatus.textContent = `Status: ${normalizeStatus(report.status)}`;
    detailDate.textContent = `Date: ${report.date || "-"}`;
    detailLocation.textContent = `Location: ${report.area || "-"}`;
    detailFacility.textContent = `Facility: ${report.facility || "-"}`;
    detailDesc.textContent = report.description || "No description";

    detailPopup.classList.remove("hidden");
  }
});

closeDetail.addEventListener("click", () => {
  detailPopup.classList.add("hidden");
});

searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase();

  const filtered = currentReports.filter(report => {
    return `
      ${report.area}
      ${report.facility}
      ${normalizeStatus(report.status)}
      ${report.date}
      ${report.description}
    `.toLowerCase().includes(keyword);
  });

  renderReports(filtered);
});

sortBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  const isOpen = sortMenu.classList.contains("open");
  sortMenu.classList.toggle("open");
  sortBtn.querySelector("i").style.transform = isOpen ? "rotate(0deg)" : "rotate(180deg)";
});

document.querySelectorAll(".sort-item").forEach(item => {
  item.addEventListener("click", () => {
    const sortType = item.dataset.sort;

    // Always work from a fresh copy of the saved reports
    let sorted = JSON.parse(localStorage.getItem("reports")) || [];

    if (sortType === "latest") {
      sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
      currentReports = sorted;
      renderReports(currentReports);
    } else if (sortType === "oldest") {
      sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
      currentReports = sorted;
      renderReports(currentReports);
    } else if (["19th", "7th", "6th", "LG"].includes(sortType)) {
      // Filter by floor — don't mutate currentReports so status edits still work
      currentReports = sorted;
      const filtered = currentReports.filter(report => report.area?.startsWith(sortType));
      renderReports(filtered);
    } else {
      currentReports = sorted;
      renderReports(currentReports);
    }

    sortMenu.classList.remove("open");
    sortBtn.querySelector("i").style.transform = "rotate(0deg)";
  });
});

window.addEventListener("click", (e) => {
  if (!e.target.closest(".status-wrapper")) {
    document.querySelectorAll(".status-menu").forEach(menu => {
      menu.style.display = "none";
    });
  }

  if (!e.target.closest(".sort-wrapper")) {
    sortMenu.classList.remove("open");
    sortBtn.querySelector("i").style.transform = "rotate(0deg)";
  }

  // Close feedback sort menu too
  if (!e.target.closest(".fb-sort-wrapper")) {
    const fbMenu = document.getElementById("fbSortMenu");
    if (fbMenu) {
      fbMenu.classList.remove("open");
      const fbSortBtn = document.getElementById("fbSortBtn");
      if (fbSortBtn) fbSortBtn.querySelector("i").style.transform = "rotate(0deg)";
    }
  }
});

renderReports();

// ════════════════════════════════════════
// TAB SWITCHING
// ════════════════════════════════════════
function switchTab(tab) {
  var panelReports   = document.getElementById('panelReports');
  var panelFeedback  = document.getElementById('panelFeedback');
  var tabReports     = document.getElementById('tabReports');
  var tabFeedback    = document.getElementById('tabFeedback');
  var tabReportsFb   = document.getElementById('tabReportsFb');
  var tabFeedbackFb  = document.getElementById('tabFeedbackFb');

  if (tab === 'reports') {
    panelReports.classList.remove('hidden');
    panelFeedback.classList.add('hidden');
    if (tabReports)    tabReports.classList.add('active');
    if (tabFeedback)   tabFeedback.classList.remove('active');
    if (tabReportsFb)  tabReportsFb.classList.add('active');
    if (tabFeedbackFb) tabFeedbackFb.classList.remove('active');
  } else {
    panelReports.classList.add('hidden');
    panelFeedback.classList.remove('hidden');
    if (tabReports)    tabReports.classList.remove('active');
    if (tabFeedback)   tabFeedback.classList.add('active');
    if (tabReportsFb)  tabReportsFb.classList.remove('active');
    if (tabFeedbackFb) tabFeedbackFb.classList.add('active');
    renderFeedbacks();
  }
}

// ════════════════════════════════════════
// FEEDBACK RENDERING
// ════════════════════════════════════════
var currentFbIndex = null;

function getFeedbacks() {
  return JSON.parse(localStorage.getItem('cc_feedbacks') || '[]');
}

function saveFeedbacks(arr) {
  localStorage.setItem('cc_feedbacks', JSON.stringify(arr));
}

function renderFeedbacks(list) {
  var feedbackList = document.getElementById('feedbackList');
  var all = getFeedbacks();
  var items = list !== undefined ? list : all;

  feedbackList.innerHTML = '';

  if (items.length === 0) {
    feedbackList.innerHTML = '<p class="no-data">No feedback yet.</p>';
    return;
  }

  // Show newest first by default (unless a custom list/sort was passed)
  var reversed = items.slice().reverse();
  reversed.forEach(function(fb) {
    var realIndex = all.findIndex(function(f) { return f.id === fb.id; });
    var row = document.createElement('div');
    row.className = 'report-row fb-row';
    var shortText = fb.feedback.length > 30 ? fb.feedback.slice(0, 30) + '…' : fb.feedback;
    row.innerHTML =
      '<span class="fb-type-badge ' + (fb.type === 'Anonymous' ? 'badge-anon' : 'badge-identity') + '">' + fb.type + '</span>' +
      '<span class="fb-date">' + fb.timestamp + '</span>' +
      '<button class="view-detail fb-view" data-index="' + realIndex + '">View</button>';
    feedbackList.appendChild(row);
  });
}

var feedbackListEl = document.getElementById('feedbackList');
if (feedbackListEl) feedbackListEl.addEventListener('click', function(e) {
  if (e.target.classList.contains('fb-view')) {
    var index = e.target.dataset.index;
    var all   = getFeedbacks();
    var fb    = all[index];
    currentFbIndex = index;

    document.getElementById('fbDetailType').textContent  = 'Type: ' + fb.type;
    document.getElementById('fbDetailDate').textContent  = 'Date: ' + fb.timestamp;
    var emailRow = document.getElementById('fbDetailEmail');
    if (fb.email) {
      emailRow.textContent = 'Email: ' + fb.email;
      emailRow.style.display = 'block';
    } else {
      emailRow.style.display = 'none';
    }
    document.getElementById('fbDetailBody').textContent = fb.feedback;

    document.getElementById('fbDetailPopup').classList.remove('hidden');
  }
});

var _closeFbDetail = document.getElementById('closeFbDetail');
if (_closeFbDetail) _closeFbDetail.addEventListener('click', function() {
  document.getElementById('fbDetailPopup').classList.add('hidden');
});

var _fbDeleteBtn = document.getElementById('fbDeleteBtn');
if (_fbDeleteBtn) _fbDeleteBtn.addEventListener('click', function() {
  if (currentFbIndex === null) return;
  var all = getFeedbacks();
  all.splice(currentFbIndex, 1);
  saveFeedbacks(all);
  document.getElementById('fbDetailPopup').classList.add('hidden');
  renderFeedbacks();
});

var _fbSearchInput = document.getElementById('fbSearchInput');
if (_fbSearchInput) _fbSearchInput.addEventListener('input', function() {
  var kw = this.value.toLowerCase();
  var filtered = getFeedbacks().filter(function(fb) {
    return (fb.feedback + fb.type + (fb.email || '') + fb.timestamp).toLowerCase().includes(kw);
  });
  renderFeedbacks(filtered);
});

// ════════════════════════════════════════
// FEEDBACK SORT
// ════════════════════════════════════════
var _fbSortBtn = document.getElementById('fbSortBtn');
var _fbSortMenu = document.getElementById('fbSortMenu');

if (_fbSortBtn && _fbSortMenu) {
  _fbSortBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    var isOpen = _fbSortMenu.classList.contains('open');
    _fbSortMenu.classList.toggle('open');
    _fbSortBtn.querySelector('i').style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
  });

  _fbSortMenu.querySelectorAll('.sort-item').forEach(function(item) {
    item.addEventListener('click', function() {
      var sortType = item.dataset.sort;
      var all = getFeedbacks();

      if (sortType === 'latest') {
        all.sort(function(a, b) { return new Date(b.timestamp) - new Date(a.timestamp); });
        renderFeedbacks(all);
      } else if (sortType === 'oldest') {
        all.sort(function(a, b) { return new Date(a.timestamp) - new Date(b.timestamp); });
        renderFeedbacks(all);
      } else if (sortType === 'anonymous') {
        var filtered = all.filter(function(fb) { return fb.type === 'Anonymous'; });
        renderFeedbacks(filtered);
      } else if (sortType === 'identity') {
        var filtered = all.filter(function(fb) { return fb.type !== 'Anonymous'; });
        renderFeedbacks(filtered);
      }

      _fbSortMenu.classList.remove('open');
      _fbSortBtn.querySelector('i').style.transform = 'rotate(0deg)';
    });
  });
}
