import base64


class modelData(object):
    model: str
    language: str
    tier: str
    text: str
    audiofile: bytes
    tags: list[str]
    score: int
    quantifier: str
    email: str

    def __init__(self, model, language, tier, text, audiofile, email):
        self.model = model
        self.language = language
        self.tier = tier
        self.text = text
        self.audiofile = audiofile
        self.email = email
        self.tags = []
        self.score = 0
        self.quantifier = ""

    def to_dict(self):
        return {
            'model': self.model,
            'language': self.language,
            'tier': self.tier,
            'text': self.text,
            'audiofile': base64.b64encode(self.audiofile).decode(),  # convert bytes to string
            'email': self.email,
            'tags': self.tags,
            'score': self.score,
            'quantifier': self.quantifier,
        }

    @classmethod
    def from_dict(cls, data):
        instance = cls(data['model'], data['language'], data['tier'], data['text'], base64.b64decode(data['audiofile']), data['email'])  # convert string back to bytes
        instance.tags = data['tags']
        instance.score = data['score']
        instance.quantifier = data['quantifier']
        return instance
    
'''For larger files like audio files, a preferable approach would be:
Store the actual MP3 file in a directory on your file system.
Save the path to this file in your modelStorage object or the model_data.
When you need to access the file, extract the path from the session and open the file at that location.'''