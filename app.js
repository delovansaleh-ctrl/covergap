document.getElementById('yr').textContent = new Date().getFullYear();

// ── STATE ──
const ST = {
  screen: 0, dir: 1,
  leadId: null,
  goal: null, ageBand: null,
  providers: [], coverTypes: [],
  callTime: '', email: '',
  firstName: '', lastName: '', phone: '',
};

// ── DATA ──
const GOAL_DATA = [
  {id:'premiums',title:'Same cover, lower premiums',desc:'I think I might be overpaying',
    icon:'<svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2.5L5 7v7c0 5.2 4 9.7 9 11 5-1.3 9-5.8 9-11V7L14 2.5z"/><line x1="14" y1="9.5" x2="14" y2="18.5"/><polyline points="11,15.5 14,18.5 17,15.5"/></svg>'},
  {id:'review',title:'Review my cover levels',desc:'Not sure if I have enough',
    icon:'<svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="7.5"/><line x1="17.5" y1="17.5" x2="23.5" y2="23.5"/><polyline points="9,12 11.5,14.5 15.5,9.5"/></svg>'},
  {id:'life_change',title:'Big life change',desc:'New mortgage, baby, marriage or job change',
    icon:'<svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="14" r="4.5"/><circle cx="20.5" cy="14" r="4.5"/><polyline points="15,10.5 19,14 15,17.5"/></svg>'},
  {id:'dont_know',title:"I don't know what I have",desc:'Want to understand my current policy',
    icon:'<svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3H8a2 2 0 00-2 2v18a2 2 0 002 2h12a2 2 0 002-2V9L17 3z"/><polyline points="17,3 17,9 23,9"/><path d="M11.5 16.5c0-1.5 1.1-2.5 2.5-2.5s2.5 1 2.5 2.5c0 1-.6 1.8-1.5 2.3L14 20.5"/><circle cx="14" cy="22.5" r=".9" fill="currentColor" stroke="none"/></svg>'},
  {id:'new',title:'New to insurance',desc:"Want to learn what's out there",span:2,
    icon:'<svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M23.5 13.5a9.5 9.5 0 00-19 0"/><line x1="14" y1="13.5" x2="14" y2="22"/><path d="M10.5 22.5a3.5 3.5 0 007 0"/></svg>'},
];

const AGE_BANDS = ['Under 30','30–45','46–55','56–65','Over 65'];

const BANK_DATA = [
  {id:'anz',name:'ANZ',color:'#007DBA',domain:'anz.co.nz'},
  {id:'asb',name:'ASB',color:'#E4003A',domain:'asb.co.nz'},
  {id:'bnz',name:'BNZ',color:'#C8102E',domain:'bnz.co.nz'},
  {id:'kiwibank',name:'Kiwibank',color:'#00A859',domain:'kiwibank.co.nz'},
  {id:'westpac',name:'Westpac',color:'#DA1710',domain:'westpac.co.nz'},
  {id:'cooperative',name:'Cooperative Bank',color:'#1B4B6B',domain:'co-operativebank.co.nz'},
  {id:'sbs',name:'SBS Bank',color:'#003B8E',domain:'sbsbank.co.nz'},
];

