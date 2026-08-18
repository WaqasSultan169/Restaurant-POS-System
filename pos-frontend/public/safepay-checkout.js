/* Safepay Checkout SDK with Close Button */
(function (w, d) {
  if (w.Safepay) return;
  var Safepay = {
    Checkout: {
      init: function (config) {
        var tracker = config.tracker;
        var env = config.env || config.environment || 'sandbox'; 
        var source = config.source || 'custom';
        
        var baseUrl = env === 'production' 
          ? 'https://checkout.getsafepay.com' 
          : 'https://sandbox.api.getsafepay.com/checkout';

        var checkoutUrl = baseUrl + '?beacon=' + tracker + '&env=' + env + '&source=' + source;

        // Helper to remove overlay safely
        var closeOverlay = function () {
          var el = d.getElementById('safepay-checkout-overlay');
          if (el) {
            d.body.removeChild(el);
          }
          if (typeof config.onDismiss === 'function') {
            config.onDismiss();
          }
        };

        // Remove existing overlay if present
        var existingOverlay = d.getElementById('safepay-checkout-overlay');
        if (existingOverlay) {
          d.body.removeChild(existingOverlay);
        }

        // 1. Create overlay backdrop
        var overlay = d.createElement('div');
        overlay.id = 'safepay-checkout-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
        overlay.style.zIndex = '999999';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';

        // 2. Create Modal Box Container
        var container = d.createElement('div');
        container.style.position = 'relative';
        container.style.width = '100%';
        container.style.maxWidth = '500px';
        container.style.height = '650px';
        container.style.borderRadius = '12px';
        container.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.5)';

        // 3. Create Close Icon Button (✕)
        var closeBtn = d.createElement('button');
        closeBtn.innerHTML = '&#10005;'; // ✕ Symbol
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '-14px';
        closeBtn.style.right = '-14px';
        closeBtn.style.width = '32px';
        closeBtn.style.height = '32px';
        closeBtn.style.borderRadius = '50%';
        closeBtn.style.backgroundColor = '#1f1f1f';
        closeBtn.style.color = '#ffffff';
        closeBtn.style.border = '2px solid #383838';
        closeBtn.style.fontSize = '14px';
        closeBtn.style.fontWeight = 'bold';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.display = 'flex';
        closeBtn.style.justifyContent = 'center';
        closeBtn.style.alignItems = 'center';
        closeBtn.style.zIndex = '1000000';
        closeBtn.style.transition = 'all 0.2s ease';

        // Hover Effect on Close Button
        closeBtn.onmouseover = function () {
          closeBtn.style.backgroundColor = '#ef4444'; // Red background on hover
          closeBtn.style.borderColor = '#ef4444';
        };
        closeBtn.onmouseout = function () {
          closeBtn.style.backgroundColor = '#1f1f1f';
          closeBtn.style.borderColor = '#383838';
        };

        // Click Handler for Close Button
        closeBtn.onclick = function (e) {
          e.stopPropagation();
          closeOverlay();
        };

        // 4. Create iframe
        var iframe = d.createElement('iframe');
        iframe.src = checkoutUrl;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.style.borderRadius = '12px';

        // Assemble Modal elements
        container.appendChild(closeBtn);
        container.appendChild(iframe);
        overlay.appendChild(container);
        d.body.appendChild(overlay);

        // Listen for internal completion/cancel messages from Safepay iframe
        var messageHandler = function (e) {
          if (e.data === 'safepay-close' || (e.data && e.data.action === 'close')) {
            closeOverlay();
            w.removeEventListener('message', messageHandler);
          }
        };
        w.addEventListener('message', messageHandler);
      }
    }
  };
  w.Safepay = Safepay;
})(window, document);