from flask import jsonify

class Data:
    def __init__(self, model_name, audio) -> None:
        self.model_name = model_name
        self.audio = audio
        
    def __dict__(self) -> dict[str]:
        return {
            "modelName": self.model_name,
            "audio": self.audio
        }


def get_model():
    model = Data ("Test", "test")
    return jsonify(model.__dict__())