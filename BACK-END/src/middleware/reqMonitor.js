
class ReqMonitor {
    static reqMonitor = (err, req, res, next) => {
        let ip = req.ip
      console.log("Chegou no middleware");
      const requestData = {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        url: req.url,
        method: req.method,
        headers: req.headers,
        queryParameters: req.query,
        requestBody: req.body
      };
  
      if (ip) {
        console.error(err);
        console.log(requestData);
       // res.status(400).json({ error: 'Houve um erro na requisição.' });
      } else {
        console.log(requestData);
       // res.status(201).json(requestData);
       
      }
      return next();
    };
  }
  
  export default ReqMonitor;
  