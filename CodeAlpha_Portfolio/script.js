const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
    menuToggle.classList.toggle("active");
  });
}

const editor = document.getElementById("messageEditor");
const emojiPicker = document.getElementById("emojiPicker");
const fileInput = document.getElementById("fileInput");
const fileNote = document.getElementById("fileNote");
const contactForm = document.getElementById("contactForm");

document.querySelectorAll("[data-command]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!editor) return;

    editor.focus();
    document.execCommand(button.dataset.command, false, null);
  });
});

if (emojiPicker && editor) {
  emojiPicker.addEventListener("change", () => {
    if (!emojiPicker.value) return;

    editor.focus();
    document.execCommand("insertText", false, emojiPicker.value);
    emojiPicker.value = "";
  });
}

if (fileInput && fileNote) {
  fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) {
      fileNote.textContent = `Selected file: ${fileInput.files[0].name}. Please attach it manually when your email app opens.`;
    } else {
      fileNote.textContent = "";
    }
  });
}

if (contactForm && editor) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("senderName").value.trim();
    const email = document.getElementById("senderEmail").value.trim();
    const subject = document.getElementById("emailSubject").value.trim();
    const message = editor.innerText.trim();

    const emailBody = `
Name: ${name}
Email: ${email}

Message:
${message}
    `;

    window.location.href = `mailto:hinazago@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
  });
}