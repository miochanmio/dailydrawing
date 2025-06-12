const imageInput = document.getElementById('imageInput');
const captionInput = document.getElementById('captionInput');
const uploadBtn = document.getElementById('uploadBtn');
const gallery = document.getElementById('gallery');

uploadBtn.addEventListener('click', () => {
  const file = imageInput.files[0];
  const caption = captionInput.value.trim();

  if (!file) {
    alert('画像を選択してください');
    return;
  }
  if (!caption) {
    alert('一言コメントを入力してください');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const item = document.createElement('div');
    item.className = 'item';

    const img = document.createElement('img');
    img.src = e.target.result;
    img.alt = caption;

    const cap = document.createElement('div');
    cap.className = 'caption';
    cap.textContent = caption;

    item.appendChild(img);
    item.appendChild(cap);

    gallery.appendChild(item);

    imageInput.value = '';
    captionInput.value = '';
  };
  reader.readAsDataURL(file);
});
