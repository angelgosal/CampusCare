// ── Domain validation ──────────────────────────────────────────
const ALLOWED_DOMAIN = "sampoernauniversity.ac.id";

function isValidSampoernaEmail(email) {
  const e = email.toLowerCase().trim();
  return e.endsWith("@" + ALLOWED_DOMAIN) || e.endsWith("." + ALLOWED_DOMAIN);
}

// ── Admin accounts ─────────────────────────────────────────────
const ADMIN_ACCOUNTS = [
  { email: "jennifer.siawiti@my.sampoernauniversity.ac.id", password: "admin098" },
  // Add more admins here:
  // { email: "admin@my.sampoernauniversity.ac.id", password: "adminXYZ" },
];

function isAdminAccount(email, password) {
  return ADMIN_ACCOUNTS.some(
    a => a.email.toLowerCase() === email.toLowerCase().trim() && a.password === password
  );
}

// ── LocalStorage helpers ───────────────────────────────────────
function getUsers() {
  return JSON.parse(localStorage.getItem("cc_users") || "{}");
}

function saveUsers(users) {
  localStorage.setItem("cc_users", JSON.stringify(users));
}

function setSession(email, role) {
  localStorage.setItem("cc_session", JSON.stringify({ email, role }));
}

function getSession() {
  return JSON.parse(localStorage.getItem("cc_session") || "null");
}

function clearSession() {
  localStorage.removeItem("cc_session");
}

// ── Eye toggle ─────────────────────────────────────────────────
function togglePassword(inputId, btn) {
  const input      = document.getElementById(inputId);
  const openIcon   = btn.querySelector(".eye-open-icon");
  const closedIcon = btn.querySelector(".eye-closed-icon");

  if (input.type === "password") {
    input.type = "text";
    if (openIcon)   openIcon.style.display   = "none";
    if (closedIcon) closedIcon.style.display = "";
    btn.setAttribute("aria-label", "Hide password");
  } else {
    input.type = "password";
    if (openIcon)   openIcon.style.display   = "";
    if (closedIcon) closedIcon.style.display = "none";
    btn.setAttribute("aria-label", "Show password");
  }
}

// ── Inline field error helpers (login/signup) ──────────────────
function showError(fieldId, msg) {
  const existing = document.getElementById(fieldId + "-error");
  if (existing) existing.remove();
  if (!msg) return;

  const field = document.getElementById(fieldId);
  if (!field) return;

  const err = document.createElement("div");
  err.id        = fieldId + "-error";
  err.className = "field-error";
  err.textContent = msg;

  const wrapper = field.closest(".field-wrapper") || field;
  wrapper.insertAdjacentElement("afterend", err);
}

function clearErrors() {
  document.querySelectorAll(".field-error").forEach(e => e.remove());
}

// ── LOGIN ──────────────────────────────────────────────────────
function login() {
  clearErrors();

  const email    = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  let valid = true;

  if (!email) {
    showError("email", "Please enter your email.");
    valid = false;
  } else if (!isValidSampoernaEmail(email)) {
    showError("email", "Please use a valid Sampoerna University email.");
    valid = false;
  }

  if (!password) {
    showError("password", "Please enter your password.");
    valid = false;
  }

  if (!valid) return;

  if (isAdminAccount(email, password)) {
    setSession(email, "admin");
    window.location.href = "admin.html";
    return;
  }

  const users = getUsers();
  const key   = email.toLowerCase();

  if (!users[key]) {
    showError("email", "No account found. Please sign up first.");
    return;
  }

  if (users[key].password !== password) {
    showError("password", "Incorrect password.");
    return;
  }

  setSession(email, "user");
  window.location.href = "homepage.html";
}

// ── SIGN UP ────────────────────────────────────────────────────
function signup() {
  clearErrors();

  const email    = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  let valid = true;

  if (!email) {
    showError("email", "Please enter your email.");
    valid = false;
  } else if (!isValidSampoernaEmail(email)) {
    showError("email", "Please use a valid Sampoerna University email.");
    valid = false;
  }

  if (!password) {
    showError("password", "Please enter a password.");
    valid = false;
  } else if (password.length < 6) {
    showError("password", "Password must be at least 6 characters.");
    valid = false;
  }

  if (!valid) return;

  const users = getUsers();
  const key   = email.toLowerCase();

  if (users[key] || isAdminAccount(email, "")) {
    showError("email", "An account with this email already exists. Please log in.");
    return;
  }

  users[key] = { email, password, createdAt: new Date().toISOString() };
  saveUsers(users);

  setSession(email, "user");
  window.location.href = "homepage.html";
}

// ── FORGOT PASSWORD ────────────────────────────────────────────
function forgotPassword() {
  const email = prompt("Enter your Sampoerna University email for password reset:");
  if (!email) return;

  if (!isValidSampoernaEmail(email.trim())) {
    alert("Please use a valid Sampoerna University email.");
    return;
  }

  const users = getUsers();
  if (!users[email.trim().toLowerCase()]) {
    alert("No account found with that email.");
    return;
  }

  alert("Password reset link sent to " + email.trim() + " (demo)");
}

// ── LOGOUT ────────────────────────────────────────────────────
function logout() {
  clearSession();
  window.location.href = "login.html";
}

// ── AUTH GUARD ────────────────────────────────────────────────
function authGuard(requiredRole) {
  const session = getSession();
  if (!session) { window.location.href = "login.html"; return; }
  if (requiredRole === "admin" && session.role !== "admin") {
    window.location.href = "homepage.html";
  }
}

