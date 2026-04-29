/* ── STATE ─────────────────────────────────────────────────── */
var state = {
  page: 'landing',
  role: 'requester',
  authMode: 'signup',
  selectedRole: null,
  matchSelected: null,
  createStep: 0,
  createCategory: null,
  createBudget: 50,
  createDesc: '',
  searching: true,
  sessionTimer: 0,
  sessionInterval: null,
  chatMessages: [
    {role:'recv', text:'Hi! I\'m on my way. ETA is about 8 minutes. 👋', time:'3:02 PM'},
    {role:'sent', text:'Great! I\'m near the main entrance by the coffee shop ☕', time:'3:03 PM'},
    {role:'recv', text:'Perfect, I can see the coffee shop. I\'ll look for you there!', time:'3:04 PM'},
    {role:'sent', text:'I\'m wearing a blue jacket. See you soon!', time:'3:04 PM'},
    {role:'recv', text:'Got it! Almost there 😊', time:'3:06 PM'},
  ],
  helperOnline: true,
  ratingGiven: 0,
  reviewSent: false,
  sosActive: false,
};

/* ── DATA ──────────────────────────────────────────────────── */
var helpers = [
  {id:1,name:'Sara Al-Hamed',rating:4.9,reviews:127,skills:['Shopping','Companionship'],price:45,distance:'1.2 km',verified:true,online:true,bio:'Experienced companion & personal shopper. Fluent in Arabic/English.',sessions:340,initials:'SA',color:'linear-gradient(135deg,#4F86C6,#3B99FC)'},
  {id:2,name:'Omar Khalid',rating:4.8,reviews:89,skills:['Moving Help','Heavy Lifting'],price:60,distance:'2.5 km',verified:true,online:true,bio:'Strong, reliable mover. Has helped 200+ families.',sessions:212,initials:'OK',color:'linear-gradient(135deg,#38C990,#0BC4A3)'},
  {id:3,name:'Lina Nasser',rating:5.0,reviews:44,skills:['Navigation','City Guide'],price:40,distance:'0.8 km',verified:true,online:false,bio:'Local expert. Perfect for newcomers to the city.',sessions:98,initials:'LN',color:'linear-gradient(135deg,#9B6ACF,#b48fe0)'},
  {id:4,name:'Tariq Mansour',rating:4.7,reviews:163,skills:['Emotional Support','Listening'],price:35,distance:'3.1 km',verified:true,online:true,bio:'Certified counselor companion. Creates safe spaces.',sessions:450,initials:'TM',color:'linear-gradient(135deg,#E07B54,#f0a88a)'},
  {id:5,name:'Nour Ibrahim',rating:4.9,reviews:71,skills:['Skilled Assistance','Tech Help'],price:55,distance:'1.9 km',verified:true,online:true,bio:'Multi-skilled assistant. Expert in tech support & errands.',sessions:178,initials:'NI',color:'linear-gradient(135deg,#4F86C6,#6ba3d6)'},
];

var categories = [
  {id:'shopping',icon:'🛍️',label:'Shopping Companion',desc:'Someone to join you while shopping'},
  {id:'moving',  icon:'📦',label:'Moving Help',        desc:'Assist with furniture & heavy items'},
  {id:'nav',     icon:'🗺️',label:'City Navigation',    desc:'Guide you around a new area'},
  {id:'emotional',icon:'💙',label:'Emotional Support', desc:'Compassionate presence for tough moments'},
  {id:'skilled', icon:'🔧',label:'Skilled Assistance', desc:'Specific skills like tech, admin, errands'},
  {id:'medical', icon:'🏥',label:'Medical Companion',   desc:'Accompany to clinics & appointments'},
];

var mockRequests = [
  {id:1,category:'Shopping Companion',icon:'🛍️',status:'active',   helper:'Sara Al-Hamed',time:'Today, 3:00 PM', price:45, location:'Al Nuzha Mall'},
  {id:2,category:'Moving Help',       icon:'📦',status:'completed', helper:'Omar Khalid',  time:'Apr 20, 10AM',  price:120,location:'Riyadh, Block 7'},
  {id:3,category:'City Navigation',   icon:'🗺️',status:'completed', helper:'Lina Nasser',  time:'Apr 15, 2:30PM',price:40, location:'Downtown'},
];

var useCases = [
  {icon:'🛍️',tag:'Emotional Support',   desc:'Fatima needed confidence while shopping for her wedding. Sara accompanied her, helped with decisions, and carried bags — turning stress into joy.'},
  {icon:'📦',tag:'Physical Assistance', desc:'Ahmed was moving alone after his flatmate left. Omar arrived in 30 min, helped pack and move 12 boxes, and stayed 2 hours.'},
  {icon:'🗺️',tag:'Navigation',          desc:'Rami just arrived from abroad and felt lost. Lina spent 3 hours walking him through the city, introducing him to the neighborhood.'},
  {icon:'💙',tag:'Companionship',        desc:'Before her hospital appointment, Nadia was anxious. Tariq sat with her in the waiting room and walked her through the process.'},
];

var requesterNav = [
  {key:'dashboard',  icon:'🏠',label:'Dashboard'},
  {key:'request',    icon:'➕',label:'New Request'},
  {key:'my-requests',icon:'📋',label:'My Requests'},
  {key:'matching',   icon:'🔍',label:'Find Helpers'},
  {key:'session',    icon:'⚡',label:'Live Session'},
  {key:'profile',    icon:'👤',label:'Profile'},
  {key:'safety',     icon:'🛡️',label:'Trust & Safety'},
];
var helperNav = [
  {key:'helper-dashboard', icon:'🏠',label:'Dashboard'},
  {key:'helper-requests',  icon:'📋',label:'Available Jobs'},
  {key:'session',          icon:'⚡',label:'Active Session'},
  {key:'earnings',         icon:'💰',label:'Earnings'},
  {key:'profile',          icon:'👤',label:'Profile'},
  {key:'safety',           icon:'🛡️',label:'Trust & Safety'},
];

/* ── NAVIGATION ────────────────────────────────────────────── */
function showPage(page, sub){
  document.querySelectorAll('.page').forEach(function(p){ p.classList.remove('active'); });
  if(page === 'landing'){
    document.getElementById('page-landing').classList.add('active');
    state.page = 'landing';
  } else if(page === 'auth'){
    document.getElementById('page-auth').classList.add('active');
    state.authMode = sub || 'signup';
    renderAuth();
    state.page = 'auth';
  } else if(page === 'app' || page === 'dashboard' || page === 'request' ||
            page === 'my-requests' || page === 'matching' || page === 'session' ||
            page === 'helper-dashboard' || page === 'helper-requests' ||
            page === 'earnings' || page === 'profile' || page === 'safety'){
    document.getElementById('page-app').classList.add('active');
    var pg = page === 'app' ? 'dashboard' : page;
    state.page = pg;
    renderAppShell();
    renderPage(pg);
  }
}

