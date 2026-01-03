// ---------------- Tooltip ----------------
const tooltip = document.createElement("div");
tooltip.className = "tooltip";
tooltip.textContent = "Click to copy";
document.body.appendChild(tooltip);

document.addEventListener("mousemove", e => {
  tooltip.style.left = e.pageX + 10 + "px";
  tooltip.style.top = e.pageY + 10 + "px";
});

// ---------------- Output Update ----------------
function updateEvidenceOutput() {
  const caseText = document.getElementById("case").value.trim() || "N/A";
  const platform = document.getElementById("platform").value || "N/A";
  let discordId = document.getElementById("discord").value.trim() || "N/A";
  const background = document.getElementById("background").value.trim() || "N/A";
  const evidence = document.getElementById("evidence").value.trim() || "N/A";
  const finalRes = document.getElementById("finalRes").value.trim() || "N/A";
  const idType = document.getElementById("idType").value || "N/A";
  const idValue = document.getElementById("idValue").value.trim() || "N/A";

  discordId = discordId.replace(/\D/g, "") || "N/A";

  const outputText =
`Case: ${caseText}
Platform: ${platform}
Discord: ${discordId !== "N/A" ? `<@${discordId}>` : "N/A"}
Background: ${background}
Evidence: ${evidence}
Final Res: ${finalRes}
${idType}: ${idValue}`;

  document.getElementById("output").textContent = outputText;
}

// ---------------- DOM Ready ----------------
document.addEventListener("DOMContentLoaded", () => {
  const inputs = document.querySelectorAll(
    "#case, #platform, #discord, #background, #evidence, #finalRes, #idType, #idValue"
  );

  inputs.forEach(input => {
    input.addEventListener("input", updateEvidenceOutput);
    input.addEventListener("change", updateEvidenceOutput);
  });

  const outputBox = document.getElementById("output");

  outputBox.addEventListener("mouseenter", () => {
    tooltip.style.opacity = "1";
  });

  outputBox.addEventListener("mouseleave", () => {
    tooltip.style.opacity = "0";
  });

  outputBox.addEventListener("click", () => {
    navigator.clipboard.writeText(outputBox.textContent);

    if (!outputBox.querySelector(".copy-stamp")) {
      const stamp = document.createElement("img");
      stamp.src = "copied-stamp.png";
      stamp.className = "copy-stamp";
      outputBox.appendChild(stamp);
    }
  });

  updateEvidenceOutput();
});
