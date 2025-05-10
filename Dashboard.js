// --- Profile Dropdown ---
const rcProfileAvatar = document.getElementById('rcProfileAvatar');
const rcProfileDropdown = document.getElementById('rcProfileDropdown');

function openDropdown() {
  rcProfileDropdown.style.display = 'block';
  rcProfileDropdown.style.opacity = 0;
  rcProfileDropdown.style.transform = 'translateY(-10px)';
  setTimeout(() => {
    rcProfileDropdown.style.opacity = 1;
    rcProfileDropdown.style.transform = 'translateY(0)';
  }, 10);
  rcProfileDropdown.setAttribute('aria-expanded', 'true');
}
function closeDropdown() {
  rcProfileDropdown.style.opacity = 0;
  rcProfileDropdown.style.transform = 'translateY(-10px)';
  rcProfileDropdown.setAttribute('aria-expanded', 'false');
  setTimeout(() => {
    rcProfileDropdown.style.display = 'none';
  }, 180);
}
rcProfileAvatar.addEventListener('click', (e) => {
  e.stopPropagation();
  if (rcProfileDropdown.style.display === 'block') {
    closeDropdown();
  } else {
    openDropdown();
    rcProfileDropdown.querySelector('a')?.focus();
  }
});
document.addEventListener('click', (e) => {
  if (!rcProfileDropdown.contains(e.target) && !rcProfileAvatar.contains(e.target)) {
    closeDropdown();
  }
});
rcProfileAvatar.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    openDropdown();
    rcProfileDropdown.querySelector('a')?.focus();
  }
});
// Keyboard navigation for dropdown
rcProfileDropdown.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeDropdown();
});

// --- Calendar ---
const rcCalendar = document.getElementById('rcCalendar');
const rcCalendarMsg = document.getElementById('rcCalendarMsg');
const rcHighlightedDates = {
  '2024-06-10': 'Deadline for submission: 10 June 2024',
  '2024-06-15': 'AI Research Group Meeting',
  '2024-06-21': 'Featured Group Webinar',
  '2024-06-25': 'Final Review: Quantum Computing Paper',
};
function rcPad(n) { return n < 10 ? '0' + n : n; }
function rcRenderCalendar(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  let html = `<table class="rc-calendar-table" tabindex="0"><thead><tr>`;
  ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(d => html += `<th>${d}</th>`);
  html += `</tr></thead><tbody>`;
  let day = 1, nextMonthDay = 1;
  const today = new Date();
  for (let i = 0; i < 6; i++) {
    html += '<tr>';
    for (let j = 0; j < 7; j++) {
      let cell = '', cellClass = '', dateStr = '';
      if (i === 0 && j < startDay) {
        cell = prevMonthLastDay - startDay + j + 1;
        cellClass = 'rc-inactive';
      } else if (day > daysInMonth) {
        cell = nextMonthDay++;
        cellClass = 'rc-inactive';
      } else {
        cell = day;
        dateStr = `${year}-${rcPad(month + 1)}-${rcPad(day)}`;
        if (
          today.getFullYear() === year &&
          today.getMonth() === month &&
          today.getDate() === day
        ) cellClass = 'rc-today';
        if (rcHighlightedDates[dateStr]) cellClass += (cellClass ? ' ' : '') + 'rc-highlight';
        html += `<td class="${cellClass}" data-date="${dateStr}" tabindex="0" aria-label="${dateStr}${rcHighlightedDates[dateStr] ? ' - event' : ''}">${cell}</td>`;
        day++;
        continue;
      }
      html += `<td class="${cellClass}">${cell}</td>`;
    }
    html += '</tr>';
    if (day > daysInMonth) break;
  }
  html += '</tbody></table>';
  rcCalendar.innerHTML = html;
  // Add click listeners for highlighted dates
  rcCalendar.querySelectorAll('td.rc-highlight').forEach(td => {
    td.addEventListener('click', (e) => {
      const date = td.getAttribute('data-date');
      rcShowCalendarMsg(rcHighlightedDates[date], td);
    });
    td.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const date = td.getAttribute('data-date');
        rcShowCalendarMsg(rcHighlightedDates[date], td);
      }
    });
  });
}
function rcShowCalendarMsg(msg, td) {
  rcCalendarMsg.textContent = msg;
  rcCalendarMsg.style.display = 'block';
  rcCalendarMsg.style.opacity = 0;
  rcCalendarMsg.style.transform = 'translateY(-10px)';
  setTimeout(() => {
    rcCalendarMsg.style.opacity = 1;
    rcCalendarMsg.style.transform = 'translateY(0)';
  }, 10);
  clearTimeout(rcCalendarMsg._timeout);
  rcCalendarMsg._timeout = setTimeout(() => {
    rcCalendarMsg.style.opacity = 0;
    rcCalendarMsg.style.transform = 'translateY(-10px)';
    setTimeout(() => {
      rcCalendarMsg.style.display = 'none';
    }, 180);
  }, 3500);
  if (td) td.focus();
}
const rcNow = new Date();
rcRenderCalendar(rcNow.getFullYear(), rcNow.getMonth());

// --- Firebase Auth & Sign Out ---
window.addEventListener("DOMContentLoaded", () => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const displayName = user.displayName || "User";

      // Update banner and avatar initials
      document.querySelector(".rc-banner-text span").textContent = displayName;
      document.querySelector(".rc-profile-name").textContent = displayName;
      const initials = displayName.split(" ").map(n => n[0]).join("").toUpperCase();
      document.getElementById("rcProfileAvatar").textContent = initials;

      // Attach sign out logic
      const signOutLink = document.getElementById("rcSignOut");
      if (signOutLink) {
        signOutLink.addEventListener("click", (e) => {
          e.preventDefault();
          firebase.auth().signOut().then(() => {
            window.location.href = "S_Login.html";
          }).catch((error) => {
            console.error("Sign-out failed:", error);
            alert("Error signing out: " + error.message);
          });
        });
      }

    } else {
      // Redirect to login if not signed in
      window.location.href = "S_Login.html";
    }
  });
});
