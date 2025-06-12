from flask import Flask, request, send_file, render_template
from rembg import remove
from PIL import Image
import io

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/upload", methods=["POST"])
def upload_image():
    image_file = request.files["image"]
    remove_bg = request.form.get("remove_bg") == "1"
    image_bytes = image_file.read()
    result_bytes = remove(image_bytes) if remove_bg else image_bytes

    return send_file(
        io.BytesIO(result_bytes),
        mimetype="image/png",
        as_attachment=False,
        download_name="result.png"
    )

if __name__ == "__main__":
    app.run(debug=True)
