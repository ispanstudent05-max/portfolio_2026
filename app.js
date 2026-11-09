(() => {
  'use strict';
  const sections = ['works', 'about', 'resume'];
  const titles = { works: '作品集', about: '關於我', resume: '我的履歷' };
  const panels = {
    works: document.querySelector('#worksPanel'),
    about: document.querySelector('#aboutPanel'),
    resume: document.querySelector('#resumePanel'),
    category: document.querySelector('#categoryPanel'),
  };
  const modal = document.querySelector('#contactModal');
  const contactOpen = document.querySelector('#contactOpen');
  const contactClose = document.querySelector('#contactClose');
  const viewWindow = document.querySelector('#viewWindow');
  const workGrid = document.querySelector('#workGrid');
  const projects = {
    product: {name:'專案設計', en:'PRODUCT / UX DESIGN', items:[['補補｜生活用品補貨提醒','Product Design / Case Study'],['第二個 UX 專案（圖片待補）','UX Research / UI Design']]},
    ui: {name:'介面設計', en:'UI / WEB DESIGN', items:[['聖多 MINI｜甜點專賣店','UI / Web Design'],['更多介面設計（圖片待補）','UI Design']]},
    visual: {name:'平面設計', en:'GRAPHIC / VISUAL DESIGN', items:[['品牌識別精選（圖片待補）','Brand Identity'],['平面設計精選（圖片待補）','Graphic Design']]},
  };
  let current = 'works';
  let previousFocus = null;
  let lockedUntil = 0;
  let touchStartY = null;

  function updateNav() {
    document.querySelectorAll('[data-go]').forEach(button => {
      const isActive = button.dataset.go === current && button.textContent.trim() !== '首頁';
      button.classList.toggle('is-current', isActive);
      if(isActive) button.setAttribute('aria-current','page');
      else button.removeAttribute('aria-current');
    });
    const index = Math.max(0, sections.indexOf(current));
    document.querySelector('#previousLabel').textContent = titles[sections[(index + sections.length - 1) % sections.length]];
    document.querySelector('#nextLabel').textContent = titles[sections[(index + 1) % sections.length]];
    document.querySelector('#stepIndicator').textContent = `${String(index + 1).padStart(2,'0')} / 03`;
  }
  function showPanel(next, instant=false) {
    if (!panels[next] || (next === current && !panels.category.classList.contains('is-active'))) return;
    const previous = panels[current] || panels.works;
    if(!instant) {
      previous.classList.remove('is-active');
      previous.setAttribute('hidden', '');
    }
    Object.entries(panels).forEach(([name,panel]) => {
      if(name !== next) { panel.classList.remove('is-active'); panel.setAttribute('hidden',''); }
    });
    const nextPanel = panels[next];
    nextPanel.removeAttribute('hidden');
    // Force style computation so entrance transition runs after the panel becomes visible.
    void nextPanel.offsetHeight;
    nextPanel.classList.add('is-active');
    current = next;
    updateNav();
  }
  function cycle(direction) {
    if(!modal.hidden) return;
    const now=Date.now();
    if(now < lockedUntil) return;
    lockedUntil = now + 620;
    const index = sections.indexOf(current);
    showPanel(sections[((index < 0 ? 0 : index) + direction + sections.length) % sections.length]);
  }
  function openCategory(key) {
    const data = projects[key];
    if(!data) return;
    document.querySelector('#categoryTitle').textContent = data.name;
    document.querySelector('#categoryEnglish').textContent = data.en;
    document.querySelector('#projectList').replaceChildren(...data.items.map(([name,type]) => {
      const card = document.createElement('article');
      card.className = 'project-card';
      const art = document.createElement('div'); art.className = 'project-card-image'; art.setAttribute('aria-label','作品圖片灰色佔位');
      const label = document.createElement('strong'); label.textContent = name;
      const sub = document.createElement('small'); sub.textContent = type;
      card.append(art,label,sub);
      return card;
    }));
    showPanel('category');
    document.querySelector('#previousLabel').textContent = '返回作品集';
    document.querySelector('#nextLabel').textContent = '返回作品集';
    document.querySelector('#stepIndicator').textContent = 'WORKS';
  }
  document.querySelectorAll('[data-go]').forEach(button => button.addEventListener('click',() => showPanel(button.dataset.go)));
  document.querySelector('#backToWorks').addEventListener('click',()=>showPanel('works'));
  document.querySelector('#prevButton').addEventListener('click',()=>cycle(-1));
  document.querySelector('#nextButton').addEventListener('click',()=>cycle(1));
  document.querySelectorAll('.work-tile').forEach(tile => {
    tile.addEventListener('mouseenter',()=>{workGrid.classList.add('has-hover');tile.classList.add('is-hovered')});
    tile.addEventListener('mouseleave',()=>{tile.classList.remove('is-hovered');if(!workGrid.matches(':hover'))workGrid.classList.remove('has-hover')});
    tile.addEventListener('focus',()=>{workGrid.classList.add('has-hover');tile.classList.add('is-hovered')});
    tile.addEventListener('blur',()=>{tile.classList.remove('is-hovered');if(!workGrid.matches(':hover'))workGrid.classList.remove('has-hover')});
    tile.addEventListener('click',()=>openCategory(tile.dataset.category));
  });
  workGrid.addEventListener('mouseleave',()=>{workGrid.classList.remove('has-hover');document.querySelectorAll('.work-tile').forEach(t=>t.classList.remove('is-hovered'))});
  viewWindow.addEventListener('wheel', event => {
    if(!modal.hidden) return;
    if(current==='category') return; // allow native scrolling in category list
    if(Math.abs(event.deltaY)<9) return;
    event.preventDefault();
    cycle(event.deltaY>0?1:-1);
  }, {passive:false});
  viewWindow.addEventListener('touchstart',e=>{touchStartY=e.touches[0]?.clientY ?? null},{passive:true});
  viewWindow.addEventListener('touchend',e=>{
    if(touchStartY===null||current==='category')return;
    const delta=touchStartY-(e.changedTouches[0]?.clientY??touchStartY);
    touchStartY=null;
    if(Math.abs(delta)>45)cycle(delta>0?1:-1);
  },{passive:true});
  contactOpen.addEventListener('click',()=>{
    previousFocus = document.activeElement;
    modal.hidden=false;
    document.body.style.overflow='hidden';
    contactClose.focus();
  });
  function closeModal() {
    modal.hidden=true;
    document.body.style.overflow='';
    previousFocus?.focus();
  }
  contactClose.addEventListener('click',closeModal);
  modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
  document.addEventListener('keydown',e=>{
    if(!modal.hidden){
      if(e.key==='Escape')closeModal();
      if(e.key==='Tab'){
        const focusable=Array.from(modal.querySelectorAll('button,a[href],input')).filter(el=>!el.disabled);
        if(focusable.length){const first=focusable[0],last=focusable[focusable.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}
      }
      return;
    }
    if(['ArrowUp','ArrowDown','PageUp','PageDown'].includes(e.key) && !['BUTTON','INPUT','TEXTAREA'].includes(document.activeElement?.tagName)) {
      e.preventDefault();cycle(['ArrowUp','PageUp'].includes(e.key)?-1:1);
    }
  });
  updateNav();
})();
