const imageInput = document.getElementById('imageInput');
const captionInput = document.getElementById('captionInput');
const uploadBtn = document.getElementById('uploadBtn');
const gallery = document.getElementById('gallery');
const days = ['日', '月', '火', '水', '木', '金', '土'];

let posts = JSON.parse(localStorage.getItem('posts')) || [];
posts.forEach(post => renderPost(post));

uploadBtn.addEventListener('click', () => {
  const file = imageInput.files[0];
  const caption = captionInput.value.trim();
  if (!file) return alert('画像を選択してください');
  if (!caption) return alert('一言コメントを入力してください');

  const reader = new FileReader();
  reader.onload = function(e) {
    const now = new Date();
    const dateText = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} (${days[now.getDay()]}) ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newPost = {
      id: Date.now(),
      image: e.target.result,
      caption,
      date: dateText,
      x: Math.random() * (window.innerWidth - 160),
      y: Math.random() * (window.innerHeight - 200)
    };

    posts.push(newPost);
    savePosts();
    renderPost(newPost);

    imageInput.value = '';
    captionInput.value = '';
  };
  reader.readAsDataURL(file);
});

function renderPost(post) {
  const item = document.createElement('div');
  item.className = 'item';
  item.dataset.id = post.id;
  item.style.left = `${post.x}px`;
  item.style.top = `${post.y}px`;

  const img = document.createElement('img');
  img.src = post.image;

  const caption = document.createElement('div');
  caption.className = 'caption';
  caption.textContent = post.caption;

  const date = document.createElement('div');
  date.className = 'date';
  date.textContent = post.date;

  const delBtn = document.createElement('button');
  delBtn.className = 'delete-btn';
  delBtn.textContent = '×';
  delBtn.onclick = () => {
    posts = posts.filter(p => p.id !== post.id);
    savePosts();
    item.remove();
  };

  item.appendChild(img);
  item.appendChild(caption);
  item.appendChild(date);
  item.appendChild(delBtn);
  gallery.appendChild(item);

  makeDraggable(item, post.id);
}

function savePosts() {
  localStorage.setItem('posts', JSON.stringify(posts));
}

// ドラッグ機能
function makeDraggable(elem, postId) {
  let isDragging = false, offsetX = 0, offsetY = 0;

  elem.addEventListener('mousedown', e => {
    isDragging = true;
    offsetX = e.clientX - elem.offsetLeft;
    offsetY = e.clientY - elem.offsetTop;
    elem.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;
    elem.style.left = `${x}px`;
    elem.style.top = `${y}px`;

    const index = posts.findIndex(p => p.id === postId);
    if (index !== -1) {
      posts[index].x = x;
      posts[index].y = y;
      savePosts();
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    elem.style.cursor = 'grab';
  });
}
