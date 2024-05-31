"""
storage_util.py
===============
contains a class to handle storage operations on the file system 
and a function to fetch the contents of all text and mp3 files for a specific model from local storage.
"""

import os

class Storage:
    """
    A base class representing a generic Storage.

    ...

    Methods
    -------
    get(key)
        To be implemented in subclass. This method should return data associated with a specified key.

    """
    def get(self, key):
        raise NotImplementedError

class FilesystemStorage(Storage):
    """
    A class to handle storage operations on the file system.

    ...

    Attributes
    ----------
    _root : str
        The base directory for the file system storage.

    Methods
    -------
    get(key)
        Read and return byte data from the file identified by key.

    get_files_in_directory(directory)
        Read all text and mp3 files in a specified directory and return their contents.

    """
    def __init__(self, root):
        self._root = root

    # method to read a single file
    def get(self, key):
        """
        Read data from the file identified by key.

        Parameters
        ----------
        key : str
            The filename or identifier of the file.

        Returns
        -------
        bytes
            The byte data read from the file.
        """
        with open(os.path.join(self._root, key), 'rb') as fh:
            return fh.read()

    # method to read all files in a directory
    def get_files_in_directory(self, directory):
        """
        Read all text and mp3 files in the specified directory and return their contents.

        Parameters
        ----------
        directory : str
            The name or path of the directory.

        Returns
        -------
        dict
            A dictionary mapping filenames to their contents.
        """
        dir_path = os.path.join(self._root, directory)
        file_contents = {}
        for filename in os.listdir(dir_path):
            if filename.endswith('.txt'):      # check if the file is a text file
                with open(os.path.join(dir_path, filename), 'r') as fh:  # open in text mode
                    file_contents[filename] = fh.read()
            elif filename.endswith('.mp3'):    # check if the file is a binary file
                with open(os.path.join(dir_path, filename), 'rb') as fh:  # open in binary mode
                    file_contents[filename] = fh.read()
        return file_contents



#function to take model as the key for the file
def get_model_storage(model):
    """
    Fetch the contents of all text and mp3 files for a specific model from local storage.

    Parameters
    ----------
    model : str
        The name or identifier of the model.

    Returns
    -------
    dict
        A dictionary mapping filenames to their contents.
        
    Development Notes:
    ------------------
    This function is called in the model_data_service.py file to retrieve 
    the contents of all text and mp3 files for a specific model from local storage.
    Ensure future implementations that pull model data from other sources are constructed
    to return the same parameters as this function and as taken by create_model_data()
    in model_data_service.py to ensure compatibility.
    """
    storage = FilesystemStorage('localStorage')
    
    file_contents_dict = storage.get_files_in_directory(model)
    
    return file_contents_dict

