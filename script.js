const views = {
  home: document.querySelector("#homeView"),
  "client-app": document.querySelector("#clientAppView"),
  "owner-dashboard": document.querySelector("#ownerDashboardView"),
};

const serviceSelect = document.querySelector("#serviceSelect");
const dateInput = document.querySelector("#dateInput");
const timeSelect = document.querySelector("#timeSelect");
const nameInput = document.querySelector("#nameInput");
const phoneInput = document.querySelector("#phoneInput");
const emailInput = document.querySelector("#emailInput");
const previewService = document.querySelector("#previewService");
const previewName = document.querySelector("#previewName");
const previewTime = document.querySelector("#previewTime");
const previewPayment = document.querySelector("#previewPayment");
const previewPrice = document.querySelector("#previewPrice");
const previewProvider = document.querySelector("#previewProvider");
const payOptions = document.querySelectorAll(".pay-option");
const serviceCards = document.querySelectorAll(".service-card");
let serviceRows = document.querySelectorAll(".service-row");
const serviceFilterButtons = document.querySelectorAll("[data-service-filter]");
const appointmentList = document.querySelector("#appointmentList");
const confirmButton = document.querySelector("#confirmButton");
const selectedServiceTitle = document.querySelector("#selectedServiceTitle");
const providerStepLabel = document.querySelector("#providerStepLabel");
const professionalCards = document.querySelectorAll(".professional-card");
const dateChips = document.querySelectorAll(".date-chip");
const timeSlots = document.querySelector("#timeSlots");
const stepPills = document.querySelectorAll(".step-pill");
const wizardPanels = document.querySelectorAll(".wizard-panel");
const myAppointmentsList = document.querySelector("#myAppointmentsList");
const clientTabs = document.querySelectorAll(".client-tab");
const toggleServices = document.querySelector("#toggleServices");
const serviceList = document.querySelector(".service-list");
const cutTrack = document.querySelector("#cutTrack");
const bookingFlow = document.querySelector("#bookingFlow");
const toast = document.querySelector("#toast");
const scrollServicesButtons = document.querySelectorAll("[data-scroll-services]");
const clientLoginForm = document.querySelector("#clientLoginForm");
const clientNameLogin = document.querySelector("#clientNameLogin");
const clientPhoneLogin = document.querySelector("#clientPhoneLogin");
const clientPasswordLogin = document.querySelector("#clientPasswordLogin");
const authTitle = document.querySelector("#authTitle");
const authHelper = document.querySelector("#authHelper");
const authSubmit = document.querySelector("#authSubmit");
const authTabs = document.querySelectorAll(".auth-tab");
const togglePassword = document.querySelector("#togglePassword");
const completionOverlay = document.querySelector("#completionOverlay");
const completionSummary = document.querySelector("#completionSummary");
const viewAppointmentsButton = document.querySelector("#viewAppointmentsButton");
const galleryOverlay = document.querySelector("#galleryOverlay");
const closeGallery = document.querySelector("#closeGallery");
const openGalleryButtons = document.querySelectorAll("[data-open-gallery]");
const addServiceButton = document.querySelector("#addServiceButton");
const addProductButton = document.querySelector("#addProductButton");
const managedServicesList = document.querySelector("#managedServicesList");
const managedProductsList = document.querySelector("#managedProductsList");
const newServiceName = document.querySelector("#newServiceName");
const newServicePrice = document.querySelector("#newServicePrice");
const newServiceDuration = document.querySelector("#newServiceDuration");
const newProductName = document.querySelector("#newProductName");
const newProductPrice = document.querySelector("#newProductPrice");
const newProductStock = document.querySelector("#newProductStock");

let authMode = "signup";

let selectedPayment = "Pago antecipado";
let selectedProvider = "";
let selectedDateLabel = "02/07/2026";
let selectedTime = "15:30";
let displayedPrice = 0;
let priceAnimationFrame = null;
let hasAppointments = false;
let maxUnlockedStep = 0;
const stepOrder = ["provider", "datetime", "confirm"];
document.querySelector('[data-tab-panel="services"]')?.after(bookingFlow);

function getServiceCategory(serviceName) {
  const service = serviceName.toLowerCase();
  if (service.includes("sobrancelha") || service.includes("acabamento") || service.includes("higienização")) {
    return "acabamento";
  }
  if (service.includes("barba")) {
    return "barba";
  }
  return "cabelo";
}

