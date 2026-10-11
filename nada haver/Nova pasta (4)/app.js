const getStorage = (key) => JSON.parse(localStorage.getItem(key) || 'null');
const setStorage = (key, value) => localStorage.setItem(key, JSON.stringify(value));

function ensureLogin() {
  if (localStorage.getItem('loggedIn') !== 'true') {
    window.location.href = 'login.html';
  }
}

function formatDate(dateString) {
  const date = new Date(dateString + 'T12:00:00');
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

function renderScheduledAppointments() {
  const list = document.getElementById('scheduledList');
  if (!list) return;

  const appointments = getStorage('scheduledAppointments') || [];
  const counter = document.getElementById('appointmentCounter');
  if (counter) counter.textContent = appointments.length;

  if (!appointments.length) {
    list.innerHTML = '<div class="appointment-item"><p class="meta">Você ainda não possui consultas marcadas.</p></div>';
    return;
  }

  list.innerHTML = appointments
    .map(
      (appointment) => `
        <article class="appointment-item">
          <div class="appointment-header">
            <h4>${appointment.procedure}</h4>
            <span class="badge">${appointment.category}</span>
          </div>
          <div class="meta">
            <div>📅 ${formatDate(appointment.date)}</div>
            <div>🕒 ${appointment.time}</div>
            <div>👨‍⚕️ ${appointment.doctor}</div>
          </div>
          <div class="action-row">
            <span class="price">Agendado</span>
            <button class="danger-btn" data-cancel-id="${appointment.id}">Desmarcar</button>
          </div>
        </article>
      `
    )
    .join('');

  document.querySelectorAll('[data-cancel-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const appointmentId = Number(button.dataset.cancelId);
      const scheduled = getStorage('scheduledAppointments') || [];
      const canceled = scheduled.find((appointment) => appointment.id === appointmentId);

      if (!canceled) return;

      const remaining = scheduled.filter((appointment) => appointment.id !== appointmentId);
      const available = getStorage('availableSlots') || [];
      setStorage('scheduledAppointments', remaining);
      setStorage('availableSlots', [...available, canceled]);

      alert(`Consulta de ${canceled.procedure} desmarcada com sucesso.`);
      renderScheduledAppointments();
      renderAvailableSlots();
    });
  });
}

function renderAvailableSlots() {
  const list = document.getElementById('availableList');
  if (!list) return;

  const available = getStorage('availableSlots') || [];

  if (!available.length) {
    list.innerHTML = '<div class="appointment-item"><p class="meta">Nenhum horário disponível no momento.</p></div>';
    return;
  }

  list.innerHTML = available
    .map(
      (slot) => `
        <article class="appointment-item">
          <div class="appointment-header">
            <h4>${slot.procedure}</h4>
            <span class="badge">${slot.category}</span>
          </div>
          <div class="meta">
            <div>📅 ${formatDate(slot.date)}</div>
            <div>🕒 ${slot.time}</div>
            <div>👨‍⚕️ ${slot.doctor}</div>
          </div>
          <div class="action-row">
            <span class="price">R$ 250</span>
            <button class="small-btn" data-slot-id="${slot.id}">Agendar</button>
          </div>
        </article>
      `
    )
    .join('');

  document.querySelectorAll('[data-slot-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const slotId = Number(button.dataset.slotId);
      const slots = getStorage('availableSlots') || [];
      const selected = slots.find((slot) => slot.id === slotId);

      if (!selected) return;

      const scheduled = getStorage('scheduledAppointments') || [];
      const updated = [...scheduled, selected];
      setStorage('scheduledAppointments', updated);

      const remaining = slots.filter((slot) => slot.id !== slotId);
      setStorage('availableSlots', remaining);

      alert(`Consulta agendada para ${selected.procedure} em ${formatDate(selected.date)} às ${selected.time}.`);
      window.location.href = 'consultas-marcadas.html';
    });
  });
}

function renderProfile() {
  const nameEl = document.getElementById('profileName');
  const emailEl = document.getElementById('profileEmail');
  const phoneEl = document.getElementById('profilePhone');
  const cpfEl = document.getElementById('profileCpf');
  const planEl = document.getElementById('profilePlan');
  const userName = document.getElementById('userName');

  const profile = getStorage('patientProfile') || {
    name: 'Maria Oliveira',
    email: 'paciente@clinica.com',
    phone: '(11) 9 8765-4321',
    cpf: '123.456.789-00',
    plano: 'Plano Silver'
  };

  if (nameEl) nameEl.textContent = profile.name;
  if (emailEl) emailEl.textContent = profile.email;
  if (phoneEl) phoneEl.textContent = profile.phone;
  if (cpfEl) cpfEl.textContent = profile.cpf;
  if (planEl) planEl.textContent = profile.plano;
  if (userName) userName.textContent = profile.name.split(' ')[0];
}

function setupLogoutButtons() {
  const logoutButtons = document.querySelectorAll('#logoutBtn, #logoutBtnProfile');
  logoutButtons.forEach((button) => {
    button.addEventListener('click', () => {
      localStorage.removeItem('loggedIn');
      localStorage.removeItem('patientProfile');
      window.location.href = 'login.html';
    });
  });
}

function initAppPages() {
  ensureLogin();
  renderScheduledAppointments();
  renderAvailableSlots();
  renderProfile();
  setupLogoutButtons();
}

document.addEventListener('DOMContentLoaded', initAppPages);
