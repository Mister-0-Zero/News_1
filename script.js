const put = (id, value) => { document.getElementById(id).textContent = value || ''; };
function localPath(value) {
  return typeof value === 'string' && value.startsWith('assets/') && !value.includes('..') && !/[\\?#]/.test(value) ? value : '';
}
function picture(id, data) {
  const img = document.getElementById(id);
  const src = localPath(data?.src);
  if (src) { img.src = src; img.alt = data.alt || ''; img.hidden = false; }
}
fetch('content.json').then(response => {
  if (!response.ok) throw new Error('Content unavailable');
  return response.json();
}).then(data => {
  document.title = data.title || 'Корпоративная новость';
  document.querySelector('meta[name="description"]').content = data.lead || '';
  for (const key of ['category', 'title', 'lead', 'contact', 'footer']) put(key, data[key]);
  put('action', data.actionLabel);
  for (const key of ['intro', 'prize', 'closing']) {
    put(`${key}-title`, data[key]?.title);
    put(`${key}-text`, data[key]?.text);
  }
  picture('hero-image', data.hero); picture('prize-image', data.prize);
  for (const step of data.steps || []) {
    const card = document.createElement('article'); card.className = 'card';
    for (const [tag, key] of [['h3', 'title'], ['p', 'date'], ['p', 'text']]) {
      const element = document.createElement(tag); element.textContent = step[key] || '';
      if (key === 'date') element.className = 'date'; card.append(element);
    }
    document.getElementById('steps').append(card);
  }
  let hasPresentation = false;
  for (const slide of data.presentation?.slides || []) {
    const src = localPath(slide.src); if (!src) continue;
    const img = document.createElement('img'); img.src = src; img.alt = slide.alt || ''; img.loading = 'lazy';
    document.getElementById('slides').append(img); hasPresentation = true;
  }
  const download = localPath(data.presentation?.download);
  if (download) {
    const link = document.getElementById('deck-download'); link.href = download;
    link.download = ''; link.hidden = false; hasPresentation = true;
  }
  document.getElementById('presentation').hidden = !hasPresentation;
}).catch(() => { document.getElementById('load-error').hidden = false; });