function navTo(page){
  if(page === 'landing'){
    showPage('landing');
    return;
  }
  showPage('app', page);
  // update sidebar active
  document.querySelectorAll('.sb-item').forEach(function(el){
    el.classList.toggle('active', el.dataset.key === page);
  });
  renderPage(page);
}

/* ── AUTH ──────────────────────────────────────────────────── */
function renderAuth(){
  var s0 = document.getElementById('authStep0');
  var s1 = document.getElementById('authStep1');
  var s2 = document.getElementById('authStep2');
  var sub = document.getElementById('authSubtitle');
  s0.style.display='none'; s1.style.display='none'; s2.style.display='none';
  if(state.authMode === 'signup'){
    sub.textContent = 'Create your account';
    s0.style.display = 'block';
  } else {
    sub.textContent = 'Welcome back';
    s2.style.display = 'block';
  }
}
function pickRole(role){
  state.selectedRole = role;
  document.getElementById('roleReq').classList.toggle('selected', role==='requester');
  document.getElementById('roleHelp').classList.toggle('selected', role==='helper');
  setTimeout(function(){
    document.getElementById('authStep0').style.display='none';
    document.getElementById('authStep1').style.display='block';
  }, 200);
}
function authGoBack(){
  document.getElementById('authStep1').style.display='none';
  document.getElementById('authStep0').style.display='block';
}
function doRegister(){
  loginAs(state.selectedRole || 'requester');
}
function loginAs(role){
  state.role = role;
  if(role==='helper'){
    showPage('app','helper-dashboard');
  } else {
    showPage('app','dashboard');
  }
}

/* ── APP SHELL ─────────────────────────────────────────────── */
function renderAppShell(){
  // Nav avatar
  if(state.role === 'helper'){
    document.getElementById('navAvatar').textContent = 'OK';
    document.getElementById('navAvatar').style.background = 'linear-gradient(135deg,#38C990,#0BC4A3)';
    document.getElementById('navAvatar').innerHTML = 'OK<div class="verified-ring">✓</div>';
    document.getElementById('navName').textContent = 'Omar Khalid';
    document.getElementById('navRole').textContent = 'Helper';
  } else {
    document.getElementById('navAvatar').innerHTML = 'NA<div class="verified-ring">✓</div>';
    document.getElementById('navAvatar').style.background = 'linear-gradient(135deg,#9B6ACF,#b48fe0)';
    document.getElementById('navName').textContent = 'Nadia Al-Mansour';
    document.getElementById('navRole').textContent = 'Requester';
  }
  // Sidebar chip
  var chip = document.getElementById('sidebarChip');
  chip.className = 'role-chip ' + (state.role==='helper' ? 'role-helper' : 'role-requester');
  chip.textContent = state.role==='helper' ? '🤝 Helper Mode' : '👤 Requester Mode';
  // Sidebar items
  var items = state.role === 'helper' ? helperNav : requesterNav;
  var html = '';
  items.forEach(function(it){
    html += '<div class="sb-item' + (state.page===it.key?' active':'') + '" data-key="'+it.key+'" onclick="navTo(\''+it.key+'\')">' +
            '<span class="sb-icon">'+it.icon+'</span> '+it.label+'</div>';
  });
  document.getElementById('sidebarItems').innerHTML = html;
}

/* ── STAR HELPER ───────────────────────────────────────────── */
function starsHTML(rating, size){
  size = size || 13;
  var h = '<span class="stars">';
  for(var i=1;i<=5;i++){
    h += '<span class="star'+(i<=Math.round(rating)?' filled':'')+'">★</span>';
  }
  h += '<span style="font-size:'+(size-1)+'px;color:var(--g400);margin-left:3px">'+rating+'</span></span>';
  return h;
}
function avatarHTML(initials, color, size, verified, online){
  var cls = 'avatar' + (size==='lg'?' avatar-lg':size==='xl'?' avatar-xl':'');
  var extra = '';
  if(verified) extra += '<div class="v-ring">✓</div>';
  if(online===true) extra += '<div class="online-dot"></div>';
  return '<div class="'+cls+'" style="background:'+color+'">'+initials+extra+'</div>';
}

/* ── PAGE RENDERER ─────────────────────────────────────────── */
function renderPage(pg){
  var mc = document.getElementById('mainContent');
  // scroll top
  mc.scrollTop = 0;
  var html = '';

  if(pg==='dashboard') html = renderDashboard();
  else if(pg==='request') html = renderRequest();
  else if(pg==='matching') html = renderMatching();
  else if(pg==='session') html = renderSession();
  else if(pg==='my-requests') html = renderMyRequests();
  else if(pg==='helper-dashboard') html = renderHelperDashboard();
  else if(pg==='helper-requests') html = renderHelperRequests();
  else if(pg==='earnings') html = renderEarnings();
  else if(pg==='profile') html = renderProfile();
  else if(pg==='safety') html = renderSafety();

  mc.innerHTML = '<div class="fadeUp">'+html+'</div>';
  afterRender(pg);
}

/* ─────────────────────────────────────────────────────────── */
function renderDashboard(){
  var reqRows = '';
  mockRequests.forEach(function(r){
    reqRows += '<div class="card req-card flex gap-12 items-center card-hover" onclick="navTo(\''+( r.status==='active'?'session':'my-requests')+'\')">'+
      '<div class="req-cat-icon" style="background:'+(r.status==='active'?'rgba(26,111,212,.1)':'rgba(56,201,144,.1)')+'">'+r.icon+'</div>'+
      '<div class="flex-1"><div style="font-size:15px;font-weight:600;font-family:Sora,sans-serif;color:var(--navy)">'+r.category+'</div>'+
      '<div style="font-size:13px;color:var(--g400);margin-top:2px">with '+r.helper+' • '+r.time+'</div></div>'+
      '<div style="text-align:right"><span class="badge '+(r.status==='active'?'badge-blue':'badge-green')+'">'+( r.status==='active'?'● Active':'✓ Done')+'</span>'+
      '<div style="font-size:14px;font-weight:700;color:var(--navy);margin-top:4px">'+r.price+' SAR</div></div></div>';
  });

  var helperCards = '';
  helpers.slice(0,4).forEach(function(h){
    helperCards += '<div class="helper-card" onclick="navTo(\'matching\')">'+
      '<div class="flex gap-12 items-center mb-12">'+avatarHTML(h.initials,h.color,'','true',h.online)+
      '<div class="flex-1"><div style="font-size:14px;font-weight:700;font-family:Sora,sans-serif">'+h.name+'</div>'+starsHTML(h.rating)+
      '<div style="font-size:12px;color:var(--g400);margin-top:2px">'+h.distance+'</div></div>'+
      '<span class="chip '+(h.online?'chip-online':'chip-offline')+'">'+( h.online?'●':'○')+'</span></div>'+
      '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:12px">'+h.skills.map(function(s){return'<span class="badge badge-blue" style="font-size:11px">'+s+'</span>';}).join('')+'</div>'+
      '<div class="flex items-center justify-between"><span style="font-size:16px;font-weight:800;font-family:Sora,sans-serif">'+h.price+' SAR</span>'+
      '<button class="btn btn-primary btn-sm" onclick="event.stopPropagation();navTo(\'matching\')">Request</button></div></div>';
  });

  return '<div class="page-hdr"><h1 class="page-title">Good afternoon, Nadia 👋</h1><p class="page-subtitle">How can we help you today?</p></div>'+
    '<div class="stats-grid">'+
      stat('12','Sessions Done','✅','var(--teal)')+
      stat('540 SAR','Total Spent','💰','var(--blue)')+
      stat('3','Saved Helpers','❤️','#e05587')+
      stat('4.8','Avg Rating','⭐','var(--amber)')+
    '</div>'+
    '<div class="cta-banner" onclick="navTo(\'request\')">'+
      '<h2>Need help right now?</h2><p>Create a request and get matched in minutes.</p>'+
      '<button class="cta-banner-btn">+ New Request →</button></div>'+
    '<div class="section-hdr"><div class="section-title">Your Requests</div><button class="btn-ghost" onclick="navTo(\'my-requests\')">View All</button></div>'+
    reqRows+
    '<div class="section-hdr" style="margin-top:24px"><div class="section-title">Top Helpers Near You</div><button class="btn-ghost" onclick="navTo(\'matching\')">See All</button></div>'+
    '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px">'+helperCards+'</div>';
}

