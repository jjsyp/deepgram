import storage_util

#use storage_util.get_model_storage to get the contents of the files

audio, language, text, tier = storage_util.get_model_storage('asteria')

#convert text back from bytes to string
text = text.decode('utf-8')

print(text)