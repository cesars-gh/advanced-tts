'use client';

// Function that returns the base64 data from a url
export async function getBase64FromUrl(url: string) {
  const response = await fetch(url);
  const blob = await response.blob();
  return await blob.text();
}

// Function to play an audio from base64 data or url
export async function playAudio(audioSource: string, isUrl = false) {
  try {
    const audioData = isUrl ? audioSource : `data:audio/mp3;base64,${audioSource}`;
    const audio = new Audio(audioData);
    // wait until audio is finished playing
    await audio.play();
    await new Promise((resolve) => {
      audio.addEventListener('ended', resolve);
    });
  } catch (error) {
    console.error('Error playing audio:', error);
  }
}
