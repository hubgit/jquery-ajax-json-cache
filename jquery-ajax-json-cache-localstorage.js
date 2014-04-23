(function() {
  // handle requests with dataType = 'json'
  $.ajaxTransport('json', function(options){
    // don't try to find cached responses for requests sent from this function
    if (options.localCache === false) {
      return;
    }

    // set here so can be aborted
    var request;

    // generate cache key
    var cacheKey = options.type + ':' + options.url + (options.data || '');

    var storeResponse = function(data, textStatus, jqXHR) {
      var object = {
        status: jqXHR.status,
        textStatus: textStatus,
        data: data,
        headers: jqXHR.getAllResponseHeaders()
      };

      localStorage.setItem(cacheKey, JSON.stringify(object));
    };

    var makeRequest = function(options, completeCallback) {
      options.cache = true;
      options.localCache = false;

      request = $.ajax(options);

      request.then(storeResponse);

      request.then(function(data, textStatus, jqXHR) {
        completeCallback(jqXHR.status, textStatus, { json: data }, jqXHR.getAllResponseHeaders());
      });
    };

    return {
      send: function(headers, completeCallback) {
        var item = localStorage.getItem(cacheKey);

        if (item) {
          // found
          var doc = JSON.parse(item);
          completeCallback(doc.status, doc.textStatus, { json: doc.data }, doc.headers);
        } else {
          // not found; make an actual HTTP request
          makeRequest(options, completeCallback);
        }
      },
      abort: function() {
        if (request) {
          request.abort();
        }
      }
    };
  });
})();