const INSURER_DATA = [
  {id:'aalife',name:'AA Life',color:'#F5A623',domain:'aa.co.nz'},
  {id:'aia',name:'AIA',color:'#D4002D',domain:'aia.com',logoH:36,logoUrl:"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii00NzEuOSAzOTkuNiAxNjkuNSAxODEuNCI+PHN0eWxlPi5zdDB7ZmlsbDolMjNENDAwM0I7fTwvc3R5bGU+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTQ1LjIzMjc2NCwtMTUzLjQ3MzI1KSI+PHBhdGggY2xhc3M9InN0MCIgZD0iTS0zMTQuNCw2NTguNmMtMi0zLjgtOC45LTAuOC0xMi40LTQuMWMtMS0wLjktMy0yLjctNC4xLTUuOWMtMS0zLTIuNS01LjQtNS03LjRjLTQuNS0zLjUtMTUuMS04LjktMTQuNC0xNmMwLjMtMy4yLDQuMi0zLjksNS44LTYuMmMxLTEuNCwxLjEtMy4yLDIuMi00LjVjMS4zLTEuNS0wLjUtMS41LTEuOC0xLjZjLTIuNy0wLjEtNC43LDIuOC02LjksNGMtMy42LDEuOS02LjksNC42LTExLDUuNWMtMS4yLDAuMy03LjMsMi4yLTMuMywzLjJjMi43LDAuNyw1LjgsMC41LDguMSwyLjVjMi45LDIuNSw1LjMsNS43LDguMiw4LjJjMS41LDEuMywyLjksMi41LDQuMSw0YzEuNCwxLjgsMS4yLDMuOSwyLjIsNS43YzEsMS44LDMsMC4yLDQuMiwxLjJjNCwzLjMtMS42LDQuOS0zLDYuNWMtMS45LDIuMS0yLjIsMy40LTUuNyw0LjhjLTEuNSwwLjYtMTEuNCwxLjgtMTIuNiwyLjdjLTEuMiwwLjktMC42LDEuMi0wLjMsMS42YzAuMywwLjQsMiwwLjksMi44LDFjNC4xLDAuNCwxNi45LDIuOCwxOS41LTAuNWMxLjgtMi4zLDQuNC0yLjUsNy40LTEuN2MyLjEsMC41LDYuMiwwLjEsOS43LTEuM0MtMzE4LjUsNjU5LjUtMzEyLjksNjU5LjUtMzE0LjQsNjU4LjYgTS0zMTYuOCw2NzQuNmMwLDAuMS0wLjIsMC4xLTAuNCwwLjNjLTAuMiwwLjEtMC40LDAuMi0wLjQsMC4yYy00LDIuMi02LDUuNi01LjYsMTEuMmMwLjYsNy43LDYuMiw0Ni44LDYuMiw0Ni44bDEwLjktMy41YzAsMC0xLTYuMy0yLjItMTQuMWMzLjctMS4xLDcuNC0yLjcsMTEuMS00LjdjMy42LTIsNi45LTQuNCw5LjgtNi45YzUuOSw1LjIsMTAuOCw5LjQsMTAuOCw5LjRsOC43LTcuNGMwLDAtMzAuMS0yNS42LTM2LjMtMzAuMUMtMzA4LjksNjcyLjUtMzEyLjgsNjcyLjQtMzE2LjgsNjc0LjYgTS0zMDIuMiw3MDJjLTIuOCwxLjYtNS4zLDIuNS03LjgsM2MtMS40LTguNi0yLjYtMTYuNC0yLjctMTcuM2MtMC4zLTIuMy0wLjItMy4yLDAuNy0zLjdjMC44LTAuNSwxLjctMC4xLDMuNCwxLjRjMC44LDAuNyw2LjcsNS44LDEzLjIsMTEuNkMtMjk3LjMsNjk4LjctMjk5LjQsNzAwLjQtMzAyLjIsNzAyIE0tMzQ4LDczNC41aDExLjJ2LTU1LjZILTM0OEwtMzQ4LDczNC41eiBNLTM2Ny40LDY3NS4xYzAsMC0wLjItMC4xLTAuNC0wLjNjLTAuMi0wLjEtMC40LTAuMi0wLjQtMC4zYzAsMC4xLDAsMC4xLDAsMC4xYy00LTIuMi03LjktMi4xLTEyLjQsMS4yYy02LjMsNC41LTM2LjQsMzAtMzYuNCwzMGw4LjcsNy40YzAsMCw0LjgtNC4yLDEwLjctOS4zYzIuOSwyLjYsNi4yLDQuOSw5LjgsNi45YzMuNiwyLDcuNCwzLjYsMTEuMSw0LjZjLTEuMyw3LjgtMi4zLDE0LjEtMi4zLDE0LjFsMTAuOCwzLjVjMCwwLDUuOC0zOS4xLDYuMy00Ni43Qy0zNjEuNSw2ODAuNy0zNjMuNSw2NzcuMy0zNjcuNCw2NzUuMSBNLTM3Mi4zLDY4Ny43Yy0wLjEsMC45LTEuNCw4LjctMi44LDE3LjNjLTIuNS0wLjYtNS0xLjUtNy44LTMuMWMtMi44LTEuNi00LjktMy4yLTYuNy01YzYuNi01LjcsMTIuNS0xMC45LDEzLjItMTEuNWMxLjgtMS41LDIuNi0xLjksMy41LTEuNEMtMzcyLjEsNjg0LjQtMzcyLDY4NS40LTM3Mi4zLDY4Ny43IiBNLTM0Miw1NTNjLTQ2LjgsMC04NC43LDM3LjktODQuNyw4NC43YzAsMTkuNSw2LjYsMzcuNCwxNy43LDUxLjdsMi4zLTEuOWMtNi4yLTguMy0xMC43LTE3LjktMTMuMi0yOC4zYzAuNywwLjIsMS42LDAuNCwzLDAuOGM0LjcsMS41LDEzLjYsNC40LDIwLDEuNWM0LjEtMS45LDExLjEtMy41LDEzLjktNC41YzIuNi0xLjEsOCwxLjMsMS42LTIuOWgwYy0wLjEtMC4xLTAuMi0wLjEtMC4zLTAuMWMtMC4yLTAuMS0wLjQtMC4xLTAuNy0wLjJjLTAuNi0wLjEtNS44LDAuOS02LjksMC43Yy0wLjQtMC4xLTAuNy0wLjItMS0wLjRjLTIuOC0xLjUsOS4xLTEwLjgsOS41LTEzLjFjLTMuNCwwLjQtNi4yLDIuNS05LjMsMy45Yy0zLjYsMS42LTcuNSwxLjYtMTEuNCwxLjdjLTQuNCwwLTcuOCwzLjQtMTEuNyw1Yy0yLDAuOS01LjMsMS42LTcuNiwzLjFjLTAuMi0xLTAuMy0xLjktMC40LTIuOWMwLjEtMS43LDAuMi0zLjcsMC43LTZjMC45LTUsMi45LTguOSw3LjUtMTVjMCwwLDQuNC01LjMsNy03YzEtMC43LDIuMS0xLjcsMy4yLTFjMS4xLDAuNy0wLjMsNS4xLDIuNyw1LjhjMS44LDAuNCwwLjIsMy40LDAuOCw1LjJjMC43LDEuOS03LjUsOS01LjQsOS45YzEuMiwwLjUsNi42LTIuMyw5LjUtMy4yYzIuNS0wLjgsNS4yLTAuOCw4LTMuNWMyLjktMi43LDUuNy00LjIsNS43LTQuMmMyLjMtMiw0LjYtNCw2LjktNS45YzIuMi0yLDQuNC00LDYuNi02YzEuNC0xLjMsNy41LTQuNyw4LTUuOWMyLjktNi4yLDEwLjMtOS44LDE1LjktMTMuN2MxLTAuNywyLjEtMi4yLDIuOC0zLjFjMC42LTAuOSwxLjMtMi4yLDEuNy0yLjZjMC43LTAuOCwwLjktMS40LDEuNy0xLjhjMC4zLTAuMiwxLjYtMC4yLDIuMSwwLjVjMS44LDEuOSw0LjMsMy42LDQuNCw1LjZjMC4yLDMuMSw4LjksNS44LDEwLjksOC4yYzAuOCwxLDEuMywyLDEuNiwyLjljLTEuNS0wLjYtMy0xLjMtNC4zLTIuM2MtMC45LTAuNy0yLjktMC41LTQtMC43Yy0zLTAuNi0yLjMsMC44LTAuNiwyLjZjMS43LDEuOCwzLjcsMy4zLDUuMiw1LjNjMS44LDIuMiwxLjYsNCwyLjEsNi43YzAuNSwyLjgsMi4yLDUuMywzLjYsNy44YzEuNCwyLjUsMS4zLDUuMiwyLjEsNy45YzAuOCwyLjcsMy4yLDUsNS4xLDdjMS42LDEuNyw1LjMsNS45LDcuNCw1YzIuMi0wLjksNC44LDEuNyw1LjYsMWMwLjgtMC43LTIuMi00LjItMS01LjJjMS4xLTEuMSw2LjEsMC42LDcuMSwzLjhjMS4yLDMuNywxLDQsMC45LDYuN2MtMC4xLDEuOC0wLjgsMy4yLTIsNC40Yy0xLjUsMS41LTQuOSwzLjktNC4yLDYuNGMzLjEtMS43LDYuNS0xLjgsMTAtMS43YzMuNCwwLjEsNS45LTEuMyw4LjEtMy43YzEtMS4xLDMuOS00LjQsNS41LTIuN2MxLDEtMS45LDUuMSwxLjMsNC4zYzIuMS0wLjYsNC0yLjIsNS45LTMuM2MwLjUtMC4zLDEtMC42LDEuNC0wLjljLTIuNSwxMC42LTcuMiwyMC4zLTEzLjUsMjguN2wyLjMsMS45YzExLjItMTQuNCwxOC0zMi41LDE4LTUyLjFDLTI1Ny4yLDU5MS0yOTUuMiw1NTMtMzQyLDU1MyBNLTI2Ny40LDYzNy45Yy03LjEsMS41LTkuMy00LjctMTUuMi04LjZjLTUuOS0zLjktMTEuNC01LjQtMTYuOS0xMC45Yy0yLjItMi4yLTIuOC02LTUtOC4zYy0yLjktMy4xLTQuNy00LTguNy01LjVjLTctMi43LTEzLTQuNy0xOC44LTkuNWMtMS0wLjgtMy4zLTEuOS01LjQtMi4zYy0wLjktMC4yLTEuMy0wLjEtMS42LDAuM2MtMC45LDEuMS0xLjcsMi41LTIuNCwzLjdjLTAuMiwwLjMtMC45LDEuNC0xLjUsMS45Yy0xLjEsMS0yLjUsMi4zLTMuNiwyLjljLTUuOCwzLjYtMTMuNSw2LjYtMTYuOCwxMi42Yy0wLjYsMS4xLTcsNC4xLTguNCw1LjJjLTIuMywxLjktNC42LDMuOC03LDUuNWMtMi4yLDEuNy01LjMsNC4yLTcuNiw1LjljLTEuMi0wLjUtMi41LTAuOS0zLjYtMS4xYy0yLjctMC42LTUtMi43LTcuNC00LjFjLTMtMS45LTIuOC0yLjEtMy43LTIuN2MtMC44LTAuNS0xLjItMC43LTEuNi0wLjljLTIuMi0xLjMtMi40LDAtNS42LDJjLTIuNywxLjYtNS43LDQuMy04LDYuNWMtMS44LDEuNy0zLjcsMy41LTUuNiw1LjRjMi43LTQxLjEsMzcuNC03My42LDc5LjktNzMuNmM0MiwwLDc2LjQsMzEuOSw3OS43LDcyLjRDLTI2My41LDYzNi41LTI2NS40LDYzNy40LTI2Ny40LDYzNy45Ii8+PC9nPjwvc3ZnPg=="},
  {id:'asteron',name:'Asteron Life',color:'#0066A1',domain:'asteronlife.co.nz'},
  {id:'booster',name:'Booster',color:'#00B2A9',domain:'booster.co.nz'},
  {id:'chubb',name:'Chubb Life',color:'#003087',domain:'chubb.com'},
  {id:'fidelity',name:'Fidelity Life',color:'#E4002B',domain:'fidelitylife.co.nz'},
  {id:'mas',name:'MAS',color:'#00539F',domain:'mas.co.nz'},
  {id:'momentum',name:'Momentum Life',color:'#E8641A',domain:'momentumlife.co.nz',logoH:44},
  {id:'nib',name:'NIB',color:'#00A99D',domain:'nib.co.nz'},
  {id:'nzseniors',name:'NZ Seniors',color:'#2E7D32',domain:'nzseniors.co.nz'},
  {id:'onechoice',name:'OneChoice',color:'#2B6CB0',domain:'onechoice.co.nz'},
  {id:'partners',name:'Partners Life',color:'#0082C8',domain:'partnerslife.co.nz'},
  {id:'pinnacle',name:'Pinnacle Life',color:'#038A44',domain:'pinnaclelife.co.nz'},
  {id:'resolution',name:'Resolution Life',color:'#00205B',domain:'resolutionlife.co.nz',logoH:44},
  {id:'southerncross',name:'Southern Cross',color:'#C8102E',domain:'southerncross.co.nz',logoH:44},
  {id:'pps',name:'PPS Mutual',color:'#1A3A6B',domain:'ppsmutual.co.nz'},
];

