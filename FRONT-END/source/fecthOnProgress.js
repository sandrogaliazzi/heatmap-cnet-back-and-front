const progressBar = document.querySelector(".progress-bar");
const progress = document.querySelector(".progress");

function calculateDownloadPercentage(contentLength, receivedLength) {
  const percentage = (receivedLength * 100) / contentLength;
  return Math.floor(percentage);
}

function setprogress(percentage) {
  if (percentage === 100) setTimeout(() => hideProgress(), 2000);
  progressBar.style.width = `${percentage}%`;
  progress.style.width = `${percentage}%`;
}

function hideProgress() {
  progress.classList.add("d-none");
}

async function fetchWithDownloadTrack(url) {
  const response = await fetch(url);

  const reader = response.body.getReader();

  const contentLength = response.headers.get('Content-Length');

  let receivedLength = 0;
  const chunks = [];
  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    chunks.push(value);

    receivedLength += value.length;

    setprogress(calculateDownloadPercentage(contentLength, receivedLength));
  }

  const chunksAll = new Uint8Array(receivedLength);
  let position = 0;
  for (let chunk of chunks) {
    chunksAll.set(chunk, position);
    position += chunk.length;
  }

  const result = new TextDecoder("utf-8").decode(chunksAll);

  return JSON.parse(result);
}

export default fetchWithDownloadTrack;