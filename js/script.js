// ===== Elements =====
var modal = document.getElementById("addContactModal");
var addBtn = document.getElementById("add-btn");
var closeBtn = document.getElementById("closebtn");
var cancelBtn = document.getElementById("cancelBtn");
var contactForm = document.getElementById("contactForm");
var avatarInput = document.getElementById("avatarInput");
var avatarPreview = document.getElementById("avatarPreview");
var fullName = document.getElementById("fullName");
var phone = document.getElementById("phone");
var email = document.getElementById("email");
var address = document.getElementById("address");
var contactsGrid = document.getElementById("contacts-grid");
var noContacts = document.querySelector(".No-contacts-found");
var favoriteCheck = document.getElementById("favorite");
var emergencyCheck = document.getElementById("emergency");
var groupSelect = document.getElementById("group");

var modalTitle = document.querySelector(".add-new-contact .top-header h2");
var submitText = document.querySelector("#submitBtn .btn-text");
var updatedIndex;  

var contacts = JSON.parse(localStorage.getItem("contacts")) || [];
displayContacts();

function openModal() {
  modal.classList.add("show");
}

function closeModal() {
  modal.classList.remove("show");
  contactForm.reset();
  resetAvatar();
  updatedIndex = undefined;
  modalTitle.textContent = "Add New Contact";
  submitText.textContent = "Save Contact";
}

addBtn.addEventListener("click", openModal);
closeBtn.addEventListener("click", closeModal);
cancelBtn.addEventListener("click", closeModal);

modal.addEventListener("click", function (e) {
  if (e.target === modal) closeModal();
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && modal.classList.contains("show")) closeModal();
});

// ===== Change Photo preview =====
var avatarIcon = avatarPreview.innerHTML;

