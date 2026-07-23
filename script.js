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
const dateStrip = document.querySelector("#dateStrip");
let dateChips = document.querySelectorAll(".date-chip");
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
const mobileMenuButton = document.querySelector("#mobileMenuButton");
const mobileSideMenu = document.querySelector("#mobileSideMenu");
const mobileMenuCloseButtons = document.querySelectorAll("[data-mobile-menu-close]");
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
const completionTitle = document.querySelector("#completionTitle");
const viewAppointmentsButton = document.querySelector("#viewAppointmentsButton");
const pixBox = document.querySelector("#pixBox");
const pixQrImage = document.querySelector("#pixQrImage");
const pixCopyCode = document.querySelector("#pixCopyCode");
const copyPixButton = document.querySelector("#copyPixButton");
const galleryOverlay = document.querySelector("#galleryOverlay");
const closeGallery = document.querySelector("#closeGallery");
const openGalleryButtons = document.querySelectorAll("[data-open-gallery]");
const photoViewer = document.querySelector("#photoViewer");
const photoViewerImage = document.querySelector("#photoViewerImage");
const closePhotoViewer = document.querySelector("#closePhotoViewer");
const addServiceButton = document.querySelector("#addServiceButton");
const addProductButton = document.querySelector("#addProductButton");
const addPlanButton = document.querySelector("#addPlanButton");
const managedServicesList = document.querySelector("#managedServicesList");
const managedProductsList = document.querySelector("#managedProductsList");
const managedPlansList = document.querySelector("#managedPlansList");
const ownerPlanCatalog = document.querySelector("#ownerPlanCatalog");
const publicPlanCatalog = document.querySelector("#publicPlanCatalog");
const planCheckout = document.querySelector("#planCheckout");
const planCheckoutTitle = document.querySelector("#planCheckoutTitle");
const planCheckoutDescription = document.querySelector("#planCheckoutDescription");
const planPaymentDate = document.querySelector("#planPaymentDate");
const planPaymentButtons = document.querySelectorAll("[data-plan-payment]");
const planPixBox = document.querySelector("#planPixBox");
const planPixKey = document.querySelector("#planPixKey");
const copyPlanPixButton = document.querySelector("#copyPlanPixButton");
const confirmPlanButton = document.querySelector("#confirmPlanButton");
const ownerDashboardTitle = document.querySelector("#ownerDashboardTitle");
const ownerDashboardEyebrow = document.querySelector("#ownerDashboardEyebrow");
const barberDashboardCards = document.querySelectorAll("[data-barber-card]");
const newPlanName = document.querySelector("#newPlanName");
const newPlanPrice = document.querySelector("#newPlanPrice");
const newPlanUsage = document.querySelector("#newPlanUsage");
const newPlanDescription = document.querySelector("#newPlanDescription");
const newServiceName = document.querySelector("#newServiceName");
const newServicePrice = document.querySelector("#newServicePrice");
const newServiceDuration = document.querySelector("#newServiceDuration");
const newProductName = document.querySelector("#newProductName");
const newProductPrice = document.querySelector("#newProductPrice");
const newProductStock = document.querySelector("#newProductStock");

let authMode = "signup";

let selectedPayment = "Pago antecipado";
let selectedPlanPayment = "Pix";
let selectedPlan = null;
let selectedProvider = "";
let selectedDateLabel = "";
let selectedTime = "";
let displayedPrice = 0;
let priceAnimationFrame = null;
let hasAppointments = false;
let maxUnlockedStep = 0;
const stepOrder = ["provider", "datetime", "confirm"];
const appointmentsStorageKey = "deniHouseAppointments";
const customerSessionKey = "deniHouseCurrentCustomer";
const deniPixKey = "";
const remoteState = {
  appointments: [],
  loaded: false,
  enabled: false,
};
let currentCustomer = null;
document.querySelector('[data-tab-panel="services"]')?.after(bookingFlow);

const barberAccess = [
  {
    id: "deni",
    label: "Deni",
    names: ["deni", "denilson"],
    contacts: ["deni@denihouse.com"],
    password: "denihouse",
  },
  {
    id: "joao",
    label: "João",
    names: ["joao", "joão", "joao silveira", "joão silveira"],
    contacts: ["joao@denihouse.com", "joao.silveira@denihouse.com"],
    password: "joaosilveira",
  },
];

function normalizeLoginValue(value) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getBarberByLogin(name, contact, password) {
  const normalizedName = normalizeLoginValue(name);
  const normalizedContact = normalizeLoginValue(contact);
  const normalizedPassword = normalizeLoginValue(password);

  return barberAccess.find((barber) => {
    const canUseName = barber.names.map(normalizeLoginValue).includes(normalizedName);
    const canUseContact = barber.contacts.map(normalizeLoginValue).includes(normalizedContact);
    return (canUseName || canUseContact) && normalizedPassword === normalizeLoginValue(barber.password);
  });
}

