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
            with open(os.path.join(dir_path, filename), 'rb') as fh:
                file_contents[filename] = fh.read()
        return file_contents



#function to take model as the key for the file
def get_model_storage(model):
    storage = FilesystemStorage('localStorage')
    
    file_contents_dict = storage.get_files_in_directory(model)
    
    return file_contents_dict

#function that prints os.path.join(self._root, key)
def print_os_path(model):
    storage = FilesystemStorage('localStorage')
    dir_path = os.path.join(storage._root, model)
    print(dir_path)

