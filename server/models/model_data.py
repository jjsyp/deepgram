import base64


class ModelData(object):
    """
    A class to represent the Model data.

    ...

    Attributes
    ----------
    model : str
        name or ID of the model
    language : str
        language of the model
    tier : str
        tier level for the model
    text : str
        the transcribed text from the model's audio
    audiofile : bytes
        the audio file itself
    tags : list[str]
        labels assigned to the model data
    score : int
        the score or rating given to the model
    quantifier : str
        a string that quantifies or describes the model
    email : str
        the email ID of the user 

    Methods
    -------
    to_dict():
        Converts the ModelData instance to a dictionary.
        
    from_dict(data: dict):
        Creates a ModelData instance from a given dictionary.
    """

    model: str
    language: str
    tier: str
    text: str
    audiofile: bytes
    tags: list[str]
    score: int
    quantifier: str
    email: str

    def __init__(self, model, language, tier, text, audiofile, email, tags=None, score = None, quantifier = None):
        """
        Constructs all necessary attributes for the ModelData object.
        """
        
        self.model = model
        self.language = language
        self.tier = tier
        self.text = text
        self.audiofile = audiofile
        self.email = email
        self.tags = tags if tags is not None else []
        self.score = score if score is not None else 0
        self.quantifier = quantifier if quantifier is not None else ''
        

    def to_dict(self):
        """
        Converts the ModelData instance to a dictionary.

        Returns
        -------
        dict
            a dictionary with the instance attributes as key-value pairs.
        """
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
        """
        Creates a ModelData instance from the given dictionary.

        Parameters
        ----------
        data : dict
            The dictionary containing the model data.

        Returns
        -------
        ModelData
            The ModelData instance created from the dictionary data.
        """
        instance = cls(data['model'], data['language'], data['tier'], data['text'], base64.b64decode(data['audiofile']), data['email'])  # convert string back to bytes
        instance.tags = data['tags']
        instance.score = data['score']
        instance.quantifier = data['quantifier']
        return instance
    
'''For larger files like audio files, a preferable approach would be:
Store the actual MP3 file in a directory on your file system.
Save the path to this file in your modelStorage object or the model_data.
When you need to access the file, extract the path from the session and open the file at that location.

If not using a file system, which is recommended if this application is used by many users, you can use a cloud storage service like Amazon S3 or Google Cloud Storage to store the files.'''