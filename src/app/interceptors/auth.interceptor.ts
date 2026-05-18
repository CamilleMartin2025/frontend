import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Récupérer le token stocké dans le localStorage
  const token = localStorage.getItem('bookhub_token');

  // Si le token existe, on clone la requête pour lui ajouter le header Authorization
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  // Si aucun token n'est trouvé (ex: page de login ou d'inscription), on laisse passer la requête initiale
  return next(req);
};
