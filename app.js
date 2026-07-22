document.getElementById('yr').textContent = new Date().getFullYear();

// ── STATE ──
const ST = {
  screen:0, dir:1,
  goal:null, providers:[], covers:[], whoFor:null,
  health:null, smoker:null, ageRange:null, gender:null, region:null,
  firstName:'', lastName:'', email:'', phone:'', callTime:'',
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
  {id:'aia',name:'AIA',color:'#D4002D',domain:'aia.com',logoH:36,logoUrl:"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii00NzEuOSAzOTkuNiAxNjkuNSAxODEuNCI+PHN0eWxlPi5zdDB7ZmlsbDolMjNENDAwM0I7fTwvc3R5bGU+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTQ1LjIzMjc2NCwtMTUzLjQ3MzI1KSI+PHBhdGggY2xhc3M9InN0MCIgZD0iTS0zMTQuNCw2NTguNmMtMi0zLjgtOC45LTAuOC0xMi40LTQuMWMtMS0wLjktMy0yLjctNC4xLTUuOWMtMS0zLTIuNS01LjQtNS03LjRjLTQuNS0zLjUtMTUuMS04LjktMTQuNC0xNmMwLjMtMy4yLDQuMi0zLjksNS44LTYuMmMxLTEuNCwxLjEtMy4yLDIuMi00LjVjMS4zLTEuNS0wLjUtMS41LTEuOC0xLjZjLTIuNy0wLjEtNC43LDIuOC02LjksNGMtMy42LDEuOS02LjksNC42LTExLDUuNWMtMS4yLDAuMy03LjMsMi4yLTMuMywzLjJjMi43LDAuNyw1LjgsMC41LDguMSwyLjVjMi45LDIuNSw1LjMsNS43LDguMiw4LjJjMS41LDEuMywyLjksMi41LDQuMSw0YzEuNCwxLjgsMS4yLDMuOSwyLjIsNS43YzEsMS44LDMsMC4yLDQuMiwxLjJjNCwzLjMtMS42LDQuOS0zLDYuNWMtMS45LDIuMS0yLjIsMy40LTUuNyw0LjhjLTEuNSwwLjYtMTEuNCwxLjgtMTIuNiwyLjdjLTEuMiwwLjktMC42LDEuMi0wLjMsMS42YzAuMywwLjQsMiwwLjksMi44LDFjNC4xLDAuNCwxNi45LDIuOCwxOS41LTAuNWMxLjgtMi4zLDQuNC0yLjUsNy40LTEuN2MyLjEsMC41LDYuMiwwLjEsOS43LTEuM0MtMzE4LjUsNjU5LjUtMzEyLjksNjU5LjUtMzE0LjQsNjU4LjYgTS0zMTYuOCw2NzQuNmMwLDAuMS0wLjIsMC4xLTAuNCwwLjNjLTAuMiwwLjEtMC40LDAuMi0wLjQsMC4yYy00LDIuMi02LDUuNi01LjYsMTEuMmMwLjYsNy43LDYuMiw0Ni44LDYuMiw0Ni44bDEwLjktMy41YzAsMC0xLTYuMy0yLjItMTQuMWMzLjctMS4xLDcuNC0yLjcsMTEuMS00LjdjMy42LTIsNi45LTQuNCw5LjgtNi45YzUuOSw1LjIsMTAuOCw5LjQsMTAuOCw5LjRsOC43LTcuNGMwLDAtMzAuMS0yNS42LTM2LjMtMzAuMUMtMzA4LjksNjcyLjUtMzEyLjgsNjcyLjQtMzE2LjgsNjc0LjYgTS0zMDIuMiw3MDJjLTIuOCwxLjYtNS4zLDIuNS03LjgsM2MtMS40LTguNi0yLjYtMTYuNC0yLjctMTcuM2MtMC4zLTIuMy0wLjItMy4yLDAuNy0zLjdjMC44LTAuNSwxLjctMC4xLDMuNCwxLjRjMC44LDAuNyw2LjcsNS44LDEzLjIsMTEuNkMtMjk3LjMsNjk4LjctMjk5LjQsNzAwLjQtMzAyLjIsNzAyIE0tMzQ4LDczNC41aDExLjJ2LTU1LjZILTM0OEwtMzQ4LDczNC41eiBNLTM2Ny40LDY3NS4xYzAsMC0wLjItMC4xLTAuNC0wLjNjLTAuMi0wLjEtMC40LTAuMi0wLjQtMC4zYzAsMC4xLDAsMC4xLDAsMC4xYy00LTIuMi03LjktMi4xLTEyLjQsMS4yYy02LjMsNC41LTM2LjQsMzAtMzYuNCwzMGw4LjcsNy40YzAsMCw0LjgtNC4yLDEwLjctOS4zYzIuOSwyLjYsNi4yLDQuOSw5LjgsNi45YzMuNiwyLDcuNCwzLjYsMTEuMSw0LjZjLTEuMyw3LjgtMi4zLDE0LjEtMi4zLDE0LjFsMTAuOCwzLjVjMCwwLDUuOC0zOS4xLDYuMy00Ni43Qy0zNjEuNSw2ODAuNy0zNjMuNSw2NzcuMy0zNjcuNCw2NzUuMSBNLTM3Mi4zLDY4Ny43Yy0wLjEsMC45LTEuNCw4LjctMi44LDE3LjNjLTIuNS0wLjYtNS0xLjUtNy44LTMuMWMtMi44LTEuNi00LjktMy4yLTYuNy01YzYuNi01LjcsMTIuNS0xMC45LDEzLjItMTEuNWMxLjgtMS41LDIuNi0xLjksMy41LTEuNEMtMzcyLjEsNjg0LjQtMzcyLDY4NS40LTM3Mi4zLDY4Ny43IE0tMzQyLDU1M2MtNDYuOCwwLTg0LjcsMzcuOS04NC43LDg0LjdjMCwxOS41LDYuNiwzNy40LDE3LjcsNTEuN2wyLjMtMS45Yy02LjItOC4zLTEwLjctMTcuOS0xMy4yLTI4LjNjMC43LDAuMiwxLjYsMC40LDMsMC44YzQuNywxLjUsMTMuNiw0LjQsMjAsMS41YzQuMS0xLjksMTEuMS0zLjUsMTMuOS00LjVjMi42LTEuMSw4LDEuMywxLjYtMi45aDBjLTAuMS0wLjEtMC4yLTAuMS0wLjMtMC4xYy0wLjItMC4xLTAuNC0wLjEtMC43LTAuMmMtMC42LTAuMS01LjgsMC45LTYuOSwwLjdjLTAuNC0wLjEtMC43LTAuMi0xLTAuNGMtMi44LTEuNSw5LjEtMTAuOCw5LjUtMTMuMWMtMy40LDAuNC02LjIsMi41LTkuMywzLjljLTMuNiwxLjYtNy41LDEuNi0xMS40LDEuN2MtNC40LDAtNy44LDMuNC0xMS43LDVjLTIsMC45LTUuMywxLjYtNy42LDMuMWMtMC4yLTEtMC4zLTEuOS0wLjQtMi45YzAuMS0xLjcsMC4yLTMuNywwLjctNmMwLjktNSwyLjktOC45LDcuNS0xNWMwLDAsNC40LTUuMyw3LTdjMS0wLjcsMi4xLTEuNywzLjItMWMxLjEsMC43LTAuMyw1LjEsMi43LDUuOGMxLjgsMC40LDAuMiwzLjQsMC44LDUuMmMwLjcsMS45LTcuNSw5LTUuNCw5LjljMS4yLDAuNSw2LjYtMi4zLDkuNS0zLjJjMi41LTAuOCw1LjItMC44LDgtMy41YzIuOS0yLjcsNS43LTQuMiw1LjctNC4yYzIuMy0yLDQuNi00LDYuOS01LjljMi4yLTIsNC40LTQsNi42LTZjMS40LTEuMyw3LjUtNC43LDgtNS45YzIuOS02LjIsMTAuMy05LjgsMTUuOS0xMy43YzEtMC43LDIuMS0yLjIsMi44LTMuMWMwLjYtMC45LDEuMy0yLjIsMS43LTIuNmMwLjctMC44LDAuOS0xLjQsMS43LTEuOGMwLjMtMC4yLDEuNi0wLjIsMi4xLDAuNWMxLjgsMS45LDQuMywzLjYsNC40LDUuNmMwLjIsMy4xLDguOSw1LjgsMTAuOSw4LjJjMC44LDEsMS4zLDIsMS42LDIuOWMtMS41LTAuNi0zLTEuMy00LjMtMi4zYy0wLjktMC43LTIuOS0wLjUtNC0wLjdjLTMtMC42LTIuMywwLjgtMC42LDIuNmMxLjcsMS44LDMuNywzLjMsNS4yLDUuM2MxLjgsMi4yLDEuNiw0LDIuMSw2LjdjMC41LDIuOCwyLjIsNS4zLDMuNiw3LjhjMS40LDIuNSwxLjMsNS4yLDIuMSw3LjljMC44LDIuNywzLjIsNSw1LjEsN2MxLjYsMS43LDUuMyw1LjksNy40LDVjMi4yLTAuOSw0LjgsMS43LDUuNiwxYzAuOC0wLjctMi4yLTQuMi0xLTUuMmMxLjEtMS4xLDYuMSwwLjYsNy4xLDMuOGMxLjIsMy43LDEsNCwwLjksNi43Yy0wLjEsMS44LTAuOCwzLjItMiw0LjRjLTEuNSwxLjUtNC45LDMuOS00LjIsNi40YzMuMS0xLjcsNi41LTEuOCwxMC0xLjdjMy40LDAuMSw1LjktMS4zLDguMS0zLjdjMS0xLjEsMy45LTQuNCw1LjUtMi43YzEsMS0xLjksNS4xLDEuMyw0LjNjMi4xLTAuNiw0LTIuMiw1LjktMy4zYzAuNS0wLjMsMS0wLjYsMS40LTAuOWMtMi41LDEwLjYtNy4yLDIwLjMtMTMuNSwyOC43bDIuMywxLjljMTEuMi0xNC40LDE4LTMyLjUsMTgtNTIuMUMtMjU3LjIsNTkxLTI5NS4yLDU1My0zNDIsNTUzIE0tMjY3LjQsNjM3LjljLTcuMSwxLjUtOS4zLTQuNy0xNS4yLTguNmMtNS45LTMuOS0xMS40LTUuNC0xNi45LTEwLjljLTIuMi0yLjItMi44LTYtNS04LjNjLTIuOS0zLjEtNC43LTQtOC43LTUuNWMtNy0yLjctMTMtNC43LTE4LjgtOS41Yy0xLTAuOC0zLjMtMS45LTUuNC0yLjNjLTAuOS0wLjItMS4zLTAuMS0xLjYsMC4zYy0wLjksMS4xLTEuNywyLjUtMi40LDMuN2MtMC4yLDAuMy0wLjksMS40LTEuNSwxLjljLTEuMSwxLTIuNSwyLjMtMy42LDIuOWMtNS44LDMuNi0xMy41LDYuNi0xNi44LDEyLjZjLTAuNiwxLjEtNyw0LjEtOC40LDUuMmMtMi4zLDEuOS00LjYsMy44LTcsNS41Yy0yLjIsMS43LTUuMyw0LjItNy42LDUuOWMtMS4yLTAuNS0yLjUtMC45LTMuNi0xLjFjLTIuNy0wLjYtNS0yLjctNy40LTQuMWMtMy0xLjktMi44LTIuMS0zLjctMi43Yy0wLjgtMC41LTEuMi0wLjctMS42LTAuOWMtMi4yLTEuMy0yLjQsMC01LjYsMmMtMi43LDEuNi01LjcsNC4zLTgsNi41Yy0xLjgsMS43LTMuNywzLjUtNS42LDUuNGMyLjctNDEuMSwzNy40LTczLjYsNzkuOS03My42YzQyLDAsNzYuNCwzMS45LDc5LjcsNzIuNEMtMjYzLjUsNjM2LjUtMjY1LjQsNjM3LjQtMjY3LjQsNjM3LjkiLz48L2c+PC9zdmc+"},
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

const WHOFOR_DATA = [
  {id:'just-me',title:'Just me',icon:'<svg width="52" height="52" viewBox="0 0 52 52" fill="none"><circle cx="26" cy="16" r="9" stroke="currentColor" stroke-width="2.5"/><path d="M10 48v-5a16 16 0 0 1 32 0v5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>'},
  {id:'partner',title:'Me & my partner',icon:'<svg width="52" height="52" viewBox="0 0 52 52" fill="none"><circle cx="17" cy="15" r="8" stroke="currentColor" stroke-width="2.5"/><path d="M3 46v-4a14 14 0 0 1 28 0v4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><circle cx="37" cy="15" r="8" stroke="currentColor" stroke-width="2.5" opacity="0.45"/><path d="M23 46v-4a14 14 0 0 1 28 0v4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.45"/></svg>'},
  {id:'family',title:'Me & my family',icon:'<svg width="52" height="52" viewBox="0 0 52 52" fill="none"><circle cx="17" cy="13" r="7.5" stroke="currentColor" stroke-width="2.5"/><path d="M3 44v-4a13 13 0 0 1 26 0v4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><circle cx="37" cy="13" r="7.5" stroke="currentColor" stroke-width="2.5" opacity="0.45"/><path d="M24 44v-4a13 13 0 0 1 26 0v4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.45"/><circle cx="39" cy="34" r="5" stroke="currentColor" stroke-width="2" opacity="0.7"/><line x1="39" y1="39" x2="39" y2="48" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.7"/></svg>'},
];

const HEALTH_DATA = [
  {id:'good',title:"I'm in good health",note:'No significant changes in the last five years'},
  {id:'minor',title:'Minor things — nothing serious',note:'e.g. managed blood pressure, asthma, minor injuries, or a broken bone'},
  {id:'significant',title:"I've had some significant health events",note:"That's completely fine — our adviser is experienced with all health situations"},
];

const SMOKER_DATA = [
  {id:'no',title:"No — I don't smoke or vape"},
  {id:'smoke',title:'Yes — I smoke cigarettes'},
  {id:'vape',title:'Yes — I vape or use nicotine products'},
  {id:'quit',title:"I've quit in the last 12 months"},
];

const AGE_DATA = ['Under 25','25–34','35–44','45–54','55–64','65+'];
const GENDER_DATA = ['Male','Female','Non-binary','Prefer not to say'];
const NI_REGIONS = ['Northland','Auckland','Waikato','Bay of Plenty','Gisborne',"Hawke's Bay",'Taranaki','Manawatū-Whanganui','Wellington'];
const SI_REGIONS = ['Top of South','West Coast','Canterbury','Otago','Southland'];
const GOAL_LABELS = {premiums:'Lower premiums',review:'Review cover',life_change:'Life change',dont_know:'Unsure about cover',new:'New to insurance'};

// ── ROUTING ──
const PATH_FULL  = [1,2,3,4,5,6,7,8,9,10];
const PATH_NEW   = [1,3,4,6,7,8,9,10];
const PATH_QUICK = [9,10];
const QUICK_MODE = new URLSearchParams(window.location.search).get('quick') === '1';
const getPath = () => QUICK_MODE ? PATH_QUICK : (ST.goal === 'new' ? PATH_NEW : PATH_FULL);
const stepOf = () => { const p=getPath(),i=p.indexOf(ST.screen); return `Step ${i+1} of ${p.length}`; };

// ── VALIDATION ──
const VALID = {
  1:()=>!!ST.goal,2:()=>ST.providers.length>0,3:()=>ST.covers.length>0,
  4:()=>!!ST.whoFor,5:()=>!!ST.health,6:()=>!!ST.smoker,
  7:()=>!!(ST.ageRange&&ST.gender),8:()=>!!ST.region,
  9:()=>QUICK_MODE ? !!(ST.firstName&&ST.phone&&ST.callTime) : !!(ST.firstName&&ST.lastName&&ST.email&&ST.phone&&ST.callTime),
  10:()=>true,
};

function updateNextBtn() {
  const ok = VALID[ST.screen] ? VALID[ST.screen]() : false;
  document.querySelectorAll('.btn-next').forEach(b=>{
    b.classList.toggle('enabled', ok);
  });
}

// ── NAV ──
function goNext() {
  if (!VALID[ST.screen]||!VALID[ST.screen]()) return;
  const s=ST.screen, isNew=ST.goal==='new';
  let next;
  if(s===1) next=isNew?3:2;
  else if(s===3) next=4;
  else if(s===4) next=isNew?6:5;
  else next=Math.min(10,s+1);
  navigateTo(next,1);
}

function goBack() {
  const s=ST.screen, isNew=ST.goal==='new';
  let prev;
  if(s===3) prev=isNew?1:2;
  else if(s===4) prev=3;
  else if(s===6) prev=isNew?4:5;
  else prev=Math.max(1,s-1);
  navigateTo(prev,-1);
}

function navigateTo(n,d) {
  ST.dir=d; ST.screen=n;
  render();
  window.scrollTo({top:0,behavior:'instant'});
}

// ── RENDER (split: screen-change vs selection-update) ──
let _builtScreen = null;

function render() {
  const changed = ST.screen !== _builtScreen;
  if (changed) {
    document.querySelectorAll('.screen').forEach(el=>el.classList.remove('active','slide-in-r','slide-in-l'));
    const sc = document.getElementById('s'+ST.screen);
    if(sc) sc.classList.add('active', ST.dir>=0?'slide-in-r':'slide-in-l');

    // Progress bars
    const p=getPath(), si=Math.max(0,p.indexOf(ST.screen));
    for(let i=1;i<=10;i++){
      const el=document.getElementById('prog'+i); if(!el) continue;
      el.innerHTML=p.map((_,j)=>{
        const cls=j<si?'pdot done':j===si?'pdot active':'pdot';
        return `<div class="${cls}"></div>`;
      }).join('')+`<span class="step-lbl">${stepOf()}</span>`;
    }

    buildScreen(ST.screen);
    _builtScreen = ST.screen;
  }
  updateNextBtn();
}

function buildScreen(n) {
  switch(n) {
    case 0: buildHero(); break;
    case 1: buildGoalGrid(); break;
    case 2: buildProvGrid(); buildGoalPill('pill-s2','pill-s2-text'); break;
    case 3: buildCoverGrid(); buildGoalPill('pill-s3','pill-s3-text'); break;
    case 4: buildWhoForGrid(); break;
    case 5: buildHealthGrid(); break;
    case 6: buildSmokerGrid(); break;
    case 7: buildAgeGrid(); buildGenderRow(); break;
    case 8: buildMapLegends(); break;
    case 9: buildCallTime(); buildS9Sub(); break;
    case 10: buildConfirm(); break;
  }
}

// ── SCREEN BUILDERS (run once on screen entry) ──
function mkChk(){return'<div class="chk">✓</div>';}

let _heroTimer = null;
let _heroTimers = [];
let _heroFirstLoad = true;
function buildHero() {
  // Cancel any running timers (back-nav replay safety)
  _heroTimers.forEach(clearTimeout);
  _heroTimers = [];
  clearTimeout(_heroTimer);

  const g = id => document.getElementById(id);

  // On first page load, content is already pre-rendered as static HTML.
  // Skip the reset+animation so the user sees content instantly.
  if (_heroFirstLoad) {
    _heroFirstLoad = false;
    // Re-attach CTA and quick-cb in case JS needs to wire them up
    const cta = g('s0-cta');
    if (cta) { cta.style.opacity = '1'; cta.style.transform = 'none'; }
    const qcb = g('quick-cb');
    if (qcb) { qcb.style.opacity = '1'; qcb.style.transform = 'translateY(0)'; }
    return;
  }

  // Back-navigation: reset and replay animation cleanly
  const h = g('s0-headline'), sub = g('s0-sub'), viz = g('s0-viz');
  const barCvr = g('s0-bar-cvr'), barGap = g('s0-bar-gap');
  const lblCvr = g('s0-lbl-cvr'), lblGap = g('s0-lbl-gap');
  if (!h) return;

  h.innerHTML = '';
  h.style.opacity = '0';
  h.style.animation = 'none';
  if (sub) { sub.style.opacity = '0'; sub.textContent = ''; }
  if (viz) viz.style.opacity = '0';
  if (barCvr) { barCvr.style.transition = 'none'; barCvr.style.width = '0'; }
  if (barGap) { barGap.style.transition = 'none'; barGap.style.width = '0'; }
  if (lblCvr) lblCvr.style.opacity = '0';
  if (lblGap) lblGap.style.opacity = '0';
  const prog = g('s0-progress'), progFill = g('s0-prog-fill');
  if (prog) prog.style.opacity = '0';
  if (progFill) { progFill.style.transition = 'none'; progFill.style.width = '0'; }

  const t = (fn, ms) => { const id = setTimeout(fn, ms); _heroTimers.push(id); };

  // 1. Headline fades up immediately
  t(() => {
    h.innerHTML = 'Are you actually <span style="color:#a78bfa">covered?</span>';
    h.style.animation = 'headlineIn .5s cubic-bezier(.16,1,.3,1) forwards';
    h.style.opacity = '1';
  }, 80);

  // 2. Coverage meter fades in
  t(() => { if (viz) viz.style.opacity = '1'; }, 400);

  // 3. Bar fills to 100% (looks fully covered)
  t(() => {
    if (barCvr) { barCvr.style.transition = 'width .8s cubic-bezier(0.25,1,0.5,1)'; barCvr.style.width = '100%'; }
  }, 500);

  // 4. Bar drains to 58%, gap fills in red
  t(() => {
    if (barCvr) { barCvr.style.transition = 'width .7s cubic-bezier(0.4,0,0.2,1)'; barCvr.style.width = '58%'; }
    if (barGap) { barGap.style.transition = 'width .7s cubic-bezier(0.25,1,0.5,1)'; barGap.style.width = '42%'; }
  }, 1400);

  // 5. Labels appear
  t(() => {
    if (lblCvr) lblCvr.style.opacity = '1';
    if (lblGap) lblGap.style.opacity = '1';
  }, 2100);

  // 6. Subtitle
  t(() => {
    if (sub) {
      sub.textContent = 'Most NZ policies leave a gap. Find out where yours is.';
      sub.style.opacity = '1';
    }
  }, 2300);

  // 7. Reveal CTA button + scroll hint
  t(() => {
    const cta = g('s0-cta');
    const hint = g('s0-scroll-hint');
    if (cta) { cta.style.opacity = '1'; cta.style.transform = 'translateY(0)'; }
    if (hint) hint.style.opacity = '1';
  }, 2500);

  // 8. Reveal quick callback form
  t(() => {
    const qcb = g('quick-cb');
    if (qcb) { qcb.style.opacity = '1'; qcb.style.transform = 'translateY(0)'; }
  }, 2800);
}

function resetFunnel() {
  if(ST.screen===0) return;
  ST.goal=null; ST.providers=[]; ST.covers=[]; ST.whoFor=null;
  ST.health=null; ST.smoker=null; ST.ageRange=null; ST.gender=null; ST.region=null;
  navigateTo(1,-1);
  window.scrollTo({top:0,behavior:'instant'});
}

function startFunnel() {
  _heroTimers.forEach(clearTimeout);
  window.scrollTo({top:0,behavior:'instant'});
  const s0el = document.getElementById('s0');
  const wash = document.getElementById('hero-wash');
  if (!s0el || !wash) return;
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  s0el.classList.add('hero-exiting');
  const firstScreen = QUICK_MODE ? 9 : 1;
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

function buildGoalGrid(){
  const g=document.getElementById('goal-grid'); if(!g) return;
  g.innerHTML=GOAL_DATA.map((card,i)=>{
    const sel=ST.goal===card.id;
    const span=card.span===2?'grid-column:span 2':'';
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

function buildMarquee(){
  const MARQUEE_IDS=['partners','aia','chubb','nib','fidelity','asteron','southerncross','resolution','momentum'];
  const items=MARQUEE_IDS.map(id=>{
    const p=INSURER_DATA.find(x=>x.id===id);
    if(!p) return '';
    return `<span style="display:inline-flex;align-items:center;height:40px;padding:0 18px;gap:8px;border:1.5px solid #E5E7EB;border-radius:100px;background:#fff;white-space:nowrap;"><span style="width:10px;height:10px;border-radius:50%;background:${p.color};flex-shrink:0;display:inline-block;"></span><span style="font-family:'DM Sans',sans-serif;font-weight:700;font-size:13px;color:#374151;letter-spacing:-.01em;">${p.name}</span></span>`;
  }).join('');
  ['marquee-t1','marquee-t2'].forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.innerHTML=items;
  });
}

function buildProvGrid(){
  const bankEl=document.getElementById('bank-grid');
  const insEl=document.getElementById('insurer-grid');
  if(!bankEl||!insEl) return;

  const makeTile=(p,i)=>{
    const sel=ST.providers.includes(p.id);
    const sz = p.logoH ? `max-height:${p.logoH}px;max-width:${p.logoH*2}px` : '';
    const src=p.logoUrl||`https://www.google.com/s2/favicons?domain=${p.domain}&sz=128`;
    const lbl=`<img class="prov-logo" src="${src}" loading="lazy"
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

  bankEl.innerHTML=BANK_DATA.map((p,i)=>makeTile(p,i)).join('');
  insEl.innerHTML=INSURER_DATA.map((p,i)=>makeTile(p,i+7)).join('');
  refreshProvSel();
}

function buildCoverGrid(){
  const g=document.getElementById('cover-grid'); if(!g) return;
  const t=document.getElementById('s3-title');
  if(t) t.textContent=ST.goal==='new'?'What would you like to explore?':'What cover do you currently hold?';
  g.innerHTML=COVER_DATA.map((card,i)=>{
    const sel=ST.covers.includes(card.id);
    return `<div class="card card-cover${sel?' sel':''}" data-id="${card.id}"
      onclick="toggleCover('${card.id}',this)"
      style="animation:bigPop .45s cubic-bezier(.22,.61,.36,1) ${.1+i*.06}s both">
      ${mkChk()}
      <div class="card-icon">${card.icon}</div>
      <div class="card-title">${card.title}</div>
      <div class="card-desc">${card.desc}</div>
    </div>`;
  }).join('');
  buildGoalPill('pill-s3','pill-s3-text');
}

function buildWhoForGrid(){
  const g=document.getElementById('whofor-grid'); if(!g) return;
  g.innerHTML=WHOFOR_DATA.map((card,i)=>{
    const sel=ST.whoFor===card.id;
    return `<div class="card card-who${sel?' sel':''}" data-id="${card.id}"
      onclick="selectWhoFor('${card.id}',this)"
      style="animation:bigPop .45s cubic-bezier(.22,.61,.36,1) ${.14+i*.1}s both">
      ${mkChk()}
      <div class="card-icon">${card.icon}</div>
      <div class="card-title" style="font-size:16px">${card.title}</div>
    </div>`;
  }).join('');
}

function buildHealthGrid(){
  const g=document.getElementById('health-grid'); if(!g) return;
  g.innerHTML=HEALTH_DATA.map((card,i)=>{
    const sel=ST.health===card.id;
    return `<div class="card card-health${sel?' sel':''}" data-id="${card.id}"
      onclick="selectHealth('${card.id}',this)"
      style="animation:cardIn .38s ease ${.14+i*.1}s both">
      ${mkChk()}
      <div class="card-health-title">${card.title}</div>
      <div class="card-health-note">${card.note}</div>
    </div>`;
  }).join('');
}

function buildSmokerGrid(){
  const g=document.getElementById('smoker-grid'); if(!g) return;
  g.innerHTML=SMOKER_DATA.map((opt,i)=>{
    const sel=ST.smoker===opt.id;
    return `<div class="card card-single${sel?' sel':''}" data-id="${opt.id}"
      onclick="selectSmoker('${opt.id}',this)"
      style="animation:cardIn .36s ease ${.14+i*.08}s both">
      ${mkChk()}
      <span class="card-single-title">${opt.title}</span>
    </div>`;
  }).join('');
}

function buildAgeGrid(){
  const g=document.getElementById('age-grid'); if(!g) return;
  g.innerHTML=AGE_DATA.map((r,i)=>{
    const sel=ST.ageRange===r;
    const re=r.replace(/[–—]/g,'\\u2013');
    return `<div class="card card-age${sel?' sel':''}" data-id="${r}"
      onclick="selectAge('${r}',this)"
      style="animation:bigPop .48s cubic-bezier(.22,.61,.36,1) ${.12+i*.07}s both">
      ${mkChk()}
      <span class="card-age-val">${r}</span>
    </div>`;
  }).join('');
}

function buildGenderRow(){
  const g=document.getElementById('gender-row'); if(!g) return;
  g.innerHTML=GENDER_DATA.map(gv=>{
    const sel=ST.gender===gv;
    return `<button class="pill-btn${sel?' sel':''}" data-v="${gv}"
      onclick="selectGender('${gv}',this)">${gv}</button>`;
  }).join('');
}

function buildMapLegends(){
  const ni=document.getElementById('ni-legend');
  const si=document.getElementById('si-legend');
  if(!ni||!si) return;
  ni.innerHTML=NI_REGIONS.map(r=>{
    const sel=ST.region===r;
    const safeR=r.replace(/'/g,"\\'");
    return `<div class="map-legend-item${sel?' sel':''}" data-r="${r}" onclick="selectRegion('${safeR}')">
      <div class="map-legend-dot"></div>${r}</div>`;
  }).join('');
  si.innerHTML=SI_REGIONS.map(r=>{
    const sel=ST.region===r;
    return `<div class="map-legend-item${sel?' sel':''}" data-r="${r}" onclick="selectRegion('${r}')">
      <div class="map-legend-dot"></div>${r}</div>`;
  }).join('');
  refreshMapSel();
}

function buildCallTime(){
  const g=document.getElementById('calltime-row'); if(!g) return;
  g.innerHTML=['Morning','Afternoon','Evening'].map(t=>{
    return `<button class="call-pill${ST.callTime===t?' sel':''}" data-v="${t}"
      onclick="selectCallTime('${t}',this)">${t}</button>`;
  }).join('');
}

function buildS9Sub(){
  const el=document.getElementById('s9-sub'); if(!el) return;
  if(QUICK_MODE){
    el.textContent="Leave your number and we'll call you back — free, no obligation.";
    // Hide last name + email rows in quick mode
    const lnameDiv=document.getElementById('f-lname')?.closest('div');
    const emailDiv=document.getElementById('f-email')?.closest('div');
    const twoColRows=document.querySelectorAll('#s9 .two-col');
    if(lnameDiv) lnameDiv.style.display='none';
    if(twoColRows[1]) twoColRows[1].style.display='none'; // hide email row
    return;
  }
  const all=[...BANK_DATA,...INSURER_DATA];
  const pName=ST.providers.map(id=>(all.find(p=>p.id===id)||{}).name).filter(Boolean).join(' & ');
  const map={
    premiums:`Let's find you a better premium${pName?' on your '+pName+' cover':''}.`,
    review:`Let's review your ${pName||'current'} cover levels.`,
    life_change:"Let's make sure your cover fits your new situation.",
    dont_know:"Let's help you understand exactly what you have.",
    new:"Let's find the right starting cover for you.",
  };
  el.textContent=map[ST.goal]||"Tell us a bit about yourself.";
}

function buildGoalPill(elId,textId){
  const el=document.getElementById(elId), txt=document.getElementById(textId);
  if(!el||!txt) return;
  const lbl=GOAL_LABELS[ST.goal]||'';
  el.className='goal-pill'+(lbl?' show':'');
  txt.textContent=lbl;
}

function buildConfirm(){
  const h=document.getElementById('s10-headline');
  if(h) h.textContent=`Your request is in${ST.firstName?', '+ST.firstName:''}.`;
}

// ── IN-PLACE SELECTION HANDLERS (no DOM rebuild) ──
function selectGoal(id){
  ST.goal=id;
  document.querySelectorAll('#goal-grid .card').forEach(el=>{
    const s=el.dataset.id===id;
    el.classList.toggle('sel',s);
    el.querySelector('.chk').style.display=s?'flex':'none';
  });
  updateNextBtn();
}

function selectProvider(id){
  if(ST.providers.includes(id)) ST.providers=ST.providers.filter(x=>x!==id);
  else ST.providers.push(id);
  document.querySelectorAll('.prov-tile').forEach(el=>{
    const s=ST.providers.includes(el.dataset.id);
    el.classList.toggle('sel',s);
    el.querySelector('.chk').style.display=s?'flex':'none';
    const fb=el.querySelector('.prov-name-fb');
    if(fb) fb.style.color=s?'#5B21B6':fb._origColor||(fb._origColor=fb.style.color);
  });
  const oth=document.getElementById('prov-other');
  if(oth){
    const s=ST.providers.includes('other');
    oth.classList.toggle('sel',s);
    const chk=oth.querySelector('.chk');
    if(chk) chk.style.display=s?'flex':'none';
  }
  updateNextBtn();
}

function refreshProvSel(){
  ST.providers.forEach(id=>selectProvider(id));
}

function toggleCover(id,el){
  if(ST.covers.includes(id)) ST.covers=ST.covers.filter(c=>c!==id);
  else ST.covers.push(id);
  const s=ST.covers.includes(id);
  el.classList.toggle('sel',s);
  el.querySelector('.chk').style.display=s?'flex':'none';
  updateNextBtn();
}

function selectWhoFor(id,el){
  ST.whoFor=id;
  document.querySelectorAll('#whofor-grid .card').forEach(c=>{
    const s=c.dataset.id===id;
    c.classList.toggle('sel',s);
    c.querySelector('.chk').style.display=s?'flex':'none';
  });
  updateNextBtn();
}

function selectHealth(id,el){
  ST.health=id;
  document.querySelectorAll('#health-grid .card').forEach(c=>{
    const s=c.dataset.id===id;
    c.classList.toggle('sel',s);
    c.querySelector('.chk').style.display=s?'flex':'none';
  });
  updateNextBtn();
}

function selectSmoker(id,el){
  ST.smoker=id;
  document.querySelectorAll('#smoker-grid .card').forEach(c=>{
    const s=c.dataset.id===id;
    c.classList.toggle('sel',s);
    c.querySelector('.chk').style.display=s?'flex':'none';
  });
  updateNextBtn();
}

function selectAge(id,el){
  ST.ageRange=id;
  document.querySelectorAll('#age-grid .card').forEach(c=>{
    const s=c.dataset.id===id;
    c.classList.toggle('sel',s);
    c.querySelector('.chk').style.display=s?'flex':'none';
  });
  updateNextBtn();
}

function selectGender(v,el){
  ST.gender=v;
  document.querySelectorAll('#gender-row .pill-btn').forEach(b=>{
    b.classList.toggle('sel',b.dataset.v===v);
  });
  updateNextBtn();
}

function selectRegion(r){
  ST.region=r;
  // Update SVG polygons
  document.querySelectorAll('#nz-map .region').forEach(el=>{
    el.classList.toggle('sel',el.dataset.r===r);
  });
  // Update legend items
  document.querySelectorAll('.map-legend-item').forEach(el=>{
    el.classList.toggle('sel',el.dataset.r===r);
    const dot=el.querySelector('.map-legend-dot');
    if(dot) dot.style.background=el.dataset.r===r?'#5B21B6':'#DDD6FE';
  });
  // Show selected display
  const disp=document.getElementById('sel-region-display');
  if(disp){ disp.textContent='📍 '+r; disp.className='selected-region-display show'; }
  updateNextBtn();
}

function refreshMapSel(){
  if(ST.region) selectRegion(ST.region);
}

function selectCallTime(v,el){
  ST.callTime=v;
  document.querySelectorAll('#calltime-row .call-pill').forEach(b=>{
    b.classList.toggle('sel',b.dataset.v===v);
  });
  updateNextBtn();
}

// ── PHONE VALIDATION ──
function handlePhone(input) {
  // Strip everything except digits
  let digits = input.value.replace(/\D/g,'');

  // Auto-format NZ numbers as they type
  let formatted = '';
  if(digits.startsWith('64')) digits = '0' + digits.slice(2); // handle +64
  if(digits.length <= 3) formatted = digits;
  else if(digits.startsWith('02')) {
    // Mobile: 02x xxx xxxx or 02xx xxx xxxx (Spark 021/022/027/028/029)
    if(digits.length <= 6) formatted = digits.slice(0,3)+' '+digits.slice(3);
    else formatted = digits.slice(0,3)+' '+digits.slice(3,6)+' '+digits.slice(6,10);
  } else {
    // Landline: 0x xxx xxxx
    if(digits.length <= 5) formatted = digits.slice(0,2)+' '+digits.slice(2);
    else formatted = digits.slice(0,2)+' '+digits.slice(2,5)+' '+digits.slice(5,9);
  }
  input.value = formatted;

  // Validate
  const valid = isValidNZPhone(digits);
  ST.phone = valid ? formatted : '';
  const status = document.getElementById('phone-status');
  if(!status) return;
  if(digits.length === 0){ status.textContent=''; input.style.borderColor=''; }
  else if(valid){ status.textContent='✓ valid NZ number'; status.style.color='#2E7D32'; input.style.borderColor='#2E7D32'; }
  else { status.textContent='NZ format: 021 000 0000'; status.style.color='#B05020'; input.style.borderColor=''; }
  updateNextBtn();
}

function isValidNZPhone(digits) {
  if(!digits) return false;
  // Mobile: 021/022/024/025/026/027/028/029 — 10 digits
  if(/^02[0-9]{8}$/.test(digits)) return true;
  // Landline: 03/04/06/07/09 — 9 digits
  if(/^0[34679]\d{7}$/.test(digits)) return true;
  return false;
}

// ── OTP VERIFICATION ──
let _otpSent = false;
let _resendCount = 0;

function otpInputChanged(){
  const err = document.getElementById('otp-error');
  if(err) { err.style.display='none'; err.textContent=''; }
}

async function sendOtp(){
  if(!VALID[9]()) return;
  const btn=document.getElementById('btn-s9');
  document.getElementById('s9-label').style.display='none';
  document.getElementById('s9-spin').style.display='inline';
  btn.classList.add('loading');

  try{
    const res = await fetch('https://fabulous-faloodeh-22f40b.netlify.app/.netlify/functions/send-otp',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({ phone: ST.phone }),
    });
    const data = await res.json();
    if(!res.ok || data.error) throw new Error(data.error||'Failed to send');

    // Show OTP entry, hide send button
    btn.style.display='none';
    document.getElementById('otp-section').style.display='block';
    document.getElementById('otp-phone-display').textContent = ST.phone;
    document.getElementById('otp-input').focus();
    _otpSent=true; _resendCount=0;
  }catch(err){
    btn.classList.remove('loading');
    document.getElementById('s9-label').style.display='inline';
    document.getElementById('s9-spin').style.display='none';
    alert('Could not send verification code: '+err.message);
  }
}

async function resendOtp(){
  _resendCount++;
  const countEl=document.getElementById('resend-count');
  const btn=document.getElementById('btn-resend');
  btn.style.display='none';
  if(countEl){ countEl.style.display='inline'; countEl.textContent='Sending…'; }

  try{
    const res = await fetch('https://fabulous-faloodeh-22f40b.netlify.app/.netlify/functions/send-otp',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({ phone: ST.phone }),
    });
    if(!res.ok) throw new Error();
    if(countEl) countEl.textContent=`Sent! (${_resendCount} resend${_resendCount>1?'s':''})`;
    btn.style.display='inline';
  }catch{
    if(countEl){ countEl.style.display='none'; }
    btn.style.display='inline';
    alert('Could not resend — please try again.');
  }
}

async function verifyOtp(){
  const code=(document.getElementById('otp-input').value||'').trim();
  if(code.length!==6){ showOtpError('Please enter the full 6-digit code.'); return; }

  const verifyBtn=document.getElementById('btn-verify');
  document.getElementById('verify-label').style.display='none';
  document.getElementById('verify-spin').style.display='inline';
  verifyBtn.classList.add('loading');

  try{
    const res = await fetch('https://fabulous-faloodeh-22f40b.netlify.app/.netlify/functions/verify-otp',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({ phone:ST.phone, code }),
    });
    const data = await res.json();
    if(!res.ok||data.error) throw new Error(data.error||'Verification failed');

    if(data.verified){
      await submitForm();
    } else {
      verifyBtn.classList.remove('loading');
      document.getElementById('verify-label').style.display='inline';
      document.getElementById('verify-spin').style.display='none';
      showOtpError('That code doesn\'t match. Please check and try again.');
    }
  }catch(err){
    verifyBtn.classList.remove('loading');
    document.getElementById('verify-label').style.display='inline';
    document.getElementById('verify-spin').style.display='none';
    showOtpError('Something went wrong — please try again.');
  }
}

