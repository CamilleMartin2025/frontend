import { HttpInterceptorFn } from '@angular/common/http';

export class ServerInterceptor {
  static intercept: HttpInterceptorFn = (req, next) => {
    // Si la requête commence par /api, on lui rajoute l'adresse du backend local
    if (req.url.startsWith('/api')) {
      const baseUrl = 'http://localhost:8080';
      const serverReq = req.clone({ url: `${baseUrl}${req.url}` });
      return next(serverReq);
    }
    return next(req);
  };
}