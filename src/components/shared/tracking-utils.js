// Utilities that help track users between website and product.

export const trackingID = () => JSON.parse(localStorage.getItem('ajs_user_id'))
      || JSON.parse(localStorage.getItem('ajs_anonymous_id'))
      || '';

export const loginRedirect = (e) => {
  e.preventDefault();
  window.location.href = `https://work.withpixie.ai/login?tid=${trackingID()}`;
};

export const signupRedirect = (e) => {
  e.preventDefault();
  window.location.href = `https://work.withpixie.ai/signup?tid=${trackingID()}`;
};

export const docsRedirect = (e) => {
  e.preventDefault();
  window.location.href = `https://work.withpixie.ai/docs?tid=${trackingID()}`;
};
