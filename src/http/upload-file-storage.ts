import axios from "axios";

interface UploadFileToStorageParams {
  file: File;
  onProgress: (sizeInBytes: number) => void;
}

interface uploadFileToStorageOpts {
  signal?: AbortSignal;
}

export async function uploadFileToStorage(
  { file, onProgress }: UploadFileToStorageParams,
  opts?: uploadFileToStorageOpts
) {
  console.log('🚀 Iniciando upload:', { fileName: file.name, fileSize: file.size });
  
  try {
    const data = new FormData();

    data.append("file", file);

    console.log('📤 Enviando requisição para:', "http://localhost:3333/uploads");

    const response = await axios.post<{ url: string }>( 
      "http://localhost:3333/uploads",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        signal: opts?.signal,
        onUploadProgress(progressEvent) {
          console.log('📊 Progresso:', { loaded: progressEvent.loaded, total: progressEvent.total });
          onProgress(progressEvent.loaded);
        },
      }
    );

    console.log('✅ Upload concluído:', response.data);

    return { url: response.data.url };
  } catch (error) {
    console.error('❌ Erro no upload:', error);
    throw error;
  }
}