document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');

  const patientProfile = {
    name: 'Maria Oliveira',
    email: 'paciente@clinica.com',
    phone: '(11) 9 8765-4321',
    plano: 'Plano Silver',
    cpf: '123.456.789-00'
  };

  if (localStorage.getItem('loggedIn') === 'true') {
    window.location.href = 'consultas-marcadas.html';
    return;
  }

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
      alert('Preencha e-mail e senha para continuar.');
      return;
    }

    if (email === patientProfile.email && password === '123456') {
      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('patientProfile', JSON.stringify(patientProfile));
      localStorage.setItem(
        'scheduledAppointments',
        JSON.stringify([
          {
            id: 1,
            date: '2026-09-05',
            time: '09:30',
            doctor: 'Dra. Ana Souza',
            procedure: 'Consulta de rotina',
            category: 'Check-up'
          },
          {
            id: 2,
            date: '2026-09-12',
            time: '15:00',
            doctor: 'Dr. Carlos Lima',
            procedure: 'Acompanhamento ortodôntico',
            category: 'Ortodontia'
          }
        ])
      );

      localStorage.setItem(
        'availableSlots',
        JSON.stringify([
          {
            id: 101,
            date: '2026-09-16',
            time: '08:00',
            doctor: 'Dra. Ana Souza',
            procedure: 'Limpeza profissional',
            category: 'Higienização'
          },
          {
            id: 102,
            date: '2026-09-18',
            time: '11:30',
            doctor: 'Dr. Rafael Costa',
            procedure: 'Avaliação de dor de dente',
            category: 'Emergência'
          },
          {
            id: 103,
            date: '2026-09-20',
            time: '14:30',
            doctor: 'Dra. Mariana Silva',
            procedure: 'Consulta de clareamento',
            category: 'Estética'
          }
        ])
      );

      window.location.href = 'consultas-marcadas.html';
    } else {
      alert('Credenciais inválidas. Use o demo informado na tela.');
    }
  });
});