function setOwnerDashboard(barber) {
  ownerDashboardTitle.textContent = `Painel do ${barber.label}`;
  ownerDashboardEyebrow.textContent = `Gerenciador Deni House - acesso do ${barber.label}`;
  document.body.dataset.ownerBarber = barber.id;
  barberDashboardCards.forEach((card) => {
    card.classList.toggle("active", card.dataset.barberCard === barber.id);
  });
}

function getStoredAppointments() {
  if (remoteState.loaded) {
    return remoteState.appointments;
  }

  try {
    const parsed = JSON.parse(localStorage.getItem(appointmentsStorageKey) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveStoredAppointments(appointments) {
  remoteState.appointments = appointments;
  localStorage.setItem(appointmentsStorageKey, JSON.stringify(appointments));
}

function getContactDigits(value) {
  return String(value || "").replace(/\D/g, "").slice(0, 11);
}

function sameContact(first, second) {
  const firstDigits = getContactDigits(first);
  const secondDigits = getContactDigits(second);
  return Boolean(firstDigits && secondDigits && firstDigits === secondDigits);
}

function setCurrentCustomer(customer) {
  currentCustomer = customer || null;
  if (currentCustomer) {
    localStorage.setItem(customerSessionKey, JSON.stringify(currentCustomer));
    nameInput.value = currentCustomer.name || "";
    phoneInput.value = currentCustomer.contact || "";
  } else {
    localStorage.removeItem(customerSessionKey);
  }
}

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Nao foi possivel completar a acao.");
  }

  return data;
}

async function loadRemoteAppointments() {
  try {
    const data = await apiRequest("/api/appointments");
    remoteState.appointments = data.appointments || [];
    remoteState.loaded = true;
    remoteState.enabled = true;
    localStorage.setItem(appointmentsStorageKey, JSON.stringify(remoteState.appointments));
  } catch (error) {
    const localAppointments = JSON.parse(localStorage.getItem(appointmentsStorageKey) || "[]");
    remoteState.appointments = Array.isArray(localAppointments) ? localAppointments : [];
    remoteState.loaded = true;
    remoteState.enabled = false;
    console.warn(error.message);
  }
}

async function createAppointment(appointment) {
  if (!remoteState.enabled) {
    const appointments = getStoredAppointments();
    appointments.push(appointment);
    saveStoredAppointments(appointments);
    return appointment;
  }

  const data = await apiRequest("/api/appointments", {
    method: "POST",
    body: JSON.stringify(appointment),
  });
  const savedAppointment = data.appointment;
  const appointments = getStoredAppointments().filter((item) => item.id !== savedAppointment.id);
  appointments.push(savedAppointment);
  saveStoredAppointments(appointments);
  return savedAppointment;
}

async function createPixPayment(appointment) {
  return apiRequest("/api/create-pix", {
    method: "POST",
    body: JSON.stringify({ appointment }),
  });
}

async function saveCatalogItem(item) {
  try {
    const data = await apiRequest("/api/catalog", {
      method: "POST",
      body: JSON.stringify(item),
    });
    return data.item;
  } catch (error) {
    console.warn(error.message);
    return null;
  }
}

async function savePlanOrder(order) {
  const data = await apiRequest("/api/plan-orders", {
    method: "POST",
    body: JSON.stringify(order),
  });
  return data.order;
}

async function loadCatalogItems() {
  try {
    const data = await apiRequest("/api/catalog");
    (data.items || []).forEach((item) => {
      if (item.type === "plan") {
        addPlanToInterface(item);
      }
      if (item.type === "service") {
        addServiceToInterface(item);
      }
      if (item.type === "product") {
        addProductToInterface(item);
      }
    });
  } catch (error) {
    console.warn(error.message);
  }
}

async function authenticateCustomer(action, customer) {
  let data;
  try {
    data = await apiRequest("/api/customers", {
      method: "POST",
      body: JSON.stringify({ action, ...customer }),
    });
  } catch (error) {
    if (error instanceof TypeError || /failed to fetch|load failed|invalid url/i.test(error.message)) {
      throw new Error("Nao consegui falar com o banco. Abra pelo link da Vercel e tente novamente.");
    }
    throw error;
  }

  return data.customer;
}

function formatCurrency(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function toIsoDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatDateLabel(date) {
  return date.toLocaleDateString("pt-BR");
}

function formatShortDate(date) {
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).replace(".", "");
}

function getCurrentWeekRange() {
  const today = new Date();
  const day = today.getDay() || 7;
  const start = new Date(today);
  start.setDate(today.getDate() - day + 1);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return {
    start: toIsoDate(start),
    end: toIsoDate(end),
    label: `${formatDateLabel(start)} a ${formatDateLabel(end)}`,
  };
}

function isSameMonth(dateValue, reference = new Date()) {
  const date = new Date(`${dateValue}T00:00:00`);
  return date.getMonth() === reference.getMonth() && date.getFullYear() === reference.getFullYear();
}

function isInCurrentWeek(dateValue) {
  const week = getCurrentWeekRange();
  return dateValue >= week.start && dateValue <= week.end;
}

function getMonthName(dateValue) {
  return new Date(`${dateValue}T00:00:00`).toLocaleDateString("pt-BR", { month: "long" });
}

function getAppointmentPrice(appointment) {
  return Number(appointment.price) || 0;
}

function getBarberId(provider) {
  return normalizeLoginValue(provider).includes("joao") ? "joao" : "deni";
}

function renderDateChips() {
  const today = new Date();
  const days = Array.from({ length: 5 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    return date;
  });

  dateStrip.innerHTML = days
    .map((date, index) => {
      const weekday = date.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "");
      const month = date.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");
      return `
        <button class="date-chip${index === 0 ? " active" : ""}" type="button" data-date="${toIsoDate(date)}" data-label="${formatDateLabel(date)}">
          <span>${weekday}</span><strong>${String(date.getDate()).padStart(2, "0")}</strong><small>${month}</small>
        </button>
      `;
    })
    .join("");

  dateChips = document.querySelectorAll(".date-chip");
  const firstDate = days[0];
  dateInput.value = toIsoDate(firstDate);
  selectedDateLabel = formatDateLabel(firstDate);

  dateChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      dateInput.value = chip.dataset.date;
      selectedDateLabel = chip.dataset.label;
      dateChips.forEach((item) => item.classList.remove("active"));
      chip.classList.add("active");
      renderTimeSlots();
    });
  });
}

