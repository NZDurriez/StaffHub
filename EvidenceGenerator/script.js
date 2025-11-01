// Function to update the output in real time
function updateEvidenceOutput() {
    // Get field values
    const caseText = document.getElementById("case").value.trim() || "N/A";
    const platform = document.getElementById("platform").value || "N/A";
    let discordId = document.getElementById("discord").value.trim() || "N/A";
    const background = document.getElementById("background").value.trim() || "N/A";
    const evidence = document.getElementById("evidence").value.trim() || "N/A";
    const finalRes = document.getElementById("finalRes").value.trim() || "N/A";
    const idType = document.getElementById("idType").value || "N/A";
    const idValue = document.getElementById("idValue").value.trim() || "N/A";

    // Ensure Discord ID is numeric only
    discordId = discordId.replace(/\D/g, '') || "N/A";

    // Construct output text
    const outputText = `Case: ${caseText}\n` +
                       `Platform: ${platform}\n` +
                       `Discord: ${discordId !== "N/A" ? `<@${discordId}>` : "N/A"}\n` +
                       `Background: ${background}\n` +
                       `Evidence: ${evidence}\n` +
                       `Final Res: ${finalRes}\n` +
                       `${idType}: ${idValue}`;

    // Display formatted output
    const outputElement = document.getElementById("output");
    outputElement.innerText = outputText;
    outputElement.style.display = "block";
}

// Function to copy output to clipboard
function copyToClipboard() {
    const outputText = document.getElementById("output").innerText;
    navigator.clipboard.writeText(outputText).then(() => {
        const copyBtn = document.getElementById("copyBtn");
        copyBtn.innerText = "Copied!";
        setTimeout(() => {
            copyBtn.innerText = "Copy";
        }, 1500);
    });
}

// Attach events once the DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
    // Select all input, textarea, and select elements
    const inputs = document.querySelectorAll("#case, #platform, #discord, #background, #evidence, #finalRes, #idType, #idValue");
    
    // Add event listeners for real-time updates
    inputs.forEach(input => {
        input.addEventListener("input", updateEvidenceOutput);
        input.addEventListener("change", updateEvidenceOutput);
    });

    // Copy button listener
    document.getElementById("copyBtn").addEventListener("click", copyToClipboard);

    // Initialize output on page load
    updateEvidenceOutput();
});