var avatarData = "";  
avatarInput.addEventListener("change", function () {
  var file = avatarInput.files[0];
  if (!file) return;

  var reader = new FileReader();
  reader.onload = function () {
    // make the photo small (200x200) so localStorage doesn't get full
    var img = new Image();
    img.onload = function () {
      var canvas = document.createElement("canvas");
      canvas.width = 200;
      canvas.height = 200;
      var ctx = canvas.getContext("2d");

      var size = Math.min(img.width, img.height);
      var x = (img.width - size) / 2;
      var y = (img.height - size) / 2;
      ctx.drawImage(img, x, y, size, size, 0, 0, 200, 200);

      avatarData = canvas.toDataURL("image/jpeg", 0.8);
      showAvatar(avatarData);
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
});

function showAvatar(src) {
  avatarPreview.innerHTML =
    '<img src="' + src + '" alt="" class="w-100 h-100 rounded-circle" style="object-fit: cover;">';
}

function resetAvatar() {
  avatarPreview.innerHTML = avatarIcon;
  avatarData = "";
  avatarInput.value = "";   
}

// ===== Build one card =====
function createCard(contact, index) {
  return `
    <div class="contacts overflow-hidden">
<div class="d-flex container-top flex-column">
  <div class="d-flex align-items-center gap-2">
    <div class="profilePic d-flex align-items-center justify-content-center orange-bg position-relative">
      ${contact.photo ? `<img src="${contact.photo}" alt="" class="w-100 h-100" style="object-fit: cover; border-radius: inherit;">` : `<span>${contact.Name.trim().split(/\s+/).slice(0, 2).map(w => w.charAt(0)).join("").toUpperCase()}</span>`}
          <div class="position-absolute favorites-p-a align-items-center justify-content-center ${contact.favorite ? "d-flex" : "d-none"}"><svg class="svg-inline--fa fa-star" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="star" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path></svg></div>
    <div class="position-absolute emergency-p-a align-items-center justify-content-center ${contact.emergency ? "d-flex" : "d-none"}"><svg class="svg-inline--fa fa-heart-pulse" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="heart-pulse" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M228.3 469.1L47.6 300.4c-4.2-3.9-8.2-8.1-11.9-12.4h87c22.6 0 43-13.6 51.7-34.5l10.5-25.2 49.3 109.5c3.8 8.5 12.1 14 21.4 14.1s17.8-5 22-13.3L320 253.7l1.7 3.4c9.5 19 28.9 31 50.1 31H476.3c-3.7 4.3-7.7 8.5-11.9 12.4L283.7 469.1c-7.5 7-17.4 10.9-27.7 10.9s-20.2-3.9-27.7-10.9zM503.7 240h-132c-3 0-5.8-1.7-7.2-4.4l-23.2-46.3c-4.1-8.1-12.4-13.3-21.5-13.3s-17.4 5.1-21.5 13.3l-41.4 82.8L205.9 158.2c-3.9-8.7-12.7-14.3-22.2-14.1s-18.1 5.9-21.8 14.8l-31.8 76.3c-1.2 3-4.2 4.9-7.4 4.9H16c-2.6 0-5 .4-7.3 1.1C3 225.2 0 208.2 0 190.9v-5.8c0-69.9 50.5-129.5 119.4-141C165 36.5 211.4 51.4 244 84l12 12 12-12c32.6-32.6 79-47.5 124.6-39.9C461.5 55.6 512 115.2 512 185.1v5.8c0 16.9-2.8 33.5-8.3 49.1z"></path></svg></div>

    </div>
    <div>
          <h3 class="name">${contact.Name}</h3>
    <div class="d-flex align-items-center phoneNum gap-1">
      <div class="icon d-flex align-items-center justify-content-center"><svg class="svg-inline--fa fa-phone" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="phone" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"></path></svg></div>
      <span class="num">${contact.phonenum}</span>
    </div>
    </div>
  </div>
  <div class="d-flex flex-column gap-2 mt-2">
  ${contact.email ? `
  <div class="d-flex align-items-center gap-2">
    <div class="gmail-icon d-flex align-items-center justify-content-center"><svg class="svg-inline--fa fa-envelope" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="envelope" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"></path></svg></div>
    <span class="gmail">${contact.email}</span>
  </div>
  ` : ""}
  ${contact.address ? `
  <div class="d-flex align-items-center gap-2">
    <div class="phone-icon d-flex align-items-center justify-content-center"><svg class="svg-inline--fa fa-location-dot" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="location-dot" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" data-fa-i2svg=""><path fill="currentColor" d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"></path></svg></div>
    <span class="location">${contact.address}</span>
  </div>
  ` : ""}
  ${contact.group || contact.emergency ? `
  <div class="d-flex align-items-center flex-wrap gap-2">
    ${contact.group ? `<span class="group-tag ${contact.group}">${contact.group.charAt(0).toUpperCase() + contact.group.slice(1)}</span>` : ""}
    ${contact.emergency ? `<span class="emergency-tag d-inline-flex align-items-center gap-1"><svg class="svg-inline--fa fa-heart-pulse" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="heart-pulse" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M228.3 469.1L47.6 300.4c-4.2-3.9-8.2-8.1-11.9-12.4h87c22.6 0 43-13.6 51.7-34.5l10.5-25.2 49.3 109.5c3.8 8.5 12.1 14 21.4 14.1s17.8-5 22-13.3L320 253.7l1.7 3.4c9.5 19 28.9 31 50.1 31H476.3c-3.7 4.3-7.7 8.5-11.9 12.4L283.7 469.1c-7.5 7-17.4 10.9-27.7 10.9s-20.2-3.9-27.7-10.9zM503.7 240h-132c-3 0-5.8-1.7-7.2-4.4l-23.2-46.3c-4.1-8.1-12.4-13.3-21.5-13.3s-17.4 5.1-21.5 13.3l-41.4 82.8L205.9 158.2c-3.9-8.7-12.7-14.3-22.2-14.1s-18.1 5.9-21.8 14.8l-31.8 76.3c-1.2 3-4.2 4.9-7.4 4.9H16c-2.6 0-5 .4-7.3 1.1C3 225.2 0 208.2 0 190.9v-5.8c0-69.9 50.5-129.5 119.4-141C165 36.5 211.4 51.4 244 84l12 12 12-12c32.6-32.6 79-47.5 124.6-39.9C461.5 55.6 512 115.2 512 185.1v5.8c0 16.9-2.8 33.5-8.3 49.1z"></path></svg> Emergency</span>` : ""}
  </div>
  ` : ""}

  </div>
</div>
<div class="container-bottom d-flex align-items-center justify-content-between">
<div class="d-flex align-items-center gap-1">
  <a href="tel:${contact.phonenum}" class="d-flex align-items-center justify-content-center c-green"><svg class="svg-inline--fa fa-phone" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="phone" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"></path></svg></a>
  ${contact.email ? `<a href="mailto:${contact.email}" class="d-flex align-items-center justify-content-center c-vilot"><svg class="svg-inline--fa fa-envelope" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="envelope" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"></path></svg></a>` : ""}
</div>
<div class="d-flex align-items-center gap-2">
  <button onclick="toggleFavorite(${index})" class="d-flex align-items-center justify-content-center Favorite-btn ${contact.favorite ? "active" : ""}">${contact.favorite ? `<svg class="svg-inline--fa fa-star" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="star" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path></svg>` : `<svg class="svg-inline--fa fa-star" aria-hidden="true" focusable="false" data-prefix="far" data-icon="star" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.6 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z"></path></svg>`}</button>
  <button onclick="toggleEmergency(${index})" class="d-flex align-items-center justify-content-center Emergency-btn ${contact.emergency ? "active" : ""}">${contact.emergency ? `<svg class="svg-inline--fa fa-heart-pulse" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="heart-pulse" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M228.3 469.1L47.6 300.4c-4.2-3.9-8.2-8.1-11.9-12.4h87c22.6 0 43-13.6 51.7-34.5l10.5-25.2 49.3 109.5c3.8 8.5 12.1 14 21.4 14.1s17.8-5 22-13.3L320 253.7l1.7 3.4c9.5 19 28.9 31 50.1 31H476.3c-3.7 4.3-7.7 8.5-11.9 12.4L283.7 469.1c-7.5 7-17.4 10.9-27.7 10.9s-20.2-3.9-27.7-10.9zM503.7 240h-132c-3 0-5.8-1.7-7.2-4.4l-23.2-46.3c-4.1-8.1-12.4-13.3-21.5-13.3s-17.4 5.1-21.5 13.3l-41.4 82.8L205.9 158.2c-3.9-8.7-12.7-14.3-22.2-14.1s-18.1 5.9-21.8 14.8l-31.8 76.3c-1.2 3-4.2 4.9-7.4 4.9H16c-2.6 0-5 .4-7.3 1.1C3 225.2 0 208.2 0 190.9v-5.8c0-69.9 50.5-129.5 119.4-141C165 36.5 211.4 51.4 244 84l12 12 12-12c32.6-32.6 79-47.5 124.6-39.9C461.5 55.6 512 115.2 512 185.1v5.8c0 16.9-2.8 33.5-8.3 49.1z"></path></svg>` : `<svg class="svg-inline--fa fa-heart" aria-hidden="true" focusable="false" data-prefix="far" data-icon="heart" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"></path></svg>`}</button>
  <button onclick="editContact(${index})" class="d-flex align-items-center justify-content-center Edit-btn"><svg class="svg-inline--fa fa-pen" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="pen" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"></path></svg></button>
  <button onclick="deleteContact(${index})" class="d-flex align-items-center justify-content-center Delete-btn"><svg class="svg-inline--fa fa-trash" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="trash" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg></button>

</div>
</div>

    </div>
  `;
}

// ===== Show all contacts =====
function displayContacts() {
  var cards = "";
  for (var i = 0; i < contacts.length; i++) {
    cards += createCard(contacts[i], i);
  }

  var oldCards = contactsGrid.querySelectorAll(".contacts");
  for (var j = 0; j < oldCards.length; j++) {
    oldCards[j].remove();
  }
  contactsGrid.insertAdjacentHTML("afterbegin", cards);

  if (contacts.length > 0) {
    noContacts.classList.replace("d-flex", "d-none");
    contactsGrid.classList.add("d-grid");
  } else {
    noContacts.classList.replace("d-none", "d-flex");
    contactsGrid.classList.remove("d-grid");
  }

  displayPanel("#favorites-section-mobile", "favorite");
  displayPanel("#emergency-contacts-mobile", "emergency");
}

// ===== Add a contact =====
function addContact() {
  var contact = {
    Name: fullName.value,
    phonenum: phone.value,
    email: email.value,
    address: address.value,
    group: groupSelect.value,
    photo: avatarData,
    favorite: favoriteCheck.checked,
    emergency: emergencyCheck.checked
  };

  contacts.push(contact);                                     
  localStorage.setItem("contacts", JSON.stringify(contacts)); 
  displayContacts();     
}

// ===== Save =====
contactForm.addEventListener("submit", function (e) {
  e.preventDefault();

  var nameValue = fullName.value.trim();
  var phoneValue = phone.value.trim();

  if (nameValue === "") {
    Swal.fire({
      icon: "error",
      title: "Missing Name",
      text: "Please enter a name for the contact!"
    });
    return;
  }

  if (phoneValue === "") {
    Swal.fire({
      icon: "error",
      title: "Missing Phone",
      text: "Please enter a phone number!"
    });
    return;
  }

  var duplicate = contacts.find(function (c, i) {
    return c.phonenum === phoneValue && i !== updatedIndex;
  });
  if (duplicate) {
    Swal.fire({
      icon: "error",
      title: "Duplicate Phone Number",
      text: "A contact with this phone number already exists: " + duplicate.Name
    });
    return;
  }

  // all good: add OR update
  var isEditing = updatedIndex !== undefined;
  if (isEditing) {
    updateContact();
  } else {
    addContact();
  }
  closeModal();

  Swal.fire({
    icon: "success",
    title: isEditing ? "Updated!" : "Added!",
    text: isEditing ? "Contact has been updated successfully." : "Contact has been added successfully.",
    timer: 1500,
    showConfirmButton: false
  });
});

// ===== Delete a contact =====
function deleteContact(index) {
  Swal.fire({
    title: "Delete Contact?",
    text: "Are you sure you want to delete " + contacts[index].Name + "? This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280"
  }).then(function (result) {
    if (result.isConfirmed) {
      contacts.splice(index, 1);
      localStorage.setItem("contacts", JSON.stringify(contacts));
      displayContacts();

      Swal.fire({
        title: "Deleted!",
        text: "Contact has been deleted.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });
    }
  });
}

// ===== Favorites / Emergency =====
function saveContacts() {
  localStorage.setItem("contacts", JSON.stringify(contacts));
}

function toggleFavorite(index) {
  contacts[index].favorite = !contacts[index].favorite; 
  saveContacts();
  displayContacts();
}

function toggleEmergency(index) {
  contacts[index].emergency = !contacts[index].emergency;
  saveContacts();
  displayContacts();
}

function createMiniContact(contact) {
  return `
      <div class="mini-contact d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center gap-2">
          <div class="mini-avatar d-flex align-items-center justify-content-center overflow-hidden">${contact.photo ? `<img src="${contact.photo}" alt="" class="w-100 h-100" style="object-fit: cover;">` : `${contact.Name.trim().split(/\s+/).slice(0, 2).map(w => w.charAt(0)).join("").toUpperCase()}`}</div>
          <div>
            <h4 class="mini-name">${contact.Name}</h4>
            <span class="mini-phone">${contact.phonenum}</span>
          </div>
        </div>
        <a href="tel:${contact.phonenum}" class="mini-call d-flex align-items-center justify-content-center">
          <svg class="svg-inline--fa fa-phone" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="phone" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"></path></svg>
        </a>
      </div>
  `;
}

function displayPanel(panelId, key) {
  var body = document.querySelector(panelId + " .panel-body");
  var empty = body.querySelector(".panel-empty");

  var rows = "";
  for (var i = 0; i < contacts.length; i++) {
    if (contacts[i][key]) rows += createMiniContact(contacts[i]);
  }

  var oldRows = body.querySelectorAll(".mini-contact");
  for (var j = 0; j < oldRows.length; j++) {
    oldRows[j].remove();
  }
  body.insertAdjacentHTML("afterbegin", rows);

  if (rows === "") {
    empty.classList.remove("d-none");
  } else {
    empty.classList.add("d-none");
  }
}

// ===== Edit a contact =====
function editContact(index) {
  updatedIndex = index;
  var contact = contacts[index];

  fullName.value = contact.Name;
  phone.value = contact.phonenum;
  email.value = contact.email;
  address.value = contact.address;
  favoriteCheck.checked = contact.favorite || false;
  emergencyCheck.checked = contact.emergency || false;
  groupSelect.value = contact.group || "";
  if (contact.photo) {
    avatarData = contact.photo;
    showAvatar(contact.photo);
  }

  modalTitle.textContent = "Edit Contact";
  submitText.textContent = "Update Contact";
  openModal();
}

function updateContact() {
  var contact = {
    Name: fullName.value,
    phonenum: phone.value,
    email: email.value,
    address: address.value,
    group: groupSelect.value,
    photo: avatarData,
    favorite: favoriteCheck.checked,
    emergency: emergencyCheck.checked
  };

  contacts[updatedIndex] = contact;   
  saveContacts();
  displayContacts();
}