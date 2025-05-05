import chromadb
client = chromadb.HttpClient(host="https://chromadb.doc0.tech/")
print(client.get_version())
