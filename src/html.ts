const BRIDGE_HANDLER = `
  async function handleCommand(event) {
    var cmd;
    try {
      cmd = JSON.parse(typeof event.data === 'string' ? event.data : '');
    } catch(e) {
      return;
    }

    if (!cmd || !cmd.type || !cmd.requestId) return;

    var requestId = cmd.requestId;
    try {
      var result;
      switch (cmd.type) {
        case 'getToken':
          result = await AwsWafIntegration.getToken();
          break;
        case 'hasToken':
          result = AwsWafIntegration.hasToken();
          break;
        case 'fetch':
          var resp = await AwsWafIntegration.fetch(cmd.url, cmd.options || {});
          var headers = {};
          if (resp.headers && typeof resp.headers.forEach === 'function') {
            resp.headers.forEach(function(value, key) {
              headers[key] = value;
            });
          }
          result = {
            status: resp.status,
            headers: headers,
            body: await resp.text()
          };
          break;
        default:
          throw new Error('Unknown command: ' + cmd.type);
      }
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'resolve',
        requestId: requestId,
        payload: result
      }));
    } catch (err) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'reject',
        requestId: requestId,
        error: (err && err.message) ? err.message : String(err)
      }));
    }
  }

  window.addEventListener('message', handleCommand);
  document.addEventListener('message', handleCommand);

  window.onerror = function(msg, source, lineno, colno, error) {
    window.ReactNativeWebView.postMessage(JSON.stringify({
      type: 'error',
      error: String(msg)
    }));
  };
`;

const WAF_POLLER = `
  function waitForWaf(retries) {
    if (typeof AwsWafIntegration !== 'undefined') {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ready' }));
      return;
    }
    if (retries <= 0) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'error',
        error: 'challenge.js failed to load after timeout'
      }));
      return;
    }
    setTimeout(function() { waitForWaf(retries - 1); }, 200);
  }
`;

const SCRIPT_LOADER = `
  window.__wafLoadScript = function(url) {
    var script = document.createElement('script');
    script.src = url;
    script.onload = function() { waitForWaf(25); };
    script.onerror = function() {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'error',
        error: 'Failed to load script: ' + url
      }));
    };
    document.head.appendChild(script);
  };
`;

export function generateHtml(): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
<script>
  ${WAF_POLLER}
  ${BRIDGE_HANDLER}
  window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'shell_ready' }));
</script>
</body>
</html>`;
}

export function generateHtmlWithLoader(): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
<script>
  ${WAF_POLLER}
  ${BRIDGE_HANDLER}
  ${SCRIPT_LOADER}
  window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'shell_ready' }));
</script>
</body>
</html>`;
}
