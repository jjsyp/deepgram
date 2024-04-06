import os

class Storage:
    def get(self, key):
        raise NotImplementedError

class FilesystemStorage(Storage):
    def __init__(self, root):
        self._root = root

    # method to read a single file
    def get(self, key):
        with open(os.path.join(self._root, key), 'rb') as fh:
            return fh.read()

    # method to read all files in a directory
    def get_files_in_directory(self, directory):
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
    storage = FilesystemStorage('localStorage')
    
    file_contents_dict = storage.get_files_in_directory(model)
    
    return file_contents_dict

