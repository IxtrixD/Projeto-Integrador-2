const consultationDialog = document.createElement('dialog');
consultationDialog.className = 'consultation-dialog';
consultationDialog.setAttribute('aria-labelledby', 'dialogTitle');
consultationDialog.innerHTML = `
    <form method="dialog" class="dialog-close-form">
        <button class="dialog-close" type="submit" aria-label="Fechar detalhes"><i class="bx bx-x" aria-hidden="true"></i></button>
    </form>
    <p class="section-label">Detalhes da consulta</p>
    <h2 id="dialogTitle">Consulta odontológica</h2>
    <dl class="consultation-details">
        <div><dt>Dentista</dt><dd data-detail="dentista"></dd></div>
        <div><dt>Especialização</dt><dd data-detail="especializacao"></dd></div>
        <div><dt>Data</dt><dd data-detail="data"></dd></div>
        <div><dt>Horário</dt><dd data-detail="horario"></dd></div>
        <div><dt>Consulta</dt><dd data-detail="procedimento"></dd></div>
        <div><dt>Unidade</dt><dd data-detail="unidade"></dd></div>
    </dl>
    <form class="consultation-action-form">
        <button class="schedule-button dialog-action" type="submit"></button>
    </form>`;
document.body.append(consultationDialog);

let selectedConsultation = null;
let refreshList = null;
let feedbackElement = null;

window.consultationDialog = {
    open(consultation, onUpdated, feedback) {
        selectedConsultation = consultation;
        refreshList = onUpdated;
        feedbackElement = feedback;
        const date = new Date(consultation.dataHora);
        const values = {
            dentista: consultation.dentista,
            especializacao: consultation.especializacao,
            data: new Intl.DateTimeFormat('pt-BR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long'
            }).format(date),
            horario: new Intl.DateTimeFormat('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
            }).format(date),
            procedimento: consultation.procedimento,
            unidade: consultation.unidade
        };

        Object.entries(values).forEach(([key, value]) => {
            consultationDialog.querySelector(`[data-detail="${key}"]`).textContent = value;
        });

        const actionButton = consultationDialog.querySelector('.dialog-action');
        actionButton.textContent = consultation.agendada ? 'Cancelar consulta' : 'Confirmar agendamento';
        actionButton.classList.toggle('is-cancel', consultation.agendada);
        consultationDialog.showModal();
    }
};

consultationDialog.querySelector('.consultation-action-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!selectedConsultation) return;

    const actionButton = consultationDialog.querySelector('.dialog-action');
    actionButton.disabled = true;
    try {
        const response = await fetch(`/api/agendamentos/${selectedConsultation.id}`, {
            method: selectedConsultation.agendada ? 'DELETE' : 'POST'
        });
        const result = response.status === 204 ? null : await response.json().catch(() => null);
        if (!response.ok) {
            throw new Error(result?.message || result?.detail || 'Não foi possível atualizar a consulta.');
        }

        const message = selectedConsultation.agendada
            ? 'Consulta cancelada.'
            : 'Consulta agendada com sucesso.';
        consultationDialog.close();
        await refreshList();
        feedbackElement.textContent = message;
    } catch (error) {
        feedbackElement.textContent = error.message;
    } finally {
        actionButton.disabled = false;
    }
});