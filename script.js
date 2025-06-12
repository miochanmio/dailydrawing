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
      caption: caption,
      date: dateText,
      x: Math.random() * (window.innerWidth - 150),
      y: Math.random() * (window.innerHeight - 180)
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
  img.alt = post.caption;

  const cap = document.createElement('div');
  cap.className = 'caption';
  cap.textContent = post.caption;

  const dateDiv = document.createElement('div');
  dateDiv.className = 'date';
  dateDiv.textContent = post.date;

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.textContent = '削除';
  deleteBtn.onclick = () => {
    posts = posts.filter(p => p.id !== post.id);
    savePosts();
    item.remove();
  };

  item.appendChild(img);
  item.appendChild(cap);
  item.appendChild(dateDiv);
  item.appendChild(deleteBtn);

  gallery.appendChild(item);
}

function savePosts() {
  localStorage.setItem('posts', JSON.stringify(posts));
}