function renderClientAppointments() {
  const customerContact = currentCustomer?.contact || phoneInput.value;
  const appointments = getStoredAppointments().filter((appointment) => sameContact(appointment.contact, customerContact));
  hasAppointments = appointments.length > 0;

  if (!hasAppointments) {
    myAppointmentsList.innerHTML = `
      <article class="my-appointment empty">
        <strong>Nenhum horário confirmado ainda.</strong>
        <span>Quando você confirmar um agendamento, ele aparece aqui.</span>
      </article>
    `;
    return;
  }

  myAppointmentsList.innerHTML = appointments
    .slice()
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
    .map((appointment) => `
      <article class="my-appointment">
        <div>
          <strong>${appointment.service}</strong>
          <span>${appointment.dateLabel} às ${appointment.time} com ${appointment.provider}</span>
        </div>
        <em>${appointment.payment === "Pago antecipado" ? "Pago antecipadamente" : "Pagar no balcão"}</em>
      </article>
    `)
    .join("");
}

function renderDashboard() {
  const appointments = getStoredAppointments();
  const monthAppointments = appointments.filter((appointment) => isSameMonth(appointment.date));
  const weekAppointments = appointments.filter((appointment) => isInCurrentWeek(appointment.date));
  const monthRevenue = monthAppointments.reduce((sum, appointment) => sum + getAppointmentPrice(appointment), 0);
  const paidRevenue = monthAppointments
    .filter((appointment) => appointment.payment === "Pago antecipado")
    .reduce((sum, appointment) => sum + getAppointmentPrice(appointment), 0);

  const metricCards = document.querySelectorAll(".dashboard-grid .metric-card");
  metricCards[0].querySelector("strong").textContent = formatCurrency(monthRevenue);
  metricCards[0].querySelector("small").textContent = monthAppointments.length
    ? "Total confirmado no mês atual"
    : "Atualiza conforme os agendamentos confirmados";
  metricCards[1].querySelector("strong").textContent = String(monthAppointments.length);
  metricCards[1].querySelector("small").textContent = monthAppointments.length
    ? `${weekAppointments.length} cortes nesta semana`
    : "Nenhum corte confirmado ainda";
  paidTotal.textContent = formatCurrency(paidRevenue);

  const serviceCounts = monthAppointments.reduce((acc, appointment) => {
    acc[appointment.service] = (acc[appointment.service] || 0) + 1;
    return acc;
  }, {});
  const serviceRanking = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1]);
  const topService = serviceRanking[0];
  metricCards[3].querySelector("strong").textContent = topService ? topService[0] : "Nenhum";
  metricCards[3].querySelector("small").textContent = topService
    ? `${topService[1]} agendamento${topService[1] > 1 ? "s" : ""} no mês`
    : "Aparece quando houver agendamentos";

  const upcoming = appointments
    .filter((appointment) => appointment.date >= toIsoDate(new Date()))
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
    .slice(0, 6);
  document.querySelector(".schedule-card .card-title span").textContent = upcoming[0] ? upcoming[0].dateLabel : "Hoje";
  appointmentList.innerHTML = upcoming.length
    ? upcoming
        .map((appointment) => `
          <div class="appointment ${appointment.payment === "Pago antecipado" ? "paid" : "pending"}">
            <time>${appointment.time}</time>
            <div>
              <strong>${appointment.clientName || "Cliente"}</strong>
              <span>${appointment.service} com ${appointment.provider} - ${formatCurrency(getAppointmentPrice(appointment))}</span>
            </div>
            <em>${appointment.payment === "Pago antecipado" ? "Pago" : "Balcão"}</em>
            <small>${appointment.dateLabel}</small>
          </div>
        `)
        .join("")
    : `
      <div class="appointment empty">
        <div>
          <strong>Nenhum horário confirmado ainda.</strong>
          <span>Quando o cliente agendar, aparece aqui.</span>
        </div>
      </div>
    `;

  const barChart = document.querySelector(".bar-chart");
  const maxServiceCount = Math.max(...serviceRanking.map(([, count]) => count), 0);
  barChart.innerHTML = serviceRanking.length
    ? serviceRanking.slice(0, 4).map(([service, count]) => {
        const height = Math.max(18, Math.round((count / maxServiceCount) * 100));
        return `<div style="--h: ${height}%"><span>${service}</span></div>`;
      }).join("")
    : `<div style="--h: 8%"><span>Sem dados</span></div>`;

  const currentMonth = new Date();
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - (5 - index), 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const label = date.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");
    const count = appointments.filter((appointment) => appointment.date.startsWith(key)).length;
    return { label, count };
  });
  const maxMonthCount = Math.max(...months.map((month) => month.count), 1);
  document.querySelector(".trend-chart").innerHTML = months
    .map((month) => `<div style="--h: ${Math.max(8, Math.round((month.count / maxMonthCount) * 100))}%"><strong>${month.count}</strong><span>${month.label}</span></div>`)
    .join("");

  const peakRanges = [
    { label: "09h - 11h", start: 9, end: 11 },
    { label: "14h - 17h", start: 14, end: 17 },
    { label: "18h - 21h", start: 18, end: 21 },
  ];
  const peakData = peakRanges.map((range) => {
    const count = weekAppointments.filter((appointment) => {
      const hour = Number(appointment.time.split(":")[0]);
      return hour >= range.start && hour <= range.end;
    }).length;
    return { ...range, count };
  });
  const maxPeak = Math.max(...peakData.map((range) => range.count), 1);
  document.querySelector(".peak-list").innerHTML = peakData
    .map((range) => `<div><span>${range.label}</span><strong style="--w: ${Math.round((range.count / maxPeak) * 100)}%"></strong><em>${range.count} agendamento${range.count === 1 ? "" : "s"}</em></div>`)
    .join("");

  const paidCount = monthAppointments.filter((appointment) => appointment.payment === "Pago antecipado").length;
  const paidPercent = monthAppointments.length ? Math.round((paidCount / monthAppointments.length) * 100) : 0;
  const pendingPercent = monthAppointments.length ? 100 - paidPercent : 0;
  document.querySelector(".payment-donut > div").style.setProperty("--paid", `${paidPercent}%`);
  document.querySelector(".payment-donut ul").innerHTML = `
    <li><span></span> Pago antecipadamente: ${paidPercent}%</li>
    <li><span></span> Pagar no balcão: ${pendingPercent}%</li>
  `;

  const week = getCurrentWeekRange();
  document.querySelector(".weekly-table").innerHTML = `
    <div class="table-row table-head">
      <span>Barbeiro</span>
      <span>Semana</span>
      <span>Cortes</span>
      <span>Total</span>
    </div>
  `;

  ["Deni", "João Silveira"].forEach((provider) => {
    const providerAppointments = weekAppointments.filter((appointment) => appointment.provider === provider);
    const providerRevenue = providerAppointments.reduce((sum, appointment) => sum + getAppointmentPrice(appointment), 0);
    const ticket = providerAppointments.length ? providerRevenue / providerAppointments.length : 0;
    const barberId = getBarberId(provider);
    const barberCard = document.querySelector(`[data-barber-card="${barberId}"]`);
    barberCard.querySelector(".barber-metrics").innerHTML = `
      <div><span>Total recebido</span><strong>${formatCurrency(providerRevenue)}</strong></div>
      <div><span>Cortes</span><strong>${providerAppointments.length}</strong></div>
      <div><span>Ticket médio</span><strong>${formatCurrency(ticket)}</strong></div>
    `;

    const monthsByBarber = appointments
      .filter((appointment) => appointment.provider === provider)
      .reduce((acc, appointment) => {
        const key = `${appointment.date.slice(0, 7)}|${getMonthName(appointment.date)}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});
    const bestMonth = Object.entries(monthsByBarber).sort((a, b) => b[1] - a[1])[0];
    barberCard.querySelector("p").innerHTML = bestMonth
      ? `Mês com mais cortes: <strong>${bestMonth[0].split("|")[1]}</strong>, com ${bestMonth[1]} atendimento${bestMonth[1] > 1 ? "s" : ""}.`
      : `Mês com mais cortes: <strong>Sem dados ainda</strong>.`;

    const row = document.createElement("div");
    row.className = "table-row";
    row.innerHTML = `
      <span>${provider.replace(" Silveira", "")}</span>
      <span>${week.label}</span>
      <span>${providerAppointments.length} corte${providerAppointments.length === 1 ? "" : "s"}</span>
      <strong>${formatCurrency(providerRevenue)}</strong>
    `;
    document.querySelector(".weekly-table").append(row);
  });
}

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
  Deni: ["09:00", "10:30", "14:00", "15:30", "17:00", "19:00", "20:30"],
  "João Silveira": ["09:30", "11:00", "14:00", "15:30", "17:00", "18:30", "20:00"],
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
  document.body.dataset.activeTab = tabName;
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
  closeFullPhoto();
  galleryOverlay.classList.remove("show");
  galleryOverlay.setAttribute("aria-hidden", "true");
}

function openFullPhoto(image) {
  photoViewerImage.src = image.src;
  photoViewerImage.alt = image.alt;
  photoViewer.classList.add("show");
  photoViewer.setAttribute("aria-hidden", "false");
}

function closeFullPhoto() {
  photoViewer.classList.remove("show");
  photoViewer.setAttribute("aria-hidden", "true");
  photoViewerImage.removeAttribute("src");
  photoViewerImage.alt = "";
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

function isValidMobileContact(value) {
  const digits = getContactDigits(value);
  return digits.length === 11 && digits[2] === "9";
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
  const bookedTimes = getStoredAppointments()
    .filter((appointment) => appointment.provider === selectedProvider && appointment.date === dateValue)
    .map((appointment) => appointment.time);
  const times = (availability[selectedProvider] || []).filter((time) => !bookedTimes.includes(time));

  if (!times.includes(selectedTime)) {
    selectedTime = times[0] || "";
    timeSelect.value = selectedTime;
  }

  timeSlots.innerHTML = times.length
    ? times
        .map((time) => `<button class="time-chip${time === selectedTime ? " active" : ""}" type="button" data-time="${time}">${time}</button>`)
        .join("")
    : `<p class="locked-hint">Todos os horários deste dia já foram reservados.</p>`;

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

function createPlanCard(name, description, price) {
  const card = document.createElement("article");
  const type = document.createElement("span");
  const title = document.createElement("h3");
  const details = document.createElement("p");
  const amount = document.createElement("strong");

  card.className = "plan-card";
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.dataset.planName = name;
  card.dataset.planDescription = description || "Cabelo + Sobrancelha inclusa no pacote";
  card.dataset.planPrice = String(price);
  type.textContent = "Plano mensal";
  title.textContent = name;
  details.textContent = description || "Cabelo + Sobrancelha inclusa no pacote";
  amount.textContent = `R$ ${formatCurrencyValue(price)}`;
  card.append(type, title, details, amount);
  return card;
}

function hasInventoryItem(list, name) {
  return Array.from(list?.querySelectorAll("strong") || []).some((item) => item.textContent.trim().toLowerCase() === name.toLowerCase());
}

function hasPlanCard(container, name) {
  return Array.from(container?.querySelectorAll("h3") || []).some((item) => item.textContent.trim().toLowerCase() === name.toLowerCase());
}

function addPlanToInterface({ name, description, price, visitsPerMonth }) {
  const usage = Number(visitsPerMonth || 1);
  const detail = `R$ ${formatCurrencyValue(price)} · ${usage} corte${usage === 1 ? "" : "s"}/mês`;

  if (!hasPlanCard(ownerPlanCatalog, name)) {
    ownerPlanCatalog?.prepend(createPlanCard(name, description, price));
  }
  if (!hasPlanCard(publicPlanCatalog, name)) {
    publicPlanCatalog?.prepend(createPlanCard(name, description, price));
  }
  preparePlanCards();
  if (!hasInventoryItem(managedPlansList, name)) {
    managedPlansList?.prepend(createInventoryItem(name, detail));
  }
}

function addServiceToInterface({ name, price, duration }) {
  const hasService = Array.from(serviceSelect.options).some((option) => option.value.toLowerCase() === name.toLowerCase());

  if (!hasService) {
    const option = document.createElement("option");
    option.value = name;
    option.dataset.price = String(price);
    option.textContent = `${name} - R$ ${price}`;
    serviceSelect.append(option);
  }

  if (!Array.from(serviceList.querySelectorAll(".service-row")).some((row) => row.dataset.service?.toLowerCase() === name.toLowerCase())) {
    const row = document.createElement("article");
    row.className = "service-row";
    row.dataset.service = name;
    row.dataset.price = String(price);
    row.dataset.duration = String(duration || 30);
    const content = document.createElement("div");
    const title = document.createElement("h3");
    const time = document.createElement("span");
    const small = document.createElement("small");
    const button = document.createElement("button");
    title.textContent = name;
    time.textContent = `${duration || 30}min`;
    small.textContent = `a partir de R$ ${formatCurrencyValue(price)}`;
    button.type = "button";
    button.textContent = "Reservar";
    content.append(title, time, small);
    row.append(content, button);
    serviceList.append(row);
    bindServiceRow(row);
    serviceRows = document.querySelectorAll(".service-row");
  }

  if (!hasInventoryItem(managedServicesList, name)) {
    managedServicesList?.prepend(createInventoryItem(name, `R$ ${formatCurrencyValue(price)} · ${duration || 30}min`));
  }
}

function addProductToInterface({ name, price, stock }) {
  if (!hasInventoryItem(managedProductsList, name)) {
    managedProductsList?.prepend(createInventoryItem(name, `R$ ${formatCurrencyValue(price)} · estoque ${stock ?? 0}`));
  }
}

async function addManagedPlan() {
  const name = newPlanName.value.trim();
  const price = Number(newPlanPrice.value);
  const usage = Number(newPlanUsage.value);
  const description = newPlanDescription.value.trim() || "Cabelo + Sobrancelha inclusa no pacote";

  if (!name || !price || !usage) {
    showToast("Preencha nome, valor e quantidade de cortes do plano.");
    return;
  }

  addPlanToInterface({ name, description, price, visitsPerMonth: usage });

  await saveCatalogItem({
    type: "plan",
    name,
    price,
    visitsPerMonth: usage,
    description,
  });

  newPlanName.value = "";
  newPlanPrice.value = "";
  newPlanUsage.value = "";
  newPlanDescription.value = "";
  showToast("Plano adicionado ao gerenciamento.");
}

async function addManagedService() {
  const name = newServiceName.value.trim();
  const price = Number(newServicePrice.value);
  const duration = Number(newServiceDuration.value);

  if (!name || !price || !duration) {
    showToast("Preencha nome, valor e duração do serviço.");
    return;
  }

  addServiceToInterface({ name, price, duration });
  serviceList.classList.add("expanded");
  toggleServices.setAttribute("aria-expanded", "true");
  toggleServices.querySelector("span").textContent = "Mostrar menos serviços";

  await saveCatalogItem({
    type: "service",
    name,
    price,
    duration,
    description: `${duration}min`,
  });

  newServiceName.value = "";
  newServicePrice.value = "";
  newServiceDuration.value = "";
  showToast("Serviço adicionado ao painel e à lista de reservas.");
}

async function addManagedProduct() {
  const name = newProductName.value.trim();
  const price = Number(newProductPrice.value);
  const stock = Number(newProductStock.value);

  if (!name || !price || Number.isNaN(stock)) {
    showToast("Preencha nome, valor e estoque do produto.");
    return;
  }

  addProductToInterface({ name, price, stock });

  await saveCatalogItem({
    type: "product",
    name,
    price,
    stock,
    description: "Venda física no balcão",
  });

  newProductName.value = "";
  newProductPrice.value = "";
  newProductStock.value = "";
  showToast("Produto adicionado para venda física.");
}

function resetPixBox() {
  pixBox.hidden = true;
  pixQrImage.removeAttribute("src");
  pixCopyCode.value = "";
}

function showPixBox(payment) {
  if (!payment?.qrCode || !payment?.qrCodeBase64) {
    resetPixBox();
    return;
  }

  pixQrImage.src = `data:image/png;base64,${payment.qrCodeBase64}`;
  pixCopyCode.value = payment.qrCode;
  pixBox.hidden = false;
}

function getPlanFromCard(card) {
  const title = card.querySelector("h3")?.textContent.trim() || "";
  const description = card.querySelector("p")?.textContent.trim() || "";
  const priceText = card.querySelector("strong")?.textContent || "0";
  const price = Number(priceText.replace(/[^\d,]/g, "").replace(",", "."));
  return {
    name: card.dataset.planName || title,
    description: card.dataset.planDescription || description,
    price: Number(card.dataset.planPrice || price || 0),
  };
}

function preparePlanCards() {
  publicPlanCatalog.querySelectorAll(".plan-card").forEach((card) => {
    const plan = getPlanFromCard(card);
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.dataset.planName = plan.name;
    card.dataset.planDescription = plan.description;
    card.dataset.planPrice = String(plan.price);
  });
}

function updatePlanPaymentView() {
  planPaymentButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.planPayment === selectedPlanPayment);
  });

  const isPix = selectedPlanPayment === "Pix";
  planPixBox.hidden = !isPix;
  planPixKey.value = isPix ? deniPixKey || "Chave Pix ainda nao informada" : "";
  copyPlanPixButton.disabled = !deniPixKey;
}

function openPlanCheckout(plan) {
  if (!currentCustomer) {
    setAuthMode("login");
    document.querySelector(".login-card").scrollIntoView({ behavior: "smooth", block: "center" });
    showToast("Entre ou cadastre-se para escolher um plano.");
    return;
  }

  selectedPlan = plan;
  planCheckoutTitle.textContent = plan.name;
  planCheckoutDescription.textContent = `${plan.description} · R$ ${formatCurrencyValue(plan.price)}`;
  const today = toIsoDate(new Date());
  planPaymentDate.min = today;
  planPaymentDate.value = planPaymentDate.value || today;
  planCheckout.hidden = false;
  updatePlanPaymentView();
  scrollToSection(planCheckout);
}

async function confirmPlanOrder() {
  if (!selectedPlan) {
    showToast("Escolha um plano primeiro.");
    return;
  }

  if (!planPaymentDate.value) {
    showToast("Escolha o dia para acertar o plano.");
    planPaymentDate.focus();
    return;
  }

  if (selectedPlanPayment === "Pix" && !deniPixKey) {
    showToast("Me envie a chave Pix do Deni para liberar pagamento por Pix.");
    return;
  }

  confirmPlanButton.disabled = true;
  confirmPlanButton.textContent = "Salvando plano...";

  try {
    await savePlanOrder({
      customerName: currentCustomer?.name || nameInput.value,
      contact: currentCustomer?.contact || phoneInput.value,
      planName: selectedPlan.name,
      planDescription: selectedPlan.description,
      price: selectedPlan.price,
      settlementDate: planPaymentDate.value,
      paymentMethod: selectedPlanPayment,
      pixKey: selectedPlanPayment === "Pix" ? deniPixKey : "",
    });
    showToast(selectedPlanPayment === "Pix" ? "Plano marcado. Copie a chave Pix para acertar." : "Plano marcado para acertar no balcão.");
  } catch (error) {
    showToast(error.message || "Nao foi possivel salvar o plano agora.");
  } finally {
    confirmPlanButton.disabled = false;
    confirmPlanButton.textContent = "Confirmar interesse no plano";
  }
}

function openMobileMenu() {
  document.body.classList.add("mobile-menu-open");
  mobileSideMenu.setAttribute("aria-hidden", "false");
  mobileMenuButton.setAttribute("aria-expanded", "true");
}

function closeMobileMenu() {
  document.body.classList.remove("mobile-menu-open");
  mobileSideMenu.setAttribute("aria-hidden", "true");
  mobileMenuButton.setAttribute("aria-expanded", "false");
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

mobileMenuButton.addEventListener("click", openMobileMenu);

mobileMenuCloseButtons.forEach((button) => {
  button.addEventListener("click", closeMobileMenu);
});

document.querySelectorAll(".mobile-menu-panel [data-tab-shortcut], .mobile-menu-panel [data-scroll-services], .mobile-menu-panel [data-owner-management], .mobile-menu-panel [data-go]").forEach((button) => {
  button.addEventListener("click", closeMobileMenu);
});

document.querySelectorAll("[data-owner-management]").forEach((button) => {
  button.addEventListener("click", () => {
    if (document.body.dataset.view !== "owner-dashboard") {
      setAuthMode("login");
      document.querySelector(".login-card").scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    scrollToSection(document.querySelector("#ownerManagement"));
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

document.querySelectorAll(".gallery-modal-grid img").forEach((image) => {
  image.addEventListener("click", () => openFullPhoto(image));
});

closePhotoViewer.addEventListener("click", closeFullPhoto);

photoViewer.addEventListener("click", (event) => {
  if (event.target === photoViewer) {
    closeFullPhoto();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (photoViewer.classList.contains("show")) {
      closeFullPhoto();
      return;
    }
    if (document.body.classList.contains("mobile-menu-open")) {
      closeMobileMenu();
      return;
    }
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

publicPlanCatalog.addEventListener("click", (event) => {
  const card = event.target.closest(".plan-card");
  if (card) {
    openPlanCheckout(getPlanFromCard(card));
  }
});

publicPlanCatalog.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }
  const card = event.target.closest(".plan-card");
  if (card) {
    event.preventDefault();
    openPlanCheckout(getPlanFromCard(card));
  }
});

planPaymentButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedPlanPayment = button.dataset.planPayment;
    updatePlanPaymentView();
  });
});

copyPlanPixButton.addEventListener("click", async () => {
  if (!deniPixKey) {
    showToast("Me envie a chave Pix do Deni para ativar este botão.");
    return;
  }

  try {
    await navigator.clipboard.writeText(deniPixKey);
    showToast("Chave Pix copiada.");
  } catch {
    planPixKey.select();
    document.execCommand("copy");
    showToast("Chave Pix copiada.");
  }
});

confirmPlanButton.addEventListener("click", confirmPlanOrder);

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

clientLoginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const loginName = clientNameLogin.value.trim().toLowerCase();
  const loginContact = clientPhoneLogin.value.trim();
  const loginPassword = clientPasswordLogin.value.trim().toLowerCase();
  const barberLogin = getBarberByLogin(loginName, loginContact, loginPassword);

  if (barberLogin) {
    setCurrentCustomer(null);
    setOwnerDashboard(barberLogin);
    goTo("owner-dashboard");
    showToast(`Bem-vindo ao gerenciador, ${barberLogin.label}.`);
    return;
  }

  if (!isValidMobileContact(clientPhoneLogin.value)) {
    showToast("Informe um telefone valido com DDD e 9 digitos. Ex: (51) 99999-9999.");
    clientPhoneLogin.value = formatContact(clientPhoneLogin.value);
    clientPhoneLogin.focus();
    return;
  }

  nameInput.value = clientNameLogin.value;
  phoneInput.value = clientPhoneLogin.value;
  updatePreview();

  authSubmit.disabled = true;
  authSubmit.textContent = authMode === "signup" ? "Cadastrando..." : "Entrando...";

  if (authMode === "signup") {
    try {
      await authenticateCustomer("signup", {
        name: clientNameLogin.value.trim(),
        contact: clientPhoneLogin.value.trim(),
        password: clientPasswordLogin.value.trim(),
      });
      setCurrentCustomer(null);
      setAuthMode("login");
      showToast("Cadastro salvo. Continue pelo login.");
      clientPasswordLogin.focus();
    } catch (error) {
      showToast(error.message || "Nao foi possivel cadastrar.");
    } finally {
      authSubmit.disabled = false;
      authSubmit.textContent = authMode === "signup" ? "Criar conta e agendar" : "Entrar";
    }
    return;
  }

  try {
    const customer = await authenticateCustomer("login", {
      name: clientNameLogin.value.trim(),
      contact: clientPhoneLogin.value.trim(),
      password: clientPasswordLogin.value.trim(),
    });
    setCurrentCustomer(customer);
    renderClientAppointments();
    setClientTab("services");
    goTo("client-app");
    showToast("Login realizado. Agora é só escolher o horário.");
  } catch (error) {
    showToast(error.message || "Nao foi possivel entrar.");
  } finally {
    authSubmit.disabled = false;
    authSubmit.textContent = authMode === "signup" ? "Criar conta e agendar" : "Entrar";
  }
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

addPlanButton.addEventListener("click", addManagedPlan);
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

confirmButton.addEventListener("click", async () => {
  if (!currentCustomer) {
    showToast("Entre na sua conta antes de confirmar o agendamento.");
    goTo("home");
    setAuthMode("login");
    document.querySelector(".login-card").scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const isPaid = selectedPayment === "Pago antecipado";
  const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
  const appointment = {
    id: globalThis.crypto?.randomUUID?.() || String(Date.now()),
    createdAt: new Date().toISOString(),
    clientId: currentCustomer.id,
    clientName: currentCustomer.name || nameInput.value.trim() || "Cliente",
    contact: currentCustomer.contact || phoneInput.value.trim(),
    service: serviceSelect.value,
    provider: selectedProvider,
    barberId: getBarberId(selectedProvider),
    date: dateInput.value,
    dateLabel: selectedDateLabel,
    time: selectedTime,
    payment: selectedPayment,
    paymentStatus: isPaid ? "pending" : "counter",
    price: Number(selectedOption?.dataset.price || 0),
    email: emailInput.value.trim(),
  };

  confirmButton.disabled = true;
  confirmButton.textContent = "Confirmando...";
  resetPixBox();

  try {
    const savedAppointment = await createAppointment(appointment);
    let payment = null;

    if (isPaid) {
      confirmButton.textContent = "Gerando Pix...";
      try {
        payment = await createPixPayment(savedAppointment);
        savedAppointment.paymentId = payment.paymentId;
        savedAppointment.paymentStatus = payment.status || "pending";
        showPixBox(payment);
      } catch (error) {
        completionSummary.textContent = `${serviceSelect.value} com ${selectedProvider}, ${selectedDateLabel} às ${selectedTime}. O agendamento ficou salvo, mas o Pix ainda precisa ser configurado na Vercel.`;
        completionTitle.textContent = "Horário salvo. Pix pendente.";
        showToast(error.message);
      }
    }

    renderClientAppointments();
    renderDashboard();

    if (!isPaid || payment) {
      completionTitle.textContent = isPaid ? "Pix gerado para confirmar." : "Seu horário está reservado.";
      completionSummary.textContent = `${serviceSelect.value} com ${selectedProvider}, ${selectedDateLabel} às ${selectedTime}. ${isPaid ? "Pague pelo QR Code ou copie o código Pix." : "Pagamento no balcão."}`;
    }

    completionOverlay.classList.add("show");
    completionOverlay.setAttribute("aria-hidden", "false");
    showToast(isPaid ? "Agendamento salvo. Pix pronto para pagamento." : "Agendamento concluído.");
  } catch (error) {
    showToast(error.message || "Nao foi possivel confirmar o agendamento.");
  } finally {
    confirmButton.disabled = false;
    confirmButton.textContent = "Confirmar agendamento";
  }
});

viewAppointmentsButton.addEventListener("click", () => {
  completionOverlay.classList.remove("show");
  completionOverlay.setAttribute("aria-hidden", "true");
  openInlineSection("appointments");
});

copyPixButton.addEventListener("click", async () => {
  if (!pixCopyCode.value) {
    return;
  }

  try {
    await navigator.clipboard.writeText(pixCopyCode.value);
    showToast("Código Pix copiado.");
  } catch {
    pixCopyCode.select();
    document.execCommand("copy");
    showToast("Código Pix copiado.");
  }
});

async function initApp() {
  setAuthMode("signup");
  setClientTab("services");
  updateStepLocks();
  renderDateChips();
  preparePlanCards();
  await loadRemoteAppointments();
  await loadCatalogItems();
  renderTimeSlots();
  setStep("provider", false);
  updatePreview();
  renderClientAppointments();
  renderDashboard();
  goTo("home");
}

initApp();