const availability = {
  Deni: {
    "2026-07-02": ["09:00", "10:30", "15:30", "17:00", "19:00"],
    "2026-07-03": ["09:00", "14:00", "16:30", "19:30", "21:00"],
    "2026-07-05": ["09:30", "10:30", "14:00", "15:30"],
  },
  "João Silveira": {
    "2026-07-02": ["14:00", "15:30", "17:00", "20:00"],
    "2026-07-03": ["14:00", "16:00", "18:30", "21:00"],
    "2026-07-05": ["09:00", "11:00", "13:30", "15:00"],
  },
};

function goTo(viewName) {
  Object.values(views).forEach((view) => view.classList.remove("is-active"));
  views[viewName].classList.add("is-active");
  document.body.dataset.view = viewName;
  window.scrollTo({ top: 0, behavior: "auto" });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2800);
}

function setClientTab(tabName) {
  clientTabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === tabName);
  });
}

function scrollToSection(target, block = "start") {
  target?.scrollIntoView({ behavior: "smooth", block });
}

function openInlineSection(tabName) {
  setClientTab(tabName);
  const target = document.querySelector(`[data-tab-panel="${tabName}"]`);
  scrollToSection(target);
}

function openGallery() {
  galleryOverlay.classList.add("show");
  galleryOverlay.setAttribute("aria-hidden", "false");
}

function closeGalleryModal() {
  galleryOverlay.classList.remove("show");
  galleryOverlay.setAttribute("aria-hidden", "true");
}

function openClientTab(tabName) {
  if (document.body.dataset.view !== "client-app") {
    setAuthMode("login");
    document.querySelector(".login-card").scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  openInlineSection(tabName);
}

function setAuthMode(mode) {
  authMode = mode;
  const isSignup = mode === "signup";

  authTitle.textContent = isSignup ? "Cadastro" : "Login";
  authHelper.textContent = isSignup
    ? "Preencha seus dados para criar sua conta e entrar no agendamento."
    : "Entre com seus dados para acessar seus agendamentos.";
  authSubmit.textContent = isSignup ? "Criar conta e agendar" : "Entrar";
  clientPasswordLogin.placeholder = isSignup ? "Crie uma senha" : "Sua senha";
  authTabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.authMode === mode);
  });
}

function formatDate(dateValue) {
  const [year, month, day] = dateValue.split("-");
  return `${day}/${month}/${year}`;
}

function updateStepLocks() {
  stepPills.forEach((pill) => {
    const stepIndex = stepOrder.indexOf(pill.dataset.stepTarget);
    const isLocked = stepIndex > maxUnlockedStep;
    pill.classList.toggle("locked", isLocked);
    pill.setAttribute("aria-disabled", String(isLocked));
  });
}

function unlockStep(stepName) {
  maxUnlockedStep = Math.max(maxUnlockedStep, stepOrder.indexOf(stepName));
  updateStepLocks();
}

