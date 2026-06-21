const INR = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

function formatRupees(value) {
  return '₹' + INR.format(Math.floor(value));
}

function formatLakhCrore(value) {
  return '₹' + value.toFixed(2).replace(/\.00$/, '') + ' lakh cr';
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}

function ratio(a, b) {
  return (a / b).toFixed(1) + 'x';
}

function setWidth(id, part, total) {
  document.getElementById(id).style.width = `${Math.max(4, (part / total) * 100)}%`;
}

function setTheme() {
  const button = document.getElementById('themeToggle');
  let theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme);
  button.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  });
}

async function loadDebt() {
  const response = await fetch('./debt.json');
  if (!response.ok) throw new Error('Could not load debt.json');
  const data = await response.json();

  document.getElementById('jsonPreview').textContent = JSON.stringify(data, null, 2);
  document.getElementById('sourceLink').href = data.sourceUrl;
  document.getElementById('budgetSourceLink').href = data.budgetSourceUrl;
  document.getElementById('populationText').textContent = INR.format(data.population);
  document.getElementById('baseDateText').textContent = formatDate(data.baseDate);
  document.getElementById('targetDateText').textContent = formatDate(data.targetDate);
  document.getElementById('lastUpdated').textContent = 'Data refreshed: ' + formatDate(data.lastRefreshed);
  document.getElementById('methodLabel').textContent = data.methodology;
  document.getElementById('debtToGdp').textContent = data.debtToGdp + '%';
  document.getElementById('interestShare').textContent = data.interestShareOfExpenditure + '%';

  const croreToRupees = 10000000;
  const lakhCroreToCrore = 100000;
  const base = data.baseDebtCrore * croreToRupees;
  const target = data.targetDebtCrore * croreToRupees;

  const baseMs = new Date(data.baseDate).getTime();
  const targetMs = new Date(data.targetDate).getTime();
  const secondsBetween = (targetMs - baseMs) / 1000;
  const debtRatePerSecond = (target - base) / secondsBetween;

  const annualInterestRupees = data.interestPaymentsLakhCrore * lakhCroreToCrore * croreToRupees;
  const interestPerSecond = annualInterestRupees / (365 * 24 * 60 * 60);

  document.getElementById('interestPerSecond').textContent = formatRupees(interestPerSecond);
  document.getElementById('headlineSubcopy').textContent = `${formatLakhCrore(data.interestPaymentsLakhCrore)} in annual interest. ${data.interestShareOfExpenditure}% of total spending is going to past borrowing.`;

  document.getElementById('interestBillLabel').textContent = formatLakhCrore(data.interestPaymentsLakhCrore);
  document.getElementById('capexLabel').textContent = formatLakhCrore(data.capexLakhCrore);
  document.getElementById('educationLabel').textContent = formatLakhCrore(data.educationLakhCrore);
  document.getElementById('healthLabel').textContent = formatLakhCrore(data.healthLakhCrore);

  setWidth('interestBar', data.interestPaymentsLakhCrore, data.totalExpenditureLakhCrore);
  setWidth('capexBar', data.capexLakhCrore, data.totalExpenditureLakhCrore);
  setWidth('educationBar', data.educationLakhCrore, data.totalExpenditureLakhCrore);
  setWidth('healthBar', data.healthLakhCrore, data.totalExpenditureLakhCrore);

  document.getElementById('interestVsCapex').textContent = ratio(data.interestPaymentsLakhCrore, data.capexLakhCrore);
  document.getElementById('interestVsEducation').textContent = ratio(data.interestPaymentsLakhCrore, data.educationLakhCrore);
  document.getElementById('interestVsHealth').textContent = ratio(data.interestPaymentsLakhCrore, data.healthLakhCrore);

  function render() {
    const now = Date.now();
    const liveDebt = base + ((now - baseMs) / 1000) * debtRatePerSecond;
    const debtPerCitizen = liveDebt / data.population;
    document.getElementById('debtValue').textContent = formatRupees(liveDebt);
    document.getElementById('perCitizen').textContent = formatRupees(debtPerCitizen);
  }

  render();
  setInterval(render, 250);
}

setTheme();
loadDebt().catch((error) => {
  document.getElementById('debtValue').textContent = 'Unable to load data';
  document.getElementById('headlineSubcopy').textContent = error.message;
});
