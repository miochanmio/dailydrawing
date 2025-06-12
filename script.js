const imageInput = document.getElementById('imageInput');
const captionInput = document.getElementById('captionInput');
const uploadBtn = document.getElementById('uploadBtn');
const gallery = document.querySelector('.gallery');

// 日本語の曜日
const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

function getFormattedDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const weekday = weekdays[now.getDay()];
  const hour = now.getHours().toString().padStart(2, '0');
  const minute = now.getMinutes().toString().padStart(2, '0');
  return `${year}/${month}/${day}（${weekday}） ${hour}:${minute}`;
}

function createItem(imgSrc, caption, date) {
  const item = document.createElement('div');
  item.className = 'item';
  item.style.left = `${Math.random() * 80}%`;
  item.style.top = `${Math.random() * 80}%`;

  const img = document.createElement('img');
  img.src = imgSrc;

  const captionEl = document.createElement('div');
  captionEl.className = 'caption';
  captionEl.textContent = caption;

  const dateEl = document.createElement('div');
  dateEl.className = 'date';
  dateEl.textContent = date;

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.textContent = '×';
  deleteBtn.onclick = () => {
    item.remove();
    saveToLocalStorage();
  };

  item.appendChild(img);
  item.appendChild(captionEl);
  item.appendChild(dateEl);
  item.appendChild(deleteBtn);

  addDragFunctionality(item);
  gallery.appendChild(item);
}

uploadBtn.addEventListener('click', () => {
  const file = imageInput.files[0];
  const caption = captionInput.value || '';
  const date = getFormattedDate();

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      createItem(e.target.result, caption, date);
      saveToLocalStorage();
    };
    reader.readAsDataURL(file);
  }

  imageInput.value = '';
  captionInput.value = '';
});

// PC & スマホ両対応のドラッグ機能
function addDragFunctionality(el) {
  let offsetX, offsetY, isDragging = false;

  // マウス操作
  el.addEventListener('mousedown', function (e) {
    isDragging = true;
    offsetX = e.offsetX;
    offsetY = e.offsetY;
    el.style.zIndex = Date.now();
  });

  document.addEventListener('mousemove', function (e) {
    if (isDragging) {
      el.style.left = `${e.pageX - offsetX}px`;
      el.style.top = `${e.pageY - offsetY}px`;
    }
  });

  document.addEventListener('mouseup', function () {
    isDragging = false;
  });

  // タッチ操作
  el.addEventListener('touchstart', function (e) {
    isDragging = true;
    const touch = e.touches[0];
    const rect = el.getBoundingClientRect();
    offsetX = touch.clientX - rect.left;
    offsetY = touch.clientY - rect.top;
    el.style.zIndex = Date.now();
    e.preventDefault();
  }, { passive: false });

  document.addEventListener('touchmove', function (e) {
    if (isDragging) {
      const touch = e.touches[0];
      el.style.left = `${touch.clientX - offsetX}px`;
      el.style.top = `${touch.clientY - offsetY}px`;
      e.preventDefault();
    }
  }, { passive: false });

  document.addEventListener('touchend', function () {
    isDragging = false;
  });
}

// ローカル保存機能
function saveToLocalStorage() {
  const items = document.querySelectorAll('.item');
  const data = Array.from(items).map(item => ({
    img: item.querySelector('img').src,
    caption: item.querySelector('.caption').textContent,
    date: item.querySelector('.date').textContent,
    left: item.style.left,
    top: item.style.top
  }));
  localStorage.setItem('galleryItems', JSON.stringify(data));
}

function loadFromLocalStorage() {
  const data = JSON.parse(localStorage.getItem('galleryItems') || '[]');
  data.forEach(({ img, caption, date, left, top }) => {
    const item = document.createElement('div');
    item.className = 'item';
    item.style.left = left;
    item.style.top = top;

    const imgEl = document.createElement('img');
    imgEl.src = img;

    const captionEl = document.createElement('div');
    captionEl.className = 'caption';
    captionEl.textContent = caption;

    const dateEl = document.createElement('div');
    dateEl.className = 'date';
    dateEl.textContent = date;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '×';
    deleteBtn.onclick = () => {
      item.remove();
      saveToLocalStorage();
    };

    item.appendChild(imgEl);
    item.appendChild(captionEl);
    item.appendChild(dateEl);
    item.appendChild(deleteBtn);

    addDragFunctionality(item);
    gallery.appendChild(item);
  });
}

window.addEventListener('DOMContentLoaded', loadFromLocalStorage);