const COVER_DATA = [
  {id:'life',title:'Life Insurance',desc:'A lump sum paid to your family',icon:'<svg width="44" height="44" viewBox="0 0 44 44" fill="none"><path class="ci-pulse" d="M22 38S7 28 7 18a10 10 0 0 1 15-8.7A10 10 0 0 1 37 18c0 10-15 20-15 20z" stroke="currentColor" stroke-width="2.5" fill="currentColor" fill-opacity="0.12"/></svg>'},
  {id:'trauma',title:'Trauma Cover',desc:'Heart attack, stroke, cancer',icon:'<svg width="44" height="44" viewBox="0 0 44 44" fill="none"><path d="M22 5L6 13v13c0 9 7 17 16 19 9-2 16-10 16-19V13L22 5z" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.1"/><path class="ci-cross" d="M22 17v10M17 22h10" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>'},
  {id:'tpd',title:'Total & Permanent Disability',desc:"If you can't work again",icon:'<svg width="44" height="44" viewBox="0 0 44 44" fill="none"><circle cx="22" cy="13" r="7" stroke="currentColor" stroke-width="2.5"/><path d="M8 41v-6a14 14 0 0 1 28 0v6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><path class="ci-float" d="M30 28l5 5M35 28l-5 5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>'},
  {id:'income',title:'Income Protection',desc:"Monthly income if you're off work",icon:'<svg width="44" height="44" viewBox="0 0 44 44" fill="none"><rect class="ci-bar1" x="5" y="30" width="8" height="10" rx="2" fill="currentColor" fill-opacity="0.4"/><rect class="ci-bar2" x="17" y="22" width="8" height="18" rx="2" fill="currentColor" fill-opacity="0.65"/><rect class="ci-bar3" x="29" y="13" width="8" height="27" rx="2" fill="currentColor"/><polyline class="ci-float" points="9,26 22,18 34,11 41,6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>'},
  {id:'health',title:'Health Insurance',desc:'Private surgery & specialist care',icon:'<svg width="44" height="44" viewBox="0 0 44 44" fill="none"><rect class="ci-cross" x="17" y="5" width="10" height="34" rx="4" fill="currentColor" fill-opacity="0.15" stroke="currentColor" stroke-width="2"/><rect class="ci-cross" x="5" y="17" width="34" height="10" rx="4" fill="currentColor" fill-opacity="0.15" stroke="currentColor" stroke-width="2"/></svg>'},
  {id:'notsure',title:"I'm not sure",desc:'We can help figure this out',icon:'<svg width="44" height="44" viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="16" stroke="currentColor" stroke-width="2" opacity="0.2"/><circle class="ci-float" cx="22" cy="22" r="16" stroke="currentColor" stroke-width="2" stroke-dasharray="5 4" fill="none" opacity="0.5"/><text x="22" y="29" text-anchor="middle" font-size="20" font-weight="700" fill="currentColor" font-family="DM Sans,sans-serif">?</text></svg>'},
];

