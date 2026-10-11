const appointmentList = document.querySelector('#appointmentList');
const appointmentFeedback = document.querySelector('#appointmentFeedback');

function renderAppointments(consultations) {
    const appointments = consultations.filter((consultation) => consultation.agendada);
    appointmentList.replaceChildren();

    appointments.forEach((consultation) => {
        const date = new Date(consultation.dataHora);
        const dateTile = document.createElement('div');
        dateTile.className = 'appointment-date';
        dateTile.setAttribute('aria-label', new Intl.DateTimeFormat('pt-BR', {
            day: 'numeric',
            month: 'long'
        }).format(date));

        const month = document.createElement('span');
        month.textContent = new Intl.DateTimeFormat('pt-BR', { month: 'short' })
            .format(date).replace('.', '').toUpperCase();
        const day = document.createElement('strong');
        day.textContent = date.getDate();
        dateTile.append(month, day);

        const info = document.createElement('div');
        info.className = 'appointment-info';
        const status = document.createElement('span');
        status.className = 'appointment-status';
        status.textContent = 'Confirmada';
        const procedure = document.createElement('h3');
        procedure.textContent = consultation.procedimento;
        const metadata = document.createElement('p');
        const timeIcon = document.createElement('i');
        timeIcon.className = 'bx bx-time-five';
        timeIcon.setAttribute('aria-hidden', 'true');
        const time = document.createTextNode(` ${new Intl.DateTimeFormat('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        }).format(date)} `);
        const divider = document.createElement('span');
        divider.className = 'dot';
        const locationIcon = document.createElement('i');
        locationIcon.className = 'bx bx-map';
        locationIcon.setAttribute('aria-hidden', 'true');
        const location = document.createTextNode(` ${consultation.unidade}`);
        metadata.append(timeIcon, time, divider, locationIcon, location);
        info.append(status, procedure, metadata);

        const detailsButton = document.createElement('button');
        detailsButton.className = 'icon-button';
        detailsButton.type = 'button';
        detailsButton.setAttribute('aria-label', 'Ver detalhes da consulta');
        detailsButton.title = 'Ver detalhes';
        detailsButton.innerHTML = '<i class="bx bx-chevron-right" aria-hidden="true"></i>';
        detailsButton.addEventListener('click', () => {
            window.consultationDialog.open(consultation, loadAppointments, appointmentFeedback);
        });

        const card = document.createElement('article');
        card.className = 'appointment-card';
        card.append(dateTile, info, detailsButton);
        appointmentList.append(card);
    });

    appointmentFeedback.textContent = appointments.length
        ? ''
        : 'Você ainda não possui consultas marcadas.';
}

async function loadAppointments() {
    try {
        const response = await fetch('/api/agendamentos/horarios');
        if (!response.ok) {
            throw new Error('Não foi possível carregar suas consultas. Entre novamente e tente outra vez.');
        }
        renderAppointments(await response.json());
    } catch (error) {
        appointmentList.replaceChildren();
        appointmentFeedback.textContent = error.message;
    }
}

loadAppointments();