function stat(val,label,icon,color){
  return '<div class="stat-card"><div style="font-size:24px;margin-bottom:4px">'+icon+'</div>'+
         '<div class="stat-value" style="color:'+color+';font-size:24px">'+val+'</div>'+
         '<div class="stat-label">'+label+'</div></div>';
}

/* ─────────────────────────────────────────────────────────── */
function renderRequest(){
  var stepNames = ['Category','Location','Time & Budget','Confirm'];
  var s = state.createStep;
  var stepsHTML = '<div class="flex items-center gap-0 mb-28">';
  stepNames.forEach(function(n,i){
    var cls = i<s?'done':i===s?'active':'todo';
    stepsHTML += '<div class="step-dot '+cls+'">'+(i<s?'✓':i+1)+'</div>'+
      '<span style="font-size:12px;font-weight:600;color:'+(i===s?'var(--blue)':'var(--g400)')+';font-family:Sora,sans-serif;white-space:nowrap;margin:0 6px">'+n+'</span>';
    if(i<3) stepsHTML += '<div class="step-line'+(i<s?' done':'')+'"></div>';
  });
  stepsHTML += '</div>';

  var body = '';
  if(s===0){
    var cats = '';
    categories.forEach(function(cat){
      cats += '<div onclick="state.createCategory=\''+cat.id+'\';document.querySelectorAll(\'.cat-opt\').forEach(function(x){x.classList.remove(\'selected\')});this.classList.add(\'selected\')" '+
        'class="cat-opt" style="padding:16px;border-radius:16px;cursor:pointer;border:2px solid '+(state.createCategory===cat.id?'var(--blue)':'var(--g100)')+';background:'+(state.createCategory===cat.id?'rgba(26,111,212,.05)':'white')+';transition:all .2s">'+
        '<div style="font-size:22px;margin-bottom:8px">'+cat.icon+'</div>'+
        '<div style="font-size:13px;font-weight:700;font-family:Sora,sans-serif;margin-bottom:3px">'+cat.label+'</div>'+
        '<div style="font-size:11px;color:var(--g400);line-height:1.4">'+cat.desc+'</div></div>';
    });
    body = '<h3 style="font-size:17px;font-weight:700;font-family:Sora,sans-serif;margin-bottom:18px">What do you need help with?</h3>'+
           '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'+cats+'</div>';
  } else if(s===1){
    body = '<h3 style="font-size:17px;font-weight:700;font-family:Sora,sans-serif;margin-bottom:18px">Where do you need help?</h3>'+
      '<div class="map-mock" style="height:190px;margin-bottom:16px">'+
        '<div class="map-pin" style="top:40%;left:50%">📍</div>'+
        '<div class="map-pin" style="top:22%;left:33%;font-size:18px;animation-delay:.4s">📍</div>'+
        '<div class="map-label" style="bottom:12px;left:50%;transform:translateX(-50%)">📍 Al Nuzha Mall, Riyadh</div>'+
      '</div>'+
      '<div class="form-group"><label>Address / Location</label><input class="form-control" value="Al Nuzha Mall, Riyadh" placeholder="Search for a location..."/></div>'+
      '<div class="flex gap-8 fw-wrap">'+
        '<button class="tag" style="font-size:12px">📍 Use my location</button>'+
        '<button class="tag" style="font-size:12px">Al Nuzha Mall</button>'+
        '<button class="tag" style="font-size:12px">KAFD</button>'+
      '</div>';
  } else if(s===2){
    body = '<h3 style="font-size:17px;font-weight:700;font-family:Sora,sans-serif;margin-bottom:18px">When &amp; How much?</h3>'+
      '<div class="form-group"><label>When do you need help?</label>'+
      '<div class="flex gap-8 fw-wrap">'+
        '<button class="tag active" style="font-size:13px" onclick="setActiveTag(this)">Now</button>'+
        '<button class="tag" style="font-size:13px" onclick="setActiveTag(this)">In 1 hour</button>'+
        '<button class="tag" style="font-size:13px" onclick="setActiveTag(this)">Today afternoon</button>'+
        '<button class="tag" style="font-size:13px" onclick="setActiveTag(this)">Tomorrow</button>'+
      '</div></div>'+
      '<div class="form-group" style="margin-top:14px"><label>Your Budget: <strong style="color:var(--blue)" id="budgetVal">'+state.createBudget+' SAR</strong></label>'+
      '<input type="range" min="20" max="200" value="'+state.createBudget+'" id="budgetRange" oninput="state.createBudget=+this.value;document.getElementById(\'budgetVal\').textContent=this.value+\' SAR\'" style="width:100%;background:transparent;border:none;padding:8px 0;accent-color:var(--blue)"/>'+
      '<div class="flex justify-between" style="font-size:11px;color:var(--g400)"><span>20 SAR</span><span>200 SAR</span></div></div>'+
      '<div class="form-group"><label>Describe your need</label><textarea class="form-control" rows="3" placeholder="Tell helpers more about what you need...">'+state.createDesc+'</textarea></div>';
  } else if(s===3){
    var catLabel = (categories.find(function(c){return c.id===state.createCategory;})||{label:'Not selected'}).label;
    var rows = [['Category',catLabel],['Location','Al Nuzha Mall, Riyadh'],['Time','Now'],['Budget',state.createBudget+' SAR'],['Description',state.createDesc||'No description added']];
    var rowsHTML = rows.map(function(r){
      return '<div class="flex justify-between" style="padding:9px 0;border-bottom:1px solid var(--g50)">'+
        '<span style="font-size:13px;color:var(--g400);font-weight:500">'+r[0]+'</span>'+
        '<span style="font-size:13px;font-weight:600;color:var(--navy);text-align:right;max-width:60%">'+r[1]+'</span></div>';
    }).join('');
    body = '<h3 style="font-size:17px;font-weight:700;font-family:Sora,sans-serif;margin-bottom:18px">Confirm Your Request</h3>'+
      '<div style="background:var(--g50);border-radius:16px;padding:18px;margin-bottom:18px">'+rowsHTML+'</div>'+
      '<div class="trust-badge mb-16"><span>🔒</span><span style="font-size:13px;color:#1fa875;font-weight:500">Payment held safely until session is complete</span></div>';
  }

  var backBtn = s>0 ? '<button class="btn btn-secondary" onclick="state.createStep--;renderPage(\'request\')">← Back</button>' : '';
  var fwdLabel = s===3 ? '🚀 Find My Helper →' : 'Continue →';
  var fwdAction = s===3 ? 'navTo(\'matching\')' : 'state.createStep++;renderPage(\'request\')';

  return '<div style="max-width:640px;margin:0 auto">'+
    '<div class="page-hdr"><h1 class="page-title">Create a Request</h1><p class="page-subtitle">Tell us how we can help you</p></div>'+
    stepsHTML+
    '<div class="card p-28">'+body+
      '<div class="flex gap-12" style="margin-top:22px">'+backBtn+
      '<button class="btn btn-primary flex-1" onclick="'+fwdAction+'">'+fwdLabel+'</button></div>'+
    '</div></div>';
}