function showOtpError(msg){
  const el=document.getElementById('otp-error');
  if(el){ el.textContent=msg; el.style.display='block'; }
}

// ── SUBMIT (called after OTP verified) ──
const ENDPOINT='https://formsubmit.co/ajax/delovan.saleh@spireadvice.co.nz';

async function submitForm(){
  const payload={
    goal:ST.goal, providers:ST.providers.join(', '), covers:ST.covers.join(', '),
    whoFor:ST.whoFor, health:ST.health, smoker:ST.smoker,
    ageRange:ST.ageRange, gender:ST.gender, region:ST.region,
    name:`${ST.firstName} ${ST.lastName}`, email:ST.email,
    phone:ST.phone, phoneVerified:'yes',
    callTime:ST.callTime, source:'covergap.co.nz',
    submittedAt:new Date().toISOString(),
    _subject:`New cover review — ${ST.firstName} ${ST.lastName} (${ST.region})`,
  };

  try{
    const res=await fetch(ENDPOINT,{
      method:'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json'},
      body:JSON.stringify(payload),
    });
    if(res.ok){ fbq('track', 'Lead'); navigateTo(10,1); }
    else throw new Error();
  }catch{
    alert('Your number was verified but we couldn\'t save your details — please try again.');
  }
}

// ── QUICK CALLBACK ──
async function quickSubmit(){
  const name=(document.getElementById('qc-name').value||'').trim();
  const phone=(document.getElementById('qc-phone').value||'').trim();
  const btn=document.getElementById('qc-btn');
  const msg=document.getElementById('qc-msg');
  if(!name||!phone){
    if(msg){msg.style.display='block';msg.style.color='#C0401A';msg.textContent='Please enter your name and phone number.';}
    return;
  }
  if(btn){btn.textContent='Sending…';btn.disabled=true;btn.style.opacity='.7';}
  if(msg){msg.style.display='none';}
  try{
    const res=await fetch('https://formsubmit.co/ajax/delovan.saleh@spireadvice.co.nz',{
      method:'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json'},
      body:JSON.stringify({
        _subject:'🔔 New call-back request — CoverGap',
        name,phone,
        source:'hero-quick-form',
        submittedAt:new Date().toISOString()
      })
    });
    if(res.ok){
      if(typeof fbq!=='undefined') fbq('track','Lead');
      if(msg){msg.style.display='block';msg.style.color='#5B21B6';msg.innerHTML='✓ <strong>Got it!</strong> We\'ll call you within 1 business day.';}
      if(btn) btn.style.display='none';
      const ni=document.getElementById('qc-name');
      const pi=document.getElementById('qc-phone');
      if(ni){ni.disabled=true;ni.style.opacity='.5';}
      if(pi){pi.disabled=true;pi.style.opacity='.5';}
    }else{throw new Error();}
  }catch{
    if(btn){btn.textContent='Call me →';btn.disabled=false;btn.style.opacity='1';}
    if(msg){msg.style.display='block';msg.style.color='#C0401A';msg.textContent='Something went wrong — please try again.';}
  }
}

// ── INIT ──
buildMarquee();
render();
