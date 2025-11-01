document.addEventListener("DOMContentLoaded", () => {
  const staffSelect = document.getElementById("staffMember");
  const roleSelect = document.getElementById("staffRole");
  const interactionsTextArea = document.getElementById("interactions");
  const tooltip = document.createElement("div");
  tooltip.className = "tooltip";
  document.body.appendChild(tooltip);

  // Load staff.json and populate dropdown
  let staffList = [];
  fetch("https://nzdurriez.github.io/SharedData/staff.json")
    .then((res) => {
      if (!res.ok) throw new Error("Failed to load staff.json");
      return res.json();
    })
    .then((data) => {
      staffList = data;
      staffSelect.innerHTML = '<option value="">-- Select Staff Member --</option>';
      staffList.forEach(({ name }) => {
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        staffSelect.appendChild(opt);
      });
      roleSelect.innerHTML = '<option value="">Select a staff member first</option>';
      roleSelect.disabled = true;
    })
    .catch((e) => {
      staffSelect.innerHTML = '<option value="">Error loading staff</option>';
      roleSelect.innerHTML = '<option value="">Error loading roles</option>';
      roleSelect.disabled = true;
      console.error(e);
    });

  // Auto-resize textarea
  interactionsTextArea.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  });

  // When staff selected, update role dropdown with matching role
  staffSelect.addEventListener("change", () => {
    const selectedStaff = staffList.find((s) => s.name === staffSelect.value);
    if (selectedStaff) {
      roleSelect.disabled = false;
      roleSelect.innerHTML = `<option value="${selectedStaff.role}">${selectedStaff.role}</option>`;
      roleSelect.value = selectedStaff.role;
    } else {
      roleSelect.disabled = true;
      roleSelect.innerHTML = '<option value="">Select a staff member first</option>';
      roleSelect.value = "";
    }
  });

  // Split text into ≤1999-char parts without breaking words
  function splitByWords(text, maxLen = 1999) {
    const tokens = text.match(/\S+\s*/g) || [];
    const parts = [];
    let current = "";
    for (const token of tokens) {
      if (current.length + token.length > maxLen) {
        parts.push(current);
        current = token;
      } else {
        current += token;
      }
    }
    if (current) parts.push(current);
    return parts;
  }

  // Group infractions into blocks
  function groupInfractions(text) {
    const lines = text.split("\n"),
      blocks = [],
      cur = [];
    const isStart = (l) => /^(warn(?:ed)?|kick(?:ed)?|ban(?:ned)?)/i.test(l.trim());
    for (let l of lines) {
      if (isStart(l) && cur.length) {
        blocks.push(cur.join("\n"));
        cur.length = 0;
      }
      cur.push(l);
    }
    if (cur.length) blocks.push(cur.join("\n"));
    return blocks;
  }

  // Tooltip attach helper
  function attachTooltip(el) {
    el.addEventListener("mouseenter", (e) => {
      tooltip.textContent = "Click to Copy";
      tooltip.style.display = "block";
    });
    el.addEventListener("mousemove", (e) => {
      tooltip.style.left = e.pageX + 10 + "px";
      tooltip.style.top = e.pageY + 10 + "px";
    });
    el.addEventListener("mouseleave", () => {
      tooltip.style.display = "none";
    });
  }

  document.getElementById("generate3SP").addEventListener("click", () => {
    const isNitro = document.getElementById("discordNitro").value === "yes";
    const rawID = document.getElementById("discordID").value.replace(/\D/g, "") || "Nil";
    const mention = rawID !== "Nil" ? `<@${rawID}>` : "Nil";
    const interactions = document.getElementById("interactions").value || "Nil";
    const staffMember = staffSelect.value || "Nil";
    const staffRole = roleSelect.value || "Nil";

    const countBoxEl = document.getElementById("boxCount");
    countBoxEl.textContent = "";
    countBoxEl.style.display = "none";

    // Group and filter revoked
    const blocks = groupInfractions(interactions).filter((b) => !/revoked by/i.test(b));
    let warn = 0,
      kick = 0,
      ban = 0;
    blocks.forEach((b) => {
      const a = b.split("\n")[0].trim();
      if (/warn/i.test(a)) warn++;
      if (/kick/i.test(a)) kick++;
      if (/ban/i.test(a)) ban++;
    });

    // Transform each block to keep only first and third lines if available, else first two, else first line
    const transformed = blocks
      .map((b) => {
        const L = b.split("\n").map((x) => x.trim()).filter((x) => x);
        if (L.length >= 3) return L[0] + "\n" + L[2];
        if (L.length === 2) return L[0] + "\n" + L[1];
        return L[0] || "";
      })
      .join("\n\n");

    // Clean spacing in the transformed text
    let processed = transformed
      .replace(/(warn(?:ed)?|kick(?:ed)?|ban(?:ned)?)(?=\d)/gi, "$1 ")
      .replace(/(warn(?:ed)?|kick(?:ed)?|ban(?:ned)?)(\s+by\s+\S+)/gi, "$1");

    const cleaned = processed.split("\n").map((x) => x.trim()).join("\n");

    // Full 3SP template with code fences
    const fullOutput = `Hello ${mention}, 

The Beehive Staff have noticed that you have been involved in multiple negative interactions (Warns/Kicks/Bans) on the server. It is apparent that there is a consistent breach of our server rules and guidelines, which raises concerns about the frequency of our interactions with you. 

Below is a summary of your prior staff interactions:
\`\`\`
${cleaned}
\`\`\`

Due to these interactions, the Beehive Staff Team now require an immediate adjustment in your roleplay approach. Strict compliance with our server rules and guidelines is imperative. 

Given the frequency of these interactions, the staff team has unanimously decided to implement a Three Strike Policy (3SP) effective immediately. Any staff interaction that violates the server rules/guidelines will be considered a "strike," and any staff member is authorized to issue Strikes 1 & 2. The consequences for strikes become progressively more severe, as outlined below:

**Three Strike Policy:**
- Strike 1: 1 Day Ban
- Strike 2: 3 Day Ban 
- Strike 3: Permanent Ban | *These must be Authorized by a Manager or higher*

In the event that you receive a third strike resulting in a Permanent Ban, you will have the opportunity to appeal this by **[creating a ban appeal ticket](https://discord.com/channels/815563382211739670/943801829777612860)** Ban appeals are reviewed periodically during the staff's available time, and immediate unbanning is not guaranteed.

**Working towards Coming Off 3SP:**
We believe in second chances and positive change within our community. You can work towards coming off 3SP and returning to a normal stature within the community by demonstrating consistent good behaviour and adherence to the server rules and guidelines. Engaging in positive roleplay, respecting fellow players and staff members, and actively contributing to a welcoming and enjoyable gaming environment.

The Beehive Staff Team conduct monthly reviews of members who are on 3SP, assessing their conduct for that month. This review process aims to evaluate your progress and, when appropriate, grant your return to regular status within the community. Your continued good behavior and adherence to server rules will be taken into consideration during these reviews. 

**Please take note of the following:**  
- Surveillance methods are in place even when no staff members are online to monitor player activities.  
- The timeframe for being on 3SP is not predetermined; however, demonstrating good behavior and engaging in positive roleplay may lead to its removal sooner.  
- Community Rule 11 always applies.  

If you have any questions or comments, feel free to share them below. Otherwise, please react to this message with a ✅ and we will close the ticket.

Kind Regards,  
${staffMember},  
${staffRole}`;

    const fullBox = document.getElementById("fullOutputContainer");
    const wrapper = document.getElementById("shortOutputsContainer");
    wrapper.innerHTML = "";

    if (isNitro) {
      fullBox.style.display = "block";
      fullBox.textContent = "";
      const outputEl = document.createElement("p");
      outputEl.id = "outputFull3SP";
      outputEl.className = "output";
      outputEl.textContent = fullOutput;
      fullBox.appendChild(outputEl);
      attachTooltip(fullBox);
      fullBox.addEventListener("click", () => {
        navigator.clipboard.writeText(fullOutput);
        if (!fullBox.querySelector(".copy-stamp")) {
          const stampImg = new Image();
          stampImg.src = "copied-stamp.png";
          stampImg.className = "copy-stamp";
          fullBox.appendChild(stampImg);
        }
      });
    } else {
      fullBox.style.display = "none";
      const boxes = splitByWords(fullOutput, 1999);
      countBoxEl.textContent = `Parts to copy: ${boxes.length}`;
      countBoxEl.style.display = "block";

      boxes.forEach((b, i) => {
        const box = document.createElement("div");
        box.className = "output-box";

        const label = document.createElement("div");
        label.className = "part-number";
        label.textContent = `${i + 1}`;
        box.appendChild(label);

        const el = document.createElement("p");
        el.id = `part${i + 1}`;
        el.className = "output";
        el.textContent = b;
        box.appendChild(el);

        attachTooltip(box);
        box.addEventListener("click", () => {
          navigator.clipboard.writeText(el.textContent);
          if (!box.querySelector(".copy-stamp")) {
            const stampImg = new Image();
            stampImg.src = "copied-stamp.png";
            stampImg.className = "copy-stamp";
            box.appendChild(stampImg);
          }
        });

        wrapper.appendChild(box);
      });
    }

    document.getElementById("warnCount").innerText = warn;
    document.getElementById("kickCount").innerText = kick;
    document.getElementById("banCount").innerText = ban;
  });
});
