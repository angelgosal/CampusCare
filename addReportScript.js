const areaHeader = document.getElementById("areaHeader");
const areaContent = document.getElementById("areaContent");
const floorButtons = document.querySelectorAll("#floorButtons button");
const classButtons = document.getElementById("classButtons");
const areaText = document.getElementById("areaText");
const selectedAreaWrapper = document.getElementById("selectedAreaWrapper");
const selectedAreaBtn = document.getElementById("selectedAreaBtn");

const facilityHeader = document.getElementById("facilityHeader");
const facilityContent = document.getElementById("facilityContent");
const facilityButtons = document.getElementById("facilityButtons");
const facilityText = document.getElementById("facilityText");

const uploadBox = document.getElementById("uploadBox");
const fileInput = document.getElementById("fileInput");


const popup = document.getElementById("popup");
const othersBtn = document.getElementById("othersBtn");
const otherInput = document.getElementById("otherInput");
const closePopup = document.getElementById("closePopup");
const saveOther = document.getElementById("saveOther");

const submitBtn = document.getElementById("submitBtn");
const description = document.getElementById("description");

const uploadDefault = document.getElementById("uploadDefault");
const uploadPreview = document.getElementById("uploadPreview");

const areaIcon = document.getElementById("areaIcon");
const facilityIcon = document.getElementById("facilityIcon");

const confirmPopup = document.getElementById("confirmPopup");
const confirmSubmit = document.getElementById("confirmSubmit");
const confirmCancel = document.getElementById("confirmCancel");

const successPopup = document.getElementById("successPopup");
const successOk = document.getElementById("successOk");

const cancelBtn = document.getElementById("cancelBtn");

let selectedFloor = "";
let selectedClass = "";
let selectedFacility = "";
let uploadedFiles = [];
let uploadedImageData = "";

const classesByFloor = {
  "19th": [
    "01", "02", "03", "04", "05",
    "06", "07", "08", "09", "10",
    "11", "12", "13", "14", "15",
    "16", "17", "18", "19", "20",
    "SL", "Clinic", "Counseling",
    "Lecturer Room", "Tutoring Room",
    "Toilet ♀", "Toilet ♂", "Other"
  ],
  "7th": [
    "01", "02", "03", "04", "05",
    "06", "07", "08", "09", "10",
    "11", "12", "13", "14", "15",
    "16", "17", "18", "19", "20",
    "SL", "Toilet ♀", "Toilet ♂",
    "Other", "CC", "TC", "CL",
    "IoTL", "LA", "CR", "UA"
  ],
  "6th": [
     "01", "02", "03",
    "Library", "Office",
    "Toilet ♀", "Toilet ♂",
    "Meeting Room Soekarno",
    "Meeting Room Sjahrir",
    "Meeting Room Hatta",
    "Library Staff Office",
    "Student Affairs Office",
    "Other"
  ],
  "LG": [
    "CS Lab", "IS Lab", "MEI", "CL",
    "WL", "Toilet ♀", "Toilet ♂",
    "CS&IS Lab", "IE Lab",
    "Lab LG", "Mechatronic Lab",
    "Facilities Office",
    "Wet Lab", "Other"
  ]
};

cancelBtn.addEventListener("click", () => {
  window.location.href = "homepage.html";
});

function openPopup(popupElement) {
  popupElement.classList.remove("hidden");

  setTimeout(() => {
    popupElement.classList.add("active");
  }, 10);
}

function closePopupAnimated(popupElement) {
  popupElement.classList.remove("active");

  setTimeout(() => {
    popupElement.classList.add("hidden");
  }, 600);
}

areaHeader.addEventListener("click", () => {
  areaContent.classList.toggle("hidden");

  areaIcon.classList.toggle("open");
});

function resetAreaDropdown() {
  floorButtons.forEach(btn => {
    btn.classList.remove("hidden", "selected");
  });

  classButtons.innerHTML = "";
  classButtons.classList.add("hidden");
  selectedAreaWrapper.classList.add("hidden");
}

floorButtons.forEach(button => {
  button.addEventListener("click", () => {
    selectedFloor = button.dataset.floor;

    floorButtons.forEach(btn => {
      btn.classList.add("hidden");
      btn.classList.remove("selected");
    });

    button.classList.remove("hidden");
    button.classList.add("selected");

    classButtons.innerHTML = "";

    classesByFloor[selectedFloor].forEach(className => {
      const classBtn = document.createElement("button");
      if (className.includes("Toilet")) {
        const isFemale = className.includes("♀");

        classBtn.innerHTML = `
          Toilet 
          <img src="${isFemale ? "Girl-Icon.png" : "Boy-Icon.png"}" class="toilet-icon">
        `;
      } else {
        classBtn.textContent = className;
      }

      classBtn.addEventListener("click", () => {
        selectedClass = className;
        

        const areaLabel = `${selectedFloor} - ${selectedClass}`;

        if (selectedClass.includes("Toilet")) {
          const isFemale = selectedClass.includes("♀");
          const iconFile = isFemale ? "Girl-Icon.png" : "Boy-Icon.png";

          areaText.innerHTML = `
            ${selectedFloor} - Toilet
            <img src="${iconFile}" class="toilet-icon">
          `;

          selectedAreaBtn.innerHTML = `
            ${selectedFloor} - Toilet
            <img src="${iconFile}" class="toilet-icon">
          `;
        } else {
          areaText.textContent = areaLabel;
          selectedAreaBtn.textContent = areaLabel;
        }

        floorButtons.forEach(btn => btn.classList.add("hidden"));
        classButtons.innerHTML = "";
        classButtons.classList.add("hidden");

        selectedAreaWrapper.classList.remove("hidden");
      });

      classButtons.appendChild(classBtn);
    });

    classButtons.classList.remove("hidden");
  });
});

