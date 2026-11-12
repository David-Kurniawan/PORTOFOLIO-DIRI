const projectDetails = {
  sikaboda: {
    title: 'Sikaboda — sistem manajemen SDM sekolah',
    category: 'PROYEK TIM · SISTEM INFORMASI SEKOLAH',
    description: 'Aplikasi internal sekolah untuk mengelola presensi dan izin, jurnal guru serta karyawan, evaluasi mandiri, penilaian kinerja guru (PKG), dan data pelatihan. Operator, guru, wali kelas, waka kurikulum, kepala sekolah, dan karyawan mendapat menu serta alur kerja sesuai perannya. Proyek ini dikerjakan bersama tim.',
    tools: 'REACT · TAILWIND CSS · LARAVEL · PHP 8.2 · ROLE ACCESS',
    label: 'PROYEK TIM',
  },
  suru: {
    title: 'Website Dusun Suru Kidul',
    category: 'PROYEK KKN · WEBSITE INFORMASI DUSUN',
    description: 'Website informasi untuk Dusun Suru Kidul, Kalurahan Hargomulyo, Kecamatan Gedang Sari, Kabupaten Gunungkidul. Isinya meliputi profil dusun, peta dengan titik penting, infografis kependudukan, dan galeri kegiatan. Tersedia panel admin untuk memperbarui ringkasan data, infografis, dan foto galeri.',
    tools: 'HTML · CSS · JAVASCRIPT · FIREBASE HOSTING · FIRESTORE · GOOGLE MAPS',
    label: 'PROYEK KKN',
  },
};

const pageSections = [...document.querySelectorAll('.section-anchor')];
const navLinks = [...document.querySelectorAll('.nav-link')];
const pageName = document.querySelector('#current-page');
const themeToggle = document.querySelector('.theme-toggle');
const projectDialog = document.querySelector('.project-dialog');
const toast = document.querySelector('.toast');
let toastTimer;
let activeSectionNavigation = false;
let activeSectionNavigationTimer;

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const root = document.documentElement;
    const nextTheme = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = nextTheme;
    themeToggle.setAttribute('aria-label', nextTheme === 'light' ? 'Ganti ke tema gelap' : 'Ganti ke tema terang');
    document.querySelector('meta[name="theme-color"]').content = nextTheme === 'light' ? '#f4f4ef' : '#171c19';
  });
}

const revealTargets = document.querySelectorAll(
  '.hero__copy, .hero-art, .about-heading, .about-overview, .experience-block, .section-heading, .project-card, .contact-section__top, .contact-section h2, .contact-section > p, .contact-section__actions'
);
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealTargets.forEach((element) => element.classList.add('is-revealed'));
} else {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('is-revealed', entry.isIntersecting);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });

  revealTargets.forEach((element, index) => {
    element.classList.add('scroll-reveal');
    element.style.setProperty('--reveal-delay', `${(index % 3) * 70}ms`);
    revealObserver.observe(element);
  });
}

function setActiveSection(sectionId) {
  navLinks.forEach((link) => link.classList.toggle('is-active', link.dataset.section === sectionId));
  if (pageName) pageName.textContent = sectionId.toUpperCase();
}

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    activeSectionNavigation = true;
    window.clearTimeout(activeSectionNavigationTimer);
    setActiveSection(link.dataset.section);
    activeSectionNavigationTimer = window.setTimeout(() => {
      activeSectionNavigation = false;
      updateActiveSection();
    }, 900);
  });
});

const initialSection = window.location.hash.slice(1);
if (navLinks.some((link) => link.dataset.section === initialSection)) {
  setActiveSection(initialSection);
}

document.querySelectorAll('[data-current-year]').forEach((node) => {
  node.textContent = new Date().getFullYear();
});

function updateActiveSection() {
  if (activeSectionNavigation) return;

  const activationLine = Math.min(window.innerHeight * 0.62, window.innerHeight - 120);
  const sectionAtLine = pageSections.find((section) => {
    const bounds = section.getBoundingClientRect();
    return bounds.top <= activationLine && bounds.bottom > activationLine;
  });
  const precedingSections = pageSections.filter((section) => section.getBoundingClientRect().top <= activationLine);
  const activeSection = sectionAtLine || precedingSections[precedingSections.length - 1] || pageSections[0];

  if (activeSection) setActiveSection(activeSection.id);
}

let activeSectionFramePending = false;
window.addEventListener('scroll', () => {
  if (activeSectionNavigation) {
    window.clearTimeout(activeSectionNavigationTimer);
    activeSectionNavigationTimer = window.setTimeout(() => {
      activeSectionNavigation = false;
      updateActiveSection();
    }, 180);
    return;
  }

  if (activeSectionFramePending) return;
  activeSectionFramePending = true;
  window.requestAnimationFrame(() => {
    activeSectionFramePending = false;
    updateActiveSection();
  });
}, { passive: true });
window.addEventListener('resize', updateActiveSection);
window.addEventListener('hashchange', () => setActiveSection(window.location.hash.slice(1)));
window.addEventListener('load', updateActiveSection, { once: true });
window.requestAnimationFrame(updateActiveSection);

document.querySelectorAll('[data-project]').forEach((button) => {
  button.addEventListener('click', () => {
    if (!projectDialog) return;

    const project = projectDetails[button.dataset.project];
    if (!project) return;
    projectDialog.querySelector('#dialog-title').textContent = project.title;
    projectDialog.querySelector('.project-dialog__category').textContent = project.category;
    projectDialog.querySelector('.project-dialog__description').textContent = project.description;
    projectDialog.querySelector('.project-dialog__year').textContent = project.label;
    projectDialog.querySelector('.project-dialog__tools').textContent = project.tools;

    if (typeof projectDialog.showModal === 'function') {
      projectDialog.showModal();
    }
  });
});

if (projectDialog) {
  const closeButton = projectDialog.querySelector('.project-dialog__close');
  if (closeButton) closeButton.addEventListener('click', () => projectDialog.close());
  projectDialog.addEventListener('click', (event) => {
    if (event.target === projectDialog) projectDialog.close();
  });
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2400);
}

const emailCopyButton = document.querySelector('[data-copy-email]');
if (emailCopyButton) {
  emailCopyButton.addEventListener('click', async (event) => {
    const email = event.currentTarget.dataset.copyEmail;
    try {
      await navigator.clipboard.writeText(email);
      showToast('Alamat email berhasil disalin.');
    } catch {
      const emailField = document.createElement('textarea');
      emailField.value = email;
      emailField.setAttribute('readonly', '');
      emailField.style.position = 'fixed';
      emailField.style.opacity = '0';
      document.body.append(emailField);
      emailField.select();
      const copied = document.execCommand('copy');
      emailField.remove();
      showToast(copied ? 'Alamat email berhasil disalin.' : `Email saya: ${email}`);
    }
  });
}
