from flask import session
from models.model_data import ModelData
from utils.storage_util import get_model_storage
#create a new modelData object
def create_model_data(model):
    """
    Creates a new modelData object with the provided data.

    Args:
        model (str): The model name.
        language (str): The language of the text.
        tier (str): The tier of the text.
        text (str): The text to be spoken.
        audiofile (bytes): The audio file.
        email (str): The user's email.

    Returns:
        modelData: A new modelData object.
    """
    
    file_contents = get_model_storage(model)
    language = file_contents['language.txt']
    tier = file_contents['tier.txt']
    text = file_contents['text.txt']
    audiofile = file_contents['audio.mp3'] 
    email = ""
    return ModelData(model, language, tier, text, audiofile, email)

#convert modelData object to dictionary
def model_data_to_dict(model_data):
    """
    Converts a modelData object to a dictionary.

    Args:
        model_data (modelData): The modelData object to convert.

    Returns:
        dict: A dictionary representation of the modelData object.
    """
    
    return model_data.to_dict()

#convert dictionary to modelData object
def model_data_from_dict(data):
    """model, language, tier, text, audiofile, email
    Converts a dictionary to a modelData object.

    Args:
        data (dict): The dictionary to convert.

    Returns:
        modelData: A modelData object created from the dictionary.
    """
    
    return ModelData.from_dict(data)

#retrieve a modelData object from the session by its key
def get_model_data_from_session(key):
    """
    Retrieves a modelData object from the session data dictionary by its key.

    Args:
        key (str): The key to retrieve the modelData object from the session data dictionary.

    Returns:
        modelData: The modelData object retrieved from the session.
    """
    if 'user' in session and 'data' in session['user'] and key in session['user']['data']:
        model_storage_data = session['user']['data'][key]
        return ModelData.from_dict(model_storage_data)
    else:
        return None  # Return None or handle missing key appropriately

#store a modelData object in the session
def store_model_data_in_session(key, model_data_instance):
    """
    Stores a modelData object in the session data dictionary with the provided key.

    Args:
        key (str): The key to store the modelData object in the session data dictionary.
        model_data_instance (ModelData): The modelData object to store in the session.
    """
    # Check if model_data_instance is of ModelData type
    if not isinstance(model_data_instance, ModelData):
        raise ValueError(f"Expected second argument to be a ModelData instance, got {type(model_data_instance)} instead.")

    if 'user' in session:
        session['user']['data'][key] = model_data_instance.to_dict()
        session.modified = True
    #else:
      #  raise ValueError("User data not found in session.")
    

def update_model_data_tags(model, new_tags):
    """
    Updates the tags of a ModelData object in session['user']['data'].

    Args:
        model (str): The model name used as a key to retrieve the ModelData object from the session.
        new_tags (list): The new list of tags to assign to the ModelData object.

    Returns:
        bool: True if successful, False otherwise.
    """
    model_data_instance = get_model_data_from_session(model)
    
    if model_data_instance is not None:
        model_data_instance.tags = new_tags
        store_model_data_in_session(model, model_data_instance)
        session.modified = True  # Indicates to Flask that the session object should be saved
        return True
    else:
        return False
    
