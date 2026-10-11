const datePickerWrapper = document.querySelector('.date-picker-wrapper');
const datePicker = document.querySelector('.date-picker');
const dateTrigger = document.querySelector('.date-trigger');
const dateTriggerLabel = document.querySelector('#dateTriggerLabel');
const selectedDay = document.querySelector('#selectedDay');
const timeList = document.querySelector('#timeList');
const statusMessage = document.querySelector('#scheduleStatus');
let consultations = [];
let selectedDate = null;

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
});

function setDatePickerOpen(isOpen) {
    if (!datePicker || !dateTrigger) {
        return;
    }

    datePicker.classList.toggle('is-open', isOpen);
    dateTrigger.setAttribute('aria-expanded', String(isOpen));
}

function updateDateTriggerLabel() {
    if (!dateTriggerLabel) {
        return;
    }

    if (!selectedDate) {
        dateTriggerLabel.textContent = 'Selecionar data';
        return;
    }

    const day = new Date(`${selectedDate}T12:00:00`);
    dateTriggerLabel.textContent = new Intl.DateTimeFormat('pt-BR', {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }).format(day);
}

function consultationDate(value) {
    return new Date(value);
}

function escapeHtml(value) {
    const replacements = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return String(value).replace(/[&<>"']/g, (character) => replacements[character]);
}

function renderDates() {
    const dates = [...new Set(consultations.map((consultation) => consultation.dataHora.slice(0, 10)))];
    datePicker.replaceChildren();

    dates.forEach((date) => {
        const day = new Date(`${date}T12:00:00`);
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `date-option${date === selectedDate ? ' is-selected' : ''}`;
        button.setAttribute('aria-pressed', String(date === selectedDate));
        button.innerHTML = `<span>${new Intl.DateTimeFormat('pt-BR', { weekday: 'short' }).format(day).replace('.', '').toUpperCase()}</span><strong>${day.getDate()}</strong><small>${new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(day).replace('.', '').toUpperCase()}</small>`;
        button.addEventListener('click', () => {
            selectedDate = date;
            selectedDay.textContent = dateFormatter.format(day);
            renderDates();
            renderConsultations();
            setDatePickerOpen(false);
        });
        datePicker.append(button);
    });

    if (selectedDate) {
        selectedDay.textContent = dateFormatter.format(new Date(`${selectedDate}T12:00:00`));
    }

    updateDateTriggerLabel();
}

function renderConsultations() {
    const items = consultations.filter((consultation) => consultation.dataHora.startsWith(selectedDate));
    timeList.replaceChildren();

    items.forEach((consultation) => {
        const time = consultationDate(consultation.dataHora);
        const card = document.createElement('article');
        card.className = `time-slot${consultation.agendada ? ' is-booked' : ''}`;
        card.innerHTML = `
            <div class="time-slot__time"><i class="bx bx-time-five" aria-hidden="true"></i><strong>${new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(time)}</strong></div>
            <div class="time-slot__details"><h3>${escapeHtml(consultation.procedimento)}</h3><p><i class="bx bx-map" aria-hidden="true"></i> ${escapeHtml(consultation.unidade)}</p></div>
            <div class="time-slot__actions">
                <span class="${consultation.agendada ? 'booked-tag' : 'available-tag'}"><i class="bx ${consultation.agendada ? 'bx-calendar-check' : 'bx-check-circle'}" aria-hidden="true"></i> ${consultation.agendada ? 'Agendada' : 'Disponível'}</span>
                <button class="schedule-button" type="button">${consultation.agendada ? 'Ver consulta' : 'Agendar'}</button>
            </div>`;
        card.querySelector('button').addEventListener('click', () => openConsultation(consultation));
        timeList.append(card);
    });
}

if (dateTrigger) {
    dateTrigger.addEventListener('click', (event) => {
        event.stopPropagation();
        setDatePickerOpen(!datePicker.classList.contains('is-open'));
    });
}

if (datePickerWrapper) {
    document.addEventListener('click', (event) => {
        if (!datePickerWrapper.contains(event.target)) {
            setDatePickerOpen(false);
        }
    });
}

function openConsultation(consultation) {
    window.consultationDialog.open(consultation, loadConsultations, statusMessage);
}

async function loadConsultations() {
    statusMessage.textContent = 'Carregando horários...';
    try {
        const response = await fetch('/api/agendamentos/horarios');
        if (!response.ok) {
            throw new Error('Não foi possível carregar os horários. Entre novamente e tente outra vez.');
        }
        consultations = await response.json();
        selectedDate = consultations[0]?.dataHora.slice(0, 10) ?? null;
        renderDates();
        renderConsultations();
        statusMessage.textContent = consultations.length
            ? ''
            : 'Não há horários disponíveis no momento.';
    } catch (error) {
        statusMessage.textContent = error.message;
    }
}

loadConsultations();
