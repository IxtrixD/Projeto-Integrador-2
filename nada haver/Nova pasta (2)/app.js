const loginView = document.querySelector('#loginView');
const mainView = document.querySelector('#mainView');
const toast = document.querySelector('#toast');
const initialAppointments = [
  { id: 1, date: '2024-06-12', day: 'QUA', number: '12', time: '09:00', type: 'Avaliação odontológica', dentist: 'Dra. Helena Martins' },
  { id: 2, date: '2024-06-12', day: 'QUA', number: '12', time: '10:30', type: 'Limpeza e prevenção', dentist: 'Dr. Rafael Lima' },
  { id: 3, date: '2024-06-12', day: 'QUA', number: '12', time: '14:00', type: 'Clareamento dental', dentist: 'Dra. Helena Martins' },
  { id: 4, date: '2024-06-12', day: 'QUA', number: '12', time: '16:30', type: 'Avaliação odontológica', dentist: 'Dra. Helena Martins' },
  { id: 5, date: '2024-06-13', day: 'QUI', number: '13', time: '08:30', type: 'Limpeza e prevenção', dentist: 'Dr. Rafael Lima' },
  { id: 6, date: '2024-06-13', day: 'QUI', number: '13', time: '11:00', type: 'Avaliação odontológica', dentist: 'Dra. Helena Martins' },
  { id: 7, date: '2024-06-14', day: 'SEX', number: '14', time: '15:00', type: 'Clareamento dental', dentist: 'Dra. Helena Martins' },
  { id: 8, date: '2024-06-15', day: 'SÁB', number: '15', time: '09:30', type: 'Avaliação odontológica', dentist: 'Dr. Rafael Lima' }
];
let booked = JSON.parse(localStorage.getItem('sorriso-booked') || '[]');
let selectedDate = '2024-06-12';

function showToast(message) { toast.textContent = message; toast.classList.add('show'); window.setTimeout(() => toast.classList.remove('show'), 2800); }
function persist() { localStorage.setItem('sorriso-booked', JSON.stringify(booked)); }
function renderDates() {
  const dates = [...new Map(initialAppointments.map(item => [item.date, item])).values()];
  document.querySelector('#dateScroller').innerHTML = dates.map(item => `<button class="date-button ${item.date === selectedDate ? 'active' : ''}" data-date="${item.date}"><span>${item.day}</span><strong>${item.number}</strong></button>`).join('');
  document.querySelectorAll('.date-button').forEach(button => button.addEventListener('click', () => { selectedDate = button.dataset.date; renderDates(); renderAppointments(); }));
}
function renderAppointments() {
  const selected = initialAppointments.filter(item => item.date === selectedDate);
  document.querySelector('#appointmentList').innerHTML = selected.map(item => {
    const isBooked = booked.some(appointment => appointment.id === item.id);
    return `<article class="appointment-card"><div><div class="appointment-time">${item.time}</div><div class="appointment-type">${item.type}</div><div class="appointment-type">${item.dentist}</div></div><button class="book-button" data-id="${item.id}" ${isBooked ? 'disabled' : ''}>${isBooked ? 'Agendado' : 'Agendar'}</button></article>`;
  }).join('');
  document.querySelectorAll('.book-button:not(:disabled)').forEach(button => button.addEventListener('click', () => bookAppointment(Number(button.dataset.id))));
}
function bookAppointment(id) { const appointment = initialAppointments.find(item => item.id === id); booked.push(appointment); persist(); renderAppointments(); renderBooked(); showToast(`Consulta de ${appointment.time} agendada!`); }
function renderBooked() {
  const list = document.querySelector('#bookedList');
  document.querySelector('#bookedCount').textContent = booked.length;
  list.innerHTML = booked.length ? booked.map(item => `<article class="booked-card"><div><div class="booked-date">${item.day}, ${item.number} DE JUNHO · ${item.time}</div><h3>${item.type}</h3><p>${item.dentist} · Sorriso Clínica</p></div><button class="cancel-button" data-id="${item.id}">Cancelar</button></article>`).join('') : '<div class="empty-state"><strong>Nenhuma consulta marcada</strong><span>Escolha um horário disponível para começar.</span></div>';
  document.querySelectorAll('.cancel-button').forEach(button => button.addEventListener('click', () => { booked = booked.filter(item => item.id !== Number(button.dataset.id)); persist(); renderBooked(); renderAppointments(); showToast('Consulta cancelada.'); }));
}
function goTo(screen) { document.querySelectorAll('.screen').forEach(view => view.classList.add('hidden')); document.querySelector(`#${screen}Screen`).classList.remove('hidden'); document.querySelectorAll('.nav-item').forEach(item => item.classList.toggle('active', item.dataset.screen === screen)); window.scrollTo({ top: 0, behavior: 'smooth' }); }

document.querySelector('#loginForm').addEventListener('submit', event => { event.preventDefault(); loginView.classList.add('hidden'); mainView.classList.remove('hidden'); goTo('available'); });
document.querySelector('#togglePassword').addEventListener('click', () => { const input = document.querySelector('#password'); input.type = input.type === 'password' ? 'text' : 'password'; });
document.querySelector('#forgotPassword').addEventListener('click', event => { event.preventDefault(); showToast('Enviamos um link para seu e-mail.'); });
document.querySelector('#createAccount').addEventListener('click', event => { event.preventDefault(); showToast('Cadastro disponível em breve.'); });
document.querySelector('#logoutButton').addEventListener('click', () => { mainView.classList.add('hidden'); loginView.classList.remove('hidden'); showToast('Você saiu da conta.'); });
document.querySelector('#editProfile').addEventListener('click', () => showToast('Edição de perfil disponível em breve.'));
document.querySelectorAll('[data-screen]').forEach(item => item.addEventListener('click', event => { if (item.tagName === 'A') event.preventDefault(); goTo(item.dataset.screen); }));
renderDates(); renderAppointments(); renderBooked();