function setActiveTag(el){
  el.closest('.flex').querySelectorAll('.tag').forEach(function(t){t.classList.remove('active')});
  el.classList.add('active');
}

/* ─────────────────────────────────────────────────────────── */
function renderMatching(){
  if(state.searching){
    return '<div class="search-anim">'+
      '<div class="search-ring-wrap">'+
        '<div class="search-ring"></div>'+
        '<div class="search-inner">🔍</div>'+
      '</div>'+
      '<div style="text-align:center"><h2 style="font-size:22px;font-weight:700;font-family:Sora,sans-serif;color:var(--navy)">Finding your helpers...</h2>'+
      '<p style="color:var(--g400);margin-top:8px">Scanning verified helpers nearby</p></div>'+
      '<div class="search-dots">'+
        '<div class="search-dot"></div><div class="search-dot"></div><div class="search-dot"></div>'+
      '</div></div>';
  }

  var helperList = '';
  helpers.forEach(function(h){
    var sel = state.matchSelected===h.id;
    var extra = sel ? '<div style="margin-top:14px;padding-top:14px;border-top:1px solid var(--g100)">'+
      '<p style="font-size:13px;color:var(--g600);line-height:1.55;margin-bottom:12px">'+h.bio+'</p>'+
      '<button class="btn btn-primary btn-full" onclick="navTo(\'session\')">✓ Accept '+h.name.split(' ')[0]+'</button></div>' : '';
    helperList += '<div class="helper-card'+(sel?' selected':'')+'" onclick="state.matchSelected='+(state.matchSelected===h.id?'null':h.id)+';renderPage(\'matching\')">'+
      '<div class="flex gap-12" style="align-items:flex-start">'+
      avatarHTML(h.initials,h.color,'lg',h.verified,null)+
      '<div class="flex-1">'+
        '<div class="flex items-center gap-8 fw-wrap" style="margin-bottom:3px">'+
          '<span style="font-size:15px;font-weight:700;font-family:Sora,sans-serif;color:var(--navy)">'+h.name+'</span>'+
          '<span class="chip '+(h.online?'chip-online':'chip-offline')+'" style="font-size:11px">'+( h.online?'Online':'Offline')+'</span>'+
        '</div>'+starsHTML(h.rating)+
        '<div style="font-size:12px;color:var(--g400);margin-top:4px">'+h.distance+' away • '+h.sessions+' sessions</div>'+
        '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:8px">'+h.skills.map(function(s){return'<span class="badge badge-blue" style="font-size:11px">'+s+'</span>';}).join('')+'</div>'+
      '</div>'+
      '<div style="text-align:right;flex-shrink:0"><div style="font-size:18px;font-weight:800;font-family:Sora,sans-serif;color:var(--navy)">'+h.price+'</div><div style="font-size:11px;color:var(--g400)">SAR</div></div>'+
      '</div>'+extra+'</div>';
  });

  var detail = '';
  if(state.matchSelected){
    var h = helpers.find(function(x){return x.id===state.matchSelected;});
    detail = '<div class="card p-20">'+
      '<div class="flex gap-12 items-center mb-12">'+avatarHTML(h.initials,h.color,'lg',h.verified,null)+
      '<div><div style="font-size:16px;font-weight:700;font-family:Sora,sans-serif">'+h.name+'</div>'+starsHTML(h.rating)+'</div></div>'+
      '<p style="font-size:13px;color:var(--g600);line-height:1.6;margin-bottom:14px">'+h.bio+'</p>'+
      '<div class="flex gap-10 mb-16">'+
        miniStat(h.sessions,'Sessions')+miniStat(h.reviews,'Reviews')+miniStat(h.distance,'Away')+
      '</div>'+
      '<button class="btn btn-primary btn-full" onclick="navTo(\'session\')">Accept &amp; Start Session →</button>'+
    '</div>';
  } else {
    detail = '<div class="card p-24" style="text-align:center"><div style="font-size:32px;margin-bottom:8px">👆</div><p style="font-size:14px;color:var(--g400)">Select a helper to view their details</p></div>';
  }

  var mapPins = '';
  helpers.forEach(function(h,i){
    mapPins += '<div class="map-pin" style="top:'+(18+i*14)+'%;left:'+(18+i*15)+'%;font-size:'+(state.matchSelected===h.id?28:20)+'px;transition:font-size .2s">'+(h.online?'🟢':'⚫')+'</div>';
  });

  return '<div class="page-hdr"><h1 class="page-title">Available Helpers</h1><p class="page-subtitle">5 verified helpers found near you</p></div>'+
    '<div class="grid-2">'+
      '<div style="display:flex;flex-direction:column;gap:12px">'+helperList+'</div>'+
      '<div style="position:sticky;top:96px">'+
        '<div class="map-mock" style="height:260px;margin-bottom:14px">'+mapPins+
          '<div class="map-label" style="bottom:10px;left:50%;transform:translateX(-50%)">📍 Al Nuzha Mall, Riyadh</div>'+
        '</div>'+detail+
      '</div>'+
    '</div>';
}

function miniStat(v,l){
  return '<div style="flex:1;text-align:center;padding:11px;background:var(--g50);border-radius:11px">'+
    '<div style="font-size:17px;font-weight:800;color:var(--navy);font-family:Sora,sans-serif">'+v+'</div>'+
    '<div style="font-size:11px;color:var(--g400)">'+l+'</div></div>';
}