const GOAL_LABELS = {premiums:'Lower premiums',review:'Review cover',life_change:'Life change',dont_know:'Unsure about cover',new:'New to insurance'};

// ── ROUTING ──
// PATH_FULL: [1,2,3,4,5,6,7,8,9]
// PATH_NEW (goal=new): [1,2,3,5,6,7,8,9]  — skips providers (screen 4)
// Screen 3b is over-65 branch — not in PATH, navigated to explicitly
const QUICK_MODE = new URLSearchParams(window.location.search).get('quick') === '1';
const getPath = () => {
  if (QUICK_MODE) return [2, 9];
  return ST.goal === 'new' ? [1,2,3,5,6,7,8,9] : [1,2,3,4,5,6,7,8,9];
};
const stepOf = () => {
  const p = getPath(), i = p.indexOf(ST.screen);
  return i >= 0 ? `Step ${i + 1} of ${p.length}` : '';
};

// ── VALIDATION ──
const VALID = {
  1: () => !!ST.goal,
  2: () => !!ST.firstName.trim() && !!ST.phone,
  3: () => !!ST.ageBand,
  4: () => ST.providers.length > 0,
  5: () => ST.coverTypes.length > 0,
  6: () => !!ST.callTime && /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(ST.email || ''),
  7: () => true,
  8: () => true,
  9: () => true,
};

function updateNextBtn() {
  const ok = VALID[ST.screen] ? VALID[ST.screen]() : false;
  document.querySelectorAll('.btn-next').forEach(b => {
    b.classList.toggle('enabled', ok);
  });
}

// ── NAV ──
// Auto-advance for single-select screens. Short pause so the tick is visible,
// and guarded on ST.screen so a late tap can't jump the wrong screen.
let _advTimer = null;
function autoAdvance(fromScreen) {
  if (ST.screen !== fromScreen) return;
  clearTimeout(_advTimer);
  _advTimer = setTimeout(() => {
    if (ST.screen === fromScreen && VALID[fromScreen] && VALID[fromScreen]()) goNext();
  }, 550);
}

function goNext() {
  if (!VALID[ST.screen] || !VALID[ST.screen]()) return;
  const path = getPath();
  const idx = path.indexOf(ST.screen);
  if (idx < 0 || idx >= path.length - 1) return;
  if (typeof fbq !== 'undefined') fbq('trackCustom', 'FunnelStep', {step: ST.screen, next: path[idx + 1]});
  navigateTo(path[idx + 1], 1);
}

function goBack() {
  const path = getPath();
  const idx = path.indexOf(ST.screen);
  if (idx <= 0) return;
  navigateTo(path[idx - 1], -1);
}

function navigateTo(n, d) {
  ST.dir = d; ST.screen = n;
  render();
  window.scrollTo({top: 0, behavior: 'instant'});
}

// ── RENDER ──
let _builtScreen = null;

function render() {
  const changed = ST.screen !== _builtScreen;
  if (changed) {
    document.querySelectorAll('.screen').forEach(el => el.classList.remove('active','slide-in-r','slide-in-l'));
    const sc = document.getElementById('s' + ST.screen);
    if (sc) sc.classList.add('active', ST.dir >= 0 ? 'slide-in-r' : 'slide-in-l');

    // Progress dots
    const path = getPath(), si = Math.max(0, path.indexOf(ST.screen));
    for (let i = 1; i <= 9; i++) {
      const el = document.getElementById('prog' + i); if (!el) continue;
      el.innerHTML = path.filter(s => s !== '3b').map((_, j) => {
        const cls = j < si ? 'pdot done' : j === si ? 'pdot active' : 'pdot';
        return `<div class="${cls}"></div>`;
      }).join('') + `<span class="step-lbl">${stepOf()}</span>`;
    }

    buildScreen(ST.screen);
    _builtScreen = ST.screen;
  }
  updateNextBtn();
}

function buildScreen(n) {
  switch (n) {
    case 0: buildHero(); break;
    case 1: buildGoalGrid(); break;
    case 2: buildS2(); break;
    case 3: buildAgeBandGrid(); break;
    case '3b': break; // static HTML
    case 4: buildProvGrid(); buildGoalPill('pill-s4', 'pill-s4-text'); break;
    case 5: buildCoverGrid(); buildGoalPill('pill-s5', 'pill-s5-text'); break;
    case 6: {
      buildCallTimeRow();
      // Restore email if the user navigated back from the review screen
      const em = document.getElementById('f-email');
      if (em) em.value = ST.email || '';
      break;
    }
    case 7: buildReview(); break;
    case 8: {
      const disp = document.getElementById('s8-phone-display');
      if (disp) disp.textContent = ST.phone;
      // Reset OTP UI to send-section state on re-entry
      const sendSec = document.getElementById('otp-send-section');
      const entrySec = document.getElementById('otp-entry-section');
      if (sendSec) sendSec.style.display = 'block';
      if (entrySec) entrySec.style.display = 'none';
      const otpErr = document.getElementById('otp-error');
      if (otpErr) { otpErr.style.display='none'; otpErr.textContent=''; }
      break;
    }
    case 9: buildConfirm(); break;
  }
}

// ── SCREEN BUILDERS ──
function mkChk() { return '<div class="chk">✓</div>'; }