selectedAreaBtn.addEventListener("click", () => {
  resetAreaDropdown();
});

facilityHeader.addEventListener("click", () => {
  facilityContent.classList.toggle("hidden");

  facilityIcon.classList.toggle("open");
});

function resetFacilityDropdown() {
  [...facilityButtons.children].forEach(button => {
    button.classList.remove("hidden", "selected");
  });
}

facilityButtons.addEventListener("click", event => {
  const btn = event.target.closest("button");
  if (!btn) return;

  // If user clicks the already selected facility, show all options again
  if (btn.classList.contains("selected")) {
    resetFacilityDropdown();
    return;
  }

  if (btn.id === "othersBtn") {
    openPopup(popup);
    return;
    }

selectedFacility = btn.textContent.trim();

if (selectedFacility === "Toilet") {

  const isFemale = selectedClass.includes("♀");

  const iconFile = isFemale
    ? "Girl-Icon.png"
    : "Boy-Icon.png";

  facilityText.innerHTML = `
    Toilet
    <img src="${iconFile}" class="toilet-icon">
  `;

} else {
  facilityText.textContent = selectedFacility;
}

  [...facilityButtons.children].forEach(button => {
    button.classList.add("hidden");
    button.classList.remove("selected");
  });

  btn.classList.remove("hidden");
  btn.classList.add("selected");
});

closePopup.addEventListener("click", () => {
  closePopupAnimated(popup);
});

saveOther.addEventListener("click", () => {
  const customFacility = otherInput.value.trim();

  if (customFacility === "") {
    alert("Please enter the facility name.");
    return;
  }

  selectedFacility = customFacility;
  facilityText.textContent = "Others...";

  [...facilityButtons.children].forEach(button => {
    button.classList.add("hidden");
  });

  othersBtn.classList.remove("hidden");
  othersBtn.classList.add("selected");

  closePopupAnimated(popup);
});

uploadBox.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Only images are allowed.");
    fileInput.value = "";
    return;
  }

  if (file.size > 1 * 1024 * 1024) {
    alert("Image must be less than 1MB.");
    fileInput.value = "";
    return;
  }

  uploadedFiles = [file];

  const reader = new FileReader();

  reader.onload = function (event) {
    uploadedImageData = event.target.result;

    const fileExtension = file.name.split(".").pop().toUpperCase();

    uploadDefault.classList.add("hidden");
    uploadPreview.classList.remove("hidden");

    uploadPreview.innerHTML = `
      <img src="${uploadedImageData}" alt="Uploaded image">
      <p>${file.name} (${fileExtension}) uploaded</p>
    `;
  };

  reader.readAsDataURL(file);
});

submitBtn.addEventListener("click", () => {
  if (!selectedFloor || !selectedClass) {
    alert("Please choose an area.");
    return;
  }

  if (!selectedFacility) {
    alert("Please choose a facility.");
    return;
  }

  openPopup(confirmPopup);
});

confirmSubmit.addEventListener("click", () => {
  const report = {
    area: `${selectedFloor} - ${selectedClass}`,
    facility: selectedFacility,
    description: description.value.trim(),
    status: "Reported",
    date: new Date().toISOString().split("T")[0],
    image: uploadedImageData || "",
    imageName: uploadedFiles[0] ? uploadedFiles[0].name : "",
    imageType: uploadedFiles[0] ? uploadedFiles[0].type : ""
  };

  try {
    const reports = JSON.parse(localStorage.getItem("reports")) || [];
    reports.push(report);
    localStorage.setItem("reports", JSON.stringify(reports));

    closePopupAnimated(confirmPopup);

    setTimeout(() => {
      successPopup.classList.add("no-blur");
      openPopup(successPopup);
    }, 600);

  } catch (error) {
    console.error(error);
    alert("Submit failed. The uploaded image may be too large.");
  }
});

confirmCancel.addEventListener("click", () => {
  closePopupAnimated(confirmPopup);
});

successOk.addEventListener("click", () => {
  window.location.href = "homepage.html";
});

const reports = JSON.parse(localStorage.getItem("reports")) || [];

reports.forEach(report => {
  console.log(report.area);
  console.log(report.facility);
  console.log(report.description);
  console.log(report.status);
});
