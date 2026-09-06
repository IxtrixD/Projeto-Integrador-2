document.querySelector('.logout-btn')?.addEventListener('click', function () {
    window.location.href = '../index.html';
});

document.querySelector('#scheduleButton')?.addEventListener('click', function () {
    this.innerHTML = '<i class="bx bx-check"></i> Solicitação enviada';
    this.disabled = true;
    this.setAttribute('aria-live', 'polite');
});