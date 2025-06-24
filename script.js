document.addEventListener('DOMContentLoaded', () => {
  const music = document.getElementById('bg-music');
  const playBtn = document.querySelector('button[onclick="playMusic()"]');
  const pages = document.querySelectorAll('.page');
  const daysSpan = document.getElementById('days');
  const quizForm = document.getElementById('loveQuiz');
  const quizResult = document.getElementById('quizResult');
  const progressBar = document.getElementById('progress');

  let currentPage = 0;
  const startDate = new Date('2024-06-01');

  // Update "days together" counter
  function updateDays() {
    const today = new Date();
    const daysDiff = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    daysSpan.textContent = daysDiff;
  }

  updateDays();
  setInterval(updateDays, 86400000); // 24 hours

  // Background music controls
  function playMusic() {
    if (music.paused) {
      music.play();
      playBtn.classList.add('playing');
      playBtn.innerHTML = '<span class="icon">⏸️</span><span class="label">Pause Music</span>';
    } else {
      music.pause();
      playBtn.classList.remove('playing');
      playBtn.innerHTML = '<span class="icon">▶️</span><span class="label">Play Music</span>';
    }
  }

  // Make it globally callable from inline HTML
  window.playMusic = playMusic;

  // Voice note playback
  window.playNote = function () {
    const note = document.getElementById('voice-note');
    if (note) note.play();
  };

  // Navigation
  function showPage(index) {
    pages.forEach((page, i) => {
      page.classList.toggle('hidden', i !== index);
    });

    if (progressBar) {
      const progress = (index / (pages.length - 1)) * 100;
      progressBar.style.width = `${progress}%`;
    }

    currentPage = index;

    // Reset quiz if on quiz page (last page by default)
    const isQuizPage = index === pages.length - 1;
    if (isQuizPage && quizForm && quizResult) {
      quizForm.classList.remove('hidden');
      quizResult.classList.add('hidden');
      quizForm.reset();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  window.showPage = showPage;

  window.nextPage = () => {
    if (currentPage < pages.length - 1) showPage(currentPage + 1);
  };

  window.prevPage = () => {
    if (currentPage > 0) showPage(currentPage - 1);
  };

  // Quiz logic
  function submitQuiz() {
    const answers = {
      q1: 'B',
      q2: 'A',
      q3: 'C',
      q4: 'B',
    };

    let score = 0;
    for (const [q, correct] of Object.entries(answers)) {
      const selected = quizForm.querySelector(`input[name="${q}"]:checked`);
      if (selected?.value === correct) score++;
    }

    document.getElementById('score').textContent = score;
    const resultMsg = score === 4
      ? "🎉 You know us perfectly! 🎉"
      : score >= 2
        ? "😊 You're getting there!"
        : "💖 More adventures to learn together!";

    document.getElementById('resultMsg').textContent = resultMsg;
    quizForm.classList.add('hidden');
    quizResult.classList.remove('hidden');
  }

  window.submitQuiz = submitQuiz;

  // Show the first page on load
  showPage(currentPage);
});