// ════════════════════════════════════════
// FEEDBACK — localStorage only, no server
// ════════════════════════════════════════
let anonymousChoice = false;

// Base top positions (px) for absolutely-positioned step 2 elements
const FB_BASE = {
  feedbackAnon:     209,
  feedbackIdentity: 340,
  btnRow:           648,
  errorH:           34   // height of one error banner + gap
};

function fbRecalcPositions() {
  const feedbackWrap = document.getElementById("feedbackWrap");
  const btnRow       = document.querySelector("#step2 .btn-row");
  if (!feedbackWrap || !btnRow) return;

  const emailShift    = document.getElementById("fbEmail-error")    ? FB_BASE.errorH : 0;
  const feedbackShift = document.getElementById("feedback-error")   ? FB_BASE.errorH : 0;
  const feedbackBase  = anonymousChoice ? FB_BASE.feedbackAnon : FB_BASE.feedbackIdentity;

  feedbackWrap.style.top = (feedbackBase + emailShift) + "px";
  btnRow.style.top       = (FB_BASE.btnRow + emailShift + feedbackShift) + "px";
}

function showFbError(fieldId, msg) {
  const old = document.getElementById(fieldId + "-error");
  if (old) old.remove();
  if (!msg) { fbRecalcPositions(); return; }

  const err = document.createElement("div");
  err.className   = "field-error";
  err.id          = fieldId + "-error";
  err.textContent = msg;
  document.getElementById("step2").appendChild(err);

  // Position just below the field
  const field   = document.getElementById(fieldId);
  const wrapper = field.closest(".field-wrap") || field.parentNode;
  const top     = parseInt(wrapper.style.top || getComputedStyle(wrapper).top);
  const h       = wrapper.offsetHeight || 73;
  err.style.top  = (top + h + 4) + "px";

  fbRecalcPositions();
}

function clearFbErrors() {
  document.querySelectorAll("#step2 .field-error").forEach(e => e.remove());
  fbRecalcPositions();
}

function chooseAnon(choice) {
  anonymousChoice = choice;
  document.getElementById("step1").style.display = "none";
  document.getElementById("step2").style.display = "block";

  const emailField   = document.getElementById("emailField");
  const feedbackWrap = document.getElementById("feedbackWrap");
  const btnRow       = document.querySelector("#step2 .btn-row");

  if (choice) {
    emailField.style.display = "none";
    feedbackWrap.classList.remove("with-identity");
  } else {
    emailField.style.display = "block";
    feedbackWrap.classList.add("with-identity");
  }
  btnRow.style.top = FB_BASE.btnRow + "px";
}

function goBack() {
  clearFbErrors();
  document.getElementById("step2").style.display = "none";
  document.getElementById("step1").style.display = "block";
}

function confirmSubmit() {
  clearFbErrors();
  const feedback = document.getElementById("feedback").value.trim();
  const email    = document.getElementById("fbEmail") ? document.getElementById("fbEmail").value.trim() : "";
  let valid = true;

  if (!anonymousChoice) {
    if (!email) {
      showFbError("fbEmail", "Please enter your Sampoerna University email.");
      valid = false;
    } else if (!isValidSampoernaEmail(email)) {
      showFbError("fbEmail", "Please use a valid Sampoerna University email (@sampoernauniversity.ac.id).");
      valid = false;
    }
  }

  if (!feedback) {
    showFbError("feedback", "Please enter your feedback before submitting.");
    valid = false;
  }

  if (!valid) return;

  const overlay = document.getElementById("step3-overlay");
  overlay.classList.remove("hidden");
  setTimeout(() => overlay.classList.add("active"), 10);
}

function goBackToInput() {
  const overlay = document.getElementById("step3-overlay");
  overlay.classList.remove("active");
  setTimeout(() => overlay.classList.add("hidden"), 600);
}

function submitFeedbackFinal() {
  const isAnon   = anonymousChoice;
  const email    = isAnon ? null : document.getElementById("fbEmail").value.trim();
  const feedback = document.getElementById("feedback").value.trim();

  // Save to localStorage — admin reads from here directly
  const feedbacks = JSON.parse(localStorage.getItem("cc_feedbacks") || "[]");
  feedbacks.push({
    id:        Date.now(),
    timestamp: new Date().toLocaleString(),
    type:      isAnon ? "Anonymous" : "With Identity",
    email:     isAnon ? null : (email || "(not provided)"),
    feedback:  feedback
  });
  localStorage.setItem("cc_feedbacks", JSON.stringify(feedbacks));

  // Dismiss confirm overlay
  const overlay = document.getElementById("step3-overlay");
  overlay.classList.remove("active");
  setTimeout(() => overlay.classList.add("hidden"), 600);

  document.getElementById("step2").style.display = "none";

  const step4 = document.getElementById("step4");
  step4.style.display = "flex";
  setTimeout(() => step4.classList.add("active"), 10);
}

function resetFeedback() {
  const step4 = document.getElementById("step4");
  step4.classList.remove("active");
  setTimeout(() => { step4.style.display = "none"; }, 600);
  document.getElementById("step1").style.display = "block";
  document.getElementById("feedback").value = "";
  const fbEmail = document.getElementById("fbEmail");
  if (fbEmail) fbEmail.value = "";
  clearFbErrors();
}
