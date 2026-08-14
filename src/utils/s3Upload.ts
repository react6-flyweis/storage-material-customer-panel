import { store } from "@/redux/store";

export async function uploadFileToS3(
  file: File,
  folder: string = "customer-uploads",
  onProgress?: (progress: number) => void
): Promise<string> {
  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
  const token = store.getState().auth.accessToken;

  // Step 1: Get presigned URL
  const presignedResponse = await fetch(`${apiBaseUrl}/api/customer/upload/presigned-url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type || "application/octet-stream",
      folder,
    }),
  });

  if (!presignedResponse.ok) {
    let errorMsg = `Failed to get presigned URL: ${presignedResponse.statusText}`;
    try {
      const errJson = await presignedResponse.json();
      if (errJson?.message) {
        errorMsg = errJson.message;
      }
    } catch {
      // Ignore json parse errors
    }
    throw new Error(errorMsg);
  }

  const responseJson = await presignedResponse.json();
  const payload = responseJson.data || responseJson;
  const uploadUrl = payload.uploadUrl;
  const fileUrl = payload.fileUrl;

  if (!uploadUrl || !fileUrl) {
    throw new Error("Failed to retrieve upload URL from server.");
  }

  // Step 2: Upload the file directly to S3 using XHR for progress tracking
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl, true);
    xhr.setRequestHeader(
      "Content-Type",
      file.type || "application/octet-stream"
    );

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round(
            (event.loaded / event.total) * 100
          );
          onProgress(percentComplete);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        if (onProgress) onProgress(100);
        resolve();
      } else {
        reject(new Error(`S3 upload failed with status ${xhr.status}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error during S3 upload."));
    };

    xhr.send(file);
  });

  // Step 3: Return the fileUrl so it can be saved to the database payload
  return fileUrl;
}
