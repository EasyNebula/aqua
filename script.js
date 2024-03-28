const urlInput = document.getElementById('urlInput');
const proxyButton = document.getElementById('proxyButton');
const contentDiv = document.getElementById('content');

proxyButton.addEventListener('click', () => {
  const targetUrl = urlInput.value;
  if (!targetUrl) {
    return;
  }

  fetch('/?url=' + targetUrl)
    .then(response => response.text())
    .then(data => {
      contentDiv.innerHTML = data;
    })
    .catch(error => {
      contentDiv.innerText = 'Error: ' + error.message;
    });
});
