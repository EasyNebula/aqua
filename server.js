const http = require('http');
const url = require('url');

const blacklist = ['evilsite.com', 'maliciousdomain.net']; // Replace with your actual blacklist

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const targetUrl = parsedUrl.query.url;

  if (!targetUrl) {
    res.statusCode = 400;
    res.end('Please provide a URL to proxy.');
    return;
  }

  if (blacklist.includes(new URL(targetUrl).hostname)) {
    res.statusCode = 403;
    res.end('This website is blacklisted.');
    return;
  }

  const options = {
    hostname: new URL(targetUrl).hostname,
    port: 80, // Adjust port if needed (e.g., 443 for HTTPS)
    path: parsedUrl.path,
    method: req.method,
    headers: req.headers,
  };

  const proxyRequest = http.request(options, (proxyRes) => {
    proxyRes.on('data', (chunk) => res.write(chunk));
    proxyRes.on('end', () => res.end());
  });

  req.on('data', (chunk) => proxyRequest.write(chunk));
  req.on('end', () => proxyRequest.end());

  req.on('error', (err) => {
    console.error('Error with request:', err);
    res.statusCode = 500;
    res.end('Error proxying request.');
  });
});

server.listen(3000, () => console.log('Server listening on port 3000'));
