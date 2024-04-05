from flask import jsonify

class Data:
    def __init__(self, modelName, audio) -> None:
        self.modelName = modelName
        self.audio = audio
        
    def __dict__(self) -> dict[str]:
        return {
            "modelName": self.modelName,
            "audio": self.audio
        }


def get_model():
    model = Data ("Test", "test")
    return jsonify(model.__dict__())