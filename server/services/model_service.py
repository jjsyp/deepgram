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
        
    def get_model_name(self):
        return self.model_name
    
    def get_audio(self):
        return self.audio


def get_model():
    model = Data ("Test", "test")
    return jsonify(model.__dict__())

def receive_model(model_name):
    print("\nYou got me! I'm", model_name, "\n")