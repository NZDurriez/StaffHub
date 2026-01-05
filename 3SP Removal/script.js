document.addEventListener("DOMContentLoaded", () => {
  const authGate = document.getElementById("authGate");
  const mainApp = document.getElementById("mainApp");

  document.getElementById("authYes").addEventListener("click", () => {
    authGate.style.display = "none";
    mainApp.style.display = "block";
  });

  document.getElementById("authNo").addEventListener("click", () => {
    authGate.innerHTML = `
      <h2 class="title">Access Denied</h2>
      <p style="text-align:center;">
        You must have authorization from a manager to use this tool.
      </p>
    `;
  });

  const staffSelect = document.getElementById("staffMember");
  const roleSelect = document.getElementById("staffRole");
  const outputContainer = document.getElementById("outputContainer");
  const outputText = document.getElementById("outputText");
  const tooltip = document.getElementById("tooltip");

  let staffList = [];

  // Load staff list
  fetch("https://nzdurriez.github.io/StaffHub/StaffList/staff.json")
    .then(res => res.json())
    .then(data => {
      staffList = data;
      staffSelect.innerHTML = '<option value="">-- Select Staff Member --</option>';
      data.forEach(({ name }) => {
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        staffSelect.appendChild(opt);
      });
    })
    .catch(() => {
      staffSelect.innerHTML = '<option value="">Error loading staff</option>';
    });

  // Update role when staff selected
  staffSelect.addEventListener("change", () => {
    const staff = staffList.find(s => s.name === staffSelect.value);
    if (staff) {
      roleSelect.disabled = false;
      roleSelect.innerHTML = `<option value="${staff.role}">${staff.role}</option>`;
    } else {
      roleSelect.disabled = true;
      roleSelect.innerHTML = '<option value="">Select a staff member first</option>';
    }
  });

  // Format Discord mentions with commas
  function formatMentions(input) {
    return input
      .split("\n")
      .map(id => id.replace(/\D/g, ""))
      .filter(Boolean)
      .map(id => `<@${id}>`)
      .join(", ");
  }

  // Tooltip handling
  outputContainer.addEventListener("mousemove", e => {
    tooltip.style.left = e.offsetX + 12 + "px";
    tooltip.style.top = e.offsetY + 12 + "px";
  });

  outputContainer.addEventListener("mouseenter", () => {
    tooltip.style.opacity = "1";
  });

  outputContainer.addEventListener("mouseleave", () => {
    tooltip.style.opacity = "0";
  });

  // Generate output
  document.getElementById("generateRemoval").addEventListener("click", () => {
    const mentions = formatMentions(document.getElementById("discordIDs").value) || "Nil";
    const staffMember = staffSelect.value || "Nil";
    const staffRole = roleSelect.value || "Nil";

    const message = `Kia ora, ${mentions}

We're reaching out to let you know that you have successfully completed your time on 3SP without any further staff actions. As a result, you are now being removed from the 3SP.

We appreciate your improvement in your server performance and hope this positive trend continues.

Please be aware that we keep records of 3SP participants, and if the behavior that led to your placement on 3SP resumes, you may be reinstated swiftly.

If you have any questions, feel free to ask in this ticket.

A response is optional, but if you wish to acknowledge this message, please reply with a ✅ to confirm your awareness of your removal from 3SP.

Thank you, and enjoy your time on the server!

*Best regards,
${staffMember}
${staffRole}*`;

    outputText.textContent = message;
    outputContainer.style.display = "block";
  });

  // Copy + stamp
  outputContainer.addEventListener("click", () => {
    navigator.clipboard.writeText(outputText.textContent);

    if (!outputContainer.querySelector(".copy-stamp")) {
      const img = document.createElement("img");
      img.src = "copied-stamp.png";
      img.className = "copy-stamp";
      outputContainer.appendChild(img);
      setTimeout(() => img.remove(), 1200);
    }
  });
});
