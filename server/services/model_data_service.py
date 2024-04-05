from models.model_data import ModelData

#create a new modelData object
def create_model_data(model, language, tier, text, audiofile, email):
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
    """
    Converts a dictionary to a modelData object.

    Args:
        data (dict): The dictionary to convert.

    Returns:
        modelData: A modelData object created from the dictionary.
    """
    
    return ModelData.from_dict(data)
