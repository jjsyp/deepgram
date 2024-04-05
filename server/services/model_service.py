from flask import jsonify

class Data:
    def __init__(self, modelName, audio) -> None:
        self.modelName = modelName
        self.audio = audio


def get_model():
    model = Data ("Test", "test")
    return jsonify(model)