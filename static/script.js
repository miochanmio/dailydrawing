const upload = document.getElementById('upload');
const gallery = document.getElementById('gallery');
const removeBgOption = document.getElementById('removeBgOption');

upload.addEventListener('change', async function () {
  const file = this.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("image", file);
  formData.append("remove_bg", removeBgOption.checked ? "1" : "0");

  const response = await fetch("/upload", {
    method: "POST",
    body: formData
  });

  if (response.ok) {
    const blob = await response.blob();
    const imgURL = URL.createObjectURL(blob);
    const img = document.createElement('img');
    img.src = imgURL;
    gallery.innerHTML = "";
    gallery.appendChild(img);
  } else {
    alert("画像のアップロードまたは処理に失敗しました");
  }
});