/* ─────────────────────────────────────────────────────────── */
function renderSession(){
  var msgs = '';
  state.chatMessages.forEach(function(m){
    msgs += '<div style="display:flex;flex-direction:column;align-items:'+(m.role==='sent'?'flex-end':'flex-start')+'">'+
      '<div class="chat-bubble '+m.role+'">'+m.text+'</div>'+
      '<span class="chat-time">'+m.time+'</span></div>';
  });

  var sosAlert = state.sosActive ? '<div style="background:rgba(229,62,62,.1);border:2px solid rgba(229,62,62,.28);border-radius:14px;padding:14px;animation:fadeIn .3s ease">'+
    '<div style="font-size:14px;font-weight:700;color:var(--red);margin-bottom:3px">🚨 SOS Activated</div>'+
    '<div style="font-size:13px;color:var(--g600)">Your location has been sent to emergency contacts and local authorities.</div></div>' : '';

  return '<div class="session-grid">'+
    '<div class="session-left">'+
      '<div class="card p-20">'+
        '<div class="flex items-center gap-12">'+
          '<div style="position:relative">'+avatarHTML('SA','linear-gradient(135deg,#4F86C6,#3B99FC)','lg',true,null)+'<div class="online-dot" style="position:absolute;bottom:0;right:0;width:13px;height:13px;border-radius:50%;background:var(--green);border:2.5px solid white"></div></div>'+
          '<div class="flex-1"><div style="font-size:16px;font-weight:700;font-family:Sora,sans-serif">Sara Al-Hamed</div>'+
          '<div style="font-size:13px;color:var(--g400)">Shopping Companion • En route</div></div>'+
          '<div style="text-align:right"><div class="timer-display" id="sessionTimer">00:30:47</div><div style="font-size:11px;color:var(--g400)">Session time</div></div>'+
        '</div>'+
        '<div class="progress-track" style="margin-top:12px"><div class="progress-fill" style="width:35%"></div></div>'+
        '<div class="flex justify-between" style="font-size:11px;color:var(--g400);margin-top:4px"><span>Helper on the way</span><span>~8 min ETA</span></div>'+
      '</div>'+
      '<div class="map-mock" style="flex:1;min-height:180px">'+
        '<div class="map-pin" style="top:45%;left:50%">📍 You</div>'+
        '<div class="map-pin" style="top:24%;left:34%;animation-delay:.3s">🟢 Sara</div>'+
        '<div style="position:absolute;top:28%;left:38%;width:130px;height:2px;background:rgba(26,111,212,.55);transform:rotate(24deg);transform-origin:left center"></div>'+
        '<div class="map-label" style="bottom:10px;left:10px">🛡️ Live tracking active</div>'+
      '</div>'+
      '<div class="action-bar">'+
        '<button class="call-btn" onclick="alert(\'📞 Calling Sara...\')">📞 Call Sara</button>'+
        '<button class="sos-btn" id="sosBtn" onclick="toggleSOS()">SOS</button>'+
      '</div>'+
      sosAlert+
    '</div>'+
    '<div class="card session-right">'+
      '<div style="padding:16px 20px;border-bottom:1px solid var(--g100)">'+
        '<div style="font-size:15px;font-weight:700;font-family:Sora,sans-serif">Chat with Sara</div>'+
        '<div style="font-size:12px;color:var(--green);margin-top:2px">● Online</div>'+
      '</div>'+
      '<div class="session-chat-body chat-box" id="chatBody">'+msgs+'</div>'+
      '<div class="session-chat-input">'+
        '<input class="form-control" id="chatInput" placeholder="Type a message..." onkeydown="if(event.key===\'Enter\')sendChat()" style="flex:1"/>'+
        '<button class="btn btn-primary btn-sm" onclick="sendChat()">Send ✈</button>'+
      '</div>'+
    '</div>'+
  '</div>';
}

function toggleSOS(){
  state.sosActive = !state.sosActive;
  renderPage('session');
}
function sendChat(){
  var inp = document.getElementById('chatInput');
  if(!inp||!inp.value.trim()) return;
  var now = new Date();
  var time = now.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
  state.chatMessages.push({role:'sent',text:inp.value,time:time});
  inp.value = '';
  renderPage('session');
  var body = document.getElementById('chatBody');
  if(body) body.scrollTop = body.scrollHeight;
}

/* ─────────────────────────────────────────────────────────── */
function renderMyRequests(){
  var rows = mockRequests.map(function(r){
    return '<div class="card p-24 mb-12">'+
      '<div class="flex gap-14" style="align-items:flex-start">'+
        '<div style="width:52px;height:52px;border-radius:14px;background:'+(r.status==='active'?'rgba(26,111,212,.1)':'rgba(56,201,144,.1)')+';display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0">'+r.icon+'</div>'+
        '<div class="flex-1">'+
          '<div class="flex items-center gap-10 fw-wrap mb-8">'+
            '<span style="font-size:16px;font-weight:700;font-family:Sora,sans-serif;color:var(--navy)">'+r.category+'</span>'+
            '<span class="badge '+(r.status==='active'?'badge-blue':'badge-green')+'">'+( r.status==='active'?'● Active':'✓ Done')+'</span>'+
          '</div>'+
          '<div style="font-size:13px;color:var(--g400);margin-bottom:10px">'+r.helper+' • '+r.time+' • 📍 '+r.location+'</div>'+
          '<div class="flex gap-8 fw-wrap">'+
            (r.status==='active'?'<button class="btn btn-primary btn-sm" onclick="navTo(\'session\')">View Session</button>':'')+
            (r.status==='completed'?'<button class="btn-ghost" style="font-size:13px">⭐ Rate Session</button>':'')+
            '<button class="btn-ghost" style="font-size:13px">View Details</button>'+
          '</div>'+
        '</div>'+
        '<div style="font-weight:800;font-size:18px;color:var(--navy);font-family:Sora,sans-serif;flex-shrink:0">'+r.price+' SAR</div>'+
      '</div></div>';
  }).join('');
  return '<div class="page-hdr"><h1 class="page-title">My Requests</h1></div>'+
    '<div class="flex gap-8 fw-wrap mb-20">'+
      ['All','Active','Completed','Cancelled'].map(function(f,i){return'<button class="tag'+(i===0?' active':'')+'" onclick="setActiveTag(this)">'+f+'</button>';}).join('')+
    '</div>'+rows;
}