let _heroTimers = [];
let _heroFirstLoad = true;
function buildHero() {
  _heroTimers.forEach(clearTimeout);
  _heroTimers = [];
  const g = id => document.getElementById(id);
  if (_heroFirstLoad) {
    _heroFirstLoad = false;
    const cta = g('s0-cta'); if (cta) { cta.style.opacity='1'; cta.style.transform='none'; }
    const qcb = g('quick-cb'); if (qcb) { qcb.style.opacity='1'; qcb.style.transform='translateY(0)'; }
    return;
  }
  const h=g('s0-headline'),sub=g('s0-sub'),viz=g('s0-viz');
  const barCvr=g('s0-bar-cvr'),barGap=g('s0-bar-gap');
  const lblCvr=g('s0-lbl-cvr'),lblGap=g('s0-lbl-gap');
  if (!h) return;
  h.innerHTML=''; h.style.opacity='0'; h.style.animation='none';
  if (sub){sub.style.opacity='0';sub.textContent='';}
  if (viz) viz.style.opacity='0';
  if (barCvr){barCvr.style.transition='none';barCvr.style.width='0';}
  if (barGap){barGap.style.transition='none';barGap.style.width='0';}
  if (lblCvr) lblCvr.style.opacity='0';
  if (lblGap) lblGap.style.opacity='0';
  const t=(fn,ms)=>{const id=setTimeout(fn,ms);_heroTimers.push(id);};
  t(()=>{h.innerHTML='Are you actually <span style="color:#a78bfa">covered?</span>';h.style.animation='headlineIn .5s cubic-bezier(.16,1,.3,1) forwards';h.style.opacity='1';},80);
  t(()=>{if(viz)viz.style.opacity='1';},400);
  t(()=>{if(barCvr){barCvr.style.transition='width .8s cubic-bezier(0.25,1,0.5,1)';barCvr.style.width='100%';}},500);
  t(()=>{if(barCvr){barCvr.style.transition='width .7s cubic-bezier(0.4,0,0.2,1)';barCvr.style.width='58%';}if(barGap){barGap.style.transition='width .7s cubic-bezier(0.25,1,0.5,1)';barGap.style.width='42%';}},1400);
  t(()=>{if(lblCvr)lblCvr.style.opacity='1';if(lblGap)lblGap.style.opacity='1';},2100);
  t(()=>{if(sub){sub.textContent='Most NZ policies leave a gap. Find out where yours is.';sub.style.opacity='1';}},2300);
  t(()=>{const cta=g('s0-cta');const hint=g('s0-scroll-hint');if(cta){cta.style.opacity='1';cta.style.transform='translateY(0)';}if(hint)hint.style.opacity='1';},2500);
  t(()=>{const qcb=g('quick-cb');if(qcb){qcb.style.opacity='1';qcb.style.transform='translateY(0)';}},2800);
}

function resetFunnel() {
  if (ST.screen === 0) return;
  Object.assign(ST, {leadId:null,goal:null,ageBand:null,providers:[],coverTypes:[],callTime:'',email:'',firstName:'',lastName:'',phone:''});
  navigateTo(1, -1);
  window.scrollTo({top:0,behavior:'instant'});
}

function startFunnel() {
  if (typeof fbq !== 'undefined') {
    fbq('track', 'InitiateCheckout');
    fbq('trackCustom', 'FunnelStart');
  }
  _heroTimers.forEach(clearTimeout);
  window.scrollTo({top:0,behavior:'instant'});
  const s0el = document.getElementById('s0');
  const wash = document.getElementById('hero-wash');
  if (!s0el || !wash) return;
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  s0el.classList.add('hero-exiting');
  const firstScreen = QUICK_MODE ? 2 : 1;
  if (QUICK_MODE) { ST.goal = 'quick'; ST.lastName = 'x'; ST.email = 'x@x.x'; }
  setTimeout(() => {
    wash.classList.add('active');
    setTimeout(() => {
      navigateTo(firstScreen, 1);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      setTimeout(() => {
        wash.classList.remove('active');
        setTimeout(() => wash.classList.add('fade'), 50);
        setTimeout(() => wash.classList.remove('fade'), 800);
      }, 120);
    }, 320);
  }, 280);
}

function buildGoalGrid() {
  const g = document.getElementById('goal-grid'); if (!g) return;
  g.innerHTML = GOAL_DATA.map((card, i) => {
    const sel = ST.goal === card.id;
    const span = card.span === 2 ? 'grid-column:span 2' : '';
    return `<div class="card card-goal${sel?' sel':''}" data-id="${card.id}"
      onclick="selectGoal('${card.id}')"
      style="${span};animation:cardIn .42s cubic-bezier(.22,.61,.36,1) ${.22+i*.07}s both">
      ${mkChk()}
      <div class="card-icon">${card.icon}</div>
      <div class="card-goal-title">${card.title}</div>
      <div class="card-goal-desc">${card.desc}</div>
    </div>`;
  }).join('');
}

function buildS2() {
  // Restore state into inputs if user navigated back
  const fn = document.getElementById('f-fname');
  const fp = document.getElementById('f-phone');
  if (fn && ST.firstName) fn.value = ST.firstName;
  if (fp && ST.phone) fp.value = ST.phone;
  const ps = document.getElementById('phone-status');
  if (ps && ST.phone) { ps.textContent = '✓ valid NZ number'; ps.style.color = '#2E7D32'; }
}

function buildAgeBandGrid() {
  const g = document.getElementById('age-grid'); if (!g) return;
  const ins = document.getElementById('s3-name-insert');
  // Comma + space, otherwise it renders as "How old are youDelovan?"
  if (ins) ins.textContent = ST.firstName ? ', ' + ST.firstName : '';
  g.innerHTML = AGE_BANDS.map((band, i) => {
    const sel = ST.ageBand === band;
    return `<div class="card card-age${sel?' sel':''}" data-id="${band}"
      onclick="selectAgeBand('${band}',this)"
      style="animation:bigPop .48s cubic-bezier(.22,.61,.36,1) ${.12+i*.07}s both">
      ${mkChk()}
      <span class="card-age-val">${band}</span>
    </div>`;
  }).join('');
}

function buildProvGrid() {
  const notsureEl = document.getElementById('prov-notsure');
  const bankEl = document.getElementById('bank-grid');
  const insEl = document.getElementById('insurer-grid');
  if (!notsureEl || !bankEl || !insEl) return;

  const selNotsure = ST.providers.includes('notsure');
  notsureEl.className = 'prov-other' + (selNotsure ? ' sel' : '');
  const chkN = notsureEl.querySelector('.chk');
  if (chkN) chkN.style.display = selNotsure ? 'flex' : 'none';

  const makeTile = (p, i) => {
    const sel = ST.providers.includes(p.id);
    const sz = p.logoH ? `max-height:${p.logoH}px;max-width:${p.logoH*2}px` : '';
    const src = p.logoUrl || `https://www.google.com/s2/favicons?domain=${p.domain}&sz=128`;
    const lbl = `<img class="prov-logo" src="${src}" loading="lazy"
       onerror="this.style.display='none';this.nextElementSibling.style.display='block'" alt="${p.name}" style="${sz}"/>
       <span class="prov-name-fb" style="color:${sel?'#5B21B6':p.color}">${p.name}</span>
       <span class="prov-tile-name">${p.name}</span>`;
    return `<div class="prov-tile${sel?' sel':''}" data-id="${p.id}"
      onclick="selectProvider('${p.id}')"
      style="animation:cardIn .32s ease ${.08+i*.025}s both">
      <div class="prov-bar" style="background:${p.color}"></div>
      <div class="chk">✓</div>
      ${lbl}
    </div>`;
  };
  bankEl.innerHTML = BANK_DATA.map((p, i) => makeTile(p, i)).join('');
  insEl.innerHTML = INSURER_DATA.map((p, i) => makeTile(p, i + 7)).join('');
}

