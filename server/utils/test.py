import storage_util

#use storage_util.get_model_storage to get the contents of the files

file_contents_dict = storage_util.get_model_storage('asteria')

audio = file_contents_dict['audio.mp3']
language = file_contents_dict['language.txt']
text = file_contents_dict['text.txt']
tier = file_contents_dict['tier.txt']

#convert text back from bytes to string
text = text.decode('utf-8')

print(text)