/* ─────────────────────────────────────────────────────────── */
function renderHelperDashboard(){
  var tog = state.helperOnline;
  var nearbyJobs = tog ? [
    {cat:'Shopping Companion',icon:'🛍️',client:'Nadia M.',dist:'0.9 km',price:45,urgent:true},
    {cat:'Moving Help',       icon:'📦',client:'Khalid A.',dist:'2.1 km',price:90,urgent:false},
    {cat:'City Navigation',   icon:'🗺️',client:'Rami S.', dist:'1.5 km',price:40,urgent:false},
  ] : [];

  var jobsHTML = nearbyJobs.length ? nearbyJobs.map(function(j){
    return '<div class="card p-20 mb-10">'+
      '<div class="flex gap-12 items-center">'+
        '<div style="width:48px;height:48px;border-radius:13px;background:rgba(26,111,212,.1);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0">'+j.icon+'</div>'+
        '<div class="flex-1">'+
          '<div class="flex items-center gap-8 fw-wrap mb-4">'+
            '<span style="font-size:15px;font-weight:700;font-family:Sora,sans-serif">'+j.cat+'</span>'+
            (j.urgent?'<span class="badge badge-amber">⚡ Urgent</span>':'')+
          '</div>'+
          '<div style="font-size:13px;color:var(--g400)">📍 '+j.dist+' • 👤 '+j.client+'</div>'+
        '</div>'+
        '<div class="flex items-center gap-8">'+
          '<span style="font-size:18px;font-weight:800;font-family:Sora,sans-serif;color:var(--navy)">'+j.price+' SAR</span>'+
          '<button class="btn btn-primary btn-sm" onclick="navTo(\'session\')">Accept</button>'+
          '<button class="btn-ghost" style="padding:8px 10px;font-size:13px">✕</button>'+
        '</div>'+
      '</div></div>';
  }).join('') : '<div class="empty-state"><div class="e-icon">🔴</div><p>You\'re offline. Toggle to Available to see requests.</p></div>';

  var barData = [40,65,30,80,55,90,70];
  var days = ['Su','Mo','Tu','We','Th','Fr','Sa'];
  var bars = barData.map(function(v,i){
    return '<div class="bar-wrap"><span style="font-size:10px;color:var(--g400)">'+(v)+'</span>'+
      '<div class="bar'+(i===5?' highlight':'')+'" style="height:'+(v*.95)+'px"></div>'+
      '<span class="bar-label">'+days[i]+'</span></div>';
  }).join('');

  return '<div class="flex justify-between items-center mb-28">'+
    '<div><h1 class="page-title">Omar\'s Dashboard 🤝</h1><p class="page-subtitle">You\'ve completed 212 sessions</p></div>'+
    '<div class="toggle-wrap">'+
      '<span style="font-size:14px;font-weight:600;color:'+(tog?'var(--green)':'var(--g400)')+'">'+( tog?'● Available':'○ Offline')+'</span>'+
      '<button class="toggle '+(tog?'on':'off')+'" id="onlineToggle" onclick="state.helperOnline=!state.helperOnline;renderPage(\'helper-dashboard\')"></button>'+
    '</div></div>'+
    '<div class="stats-grid">'+
      stat('2,340 SAR','This Month','💰','var(--green)')+
      stat('212','Total Sessions','🤝','var(--blue)')+
      stat('4.8 ★','My Rating','⭐','var(--amber)')+
      stat('96%','Response Rate','⚡','var(--teal)')+
    '</div>'+
    '<div class="section-hdr"><div class="section-title">Nearby Requests</div>'+
      '<span class="badge badge-blue">'+(tog?'3 active':'Go online to see requests')+'</span></div>'+
    jobsHTML+
    '<div class="section-hdr" style="margin-top:24px"><div class="section-title">Earnings This Week</div></div>'+
    '<div class="card p-20"><div class="bar-chart">'+bars+'</div></div>';
}

/* ─────────────────────────────────────────────────────────── */
function renderHelperRequests(){
  var jobs = [
    {cat:'Shopping Companion',icon:'🛍️',client:'Nadia M.',  loc:'Al Nuzha Mall',    time:'Now',         budget:45, urgent:true,  desc:'Need someone to accompany me while shopping for home goods. Approx 2 hours.'},
    {cat:'Moving Help',       icon:'📦',client:'Khalid A.', loc:'Riyadh, Block 7',  time:'In 2 hours',  budget:90, urgent:false, desc:'Moving 10–15 boxes from 2nd floor to ground level. Elevator available.'},
    {cat:'City Navigation',   icon:'🗺️',client:'Rami S.',   loc:'Downtown Riyadh',  time:'Tomorrow 10AM',budget:40, urgent:false, desc:'Just arrived in the city. Need 3 hours of guided walking tour around key areas.'},
    {cat:'Emotional Support', icon:'💙',client:'Sara K.',   loc:'King Faisal Hospital',time:'Today 5PM', budget:60, urgent:true,  desc:'Medical appointment, feeling anxious. Need a calming companion presence.'},
  ];
  var html = jobs.map(function(j){
    return '<div class="card p-24 mb-14">'+
      '<div class="flex gap-14" style="align-items:flex-start">'+
        '<div style="width:52px;height:52px;border-radius:14px;background:rgba(26,111,212,.1);display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0">'+j.icon+'</div>'+
        '<div class="flex-1">'+
          '<div class="flex items-center gap-8 fw-wrap mb-6">'+
            '<span style="font-size:16px;font-weight:700;font-family:Sora,sans-serif;color:var(--navy)">'+j.cat+'</span>'+
            (j.urgent?'<span class="badge badge-amber">⚡ Urgent</span>':'')+
          '</div>'+
          '<div style="font-size:13px;color:var(--g400);margin-bottom:8px">📍 '+j.loc+' • 🕐 '+j.time+' • 👤 '+j.client+'</div>'+
          '<p style="font-size:13px;color:var(--g600);line-height:1.55;margin-bottom:12px">'+j.desc+'</p>'+
          '<div class="flex gap-8">'+
            '<button class="btn btn-primary btn-sm" onclick="navTo(\'session\')">✓ Accept Job</button>'+
            '<button class="btn-ghost" style="font-size:13px">✕ Decline</button>'+
          '</div>'+
        '</div>'+
        '<div style="text-align:right;flex-shrink:0"><div style="font-size:22px;font-weight:800;color:var(--navy);font-family:Sora,sans-serif">'+j.budget+'</div><div style="font-size:11px;color:var(--g400)">SAR</div></div>'+
      '</div></div>';
  }).join('');
  return '<div class="page-hdr"><h1 class="page-title">Available Jobs</h1><p class="page-subtitle">Requests near you right now</p></div>'+
    '<div class="flex gap-8 fw-wrap mb-20">'+['All','Shopping','Moving','Navigation','Support'].map(function(f,i){
      return '<button class="tag'+(i===0?' active':'')+'" onclick="setActiveTag(this)">'+f+'</button>';}).join('')+'</div>'+html;
}

