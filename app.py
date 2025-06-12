import cv2
import numpy as np
import os
from flask import Flask, request, render_template, send_file, url_for
from werkzeug.utils import secure_filename
import io
import uuid # ユニークなファイル名生成用

app = Flask(__name__)

# スクリプトファイルがあるディレクトリのパスを取得
script_dir = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(script_dir, 'uploads') # アップロードされた一時ファイル用
PROCESSED_FOLDER = os.path.join(script_dir, 'static', 'processed') # 処理済み画像保存用

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['PROCESSED_FOLDER'] = PROCESSED_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # アップロードサイズ上限 (例: 16MB)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def process_image_for_web(image_stream, threshold_value=200):
    """
    画像データストリームを受け取り、背景を透過処理して、
    処理後の画像データ（バイト列）とMIMEタイプを返す。
    """
    try:
        filestr = image_stream.read()
        npimg = np.frombuffer(filestr, np.uint8)
        img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

        if img is None:
            return None, "エラー: 画像をデコードできませんでした。"

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        _, alpha = cv2.threshold(gray, threshold_value, 255, cv2.THRESH_BINARY_INV)
        b, g, r = cv2.split(img)
        rgba = cv2.merge((b, g, r, alpha))

        is_success, buffer = cv2.imencode(".png", rgba)
        if not is_success:
            return None, "エラー: 画像をPNG形式にエンコードできませんでした。"
        
        return buffer.tobytes(), 'image/png'
    except Exception as e:
        return None, f"画像処理中にエラーが発生しました: {str(e)}"


@app.route('/', methods=['GET', 'POST'])
def index():
    error_message = None
    processed_image_url = None

    if request.method == 'POST':
        if 'file' not in request.files:
            error_message = 'ファイルが選択されていません。'
            return render_template('index.html', error_message=error_message)
        
        file = request.files['file']

        if file.filename == '':
            error_message = 'ファイル名が空です。'
            return render_template('index.html', error_message=error_message)

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename) # 安全なファイル名に
            
            # 画像処理
            processed_image_data, mime_type_or_error = process_image_for_web(file.stream)
            
            if processed_image_data:
                # 処理済み画像を保存してURLを生成
                unique_filename = str(uuid.uuid4()) + '.png'
                processed_image_path = os.path.join(app.config['PROCESSED_FOLDER'], unique_filename)
                with open(processed_image_path, 'wb') as f:
                    f.write(processed_image_data)
                processed_image_url = url_for('static', filename=f'processed/{unique_filename}')
            else:
                error_message = mime_type_or_error # エラーメッセージ
        else:
            error_message = '許可されていないファイル形式です。PNG, JPG, JPEGのみ対応しています。'

    return render_template('index.html', error_message=error_message, processed_image_url=processed_image_url)

if __name__ == '__main__':
    app.run(debug=True)
