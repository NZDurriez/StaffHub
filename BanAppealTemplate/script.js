document.addEventListener('DOMContentLoaded', () => {
  const staffSelect = document.getElementById('staff-member');
  const outcomeSelect = document.getElementById('outcome');
  const appeal3SPSelect = document.getElementById('appeal-3sp');
  const hasNitroSelect = document.getElementById('has-nitro');
  const notesEl = document.getElementById('notes');
  const lastStaffKey = 'lastUsedStaff';
  const boxCountEl = document.getElementById('boxCount');
  const outputEl = document.getElementById('output');
  let staffData = [];

  // Tooltip
  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  document.body.appendChild(tooltip);
  document.addEventListener('mousemove', e => {
    tooltip.style.left = e.pageX + 10 + 'px';
    tooltip.style.top = e.pageY + 10 + 'px';
  });

  // Load staff list
  fetch('https://nzdurriez.github.io/StaffHub/StaffList/staff.json')
    .then(res => res.json())
    .then(data => {
      staffData = data;
      staffSelect.innerHTML = '<option value="" disabled selected hidden>-- Select a staff member --</option>';
      data.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.name;
        opt.textContent = s.name;
        staffSelect.appendChild(opt);
      });
      const lastStaff = localStorage.getItem(lastStaffKey);
      if (lastStaff) staffSelect.value = lastStaff;
    });

  staffSelect.addEventListener('change', () => {
    localStorage.setItem(lastStaffKey, staffSelect.value);
  });

  // Auto-set outcome + notes
  function handle3SPChange() {
    if (appeal3SPSelect.value === 'yes') {
      outcomeSelect.value = 'Appeal Successful';
      outcomeSelect.disabled = true;
      notesEl.value = "User placed on 3SP as a condition of successful ban appeal";
    } else {
      outcomeSelect.disabled = false;
    }
  }
  appeal3SPSelect.addEventListener('change', handle3SPChange);

  document.getElementById('qp-form').addEventListener('submit', e => {
    e.preventDefault();
    handle3SPChange();

    const name = document.getElementById('ingame-name').value.trim() || 'N/A';
    const discordRaw = document.getElementById('discord').value.trim();
    const discord = discordRaw.replace(/\D/g,'') || 'N/A';
    const mention = discord !== 'N/A' ? `<@${discord}>` : 'N/A';
    const dateRaw = document.getElementById('appeal-date').value;
    const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
    let appealDate = 'N/A';
    if (dateRaw) {
      const [y,m,d] = dateRaw.split('-');
      appealDate = `${d.padStart(2,'0')} ${months[parseInt(m)-1]} ${y}`;
    }

    const banId = document.getElementById('ban-id').value.trim() || 'N/A';
    const ticketId = document.getElementById('ticket-id').value.trim() || 'N/A';
    const staffMember = staffSelect.value || 'N/A';
    const staffRole = staffData.find(s => s.name === staffMember)?.role || 'N/A';
    const logged = document.getElementById('logged-tx').value || 'N/A';
    const appeal3SP = appeal3SPSelect.value;
    const hasNitro = hasNitroSelect.value === 'yes';
    const notes = notesEl.value.trim() || 'N/A';
    const outcome = outcomeSelect.value || 'N/A';

    // Clear previous output
    outputEl.innerHTML = '';
    boxCountEl.style.display = 'none';

    // --- Ban Appeal log ---
    const banText =
`**Ingame Name:** ${name}
**Discord:** ${mention}
**Date of Appeal:** ${appealDate}
**Ban ID & Reason:** ${banId}
**Ticket ID:** ${ticketId}
**Outcome:** ${outcome}
**Staff Member:** ${staffMember}
**Notes:** ${notes}
**Logged in TX if successful:** ${logged}`;
    renderMessage(banText, hasNitro, false);

    // --- 3SP message ---
    if (appeal3SP === 'yes') {
      const sp3Text =
`Hello ${mention},

Welcome back to the Beehive Community.

The Beehive Staff Team has reviewed your ban appeal and, as part of the conditions for returning to the server, you are being placed under the **Three Strike Policy (3SP)**. This policy ensures all returning members understand the expectations for roleplay and adherence to **[server rules](https://www.beehiverp.com/topic/1949-fivepd-rules/#comment-3383)**.

As part of 3SP, any staff interaction that violates the server rules or guidelines will be considered a "strike." Any staff member is authorized to issue Strikes 1 & 2, while Strike 3 requires authorization from a Manager or higher. The consequences for strikes become progressively more severe, as outlined below:

**Three Strike Policy:**
- Strike 1: 1 Day Ban
- Strike 2: 3 Day Ban
- Strike 3: Permanent Ban | *These must be Authorized by a Manager or higher*

In the event that you receive a third strike resulting in a Permanent Ban, you will have the opportunity to appeal this by **[creating a ban appeal ticket](https://discord.com/channels/815563382211739670/943801829777612860)**. Ban appeals are reviewed periodically during the staff's available time, and immediate unbanning is not guaranteed.

**Working towards Coming Off 3SP:**
We believe in second chances and positive change within our community. You can work towards coming off 3SP and returning to a normal stature within the community by demonstrating consistent good behavior and adherence to the server rules and guidelines. Engaging in positive roleplay, respecting fellow players and staff members, and actively contributing to a welcoming and enjoyable gaming environment.

The Beehive Staff Team conduct monthly reviews of members who are on 3SP, assessing their conduct for that month. This review process aims to evaluate your progress and, when appropriate, grant your return to regular status within the community. Your continued good behavior and adherence to server rules will be taken into consideration during these reviews.

**Please take note of the following:**
- The 3SP period is set at 60 days. Any strike received during this time will immediately reset the 60-day timeframe, you must also remain an active member of the community playing within your 3SP period.
- Surveillance methods are in place, even when no staff members are online to monitor player activities.  
- Community Rule 11 always applies.

If you have any questions or comments, feel free to share them below. Otherwise, please react to this message with a ✅ and we will close the ticket.

*Kind Regards,
${staffMember},
${staffRole}*`;

      if (!hasNitro) {
        const parts = splitByWords(sp3Text, 1999);
        if (parts.length > 1) {
          boxCountEl.textContent = `Parts to copy: ${parts.length}`;
          boxCountEl.style.display = 'block';
          outputEl.appendChild(boxCountEl);
        }
        parts.forEach((p,i) => outputEl.appendChild(createBox(p, parts.length>1 ? i+1 : null)));
      } else {
        outputEl.appendChild(createBox(sp3Text));
      }
    }
  });

  // ---------------- helper functions ----------------
  function renderMessage(text, hasNitro, showCounter=true) {
    if (hasNitro) {
      outputEl.appendChild(createBox(text));
    } else {
      const parts = splitByWords(text, 1999);
      if (showCounter && parts.length > 1) {
        boxCountEl.textContent = `Parts to copy: ${parts.length}`;
        boxCountEl.style.display = 'block';
      }
      parts.forEach((p,i) => outputEl.appendChild(createBox(p, parts.length>1 ? i+1 : null)));
    }
  }

  function createBox(text, partNum) {
    const box = document.createElement('div');
    box.className = 'output-box';
    box.dataset.tooltip = partNum ? `Part ${partNum} - Click to copy` : 'Click to copy';

    const p = document.createElement('p');
    p.textContent = text;
    box.appendChild(p);

    box.addEventListener('mouseenter', () => { tooltip.style.opacity = 1; tooltip.textContent = box.dataset.tooltip; });
    box.addEventListener('mouseleave', () => { tooltip.style.opacity = 0; });

    box.addEventListener('click', () => {
      navigator.clipboard.writeText(text);
      if (!box.querySelector('.copy-stamp')) {
        const stamp = document.createElement('img');
        stamp.src = 'copied-stamp.png';
        stamp.className = 'copy-stamp';
        box.appendChild(stamp);
      }
    });

    return box;
  }

  function splitByWords(text, maxLen=1999) {
    const tokens = text.match(/\S+\s*/g) || [];
    const parts = [];
    let cur = '';
    for (const t of tokens) {
      if ((cur+t).length > maxLen) { parts.push(cur); cur = t; }
      else cur += t;
    }
    if (cur) parts.push(cur);
    return parts;
  }
});