function buildCoverGrid() {
  const g = document.getElementById('cover-grid'); if (!g) return;
  const t = document.getElementById('s5-title');
  if (t) t.textContent = ST.goal === 'new' ? 'What would you like to explore?' : 'What cover do you currently hold?';
  g.innerHTML = COVER_DATA.map((card, i) => {
    const sel = ST.coverTypes.includes(card.id);
    return `<div class="card card-cover${sel?' sel':''}" data-id="${card.id}"
      onclick="toggleCover('${card.id}',this)"
      style="animation:bigPop .45s cubic-bezier(.22,.61,.36,1) ${.1+i*.06}s both">
      ${mkChk()}
      <div class="card-icon">${card.icon}</div>
      <div class="card-title">${card.title}</div>
      <div class="card-desc">${card.desc}</div>
    </div>`;
  }).join('');
}

function buildCallTimeRow() {
  const g = document.getElementById('calltime-row'); if (!g) return;
  g.innerHTML = ['Morning','Afternoon','Evening'].map(t => {
    return `<button class="call-pill${ST.callTime===t?' sel':''}" data-v="${t}"
      onclick="selectCallTime('${t}',this)">${t}</button>`;
  }).join('');
  // Restore email if back-navigated
  const emailEl = document.getElementById('f-email');
  if (emailEl && ST.email) emailEl.value = ST.email;
}

function buildReview() {
  const all = [...BANK_DATA, ...INSURER_DATA, {id:'notsure',name:"I'm not sure"}];
  const provNames = ST.providers.map(id => (all.find(p => p.id === id) || {}).name).filter(Boolean);
  const coverNames = ST.coverTypes.map(id => (COVER_DATA.find(c => c.id === id) || {}).title).filter(Boolean);

  const rows = [
    ['Goal', GOAL_LABELS[ST.goal] || ST.goal],
    ['Name', ST.firstName || '—'],
    ['Mobile', ST.phone || '—'],
    ['Age band', ST.ageBand || '—'],
    ['Current insurer', provNames.length ? provNames.join(', ') : '—'],
    ['Cover types', coverNames.length ? coverNames.join(', ') : '—'],
    ['Best time to call', ST.callTime || '—'],
    ['Email', ST.email || '(not provided)'],
  ];

  const g = document.getElementById('s7-rows'); if (!g) return;
  g.innerHTML = rows.map(([k, v]) => `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;padding:10px 0;border-bottom:1px solid #F3F4F6;gap:12px">
      <span style="font-size:11px;font-weight:600;letter-spacing:.06em;color:#9CA3AF;text-transform:uppercase;flex-shrink:0">${k}</span>
      <span style="font-size:14px;font-weight:600;color:#111827;text-align:right">${v}</span>
    </div>`).join('');
}

function buildGoalPill(elId, textId) {
  const el = document.getElementById(elId), txt = document.getElementById(textId);
  if (!el || !txt) return;
  const lbl = GOAL_LABELS[ST.goal] || '';
  el.className = 'goal-pill' + (lbl ? ' show' : '');
  txt.textContent = lbl;
}

function buildConfirm() {
  const h = document.getElementById('s9-headline');
  if (h) h.textContent = `Your request is in${ST.firstName ? ', ' + ST.firstName : ''}.`;
}

// ── SELECTION HANDLERS ──
function selectGoal(id) {
  ST.goal = id;
  document.querySelectorAll('#goal-grid .card').forEach(el => {
    const s = el.dataset.id === id;
    el.classList.toggle('sel', s);
    el.querySelector('.chk').style.display = s ? 'flex' : 'none';
  });
  updateNextBtn();
  // Auto-advance: single-select, no reason to make people find a Next button
  autoAdvance(1);
}

function selectAgeBand(band, el) {
  ST.ageBand = band;
  document.querySelectorAll('#age-grid .card').forEach(c => {
    const s = c.dataset.id === band;
    c.classList.toggle('sel', s);
    c.querySelector('.chk').style.display = s ? 'flex' : 'none';
  });
  updateNextBtn();
  if (band === 'Over 65') {
    setTimeout(() => navigateTo('3b', 1), 320);
    return;
  }
  autoAdvance(3);
}

function selectProvider(id) {
  if (id === 'notsure') {
    // "I'm not sure" is exclusive
    ST.providers = ST.providers.includes('notsure') ? [] : ['notsure'];
  } else {
    // Remove "I'm not sure" if a real provider is selected
    ST.providers = ST.providers.filter(x => x !== 'notsure');
    if (ST.providers.includes(id)) ST.providers = ST.providers.filter(x => x !== id);
    else ST.providers.push(id);
  }
  // Refresh tile UI
  const notsureEl = document.getElementById('prov-notsure');
  if (notsureEl) {
    const s = ST.providers.includes('notsure');
    notsureEl.classList.toggle('sel', s);
    const chk = notsureEl.querySelector('.chk');
    if (chk) chk.style.display = s ? 'flex' : 'none';
  }
  document.querySelectorAll('.prov-tile').forEach(el => {
    const s = ST.providers.includes(el.dataset.id);
    el.classList.toggle('sel', s);
    el.querySelector('.chk').style.display = s ? 'flex' : 'none';
    const fb = el.querySelector('.prov-name-fb');
    if (fb) fb.style.color = s ? '#5B21B6' : (fb._origColor || (fb._origColor = fb.style.color));
  });
  updateNextBtn();
}

function toggleCover(id, el) {
  if (ST.coverTypes.includes(id)) ST.coverTypes = ST.coverTypes.filter(c => c !== id);
  else ST.coverTypes.push(id);
  const s = ST.coverTypes.includes(id);
  el.classList.toggle('sel', s);
  el.querySelector('.chk').style.display = s ? 'flex' : 'none';
  updateNextBtn();
}

function selectCallTime(v, el) {
  ST.callTime = v;
  document.querySelectorAll('#calltime-row .call-pill').forEach(b => {
    b.classList.toggle('sel', b.dataset.v === v);
  });
  updateNextBtn();
}

