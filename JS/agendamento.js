const dateOptions = document.querySelectorAll('.date-option');
const selectedDay = document.querySelector('#selectedDay');

 dateOptions.forEach((option) => {
    option.addEventListener('click', () => {
        dateOptions.forEach((currentOption) => {
            currentOption.classList.remove('is-selected');
            currentOption.setAttribute('aria-pressed', 'false');
        });

        option.classList.add('is-selected');
        option.setAttribute('aria-pressed', 'true');
        selectedDay.textContent = option.dataset.day;
    });
});
