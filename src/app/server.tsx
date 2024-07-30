"use server";

import { Client } from "@gradio/client";

let isLoading = false;

export async function handleFileUpload(formdata: any) {
  try {
    isLoading = true; // Set loading to true

    // Convert plain object back to File
    const { name, type, content } = formdata;
    const byteString = atob(content.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type });
    const file = new File([blob], name, { type });

    const client = await Client.connect("nity/ransomware-detection-N");

    const result = await client.predict("/predict", {
      file: file,
    });

    const { data } = result;

    return data as [any];
  } finally {
    isLoading = false; // Set loading to false
  }
}