function setStep(stepName, shouldScroll = false) {
  const stepIndex = stepOrder.indexOf(stepName);
  if (stepIndex > maxUnlockedStep) {
    return;
  }

  wizardPanels.forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.step === stepName);
  });
  stepPills.forEach((pill) => {
    pill.classList.toggle("active", pill.dataset.stepTarget === stepName);
  });
  if (shouldScroll) {
    document.querySelector(".booking-panel").scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function formatContact(value) {
  if (/[a-zA-Z@._-]/.test(value)) {
    return value.slice(0, 80);
  }

  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) {
    return digits ? `(${digits}` : "";
  }

  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  if (digits.length <= 10) {
    const mobileDigits = digits.length > 2 && digits[2] !== "9" ? `${digits.slice(0, 2)}9${digits.slice(2)}`.slice(0, 11) : digits;
    return `(${mobileDigits.slice(0, 2)}) ${mobileDigits.slice(2, 7)}-${mobileDigits.slice(7)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function getSelectedPrice() {
  const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
  return Number(selectedOption.dataset.price);
}

function animatePrice(targetPrice) {
  if (priceAnimationFrame) {
    cancelAnimationFrame(priceAnimationFrame);
  }

  const startPrice = displayedPrice;
  const duration = 320;
  const startTime = performance.now();

  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(startPrice + (targetPrice - startPrice) * eased);

    displayedPrice = current;
    previewPrice.textContent = `R$ ${current}`;
    previewPrice.classList.add("counting");

    if (progress < 1) {
      priceAnimationFrame = requestAnimationFrame(tick);
      return;
    }

    displayedPrice = targetPrice;
    previewPrice.textContent = `R$ ${targetPrice}`;
    window.setTimeout(() => previewPrice.classList.remove("counting"), 180);
  }

  priceAnimationFrame = requestAnimationFrame(tick);
}

function updatePreview() {
  const service = serviceSelect.value;
  const name = nameInput.value || "Você";
  const date = selectedDateLabel || formatDate(dateInput.value);
  const time = selectedTime || timeSelect.value;
  const price = getSelectedPrice();

  previewService.textContent = service;
  selectedServiceTitle.textContent = service;
  previewName.textContent = name;
  previewTime.textContent = time ? `${date} às ${time}` : "Escolha um horário";
  previewProvider.textContent = selectedProvider || "A escolher";
  providerStepLabel.textContent = selectedProvider ? `${selectedProvider} selecionado` : "Escolha um profissional";
  previewPayment.textContent = selectedPayment;
  animatePrice(price);

}

function renderTimeSlots() {
  if (!selectedProvider) {
    timeSlots.innerHTML = `<p class="locked-hint">Escolha um profissional para liberar os horários.</p>`;
    selectedTime = "";
    timeSelect.value = "";
    updatePreview();
    return;
  }

  const dateValue = dateInput.value;
  const times = availability[selectedProvider][dateValue] || [];

  if (!times.includes(selectedTime)) {
    selectedTime = times[0] || "";
    timeSelect.value = selectedTime;
  }

  timeSlots.innerHTML = times
    .map((time) => `<button class="time-chip${time === selectedTime ? " active" : ""}" type="button" data-time="${time}">${time}</button>`)
    .join("");

  document.querySelectorAll(".time-chip").forEach((button) => {
    button.addEventListener("click", () => {
      selectedTime = button.dataset.time;
      timeSelect.value = selectedTime;
      document.querySelectorAll(".time-chip").forEach((chip) => chip.classList.remove("active"));
      button.classList.add("active");
      unlockStep("confirm");
      updatePreview();
      window.setTimeout(() => setStep("confirm"), 120);
    });
  });

  updatePreview();
}

function syncServiceCard(serviceName) {
  serviceCards.forEach((card) => {
    card.classList.toggle("selected", card.dataset.service === serviceName);
  });
  serviceRows.forEach((row) => {
    row.classList.toggle("selected", row.dataset.service === serviceName);
  });
}

function openBookingForService(serviceName) {
  serviceSelect.value = serviceName;
  syncServiceCard(serviceName);
  selectedProvider = "";
  selectedTime = "";
  timeSelect.value = "";
  professionalCards.forEach((item) => item.classList.remove("active"));
  updatePreview();
  setClientTab("services");
  bookingFlow.classList.remove("booking-flow-hidden");
  maxUnlockedStep = 0;
  updateStepLocks();
  renderTimeSlots();
  setStep("provider", true);
}

function bindServiceRow(row) {
  row.addEventListener("click", () => openBookingForService(row.dataset.service));
}

function formatCurrencyValue(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function createInventoryItem(title, detail) {
  const item = document.createElement("div");
  const strong = document.createElement("strong");
  const span = document.createElement("span");
  strong.textContent = title;
  span.textContent = detail;
  item.append(strong, span);
  return item;
}

function addManagedService() {
  const name = newServiceName.value.trim();
  const price = Number(newServicePrice.value);
  const duration = Number(newServiceDuration.value);

  if (!name || !price || !duration) {
    showToast("Preencha nome, valor e duração do serviço.");
    return;
  }

  const option = document.createElement("option");
  option.value = name;
  option.dataset.price = String(price);
  option.textContent = `${name} - R$ ${price}`;
  serviceSelect.append(option);

  const row = document.createElement("article");
  row.className = "service-row";
  row.dataset.service = name;
  row.dataset.price = String(price);
  row.dataset.duration = String(duration);
  const content = document.createElement("div");
  const title = document.createElement("h3");
  const time = document.createElement("span");
  const small = document.createElement("small");
  const button = document.createElement("button");
  title.textContent = name;
  time.textContent = `${duration}min`;
  small.textContent = `a partir de R$ ${formatCurrencyValue(price)}`;
  button.type = "button";
  button.textContent = "Reservar";
  content.append(title, time, small);
  row.append(content, button);
  serviceList.append(row);
  bindServiceRow(row);
  serviceRows = document.querySelectorAll(".service-row");
  serviceList.classList.add("expanded");
  toggleServices.setAttribute("aria-expanded", "true");
  toggleServices.querySelector("span").textContent = "Mostrar menos serviços";

  managedServicesList.prepend(createInventoryItem(name, `R$ ${formatCurrencyValue(price)} · ${duration}min`));

  newServiceName.value = "";
  newServicePrice.value = "";
  newServiceDuration.value = "";
  showToast("Serviço adicionado ao painel e à lista de reservas.");
}

function addManagedProduct() {
  const name = newProductName.value.trim();
  const price = Number(newProductPrice.value);
  const stock = Number(newProductStock.value);

  if (!name || !price || Number.isNaN(stock)) {
    showToast("Preencha nome, valor e estoque do produto.");
    return;
  }

  managedProductsList.prepend(createInventoryItem(name, `R$ ${formatCurrencyValue(price)} · estoque ${stock}`));

  newProductName.value = "";
  newProductPrice.value = "";
  newProductStock.value = "";
  showToast("Produto adicionado para venda física.");
}

document.querySelectorAll("[data-go]").forEach((button) => {
  button.addEventListener("click", () => goTo(button.dataset.go));
});

document.querySelectorAll("[data-auth-mode]").forEach((button) => {
  button.addEventListener("click", () => {
    setAuthMode(button.dataset.authMode);
    if (button.closest(".mobile-auth-actions")) {
      document.querySelector(".login-card").scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
});

clientTabs.forEach((tab) => {
  tab.addEventListener("click", () => openInlineSection(tab.dataset.tab));
});

closeGallery.addEventListener("click", closeGalleryModal);

openGalleryButtons.forEach((button) => {
  button.addEventListener("click", openGallery);
});

galleryOverlay.addEventListener("click", (event) => {
  if (event.target === galleryOverlay) {
    closeGalleryModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeGalleryModal();
  }
});

toggleServices.addEventListener("click", () => {
  const isExpanded = serviceList.classList.toggle("expanded");
  toggleServices.setAttribute("aria-expanded", String(isExpanded));
  toggleServices.querySelector("span").textContent = isExpanded ? "Mostrar menos serviços" : "Ver todos os serviços";
});

serviceFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.serviceFilter;
    serviceFilterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    serviceRows.forEach((row) => {
      const category = getServiceCategory(row.dataset.service);
      row.classList.toggle("filtered-out", filter !== "all" && category !== filter);
    });

    serviceList.classList.toggle("expanded", filter !== "all");
    toggleServices.hidden = filter !== "all";
    if (filter === "all") {
      toggleServices.setAttribute("aria-expanded", "false");
      toggleServices.querySelector("span").textContent = "Ver todos os serviços";
      serviceList.classList.remove("expanded");
    }
  });
});

document.querySelectorAll("[data-carousel]").forEach((button) => {
  button.addEventListener("click", () => {
    const direction = button.dataset.carousel === "next" ? 1 : -1;
    cutTrack.scrollBy({ left: direction * 320, behavior: "smooth" });
  });
});

scrollServicesButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (document.body.dataset.view !== "client-app") {
      setAuthMode("login");
      document.querySelector(".login-card").scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    bookingFlow.classList.remove("booking-flow-hidden");
    setClientTab("services");
    scrollToSection(bookingFlow);
  });
});

document.querySelectorAll("[data-tab-shortcut]").forEach((button) => {
  button.addEventListener("click", () => openClientTab(button.dataset.tabShortcut));
});

togglePassword.addEventListener("click", () => {
  const shouldShow = clientPasswordLogin.type === "password";
  clientPasswordLogin.type = shouldShow ? "text" : "password";
  togglePassword.textContent = shouldShow ? "Ocultar" : "Ver";
  togglePassword.setAttribute("aria-label", shouldShow ? "Ocultar senha" : "Mostrar senha");
});

clientPhoneLogin.addEventListener("input", () => {
  const formatted = formatContact(clientPhoneLogin.value);
  clientPhoneLogin.value = formatted;
});

clientLoginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const loginName = clientNameLogin.value.trim().toLowerCase();
  const loginContact = clientPhoneLogin.value.trim().toLowerCase();
  const loginPassword = clientPasswordLogin.value.trim().toLowerCase();
  const isOwner =
    (loginName === "deni" || loginName === "denilson" || loginContact === "deni@denihouse.com") &&
    loginPassword === "denihouse";

  if (isOwner) {
    goTo("owner-dashboard");
    showToast("Bem-vindo ao gerenciador.");
    return;
  }

  nameInput.value = clientNameLogin.value;
  phoneInput.value = clientPhoneLogin.value;
  updatePreview();

  if (authMode === "signup") {
    setAuthMode("login");
    showToast("Cadastro feito com sucesso. Continue pelo login.");
    clientPasswordLogin.focus();
    return;
  }

  goTo("client-app");
  showToast("Login realizado. Agora é só escolher o horário.");
});

serviceCards.forEach((card) => {
  card.addEventListener("click", () => {
    serviceSelect.value = card.dataset.service;
    syncServiceCard(card.dataset.service);
    updatePreview();
  });
});

serviceRows.forEach((row) => {
  bindServiceRow(row);
});

addServiceButton.addEventListener("click", addManagedService);
addProductButton.addEventListener("click", addManagedProduct);

professionalCards.forEach((card) => {
  card.addEventListener("click", () => {
    selectedProvider = card.dataset.provider;
    professionalCards.forEach((item) => item.classList.remove("active"));
    card.classList.add("active");
    unlockStep("datetime");
    renderTimeSlots();
    window.setTimeout(() => setStep("datetime"), 120);
  });
});

dateChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    dateInput.value = chip.dataset.date;
    selectedDateLabel = chip.dataset.label;
    dateChips.forEach((item) => item.classList.remove("active"));
    chip.classList.add("active");
    renderTimeSlots();
  });
});

document.querySelectorAll("[data-next-step]").forEach((button) => {
  button.addEventListener("click", () => {
    const nextStep = button.dataset.nextStep;
    if (nextStep === "datetime" && !selectedProvider) {
      showToast("Escolha um profissional para continuar.");
      return;
    }
    if (nextStep === "confirm" && !selectedTime) {
      showToast("Escolha um horário disponível para continuar.");
      return;
    }

    unlockStep(nextStep);
    setStep(nextStep);
  });
});

document.querySelectorAll("[data-prev-step]").forEach((button) => {
  button.addEventListener("click", () => setStep(button.dataset.prevStep));
});

stepPills.forEach((pill) => {
  pill.addEventListener("click", () => setStep(pill.dataset.stepTarget));
});

payOptions.forEach((button) => {
  button.addEventListener("click", () => {
    selectedPayment = button.dataset.payment;
    payOptions.forEach((option) => option.classList.remove("active"));
    button.classList.add("active");
    updatePreview();
  });
});

[serviceSelect, dateInput, timeSelect, nameInput, phoneInput, emailInput].forEach((input) => {
  input.addEventListener("input", () => {
    syncServiceCard(serviceSelect.value);
    updatePreview();
  });
});

confirmButton.addEventListener("click", () => {
  const appointment = document.createElement("div");
  const isPaid = selectedPayment === "Pago antecipado";
  appointment.className = `appointment ${isPaid ? "paid" : "pending"}`;
  appointment.innerHTML = `
    <time>${timeSelect.value}</time>
    <div>
      <strong>${nameInput.value || "Cliente"}</strong>
      <span>${serviceSelect.value} com ${selectedProvider} - ${previewPrice.textContent}</span>
    </div>
    <em>${isPaid ? "Pago" : "Balcão"}</em>
    <small>Confirmação no dia</small>
  `;

  appointmentList.prepend(appointment);
  if (!hasAppointments) {
    myAppointmentsList.innerHTML = "";
    hasAppointments = true;
  }

  const myAppointment = document.createElement("article");
  myAppointment.className = "my-appointment";
  myAppointment.innerHTML = `
    <div>
      <strong>${serviceSelect.value}</strong>
      <span>${selectedDateLabel} às ${selectedTime} com ${selectedProvider}</span>
    </div>
    <em>${isPaid ? "Pago antecipadamente" : "Pagar no balcão"}</em>
  `;
  myAppointmentsList.prepend(myAppointment);
  completionSummary.textContent = `${serviceSelect.value} com ${selectedProvider}, ${selectedDateLabel} às ${selectedTime}. ${isPaid ? "Pagamento antecipado." : "Pagamento no balcão."}`;
  completionOverlay.classList.add("show");
  completionOverlay.setAttribute("aria-hidden", "false");
  showToast("Agendamento concluído. Aviso enviado automaticamente.");
});

viewAppointmentsButton.addEventListener("click", () => {
  completionOverlay.classList.remove("show");
  completionOverlay.setAttribute("aria-hidden", "true");
  openInlineSection("appointments");
});

setAuthMode("signup");
setClientTab("services");
updateStepLocks();
renderTimeSlots();
setStep("provider", false);
updatePreview();
goTo("client-app");
