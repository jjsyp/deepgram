class classStorage(object):
    model: str
    language: str
    tier: str
    text: str
    audiofile: bytes
    tags: list[str]
    score: int
    quantifier: str
    email: str

    def __init__(self, model, language, tier, text, audiofile, tags, score, quantifier, email):
        self.model = model
        self.language = language
        self.tier = tier
        self.text = text
        self.audiofile = audiofile
        self.tags = tags
        self.score = score
        self.quantifier = quantifier
        self.email = email

class User(object):
    email: str
    data: list[classStorage]

    def __init__(self, email, data):
        self.email = email
        self.data = data
