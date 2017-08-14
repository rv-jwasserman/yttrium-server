module.exports = ($) => {
  // add routes onto the root (e.g. localhost/get-example)
  $.route('index')
    .append('<get-example>')
    .append('<post-example data-method="post">')
    .append('<html-example>')
    .append('<param-example data-dynamic="name">');

  // add handler to index route
  $.route('index')
    .on('route', (e, req, res) => {
      // it's important to stop propagation of the route event
      // unless you want to trigger the parental route functions
      // which can be useful in middleware situations
      e.stopPropagation();
      return res.end('Index route!');
    });

  // add handler for get example
  // http://localhost:8000/get-example?test=shoot
  $.route('get-example')
    .on('route', (e, req, res) => {
      e.stopPropagation();
      const testParam = $.route('querystring').find('test').text();
      if (!testParam) {
        return res.end('Add a query string parameter of test to this example like /get-example?test=happiness');
      }
      return res.end(`Get params: test is ${testParam}`);
    });

  // add handler for post example
  // this example can only be POSTed to -- it won't respond to other methods
  $.route('post-example')
    .on('route', (e, req, res) => {
      e.stopPropagation();

      // Parse the body
      $.body(req)
        .then((body) => {
          if (!body) {
            return res.end('Send a post body to this example')
          }
          return res.end(`Post body: ${body}`);
        });
    });

  // add handler to html example route
  $.route('html-example')
    .on('route', (e, req, res) => {
      e.stopPropagation();
      // example of sending HTML template
      $('body').html('<h1>This example uses HTML</h1>');
      return res.end($('html').html());
    });

  // this route responds to /param-example/:name
  $.route('param-example')
    .on('route', (e, req, res) => {
      e.stopPropagation();
      const param = $.route('param-example').data('name');
      if (!param) {
        return res.end('Navigate to /param-example/anything to see dynamic routes in action')
      }
      return res.end(`I found a name! ${param}`);
    });
};
