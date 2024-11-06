#!/usr/bin/env python3
""" Very basic Flask app """
from flask import Flask, render_template
from flask_babel import Babel


class Config:
    """ Babel config class """
    LANGUAGES = ["en", "fr"]
    Babel.default_locale = "en"
    Babel.default_timezone = "UTC"


app = Flask(__name__)
app.config.from_object(Config)
app.url_map.strict_slashes = False
babel = Babel(app)


@app.route('/')
def index():
    """ main directory """
    return render_template('0-index.html')


if __name__ == "__main__":
    app.run(host='0.0.0.0', port='5000')