/* ─────────────────────────────────────────────────────────── */
function renderEarnings(){
  var barData = [[280,'Mo'],[320,'Tu'],[160,'We'],[420,'Th'],[300,'Fr'],[480,'Sa'],[0,'Su']];
  var bars = barData.map(function(pair,i){
    return '<div class="bar-wrap">'+
      (pair[0]?'<span style="font-size:9px;color:var(--g400)">'+pair[0]+'</span>':'')+
      '<div class="bar'+(i===5?' highlight':'')+'" style="height:'+(pair[0]/480*100)+'px;min-height:4px"></div>'+
      '<span class="bar-label">'+pair[1]+'</span></div>';
  }).join('');

  var payments = [
    {cat:'Shopping Companion',price:45, date:'Today, 3:00 PM',client:'Nadia M.'},
    {cat:'Moving Help',       price:120,date:'Apr 20',         client:'Khalid A.'},
    {cat:'City Navigation',   price:40, date:'Apr 18',         client:'Rami S.'},
  ];
  var pRows = payments.map(function(p){
    return '<div class="flex gap-12 items-center" style="padding:12px 0;border-bottom:1px solid var(--g50)">'+
      '<div style="width:40px;height:40px;border-radius:11px;background:rgba(56,201,144,.1);display:flex;align-items:center;justify-content:center;font-size:18px">💳</div>'+
      '<div class="flex-1"><div style="font-size:14px;font-weight:600;color:var(--navy)">'+p.cat+'</div><div style="font-size:12px;color:var(--g400)">'+p.client+' • '+p.date+'</div></div>'+
      '<span class="badge badge-green">✓ Paid</span>'+
      '<span style="font-size:15px;font-weight:700;color:var(--navy);font-family:Sora,sans-serif">+'+p.price+' SAR</span></div>';
  }).join('');

  return '<div class="page-hdr"><h1 class="page-title">Earnings Overview</h1></div>'+
    '<div class="stats-grid">'+
      stat('2,340 SAR','This Month','💰','var(--green)')+
      stat('18,200 SAR','Total Earned','🏦','var(--blue)')+
      stat('640 SAR','This Week','📅','var(--teal)')+
      stat('180 SAR','Pending','⏳','var(--amber)')+
    '</div>'+
    '<div class="card p-24 mb-20">'+
      '<div class="section-title mb-16">Weekly Earnings</div>'+
      '<div class="bar-chart">'+bars+'</div>'+
    '</div>'+
    '<div class="card p-24">'+
      '<div class="section-title mb-16">Recent Payments</div>'+pRows+'</div>';
}

/* ─────────────────────────────────────────────────────────── */
function renderProfile(){
  var verItems = [
    ['National ID','verified'],['Phone Number','verified'],['Email Address','verified'],
    ['Background Check','pending'],['Face Verification','verified'],
  ];
  var verHTML = verItems.map(function(v){
    return '<div class="flex items-center justify-between" style="padding:9px 0;border-bottom:1px solid var(--g50)">'+
      '<span style="font-size:14px;color:var(--navy);font-weight:500">'+v[0]+'</span>'+
      '<span class="badge '+(v[1]==='verified'?'badge-green':'badge-amber')+'">'+(v[1]==='verified'?'✓ Verified':'⏳ Pending')+'</span></div>';
  }).join('');

  var stars = '';
  for(var i=1;i<=5;i++){
    stars += '<span class="star rating-star'+(i<=(state.ratingGiven||0)?' filled':'')+'" onclick="giveRating('+i+')">★</span>';
  }

  var ratingBlock = state.reviewSent ?
    '<div class="trust-badge p-20 mb-20" style="border-radius:16px"><span style="font-size:20px">🎉</span><span style="font-size:14px;color:#1fa875;font-weight:600">Review submitted! Thank you.</span></div>' :
    '<div class="card p-24 mb-20">'+
      '<div style="font-size:15px;font-weight:700;font-family:Sora,sans-serif;margin-bottom:4px">Rate Your Last Session</div>'+
      '<div style="font-size:13px;color:var(--g400);margin-bottom:14px">with Sara Al-Hamed • Shopping Companion</div>'+
      '<div class="star-rating mb-16" id="starRating">'+stars+'</div>'+
      '<textarea class="form-control" rows="2" placeholder="Share your experience..." style="margin-bottom:12px"></textarea>'+
      '<button class="btn btn-primary btn-sm" onclick="state.reviewSent=true;renderPage(\'profile\')">Submit Review</button>'+
    '</div>';

  var histHTML = mockRequests.map(function(r){
    return '<div class="flex gap-12 items-center" style="padding:11px 0;border-bottom:1px solid var(--g50)">'+
      '<span style="font-size:20px">'+r.icon+'</span>'+
      '<div class="flex-1"><div style="font-size:14px;font-weight:600;color:var(--navy)">'+r.category+'</div><div style="font-size:12px;color:var(--g400)">'+r.time+'</div></div>'+
      '<span class="badge '+(r.status==='active'?'badge-blue':'badge-green')+'">'+( r.status==='active'?'Active':'Done')+'</span>'+
      '<span style="font-size:14px;font-weight:700;color:var(--navy);font-family:Sora,sans-serif">'+r.price+' SAR</span></div>';
  }).join('');

  var u = state.role==='helper' ?
    {name:'Omar Khalid',initials:'OK',color:'linear-gradient(135deg,#38C990,#0BC4A3)',role:'Helper'} :
    {name:'Nadia Al-Mansour',initials:'NA',color:'linear-gradient(135deg,#9B6ACF,#b48fe0)',role:'Requester'};

  return '<div style="max-width:700px;margin:0 auto">'+
    '<div class="card p-32 mb-20">'+
      '<div class="flex gap-20" style="align-items:flex-start">'+
        avatarHTML(u.initials,u.color,'xl',true,null)+
        '<div class="flex-1">'+
          '<div class="flex items-center gap-10 fw-wrap mb-4">'+
            '<h2 style="font-size:22px;font-weight:800;font-family:Sora,sans-serif;color:var(--navy)">'+u.name+'</h2>'+
            '<span class="badge badge-green">✓ Verified</span>'+
          '</div>'+
          '<p style="font-size:14px;color:var(--g400)">'+u.role+' • Member since January 2025</p>'+
          '<div class="flex gap-16" style="margin-top:12px">'+
            '<div><span style="font-size:18px;font-weight:800;color:var(--navy);font-family:Sora,sans-serif">4.9</span><span style="font-size:12px;color:var(--g400)"> rating</span></div>'+
            '<div><span style="font-size:18px;font-weight:800;color:var(--navy);font-family:Sora,sans-serif">127</span><span style="font-size:12px;color:var(--g400)"> reviews</span></div>'+
            '<div><span style="font-size:18px;font-weight:800;color:var(--navy);font-family:Sora,sans-serif">12</span><span style="font-size:12px;color:var(--g400)"> sessions</span></div>'+
          '</div>'+
        '</div>'+
        '<button class="btn-ghost" style="font-size:13px;flex-shrink:0">⚙ Edit Profile</button>'+
      '</div>'+
    '</div>'+
    '<div class="card p-24 mb-20"><div style="font-size:15px;font-weight:700;font-family:Sora,sans-serif;margin-bottom:14px">Verification Status</div>'+verHTML+'</div>'+
    ratingBlock+
    '<div class="card p-24"><div class="section-title mb-14">Session History</div>'+histHTML+'</div>'+
  '</div>';
}