// ── PHONE VALIDATION ──
function handlePhone(input) {
  let digits = input.value.replace(/\D/g, '');
  let formatted = '';
  if (digits.startsWith('64')) digits = '0' + digits.slice(2);
  if (digits.length <= 3) formatted = digits;
  else if (digits.startsWith('02')) {
    if (digits.length <= 6) formatted = digits.slice(0,3)+' '+digits.slice(3);
    else formatted = digits.slice(0,3)+' '+digits.slice(3,6)+' '+digits.slice(6,10);
  } else {
    if (digits.length <= 5) formatted = digits.slice(0,2)+' '+digits.slice(2);
    else formatted = digits.slice(0,2)+' '+digits.slice(2,5)+' '+digits.slice(5,9);
  }
  input.value = formatted;
  const valid = isValidNZPhone(digits);
  ST.phone = valid ? formatted : '';
  const status = document.getElementById('phone-status');
  if (!status) return;
  if (digits.length === 0) { status.textContent=''; input.style.borderColor=''; }
  else if (valid) { status.textContent='✓'; status.style.color='#2E7D32'; input.style.borderColor='#2E7D32'; }
  else { status.textContent='NZ format: 021 000 0000'; status.style.color='#B05020'; input.style.borderColor=''; }
  updateNextBtn();
}

function isValidNZPhone(digits) {
  if (!digits) return false;
  if (/^02[0-9]{8}$/.test(digits)) return true;
  if (/^0[34679]\d{7}$/.test(digits)) return true;
  return false;
}

// ── SAVE LEAD (Netlify function) ──
const SAVE_LEAD_URL = 'https://fabulous-faloodeh-22f40b.netlify.app/.netlify/functions/save-lead';

// Turn stored ids ('aia','partners') into readable labels ('AIA','Partners Life')
// for the lead email. Falls back to the raw id if a lookup ever misses.
function labelsFor(ids, table, key) {
  return (ids || [])
    .map(id => {
      const hit = table.find(x => x.id === id);
      return hit ? hit[key] : id;
    })
    .join(', ');
}

async function saveLead(status) {
  const payload = {
    leadId: ST.leadId || undefined,
    status,
    firstName: ST.firstName,
    phone: ST.phone,
    ageBand: ST.ageBand,
    providers: ST.providers,
    coverTypes: ST.coverTypes,
    callTime: ST.callTime,
    email: ST.email,
    goal: ST.goal,
    userAgent: navigator.userAgent,
    referrer: document.referrer,
  };
  try {
    const res = await fetch(SAVE_LEAD_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.leadId) ST.leadId = data.leadId;
  } catch (err) {
    console.error('save-lead error:', err.message);
    // Non-fatal — funnel continues
  }

  // Email the full lead. Sent from the browser because FormSubmit rejects
  // server-side calls (403). Fire-and-forget so it can never block the funnel.
  if (status === 'complete-unverified' && !ST._emailSent) {
    ST._emailSent = true;
    const GOALS = {
      premiums: 'Lower premiums', review: 'Review cover levels',
      life_change: 'Big life change', dont_know: "Doesn't know current cover",
      new: 'New to insurance',
    };
    fetch('https://formsubmit.co/ajax/delovan.saleh@spireadvice.co.nz', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', Accept: 'application/json'},
      body: JSON.stringify({
        _subject: `CoverGap lead: ${ST.firstName || 'Unknown'} (${ST.ageBand || 'age ?'})`,
        _template: 'table',
        Name: ST.firstName || '',
        Mobile: ST.phone || '',
        Email: ST.email || '',
        Age: ST.ageBand || '',
        Goal: GOALS[ST.goal] || ST.goal || '',
        'Best time to call': ST.callTime || '',
        'Currently with': labelsFor(ST.providers, [...BANK_DATA, ...INSURER_DATA, {id:'notsure',name:"I'm not sure"}], 'name'),
        'Interested in': labelsFor(ST.coverTypes, COVER_DATA, 'title'),
        'Lead ID': ST.leadId || '',
      }),
    }).then(r => console.log('lead email:', r.status))
      .catch(e => console.error('lead email failed:', e.message));
  }
}

// ── SCREEN 2: PARTIAL LEAD SAVE + META PIXEL LEAD ──
async function savePartialAndNext() {
  if (!VALID[2]()) return;
  const btn = document.getElementById('btn-s2');
  const lbl = document.getElementById('s2-label');
  const spin = document.getElementById('s2-spin');
  btn.classList.remove('enabled');
  if (lbl) lbl.style.display = 'none';
  if (spin) spin.style.display = 'inline';

  await saveLead('partial');

  // Fire Meta pixel Lead event here — screen 2 is the primary conversion signal
  if (typeof fbq !== 'undefined') fbq('track', 'Lead');
  if (typeof fbq !== 'undefined') fbq('trackCustom', 'FunnelStep', {step: 2, next: 3});

  if (lbl) lbl.style.display = 'inline';
  if (spin) spin.style.display = 'none';
  btn.classList.add('enabled');

  navigateTo(3, 1);
}

// ── SCREEN 7: SUBMIT (saves complete-unverified, then shows SMS screen) ──
async function submitAndVerify() {
  const btn = document.getElementById('btn-s7');
  const lbl = document.getElementById('s7-submit-lbl');
  const spin = document.getElementById('s7-submit-spin');
  if (btn) btn.classList.remove('enabled');
  if (lbl) lbl.style.display = 'none';
  if (spin) spin.style.display = 'inline';

  await saveLead('complete-unverified');

  if (lbl) lbl.style.display = 'inline';
  if (spin) spin.style.display = 'none';
  if (btn) btn.classList.add('enabled');

  navigateTo(8, 1);
}

// ── SCREEN 8: OTP VERIFICATION ──
let _otpSent = false;
let _resendCount = 0;
const OTP_SEND_URL = 'https://fabulous-faloodeh-22f40b.netlify.app/.netlify/functions/send-otp';
const OTP_VERIFY_URL = 'https://fabulous-faloodeh-22f40b.netlify.app/.netlify/functions/verify-otp';

function otpInputChanged() {
  const err = document.getElementById('otp-error');
  if (err) { err.style.display='none'; err.textContent=''; }
}

