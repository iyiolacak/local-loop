/**
 * Mock API. Replace with real implementations as needed.
 */
export async function submitText(text: string): Promise<void> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (text.toLowerCase().includes("fail")) {
    throw new Error("The server could not process the request.");
  }
}

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return "This is the transcribed text from the audio.";
}