function giveRating(n){
  state.ratingGiven = n;
  var stars = document.querySelectorAll('#starRating .star');
  stars.forEach(function(s,i){ s.classList.toggle('filled', i<n); });
}

/* ─────────────────────────────────────────────────────────── */
function renderSafety(){
  var verItems = [
    {icon:'🪪',title:'National ID Check',   desc:'All helpers submit government-issued ID before going live.',    status:'Active'},
    {icon:'📷',title:'Face Verification',    desc:'Biometric face matching ensures the ID matches the person.',   status:'Active'},
    {icon:'📋',title:'Background Screening', desc:'Criminal background check performed by safety partners.',       status:'Active'},
    {icon:'📞',title:'Phone Verification',   desc:'Real phone number required. No anonymous profiles.',            status:'Active'},
    {icon:'🌟',title:'Ongoing Rating Review',desc:'Helpers below 4.0 rating are automatically suspended.',        status:'Active'},
  ];
  var vRows = verItems.map(function(v){
    return '<div class="flex gap-12" style="align-items:flex-start;margin-bottom:14px">'+
      '<span style="font-size:22px;margin-top:2px">'+v.icon+'</span>'+
      '<div class="flex-1">'+
        '<div style="font-size:14px;font-weight:600;color:var(--navy);font-family:Sora,sans-serif">'+v.title+'</div>'+
        '<div style="font-size:13px;color:var(--g400);margin-top:3px;line-height:1.5">'+v.desc+'</div>'+
      '</div>'+
      '<span class="badge badge-green" style="flex-shrink:0">'+v.status+'</span></div>';
  }).join('');

  var ratings = [
    {range:'4.7–5.0',label:'Gold Helper',   color:'var(--amber)',note:'Top performers, priority listing'},
    {range:'4.0–4.6',label:'Good Standing', color:'var(--green)',note:'Active and trusted helper'},
    {range:'3.0–3.9',label:'Under Review',  color:'var(--amber)',note:'Improvement plan required'},
    {range:'< 3.0',  label:'Suspended',     color:'var(--red)',  note:'Removed from the platform'},
  ];
  var ratHTML = ratings.map(function(r){
    return '<div style="padding:13px;border-radius:11px;background:var(--g50);border:1px solid var(--g100)">'+
      '<div style="font-size:13px;font-weight:700;color:'+r.color+';font-family:Sora,sans-serif;margin-bottom:4px">'+r.range+' — '+r.label+'</div>'+
      '<div style="font-size:12px;color:var(--g400)">'+r.note+'</div></div>';
  }).join('');

  var rules = [
    'Always confirm helper identity before starting a session',
    'Meet in public places for first-time sessions',
    'Keep the Tegy app open during your session for live tracking',
    'Never share personal financial information with helpers',
    'Report any inappropriate behavior immediately via the app',
    'Payments are processed through Tegy only — never pay cash directly',
  ];
  var rulesHTML = rules.map(function(r){
    return '<div class="flex gap-10" style="align-items:flex-start;margin-bottom:10px">'+
      '<span style="color:var(--green);font-weight:700;flex-shrink:0">✓</span>'+
      '<span style="font-size:14px;color:var(--g600);line-height:1.5">'+r+'</span></div>';
  }).join('');

  return '<div style="max-width:720px;margin:0 auto">'+
    '<div class="page-hdr"><h1 class="page-title">🛡️ Trust & Safety</h1><p class="page-subtitle">Your safety is our highest priority</p></div>'+
    '<div class="safety-sos-box">'+
      '<div class="flex gap-16" style="align-items:flex-start">'+
        '<div style="width:56px;height:56px;border-radius:16px;background:rgba(229,62,62,.15);display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0">🚨</div>'+
        '<div>'+
          '<h3 style="font-size:17px;font-weight:700;font-family:Sora,sans-serif;color:var(--red);margin-bottom:8px">Emergency SOS Button</h3>'+
          '<p style="font-size:14px;color:var(--g600);line-height:1.6;margin-bottom:12px">Every live session has a red SOS button. One tap instantly shares your GPS location with your emergency contacts and local authorities. No typing, no delay.</p>'+
          '<div class="flex gap-8 fw-wrap">'+
            '<span class="badge badge-red">GPS Location Sent</span>'+
            '<span class="badge badge-red">Emergency Contacts Notified</span>'+
            '<span class="badge badge-red">Session Recorded</span>'+
          '</div>'+
        '</div>'+
      '</div>'+
    '</div>'+
    '<div class="card p-28 mb-20">'+
      '<h3 style="font-size:17px;font-weight:700;font-family:Sora,sans-serif;margin-bottom:18px">🆔 Helper Verification System</h3>'+vRows+'</div>'+
    '<div class="card p-28 mb-20">'+
      '<h3 style="font-size:17px;font-weight:700;font-family:Sora,sans-serif;margin-bottom:14px">⭐ Rating System</h3>'+
      '<p style="font-size:14px;color:var(--g600);line-height:1.6;margin-bottom:16px">After every session, both parties can rate each other. This two-way accountability creates a trustworthy community.</p>'+
      '<div class="grid-2">'+ratHTML+'</div>'+
    '</div>'+
    '<div class="card p-28">'+
      '<h3 style="font-size:17px;font-weight:700;font-family:Sora,sans-serif;margin-bottom:14px">📜 Safety Guidelines</h3>'+rulesHTML+'</div>'+
  '</div>';
}

/* ── AFTER RENDER HOOKS ────────────────────────────────────── */
function afterRender(pg){
  if(pg==='matching' && state.searching){
    setTimeout(function(){
      state.searching = false;
      renderPage('matching');
    }, 2400);
  }
  if(pg==='session'){
    if(state.sessionInterval) clearInterval(state.sessionInterval);
    var base = 1847;
    state.sessionInterval = setInterval(function(){
      base++;
      var el = document.getElementById('sessionTimer');
      if(el){
        var h=Math.floor(base/3600),m=Math.floor((base%3600)/60),s=base%60;
        el.textContent = pad(h)+':'+pad(m)+':'+pad(s);
      } else { clearInterval(state.sessionInterval); }
    },1000);
    setTimeout(function(){
      var body = document.getElementById('chatBody');
      if(body) body.scrollTop = body.scrollHeight;
    },50);
  }
}
function pad(n){ return String(n).padStart(2,'0'); }

/* ── USE CASE TABS ─────────────────────────────────────────── */
function setUseCase(i){
  document.querySelectorAll('#useTabs .tag').forEach(function(t,j){ t.classList.toggle('active',j===i); });
  document.getElementById('ucIcon').textContent = useCases[i].icon;
  document.getElementById('ucTag').textContent = useCases[i].tag;
  document.getElementById('ucDesc').textContent = useCases[i].desc;
}

/* ── INIT ──────────────────────────────────────────────────── */
showPage('landing');