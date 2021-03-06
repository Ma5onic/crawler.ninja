var assert      = require("assert");
var proxyLoader = require("simple-proxies/lib/proxyfileloader");
var crawler     = require("../index.js");
var testSite    = require("./website/start.js").site;
var _           = require("underscore");

var proxyList = null;

describe('Proxies', function() {

        beforeEach(function(done) {

          var config = proxyLoader.config()
                                  .setProxyFile("./test/proxies.txt")
                                  .setCheckProxies(false)
                                  .setRemoveInvalidProxies(false);

          proxyLoader.loadProxyFile(config, function(error, list) {
              if (error) {
                console.log(error);
                done(error);
              }
              else {
                 proxyList = list;
                 done();
              }

          });


        });

        it('should execute the request with a proxy', function(done) {

            var end = function(){
                done();
            };

            crawler.init({proxyList : proxyList}, end);
            crawler.registerPlugin({
                  error : function (error, result, callback) {
                          assert(_.find(result.proxyList.getProxies(), function(p){ return p.getUrl()=== result.proxy; }));
                          callback();
                  }
            });

            crawler.queue({url : "http://localhost:9999/internal-links.html"});

        });

});
