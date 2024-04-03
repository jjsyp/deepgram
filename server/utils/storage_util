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


# Initialize the FilesystemStorage object with the root directory path
storage = FilesystemStorage('localStorage')

# Get the contents of all files in the 'asteria' directory
file_contents_dict = storage.get_files_in_directory('asteria')

# Assign the contents of each file to a variable
asteria_audio = file_contents_dict['audio.mp3']
asteria_language = file_contents_dict['language.txt']
asteria_text = file_contents_dict['text.txt']
asteria_tier = file_contents_dict['tier.txt']

print(asteria_text)