async function sendOtp() {
  const btn = document.getElementById('btn-send-otp');
  const lbl = document.getElementById('send-otp-lbl');
  const spin = document.getElementById('send-otp-spin');
  if (btn) btn.classList.remove('enabled');
  if (lbl) lbl.style.display = 'none';
  if (spin) spin.style.display = 'inline';

  try {
    const res = await fetch(OTP_SEND_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({phone: ST.phone, leadId: ST.leadId}),
    });
    const data = await res.json();
    if (!res.ok || data.error) throw new Error(data.error || 'Failed to send');

    document.getElementById('otp-send-section').style.display = 'none';
    document.getElementById('otp-entry-section').style.display = 'block';
    const disp = document.getElementById('otp-phone-display');
    if (disp) disp.textContent = ST.phone;
    const inp = document.getElementById('otp-input');
    if (inp) inp.focus();
    _otpSent = true; _resendCount = 0;
  } catch (err) {
    if (lbl) lbl.style.display = 'inline';
    if (spin) spin.style.display = 'none';
    if (btn) btn.classList.add('enabled');
    showOtpError('Could not send code: ' + err.message);
  }
}

async function resendOtp() {
  _resendCount++;
  const countEl = document.getElementById('resend-count');
  const btn = document.getElementById('btn-resend');
  if (btn) btn.style.display = 'none';
  if (countEl) { countEl.style.display='inline'; countEl.textContent='Sending…'; }
  try {
    const res = await fetch(OTP_SEND_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({phone: ST.phone, leadId: ST.leadId}),
    });
    if (!res.ok) throw new Error();
    if (countEl) countEl.textContent = `Sent! (${_resendCount} resend${_resendCount>1?'s':''})`;
    if (btn) btn.style.display = 'inline';
  } catch {
    if (countEl) countEl.style.display = 'none';
    if (btn) btn.style.display = 'inline';
    showOtpError('Could not resend — please try again.');
  }
}

async function verifyOtp() {
  const code = (document.getElementById('otp-input')?.value || '').trim();
  if (code.length !== 6) { showOtpError('Please enter the full 6-digit code.'); return; }
  const verifyBtn = document.getElementById('btn-verify');
  const vLbl = document.getElementById('verify-label');
  const vSpin = document.getElementById('verify-spin');
  if (verifyBtn) verifyBtn.classList.remove('enabled');
  if (vLbl) vLbl.style.display = 'none';
  if (vSpin) vSpin.style.display = 'inline';
  try {
    const res = await fetch(OTP_VERIFY_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({phone: ST.phone, code, leadId: ST.leadId}),
    });
    const data = await res.json();
    if (!res.ok || data.error) throw new Error(data.error || 'Check failed');
    if (data.verified) {
      await saveLead('complete');
      navigateTo(9, 1);
    } else {
      if (verifyBtn) verifyBtn.classList.add('enabled');
      if (vLbl) vLbl.style.display = 'inline';
      if (vSpin) vSpin.style.display = 'none';
      showOtpError("That code doesn't match. Please check and try again.");
    }
  } catch (err) {
    if (verifyBtn) verifyBtn.classList.add('enabled');
    if (vLbl) vLbl.style.display = 'inline';
    if (vSpin) vSpin.style.display = 'none';
    showOtpError('Something went wrong verifying — see below for options.');
  }
}

function showOtpError(msg) {
  const el = document.getElementById('otp-error');
  if (el) { el.textContent=msg; el.style.display='block'; }
}

// "Leave it with us" — saves current state and goes to success without verified SMS
async function skipVerification() {
  await saveLead('complete-unverified');
  navigateTo(9, 1);
}

// ── QUICK CALLBACK (hero form) ──
async function quickSubmit() {
  const name = (document.getElementById('qc-name')?.value || '').trim();
  const phone = (document.getElementById('qc-phone')?.value || '').trim();
  const btn = document.getElementById('qc-btn');
  const msg = document.getElementById('qc-msg');
  if (!name || !phone) {
    if (msg) { msg.style.display='block'; msg.style.color='#C0401A'; msg.textContent='Please enter your name and phone number.'; }
    return;
  }
  if (btn) { btn.textContent='Sending…'; btn.disabled=true; btn.style.opacity='.7'; }
  if (msg) msg.style.display = 'none';
  try {
    // Save as a quick-callback lead directly
    ST.firstName = name.split(' ')[0];
    ST.phone = phone;
    ST.goal = 'quick-callback';
    await saveLead('partial');
    if (typeof fbq !== 'undefined') fbq('track', 'Lead');
    if (msg) { msg.style.display='block'; msg.style.color='#5B21B6'; msg.innerHTML='✓ <strong>Got it!</strong> We\'ll call you within 1 business day.'; }
    if (btn) btn.style.display = 'none';
    const ni = document.getElementById('qc-name');
    const pi = document.getElementById('qc-phone');
    if (ni) { ni.disabled=true; ni.style.opacity='.5'; }
    if (pi) { pi.disabled=true; pi.style.opacity='.5'; }
  } catch {
    if (btn) { btn.textContent='Call me →'; btn.disabled=false; btn.style.opacity='1'; }
    if (msg) { msg.style.display='block'; msg.style.color='#C0401A'; msg.textContent='Something went wrong — please try again.'; }
  }
}

function buildMarquee() {
  const MARQUEE_IDS = ['partners','aia','chubb','nib','fidelity','asteron','southerncross','resolution','momentum'];
  const items = MARQUEE_IDS.map(id => {
    const p = INSURER_DATA.find(x => x.id === id);
    if (!p) return '';
    const logoSrc = p.logoUrl || '';
    const faviconSrc = p.logoUrl ? '' : `https://www.google.com/s2/favicons?domain=${p.domain}&sz=64`;
    return `<span style="display:inline-flex;align-items:center;height:40px;padding:0 16px;gap:8px;border:1.5px solid #E5E7EB;border-radius:100px;background:#fff;white-space:nowrap;">
      <img src="${logoSrc}" data-deferred-src="${faviconSrc}" width="20" height="20" alt="" decoding="async"
        style="object-fit:contain;border-radius:2px;display:${logoSrc?'block':'none'}"
        onerror="this.style.display='none';this.nextElementSibling.style.display='inline-block'">
      <span style="width:8px;height:8px;border-radius:50%;background:${p.color};flex-shrink:0;display:${logoSrc?'none':'inline-block'}"></span>
      <span style="font-family:'DM Sans',sans-serif;font-weight:700;font-size:13px;color:#374151;letter-spacing:-.01em;">${p.name}</span>
    </span>`;
  }).join('');
  ['marquee-t1','marquee-t2'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = items;
  });
  window.addEventListener('load', function() {
    document.querySelectorAll('[data-deferred-src]').forEach(img => {
      const src = img.getAttribute('data-deferred-src');
      if (src) { img.src=src; img.style.display='block'; }
    });
  }, {once:true});
}

// ── INIT ──
buildMarquee();
render();
