from flask import Flask

def create_app():
    app = Flask(__name__)

    from app.routes import index
    app.register_blueprint(index.index_bp)

    return app